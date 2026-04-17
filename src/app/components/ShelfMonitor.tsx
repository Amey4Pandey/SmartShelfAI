import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { mockShelves } from '../data/mockData';
import { Camera, Scale, Eye, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Shelf, Product } from '../types';

export function ShelfMonitor() {
  const [shelves, setShelves] = useState<Shelf[]>(mockShelves);
  const [expandedShelf, setExpandedShelf] = useState<string | null>('shelf-1');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setShelves(prevShelves => 
        prevShelves.map(shelf => ({
          ...shelf,
          lastUpdate: new Date().toISOString(),
          products: shelf.products.map(product => ({
            ...product,
            weight: product.weight + (Math.random() - 0.5) * 0.1, // Simulate small weight fluctuations
          }))
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'in-stock': return 'bg-green-500';
      case 'low-stock': return 'bg-orange-500';
      case 'out-of-stock': return 'bg-red-500';
      case 'near-expiry': return 'bg-yellow-500';
      case 'misplaced': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: Product['status']) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatTimestamp = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Live Shelf Monitoring</h1>
        <p className="text-muted-foreground mt-1">Real-time camera feeds and weight sensor data</p>
      </div>

      {/* Shelves Grid */}
      <div className="space-y-4">
        {shelves.map((shelf) => {
          const isExpanded = expandedShelf === shelf.id;
          
          return (
            <Card key={shelf.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-xl">{shelf.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{shelf.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Camera className={`size-4 ${shelf.cameraStatus === 'active' ? 'text-green-500' : 'text-red-500'}`} />
                      <span className="text-muted-foreground">Camera</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Scale className={`size-4 ${shelf.weightSensorStatus === 'active' ? 'text-green-500' : 'text-red-500'}`} />
                      <span className="text-muted-foreground">Weight Sensor</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedShelf(isExpanded ? null : shelf.id)}
                    >
                      {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Camera Feed Simulation */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Camera className="size-4" />
                        <span>Visual Classification Feed</span>
                      </div>
                      <div className="relative bg-background rounded-lg overflow-hidden aspect-video border border-border">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Eye className="size-12 text-muted-foreground/60 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Camera Feed: {shelf.name}</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">AI Visual Classification Active</p>
                          </div>
                        </div>
                        {/* Simulated detection boxes */}
                        <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                          {shelf.products.slice(0, 3).map((product, idx) => (
                            <div
                              key={product.id}
                              className="px-2 py-1 bg-blue-600/80 backdrop-blur-sm rounded text-xs"
                            >
                              {product.name} ✓
                            </div>
                          ))}
                        </div>
                        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-black/50 px-2 py-1 rounded">
                          Last scan: {formatTimestamp(shelf.lastUpdate)}
                        </div>
                      </div>
                    </div>

                    {/* Products List */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Scale className="size-4" />
                        <span>Products & Weight Data</span>
                      </div>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {shelf.products.map((product) => (
                          <div
                            key={product.id}
                            className="p-3 bg-muted rounded-lg border border-border hover:border-border/70 transition-colors cursor-pointer"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium">{product.name}</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">Barcode: {product.barcode}</p>
                              </div>
                              <Badge className={`${getStatusColor(product.status)} text-white border-0`}>
                                {getStatusLabel(product.status)}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-muted-foreground/70">Weight:</span>
                                <span className="ml-2 font-medium">{product.weight.toFixed(2)}kg</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground/70">Expected:</span>
                                <span className="ml-2 font-medium">{product.expectedWeight.toFixed(2)}kg</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground/70">Stock Level:</span>
                                <span className="ml-2 font-medium">
                                  {Math.round((product.weight / product.expectedWeight) * 100)}%
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground/70">Position:</span>
                                <span className="ml-2 font-medium">R{product.position.row}-C{product.position.col}</span>
                              </div>
                            </div>

                            {product.status === 'near-expiry' && (
                              <div className="mt-2 flex items-center gap-2 text-xs text-yellow-500">
                                <AlertCircle className="size-3" />
                                <span>Expires: {new Date(product.expiryDate).toLocaleDateString()}</span>
                              </div>
                            )}

                            {product.status === 'misplaced' && (
                              <div className="mt-2 flex items-center gap-2 text-xs text-purple-500">
                                <AlertCircle className="size-3" />
                                <span>Visual classification mismatch detected</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Shelf Summary */}
                  <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground/70">Total Products</p>
                      <p className="text-xl font-semibold mt-1">{shelf.products.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground/70">In Stock</p>
                      <p className="text-xl font-semibold mt-1 text-green-500">
                        {shelf.products.filter(p => p.status === 'in-stock').length}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground/70">Alerts</p>
                      <p className="text-xl font-semibold mt-1 text-orange-500">
                        {shelf.products.filter(p => p.status !== 'in-stock').length}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground/70">Last Update</p>
                      <p className="text-xl font-semibold mt-1">{formatTimestamp(shelf.lastUpdate)}</p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Product Detail Modal (simplified) */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProduct(null)}>
          <Card className="bg-card border-border max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>{selectedProduct.name}</CardTitle>
              <p className="text-sm text-muted-foreground">Detailed Product Information</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground/70">Barcode</p>
                  <p className="font-medium mt-1">{selectedProduct.barcode}</p>
                </div>
                <div>
                  <p className="text-muted-foreground/70">Category</p>
                  <p className="font-medium mt-1">{selectedProduct.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground/70">Current Weight</p>
                  <p className="font-medium mt-1">{selectedProduct.weight.toFixed(2)}kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground/70">Expected Weight</p>
                  <p className="font-medium mt-1">{selectedProduct.expectedWeight.toFixed(2)}kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground/70">Expiry Date</p>
                  <p className="font-medium mt-1">{new Date(selectedProduct.expiryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground/70">Last Scanned</p>
                  <p className="font-medium mt-1">{formatTimestamp(selectedProduct.lastScanned)}</p>
                </div>
              </div>
              <Button onClick={() => setSelectedProduct(null)} className="w-full">Close</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
