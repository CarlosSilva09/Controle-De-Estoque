"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/stock-utils";
import { AlertTriangle, TrendingDown } from "lucide-react";

interface StockLevelsAnalysisProps {
  products: Product[];
}

const chartConfig = {
  currentStock: {
    label: "Estoque Atual",
    color: "hsl(var(--chart-1))",
  },
  minStock: {
    label: "Estoque Mínimo",
    color: "hsl(var(--chart-2))",
  },
  maxStock: {
    label: "Estoque Máximo",
    color: "hsl(var(--chart-3))",
  },
  value: {
    label: "Valor Total",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function StockLevelsAnalysis({ products }: StockLevelsAnalysisProps) {
  const chartData = products
    .slice(0, 10) // Mostrar apenas os 10 primeiros produtos para melhor visualização
    .map((product) => ({
      name: product.name.length > 15 ? product.name.substring(0, 15) + "..." : product.name,
      fullName: product.name,
      currentStock: product.stockQuantity,
      minStock: product.minStockLevel,
      maxStock: product.maxStockLevel,
      value: product.price * product.stockQuantity,
      price: product.price,
      isLowStock: product.stockQuantity <= product.minStockLevel,
      isOutOfStock: product.stockQuantity === 0,
      stockPercentage: product.maxStockLevel > 0 ? (product.stockQuantity / product.maxStockLevel) * 100 : 0,
    }));

  const lowStockCount = chartData.filter(item => item.isLowStock).length;
  const outOfStockCount = chartData.filter(item => item.isOutOfStock).length;  const CustomTooltip = ({ active, payload }: { 
    active?: boolean; 
    payload?: Array<{ 
      payload: { 
        fullName: string; 
        currentStock: number; 
        minStock: number; 
        maxStock: number; 
        stockPercentage: number;
        value: number;
        price: number;
        isLowStock: boolean;
        isOutOfStock: boolean;
      } 
    }>; 
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 sm:p-3 border rounded-lg shadow-lg min-w-[180px] sm:min-w-[200px] max-w-[280px]">
          <p className="font-medium mb-1 sm:mb-2 text-sm">{data.fullName}</p>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm">
              <span className="text-blue-600">Estoque Atual:</span> {data.currentStock}
            </p>
            <p className="text-xs sm:text-sm">
              <span className="text-orange-600">Estoque Mínimo:</span> {data.minStock}
            </p>
            <p className="text-xs sm:text-sm">
              <span className="text-green-600">Estoque Máximo:</span> {data.maxStock}
            </p>
            <p className="text-xs sm:text-sm">
              <span className="text-purple-600">Valor Total:</span> {formatCurrency(data.value)}
            </p>
            <p className="text-xs sm:text-sm">
              <span className="text-gray-600">Preço Unitário:</span> {formatCurrency(data.price)}
            </p>
            <p className="text-xs sm:text-sm">
              <span className="text-gray-600">Nível:</span> {data.stockPercentage.toFixed(1)}% da capacidade
            </p>
            {data.isOutOfStock && (
              <p className="text-xs sm:text-sm text-red-600 font-medium">⚠️ SEM ESTOQUE</p>
            )}
            {data.isLowStock && !data.isOutOfStock && (
              <p className="text-xs sm:text-sm text-orange-600 font-medium">⚠️ ESTOQUE BAIXO</p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };
  return (
    <Card className="h-[430px] flex flex-col">      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-base sm:text-lg">Análise de Níveis de Estoque</span>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            {lowStockCount > 0 && (
              <div className="flex items-center gap-1 text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                <span>{lowStockCount} baixo</span>
              </div>
            )}
            {outOfStockCount > 0 && (
              <div className="flex items-center gap-1 text-red-600">
                <TrendingDown className="h-4 w-4" />
                <span>{outOfStockCount} esgotado</span>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 9 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
                className="sm:text-sm"
              />
              <YAxis yAxisId="left" tick={{ fontSize: 9 }} className="sm:text-sm" />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tick={{ fontSize: 9 }}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                className="sm:text-sm"
              />
              <ChartTooltip content={<CustomTooltip />} />
              
              {/* Barra para estoque máximo (fundo) */}
              <Bar
                yAxisId="left"
                dataKey="maxStock"
                fill="#e5e7eb"
                name="Estoque Máximo"
                radius={[2, 2, 0, 0]}
              />
              
              {/* Barra para estoque atual */}
              <Bar
                yAxisId="left"
                dataKey="currentStock"
                fill="var(--color-currentStock)"
                name="Estoque Atual"
                radius={[2, 2, 0, 0]}
              />
              
              {/* Linha para estoque mínimo */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="minStock"
                stroke="var(--color-minStock)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
                name="Estoque Mínimo"
              />
              
              {/* Linha para valor total */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Valor Total"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
