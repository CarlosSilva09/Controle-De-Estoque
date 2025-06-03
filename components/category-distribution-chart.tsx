"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/stock-utils";

interface CategoryDistributionChartProps {
  products: Product[];
}

const COLORS = [
  "#1976d2", // azul MUI
  "#9c27b0", // roxo MUI
  "#ff9800", // laranja MUI
  "#43a047", // verde MUI
  "#e53935", // vermelho MUI
  "#00bcd4", // ciano
  "#fbc02d", // amarelo
  "#8d6e63", // marrom
  "#607d8b", // azul acinzentado
  "#f06292"  // rosa
];

const chartConfig = {
  value: {
    label: "Valor",
  },
} satisfies ChartConfig;

export function CategoryDistributionChart({ products }: CategoryDistributionChartProps) {
  // Agrupar produtos por categoria
  const categoryData = products.reduce((acc, product) => {
    const value = product.price * product.stockQuantity;
    const quantity = product.stockQuantity;
    
    if (acc[product.category]) {
      acc[product.category].value += value;
      acc[product.category].quantity += quantity;
      acc[product.category].products += 1;
    } else {
      acc[product.category] = {
        name: product.category,
        value,
        quantity,
        products: 1,
      };
    }
    return acc;
  }, {} as Record<string, { name: string; value: number; quantity: number; products: number }>);

  const chartData = Object.values(categoryData).sort((a, b) => b.value - a.value);
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-2 sm:p-3 border rounded-lg shadow-lg max-w-[200px] sm:max-w-[240px]">
          <p className="font-medium text-sm">{data.name}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Produtos: {data.products}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Quantidade Total: {data.quantity}
          </p>
          <p className="text-xs sm:text-sm font-medium">
            Valor: {formatCurrency(data.value)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
        style={{ textShadow: "0 1px 4px #0008" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <Card className="h-[430px] flex flex-col">
      <CardHeader>
        <CardTitle>Distribuição por Categoria</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ color: "#333", fontWeight: 500 }}
                formatter={(value) => value}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
