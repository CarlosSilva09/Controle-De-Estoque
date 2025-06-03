"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/stock-utils";

interface TopProductsChartProps {
  products: Product[];
}

const chartConfig = {
  value: {
    label: "Valor em Estoque",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TopProductsChart({ products }: TopProductsChartProps) {
  const chartData = products.map((product) => ({
    name: product.name.length > 20 ? product.name.substring(0, 20) + "..." : product.name,
    value: product.price * product.stockQuantity,
    fullName: product.name,
    price: product.price,
    quantity: product.stockQuantity,
  }));

  // Tick customizado para nomes de produtos
  function CustomXAxisTick(props: any) {
    const { x, y, payload } = props;
    const lines = payload.value.split(/\s|-/).reduce((acc: string[], word: string) => {
      if (!acc.length) return [word];
      if ((acc[acc.length - 1] + ' ' + word).length > 10) return [...acc, word];
      acc[acc.length - 1] += ' ' + word;
      return acc;
    }, []);
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fontSize={12} fill="#222">
          {lines.map((line: string, i: number) => (
            <tspan x={0} dy={i === 0 ? 0 : 14} key={i}>{line}</tspan>
          ))}
        </text>
      </g>
    );
  }
  return (
    <Card className="h-[430px] flex flex-col">
      <CardHeader>
        <CardTitle>Top 5 Produtos por Valor em Estoque</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>              <XAxis 
                dataKey="name" 
                tick={CustomXAxisTick}
                interval={0}
                angle={0}
                height={60}
                className="text-xs sm:text-sm"
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                className="sm:text-sm"
              />              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 sm:p-3 border rounded-lg shadow-lg max-w-[200px] sm:max-w-[240px]">
                        <p className="font-medium text-sm">{data.fullName}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Preço: {formatCurrency(data.price)}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Quantidade: {data.quantity}
                        </p>
                        <p className="text-xs sm:text-sm font-medium">
                          Valor Total: {formatCurrency(data.value)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="value" 
                fill="var(--color-value)" 
                radius={[0, 0, 16, 16]} // Cantos inferiores arredondados
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
