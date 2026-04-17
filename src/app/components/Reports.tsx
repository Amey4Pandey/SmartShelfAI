import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockShrinkageReports, mockAlerts, mockOrders } from '../data/mockData';
import { FileText, AlertTriangle, TrendingDown, Download, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from './ui/button';

export function Reports() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Generate mock analytics data
  const dailyAlerts = [
    { date: 'Apr 11', restocking: 3, expiry: 2, shrinkage: 1, misplaced: 1 },
    { date: 'Apr 12', restocking: 2, expiry: 3, shrinkage: 0, misplaced: 2 },
    { date: 'Apr 13', restocking: 4, expiry: 1, shrinkage: 2, misplaced: 1 },
    { date: 'Apr 14', restocking: 1, expiry: 2, shrinkage: 1, misplaced: 0 },
    { date: 'Apr 15', restocking: 3, expiry: 4, shrinkage: 1, misplaced: 2 },
    { date: 'Apr 16', restocking: 2, expiry: 1, shrinkage: 2, misplaced: 1 },
    { date: 'Apr 17', restocking: 2, expiry: 2, shrinkage: 1, misplaced: 1 },
  ];

  const orderTrends = [
    { date: 'Apr 11', orders: 5, completed: 4, pending: 1 },
    { date: 'Apr 12', orders: 7, completed: 6, pending: 1 },
    { date: 'Apr 13', orders: 4, completed: 3, pending: 1 },
    { date: 'Apr 14', orders: 6, completed: 5, pending: 1 },
    { date: 'Apr 15', orders: 8, completed: 7, pending: 1 },
    { date: 'Apr 16', orders: 3, completed: 2, pending: 1 },
    { date: 'Apr 17', orders: 5, completed: 4, pending: 1 },
  ];

  const shrinkageData = [
    { shelf: 'Shelf A1', incidents: 3, value: 45.2 },
    { shelf: 'Shelf B3', incidents: 2, value: 32.8 },
    { shelf: 'Shelf C2', incidents: 1, value: 15.5 },
  ];

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalShrinkageValue = mockShrinkageReports.reduce((sum, report) => sum + report.discrepancy, 0);
  const totalOrders = mockOrders.length;
  const totalAlerts = mockAlerts.length;
  const criticalAlerts = mockAlerts.filter(a => a.severity === 'high').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">Comprehensive insights and incident reports</p>
        </div>
        <Button variant="outline">
          <Download className="size-4 mr-2" />
          Export Reports
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-red-500">{criticalAlerts}</div>
                  <p className="text-sm text-muted-foreground mt-1">Critical Alerts</p>
              </div>
              <AlertTriangle className="size-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold">{totalAlerts}</div>
                  <p className="text-sm text-muted-foreground mt-1">Total Alerts</p>
              </div>
              <FileText className="size-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold">{totalOrders}</div>
                  <p className="text-sm text-muted-foreground mt-1">Auto Orders</p>
              </div>
              <TrendingDown className="size-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold">${totalShrinkageValue.toFixed(0)}</div>
                  <p className="text-sm text-muted-foreground mt-1">Shrinkage Loss</p>
              </div>
              <TrendingDown className="size-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center gap-2">
        <Calendar className="size-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Period:</span>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <Button
              key={range}
              size="sm"
              variant={dateRange === range ? 'default' : 'outline'}
              onClick={() => setDateRange(range)}
            >
              {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs for Different Reports */}
      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="bg-card border border-border">
           <TabsTrigger value="alerts" className="text-muted-foreground">Alert Trends</TabsTrigger>
          <TabsTrigger value="orders">Order Analytics</TabsTrigger>
          <TabsTrigger value="shrinkage">Shrinkage Reports</TabsTrigger>
          <TabsTrigger value="expiry">Expiry Management</TabsTrigger>
        </TabsList>

        {/* Alert Trends */}
        <TabsContent value="alerts" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Daily Alert Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dailyAlerts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', color: 'var(--popover-foreground)' }}
                    labelStyle={{ color: 'var(--popover-foreground)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="restocking" stroke="#3b82f6" name="Restocking" />
                  <Line type="monotone" dataKey="expiry" stroke="#f59e0b" name="Expiry" />
                  <Line type="monotone" dataKey="shrinkage" stroke="#ef4444" name="Shrinkage" />
                  <Line type="monotone" dataKey="misplaced" stroke="#8b5cf6" name="Misplaced" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Alert Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Restocking</p>
                  <p className="text-2xl font-semibold text-blue-500 mt-1">
                    {mockAlerts.filter(a => a.type === 'restocking').length}
                  </p>
                </div>
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Expiry</p>
                  <p className="text-2xl font-semibold text-orange-500 mt-1">
                    {mockAlerts.filter(a => a.type === 'expiry').length}
                  </p>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Shrinkage</p>
                  <p className="text-2xl font-semibold text-red-500 mt-1">
                    {mockAlerts.filter(a => a.type === 'shrinkage').length}
                  </p>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Misplaced</p>
                  <p className="text-2xl font-semibold text-purple-500 mt-1">
                    {mockAlerts.filter(a => a.type === 'misplaced').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Order Analytics */}
        <TabsContent value="orders" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Order Completion Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={orderTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', color: 'var(--popover-foreground)' }}
                    labelStyle={{ color: 'var(--popover-foreground)' }}
                  />
                  <Legend />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Average Order Time</p>
                <p className="text-3xl font-semibold mt-2">2.4 hrs</p>
                <p className="text-xs text-green-500 mt-2">↓ 15% from last period</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Order Success Rate</p>
                <p className="text-3xl font-semibold mt-2">98.5%</p>
                <p className="text-xs text-green-500 mt-2">↑ 2% from last period</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Orders This Period</p>
                <p className="text-3xl font-semibold mt-2">{totalOrders}</p>
                <p className="text-xs text-blue-500 mt-2">All auto-generated</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Shrinkage Reports */}
        <TabsContent value="shrinkage" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Shrinkage Incidents by Shelf</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={shrinkageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="shelf" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', color: 'var(--popover-foreground)' }}
                    labelStyle={{ color: 'var(--popover-foreground)' }}
                  />
                  <Bar dataKey="incidents" fill="#ef4444" name="Incidents" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Detailed Shrinkage Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockShrinkageReports.map((report) => (
                  <div key={report.id} className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{report.productName}</h4>
                        <p className="text-sm text-gray-400 mt-1">{report.shelfName}</p>
                      </div>
                      <Badge variant="destructive">
                        -{report.discrepancy.toFixed(2)}kg
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-500">Expected</p>
                        <p className="font-medium mt-1">{report.expectedWeight.toFixed(2)}kg</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Actual</p>
                        <p className="font-medium mt-1">{report.actualWeight.toFixed(2)}kg</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Detected</p>
                        <p className="font-medium mt-1">{formatTime(report.date)}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-800 rounded text-sm">
                        <p className="text-muted-foreground mb-1">Possible Cause:</p>
                      <p>{report.possibleCause}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expiry Management */}
        <TabsContent value="expiry" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Near-Expiry Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAlerts
                  .filter(a => a.type === 'expiry')
                  .map((alert) => (
                    <div key={alert.id} className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{alert.productName}</h4>
                          <p className="text-sm text-gray-400 mt-1">{alert.shelfName}</p>
                          <p className="text-sm mt-2">{alert.message}</p>
                        </div>
                        <Badge 
                          variant={alert.severity === 'high' ? 'destructive' : 'default'}
                          className="capitalize"
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Detected {formatTime(alert.timestamp)}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Expiry Management Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Items Removed</p>
                  <p className="text-2xl font-semibold mt-1">12</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">This month</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Pending Removal</p>
                  <p className="text-2xl font-semibold mt-1 text-orange-500">
                    {mockAlerts.filter(a => a.type === 'expiry').length}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Requires action</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Waste Prevented</p>
                  <p className="text-2xl font-semibold mt-1 text-green-500">$420</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">This month</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Detection Rate</p>
                  <p className="text-2xl font-semibold mt-1">100%</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Via AI scanning</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
