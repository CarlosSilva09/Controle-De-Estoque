export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  category: string;
  price: number;
  stockQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  supplier: string;
  location: string;
  lastUpdated: Date;
  createdAt: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  userId: string;
  timestamp: Date;
  reference?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  recentMovements: number;
}

export interface LowStockAlert {
  product: Product;
  currentStock: number;
  minStock: number;
  severity: 'low' | 'critical' | 'out';
}

export interface StockRequest {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected' | 'ordered' | 'delivered';
  requestedAt: Date;
  updatedAt?: Date;
  reason: string;
  supplier?: string;
  estimatedCost?: number;
  requestedBy: string;
  department: string;
  notes?: string;
  expectedDeliveryDate?: Date;
}
