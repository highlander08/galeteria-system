'use client';

import React, { createContext, useContext, useState } from 'react';

// === TIPOS ===
export interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  categoria: 'galeto' | 'combo' | 'quentinha';
}

export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
}

export interface ItemPedido {
  produtoId: number;
  qtd: number;
}

export interface Pedido {
  id: number;
  clienteId: number;
  tipo: 'entrega' | 'retirada' | 'comanda';
  itens: ItemPedido[];
  total: number;
  status: 'em_preparo' | 'pronto' | 'saiu_para_entrega' | 'aguardando_retirada' | 'entregue' | 'cancelado';
  criadoEm: string;
  pago: boolean;
}

export interface Entrega {
  id: number;
  pedidoId: number;
  status: 'a_caminho' | 'entregue';
  iniciadoEm?: string;
}

interface AppContextType {
  produtos: Produto[];
  clientes: Cliente[];
  pedidos: Pedido[];
  entregas: Entrega[];
  nextPedidoId: number;
  nextEntregaId: number;

  addProduto: (produto: Omit<Produto, 'id'>) => void;
  updateProduto: (id: number, produto: Partial<Produto>) => void;
  deleteProduto: (id: number) => void;

  addCliente: (cliente: Omit<Cliente, 'id'>) => void;
  updateCliente: (id: number, cliente: Partial<Cliente>) => void;
  deleteCliente: (id: number) => void;

  addPedido: (pedido: Omit<Pedido, 'id' | 'criadoEm' | 'status' | 'pago'>) => void;
  updatePedidoStatus: (id: number, status: Pedido['status'], pago?: boolean) => void;
  cancelarPedido: (id: number) => void;
  marcarProntoParaEntrega: (pedidoId: number) => void;

  addEntrega: (entrega: Omit<Entrega, 'id'>) => void;
  iniciarEntrega: (pedidoId: number) => void;
}

// === CONTEXTO ===
const AppContext = createContext<AppContextType | undefined>(undefined);

