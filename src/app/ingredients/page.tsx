'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Package, AlertTriangle, Plus, Minus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  current_stock: number;
  min_stock_threshold: number;
  max_stock_threshold: number;
  unit_cost: number;
  supplier_name?: string;
  last_restocked?: string;
}

export default function IngredientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [adjustmentQty, setAdjustmentQty] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'in' | 'out'>('in');
  const queryClient = useQueryClient();

  // Fetch ingredients
  const { data: ingredients = [], isLoading } = useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Ingredient[];
    }
  });

  // Update stock mutation
  const updateStock = useMutation({
    mutationFn: async ({ id, newStock }: { id: string; newStock: number }) => {
      const { error } = await supabase
        .from('ingredients')
        .update({ 
          current_stock: newStock,
          last_restocked: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      setSelectedIngredient(null);
      setAdjustmentQty('');
    }
  });

  const handleStockAdjustment = () => {
    if (!selectedIngredient || !adjustmentQty) return;
    
    const qty = parseFloat(adjustmentQty);
    if (isNaN(qty) || qty <= 0) return;
    
    const newStock = adjustmentType === 'in' 
      ? selectedIngredient.current_stock + qty
      : Math.max(0, selectedIngredient.current_stock - qty);
    
    updateStock.mutate({ id: selectedIngredient.id, newStock });
  };

  // Filter ingredients
  const filteredIngredients = ingredients.filter(ing =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = ingredients.filter(
    ing => ing.current_stock < ing.min_stock_threshold
  ).length;

  const stockValue = ingredients.reduce(
    (sum, ing) => sum + ((ing.current_stock || 0) * (ing.unit_cost || 0)),
    0
  );

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <p>Loading ingredients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Ingredients Management</h1>
            <p className="text-gray-600">Monitor stock levels and costs</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Ingredients</p>
                <p className="text-2xl font-bold">{ingredients.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Stock Value</p>
                <p className="text-2xl font-bold">{stockValue.toLocaleString()} MMK</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Ingredients Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold">Ingredient</th>
                  <th className="text-right p-4 font-semibold">Current Stock</th>
                  <th className="text-right p-4 font-semibold">Min Threshold</th>
                  <th className="text-right p-4 font-semibold">Max Threshold</th>
                  <th className="text-right p-4 font-semibold">Unit Cost</th>
                  <th className="text-right p-4 font-semibold">Stock Value</th>
                  <th className="text-center p-4 font-semibold">Status</th>
                  <th className="text-center p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredIngredients.map((ingredient) => {
                  const isLowStock = (ingredient.current_stock || 0) < (ingredient.min_stock_threshold || 0);
                  const stockValue = (ingredient.current_stock || 0) * (ingredient.unit_cost || 0);
                  
                  return (
                    <tr key={ingredient.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{ingredient.name}</p>
                          {ingredient.supplier_name && (
                            <p className="text-sm text-gray-500">{ingredient.supplier_name}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className={isLowStock ? 'text-red-600 font-semibold' : ''}>
                          {(ingredient.current_stock || 0).toLocaleString()} {ingredient.unit || 'unit'}
                        </span>
                      </td>
                      <td className="p-4 text-right text-gray-600">
                        {(ingredient.min_stock_threshold || 0).toLocaleString()} {ingredient.unit || 'unit'}
                      </td>
                      <td className="p-4 text-right text-gray-600">
                        {(ingredient.max_stock_threshold || 0).toLocaleString()} {ingredient.unit || 'unit'}
                      </td>
                      <td className="p-4 text-right">
                        {(ingredient.unit_cost || 0).toLocaleString()} MMK
                      </td>
                      <td className="p-4 text-right font-medium">
                        {stockValue.toLocaleString()} MMK
                      </td>
                      <td className="p-4 text-center">
                        {isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                            <AlertTriangle className="w-3 h-3" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedIngredient(ingredient);
                              setAdjustmentType('in');
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedIngredient(ingredient);
                              setAdjustmentType('out');
                            }}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Stock Adjustment Dialog */}
        <Dialog open={selectedIngredient !== null} onOpenChange={() => setSelectedIngredient(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {adjustmentType === 'in' ? 'Stock In' : 'Stock Out'} - {selectedIngredient?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Stock</Label>
                <p className="text-2xl font-bold">
                  {(selectedIngredient?.current_stock || 0).toLocaleString()} {selectedIngredient?.unit || 'unit'}
                </p>
              </div>
              
              <div>
                <Label htmlFor="quantity">
                  {adjustmentType === 'in' ? 'Add Quantity' : 'Remove Quantity'}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>

              {adjustmentQty && selectedIngredient && (
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">New Stock Level:</p>
                  <p className="text-xl font-bold">
                    {adjustmentType === 'in'
                      ? ((selectedIngredient.current_stock || 0) + parseFloat(adjustmentQty)).toLocaleString()
                      : Math.max(0, (selectedIngredient.current_stock || 0) - parseFloat(adjustmentQty)).toLocaleString()
                    } {selectedIngredient.unit || 'unit'}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleStockAdjustment}
                  disabled={!adjustmentQty || updateStock.isPending}
                  className="flex-1"
                >
                  {updateStock.isPending ? 'Updating...' : 'Confirm'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedIngredient(null);
                    setAdjustmentQty('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
