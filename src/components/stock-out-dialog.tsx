'use client';

import { useState, useEffect } from 'react';
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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string | null;
};

export function StockOutDialog({ open, onOpenChange, itemId }: Props) {
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch item details
  const { data: item } = useQuery({
    queryKey: ['item', itemId],
    queryFn: async () => {
      if (!itemId) return null;
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .single();
      if (error) throw error;
      return data || null;
    },
    enabled: !!itemId && open,
  });

  // Fetch batches for FIFO
  const { data: batches } = useQuery({
    queryKey: ['batches', itemId],
    queryFn: async () => {
      if (!itemId) return [];
      const { data, error } = await supabase
        .from('batches')
        .select('*')
        .eq('item_id', itemId)
        .gt('quantity_remaining', 0)
        .order('created_at', { ascending: true }); // FIFO: oldest first
      if (error) throw error;
      return data || [];
    },
    enabled: !!itemId && open,
  });

  const stockOutMutation = useMutation({
    mutationFn: async () => {
      if (!itemId || !batches) throw new Error('Invalid data');

      let remainingToDeduct = parseFloat(quantity);
      const updates: Array<{ id: string; newQuantity: number }> = [];

      // FIFO Logic: Deduct from oldest batches first
      for (const batch of batches) {
        if (remainingToDeduct <= 0) break;

        const currentQty = Number(batch.quantity_remaining);
        const deductFromThisBatch = Math.min(currentQty, remainingToDeduct);
        const newQuantity = currentQty - deductFromThisBatch;

        updates.push({ id: batch.id, newQuantity });
        remainingToDeduct -= deductFromThisBatch;
      }

      if (remainingToDeduct > 0) {
        throw new Error('Insufficient stock available');
      }

      // Update all batches
      for (const update of updates) {
        const { error } = await supabase
          .from('batches')
          .update({ quantity_remaining: update.newQuantity })
          .eq('id', update.id);
        if (error) throw error;
      }

      // Create transaction log
      const { error: logError } = await supabase.from('transaction_logs').insert({
        item_id: itemId,
        action_type: 'USAGE',
        quantity_change: -parseFloat(quantity),
        notes: notes || 'Stock used in operations',
      });

      if (logError) throw logError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items-with-stock'] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      resetForm();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const resetForm = () => {
    setQuantity('');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    stockOutMutation.mutate();
  };

  const totalAvailable = batches?.reduce(
    (sum, b) => sum + Number(b.quantity_remaining),
    0
  ) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl !bg-red-50 !border-4 !border-red-800">
        <DialogHeader className="!-m-6 !mb-6 !p-6 !bg-gradient-to-r !from-red-100 !to-rose-100 !border-b-4 !border-red-800">
          <DialogTitle className="!text-3xl !font-bold !text-red-900">🍽️ Use Stock</DialogTitle>
          <DialogDescription className="!text-lg !text-red-800 !font-semibold">
            Record stock usage with automatic FIFO (oldest first)
          </DialogDescription>
        </DialogHeader>
        {item && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6 py-4 !bg-white !p-6 rounded-lg shadow-inner !border-2 !border-red-200">
              <div className="space-y-3">
                <Label className="!text-xl !font-bold !text-red-900">Item</Label>
                <div className="rounded-xl !border-3 !border-green-600 p-5 !bg-green-50">
                  <p className="!text-2xl !font-bold !text-amber-900">{item.name}</p>
                  <p className="text-lg text-gray-700 mt-2">
                    Available: <span className="font-bold text-green-600">{totalAvailable} {item.unit}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="quantity-out" className="text-xl font-bold text-gray-900">Quantity to Use</Label>
                <Input
                  id="quantity-out"
                  type="number"
                  step="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  max={totalAvailable}
                  required
                  className="text-2xl p-6 bg-white text-gray-900 border-3 border-gray-400 focus:border-orange-600"
                />
                <p className="text-lg text-gray-700">
                  Maximum: <span className="font-bold">{totalAvailable} {item.unit}</span>
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes-out" className="text-xl font-bold text-gray-900">Notes (Optional)</Label>
                <Input
                  id="notes-out"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Used for dinner service"
                  className="text-lg p-5 bg-white text-gray-900 border-3 border-gray-400 focus:border-orange-600"
                />
              </div>
            </div>

            <DialogFooter className="bg-gradient-to-r from-red-100 to-rose-100 -mx-6 -mb-6 px-6 pb-6 pt-6 border-t-4 border-red-800 rounded-b-lg">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="text-xl px-8 py-6 border-3 border-red-800 bg-white text-red-900 hover:bg-red-50 font-bold shadow-md"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={stockOutMutation.isPending}
                className="text-xl px-10 py-6 bg-red-700 hover:bg-red-800 text-white disabled:bg-gray-300 disabled:text-gray-500 font-bold shadow-lg"
              >
                {stockOutMutation.isPending ? 'Processing...' : 'Use Stock'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
