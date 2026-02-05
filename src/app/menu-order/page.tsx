'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Plus, Minus, X, Search, Check } from 'lucide-react';
import Image from 'next/image';
import { getMenuItemImage } from '@/lib/menu-images';

interface MenuItem {
  id: string;
  name: string;
  menu_type: string;
  section: string;
  unit_price: number;
  unit_cost: number;
}

interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export default function MenuOrderPage() {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Load menu items
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menu-items-order'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_active', true)
        .order('section')
        .order('name');
      
      if (error) throw error;
      return data as MenuItem[] || [];
    },
  });

  // Get unique categories
  const categories = useMemo(() => {
    if (!menuItems) return [];
    const cats = [...new Set(menuItems.map(item => item.section))];
    return cats.sort();
  }, [menuItems]);

  // Filter menu items
  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.section === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchTerm]);

  // Cart functions
  const addToCart = (item: MenuItem) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => 
        c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(0, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      const orderNumber = `ORD-${Date.now()}`;
      const orderItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.quantity * item.unit_price,
        notes: item.notes || '',
      }));

      const { error } = await supabase
        .from('active_orders')
        .insert({
          table_number: 1,
          order_number: orderNumber,
          items: orderItems,
          total_amount: cartTotal,
          status: 'pending',
        });

      if (error) throw error;
      return orderNumber;
    },
    onSuccess: () => {
      setCart([]);
      setOrderPlaced(true);
      setShowCart(false);
      queryClient.invalidateQueries({ queryKey: ['active-orders'] });
      setTimeout(() => setOrderPlaced(false), 5000);
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <p className="text-xl text-slate-600">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-amber-900">Yan'kin House Menu</h1>
              <p className="text-sm text-slate-600">Table 1</p>
            </div>
            <Button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-amber-600 hover:bg-amber-700"
              size="lg"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-6 text-lg"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' ? 'bg-amber-600' : ''}
            >
              All
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'bg-amber-600' : ''}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {orderPlaced && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-down">
          <Check className="h-6 w-6" />
          <span className="font-semibold">Order placed successfully!</span>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map(item => {
            const imageSrc = getMenuItemImage(item.name);
            const cartItem = cart.find(c => c.id === item.id);
            
            return (
              <Card key={item.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={imageSrc}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {cartItem && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full px-3 py-1 text-sm font-bold shadow-lg">
                      {cartItem.quantity} in cart
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      item.menu_type === 'Food' 
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}>
                      {item.menu_type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <CardHeader className="pb-2">
                  <CardTitle className="text-base line-clamp-2 h-12">{item.name}</CardTitle>
                  <CardDescription className="text-xs">{item.section}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-amber-600">
                        {formatPrice(item.unit_price)}
                      </p>
                      <p className="text-xs text-slate-500">MMK</p>
                    </div>
                    <Button
                      onClick={() => addToCart(item)}
                      className="bg-amber-600 hover:bg-amber-700 shadow-lg"
                      size="lg"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600">No items found</p>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowCart(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-amber-600 text-white p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Your Order</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCart(false)}
                className="text-white hover:bg-amber-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                  <p className="text-slate-600">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.map(item => {
                      const imageSrc = getMenuItemImage(item.name);
                      return (
                        <Card key={item.id} className="overflow-hidden">
                          <CardContent className="p-3">
                            <div className="flex gap-3">
                              {/* Thumbnail */}
                              <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                                <Image
                                  src={imageSrc}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              </div>
                              
                              {/* Item Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm line-clamp-2">{item.name}</p>
                                    <p className="text-xs text-slate-600">
                                      {formatPrice(item.unit_price)} MMK each
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700 ml-2"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                {/* Quantity Controls */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateQuantity(item.id, -1)}
                                      className="h-7 w-7 p-0"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-8 text-center font-semibold text-sm">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateQuantity(item.id, 1)}
                                      className="h-7 w-7 p-0"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <p className="font-bold text-amber-600 text-sm">
                                    {formatPrice(item.unit_price * item.quantity)} MMK
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between text-xl font-bold mb-4">
                      <span>Total:</span>
                      <span className="text-amber-600">{formatPrice(cartTotal)} MMK</span>
                    </div>
                    <Button
                      onClick={() => placeOrderMutation.mutate()}
                      disabled={placeOrderMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                      size="lg"
                    >
                      {placeOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
