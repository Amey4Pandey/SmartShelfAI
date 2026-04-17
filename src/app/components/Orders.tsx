import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { mockOrders } from '../data/mockData';
import { Order as OrderType } from '../types';
import { Package, Clock, CheckCircle, Loader, TrendingUp } from 'lucide-react';

export function Orders() {
  const [orders, setOrders] = useState<OrderType[]>(mockOrders);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCancelOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    total: orders.length,
  };

  const getStatusIcon = (status: OrderType['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'processing': return Loader;
      case 'completed': return CheckCircle;
    }
  };

  const getStatusColor = (status: OrderType['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10';
      case 'processing': return 'text-blue-500 bg-blue-500/10';
      case 'completed': return 'text-green-500 bg-green-500/10';
    }
  };

  const getPriorityColor = (priority: OrderType['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-500 text-red-500';
      case 'medium': return 'border-orange-500 text-orange-500';
      case 'low': return 'border-green-500 text-green-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Autonomous Restocking Orders</h1>
        <p className="text-muted-foreground mt-1">Auto-generated orders based on shelf monitoring</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold">{stats.total}</div>
                <p className="text-sm text-muted-foreground mt-1">Total Orders</p>
              </div>
              <Package className="size-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-yellow-500">{stats.pending}</div>
                <p className="text-sm text-muted-foreground mt-1">Pending</p>
              </div>
              <Clock className="size-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-blue-500">{stats.processing}</div>
                <p className="text-sm text-muted-foreground mt-1">Processing</p>
              </div>
              <Loader className="size-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-green-500">{stats.completed}</div>
                <p className="text-sm text-muted-foreground mt-1">Completed</p>
              </div>
              <CheckCircle className="size-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <div className="flex items-center gap-2 text-sm text-green-500">
            <TrendingUp className="size-4" />
            <span>Auto-generation active</span>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center text-muted-foreground/70">
              No orders found
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            
            return (
              <Card key={order.id} className="bg-card border-border hover:border-border/70 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${getStatusColor(order.status)}`}>
                      <StatusIcon className="size-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{order.productName}</h3>
                        <Badge variant="outline" className={getPriorityColor(order.priority)}>
                          {order.priority} priority
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-muted-foreground/70">Quantity</p>
                          <p className="font-medium mt-1">{order.quantity} units</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground/70">Shelf</p>
                          <p className="font-medium mt-1">{order.shelfName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground/70">Status</p>
                          <p className="font-medium mt-1 capitalize">{order.status}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground/70">Created</p>
                          <p className="font-medium mt-1">{formatTime(order.createdAt)}</p>
                        </div>
                      </div>

                      {order.estimatedDelivery && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-2 rounded">
                          <Clock className="size-3" />
                          <span>Estimated delivery: {formatTime(order.estimatedDelivery)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 text-xs ${
                        order.status !== 'pending' ? 'text-green-500' : 'text-muted-foreground/70'
                      }`}>
                        <div className={`size-2 rounded-full ${
                          order.status !== 'pending' ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                        <span>Created</span>
                      </div>
                      <div className="flex-1 h-px bg-border/70" />
                      <div className={`flex items-center gap-2 text-xs ${
                        order.status === 'processing' || order.status === 'completed' ? 'text-blue-500' : 'text-muted-foreground/70'
                      }`}>
                        <div className={`size-2 rounded-full ${
                          order.status === 'processing' || order.status === 'completed' ? 'bg-blue-500' : 'bg-gray-500'
                        }`} />
                        <span>Processing</span>
                      </div>
                      <div className="flex-1 h-px bg-border/70" />
                      <div className={`flex items-center gap-2 text-xs ${
                        order.status === 'completed' ? 'text-green-500' : 'text-muted-foreground/70'
                      }`}>
                        <div className={`size-2 rounded-full ${
                          order.status === 'completed' ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                        <span>Completed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Auto-generation Info */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5" />
            Autonomous Order Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/80 mb-4">
            The system automatically generates restocking orders when:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Product stock levels fall below 30% threshold</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Out-of-stock condition is detected via weight sensors</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Predicted demand exceeds current inventory based on historical data</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Near-expiry items require replacement to maintain fresh stock</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
