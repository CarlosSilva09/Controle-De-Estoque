"use client";

import { AdvancedReports } from "@/components/advanced-reports";
import { mockProducts, mockStockMovements } from "@/lib/mock-data";

export default function RelatoriosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
      <AdvancedReports products={mockProducts} movements={mockStockMovements} />
    </div>
  );
}
