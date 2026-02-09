'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  AlertTriangle,
  Calendar,
  Menu as MenuIcon,
  FileText,
  Upload,
  UtensilsCrossed,
  ClipboardList
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  // Date range state - will be updated when we detect available data
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // First, detect what date range has data
  const { data: dataRange } = useQuery({
    queryKey: ['data-date-range'],
    queryFn: async () => {
      const { data } = await supabase
        .from('daily_summaries')
        .select('date')
        .order('date', { ascending: true })
        .limit(1);
      
      const { data: lastData } = await supabase
        .from('daily_summaries')
        .select('date')
        .order('date', { ascending: false })
        .limit(1);
      
      const minDate = data?.[0]?.date || new Date().toISOString().split('T')[0];
      const maxDate = lastData?.[0]?.date || new Date().toISOString().split('T')[0];
      
      return { minDate, maxDate };
    },
  });

  // Update date range when we know what data exists
  if (dataRange && !dateRange.start) {
    setDateRange({ start: dataRange.minDate, end: dataRange.maxDate });
  }

  // Fetch dashboard statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', dateRange],
    queryFn: async () => {
      // Get today's summary
      const today = new Date().toISOString().split('T')[0];
      const { data: todayData } = await supabase
        .from('daily_summaries')
        .select('*')
        .eq('date', today)
        .single();

      // Get month to date summaries
      const monthStart = new Date();
      monthStart.setDate(1);
      const { data: monthData } = await supabase
        .from('daily_summaries')
        .select('net_sales, operating_profit, covers')
        .gte('date', monthStart.toISOString().split('T')[0])
        .lte('date', today);

      // Get recent sales data
      const { data: recentSales } = await supabase
        .from('daily_summaries')
        .select('date, net_sales, operating_profit')
        .gte('date', dateRange.start)
        .lte('date', dateRange.end)
        .eq('is_open', true)
        .order('date', { ascending: false })
        .limit(30);

      // Get top selling items
      const { data: topItems } = await supabase
        .from('daily_item_sales')
        .select(`
          item_id,
          quantity_sold,
          sales_amount,
          gross_profit,
          menu_items (name, section)
        `)
        .gte('date', dateRange.start)
        .lte('date', dateRange.end);

      // Aggregate top items
      const itemMap = new Map();
      topItems?.forEach((sale: any) => {
        const key = sale.item_id;
        if (!itemMap.has(key)) {
          itemMap.set(key, {
            item_id: key,
            name: sale.menu_items?.name || 'Unknown',
            section: sale.menu_items?.section || 'Unknown',
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

      const topItemsArray = Array.from(itemMap.values())
        .sort((a, b) => b.total_sales - a.total_sales)
        .slice(0, 10);

      // Get low stock ingredients
      const { data: allIngredients } = await supabase
        .from('ingredients')
        .select('*');
      
      const lowStock = allIngredients?.filter(
        ing => ing.current_stock < ing.min_stock_threshold
      ) || [];

      // Calculate month totals
      const monthSales = monthData?.reduce((sum, d) => sum + (d.net_sales || 0), 0) || 0;
      const monthProfit = monthData?.reduce((sum, d) => sum + (d.operating_profit || 0), 0) || 0;
      const monthCovers = monthData?.reduce((sum, d) => sum + (d.covers || 0), 0) || 0;

      // Calculate period totals
      const periodSales = recentSales?.reduce((sum, d) => sum + (d.net_sales || 0), 0) || 0;
      const periodProfit = recentSales?.reduce((sum, d) => sum + (d.operating_profit || 0), 0) || 0;
      const avgDailySales = recentSales && recentSales.length > 0 
        ? periodSales / recentSales.length 
        : 0;

      return {
        today: {
          sales: todayData?.net_sales || 0,
          profit: todayData?.operating_profit || 0,
          covers: todayData?.covers || 0,
        },
        month: {
          sales: monthSales,
          profit: monthProfit,
          covers: monthCovers,
        },
        period: {
          sales: periodSales,
          profit: periodProfit,
          avgDailySales: avgDailySales,
          days: recentSales?.length || 0
        },
        topItems: topItemsArray,
        lowStockCount: lowStock?.length || 0,
        recentSales: recentSales || []
      };
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <header className="border-b bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Restaurant Dashboard</h1>
                <p className="text-sm text-slate-500">Loading data...</p>
              </div>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-20 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Restaurant Dashboard</h1>
              <p className="text-sm text-slate-500">Complete inventory & sales management system</p>
            </div>
            <div className="flex gap-2">
              <Link href="/import-data">
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick Navigation */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/sales">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium">
                  <BarChart3 className="mr-2 h-4 w-4 text-blue-600" />
                  Sales Analytics
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/menu">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium">
                  <MenuIcon className="mr-2 h-4 w-4 text-green-600" />
                  Menu Management
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/ingredients">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium">
                  <Package className="mr-2 h-4 w-4 text-purple-600" />
                  Ingredients
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/reports">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium">
                  <FileText className="mr-2 h-4 w-4 text-orange-600" />
                  Financial Reports
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/menu-order">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-amber-200 bg-amber-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium">
                  <UtensilsCrossed className="mr-2 h-4 w-4 text-amber-600" />
                  Customer Menu
                </CardTitle>
                <p className="text-xs text-slate-500">Browse & Order</p>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/orders">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-rose-200 bg-rose-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium">
                  <ClipboardList className="mr-2 h-4 w-4 text-rose-600" />
                  Order Management
                </CardTitle>
                <p className="text-xs text-slate-500">Staff Orders</p>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Today's Performance</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-600">
                  Sales Today
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {formatCurrency(stats?.today.sales || 0)}
                  <span className="text-sm font-normal text-slate-500"> MMK</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-600">
                  Profit Today
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {formatCurrency(stats?.today.profit || 0)}
                  <span className="text-sm font-normal text-slate-500"> MMK</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-600">
                  Covers Today
                  <Users className="h-4 w-4 text-purple-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {stats?.today.covers || 0}
                  <span className="text-sm font-normal text-slate-500"> customers</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-600">
                  Low Stock Items
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats?.lowStockCount || 0}
                  <span className="text-sm font-normal text-slate-500"> items</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Month to Date */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Month to Date</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">
                  {formatCurrency(stats?.month.sales || 0)}
                </div>
                <p className="text-xs text-green-700">MMK</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Total Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900">
                  {formatCurrency(stats?.month.profit || 0)}
                </div>
                <p className="text-xs text-blue-700">MMK</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">Total Covers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900">
                  {formatCurrency(stats?.month.covers || 0)}
                </div>
                <p className="text-xs text-purple-700">customers served</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Top Selling Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5 text-blue-600" />
                Top Selling Items
              </CardTitle>
              <CardDescription>Best performing menu items by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.topItems.slice(0, 5).map((item: any, index: number) => (
                  <div key={item.item_id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.section}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(item.total_sales)} MMK
                      </p>
                      <p className="text-xs text-slate-500">{item.total_quantity} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Sales Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-green-600" />
                Recent Performance
              </CardTitle>
              <CardDescription>Last 7 days sales trend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recentSales.slice(0, 7).map((day: any) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-slate-600">
                        {new Date(day.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Sales</p>
                        <p className="font-medium text-slate-900">
                          {formatCurrency(day.net_sales)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Profit</p>
                        <p className={`font-medium ${day.operating_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(day.operating_profit)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Period Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Period Summary (Feb - Apr 2026)</CardTitle>
            <CardDescription>90-day performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Total Sales</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(stats?.period.sales || 0)} MMK
                </p>
                <p className="text-xs text-slate-500">
                  Avg: {formatCurrency(stats?.period.avgDailySales || 0)} MMK/day
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Total Profit</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(stats?.period.profit || 0)} MMK
                </p>
                <p className="text-xs text-slate-500">{stats?.period.days} operating days</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Profit Margin</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats?.period?.sales && stats.period.sales > 0 
                    ? ((stats.period.profit / stats.period.sales) * 100).toFixed(1)
                    : 0}%
                </p>
                <p className="text-xs text-slate-500">Operating profit margin</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
