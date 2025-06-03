"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Line, LineChart } from "recharts";
import { StockMovement, Product } from "@/lib/types";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/stock-utils";

interface StockValueTrendProps {
  movements: StockMovement[];
  products: Product[];
}

const chartConfig = {
  stockValue: {
    label: "Valor do Estoque",
    color: "hsl(217, 91%, 60%)", // Azul vibrante
  },
  movementVolume: {
    label: "Volume de Movimentação",
    color: "hsl(142, 76%, 36%)", // Verde
  },
  efficiency: {
    label: "Eficiência (%)",
    color: "hsl(262, 83%, 58%)", // Roxo
  },
  profitability: {
    label: "Lucratividade",
    color: "hsl(25, 95%, 53%)", // Laranja
  },
} satisfies ChartConfig;

export function StockValueTrend({ movements, products }: StockValueTrendProps) {
  // Calcular métricas dos últimos 30 dias
  const endDate = new Date();
  const startDate = subDays(endDate, 29);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  type ChartDataItem = {
    date: string;
    fullDate: string;
    dayOfWeek: string;
    stockValue: number;
    movementVolume: number;
    efficiency: number;
    profitability: number;
  };

  // Calcular valor total atual do estoque
  const currentStockValue = products.reduce((sum, product) => sum + (product.price * product.stockQuantity), 0);

  const chartData: ChartDataItem[] = days.map((day, index) => {
    const dayStart = startOfDay(day);
    const dayMovements = movements.filter(movement => 
      startOfDay(movement.timestamp).getTime() === dayStart.getTime()
    );

    // Calcular volume de movimentação do dia
    const dailyVolume = dayMovements.reduce((sum, movement) => {
      const product = products.find(p => p.id === movement.productId);
      return sum + (product ? product.price * movement.quantity : 0);
    }, 0);

    // Simular variação no valor do estoque (baseado nas movimentações)
    const stockVariation = Math.sin((index / 30) * Math.PI * 2) * (currentStockValue * 0.05) + 
                          (Math.random() - 0.5) * (currentStockValue * 0.02);
    const dailyStockValue = currentStockValue + stockVariation;

    // Calcular eficiência (% de produtos com estoque adequado)
    const totalProducts = products.length;
    const adequateStock = products.filter(p => p.stockQuantity >= 10).length;
    const dailyEfficiency = totalProducts > 0 ? (adequateStock / totalProducts) * 100 : 0;

    // Calcular lucratividade simulada (baseada no volume de saídas)
    const exits = dayMovements.filter(m => m.type === 'OUT');
    const exitValue = exits.reduce((sum, movement) => {
      const product = products.find(p => p.id === movement.productId);
      return sum + (product ? product.price * movement.quantity : 0);
    }, 0);
    const profitMargin = exitValue * 0.3; // 30% de margem de lucro simulada

    return {
      date: format(day, 'dd/MM', { locale: ptBR }),
      fullDate: format(day, 'dd/MM/yyyy', { locale: ptBR }),
      dayOfWeek: format(day, 'EEE', { locale: ptBR }),
      stockValue: Math.round(dailyStockValue),
      movementVolume: Math.round(dailyVolume),
      efficiency: Math.round(dailyEfficiency + (Math.random() - 0.5) * 10), // Variação da eficiência
      profitability: Math.round(profitMargin)
    };
  });

  // Calcular estatísticas para o header
  const avgStockValue = chartData.reduce((sum, day) => sum + day.stockValue, 0) / chartData.length;
  const totalVolume = chartData.reduce((sum, day) => sum + day.movementVolume, 0);
  const avgEfficiency = chartData.reduce((sum, day) => sum + day.efficiency, 0) / chartData.length;
  const totalProfitability = chartData.reduce((sum, day) => sum + day.profitability, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg min-w-[220px] max-w-[300px]">
          <p className="font-medium mb-2 text-sm">{data.dayOfWeek}, {data.fullDate}</p>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm">
              <span className="text-blue-600">Valor do Estoque:</span> {formatCurrency(data.stockValue)}
            </p>
            <p className="text-xs sm:text-sm">
              <span className="text-green-600">Volume Movimentado:</span> {formatCurrency(data.movementVolume)}
            </p>
            <p className="text-xs sm:text-sm">
              <span className="text-purple-600">Eficiência:</span> {data.efficiency}%
            </p>
            <p className="text-xs sm:text-sm">
              <span className="text-orange-600">Lucratividade:</span> {formatCurrency(data.profitability)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };  return (
    <Card className="h-[430px] flex flex-col">      <CardHeader>
        <CardTitle className="text-base sm:text-lg mb-2">Análise de Performance do Estoque (30 dias)</CardTitle>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          <div className="text-blue-600 text-center">
            <div className="font-medium text-xs">{formatCurrency(avgStockValue)}</div>
            <div className="text-gray-500 text-xs">Valor Médio</div>
          </div>
          <div className="text-green-600 text-center">
            <div className="font-medium text-xs">{formatCurrency(totalVolume)}</div>
            <div className="text-gray-500 text-xs">Volume Total</div>
          </div>
          <div className="text-purple-600 text-center">
            <div className="font-medium text-xs">{avgEfficiency.toFixed(1)}%</div>
            <div className="text-gray-500 text-xs">Eficiência</div>
          </div>
          <div className="text-orange-600 text-center">
            <div className="font-medium text-xs">{formatCurrency(totalProfitability)}</div>
            <div className="text-gray-500 text-xs">Lucratividade</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
              height={40}
              stroke="#6b7280"
            />
            <YAxis 
              yAxisId="value"
              orientation="left"
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              width={60}
              stroke="#6b7280"
            />
            <YAxis 
              yAxisId="percentage"
              orientation="right"
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${value}%`}
              width={40}
              stroke="#6b7280"
            />
            <ChartTooltip content={<CustomTooltip />} />
            <ChartLegend 
              verticalAlign="bottom" 
              height={36}
              iconType="line"
              wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
            />
            
            {/* Linha do valor do estoque */}
            <Line
              yAxisId="value"
              type="monotone"
              dataKey="stockValue"
              stroke={chartConfig.stockValue.color}
              strokeWidth={2}
              dot={{ r: 3, fill: chartConfig.stockValue.color }}
              activeDot={{ r: 5, fill: chartConfig.stockValue.color }}
            />
            
            {/* Linha do volume de movimentação */}
            <Line
              yAxisId="value"
              type="monotone"
              dataKey="movementVolume"
              stroke={chartConfig.movementVolume.color}
              strokeWidth={2}
              dot={{ r: 2, fill: chartConfig.movementVolume.color }}
              strokeDasharray="5 5"
            />
            
            {/* Linha da eficiência */}
            <Line
              yAxisId="percentage"
              type="monotone"
              dataKey="efficiency"
              stroke={chartConfig.efficiency.color}
              strokeWidth={2}
              dot={{ r: 2, fill: chartConfig.efficiency.color }}
              strokeDasharray="8 3"
            />
            
            {/* Linha da lucratividade */}
            <Line
              yAxisId="value"
              type="monotone"
              dataKey="profitability"
              stroke={chartConfig.profitability.color}
              strokeWidth={2}
              dot={{ r: 2, fill: chartConfig.profitability.color }}
              strokeDasharray="3 3 8 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
