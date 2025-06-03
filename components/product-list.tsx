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
import { ProductFilters } from "@/components/advanced-filters";

interface ProductListProps {
  products: Product[];
  onEditProduct?: (product: Product) => void;
  onAddProduct?: () => void;
  onMovementProduct?: (product: Product) => void;
}

export function ProductList({ products, onEditProduct, onAddProduct, onMovementProduct }: ProductListProps) {
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    category: "",
    supplier: "",
    stockStatus: "",
    priceRange: { min: "", max: "" },
    stockRange: { min: "", max: "" },
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = !filters.search || 
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.sku.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.description?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesSupplier = !filters.supplier || product.supplier === filters.supplier;

    const matchesStockStatus = !filters.stockStatus || (() => {
      switch (filters.stockStatus) {
        case "low":
          return product.stockQuantity <= product.minStockLevel && product.stockQuantity > 0;
        case "out":
          return product.stockQuantity === 0;
        case "normal":
          return product.stockQuantity > product.minStockLevel;
        case "excess":
          return product.stockQuantity > product.maxStockLevel;
        default:
          return true;
      }
    })();

    const matchesPriceRange = (!filters.priceRange.min || product.price >= parseFloat(filters.priceRange.min)) &&
                             (!filters.priceRange.max || product.price <= parseFloat(filters.priceRange.max));

    const matchesStockRange = (!filters.stockRange.min || product.stockQuantity >= parseInt(filters.stockRange.min)) &&
                             (!filters.stockRange.max || product.stockQuantity <= parseInt(filters.stockRange.max));

    return matchesSearch && matchesCategory && matchesSupplier && matchesStockStatus && matchesPriceRange && matchesStockRange;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Produtos ({filteredProducts.length})
          </CardTitle>
          {onAddProduct && (
            <Button onClick={onAddProduct} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Produto
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, SKU ou descrição..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          <Select
            value={filters.category || ""}
            onValueChange={(value) =>
              setFilters({ ...filters, category: value === "all" ? "" : value })
            }
          >
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
          <Select
            value={filters.stockStatus || ""}
            onValueChange={(value) =>
              setFilters({ ...filters, stockStatus: value === "all" ? "" : value })
            }
          >
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
                <TableHead>Produto</TableHead>
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
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-muted-foreground">{product.description}</div>
                        )}
                      </div>
                    </TableCell>
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
                      <div className="flex gap-1">
                        {onEditProduct && (
                          <Button variant="ghost" size="sm" onClick={() => onEditProduct(product)} className="h-8 w-8 p-0" title="Editar produto">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onMovementProduct && (
                          <Button variant="ghost" size="sm" onClick={() => onMovementProduct(product)} className="h-8 w-8 p-0" title="Movimentar estoque">
                            <TrendingUp className="h-4 w-4" />
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
