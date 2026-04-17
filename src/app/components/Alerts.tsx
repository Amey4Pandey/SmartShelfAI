import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockAlerts } from '../data/mockData';
import { Alert as AlertType } from '../types';
import { AlertTriangle, Package, Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react';

export function Alerts() {
  const [alerts, setAlerts] = useState<AlertType[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | AlertType['type']>('all');

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.type === filter);

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: 'acknowledged' } : alert
    ));
  };

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: 'resolved' } : alert
    ));
  };

  const getAlertIcon = (type: AlertType['type']) => {
    switch (type) {
      case 'restocking': return Package;
      case 'expiry': return Calendar;
      case 'misplaced': return MapPin;
      case 'shrinkage': return AlertTriangle;
    }
  };

  const getAlertColor = (severity: AlertType['severity']) => {
    switch (severity) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'low': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  };

  const stats = {
    new: alerts.filter(a => a.status === 'new').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    high: alerts.filter(a => a.severity === 'high' && a.status === 'new').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Alert Management</h1>
        <p className="text-muted-foreground mt-1">Real-time alerts from shelf monitoring system</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold text-red-500">{stats.new}</div>
            <p className="text-sm text-muted-foreground mt-1">New Alerts</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold text-orange-500">{stats.acknowledged}</div>
            <p className="text-sm text-muted-foreground mt-1">Acknowledged</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold text-green-500">{stats.resolved}</div>
            <p className="text-sm text-muted-foreground mt-1">Resolved</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold text-red-500">{stats.high}</div>
            <p className="text-sm text-muted-foreground mt-1">High Priority</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Tabs defaultValue="all" className="space-y-4" onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="restocking">Restocking</TabsTrigger>
          <TabsTrigger value="expiry">Expiry</TabsTrigger>
          <TabsTrigger value="shrinkage">Shrinkage</TabsTrigger>
          <TabsTrigger value="misplaced">Misplaced</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center text-muted-foreground/70">
                No alerts found for this category
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => {
              const Icon = getAlertIcon(alert.type);
              
              return (
                <Card key={alert.id} className={`bg-card border ${getAlertColor(alert.severity)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${getAlertColor(alert.severity)}`}>
                        <Icon className="size-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="capitalize">
                            {alert.type}
                          </Badge>
                          <Badge 
                            variant={alert.severity === 'high' ? 'destructive' : 'default'}
                            className="capitalize"
                          >
                            {alert.severity}
                          </Badge>
                          <Badge 
                            variant="outline"
                            className={
                              alert.status === 'resolved' ? 'border-green-500 text-green-500' :
                              alert.status === 'acknowledged' ? 'border-orange-500 text-orange-500' :
                              'border-red-500 text-red-500'
                            }
                          >
                            {alert.status}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold mb-1">{alert.productName}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
                          <span>{alert.shelfName}</span>
                          <span>•</span>
                          <span>{formatTime(alert.timestamp)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {alert.status === 'new' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAcknowledge(alert.id)}
                            >
                              <CheckCircle className="size-4 mr-1" />
                              Acknowledge
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleResolve(alert.id)}
                            >
                              <XCircle className="size-4 mr-1" />
                              Resolve
                            </Button>
                          </>
                        )}
                        {alert.status === 'acknowledged' && (
                          <Button
                            size="sm"
                            onClick={() => handleResolve(alert.id)}
                          >
                            <XCircle className="size-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
