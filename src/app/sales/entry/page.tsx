'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2, Save, Calendar, Upload, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

interface SaleEntry {
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
}

export default function SalesEntryPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [entries, setEntries] = useState<SaleEntry[]>([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [csvImportStatus, setCsvImportStatus] = useState<string>('');

  // Load menu items for dropdown
  const { data: menuItems } = useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_active', true)
        .order('section')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Check for existing entries on selected date
  const { data: existingSales, isLoading: loadingExisting } = useQuery({
    queryKey: ['daily-sales', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_item_sales')
        .select(`
          *,
          menu_items (name, unit_price, unit_cost)
        `)
        .eq('date', date);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Load existing entries when date changes
  useEffect(() => {
    if (existingSales && existingSales.length > 0) {
      setEntries(
        existingSales.map((sale: { menu_item_id: string; qty_sold: number; menu_items: { name: string; unit_price: number; unit_cost: number } }) => ({
          menu_item_id: sale.menu_item_id,
          menu_item_name: sale.menu_items?.name || 'Unknown',
          quantity: sale.qty_sold,
          unit_price: sale.menu_items?.unit_price || 0,
          unit_cost: sale.menu_items?.unit_cost || 0,
        }))
      );
    } else {
      setEntries([]);
    }
  }, [existingSales]);

  const addEntry = () => {
    if (!selectedItemId) return;
    
    const menuItem = menuItems?.find(item => item.id === selectedItemId);
    if (!menuItem) return;

    // Check if already added
    if (entries.some(e => e.menu_item_id === selectedItemId)) {
      alert('This item is already in the list. Edit the quantity instead.');
      return;
    }

    setEntries([
      ...entries,
      {
        menu_item_id: menuItem.id,
        menu_item_name: menuItem.name,
        quantity: 1,
        unit_price: menuItem.unit_price,
        unit_cost: menuItem.unit_cost,
      },
    ]);
    setSelectedItemId('');
  };

  const updateQuantity = (index: number, quantity: number) => {
    const updated = [...entries];
    updated[index].quantity = Math.max(0, quantity);
    setEntries(updated);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  // CSV Import Handler
  const handleCsvImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvImportStatus('Reading CSV...');
    
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      setCsvImportStatus('Error: CSV file is empty or has no data rows');
      return;
    }

    // Parse header
    const header = lines[0].toLowerCase();
    const hasItemId = header.includes('item_id') || header.includes('menu_item_id');
    const hasItemName = header.includes('item_name') || header.includes('name') || header.includes('menu_item');
    const hasQuantity = header.includes('quantity') || header.includes('qty') || header.includes('qty_sold');

    if (!hasQuantity) {
      setCsvImportStatus('Error: CSV must have a quantity/qty/qty_sold column');
      return;
    }

    if (!hasItemId && !hasItemName) {
      setCsvImportStatus('Error: CSV must have item_id/menu_item_id or item_name/name column');
      return;
    }

    // Parse CSV rows
    const parseCSVRow = (row: string): string[] => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values;
    };

    const headerCols = parseCSVRow(lines[0]).map(h => h.toLowerCase().replace(/"/g, ''));
    
    // Find column indices
    const itemIdIdx = headerCols.findIndex(h => h === 'item_id' || h === 'menu_item_id');
    const itemNameIdx = headerCols.findIndex(h => h === 'item_name' || h === 'name' || h === 'menu_item');
    const qtyIdx = headerCols.findIndex(h => h === 'quantity' || h === 'qty' || h === 'qty_sold');
    const dateIdx = headerCols.findIndex(h => h === 'date');

    const newEntries: SaleEntry[] = [];
    const errors: string[] = [];
    let importedDate = date;

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVRow(lines[i]);
      if (values.length < 2) continue;

      // Get date from CSV if present (use first row's date)
      if (dateIdx >= 0 && i === 1 && values[dateIdx]) {
        importedDate = values[dateIdx].replace(/"/g, '');
        setDate(importedDate);
      }

      const quantity = parseInt(values[qtyIdx]?.replace(/"/g, '') || '0');
      if (quantity <= 0) continue;

      // Find menu item by ID or name
      let menuItem = null;
      
      if (itemIdIdx >= 0 && values[itemIdIdx]) {
        const itemId = values[itemIdIdx].replace(/"/g, '');
        menuItem = menuItems?.find(m => m.id === itemId);
      }
      
      if (!menuItem && itemNameIdx >= 0 && values[itemNameIdx]) {
        const itemName = values[itemNameIdx].replace(/"/g, '').toLowerCase();
        menuItem = menuItems?.find(m => m.name.toLowerCase() === itemName);
        
        // Try partial match if exact match fails
        if (!menuItem) {
          menuItem = menuItems?.find(m => 
            m.name.toLowerCase().includes(itemName) || 
            itemName.includes(m.name.toLowerCase())
          );
        }
      }

      if (menuItem) {
        // Check if already in entries
        const existingIdx = newEntries.findIndex(e => e.menu_item_id === menuItem.id);
        if (existingIdx >= 0) {
          newEntries[existingIdx].quantity += quantity;
        } else {
          newEntries.push({
            menu_item_id: menuItem.id,
            menu_item_name: menuItem.name,
            quantity,
            unit_price: menuItem.unit_price,
            unit_cost: menuItem.unit_cost,
          });
        }
      } else {
        errors.push(`Row ${i + 1}: Could not find menu item`);
      }
    }

    if (newEntries.length > 0) {
      setEntries(newEntries);
      setCsvImportStatus(`✅ Imported ${newEntries.length} items${errors.length > 0 ? ` (${errors.length} errors)` : ''}`);
    } else {
      setCsvImportStatus(`Error: No valid items found. ${errors.slice(0, 3).join(', ')}`);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      // First, delete existing entries for this date
      await supabase
        .from('daily_item_sales')
        .delete()
        .eq('date', date);

      // Insert new entries
      const salesData = entries
        .filter(e => e.quantity > 0)
        .map(e => ({
          date,
          menu_item_id: e.menu_item_id,
          qty_sold: e.quantity,
          line_revenue: e.quantity * e.unit_price,
          line_cost: e.quantity * e.unit_cost,
          line_gp: e.quantity * (e.unit_price - e.unit_cost),
        }));

      if (salesData.length > 0) {
        const { error } = await supabase
          .from('daily_item_sales')
          .insert(salesData);
        
        if (error) throw error;
      }

      // Update or create daily summary
      const totalRevenue = salesData.reduce((sum, s) => sum + s.line_revenue, 0);
      const totalCost = salesData.reduce((sum, s) => sum + s.line_cost, 0);
      const totalGP = salesData.reduce((sum, s) => sum + s.line_gp, 0);

      const { error: summaryError } = await supabase
        .from('daily_summaries')
        .upsert({
          date,
          total_revenue: totalRevenue,
          food_revenue: salesData.filter(s => {
            const item = menuItems?.find(m => m.id === s.menu_item_id);
            return item?.menu_type === 'Food';
          }).reduce((sum, s) => sum + s.line_revenue, 0),
          drink_revenue: salesData.filter(s => {
            const item = menuItems?.find(m => m.id === s.menu_item_id);
            return item?.menu_type === 'Drink';
          }).reduce((sum, s) => sum + s.line_revenue, 0),
          total_cost: totalCost,
          gross_profit: totalGP,
          operating_expenses: 0,
          net_profit: totalGP,
        }, { onConflict: 'date' });

      if (summaryError) throw summaryError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-sales'] });
      queryClient.invalidateQueries({ queryKey: ['daily-summaries'] });
      alert('Sales saved successfully!');
    },
    onError: (error) => {
      alert('Error saving sales: ' + error.message);
    },
  });

  const totalRevenue = entries.reduce((sum, e) => sum + e.quantity * e.unit_price, 0);
  const totalCost = entries.reduce((sum, e) => sum + e.quantity * e.unit_cost, 0);
  const totalGP = totalRevenue - totalCost;
  const totalItems = entries.reduce((sum, e) => sum + e.quantity, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/sales">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sales
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Daily Sales Entry</h1>
            <p className="text-muted-foreground">
              Record daily sales for your restaurant
            </p>
          </div>
        </div>

        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-48"
              />
              {loadingExisting && (
                <span className="text-sm text-slate-500">Loading existing data...</span>
              )}
              {existingSales && existingSales.length > 0 && (
                <span className="text-sm text-amber-600">
                  ⚠️ {existingSales.length} items found for this date. Editing will replace them.
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Item */}
        <Card>
          <CardHeader>
            <CardTitle>Add Items Sold</CardTitle>
            <CardDescription>
              Select menu items and enter quantities sold, or import from CSV
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="flex-1 h-10 px-3 border rounded-md bg-white"
              >
                <option value="">Select a menu item...</option>
                {menuItems?.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.section}) - {formatCurrency(item.unit_price)} MMK
                  </option>
                ))}
              </select>
              <Button onClick={addEntry} disabled={!selectedItemId}>
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>

            {/* CSV Import Section */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Import from CSV
                  </Label>
                  <p className="text-xs text-slate-500 mb-2">
                    CSV should have columns: item_id or item_name, quantity (qty/qty_sold), optionally date
                  </p>
                  <div className="flex gap-2">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleCsvImport}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              {csvImportStatus && (
                <p className={`mt-2 text-sm ${csvImportStatus.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
                  {csvImportStatus}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sales Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Items ({entries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                No items added yet. Select menu items above to record sales.
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry, index) => (
                  <div
                    key={entry.menu_item_id}
                    className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{entry.menu_item_name}</p>
                      <p className="text-sm text-slate-500">
                        {formatCurrency(entry.unit_price)} MMK each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Qty:</Label>
                      <Input
                        type="number"
                        value={entry.quantity}
                        onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 0)}
                        className="w-20 text-center"
                        min="0"
                      />
                    </div>
                    <div className="w-32 text-right">
                      <p className="font-semibold">
                        {formatCurrency(entry.quantity * entry.unit_price)} MMK
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEntry(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary & Save */}
        {entries.length > 0 && (
          <Card className="bg-slate-900 text-white">
            <CardContent className="py-6">
              <div className="grid grid-cols-4 gap-4 text-center mb-6">
                <div>
                  <p className="text-sm text-slate-400">Items Sold</p>
                  <p className="text-2xl font-bold">{totalItems}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalRevenue)} MMK</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Cost</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalCost)} MMK</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Gross Profit</p>
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(totalGP)} MMK</p>
                </div>
              </div>
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Save className="mr-2 h-5 w-5" />
                {saveMutation.isPending ? 'Saving...' : 'Save Daily Sales'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
