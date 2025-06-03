"use client";

import { useState } from "react";
import { toast } from "sonner";
import { StatsCards } from "@/components/stats-cards";
import { LowStockAlerts } from "@/components/low-stock-alerts";
// import { TopProductsChart } from "@/components/top-products-chart";
import { StockMovementsChart } from "@/components/stock-movements-chart";
import { ProductList } from "@/components/product-list-fixed";
import { ProductForm } from "@/components/product-form";
import { StockMovementForm } from "@/components/stock-movement-form";
import { ClientOnly } from "@/components/client-only";
import { ChartSkeleton } from "@/components/chart-skeleton";
import { mockProducts, mockStockMovements } from "@/lib/mock-data";
import { calculateDashboardStats, getLowStockAlerts, getTopProductsByValue } from "@/lib/stock-utils";
import { Product, StockMovement } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoryDistributionChart } from "@/components/category-distribution-chart";
import { StockLevelsAnalysis } from "@/components/stock-levels-analysis";
import { StockValueTrend } from "@/components/stock-value-trend";
import { AdvancedKPICards } from "@/components/advanced-kpi-cards";
import { PredictiveAlerts } from "@/components/predictive-alerts";
import { ExportData } from "@/components/export-data";
import { MonthlyMovementsChart } from "@/components/monthly-movements-chart";
import { useRequests } from "@/contexts/requests-context";

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [movements, setMovements] = useState<StockMovement[]>(mockStockMovements);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  
  // Hook do contexto de solicitações
  const { addRequest } = useRequests();

  // Calcular estatísticas do dashboard
  const stats = calculateDashboardStats(products);
  
  // Obter alertas de estoque baixo
  const lowStockAlerts = getLowStockAlerts(products);
  
  // Obter top produtos por valor
  // const topProducts = getTopProductsByValue(products, 5);
  const handleSaveProduct = (productData: Partial<Product>) => {
    if (selectedProduct) {
      // Editar produto existente
      setProducts(prev => prev.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, ...productData } as Product
          : p
      ));
      toast.success('Produto atualizado com sucesso!');
    } else {
      // Adicionar novo produto
      setProducts(prev => [...prev, productData as Product]);
      toast.success('Produto adicionado com sucesso!');
    }
    setSelectedProduct(undefined);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductFormOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setIsProductFormOpen(true);
  };
  const handleSaveMovement = (movementData: Partial<StockMovement>) => {
    // Adicionar movimento
    setMovements(prev => [...prev, movementData as StockMovement]);
    
    // Atualizar estoque do produto
    if (selectedProduct && movementData.quantity) {
      setProducts(prev => prev.map(p => {
        if (p.id === selectedProduct.id) {
          let newStock = p.stockQuantity;
          
          if (movementData.type === 'IN') {
            newStock += movementData.quantity ?? 0;
          } else if (movementData.type === 'OUT') {
            newStock -= movementData.quantity ?? 0;
          } else if (movementData.type === 'ADJUSTMENT') {
            newStock = movementData.quantity ?? newStock;
          }
          
          return { ...p, stockQuantity: Math.max(0, newStock), lastUpdated: new Date() };
        }
        return p;
      }));
      
      const movementTypeText = {
        'IN': 'Entrada',
        'OUT': 'Saída',
        'ADJUSTMENT': 'Ajuste'
      };
      
      toast.success(`${movementTypeText[movementData.type as keyof typeof movementTypeText]} de estoque realizada com sucesso!`);
    }
    
    setSelectedProduct(undefined);
  };
  const handleRequestProduct = (productId: string, quantity: number, cost: number) => {
    // Encontrar o produto solicitado
    const product = products.find(p => p.id === productId);
    if (product) {
      // Criar a solicitação usando o contexto
      addRequest({
        productId,
        productName: product.name,
        quantity,
        priority: quantity > 50 ? 'high' : quantity > 20 ? 'medium' : 'low',
        requestedBy: 'Sistema',
        department: 'Estoque',
        reason: 'Reposição automática - estoque baixo',
        estimatedCost: cost,
        expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        supplier: product.supplier || 'A definir',
        notes: `Solicitação automática gerada pelo sistema de alertas preditivos para ${product.name}.`,
        status: "pending"
      });
    }
  };

  const handleProductMovement = (product: Product) => {
    setSelectedProduct(product);
    setIsMovementFormOpen(true);
  };
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard de Controle de Estoque</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleAddProduct} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
          <ExportData products={products} movements={movements} />
        </div>
      </div>

      {/* KPIs Avançados */}
      <AdvancedKPICards products={products} movements={movements} />      {/* Alertas Preditivos */}
      <PredictiveAlerts 
        products={products} 
        movements={movements} 
        onRequestProduct={handleRequestProduct}
      />

      {/* Cards de Estatísticas */}
      <StatsCards stats={stats} />      {/* Gráficos e Alertas */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <LowStockAlerts alerts={lowStockAlerts} />
        <ClientOnly fallback={<ChartSkeleton title="Movimentações dos Últimos 7 Dias" />}>
          <StockMovementsChart movements={movements} />
        </ClientOnly>
      </div>

      {/* Gráficos Avançados */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <ClientOnly fallback={<ChartSkeleton title="Distribuição por Categoria" />}>
          <CategoryDistributionChart products={products} />
        </ClientOnly>
        <ClientOnly fallback={<ChartSkeleton title="Análise de Níveis de Estoque" />}>
          <StockLevelsAnalysis products={products} />
        </ClientOnly>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <ClientOnly fallback={<ChartSkeleton title="Tendência do Valor do Estoque (30 dias)" />}>
          <StockValueTrend movements={movements} products={products} />
        </ClientOnly>
        <ClientOnly fallback={<ChartSkeleton title="Movimentação Mensal" />}>
          <MonthlyMovementsChart movements={movements} />
        </ClientOnly>
      </div>

      {/* Lista de Produtos */}
      <ProductList 
        products={products}
        onEditProduct={handleEditProduct}
        onAddProduct={handleAddProduct}
        onMovementProduct={handleProductMovement}
      />

      {/* Formulário de Produto */}
      <ProductForm
        product={selectedProduct}
        isOpen={isProductFormOpen}
        onOpenChange={setIsProductFormOpen}
        onSave={handleSaveProduct}
      />

      {/* Formulário de Movimentação */}
      {selectedProduct && (
        <StockMovementForm
          product={selectedProduct}
          isOpen={isMovementFormOpen}
          onOpenChange={setIsMovementFormOpen}
          onSave={handleSaveMovement}
        />
      )}
    </div>
  );
}
