"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Filter, X, RotateCcw } from "lucide-react";
import { Product } from "@/lib/types";
import { mockCategories, mockSuppliers } from "@/lib/mock-data";

export interface ProductFilters {
  search: string;
  category: string;
  supplier: string;
  stockStatus: string;
  priceRange: {
    min: string;
    max: string;
  };
  stockRange: {
    min: string;
    max: string;
  };
}

interface AdvancedFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  products: Product[];
}

export function AdvancedFilters({ filters, onFiltersChange, products }: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleRangeChange = (rangeType: 'priceRange' | 'stockRange', field: 'min' | 'max', value: string) => {
    onFiltersChange({
      ...filters,
      [rangeType]: {
        ...filters[rangeType],
        [field]: value,
      },
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      search: "",
      category: "",
      supplier: "",
      stockStatus: "",
      priceRange: { min: "", max: "" },
      stockRange: { min: "", max: "" },
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.supplier) count++;
    if (filters.stockStatus) count++;
    if (filters.priceRange.min || filters.priceRange.max) count++;
    if (filters.stockRange.min || filters.stockRange.max) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const getFilteredProductsCount = () => {
    return products.filter(product => {
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
    }).length;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} ativo{activeFiltersCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {getFilteredProductsCount()} de {products.length} produtos
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Recolher" : "Expandir"}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Busca */}
            <div className="space-y-2">
              <Label>Buscar</Label>
              <Input
                placeholder="Nome, SKU ou descrição..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {mockCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fornecedor */}
            <div className="space-y-2">
              <Label>Fornecedor</Label>
              <Select value={filters.supplier} onValueChange={(value) => handleFilterChange('supplier', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os fornecedores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os fornecedores</SelectItem>
                  {mockSuppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.name}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status do Estoque */}
            <div className="space-y-2">
              <Label>Status do Estoque</Label>
              <Select value={filters.stockStatus} onValueChange={(value) => handleFilterChange('stockStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Estoque Baixo</SelectItem>
                  <SelectItem value="out">Sem Estoque</SelectItem>
                  <SelectItem value="excess">Estoque Excessivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Faixa de Preço */}
            <div className="space-y-2">
              <Label>Faixa de Preço (R$)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) => handleRangeChange('priceRange', 'min', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) => handleRangeChange('priceRange', 'max', e.target.value)}
                />
              </div>
            </div>

            {/* Faixa de Estoque */}
            <div className="space-y-2">
              <Label>Faixa de Estoque</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.stockRange.min}
                  onChange={(e) => handleRangeChange('stockRange', 'min', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.stockRange.max}
                  onChange={(e) => handleRangeChange('stockRange', 'max', e.target.value)}
                />
              </div>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
