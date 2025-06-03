"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, PackageX, AlertCircle } from "lucide-react";
import { LowStockAlert } from "@/lib/types";

interface LowStockAlertsProps {
  alerts: LowStockAlert[];
}

export function LowStockAlerts({ alerts }: LowStockAlertsProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'out':
        return <PackageX className="h-4 w-4 text-red-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'low':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'out':
        return <Badge variant="destructive">Sem Estoque</Badge>;
      case 'critical':
        return <Badge variant="destructive">Crítico</Badge>;
      case 'low':
        return <Badge variant="secondary">Baixo</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-green-600" />
            Alertas de Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            ✅ Todos os produtos estão com estoque adequado!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          Alertas de Estoque ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert) => (
            <div
              key={alert.product.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getSeverityIcon(alert.severity)}
                <div>
                  <p className="font-medium">{alert.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    SKU: {alert.product.sku}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {getSeverityBadge(alert.severity)}
                <p className="text-sm text-muted-foreground mt-1">
                  {alert.currentStock} / {alert.minStock} mín.
                </p>
              </div>
            </div>
          ))}
          {alerts.length > 5 && (
            <p className="text-sm text-muted-foreground text-center">
              ... e mais {alerts.length - 5} alertas
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
