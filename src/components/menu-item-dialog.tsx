'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

interface MenuItemDialogProps {
  open: boolean;
  onClose: () => void;
  editItem?: MenuItem | null;
}

const SECTIONS = [
  'Pizza Grande',
  'Pizza Piccola',
  'Appetizers',
  'Pub Snacks',
  'Desserts',
  'Soft Drinks',
  'Beer Bottles',
  'Beer Draught',
  'Red Wine Bottles',
  'White Wine Bottles',
  'Cocktails',
  'Spirits',
  'Other'
];

export function MenuItemDialog({ open, onClose, editItem }: MenuItemDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = !!editItem;

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    menu_type: 'Food',
    section: 'Pizza Grande',
    unit_price: 0,
    unit_cost: 0,
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        id: editItem.id,
        name: editItem.name,
        menu_type: editItem.menu_type,
        section: editItem.section,
        unit_price: editItem.unit_price,
        unit_cost: editItem.unit_cost,
      });
    } else {
      setFormData({
        id: '',
        name: '',
        menu_type: 'Food',
        section: 'Pizza Grande',
        unit_price: 0,
        unit_cost: 0,
      });
    }
  }, [editItem, open]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const unit_gp = data.unit_price - data.unit_cost;
      const cost_percentage = data.unit_price > 0 
        ? (data.unit_cost / data.unit_price) * 100 
        : 0;

      const menuItem = {
        id: data.id || `${data.menu_type === 'Food' ? 'F' : 'D'}-${Date.now()}`,
        name: data.name,
        menu_type: data.menu_type,
        section: data.section,
        unit_price: data.unit_price,
        unit_cost: data.unit_cost,
        unit_gp,
        cost_percentage,
        is_active: true,
      };

      const { error } = await supabase
        .from('menu_items')
        .upsert(menuItem, { onConflict: 'id' });

      if (error) throw error;
      return menuItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-sections'] });
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-sections'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    saveMutation.mutate(formData);
  };

  const handleDelete = () => {
    if (editItem && confirm('Are you sure you want to delete this menu item?')) {
      deleteMutation.mutate(editItem.id);
    }
  };

  const grossProfit = formData.unit_price - formData.unit_cost;
  const costPct = formData.unit_price > 0 
    ? ((formData.unit_cost / formData.unit_price) * 100).toFixed(1) 
    : '0.0';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEditing && (
            <div>
              <Label htmlFor="id">Item ID (optional)</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="Auto-generated if empty"
              />
            </div>
          )}

          <div>
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Margherita Pizza"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="menu_type">Type</Label>
              <select
                id="menu_type"
                value={formData.menu_type}
                onChange={(e) => setFormData({ ...formData, menu_type: e.target.value })}
                className="w-full h-10 px-3 border rounded-md bg-white"
              >
                <option value="Food">Food</option>
                <option value="Drink">Drink</option>
              </select>
            </div>

            <div>
              <Label htmlFor="section">Section</Label>
              <select
                id="section"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full h-10 px-3 border rounded-md bg-white"
              >
                {SECTIONS.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unit_price">Selling Price (MMK)</Label>
              <Input
                id="unit_price"
                type="number"
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) || 0 })}
                min="0"
                step="100"
              />
            </div>

            <div>
              <Label htmlFor="unit_cost">Cost (MMK)</Label>
              <Input
                id="unit_cost"
                type="number"
                value={formData.unit_cost}
                onChange={(e) => setFormData({ ...formData, unit_cost: parseFloat(e.target.value) || 0 })}
                min="0"
                step="100"
              />
            </div>
          </div>

          {/* Calculated Fields */}
          <div className="p-3 bg-slate-50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Gross Profit:</span>
              <span className={`font-semibold ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {grossProfit.toLocaleString()} MMK
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Cost Percentage:</span>
              <span className={`font-semibold ${
                parseFloat(costPct) < 30 ? 'text-green-600' :
                parseFloat(costPct) < 40 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {costPct}%
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving...' : (isEditing ? 'Update' : 'Add Item')}
            </Button>
            
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                Delete
              </Button>
            )}
            
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
