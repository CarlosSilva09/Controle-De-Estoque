import { Product, DashboardStats, LowStockAlert } from './types';
import { mockStockMovements } from './mock-data';

export function calculateDashboardStats(products: Product[]): DashboardStats {
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stockQuantity), 0);
  const lowStockItems = products.filter(product => 
    product.stockQuantity <= product.minStockLevel && product.stockQuantity > 0
  ).length;
  const outOfStockItems = products.filter(product => product.stockQuantity === 0).length;
  
  // Movimentações dos últimos 7 dias
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentMovements = mockStockMovements.filter(movement => 
    movement.timestamp >= sevenDaysAgo
  ).length;

  return {
    totalProducts,
    totalValue,
    lowStockItems,
    outOfStockItems,
    recentMovements,
  };
}

export function getLowStockAlerts(products: Product[]): LowStockAlert[] {
  return products
    .filter(product => product.stockQuantity <= product.minStockLevel)
    .map(product => ({
      product,
      currentStock: product.stockQuantity,
      minStock: product.minStockLevel,
      severity: (product.stockQuantity === 0
        ? 'out'
        : product.stockQuantity <= product.minStockLevel * 0.5
        ? 'critical'
        : 'low') as 'low' | 'critical' | 'out'
    }))
    .sort((a, b) => {
      // Ordenar por severidade
      const severityOrder: Record<'out' | 'critical' | 'low', number> = { out: 3, critical: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
}

export function getTopProductsByValue(products: Product[], limit: number = 5): Product[] {
  return products
    .sort((a, b) => (b.price * b.stockQuantity) - (a.price * a.stockQuantity))
    .slice(0, limit);
}

export function getStockMovementsByProduct(productId: string) {
  return mockStockMovements.filter(movement => movement.productId === productId);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function getStockStatusColor(product: Product): string {
  if (product.stockQuantity === 0) return 'text-red-600';
  if (product.stockQuantity <= product.minStockLevel * 0.5) return 'text-orange-600';
  if (product.stockQuantity <= product.minStockLevel) return 'text-yellow-600';
  return 'text-green-600';
}

export function getStockStatusText(product: Product): string {
  if (product.stockQuantity === 0) return 'Sem estoque';
  if (product.stockQuantity <= product.minStockLevel * 0.5) return 'Estoque crítico';
  if (product.stockQuantity <= product.minStockLevel) return 'Estoque baixo';
  return 'Estoque normal';
}
