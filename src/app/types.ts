export interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  expiryDate: string;
  weight: number;
  expectedWeight: number;
  position: { shelf: string; row: number; col: number };
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'misplaced' | 'near-expiry';
  lastScanned: string;
  imageUrl?: string;
}

export interface Shelf {
  id: string;
  name: string;
  location: string;
  products: Product[];
  cameraStatus: 'active' | 'inactive' | 'error';
  weightSensorStatus: 'active' | 'inactive' | 'error';
  lastUpdate: string;
}

export interface Alert {
  id: string;
  type: 'restocking' | 'expiry' | 'shrinkage' | 'misplaced';
  severity: 'high' | 'medium' | 'low';
  shelfId: string;
  shelfName: string;
  productName: string;
  message: string;
  timestamp: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

export interface Order {
  id: string;
  productName: string;
  quantity: number;
  shelfId: string;
  shelfName: string;
  status: 'pending' | 'processing' | 'completed';
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
  estimatedDelivery?: string;
}

export interface ShrinkageReport {
  id: string;
  date: string;
  shelfId: string;
  shelfName: string;
  productName: string;
  expectedWeight: number;
  actualWeight: number;
  discrepancy: number;
  possibleCause: string;
}
