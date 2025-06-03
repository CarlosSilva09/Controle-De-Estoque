"use client";

import { mockStockMovements, mockProducts } from "@/lib/mock-data";
import { useState } from "react";
import { StockMovement, Product } from "@/lib/types";
import { StockMovementForm } from "@/components/stock-movement-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, TrendingUp, TrendingDown, RotateCcw, Calendar, Package, User } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/stock-utils";

export default function MovimentacoesPage() {
  const [movements, setMovements] = useState<StockMovement[]>(mockStockMovements);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");

  const handleAddMovement = () => {
    setSelectedProduct(undefined);
    setIsMovementFormOpen(true);
  };

  const handleSaveMovement = (movementData: Partial<StockMovement>) => {
    // Adicionar nova movimentação
    const newMovement: StockMovement = {
      id: Date.now().toString(),
      productId: movementData.productId!,
      type: movementData.type!,
      quantity: movementData.quantity!,
      reason: movementData.reason!,
      userId: 'current-user',
      timestamp: new Date(),
      reference: movementData.reference || `MOV-${Date.now()}`,
    };

    setMovements(prev => [newMovement, ...prev]);
    
    // Atualizar estoque do produto
    if (movementData.productId && movementData.quantity) {
      setProducts(prev => prev.map(p => {
        if (p.id === movementData.productId) {
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
      
      toast.success(`${movementTypeText[movementData.type as keyof typeof movementTypeText]} registrada com sucesso!`);
    }
    
    setSelectedProduct(undefined);
    setIsMovementFormOpen(false);
  };

  const filteredMovements = movements.filter(movement => {
    const product = products.find(p => p.id === movement.productId);
    const productName = product?.name || '';
    
    const matchesSearch = 
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (movement.reference && movement.reference.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === "all" || movement.type === typeFilter;
    const matchesProduct = productFilter === "all" || movement.productId === productFilter;

    return matchesSearch && matchesType && matchesProduct;
  });

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'IN': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'OUT': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'ADJUSTMENT': return <RotateCcw className="h-4 w-4 text-blue-600" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getMovementBadge = (type: string) => {
    switch (type) {
      case 'IN': 
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Entrada</Badge>;
      case 'OUT': 
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Saída</Badge>;
      case 'ADJUSTMENT': 
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Ajuste</Badge>;
      default: 
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Movimentações de Estoque</h1>
          <p className="text-muted-foreground">
            Registre e acompanhe todas as movimentações de estoque
          </p>
        </div>
        <Button onClick={handleAddMovement} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Movimentação
        </Button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Entradas Hoje</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {movements.filter(m => 
                m.type === 'IN' && 
                new Date(m.timestamp).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Saídas Hoje</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {movements.filter(m => 
                m.type === 'OUT' && 
                new Date(m.timestamp).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Ajustes</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {movements.filter(m => m.type === 'ADJUSTMENT').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Esta Semana</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {movements.filter(m => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(m.timestamp) >= weekAgo;
              }).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Produto, motivo ou referência..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Movimentação</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="IN">Entradas</SelectItem>
                  <SelectItem value="OUT">Saídas</SelectItem>
                  <SelectItem value="ADJUSTMENT">Ajustes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Produto</label>
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os produtos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os produtos</SelectItem>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Movimentações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Histórico de Movimentações ({filteredMovements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Referência</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Nenhuma movimentação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMovements.map((movement) => {
                    const product = products.find(p => p.id === movement.productId);
                    return (
                      <TableRow key={movement.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getMovementIcon(movement.type)}
                            {getMovementBadge(movement.type)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {product?.name || 'Produto não encontrado'}
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            movement.type === 'IN' ? 'text-green-600' : 
                            movement.type === 'OUT' ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {movement.type === 'OUT' ? '-' : '+'}
                            {movement.quantity}
                          </span>
                        </TableCell>
                        <TableCell>{movement.reason}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-gray-400" />
                            {movement.userId}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(movement.timestamp)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {movement.reference || '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Nova Movimentação */}
      <StockMovementForm
        product={selectedProduct}
        isOpen={isMovementFormOpen}
        onOpenChange={setIsMovementFormOpen}
        onSave={handleSaveMovement}
        products={products}
      />
    </div>
  );
}