// === LOCAL STORAGE ===
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Erro ao salvar ${key}:`, error);
    }
  };

  return [storedValue, setValue];
};

// === PRODUTOS INICIAIS ===
const produtosIniciais: Produto[] = [
  { id: 1, nome: "Galeto Tradicional", preco: 25, estoque: 30, categoria: "galeto" },
  { id: 2, nome: "Galeto com Arroz, Feijão e Farofa", preco: 30, estoque: 20, categoria: "galeto" },
  { id: 3, nome: "Galeto Família (2 pessoas)", preco: 55, estoque: 15, categoria: "galeto" },
  { id: 4, nome: "Combo Executivo (Galeto + Refri 350ml)", preco: 35, estoque: 10, categoria: "combo" },
  { id: 5, nome: "Combo Família (2 Galetos + 2 Refri 1L)", preco: 90, estoque: 5, categoria: "combo" },
  { id: 6, nome: "Quentinha Simples", preco: 12, estoque: 50, categoria: "quentinha" },
  { id: 7, nome: "Quentinha Completa", preco: 15, estoque: 40, categoria: "quentinha" }
];

// === PROVIDER ===
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [produtos, setProdutos] = useLocalStorage<Produto[]>('produtos', produtosIniciais);
  const [clientes, setClientes] = useLocalStorage<Cliente[]>('clientes', []);
  const [pedidos, setPedidos] = useLocalStorage<Pedido[]>('pedidos', []);
  const [entregas, setEntregas] = useLocalStorage<Entrega[]>('entregas', []);
  const [nextPedidoId, setNextPedidoId] = useLocalStorage<number>('nextPedidoId', 1);
  const [nextEntregaId, setNextEntregaId] = useLocalStorage<number>('nextEntregaId', 1);

  // === PRODUTOS ===
  const addProduto = (produto: Omit<Produto, 'id'>) => {
    const novo = { ...produto, id: Date.now() };
    setProdutos([...produtos, novo]);
  };

  const updateProduto = (id: number, updates: Partial<Produto>) => {
    setProdutos(produtos.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduto = (id: number) => {
    setProdutos(produtos.filter(p => p.id !== id));
  };

  // === CLIENTES ===
  const addCliente = (cliente: Omit<Cliente, 'id'>) => {
    const novo = { ...cliente, id: Date.now() };
    setClientes([...clientes, novo]);
  };

  const updateCliente = (id: number, updates: Partial<Cliente>) => {
    setClientes(clientes.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCliente = (id: number) => {
    setClientes(clientes.filter(c => c.id !== id));
  };

  // === PEDIDOS ===
  const addPedido = (pedido: Omit<Pedido, 'id' | 'criadoEm' | 'status' | 'pago'>) => {
    const novoId = nextPedidoId;
    const novo: Pedido = {
      ...pedido,
      id: novoId,
      criadoEm: new Date().toISOString(),
      status: 'em_preparo',
      pago: pedido.tipo === 'comanda' ? true : false
    };

    setPedidos([...pedidos, novo]);
    setNextPedidoId(novoId + 1);

    // Atualiza estoque
    pedido.itens.forEach(item => {
      const produto = produtos.find(p => p.id === item.produtoId);
      if (produto && produto.estoque >= item.qtd) {
        updateProduto(produto.id, { estoque: produto.estoque - item.qtd });
      }
    });

    // CRIA ENTREGA AUTOMÁTICA SE FOR ENTREGA
    if (pedido.tipo === 'entrega') {
      addEntrega({ pedidoId: novoId, status: 'a_caminho' });
    }
  };

  const updatePedidoStatus = (id: number, status: Pedido['status'], pago?: boolean) => {
    setPedidos(pedidos.map(p => {
      if (p.id === id) {
        const novoPago = pago !== undefined
          ? pago
          : (p.tipo === 'comanda' && status === 'pronto') ? true : p.pago;

        return { ...p, status, pago: novoPago };
      }
      return p;
    }));
  };

  const cancelarPedido = (id: number) => {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido || pedido.status === 'entregue' || pedido.status === 'cancelado') return;

    // Devolve estoque
    pedido.itens.forEach(item => {
      const produto = produtos.find(p => p.id === item.produtoId);
      if (produto) {
        updateProduto(produto.id, { estoque: produto.estoque + item.qtd });
      }
    });

    updatePedidoStatus(id, 'cancelado');
  };

  const marcarProntoParaEntrega = (pedidoId: number) => {
    // Atualiza o status do pedido para "pronto"
    updatePedidoStatus(pedidoId, 'pronto');
    
    // Cria uma entrega para este pedido se ainda não existir
    const entregaExistente = entregas.find(e => e.pedidoId === pedidoId);
    if (!entregaExistente) {
      addEntrega({ 
        pedidoId, 
        status: 'a_caminho'
      });
    }
  };

  // === ENTREGAS ===
  const addEntrega = (entrega: Omit<Entrega, 'id'>) => {
    const nova: Entrega = { ...entrega, id: nextEntregaId };
    setEntregas([...entregas, nova]);
    setNextEntregaId(nextEntregaId + 1);
  };

  const iniciarEntrega = (pedidoId: number) => {
    setEntregas(entregas.map(e =>
      e.pedidoId === pedidoId ? { ...e, status: 'a_caminho', iniciadoEm: new Date().toISOString() } : e
    ));
    // Atualiza pedido para saiu_para_entrega
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (pedido) {
      updatePedidoStatus(pedidoId, 'saiu_para_entrega');
    }
  };

  // === VALUE ===
  return (
    <AppContext.Provider value={{
      produtos, clientes, pedidos, entregas,
      nextPedidoId, nextEntregaId,

      addProduto, updateProduto, deleteProduto,
      addCliente, updateCliente, deleteCliente,
      addPedido, updatePedidoStatus, cancelarPedido, marcarProntoParaEntrega,
      addEntrega, iniciarEntrega
    }}>
      {children}
    </AppContext.Provider>
  );
};

// === HOOK ===
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider');
  return context;
};