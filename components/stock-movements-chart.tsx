"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { StockMovement } from "@/lib/types";
import { format, subDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StockMovementsChartProps {
  movements: StockMovement[];
}

const chartConfig = {
  entradas: {
    label: "Entradas",
    color: "hsl(var(--chart-2))",
  },
  saidas: {
    label: "Saídas",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function StockMovementsChart({ movements }: StockMovementsChartProps) {
  // Agrupar movimentações por dia dos últimos 7 dias
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 6 - i));
    return date;
  });

  const chartData = last7Days.map(day => {
    const dayMovements = movements.filter(movement => 
      startOfDay(movement.timestamp).getTime() === day.getTime()
    );

    const entradas = dayMovements
      .filter(m => m.type === 'IN')
      .reduce((sum, m) => sum + m.quantity, 0);

    const saidas = dayMovements
      .filter(m => m.type === 'OUT')
      .reduce((sum, m) => sum + m.quantity, 0);

    return {
      date: format(day, 'dd/MM', { locale: ptBR }),
      fullDate: format(day, 'dd/MM/yyyy', { locale: ptBR }),
      entradas,
      saidas,
    };
  });

  const totalEntradas = chartData.reduce((sum, day) => sum + day.entradas, 0);
  const totalSaidas = chartData.reduce((sum, day) => sum + day.saidas, 0);
  return (
    <Card className="h-[430px] flex flex-col">      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-base sm:text-lg">Movimentações dos Últimos 7 Dias</span>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>{totalEntradas} entradas</span>
            </div>
            <div className="flex items-center gap-1 text-red-600">
              <TrendingDown className="h-4 w-4" />
              <span>{totalSaidas} saídas</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }}
                className="sm:text-sm"
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                className="sm:text-sm"
              />              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 sm:p-3 border rounded-lg shadow-lg max-w-[180px]">
                        <p className="font-medium text-sm">{data.fullDate}</p>
                        <div className="space-y-1">
                          <p className="text-xs sm:text-sm text-green-600">
                            Entradas: {data.entradas}
                          </p>
                          <p className="text-xs sm:text-sm text-red-600">
                            Saídas: {data.saidas}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="entradas" 
                stroke="var(--color-entradas)" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="saidas" 
                stroke="var(--color-saidas)" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
