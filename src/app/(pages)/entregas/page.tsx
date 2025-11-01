'use client';

import { useApp } from '@/contexts/AppContext';
import { Truck, CheckCircle, Clock, User, MapPin, Package } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function EntregasPage() {
  const { 
    pedidos, 
    clientes, 
    entregas, 
    updatePedidoStatus, 
    iniciarEntrega 
  } = useApp();

  // Entregas pendentes: pedido pronto ou saiu_para_entrega + entrega a_caminho
  const entregasPendentes = entregas
    .filter(e => e.status === 'a_caminho')
    .map(e => {
      const pedido = pedidos.find(p => p.id === e.pedidoId && p.tipo === 'entrega');
      const cliente = pedido ? clientes.find(c => c.id === pedido.clienteId) : null;
      return { entrega: e, pedido, cliente };
    })
    .filter(item => item.pedido && item.cliente);

  const pedidosProntos = entregasPendentes.filter(item => item.pedido?.status === 'pronto');
  const pedidosEmAndamento = entregasPendentes.filter(item => item.pedido?.status === 'saiu_para_entrega');

  const handleIniciar = (entregaId: number, pedidoId: number) => {
    updatePedidoStatus(pedidoId, 'saiu_para_entrega');
    iniciarEntrega(entregaId);
  };

  const handleFinalizar = (pedidoId: number) => {
    const pagou = confirm('O cliente já pagou?');
    updatePedidoStatus(pedidoId, 'entregue', pagou);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Truck className="w-10 h-10 text-green-600" />
            Painel de Entregas
          </h1>
          <p className="text-lg text-gray-600 mt-1">Gerencie entregas em tempo real</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Prontos para Entrega */}
        <Card className="border-2 border-green-200 bg-green-50/30 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between mb-6 p-2">
            <h3 className="text-2xl font-bold text-green-700 flex items-center gap-2">
              <Package className="w-7 h-7" />
              Prontos para Entrega
            </h3>
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
              {pedidosProntos.length}
            </span>
          </div>

          <div className="space-y-4">
            {pedidosProntos.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Nenhum pedido pronto</p>
              </div>
            ) : (
              pedidosProntos.map(({ entrega, pedido, cliente }) => (
                <div
                  key={entrega.id}
                  className="bg-white p-5 rounded-2xl border-2 border-green-200 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xl font-extrabold text-black flex items-center gap-2">
                        <Package className="w-5 h-5 text-green-600" />
                        Pedido #{pedido!.id}
                      </p>
                      <p className="text-base font-bold text-black mt-1 flex items-center gap-1">
                        <User className="w-4 h-4 text-green-600" />
                        {cliente!.nome}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleIniciar(entrega.id, pedido!.id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold"
                    >
                      <Truck className="w-4 h-4 mr-1" />
                      Iniciar
                    </Button>
                  </div>

                  <p className="text-sm text-gray-700 flex items-center gap-1 mt-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    {cliente!.endereco}
                  </p>

                  <div className="mt-4 pt-3 border-t border-green-100">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-extrabold text-black">Total:</p>
                      <p className="text-2xl font-extrabold text-green-600">
                        R$ {pedido!.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Em Andamento */}
        <Card className="border-2 border-blue-200 bg-blue-50/30 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between mb-6 p-2">
            <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
              <Truck className="w-7 h-7" />
              Em Andamento
            </h3>
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
              {pedidosEmAndamento.length}
            </span>
          </div>

          <div className="space-y-4">
            {pedidosEmAndamento.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <Truck className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Nenhuma entrega em andamento</p>
              </div>
            ) : (
              pedidosEmAndamento.map(({ entrega, pedido, cliente }) => (
                <div
                  key={entrega.id}
                  className="bg-white p-5 rounded-2xl border-2 border-blue-200 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xl font-extrabold text-black flex items-center gap-2">
                        <Truck className="w-5 h-5 text-blue-600" />
                        Pedido #{pedido!.id}
                      </p>
                      <p className="text-base font-bold text-black mt-1 flex items-center gap-1">
                        <User className="w-4 h-4 text-blue-600" />
                        {cliente!.nome}
                      </p>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 mt-2">
                        <Clock className="w-3 h-3" />
                        A caminho
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleFinalizar(pedido!.id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Entregue
                    </Button>
                  </div>

                  <p className="text-sm text-gray-700 flex items-center gap-1 mt-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    {cliente!.endereco}
                  </p>

                  <div className="mt-4 pt-3 border-t border-blue-100">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-extrabold text-black">Total:</p>
                      <p className="text-2xl font-extrabold text-blue-600">
                        R$ {pedido!.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}