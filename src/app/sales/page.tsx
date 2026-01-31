'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Plus } from 'lucide-react';
import Link from 'next/link';

export default function SalesPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Auto-detect available date range
  const { data: dataRange } = useQuery({
    queryKey: ['sales-date-range'],
    queryFn: async () => {
      const { data: first } = await supabase
        .from('daily_summaries')
        .select('date')
        .order('date', { ascending: true })
        .limit(1);
      
      const { data: last } = await supabase
        .from('daily_summaries')
        .select('date')
        .order('date', { ascending: false })
        .limit(1);
      
      return {
        minDate: first?.[0]?.date || '',
        maxDate: last?.[0]?.date || ''
      };
    },
  });

  // Set dates when data range is detected
  if (dataRange && !startDate && dataRange.minDate) {
    setStartDate(dataRange.minDate);
    setEndDate(dataRange.maxDate);
  }

  const { data: dailySales, isLoading } = useQuery({
    queryKey: ['daily-sales', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_summaries')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: topItems } = useQuery({
    queryKey: ['top-items', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_item_sales')
        .select(`
          item_id,
          quantity_sold,
          sales_amount,
          gross_profit,
          menu_items (name, section, menu_type)
        `)
        .gte('date', startDate)
        .lte('date', endDate);
      
      if (error) throw error;

      // Aggregate by item
      const itemMap = new Map();
      data.forEach((sale: any) => {
        const key = sale.item_id;
        if (!itemMap.has(key)) {
          itemMap.set(key, {
            item_id: key,
            name: sale.menu_items?.name || 'Unknown',
            section: sale.menu_items?.section || '',
            menu_type: sale.menu_items?.menu_type || '',
            total_quantity: 0,
            total_sales: 0,
            total_profit: 0
          });
        }
        const item = itemMap.get(key);
        item.total_quantity += sale.quantity_sold || 0;
        item.total_sales += sale.sales_amount || 0;
        item.total_profit += sale.gross_profit || 0;
      });

      return Array.from(itemMap.values())
        .sort((a, b) => b.total_sales - a.total_sales)
        .slice(0, 20);
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  const totalSales = dailySales?.reduce((sum, day) => sum + (day.net_sales || 0), 0) || 0;
  const totalProfit = dailySales?.reduce((sum, day) => sum + (day.operating_profit || 0), 0) || 0;
  const totalCovers = dailySales?.reduce((sum, day) => sum + (day.covers || 0), 0) || 0;
  const operatingDays = dailySales?.filter(day => day.is_open).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Sales Analytics</h1>
            <p className="text-muted-foreground">
              Detailed sales reports and performance metrics
            </p>
          </div>
          <Link href="/sales/entry">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Daily Sales
            </Button>
          </Link>
        </div>

        {/* Date Range Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-900">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(totalSales)}
              </div>
              <p className="text-xs text-green-700">MMK</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-900">Operating Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {formatCurrency(totalProfit)}
              </div>
              <p className="text-xs text-blue-700">MMK</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-900">Total Covers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {formatCurrency(totalCovers)}
              </div>
              <p className="text-xs text-purple-700">customers</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-orange-900">Profit Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-orange-700">{operatingDays} operating days</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
            <CardDescription>Best performing menu items in selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead className="text-right">Qty Sold</TableHead>
                  <TableHead className="text-right">Sales (MMK)</TableHead>
                  <TableHead className="text-right">Profit (MMK)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topItems?.map((item, index) => (
                  <TableRow key={item.item_id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.menu_type}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{item.section}</TableCell>
                    <TableCell className="text-right font-medium">
                      {item.total_quantity}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(item.total_sales)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {formatCurrency(item.total_profit)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Daily Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales</CardTitle>
            <CardDescription>Day-by-day performance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-slate-500">Loading sales data...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Covers</TableHead>
                    <TableHead className="text-right">Sales (MMK)</TableHead>
                    <TableHead className="text-right">Profit (MMK)</TableHead>
                    <TableHead className="text-right">Margin %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailySales?.map((day) => (
                    <TableRow key={day.date}>
                      <TableCell className="font-medium">
                        {new Date(day.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>{day.day_of_week}</TableCell>
                      <TableCell>
                        {day.is_open ? (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            Open
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                            Closed
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{day.covers}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(day.net_sales)}
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${
                        day.operating_profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {day.operating_profit >= 0 ? (
                          <TrendingUp className="inline h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="inline h-4 w-4 mr-1" />
                        )}
                        {formatCurrency(day.operating_profit)}
                      </TableCell>
                      <TableCell className="text-right">
                        {day.net_sales > 0 
                          ? ((day.operating_profit / day.net_sales) * 100).toFixed(1)
                          : 0}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
