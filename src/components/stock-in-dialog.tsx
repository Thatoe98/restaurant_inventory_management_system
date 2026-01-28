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
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function StockInDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [isNewItem, setIsNewItem] = useState<boolean | null>(null);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [isHighValue, setIsHighValue] = useState(false);
  const [minThreshold, setMinThreshold] = useState('5');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [costPrice, setCostPrice] = useState('');

  // Fetch existing items
  const { data: items } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    },
  });

  const stockInMutation = useMutation({
    mutationFn: async () => {
      console.log('🚀 Starting mutation...');
      console.log('isNewItem:', isNewItem);
      console.log('selectedItemId:', selectedItemId);
      console.log('newItemName:', newItemName);
      console.log('category:', category);
      console.log('unit:', unit);
      console.log('quantity:', quantity);
      console.log('expiryDate:', expiryDate);
      
      let itemId = selectedItemId;

      // Create new item if needed
      if (isNewItem) {
        console.log('Creating new item...');
        const { data: newItem, error: itemError } = await supabase
          .from('items')
          .insert({
            name: newItemName,
            category,
            unit,
            is_high_value: isHighValue,
            min_stock_threshold: parseInt(minThreshold),
          })
          .select()
          .single();

        if (itemError) {
          console.error('❌ Item creation error:', itemError);
          throw itemError;
        }
        console.log('✅ New item created:', newItem);
        itemId = newItem.id;
      }

      // Create batch
      console.log('Creating batch...');
      const { error: batchError } = await supabase.from('batches').insert({
        item_id: itemId,
        quantity_remaining: parseFloat(quantity),
        expiry_date: expiryDate || null,
        cost_price: costPrice ? parseFloat(costPrice) : null,
      });

      if (batchError) {
        console.error('❌ Batch creation error:', batchError);
        throw batchError;
      }
      console.log('✅ Batch created');

      // Create transaction log
      console.log('Creating transaction log...');
      const { error: logError } = await supabase.from('transaction_logs').insert({
        item_id: itemId,
        action_type: 'INBOUND',
        quantity_change: parseFloat(quantity),
        notes: isNewItem ? 'Initial stock - New item created' : 'Stock added',
      });

      if (logError) {
        console.error('❌ Transaction log error:', logError);
        throw logError;
      }
      console.log('✅ Transaction log created');
      console.log('🎉 Mutation completed successfully!');
    },
    onSuccess: () => {
      console.log('✅ onSuccess called');
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['items-with-stock'] });
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('❌ Mutation error:', error);
      alert('Error adding stock: ' + (error as Error).message);
    },
  });

  const resetForm = () => {
    setStep(1);
    setIsNewItem(null);
    setSelectedItemId('');
    setNewItemName('');
    setCategory('');
    setUnit('');
    setIsHighValue(false);
    setMinThreshold('5');
    setQuantity('');
    setExpiryDate('');
    setCostPrice('');
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log('🔵 handleSubmit called');
    console.log('canProceed:', canProceed());
    console.log('isPending:', stockInMutation.isPending);
    if (canProceed() && !stockInMutation.isPending) {
      stockInMutation.mutate();
    } else {
      console.warn('⚠️ Cannot proceed or already pending');
    }
  };

  const canProceed = () => {
    if (step === 1) return isNewItem !== null;
    if (step === 2 && !isNewItem) return selectedItemId !== '';
    if (step === 2 && isNewItem) return newItemName.trim() !== '';
    if (step === 3) return category.trim() !== '';
    if (step === 4) return unit.trim() !== '';
    if (step === 5) return true; // High value is optional
    if (step === 6) return quantity !== '' && parseFloat(quantity) > 0;
    if (step === 7) return true; // Expiry is optional
    return false;
  };

  const totalSteps = isNewItem ? 7 : 3;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-amber-50 border-4 border-amber-800">
        <DialogHeader className="-m-6 mb-6 p-6 bg-gradient-to-r from-amber-100 to-orange-100 border-b-4 border-amber-800">
          <DialogTitle className="text-3xl font-bold text-amber-900">📦 Add Stock - Step {step} of {totalSteps}</DialogTitle>
          <DialogDescription className="text-lg text-amber-800 font-semibold">
            Follow the steps to add inventory
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Step 1: New or Existing Item */}
          {step === 1 && (
            <div className="space-y-6">
              <Label className="text-2xl font-bold text-amber-900 block">Is this a new item or existing item?</Label>
              <div className="grid grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewItem(false);
                    console.log('Existing item selected');
                  }}
                  className={`p-8 rounded-xl border-4 transition-all cursor-pointer ${
                    isNewItem === false
                      ? 'border-orange-600 bg-orange-50 shadow-lg scale-105'
                      : 'border-amber-400 bg-white hover:border-orange-400 hover:bg-orange-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <div className="text-2xl font-bold text-amber-900 mb-2">Existing Item</div>
                    <div className="text-lg text-amber-800">Add to current stock</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewItem(true);
                    console.log('New item selected');
                  }}
                  className={`p-8 rounded-xl border-4 transition-all cursor-pointer ${
                    isNewItem === true
                      ? 'border-orange-600 bg-orange-50 shadow-lg scale-105'
                      : 'border-amber-400 bg-white hover:border-orange-400 hover:bg-orange-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">✨</div>
                    <div className="text-2xl font-bold text-amber-900 mb-2">New Item</div>
                    <div className="text-lg text-amber-800">First time adding</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Existing Item or Enter New Item Name */}
          {step === 2 && !isNewItem && (
            <div className="space-y-6">
              <Label className="text-2xl font-bold text-amber-900 block">Which item are you adding stock for?</Label>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {items?.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItemId(item.id)}
                    className={`w-full p-6 rounded-xl border-3 text-left transition-all cursor-pointer ${
                      selectedItemId === item.id
                        ? 'border-orange-600 bg-orange-50 shadow-lg'
                        : 'border-amber-400 bg-white hover:border-orange-400 hover:bg-orange-50'
                    }`}
                  >
                    <div className="text-xl font-bold text-amber-900">{item.name}</div>
                    <div className="text-lg text-amber-800 mt-1">{item.category} • {item.unit}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && isNewItem && (
            <div className="space-y-6">
              <Label className="text-2xl font-bold text-amber-900 block">What is the name of the new item?</Label>
              <Input
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g., Wagyu Beef, Olive Oil, Fresh Tomatoes"
                className="text-2xl p-8 bg-white text-amber-900 border-4 border-amber-400 focus:border-orange-600"
                autoFocus
              />
            </div>
          )}

          {/* Step 3: Category (New Items Only) */}
          {step === 3 && isNewItem && (
            <div className="space-y-4">
              <Label className="text-2xl font-bold text-amber-900">What category is this item?</Label>
              <div className="grid grid-cols-2 gap-3">
                {['Meat', 'Vegetables', 'Dairy', 'Alcohol', 'Condiments', 'Dry Goods'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-4 rounded-lg border-3 transition-all ${
                      category === cat
                        ? 'border-orange-600 bg-orange-50 shadow-md'
                        : 'border-amber-400 bg-white hover:border-orange-400 hover:bg-orange-50'
                    }`}
                  >
                    <div className="font-semibold text-amber-900">{cat}</div>
                  </button>
                ))}
              </div>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Or type your own category"
                className="mt-2 bg-white text-amber-900 border-3 border-amber-400 focus:border-orange-600"
              />
            </div>
          )}

          {/* Step 4: Unit (New Items Only) */}
          {step === 4 && isNewItem && (
            <div className="space-y-4">
              <Label className="text-2xl font-bold text-amber-900">What unit do you measure this in?</Label>
              <div className="grid grid-cols-3 gap-3">
                {['kg', 'g', 'L', 'bottle', 'can', 'box', 'piece'].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`p-4 rounded-lg border-3 transition-all ${
                      unit === u
                        ? 'border-orange-600 bg-orange-50 shadow-md'
                        : 'border-amber-400 bg-white hover:border-orange-400 hover:bg-orange-50'
                    }`}
                  >
                    <div className="font-semibold text-amber-900">{u}</div>
                  </button>
                ))}
              </div>
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Or type your own unit"
                className="mt-2 bg-white text-amber-900 border-3 border-amber-400 focus:border-orange-600"
              />
            </div>
          )}

          {/* Step 5: High Value (New Items Only) */}
          {step === 5 && isNewItem && (
            <div className="space-y-4">
              <Label className="text-2xl font-bold text-amber-900">Is this an expensive/high-value item?</Label>
              <p className="text-sm text-gray-600">High-value items (like Wagyu beef or whisky) need nightly audits</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setIsHighValue(false)}
                  className={`p-6 rounded-lg border-3 transition-all ${
                    isHighValue === false
                      ? 'border-green-600 bg-green-50 shadow-md'
                      : 'border-amber-400 bg-white hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">✅</div>
                    <div className="font-semibold text-amber-900">Regular Item</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setIsHighValue(true)}
                  className={`p-6 rounded-lg border-3 transition-all ${
                    isHighValue === true
                      ? 'border-yellow-600 bg-yellow-50 shadow-md'
                      : 'border-amber-400 bg-white hover:border-yellow-400 hover:bg-yellow-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">💎</div>
                    <div className="font-semibold text-amber-900">High Value</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 6 or 3 (existing): Quantity */}
          {((step === 6 && isNewItem) || (step === 3 && !isNewItem)) && (
            <div className="space-y-4">
              <Label className="text-2xl font-bold text-amber-900">How much are you adding?</Label>
              <Input
                type="number"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="text-2xl p-6 bg-white text-amber-900 border-4 border-amber-400 focus:border-orange-600"
                autoFocus
              />
              {!isNewItem && selectedItemId && items && (
                <p className="text-sm text-gray-600">
                  Unit: {items.find(i => i.id === selectedItemId)?.unit}
                </p>
              )}
              {isNewItem && <p className="text-sm text-gray-600">Unit: {unit}</p>}
            </div>
          )}

          {/* Step 7 or 4 (existing): Expiry Date */}
          {((step === 7 && isNewItem) || (step === 4 && !isNewItem)) && (
            <div className="space-y-4">
              <Label className="text-2xl font-bold text-amber-900">Does this have an expiry date?</Label>
              <p className="text-lg text-amber-800">Leave empty if it doesn't expire</p>
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="text-lg p-6 bg-white text-amber-900 border-4 border-amber-400 focus:border-orange-600"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setExpiryDate('')}
                className="w-full"
              >
                No Expiry Date
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center pt-6 border-t-4 border-amber-800 bg-gradient-to-r from-amber-100 to-orange-100 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
          {step > 1 && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack}
              className="text-xl px-8 py-6 border-3 border-amber-800 bg-white text-amber-900 hover:bg-amber-50 font-bold shadow-md"
            >
              <ArrowLeft className="mr-2 h-6 w-6" />
              Back
            </Button>
          )}
          <div className="flex-1" />
          {step < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className="ml-auto text-xl px-10 py-6 bg-orange-600 hover:bg-orange-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed font-bold shadow-lg"
            >
              Next
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed() || stockInMutation.isPending}
              className="ml-auto text-xl px-10 py-6 bg-green-700 hover:bg-green-800 text-white disabled:bg-gray-300 disabled:text-gray-500 font-bold shadow-lg"
            >
              <Check className="mr-2 h-6 w-6" />
              {stockInMutation.isPending ? 'Adding...' : 'Complete'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
