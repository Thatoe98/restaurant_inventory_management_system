'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle } from 'lucide-react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AuditItem = {
  id: string;
  name: string;
  unit: string;
  expected: number;
  actual: number | null;
  reason: string;
};

export function AuditDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const [auditData, setAuditData] = useState<Map<string, AuditItem>>(new Map());

  // Fetch high-value items with stock
  const { data: highValueItems, isLoading } = useQuery({
    queryKey: ['high-value-items'],
    queryFn: async () => {
      // Get high-value items
      const { data: items, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .eq('is_high_value', true)
        .order('name');

      if (itemsError) throw itemsError;
      if (!items) return [];

      // Calculate expected stock for each
      const itemsWithStock = await Promise.all(
        items.map(async (item) => {
          const { data: batches } = await supabase
            .from('batches')
            .select('quantity_remaining')
            .eq('item_id', item.id)
            .gt('quantity_remaining', 0);

          const expected = batches?.reduce(
            (sum, batch) => sum + Number(batch.quantity_remaining),
            0
          ) || 0;

          return {
            id: item.id,
            name: item.name,
            unit: item.unit,
            expected,
          };
        })
      );

      // Initialize audit data
      const initialData = new Map<string, AuditItem>();
      itemsWithStock.forEach((item) => {
        initialData.set(item.id, {
          ...item,
          actual: null,
          reason: '',
        });
      });
      setAuditData(initialData);

      return itemsWithStock;
    },
    enabled: open,
  });

  const auditMutation = useMutation({
    mutationFn: async () => {
      const corrections = Array.from(auditData.values()).filter(
        (item) => item.actual !== null && item.actual !== item.expected
      );

      if (corrections.length === 0) {
        throw new Error('No discrepancies found. Audit complete!');
      }

      // Create audit correction logs and update batches
      for (const correction of corrections) {
        const difference = correction.actual! - correction.expected;

        // Log the audit correction
        const { error: logError } = await supabase
          .from('transaction_logs')
          .insert({
            item_id: correction.id,
            action_type: 'AUDIT_CORRECTION',
            quantity_change: difference,
            notes: `Audit: Expected ${correction.expected}, Found ${correction.actual}. Reason: ${correction.reason || 'Not specified'}`,
          });

        if (logError) throw logError;

        // If there's a discrepancy, we need to adjust the most recent batch
        if (difference !== 0) {
          // Get the most recent batch for this item
          const { data: latestBatch } = await supabase
            .from('batches')
            .select('*')
            .eq('item_id', correction.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (latestBatch) {
            const newQuantity = Number(latestBatch.quantity_remaining) + difference;
            
            if (newQuantity >= 0) {
              // Update existing batch
              const { error: updateError } = await supabase
                .from('batches')
                .update({ quantity_remaining: newQuantity })
                .eq('id', latestBatch.id);

              if (updateError) throw updateError;
            } else {
              // If adjustment would make the batch negative, create a new adjustment batch
              const { error: batchError } = await supabase
                .from('batches')
                .insert({
                  item_id: correction.id,
                  quantity_remaining: Math.abs(difference),
                  expiry_date: null,
                  cost_price: null,
                });

              if (batchError) throw batchError;
            }
          } else if (difference > 0) {
            // No existing batches, create new one if we're adding stock
            const { error: batchError } = await supabase
              .from('batches')
              .insert({
                item_id: correction.id,
                quantity_remaining: difference,
                expiry_date: null,
                cost_price: null,
              });

            if (batchError) throw batchError;
          }
        }
      }

      return corrections;
    },
    onSuccess: (corrections) => {
      queryClient.invalidateQueries({ queryKey: ['items-with-stock'] });
      queryClient.invalidateQueries({ queryKey: ['high-value-items'] });
      alert(`Audit complete! ${corrections.length} discrepancies recorded.`);
      onOpenChange(false);
    },
    onError: (error: Error) => {
      if (error.message.includes('No discrepancies')) {
        alert(error.message);
        onOpenChange(false);
      } else {
        alert(`Error: ${error.message}`);
      }
    },
  });

  const updateAuditItem = (itemId: string, field: 'actual' | 'reason', value: string | number) => {
    setAuditData((prev) => {
      const newData = new Map(prev);
      const item = newData.get(itemId);
      if (item) {
        newData.set(itemId, {
          ...item,
          [field]: field === 'actual' ? (value === '' ? null : Number(value)) : value,
        });
      }
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that items with discrepancies have reasons
    const itemsWithDiscrepancies = Array.from(auditData.values()).filter(
      (item) => item.actual !== null && item.actual !== item.expected
    );

    const missingReasons = itemsWithDiscrepancies.filter(
      (item) => !item.reason.trim()
    );

    if (missingReasons.length > 0) {
      alert('Please provide a reason for all discrepancies.');
      return;
    }

    auditMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto !bg-yellow-50 !border-4 !border-yellow-800">
        <DialogHeader className="!-m-6 !mb-6 !p-6 !bg-gradient-to-r !from-yellow-100 !to-amber-100 !border-b-4 !border-yellow-800">
          <DialogTitle className="!text-3xl !font-bold !text-yellow-900">📋 High-Value Item Audit</DialogTitle>
          <DialogDescription className="!text-lg !text-yellow-900 !font-semibold">
            Perform a physical count of high-value items. Enter actual counts and reasons for any discrepancies.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4 bg-white p-4 rounded-lg shadow-inner border-2 border-yellow-200">
            {isLoading ? (
              <div className="py-12 text-center">
                <p className="text-xl text-yellow-900 font-semibold">Loading items for audit...</p>
              </div>
            ) : highValueItems && highValueItems.length > 0 ? (
              <Table className="text-lg">
                <TableHeader className="bg-yellow-200">
                  <TableRow>
                    <TableHead className="text-lg font-bold text-yellow-900">Item</TableHead>
                    <TableHead className="text-lg font-bold text-yellow-900">Expected</TableHead>
                    <TableHead className="text-lg font-bold text-yellow-900">Actual Count</TableHead>
                    <TableHead className="text-lg font-bold text-yellow-900">Difference</TableHead>
                    <TableHead className="text-lg font-bold text-yellow-900">Reason (if different)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from(auditData.values()).map((item) => {
                    const discrepancy =
                      item.actual !== null ? item.actual - item.expected : null;
                    const hasDiscrepancy = discrepancy !== null && discrepancy !== 0;

                    return (
                      <TableRow key={item.id} className="bg-amber-50 border-b-2 border-yellow-300">
                        <TableCell className="text-lg font-bold text-yellow-900 py-4">{item.name}</TableCell>
                        <TableCell className="text-lg text-yellow-900 py-4">
                          <span className="font-bold">{item.expected}</span> {item.unit}
                        </TableCell>
                        <TableCell className="py-4">
                          <Input
                            type="number"
                            step="0.01"
                            value={item.actual ?? ''}
                            onChange={(e) =>
                              updateAuditItem(item.id, 'actual', e.target.value)
                            }
                            placeholder="Count..."
                            className="w-40 text-lg p-4 bg-white text-yellow-900 border-3 border-yellow-600 focus:border-yellow-800 font-bold"
                            required
                          />
                        </TableCell>
                        <TableCell>
                          {discrepancy !== null && (
                            <span
                              className={
                                hasDiscrepancy
                                  ? 'font-bold text-red-600 flex items-center gap-2 text-xl'
                                  : 'text-green-600 font-bold text-xl'
                              }
                            >
                              {hasDiscrepancy && <AlertCircle className="h-6 w-6" />}
                              {discrepancy > 0 ? '+' : ''}
                              {discrepancy} {item.unit}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          {hasDiscrepancy && (
                            <Input
                              value={item.reason}
                              onChange={(e) =>
                                updateAuditItem(item.id, 'reason', e.target.value)
                              }
                              placeholder="Required for discrepancies"
                              className="min-w-[250px] text-lg p-4 bg-white text-gray-900 border-3 border-red-400 focus:border-purple-600"
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center">
                <p className="text-xl text-yellow-900 font-semibold">
                  No high-value items to audit. Mark items as high-value in Stock In.
                </p>
              </div>
            )}
          </div>

          {highValueItems && highValueItems.length > 0 && (
            <DialogFooter className="bg-gradient-to-r from-yellow-100 to-amber-100 -mx-6 -mb-6 px-6 pb-6 pt-6 border-t-4 border-yellow-800 rounded-b-lg">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="text-xl px-8 py-6 border-3 border-yellow-800 bg-white text-yellow-900 hover:bg-yellow-50 font-bold shadow-md"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={auditMutation.isPending}
                className="text-xl px-10 py-6 bg-yellow-700 hover:bg-yellow-800 text-white disabled:bg-gray-300 disabled:text-gray-500 font-bold shadow-lg"
              >
                {auditMutation.isPending ? 'Submitting...' : 'Submit Audit'}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
