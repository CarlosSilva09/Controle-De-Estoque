"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3 } from "lucide-react";
import { Product, StockMovement } from "@/lib/types";
import { formatCurrency } from "@/lib/stock-utils";
import { mockCategories } from "@/lib/mock-data";

interface ReportsProps {
  products: Product[];
  movements: StockMovement[];
}

type ReportType = "stock-analysis" | "movement-summary" | "category-analysis" | "low-stock";

export function Reports({ products, movements }: ReportsProps) {
  const [reportType, setReportType] = useState<ReportType>("stock-analysis");

  const getStockAnalysis = () => {
    return products.map(product => {
      const totalValue = product.price * product.stockQuantity;
      const stockStatus = product.stockQuantity === 0 
        ? "Sem Estoque" 
        : product.stockQuantity <= product.minStockLevel 
          ? "Estoque Baixo" 
          : product.stockQuantity > product.maxStockLevel 
            ? "Estoque Excessivo" 
            : "Normal";
      
      return {
        ...product,
        totalValue,
        stockStatus,
        rotationDays: Math.round(Math.random() * 30 + 5), // Simulação de dias de rotação
      };
    }).sort((a, b) => b.totalValue - a.totalValue);
  };

  const getMovementSummary = () => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const recentMovements = movements.filter(m => m.timestamp >= last30Days);
    
    const summary = recentMovements.reduce((acc, movement) => {
      const productName = products.find(p => p.id === movement.productId)?.name || "Produto não encontrado";
      
      if (!acc[movement.productId]) {
        acc[movement.productId] = {
          productName,
          productId: movement.productId,
          totalIn: 0,
          totalOut: 0,
          totalAdjustments: 0,
          movements: 0,
        };
      }
      
      acc[movement.productId].movements++;
      
      if (movement.type === "IN") {
        acc[movement.productId].totalIn += movement.quantity;
      } else if (movement.type === "OUT") {
        acc[movement.productId].totalOut += movement.quantity;
      } else {
        acc[movement.productId].totalAdjustments++;
      }      return acc;
    }, {} as Record<string, { 
      productName: string; 
      productId: string;
      totalIn: number; 
      totalOut: number; 
      totalAdjustments: number;
      movements: number; 
    }>);
    
    return Object.values(summary).sort((a, b) => b.movements - a.movements);
  };

  const getCategoryAnalysis = () => {
    const categoryStats = mockCategories.map(category => {
      const categoryProducts = products.filter(p => p.category === category.name);
      const totalProducts = categoryProducts.length;
      const totalValue = categoryProducts.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0);
      const lowStockCount = categoryProducts.filter(p => p.stockQuantity <= p.minStockLevel).length;
      const outOfStockCount = categoryProducts.filter(p => p.stockQuantity === 0).length;
      
      return {
        category: category.name,
        totalProducts,
        totalValue,
        lowStockCount,
        outOfStockCount,
        averageStock: totalProducts > 0 ? Math.round(categoryProducts.reduce((sum, p) => sum + p.stockQuantity, 0) / totalProducts) : 0,
      };
    }).sort((a, b) => b.totalValue - a.totalValue);
    
    return categoryStats;
  };

  const getLowStockReport = () => {
    return products
      .filter(p => p.stockQuantity <= p.minStockLevel)
      .map(product => ({
        ...product,
        daysToStockOut: product.stockQuantity === 0 ? 0 : Math.round(Math.random() * 10 + 1),
        reorderSuggestion: Math.max(product.maxStockLevel - product.stockQuantity, 0),
      }))
      .sort((a, b) => a.stockQuantity - b.stockQuantity);
  };

  const renderReport = () => {
    switch (reportType) {
      case "stock-analysis":
        const stockData = getStockAnalysis();
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rotação (dias)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.sku}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.stockQuantity}</TableCell>
                  <TableCell>{formatCurrency(item.totalValue)}</TableCell>
                  <TableCell>
                    <Badge variant={
                      item.stockStatus === "Normal" ? "default" :
                      item.stockStatus === "Estoque Baixo" ? "destructive" :
                      item.stockStatus === "Sem Estoque" ? "destructive" : "secondary"
                    }>
                      {item.stockStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.rotationDays} dias</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case "movement-summary":
        const movementData = getMovementSummary();
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Entradas</TableHead>
                <TableHead>Saídas</TableHead>
                <TableHead>Ajustes</TableHead>
                <TableHead>Total Movimentos</TableHead>
              </TableRow>
            </TableHeader>            <TableBody>
              {movementData.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell className="text-green-600">{item.totalIn}</TableCell>
                  <TableCell className="text-red-600">{item.totalOut}</TableCell>
                  <TableCell>{item.totalAdjustments}</TableCell>
                  <TableCell>{item.movements}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case "category-analysis":
        const categoryData = getCategoryAnalysis();
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Estoque Baixo</TableHead>
                <TableHead>Sem Estoque</TableHead>
                <TableHead>Estoque Médio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryData.map((item) => (
                <TableRow key={item.category}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell>{item.totalProducts}</TableCell>
                  <TableCell>{formatCurrency(item.totalValue)}</TableCell>
                  <TableCell>
                    {item.lowStockCount > 0 && (
                      <Badge variant="destructive">{item.lowStockCount}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.outOfStockCount > 0 && (
                      <Badge variant="destructive">{item.outOfStockCount}</Badge>
                    )}
                  </TableCell>
                  <TableCell>{item.averageStock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case "low-stock":
        const lowStockData = getLowStockReport();
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Estoque Atual</TableHead>
                <TableHead>Estoque Mínimo</TableHead>
                <TableHead>Previsão Falta</TableHead>
                <TableHead>Sugestão Reposição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.category}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={item.stockQuantity === 0 ? "text-red-600 font-bold" : "text-orange-600"}>{item.stockQuantity}</span>
                  </TableCell>
                  <TableCell>{item.minStockLevel}</TableCell>
                  <TableCell>
                    {item.daysToStockOut === 0 ? "Esgotado" : `${item.daysToStockOut} dias`}
                  </TableCell>
                  <TableCell className="font-medium text-blue-600">{item.reorderSuggestion} unidades</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      default:
        return <div>Selecione um tipo de relatório</div>;
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case "stock-analysis":
        return "Análise de Estoque";
      case "movement-summary":
        return "Resumo de Movimentações (30 dias)";
      case "category-analysis":
        return "Análise por Categoria";
      case "low-stock":
        return "Relatório de Estoque Baixo";
      default:
        return "Relatório";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Relatórios e Análises
          </CardTitle>
          <Select value={reportType} onValueChange={(value: ReportType) => setReportType(value)}>
            <SelectTrigger className="w-[250px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stock-analysis">Análise de Estoque</SelectItem>
              <SelectItem value="movement-summary">Resumo de Movimentações</SelectItem>
              <SelectItem value="category-analysis">Análise por Categoria</SelectItem>
              <SelectItem value="low-stock">Estoque Baixo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{getReportTitle()}</h3>
        </div>
        <div className="overflow-x-auto">
          {renderReport()}
        </div>
      </CardContent>
    </Card>
  );
}
