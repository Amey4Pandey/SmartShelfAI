import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { mockShelves, mockAlerts, mockOrders } from '../data/mockData';
import { AlertTriangle, Camera, Package, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAlerts = mockAlerts.filter(a => a.status === 'new');
  const activeCameras = mockShelves.filter(s => s.cameraStatus === 'active').length;
  const totalProducts = mockShelves.reduce((sum, shelf) => sum + shelf.products.length, 0);
  const pendingOrders = mockOrders.filter(o => o.status !== 'completed').length;

  const stockLevels = mockShelves.map(shelf => ({
    name: shelf.name,
    inStock: shelf.products.filter(p => p.status === 'in-stock').length,
    lowStock: shelf.products.filter(p => p.status === 'low-stock').length,
    outOfStock: shelf.products.filter(p => p.status === 'out-of-stock').length,
  }));

  const alertsByType = [
    { name: 'Restocking', value: mockAlerts.filter(a => a.type === 'restocking').length, color: '#3b82f6' },
    { name: 'Expiry', value: mockAlerts.filter(a => a.type === 'expiry').length, color: '#f59e0b' },
    { name: 'Shrinkage', value: mockAlerts.filter(a => a.type === 'shrinkage').length, color: '#ef4444' },
    { name: 'Misplaced', value: mockAlerts.filter(a => a.type === 'misplaced').length, color: '#8b5cf6' },
  ];

  const recentActivity = [
    { time: '2 min ago', activity: 'Auto-generated restocking order for Orange Juice' },
    { time: '5 min ago', activity: 'Near-expiry alert for Whole Wheat Bread' },
    { time: '8 min ago', activity: 'Shrinkage detected on Shelf A1' },
    { time: '12 min ago', activity: 'Misplaced product identified via visual classification' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="size-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-muted-foreground">Real-time Monitoring Active</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
            <AlertTriangle className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockAlerts.filter(a => a.severity === 'high' && a.status === 'new').length} high priority
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Cameras</CardTitle>
            <Camera className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{activeCameras}/{mockShelves.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Products Monitored</CardTitle>
            <Package className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">Across {mockShelves.length} shelves</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
            <TrendingUp className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Auto-generated restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Stock Levels by Shelf</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockLevels}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', color: 'var(--popover-foreground)' }}
                  labelStyle={{ color: 'var(--popover-foreground)' }}
                />
                <Bar dataKey="inStock" stackId="a" fill="#10b981" name="In Stock" />
                <Bar dataKey="lowStock" stackId="a" fill="#f59e0b" name="Low Stock" />
                <Bar dataKey="outOfStock" stackId="a" fill="#ef4444" name="Out of Stock" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Alerts by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={alertsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {alertsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', color: 'var(--popover-foreground)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Critical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                  <CheckCircle className="size-4 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">{item.activity}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeAlerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <AlertCircle className={`size-4 mt-0.5 ${
                    alert.severity === 'high' ? 'text-red-500' : 
                    alert.severity === 'medium' ? 'text-orange-500' : 
                    'text-yellow-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.severity === 'high' ? 'destructive' : 'default'} className="text-xs">
                        {alert.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground/70">{alert.shelfName}</span>
                    </div>
                    <p className="text-sm mt-1">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
