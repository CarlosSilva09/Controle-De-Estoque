"use client";

import { useState, useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { Product, StockMovement } from "@/lib/types";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/stock-utils";

interface ExportDataProps {
  products: Product[];
  movements: StockMovement[];
}

export function ExportData({ products, movements }: ExportDataProps) {
  const [exportType, setExportType] = useState<"products" | "movements" | "all">("products");
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Fecha o popover ao clicar fora
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error("Nenhum dado para exportar");
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape special characters and wrap in quotes if needed
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(",")
      )
    ].join("\n");

    downloadFile(csvContent, filename, "text/csv");
  };

  const exportToJSON = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error("Nenhum dado para exportar");
      return;
    }

    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, filename, "application/json");
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Arquivo ${filename} baixado com sucesso!`);
  };

  const prepareProductsData = () => {
    return products.map(product => ({
      ID: product.id,
      Nome: product.name,
      SKU: product.sku,
      Descrição: product.description || "",
      Categoria: product.category,
      Preço: formatCurrency(product.price),
      "Quantidade em Estoque": product.stockQuantity,
      "Estoque Mínimo": product.minStockLevel,
      "Estoque Máximo": product.maxStockLevel,
      Fornecedor: product.supplier || "",
      Localização: product.location || "",
      "Última Atualização": formatDate(product.lastUpdated),
      "Data de Criação": product.createdAt ? formatDate(product.createdAt) : "",
    }));
  };

  const prepareMovementsData = () => {
    return movements.map(movement => ({
      ID: movement.id,
      "Produto ID": movement.productId,
      Tipo: movement.type === "IN" ? "Entrada" : movement.type === "OUT" ? "Saída" : "Ajuste",
      Quantidade: movement.quantity,
      Motivo: movement.reason || "",
      "Data e Hora": formatDate(movement.timestamp),
      Usuário: movement.userId || "",
    }));
  };

  const handleExport = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    
    if (exportType === "products") {
      const data = prepareProductsData();
      const filename = `produtos_${timestamp}.${format}`;
      
      if (format === "csv") {
        exportToCSV(data, filename);
      } else {
        exportToJSON(data, filename);
      }
    } else if (exportType === "movements") {
      const data = prepareMovementsData();
      const filename = `movimentacoes_${timestamp}.${format}`;
      
      if (format === "csv") {
        exportToCSV(data, filename);
      } else {
        exportToJSON(data, filename);
      }
    } else {
      // Export all data
      const allData = {
        produtos: prepareProductsData(),
        movimentacoes: prepareMovementsData(),
        dataExportacao: new Date().toISOString(),
      };
      
      if (format === "json") {
        const filename = `backup_completo_${timestamp}.json`;
        exportToJSON([allData], filename);
      } else {
        // For CSV, export products and movements as separate files in a zip would be ideal
        // For now, we'll just export products
        toast.info("Para exportar todos os dados em CSV, selecione JSON ou exporte produtos e movimentações separadamente");
        return;
      }
    }
  };

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-5 py-3 shadow-lg shadow-blue-100 dark:shadow-none transition-all text-base"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <Download className="h-5 w-5" />
        Exportar Dados
      </button>
      {open && (
        <div
          ref={popoverRef}
          className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#23232a] shadow-xl border border-blue-100 dark:border-blue-900 p-5 flex flex-col gap-3 z-50 animate-fade-in"
        >
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400" htmlFor="export-type">Tipo</label>
            <select
              id="export-type"
              className="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#23232a] px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={exportType}
              onChange={e => setExportType(e.target.value as any)}
            >
              <option value="products">Produtos</option>
              <option value="movements">Movimentações</option>
            </select>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1" htmlFor="export-format">Formato</label>
            <select
              id="export-format"
              className="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#23232a] px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={format}
              onChange={e => setFormat(e.target.value as any)}
            >
              <option value="csv">CSV</option>
            </select>
          </div>
          <button
            className="mt-2 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 transition-colors text-sm shadow-md shadow-blue-100 dark:shadow-none"
            onClick={() => { handleExport(); setOpen(false); }}
            type="button"
          >
            <Download className="h-4 w-4 mr-1" />
            Exportar {exportType === "products" ? "Produtos" : "Movimentações"}
          </button>
        </div>
      )}
    </div>
  );
}
