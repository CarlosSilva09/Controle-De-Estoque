"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product, StockMovement } from "@/lib/types";
import { formatCurrency } from "@/lib/stock-utils";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  AlertTriangle,
  BarChart3,
  Target,
  Clock,
  Zap,
  ShieldCheck
} from "lucide-react";
import { subDays, startOfDay } from "date-fns";

interface AdvancedKPICardsProps {
  products: Product[];
  movements: StockMovement[];
}

export function AdvancedKPICards({ products, movements }: AdvancedKPICardsProps) {
  // Cálculos de KPIs
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stockQuantity), 0);
  const averageProductValue = totalProducts > 0 ? totalValue / totalProducts : 0;
  
  // Produtos por status
  const outOfStock = products.filter(p => p.stockQuantity === 0);
  const lowStock = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= p.minStockLevel);
  const optimalStock = products.filter(p => p.stockQuantity > p.minStockLevel && p.stockQuantity <= p.maxStockLevel);
  const overStock = products.filter(p => p.stockQuantity > p.maxStockLevel);
  
  // Movimentações dos últimos 7 e 30 dias
  const last7Days = subDays(new Date(), 7);
  const last30Days = subDays(new Date(), 30);
  
  const movements7Days = movements.filter(m => m.timestamp >= last7Days);
  const movements30Days = movements.filter(m => m.timestamp >= last30Days);
  
  const entries7Days = movements7Days.filter(m => m.type === 'IN').reduce((sum, m) => sum + m.quantity, 0);
  const exits7Days = movements7Days.filter(m => m.type === 'OUT').reduce((sum, m) => sum + m.quantity, 0);
  
  // Taxa de rotatividade (turnover)
  const totalStockQuantity = products.reduce((sum, p) => sum + p.stockQuantity, 0);
  const turnoverRate = totalStockQuantity > 0 ? (exits7Days / totalStockQuantity) * 100 : 0;
  
  // Valor médio por categoria
  const categories = [...new Set(products.map(p => p.category))];
  const avgValueByCategory = categories.length > 0 ? totalValue / categories.length : 0;
  
  // Eficiência do estoque (produtos em nível ótimo)
  const stockEfficiency = totalProducts > 0 ? (optimalStock.length / totalProducts) * 100 : 0;
  
  // Produtos críticos (sem estoque + estoque baixo)
  const criticalProducts = outOfStock.length + lowStock.length;
  const criticalPercentage = totalProducts > 0 ? (criticalProducts / totalProducts) * 100 : 0;
  
  // Produtos mais movimentados (últimos 7 dias)
  const productMovements = movements7Days.reduce((acc, movement) => {
    acc[movement.productId] = (acc[movement.productId] || 0) + movement.quantity;
    return acc;
  }, {} as Record<string, number>);
  
  const mostActiveProduct = Object.entries(productMovements)
    .sort(([,a], [,b]) => b - a)[0];
  
  const mostActiveProductName = mostActiveProduct 
    ? products.find(p => p.id === mostActiveProduct[0])?.name || 'N/A'
    : 'Nenhum';

  const kpis = [
    {
      title: "Valor Médio por Produto",
      value: formatCurrency(averageProductValue),
      icon: DollarSign,
      description: "Média do valor unitário",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Taxa de Rotatividade",
      value: `${turnoverRate.toFixed(1)}%`,
      icon: BarChart3,
      description: "Últimos 7 dias",
      color: turnoverRate > 10 ? "text-green-600" : turnoverRate > 5 ? "text-yellow-600" : "text-red-600",
      bgColor: turnoverRate > 10 ? "bg-green-50" : turnoverRate > 5 ? "bg-yellow-50" : "bg-red-50",
      borderColor: turnoverRate > 10 ? "border-green-200" : turnoverRate > 5 ? "border-yellow-200" : "border-red-200"
    },
    {
      title: "Eficiência do Estoque",
      value: `${stockEfficiency.toFixed(1)}%`,
      icon: Target,
      description: "Produtos em nível ótimo",
      color: stockEfficiency > 70 ? "text-green-600" : stockEfficiency > 50 ? "text-yellow-600" : "text-red-600",
      bgColor: stockEfficiency > 70 ? "bg-green-50" : stockEfficiency > 50 ? "bg-yellow-50" : "bg-red-50",
      borderColor: stockEfficiency > 70 ? "border-green-200" : stockEfficiency > 50 ? "border-yellow-200" : "border-red-200"
    },
    {
      title: "Produtos Críticos",
      value: criticalProducts.toString(),
      icon: AlertTriangle,
      description: `${criticalPercentage.toFixed(1)}% do total`,
      color: criticalProducts === 0 ? "text-green-600" : criticalProducts < 5 ? "text-yellow-600" : "text-red-600",
      bgColor: criticalProducts === 0 ? "bg-green-50" : criticalProducts < 5 ? "bg-yellow-50" : "bg-red-50",
      borderColor: criticalProducts === 0 ? "border-green-200" : criticalProducts < 5 ? "border-yellow-200" : "border-red-200"
    },
    {
      title: "Mais Movimentado",
      value: mostActiveProductName.length > 15 ? mostActiveProductName.substring(0, 15) + "..." : mostActiveProductName,
      icon: Zap,
      description: mostActiveProduct ? `${mostActiveProduct[1]} unidades` : "Últimos 7 dias",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Categorias Ativas",
      value: categories.length.toString(),
      icon: Package,
      description: `Valor médio: ${formatCurrency(avgValueByCategory)}`,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ];

  // Status do estoque
  const stockStatus = [
    {
      label: "Sem Estoque",
      count: outOfStock.length,
      color: "bg-red-500",
      percentage: totalProducts > 0 ? (outOfStock.length / totalProducts) * 100 : 0
    },
    {
      label: "Estoque Baixo",
      count: lowStock.length,
      color: "bg-yellow-500",
      percentage: totalProducts > 0 ? (lowStock.length / totalProducts) * 100 : 0
    },
    {
      label: "Nível Ótimo",
      count: optimalStock.length,
      color: "bg-green-500",
      percentage: totalProducts > 0 ? (optimalStock.length / totalProducts) * 100 : 0
    },
    {
      label: "Excesso",
      count: overStock.length,
      color: "bg-blue-500",
      percentage: totalProducts > 0 ? (overStock.length / totalProducts) * 100 : 0
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi, index) => (
          <Card key={index} className={`${kpi.borderColor} border-l-4`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status do Estoque */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Status do Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Barra de progresso */}
            <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
              {stockStatus.map((status, index) => (
                <div
                  key={index}
                  className={`absolute top-0 h-full ${status.color}`}
                  style={{
                    left: `${stockStatus.slice(0, index).reduce((sum, s) => sum + s.percentage, 0)}%`,
                    width: `${status.percentage}%`
                  }}
                />
              ))}
            </div>
            
            {/* Legendas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stockStatus.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${status.color}`} />
                    <span className="text-sm text-gray-600">{status.label}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {status.count} ({status.percentage.toFixed(0)}%)
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Movimentações */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas (7 dias)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{entries7Days}</div>
            <p className="text-xs text-muted-foreground">
              {movements7Days.filter(m => m.type === 'IN').length} movimentações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saídas (7 dias)</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{exits7Days}</div>
            <p className="text-xs text-muted-foreground">
              {movements7Days.filter(m => m.type === 'OUT').length} movimentações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
            <BarChart3 className={`h-4 w-4 ${entries7Days - exits7Days >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${entries7Days - exits7Days >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {entries7Days - exits7Days >= 0 ? '+' : ''}{entries7Days - exits7Days}
            </div>
            <p className="text-xs text-muted-foreground">
              {entries7Days - exits7Days >= 0 ? 'Crescimento' : 'Redução'} no estoque
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

