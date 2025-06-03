"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { StockMovement } from "@/lib/types";
import { format } from "date-fns";

interface MonthlyMovementsChartProps {
  movements: StockMovement[];
}

export function MonthlyMovementsChart({ movements }: MonthlyMovementsChartProps) {
  // Agrupa entradas e saídas por mês
  const monthlyData: Record<string, { entrada: number; saida: number }> = {};
  movements.forEach((m) => {
    const month = format(new Date(m.timestamp), "MM/yyyy");
    if (!monthlyData[month]) monthlyData[month] = { entrada: 0, saida: 0 };
    if (m.type === "IN") monthlyData[month].entrada += m.quantity;
    if (m.type === "OUT") monthlyData[month].saida += m.quantity;
  });
  const chartData = Object.entries(monthlyData).map(([month, values]) => ({
    month,
    ...values,
  }));
  return (
    <Card className="h-[430px] flex flex-col">
      <CardHeader>
        <CardTitle>Movimentação Mensal</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <XAxis dataKey="month" tick={{ fontSize: 10 }} className="sm:text-sm" />
            <YAxis tick={{ fontSize: 10 }} className="sm:text-sm" />
            <Tooltip
              contentStyle={{ 
                borderRadius: 12, 
                fontSize: 12,
                padding: '8px 12px',
                maxWidth: '180px'
              }}
              formatter={(value: any, name: string) => [value, name === "entrada" ? "Entradas" : "Saídas"]}
            />
            <Legend 
              verticalAlign="bottom"
              height={36}
              iconType="rect"
              wrapperStyle={{
                paddingTop: '10px',
                fontSize: '12px'
              }}
              formatter={(value) => value === "entrada" ? "Entradas" : "Saídas"} 
            />
            <Bar dataKey="entrada" fill="#22c55e" radius={[8, 8, 0, 0]} name="Entradas" />
            <Bar dataKey="saida" fill="#ef4444" radius={[8, 8, 0, 0]} name="Saídas" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
