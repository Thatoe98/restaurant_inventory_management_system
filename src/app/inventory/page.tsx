'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { differenceInDays, parseISO } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, ClipboardCheck, AlertTriangle, Clock, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { StockInDialog } from '@/components/stock-in-dialog';
import { StockOutDialog } from '@/components/stock-out-dialog';
import { AuditDialog } from '@/components/audit-dialog';
import Link from 'next/link';
import { ItemWithStock } from '@/lib/database.types';

export default function InventoryPage() {
  const [stockInOpen, setStockInOpen] = useState(false);
  const [stockOutOpen, setStockOutOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Fetch all items with computed stock
  const { data: items, isLoading } = useQuery({
    queryKey: ['items-with-stock'],
    queryFn: async () => {
      // First, get all items
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .order('name');

      if (itemsError) throw itemsError;
      if (!itemsData) return [];

      // Then, for each item, compute total stock and nearest expiry
      const itemsWithStock: ItemWithStock[] = await Promise.all(
        itemsData.map(async (item) => {
          const { data: batches } = await supabase
            .from('batches')
            .select('quantity_remaining, expiry_date')
            .eq('item_id', item.id)
            .gt('quantity_remaining', 0);

          const total_stock = batches?.reduce(
            (sum, batch) => sum + Number(batch.quantity_remaining),
            0
          ) || 0;

          // Find nearest expiry date
          const validExpiryDates = batches
            ?.filter((b) => b.expiry_date)
            .map((b) => b.expiry_date!) || [];
          
          const nearest_expiry = validExpiryDates.length > 0
            ? validExpiryDates.sort()[0]
            : null;

          // Check if expiring soon (within 7 days)
          const has_expiring_soon = nearest_expiry
            ? differenceInDays(parseISO(nearest_expiry), new Date()) <= 7
            : false;

          const has_low_stock = total_stock < item.min_stock_threshold;

          return {
            ...item,
            total_stock,
            nearest_expiry,
            has_low_stock,
            has_expiring_soon,
          };
        })
      );

      return itemsWithStock;
    },
  });

  const handleStockOut = (itemId: string) => {
    setSelectedItemId(itemId);
    setStockOutOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              Legacy Inventory
            </h1>
            <p className="text-muted-foreground">
              Monitor stock levels, expiry dates, and manage inventory
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="lg" onClick={() => setStockInOpen(true)}>
              <Plus className="mr-2 h-5 w-5" />
              Stock In
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setAuditOpen(true)}
            >
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Audit
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{items?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Stock Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-destructive">
                  {items?.filter((item) => item.has_low_stock).length || 0}
                </div>
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Expiring Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-orange-600">
                  {items?.filter((item) => item.has_expiring_soon).length || 0}
                </div>
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading inventory...
              </div>
            ) : items && items.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nearest Expiry</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.name}
                        {item.is_high_value && (
                          <span className="ml-2 rounded bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                            High Value
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <span
                          className={
                            item.has_low_stock
                              ? 'font-bold text-destructive'
                              : ''
                          }
                        >
                          {item.total_stock}
                        </span>
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>
                        {item.has_low_stock && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                            <AlertTriangle className="h-3 w-3" />
                            Low Stock
                          </span>
                        )}
                        {item.has_expiring_soon && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                            <Clock className="h-3 w-3" />
                            Expiring Soon
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.nearest_expiry || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStockOut(item.id)}
                        >
                          <Minus className="h-4 w-4" />
                          Use
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  No items in inventory. Add your first item using Stock In.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <StockInDialog open={stockInOpen} onOpenChange={setStockInOpen} />
      <StockOutDialog
        open={stockOutOpen}
        onOpenChange={setStockOutOpen}
        itemId={selectedItemId}
      />
      <AuditDialog open={auditOpen} onOpenChange={setAuditOpen} />
    </div>
  );
}
