"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product, StockMovement } from "@/lib/types";
import { formatCurrency } from "@/lib/stock-utils";
import { useRequests } from "@/contexts/requests-context";
import { 
  AlertTriangle,
  Clock,
  ShoppingCart,
  Package,
  Zap,
  Target,
  Calendar,
  DollarSign
} from "lucide-react";
import { subDays, addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PredictiveAlertsProps {
  products: Product[];
  movements: StockMovement[];
  onRequestProduct?: (productId: string, quantity: number, cost: number) => void;
}

interface StockPrediction {
  productId: string;
  productName: string;
  currentStock: number;
  dailyConsumption: number;
  daysUntilOutOfStock: number;
  estimatedOutOfStockDate: Date;
  reorderLevel: number;
  severity: 'critical' | 'warning' | 'normal';
  suggestedOrderQuantity: number;
  reorderCost: number;
}

export function PredictiveAlerts({ products, movements, onRequestProduct }: PredictiveAlertsProps) {
  const { requests, addRequest } = useRequests();
  
  // Verificar se um produto já foi solicitado
  const isProductRequested = (productId: string) => {
    return requests.some(request => 
      request.productId === productId && 
      request.status === 'pending'
    );
  };

  const handleRequestProduct = (productId: string, quantity: number, cost: number, productName: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addRequest({
        productId,
        productName,
        quantity,
        priority: quantity > 50 ? 'high' : quantity > 20 ? 'medium' : 'low',
        requestedBy: 'Sistema',
        department: 'Estoque',
        reason: 'Reposição automática - estoque baixo',
        estimatedCost: cost,
        expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        supplier: product.supplier || 'A definir',
        notes: `Solicitação automática gerada pelo sistema de alertas preditivos para ${productName}.`,
        status: "pending"
      });
      onRequestProduct?.(productId, quantity, cost);
    }
  };
  // Calcular previsões para cada produto
  const predictions: StockPrediction[] = products.map(product => {
    // Calcular consumo médio diário dos últimos 30 dias
    const last30Days = subDays(new Date(), 30);
    const productMovements = movements.filter(m => 
      m.productId === product.id && 
      m.type === 'OUT' && 
      m.timestamp >= last30Days
    );

    const totalConsumed = productMovements.reduce((sum, m) => sum + m.quantity, 0);
    const dailyConsumption = totalConsumed / 30;

    // Calcular dias até esgotar estoque
    const daysUntilOutOfStock = dailyConsumption > 0 
      ? Math.floor(product.stockQuantity / dailyConsumption)
      : 999; // Se não há consumo, considerar "infinito"

    // Data estimada de esgotamento
    const estimatedOutOfStockDate = addDays(new Date(), daysUntilOutOfStock);

    // Nível de reposição (estoque mínimo + buffer)
    const reorderLevel = product.minStockLevel * 1.5;

    // Determinar severidade
    let severity: 'critical' | 'warning' | 'normal' = 'normal';
    if (daysUntilOutOfStock <= 7) severity = 'critical';
    else if (daysUntilOutOfStock <= 14) severity = 'warning';

    // Quantidade sugerida para pedido (baseada no consumo e tempo de reposição)
    const leadTimeDays = 7; // Assumindo 7 dias de lead time
    const safetyStock = dailyConsumption * 7; // 7 dias de estoque de segurança
    const suggestedOrderQuantity = Math.max(
      product.minStockLevel,
      Math.ceil((dailyConsumption * leadTimeDays) + safetyStock)
    );

    const reorderCost = suggestedOrderQuantity * product.price;

    return {
      productId: product.id,
      productName: product.name,
      currentStock: product.stockQuantity,
      dailyConsumption,
      daysUntilOutOfStock,
      estimatedOutOfStockDate,
      reorderLevel,
      severity,
      suggestedOrderQuantity,
      reorderCost
    };
  }).filter(p => p.daysUntilOutOfStock <= 30 || p.currentStock <= p.reorderLevel)
    .sort((a, b) => a.daysUntilOutOfStock - b.daysUntilOutOfStock);

  // Alertas por categoria
  const criticalAlerts = predictions.filter(p => p.severity === 'critical');
  const warningAlerts = predictions.filter(p => p.severity === 'warning');
  
  // Calcular métricas gerais
  const totalReorderCost = predictions.reduce((sum, p) => sum + p.reorderCost, 0);
  const avgDaysUntilStockout = predictions.length > 0 
    ? predictions.reduce((sum, p) => sum + p.daysUntilOutOfStock, 0) / predictions.length
    : 0;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'warning': return Clock;
      default: return Target;
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumo de Alertas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Requer ação imediata</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avisos</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Monitorar de perto</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{avgDaysUntilStockout.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Dias até esgotamento</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo de Reposição</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalReorderCost)}</div>
            <p className="text-xs text-muted-foreground">Investimento sugerido</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Alertas Preditivos de Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          {predictions.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum alerta encontrado</p>
              <p className="text-sm text-gray-400">Todos os produtos estão com estoque adequado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {predictions.map((prediction) => {
                const SeverityIcon = getSeverityIcon(prediction.severity);
                
                return (
                  <div
                    key={prediction.productId}
                    className={`p-4 rounded-lg border ${getSeverityColor(prediction.severity)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <SeverityIcon className="h-5 w-5 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{prediction.productName}</h3>
                            <Badge 
                              variant="outline" 
                              className={prediction.severity === 'critical' ? 'border-red-500 text-red-700' : 
                                       prediction.severity === 'warning' ? 'border-yellow-500 text-yellow-700' : 
                                       'border-green-500 text-green-700'}
                            >
                              {prediction.severity === 'critical' ? 'CRÍTICO' : 
                               prediction.severity === 'warning' ? 'ATENÇÃO' : 'NORMAL'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Estoque Atual</p>
                              <p className="font-medium">{prediction.currentStock} unidades</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Consumo Diário</p>
                              <p className="font-medium">{prediction.dailyConsumption.toFixed(1)} un/dia</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Esgota em</p>
                              <p className="font-medium">
                                {prediction.daysUntilOutOfStock} dias
                                <span className="block text-xs text-gray-500">
                                  {format(prediction.estimatedOutOfStockDate, 'dd/MM/yyyy', { locale: ptBR })}
                                </span>
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Sugestão de Pedido</p>
                              <p className="font-medium">
                                {prediction.suggestedOrderQuantity} unidades
                                <span className="block text-xs text-gray-500">
                                  {formatCurrency(prediction.reorderCost)}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>                        <div className="flex gap-2">
                        {isProductRequested(prediction.productId) ? (
                          <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-md text-sm">
                            <Package className="h-4 w-4" />
                            Solicitado!
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRequestProduct(
                              prediction.productId, 
                              prediction.suggestedOrderQuantity, 
                              prediction.reorderCost,
                              prediction.productName
                            )}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Solicitar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recomendações */}
      {predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recomendações Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalAlerts.length > 0 && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                  <h4 className="font-medium text-red-800 mb-1">Ação Imediata Necessária</h4>
                  <p className="text-sm text-red-700">
                    {criticalAlerts.length} produto(s) podem esgotar em até 7 dias. 
                    Considere fazer pedidos urgentes ou redistribuir estoque.
                  </p>
                </div>
              )}
              
              {warningAlerts.length > 0 && (
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <h4 className="font-medium text-yellow-800 mb-1">Planejamento Recomendado</h4>
                  <p className="text-sm text-yellow-700">
                    {warningAlerts.length} produto(s) precisarão de reposição em 2 semanas. 
                    Inicie o processo de compra para evitar falta de estoque.
                  </p>
                </div>
              )}
              
              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                <h4 className="font-medium text-blue-800 mb-1">Otimização de Custos</h4>
                <p className="text-sm text-blue-700">
                  Investimento total sugerido: {formatCurrency(totalReorderCost)}. 
                  Considere negociar descontos por volume ou agrupar pedidos por fornecedor.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
