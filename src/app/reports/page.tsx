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
import { ArrowLeft, FileText, Download } from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Auto-detect available date range
  const { data: dataRange } = useQuery({
    queryKey: ['reports-date-range'],
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

  const { data: cashbook } = useQuery({
    queryKey: ['cashbook', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cashbook_transactions')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: plSummary } = useQuery({
    queryKey: ['pl-summary', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_summaries')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .eq('is_open', true);
      
      if (error) throw error;

      const totals = {
        net_sales: 0,
        cogs: 0,
        gross_profit: 0,
        rent: 0,
        salaries: 0,
        utilities: 0,
        marketing: 0,
        maintenance: 0,
        consumables: 0,
        card_fees: 0,
        bank_charges: 0,
        total_opex: 0,
        operating_profit: 0,
        covers: 0
      };

      data.forEach(day => {
        totals.net_sales += day.net_sales || 0;
        totals.cogs += day.cogs || 0;
        totals.gross_profit += day.gross_profit || 0;
        totals.rent += day.rent || 0;
        totals.salaries += (day.waiters_salaries || 0) + (day.chefs_salaries || 0) + (day.other_staff_salaries || 0);
        totals.utilities += (day.electricity_grid || 0) + (day.generator_fuel || 0);
        totals.marketing += day.marketing_social || 0;
        totals.maintenance += day.maintenance_sanitation || 0;
        totals.consumables += day.consumables || 0;
        totals.card_fees += day.card_fees || 0;
        totals.bank_charges += day.bank_charges || 0;
        totals.total_opex += day.total_opex || 0;
        totals.operating_profit += day.operating_profit || 0;
        totals.covers += day.covers || 0;
      });

      return totals;
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">
            P&L statements, cashbook, and financial analysis
          </p>
        </div>

        {/* Date Range Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Report Period</CardTitle>
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

        {/* P&L Statement */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profit & Loss Statement</CardTitle>
                <CardDescription>Comprehensive income statement for selected period</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Revenue Section */}
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold text-lg mb-3">Revenue</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Net Sales</span>
                    <span className="font-semibold">{formatCurrency(plSummary?.net_sales || 0)} MMK</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Covers</span>
                    <span className="font-medium">{formatCurrency(plSummary?.covers || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Cost of Sales */}
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold text-lg mb-3">Cost of Sales</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>COGS</span>
                    <span className="text-red-600">{formatCurrency(plSummary?.cogs || 0)} MMK</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Gross Profit</span>
                    <span className="text-green-600">{formatCurrency(plSummary?.gross_profit || 0)} MMK</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Gross Margin</span>
                    <span>
                      {plSummary?.net_sales 
                        ? ((plSummary.gross_profit / plSummary.net_sales) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Operating Expenses */}
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold text-lg mb-3">Operating Expenses</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Rent</span>
                    <span className="text-red-600">{formatCurrency(plSummary?.rent || 0)} MMK</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Salaries</span>
                    <span className="text-red-600">{formatCurrency(plSummary?.salaries || 0)} MMK</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilities (Electricity & Generator)</span>
                    <span className="text-red-600">{formatCurrency(plSummary?.utilities || 0)} MMK</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marketing & Social Media</span>
                    <span className="text-red-600">{formatCurrency(plSummary?.marketing || 0)} MMK</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maintenance & Sanitation</span>
                    <span className="text-red-600">{formatCurrency(plSummary?.maintenance || 0)} MMK</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consumables</span>
                    <span className="text-red-600">{formatCurrency(plSummary?.consumables || 0)} MMK</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Card Fees</span>
                    <span className="text-red-600">{formatCurrency(plSummary?.card_fees || 0)} MMK</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bank Charges</span>
                    <span className="text-red-600">{formatCurrency(plSummary?.bank_charges || 0)} MMK</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total Operating Expenses</span>
                    <span className="text-red-600">{formatCurrency(plSummary?.total_opex || 0)} MMK</span>
                  </div>
                </div>
              </div>

              {/* Net Profit */}
              <div className="rounded-lg border bg-slate-50 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Operating Profit</span>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${
                      (plSummary?.operating_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(plSummary?.operating_profit || 0)} MMK
                    </span>
                    <p className="text-sm text-slate-600">
                      {plSummary?.net_sales 
                        ? ((plSummary.operating_profit / plSummary.net_sales) * 100).toFixed(1)
                        : 0}% margin
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cashbook */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Cashbook Transactions</CardTitle>
                <CardDescription>Recent financial transactions (last 50)</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                View Full Cashbook
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Txn ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Inflow</TableHead>
                  <TableHead className="text-right">Outflow</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashbook?.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-medium">
                      {new Date(txn.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">{txn.txn_id}</TableCell>
                    <TableCell className="max-w-xs truncate">{txn.description}</TableCell>
                    <TableCell>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">
                        {txn.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-green-600 font-medium">
                      {txn.inflow > 0 ? formatCurrency(txn.inflow) : '-'}
                    </TableCell>
                    <TableCell className="text-right text-red-600 font-medium">
                      {txn.outflow > 0 ? formatCurrency(txn.outflow) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(txn.running_balance || 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
