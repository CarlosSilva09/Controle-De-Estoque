"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/lib/types";
import { mockCategories, mockSuppliers } from "@/lib/mock-data";

interface ProductFormProps {
  product?: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: Partial<Product>) => void;
  trigger?: React.ReactNode;
}

export function ProductForm({ product, isOpen, onOpenChange, onSave, trigger }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    sku: product?.sku || "",
    category: product?.category || "",
    price: product?.price?.toString() || "",
    stockQuantity: product?.stockQuantity?.toString() || "",
    minStockLevel: product?.minStockLevel?.toString() || "",
    maxStockLevel: product?.maxStockLevel?.toString() || "",
    supplier: product?.supplier || "",
    location: product?.location || "",  });

  const generateSKU = () => {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `PRD-${randomString}-${timestamp}`;
  };

  const handleGenerateSKU = () => {
    setFormData(prev => ({
      ...prev,
      sku: generateSKU()
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      // Validações básicas
    if (!formData.name.trim()) {
      toast.error('Nome do produto é obrigatório');
      return;
    }
    
    if (!formData.sku.trim()) {
      toast.error('SKU é obrigatório');
      return;
    }
    
    if (parseFloat(formData.price) <= 0) {
      toast.error('Preço deve ser maior que zero');
      return;
    }
    
    if (parseInt(formData.stockQuantity) < 0) {
      toast.error('Quantidade em estoque não pode ser negativa');
      return;
    }
    
    if (parseInt(formData.minStockLevel) < 0) {
      toast.error('Estoque mínimo não pode ser negativo');
      return;
    }
    
    const productData: Partial<Product> = {
      ...product,
      name: formData.name,
      description: formData.description,
      sku: formData.sku,
      category: formData.category,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      minStockLevel: parseInt(formData.minStockLevel),
      maxStockLevel: parseInt(formData.maxStockLevel),
      supplier: formData.supplier,
      location: formData.location,
      lastUpdated: new Date(),
    };

    if (!product) {
      productData.id = Date.now().toString();
      productData.createdAt = new Date();
    }

    onSave(productData);
    onOpenChange(false);
    
    // Reset form if it's a new product
    if (!product) {
      setFormData({
        name: "",
        description: "",
        sku: "",
        category: "",
        price: "",
        stockQuantity: "",
        minStockLevel: "",
        maxStockLevel: "",
        supplier: "",
        location: "",
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}      <DialogContent className="max-w-md w-full max-h-[90vh] p-0 rounded-2xl shadow-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-800">
        <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {product ? 'Editar Produto' : 'Adicionar Novo Produto'}
          </DialogTitle>
        </DialogHeader>
  <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
    {/* Nome e SKU */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="flex flex-col gap-1">
        <Label htmlFor="name" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Nome do Produto *</Label>
        <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Digite o nome do produto" className="h-9 text-sm rounded-md border border-blue-100 dark:border-blue-800 focus:ring-2 focus:ring-blue-400/30" required />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="sku" className="text-xs font-semibold text-gray-700 dark:text-gray-300">SKU *</Label>
        <div className="flex gap-2">
          <Input id="sku" value={formData.sku} onChange={(e) => handleChange('sku', e.target.value)} placeholder="Código do produto" className="h-9 text-sm flex-1 rounded-md border border-blue-100 dark:border-blue-800 focus:ring-2 focus:ring-blue-400/30" required />
          <Button type="button" variant="outline" onClick={handleGenerateSKU} className="h-9 px-3 text-xs rounded-md border border-blue-100 dark:border-blue-800">Gerar</Button>
        </div>
      </div>
    </div>
    {/* Descrição */}
    <div className="flex flex-col gap-1">
      <Label htmlFor="description" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Descrição</Label>
      <Textarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Descrição detalhada do produto" className="min-h-[60px] h-16 text-sm rounded-md border border-blue-100 dark:border-blue-800 focus:ring-2 focus:ring-blue-400/30 resize-none" rows={2} />
    </div>    {/* Categoria e Fornecedor */}
    <div className="flex flex-col gap-3">
      <div className="w-full">
        <Label htmlFor="category" className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
          Categoria *
        </Label>
        <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
          <SelectTrigger className="w-full h-9 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {mockCategories.map((category) => (
              <SelectItem key={category.id} value={category.name} className="text-sm py-2">
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full">
        <Label htmlFor="supplier" className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
          Fornecedor
        </Label>
        <Select value={formData.supplier} onValueChange={(value) => handleChange('supplier', value)}>
          <SelectTrigger className="w-full h-9 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue placeholder="Selecione um fornecedor" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {mockSuppliers.map((supplier) => (
              <SelectItem key={supplier.id} value={supplier.name} className="text-sm py-2">
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
    {/* Preço e Localização */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="flex flex-col gap-1">
        <Label htmlFor="price" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Preço (R$) *</Label>
        <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="0,00" className="h-9 text-sm rounded-md border border-blue-100 dark:border-blue-800 focus:ring-2 focus:ring-blue-400/30" required />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="location" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Localização</Label>
        <Input id="location" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} placeholder="Ex: Estoque A1" className="h-9 text-sm rounded-md border border-blue-100 dark:border-blue-800 focus:ring-2 focus:ring-blue-400/30" />
      </div>
    </div>
    {/* Controle de Estoque */}
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Controle de Estoque</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="stockQuantity" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Quantidade Atual *</Label>
          <Input id="stockQuantity" type="number" value={formData.stockQuantity} onChange={(e) => handleChange('stockQuantity', e.target.value)} placeholder="0" className="h-9 text-sm rounded-md border border-blue-100 dark:border-blue-800 focus:ring-2 focus:ring-blue-400/30" required />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="minStockLevel" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Estoque Mínimo *</Label>
          <Input id="minStockLevel" type="number" value={formData.minStockLevel} onChange={(e) => handleChange('minStockLevel', e.target.value)} placeholder="0" className="h-9 text-sm rounded-md border border-blue-100 dark:border-blue-800 focus:ring-2 focus:ring-blue-400/30" required />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="maxStockLevel" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Estoque Máximo</Label>
          <Input id="maxStockLevel" type="number" value={formData.maxStockLevel} onChange={(e) => handleChange('maxStockLevel', e.target.value)} placeholder="0" className="h-9 text-sm rounded-md border border-blue-100 dark:border-blue-800 focus:ring-2 focus:ring-blue-400/30" />
        </div>
      </div>
    </div>
    {/* Botões de Ação */}
    <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-blue-100 dark:border-blue-800 mt-2">
      <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 px-5 text-sm rounded-md border border-blue-100 dark:border-blue-800">Cancelar</Button>
      <Button type="submit" className="h-9 px-5 text-sm rounded-md bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 shadow text-white font-semibold">{product ? 'Atualizar' : 'Adicionar'} Produto</Button>
    </div>
  </form>
      </DialogContent>
    </Dialog>
  );
}
