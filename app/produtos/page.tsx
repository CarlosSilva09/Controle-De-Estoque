"use client";

import { ProductList } from "@/components/product-list-fixed";
import { mockProducts } from "@/lib/mock-data";
import { useState } from "react";
import { Product } from "@/lib/types";
import { ProductForm } from "@/components/product-form";
import { StockMovementForm } from "@/components/stock-movement-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductFormOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setIsProductFormOpen(true);
  };

  const handleProductMovement = (product: Product) => {
    setSelectedProduct(product);
    setIsMovementFormOpen(true);
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (selectedProduct) {
      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, ...productData } as Product : p));
    } else {
      setProducts(prev => [...prev, productData as Product]);
    }
    setSelectedProduct(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
        <Button onClick={handleAddProduct} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>      <ProductList 
        products={products}
        onEditProduct={handleEditProduct}
        onMovementProduct={handleProductMovement}
      />
      <ProductForm
        product={selectedProduct}
        isOpen={isProductFormOpen}
        onOpenChange={setIsProductFormOpen}
        onSave={handleSaveProduct}
      />
      {selectedProduct && (
        <StockMovementForm
          product={selectedProduct}
          isOpen={isMovementFormOpen}
          onOpenChange={setIsMovementFormOpen}
          onSave={() => setIsMovementFormOpen(false)}
        />
      )}
    </div>
  );
}
