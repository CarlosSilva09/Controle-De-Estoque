"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { StockRequest } from "@/lib/types";
import { toast } from "sonner";

interface RequestsContextType {
  requests: StockRequest[];
  addRequest: (request: Omit<StockRequest, 'id' | 'requestedAt'>) => void;
  updateRequestStatus: (id: string, status: StockRequest['status'], notes?: string) => void;
  removeRequest: (id: string) => void;
  getRequestsByStatus: (status: StockRequest['status']) => StockRequest[];
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export function useRequests() {
  const context = useContext(RequestsContext);
  if (!context) {
    throw new Error("useRequests must be used within a RequestsProvider");
  }
  return context;
}

interface RequestsProviderProps {
  children: ReactNode;
}

export function RequestsProvider({ children }: RequestsProviderProps) {  const [requests, setRequests] = useState<StockRequest[]>([
    // Dados mockados para demonstração
    {
      id: '1',
      productId: '1',
      productName: 'Smartphone Samsung Galaxy',
      quantity: 30,
      priority: 'high',
      status: 'pending',
      requestedAt: new Date('2025-06-01'),
      reason: 'Estoque abaixo do mínimo',
      supplier: 'TechSupply Ltda',
      estimatedCost: 15000,
      requestedBy: 'Sistema Automático',
      department: 'Estoque'
    },
    {
      id: '2',
      productId: '5',
      productName: 'Tênis Adidas Running',
      quantity: 40,
      priority: 'high',
      status: 'pending',
      requestedAt: new Date('2025-06-01'),
      reason: 'Produto em falta',
      supplier: 'Fashion World',
      estimatedCost: 12000,
      requestedBy: 'Sistema Automático',
      department: 'Estoque'
    },
    {
      id: '3',
      productId: '3',
      productName: 'Livro "Dom Casmurro"',
      quantity: 20,
      priority: 'medium',
      status: 'approved',
      requestedAt: new Date('2025-05-28'),
      updatedAt: new Date('2025-05-30'),
      reason: 'Prevenção de falta',
      supplier: 'Editora Brasil',
      estimatedCost: 1598,
      requestedBy: 'Sistema Automático',
      department: 'Estoque'
    }
  ]);
  const addRequest = (requestData: Omit<StockRequest, 'id' | 'requestedAt'>) => {
    const newRequest: StockRequest = {
      ...requestData,
      id: Date.now().toString(),
      requestedAt: new Date()
    };

    setRequests(prev => [newRequest, ...prev]);
    toast.success(`Solicitação criada para ${requestData.productName}!`, {
      description: `${requestData.quantity} unidades solicitadas`
    });
  };

  const updateRequestStatus = (id: string, status: StockRequest['status'], notes?: string) => {
    setRequests(prev => prev.map(request => 
      request.id === id 
        ? { 
            ...request, 
            status, 
            updatedAt: new Date(),
            notes: notes || request.notes 
          }
        : request
    ));

    const statusMessages = {
      pending: 'Solicitação pendente',
      approved: 'Solicitação aprovada',
      rejected: 'Solicitação rejeitada',
      ordered: 'Pedido realizado',
      delivered: 'Produto entregue'
    };

    toast.success(statusMessages[status]);
  };

  const removeRequest = (id: string) => {
    setRequests(prev => prev.filter(request => request.id !== id));
    toast.success('Solicitação removida');
  };

  const getRequestsByStatus = (status: StockRequest['status']) => {
    return requests.filter(request => request.status === status);
  };

  return (
    <RequestsContext.Provider
      value={{
        requests,
        addRequest,
        updateRequestStatus,
        removeRequest,
        getRequestsByStatus
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
}
