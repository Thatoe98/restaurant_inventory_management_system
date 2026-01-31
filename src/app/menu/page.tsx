'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Search, Package, Plus, Edit } from 'lucide-react';
import Link from 'next/link';
import { MenuItemDialog } from '@/components/menu-item-dialog';

interface MenuItem {
  id: string;
  name: string;
  menu_type: string;
  section: string;
  unit_price: number;
  unit_cost: number;
  unit_gp: number;
  cost_percentage: number | null;
  is_active: boolean;
}

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('section')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: sections } = useQuery({
    queryKey: ['menu-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('section');
      
      if (error) throw error;
      const uniqueSections = [...new Set(data.map(item => item.section))];
      return uniqueSections.sort();
    },
  });

  const filteredItems = menuItems?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = selectedSection === 'all' || item.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

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
            <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
            <p className="text-muted-foreground">
              Browse and manage your restaurant menu items
            </p>
          </div>
          <Button onClick={() => { setEditItem(null); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                <Button
                  variant={selectedSection === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSection('all')}
                >
                  All
                </Button>
                {sections?.map(section => (
                  <Button
                    key={section}
                    variant={selectedSection === section ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSection(section)}
                  >
                    {section}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-slate-500">
              Loading menu items...
            </div>
          ) : filteredItems && filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <p className="text-xs text-slate-500">{item.section}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setEditItem(item as MenuItem); setDialogOpen(true); }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        item.menu_type === 'Food' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.menu_type}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Price:</span>
                      <span className="font-semibold">{formatCurrency(item.unit_price)} MMK</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Cost:</span>
                      <span>{formatCurrency(item.unit_cost)} MMK</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Gross Profit:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(item.unit_gp)} MMK
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600">Cost %:</span>
                        <span className={`font-semibold text-sm ${
                          (item.cost_percentage || 0) < 30 
                            ? 'text-green-600'
                            : (item.cost_percentage || 0) < 40
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}>
                          {(item.cost_percentage || 0).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500">
              <Package className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p>No menu items found.</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {filteredItems && filteredItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Summary Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-sm text-slate-600">Total Items</p>
                  <p className="text-2xl font-bold">{filteredItems.length}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Avg Price</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      filteredItems.reduce((sum, item) => sum + item.unit_price, 0) / filteredItems.length
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Avg Cost %</p>
                  <p className="text-2xl font-bold">
                    {(filteredItems.reduce((sum, item) => sum + (item.cost_percentage || 0), 0) / filteredItems.length).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Avg GP</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(
                      filteredItems.reduce((sum, item) => sum + item.unit_gp, 0) / filteredItems.length
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Item Dialog */}
        <MenuItemDialog
          open={dialogOpen}
          onClose={() => { setDialogOpen(false); setEditItem(null); }}
          editItem={editItem}
        />
      </div>
    </div>
  );
}
