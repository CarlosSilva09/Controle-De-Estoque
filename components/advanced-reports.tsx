"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, StockMovement } from "@/lib/types";
import { formatCurrency } from "@/lib/stock-utils";
import { 
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  BarChart3,
  PieChart,
  Activity,
  Filter
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AdvancedReportsProps {
  products: Product[];
  movements: StockMovement[];
}

type ReportPeriod = 'week' | 'month' | 'quarter' | 'year' | 'custom';
type ReportType = 'summary' | 'movements' | 'categories' | 'suppliers' | 'performance';

export function AdvancedReports({ products, movements }: AdvancedReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('month');
  const [selectedType, setSelectedType] = useState<ReportType>('summary');

  // Calcular período baseado na seleção
  const getPeriodDates = (period: ReportPeriod) => {
    const now = new Date();
    switch (period) {
      case 'week':
        return { start: subDays(now, 7), end: now };
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'quarter':
        return { start: subDays(now, 90), end: now };
      case 'year':
        return { start: startOfYear(now), end: endOfYear(now) };
      default:
        return { start: subDays(now, 30), end: now };
    }
  };

  const { start: periodStart, end: periodEnd } = getPeriodDates(selectedPeriod);
  
  // Filtrar movimentações do período
  const periodMovements = movements.filter(m => 
    m.timestamp >= periodStart && m.timestamp <= periodEnd
  );

  // Relatório de Resumo
  const generateSummaryReport = () => {
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0);
    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, p) => sum + p.stockQuantity, 0);
    
    const entries = periodMovements.filter(m => m.type === 'IN');
    const exits = periodMovements.filter(m => m.type === 'OUT');
    const adjustments = periodMovements.filter(m => m.type === 'ADJUSTMENT');
    
    const totalEntries = entries.reduce((sum, m) => sum + m.quantity, 0);
    const totalExits = exits.reduce((sum, m) => sum + m.quantity, 0);
    const totalAdjustments = adjustments.reduce((sum, m) => sum + m.quantity, 0);
    
    // Calcular valor monetário das movimentações
    const entryValue = entries.reduce((sum, m) => {
      const product = products.find(p => p.id === m.productId);
      return sum + (product ? product.price * m.quantity : 0);
    }, 0);
    
    const exitValue = exits.reduce((sum, m) => {
      const product = products.find(p => p.id === m.productId);
      return sum + (product ? product.price * m.quantity : 0);
    }, 0);

    return {
      totalValue,
      totalProducts,
      totalQuantity,
      totalEntries,
      totalExits,
      totalAdjustments,
      entryValue,
      exitValue,
      netMovement: totalEntries - totalExits,
      turnoverRate: totalQuantity > 0 ? (totalExits / totalQuantity) * 100 : 0
    };
  };

  // Relatório por Categoria
  const generateCategoryReport = () => {
    const categoryStats = products.reduce((acc, product) => {
      const category = product.category;
      const value = product.price * product.stockQuantity;
      
      if (!acc[category]) {
        acc[category] = {
          products: 0,
          quantity: 0,
          value: 0,
          avgPrice: 0,
          movements: 0
        };
      }
      
      acc[category].products += 1;
      acc[category].quantity += product.stockQuantity;
      acc[category].value += value;
      
      // Contar movimentações da categoria no período
      const categoryMovements = periodMovements.filter(m => 
        products.find(p => p.id === m.productId)?.category === category
      );
      acc[category].movements = categoryMovements.length;
      
      return acc;
    }, {} as Record<string, any>);

    // Calcular preço médio
    Object.values(categoryStats).forEach((stats: any) => {
      stats.avgPrice = stats.quantity > 0 ? stats.value / stats.quantity : 0;
    });

    return Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      ...stats
    }));
  };

  // Relatório por Fornecedor
  const generateSupplierReport = () => {
    const supplierStats = products.reduce((acc, product) => {
      const supplier = product.supplier;
      const value = product.price * product.stockQuantity;
      
      if (!acc[supplier]) {
        acc[supplier] = {
          products: 0,
          quantity: 0,
          value: 0,
          avgPrice: 0,
          movements: 0
        };
      }
      
      acc[supplier].products += 1;
      acc[supplier].quantity += product.stockQuantity;
      acc[supplier].value += value;
      
      // Contar movimentações do fornecedor no período
      const supplierMovements = periodMovements.filter(m => 
        products.find(p => p.id === m.productId)?.supplier === supplier
      );
      acc[supplier].movements = supplierMovements.length;
      
      return acc;
    }, {} as Record<string, any>);

    // Calcular preço médio
    Object.values(supplierStats).forEach((stats: any) => {
      stats.avgPrice = stats.quantity > 0 ? stats.value / stats.quantity : 0;
    });

    return Object.entries(supplierStats).map(([supplier, stats]) => ({
      supplier,
      ...stats
    }));
  };

  // Relatório de Performance
  const generatePerformanceReport = () => {
    // Produtos mais movimentados
    const productMovements = periodMovements.reduce((acc, movement) => {
      if (!acc[movement.productId]) {
        acc[movement.productId] = { in: 0, out: 0, total: 0 };
      }
      
      if (movement.type === 'IN') acc[movement.productId].in += movement.quantity;
      if (movement.type === 'OUT') acc[movement.productId].out += movement.quantity;
      acc[movement.productId].total += movement.quantity;
      
      return acc;
    }, {} as Record<string, any>);

    const topProducts = Object.entries(productMovements)
      .map(([productId, stats]) => {
        const product = products.find(p => p.id === productId);
        return {
          product: product?.name || 'Produto não encontrado',
          ...stats,
          value: product ? product.price * (stats as any).total : 0
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // Produtos com baixa rotatividade
    const lowTurnoverProducts = products
      .map(product => {
        const productMovementCount = periodMovements
          .filter(m => m.productId === product.id && m.type === 'OUT')
          .reduce((sum, m) => sum + m.quantity, 0);
        
        return {
          ...product,
          movementCount: productMovementCount,
          turnoverRate: product.stockQuantity > 0 ? productMovementCount / product.stockQuantity : 0,
          value: product.price * product.stockQuantity
        };
      })
      .filter(p => p.stockQuantity > 0)
      .sort((a, b) => a.turnoverRate - b.turnoverRate)
      .slice(0, 10);

    return { topProducts, lowTurnoverProducts };
  };

  const summaryData = generateSummaryReport();
  const categoryData = generateCategoryReport();
  const supplierData = generateSupplierReport();
  const performanceData = generatePerformanceReport();

  const periodLabels = {
    week: 'Última Semana',
    month: 'Este Mês',
    quarter: 'Último Trimestre',
    year: 'Este Ano',
    custom: 'Período Personalizado'
  };

  const reportTypeLabels = {
    summary: 'Resumo Executivo',
    movements: 'Movimentações',
    categories: 'Por Categoria',
    suppliers: 'Por Fornecedor',
    performance: 'Performance'
  };

  const exportReport = () => {
    // Implementação básica de exportação
    const reportData = {
      period: periodLabels[selectedPeriod],
      type: reportTypeLabels[selectedType],
      generatedAt: format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      data: selectedType === 'summary' ? summaryData :
            selectedType === 'categories' ? categoryData :
            selectedType === 'suppliers' ? supplierData :
            selectedType === 'performance' ? performanceData : {}
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${selectedType}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controles do Relatório */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatórios Avançados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Período</label>
                <Select value={selectedPeriod} onValueChange={(value: ReportPeriod) => setSelectedPeriod(value)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Última Semana</SelectItem>
                    <SelectItem value="month">Este Mês</SelectItem>
                    <SelectItem value="quarter">Último Trimestre</SelectItem>
                    <SelectItem value="year">Este Ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Relatório</label>
                <Select value={selectedType} onValueChange={(value: ReportType) => setSelectedType(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Resumo Executivo</SelectItem>
                    <SelectItem value="categories">Por Categoria</SelectItem>
                    <SelectItem value="suppliers">Por Fornecedor</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={exportReport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Executivo */}
      {selectedType === 'summary' && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total do Estoque</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(summaryData.totalValue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summaryData.totalProducts} produtos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Entradas</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {summaryData.totalEntries}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(summaryData.entryValue)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saídas</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {summaryData.totalExits}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(summaryData.exitValue)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Rotatividade</CardTitle>
                <Activity className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {summaryData.turnoverRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Saldo: {summaryData.netMovement > 0 ? '+' : ''}{summaryData.netMovement}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Relatório por Categoria */}
      {selectedType === 'categories' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Análise por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{category.category}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                      <div>
                        <p className="text-gray-600">Produtos</p>
                        <p className="font-medium">{category.products}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Quantidade</p>
                        <p className="font-medium">{category.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Valor</p>
                        <p className="font-medium">{formatCurrency(category.value)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Movimentações</p>
                        <p className="font-medium">{category.movements}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relatório por Fornecedor */}
      {selectedType === 'suppliers' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Análise por Fornecedor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {supplierData.map((supplier, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{supplier.supplier}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                      <div>
                        <p className="text-gray-600">Produtos</p>
                        <p className="font-medium">{supplier.products}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Quantidade</p>
                        <p className="font-medium">{supplier.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Valor</p>
                        <p className="font-medium">{formatCurrency(supplier.value)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Movimentações</p>
                        <p className="font-medium">{supplier.movements}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relatório de Performance */}
      {selectedType === 'performance' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Produtos Mais Movimentados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {performanceData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}º</Badge>
                      <div>
                        <p className="font-medium">{product.product}</p>
                        <p className="text-sm text-gray-600">
                          Entradas: {product.in} | Saídas: {product.out}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.total} movimentações</p>
                      <p className="text-sm text-gray-600">{formatCurrency(product.value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Produtos com Baixa Rotatividade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {performanceData.lowTurnoverProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        Estoque: {product.stockQuantity} | Categoria: {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(product.turnoverRate * 100).toFixed(1)}% rotatividade</p>
                      <p className="text-sm text-gray-600">{formatCurrency(product.value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
