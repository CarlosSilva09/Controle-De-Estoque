"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Package, TrendingUp } from "lucide-react";
import { Product } from "@/lib/types";
import { formatCurrency, formatDate, getStockStatusColor, getStockStatusText } from "@/lib/stock-utils";
import { mockCategories } from "@/lib/mock-data";

interface ProductListProps {
  products: Product[];
  onEditProduct?: (product: Product) => void;
  onAddProduct?: () => void;
  onMovementProduct?: (product: Product) => void;
}

export function ProductList({ products, onEditProduct, onAddProduct, onMovementProduct }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

    const matchesStock = (() => {
      switch (stockFilter) {
        case "low":
          return product.stockQuantity <= product.minStockLevel && product.stockQuantity > 0;
        case "out":
          return product.stockQuantity === 0;
        case "normal":
          return product.stockQuantity > product.minStockLevel;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <Card>      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Produtos ({filteredProducts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, SKU ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {mockCategories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status do estoque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="normal">Estoque normal</SelectItem>
              <SelectItem value="low">Estoque baixo</SelectItem>
              <SelectItem value="out">Sem estoque</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabela de produtos */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <div className="text-right">
                        <div className="font-medium">{product.stockQuantity}</div>
                        <div className="text-sm text-muted-foreground">Min: {product.minStockLevel}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${getStockStatusColor(product)}`}>{getStockStatusText(product)}</span>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(product.lastUpdated)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {onEditProduct && (
                          <Button variant="outline" size="sm" onClick={() => onEditProduct(product)} className="h-8 px-3 flex items-center gap-1 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950" title="Editar produto">
                            <Edit className="h-3 w-3" />
                            <span className="hidden sm:inline">Editar</span>
                          </Button>
                        )}
                        {onMovementProduct && (
                          <Button variant="outline" size="sm" onClick={() => onMovementProduct(product)} className="h-8 px-3 flex items-center gap-1 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950" title="Movimentar estoque">
                            <TrendingUp className="h-3 w-3" />
                            <span className="hidden sm:inline">Movimentar</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
