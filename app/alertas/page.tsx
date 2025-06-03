"use client";

import { PredictiveAlerts } from "@/components/predictive-alerts";
import { mockProducts, mockStockMovements } from "@/lib/mock-data";

export default function AlertasPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Alertas de Estoque</h1>
      <PredictiveAlerts products={mockProducts} movements={mockStockMovements} />
    </div>
  );
}
