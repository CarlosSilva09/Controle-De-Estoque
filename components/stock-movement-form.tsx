"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Product, StockMovement } from "@/lib/types";
import { Plus, Minus, RefreshCw } from "lucide-react";

interface StockMovementFormProps {
  product?: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (movement: Partial<StockMovement>) => void;
  products?: Product[];
}

export function StockMovementForm({ product, isOpen, onOpenChange, onSave, products = [] }: StockMovementFormProps) {
  const [formData, setFormData] = useState({
    productId: product?.id || '',
    type: 'IN' as 'IN' | 'OUT' | 'ADJUSTMENT',
    quantity: '',
    reason: '',
    reference: '',
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedProduct = product || products.find(p => p.id === formData.productId);
    if (!selectedProduct) {
      alert('Por favor, selecione um produto');
      return;
    }
    
    const movement: Partial<StockMovement> = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      type: formData.type,
      quantity: parseInt(formData.quantity),
      reason: formData.reason,
      reference: formData.reference || undefined,
      userId: 'admin', // Em um sistema real, seria obtido do contexto de autenticação
      timestamp: new Date(),
    };

    onSave(movement);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      productId: product?.id || '',
      type: 'IN',
      quantity: '',
      reason: '',
      reference: '',
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getMovementTypeIcon = (type: string) => {
    switch (type) {
      case 'IN':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'OUT':
        return <Minus className="h-4 w-4 text-red-600" />;
      case 'ADJUSTMENT':
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getMovementTypeDescription = (type: string) => {
    switch (type) {
      case 'IN':
        return 'Entrada de produtos no estoque';
      case 'OUT':
        return 'Saída de produtos do estoque';
      case 'ADJUSTMENT':
        return 'Ajuste de inventário';
      default:
        return '';
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Movimentar Estoque</DialogTitle>
          {product && (
            <div className="text-sm text-muted-foreground">
              <p><strong>Produto:</strong> {product.name}</p>
              <p><strong>Estoque atual:</strong> {product.stockQuantity} unidades</p>
            </div>
          )}
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!product && products.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="product">Produto *</Label>
              <Select value={formData.productId} onValueChange={(value) => handleChange('productId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} (Estoque: {p.stockQuantity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Movimentação *</Label>
            <Select value={formData.type} onValueChange={(value: 'IN' | 'OUT' | 'ADJUSTMENT') => handleChange('type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN">
                  <div className="flex items-center gap-2">
                    {getMovementTypeIcon('IN')}
                    Entrada
                  </div>
                </SelectItem>
                <SelectItem value="OUT">
                  <div className="flex items-center gap-2">
                    {getMovementTypeIcon('OUT')}
                    Saída
                  </div>
                </SelectItem>
                <SelectItem value="ADJUSTMENT">
                  <div className="flex items-center gap-2">
                    {getMovementTypeIcon('ADJUSTMENT')}
                    Ajuste
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {getMovementTypeDescription(formData.type)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              placeholder="Digite a quantidade"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo *</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              placeholder="Descreva o motivo da movimentação"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Referência</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => handleChange('reference', e.target.value)}
              placeholder="Número do pedido, nota fiscal, etc."
            />
          </div>          {/* Preview do novo estoque */}
          {formData.quantity && (() => {
            const selectedProduct = product || products.find(p => p.id === formData.productId);
            if (!selectedProduct) return null;
            
            return (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Preview:</p>
                <p className="text-sm text-muted-foreground">
                  Estoque atual: {selectedProduct.stockQuantity} →{' '}
                  <span className={
                    formData.type === 'IN' 
                      ? 'text-green-600' 
                      : formData.type === 'OUT' 
                        ? 'text-red-600' 
                        : 'text-blue-600'
                  }>
                    {formData.type === 'IN' 
                      ? selectedProduct.stockQuantity + parseInt(formData.quantity || '0')
                      : formData.type === 'OUT'
                        ? selectedProduct.stockQuantity - parseInt(formData.quantity || '0')
                        : parseInt(formData.quantity || '0')
                    }
                  </span>
                  {formData.type === 'ADJUSTMENT' && ' (ajuste para)'}
                </p>
              </div>
            );
          })()}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Confirmar Movimentação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
