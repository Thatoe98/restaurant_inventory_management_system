'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Bell, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes?: string;
}

interface Order {
  id: string;
  table_number: number;
  order_number: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Load orders with real-time subscription
  const { data: orders, isLoading } = useQuery({
    queryKey: ['active-orders', selectedStatus],
    queryFn: async () => {
      let query = supabase
        .from('active_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as Order[]) || [];
    },
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('active_orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_orders',
        },
        (payload) => {
          console.log('Order update:', payload);
          queryClient.invalidateQueries({ queryKey: ['active-orders'] });
          
          // Play notification sound for new orders
          if (payload.eventType === 'INSERT' && audioEnabled) {
            playNotificationSound();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, audioEnabled]);

  const playNotificationSound = () => {
    // Simple beep using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.error('Audio not supported', e);
    }
  };

  // Update order status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, newStatus }: { orderId: string; newStatus: string }) => {
      const updateData: any = { status: newStatus, updated_at: new Date().toISOString() };
      
      if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('active_orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-orders'] });
    },
  });

  // Delete order
  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from('active_orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-orders'] });
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeSince = (dateString: string) => {
    const now = new Date();
    const then = new Date(dateString);
    const minutes = Math.floor((now.getTime() - then.getTime()) / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 min ago';
    if (minutes < 60) return `${minutes} mins ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    preparing: 'bg-blue-100 text-blue-800 border-blue-300',
    ready: 'bg-green-100 text-green-800 border-green-300',
    completed: 'bg-slate-100 text-slate-600 border-slate-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  };

  const statusCounts = {
    all: orders?.length || 0,
    pending: orders?.filter(o => o.status === 'pending').length || 0,
    preparing: orders?.filter(o => o.status === 'preparing').length || 0,
    ready: orders?.filter(o => o.status === 'ready').length || 0,
    completed: orders?.filter(o => o.status === 'completed').length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
            <p className="text-muted-foreground">
              View and manage incoming customer orders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={audioEnabled ? 'default' : 'outline'}
              onClick={() => setAudioEnabled(!audioEnabled)}
            >
              <Bell className={`mr-2 h-4 w-4 ${audioEnabled ? 'animate-pulse' : ''}`} />
              {audioEnabled ? 'Notifications On' : 'Notifications Off'}
            </Button>
          </div>
        </div>

        {/* Status Filter */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Orders', count: statusCounts.all },
                { key: 'pending', label: 'Pending', count: statusCounts.pending },
                { key: 'preparing', label: 'Preparing', count: statusCounts.preparing },
                { key: 'ready', label: 'Ready', count: statusCounts.ready },
                { key: 'completed', label: 'Completed', count: statusCounts.completed },
              ].map(status => (
                <Button
                  key={status.key}
                  variant={selectedStatus === status.key ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus(status.key)}
                  className="relative"
                >
                  {status.label}
                  {status.count > 0 && (
                    <span className="ml-2 bg-white text-slate-900 rounded-full px-2 py-0.5 text-xs font-bold">
                      {status.count}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading orders...</p>
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map(order => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Table {order.table_number}</CardTitle>
                      <p className="text-sm text-slate-500">{order.order_number}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status] || statusColors.pending}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(order.created_at)}</span>
                    <span className="text-slate-400">•</span>
                    <span>{getTimeSince(order.created_at)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Order Items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>
                          <span className="font-semibold">{item.quantity}x</span> {item.name}
                        </span>
                        <span className="text-slate-600">{formatPrice(item.subtotal)} MMK</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-3 mb-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-amber-600">{formatPrice(order.total_amount)} MMK</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {order.status === 'pending' && (
                      <Button
                        onClick={() => updateStatusMutation.mutate({ orderId: order.id, newStatus: 'preparing' })}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={updateStatusMutation.isPending}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Start Preparing
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button
                        onClick={() => updateStatusMutation.mutate({ orderId: order.id, newStatus: 'ready' })}
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={updateStatusMutation.isPending}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Ready
                      </Button>
                    )}
                    {order.status === 'ready' && (
                      <Button
                        onClick={() => updateStatusMutation.mutate({ orderId: order.id, newStatus: 'completed' })}
                        className="w-full bg-slate-600 hover:bg-slate-700"
                        disabled={updateStatusMutation.isPending}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Complete Order
                      </Button>
                    )}
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <Button
                        onClick={() => updateStatusMutation.mutate({ orderId: order.id, newStatus: 'cancelled' })}
                        variant="outline"
                        className="w-full text-red-600 border-red-300 hover:bg-red-50"
                        disabled={updateStatusMutation.isPending}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel Order
                      </Button>
                    )}
                    {(order.status === 'completed' || order.status === 'cancelled') && (
                      <Button
                        onClick={() => {
                          if (confirm('Delete this order?')) {
                            deleteOrderMutation.mutate(order.id);
                          }
                        }}
                        variant="outline"
                        className="w-full"
                        disabled={deleteOrderMutation.isPending}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <p className="text-xl text-slate-600">No orders found</p>
            <p className="text-sm text-slate-500 mt-2">Orders will appear here when customers place them</p>
          </div>
        )}
      </div>
    </div>
  );
}
