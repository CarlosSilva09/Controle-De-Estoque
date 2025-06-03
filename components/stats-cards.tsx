"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, AlertTriangle, TrendingDown, Activity } from "lucide-react";
import { DashboardStats } from "@/lib/types";
import { formatCurrency } from "@/lib/stock-utils";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total de Produtos",
      value: stats.totalProducts.toString(),
      icon: Package,
      description: "Produtos cadastrados",
      color: "text-blue-600",
    },
    {
      title: "Valor Total do Estoque",
      value: formatCurrency(stats.totalValue),
      icon: DollarSign,
      description: "Valor total dos produtos em estoque",
      color: "text-green-600",
    },
    {
      title: "Produtos com Estoque Baixo",
      value: stats.lowStockItems.toString(),
      icon: AlertTriangle,
      description: "Produtos abaixo do nível mínimo",
      color: "text-yellow-600",
    },
    {
      title: "Produtos sem Estoque",
      value: stats.outOfStockItems.toString(),
      icon: TrendingDown,
      description: "Produtos esgotados",
      color: "text-red-600",
    },
    {
      title: "Movimentações Recentes",
      value: stats.recentMovements.toString(),
      icon: Activity,
      description: "Últimos 7 dias",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
