'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  Plus, Trash2, ShoppingCart, User, Package, Clock,
  CheckCircle, Truck, AlertCircle, BellRing, XCircle, DollarSign
} from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Select from '@/components/Select';
import Input from '@/components/Input';

export default function PedidosPage() {
  const { 
    produtos, clientes, pedidos, addPedido, updatePedidoStatus, 
    nextPedidoId, cancelarPedido, iniciarEntrega, marcarProntoParaEntrega 
  } = useApp();

  const [mostrarForm, setMostrarForm] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<
    'todos' | 'em_preparo' | 'pronto' | 'saiu_para_entrega' | 'aguardando_retirada' | 'entregue' | 'cancelado'
  >('todos');

  const [form, setForm] = useState({
    clienteId: '',
    tipo: 'retirada' as 'entrega' | 'retirada' | 'comanda',
    itens: [] as { produtoId: string; qtd: string }[]
  });

  const pedidosFiltrados = filtroStatus === 'todos'
    ? pedidos
    : pedidos.filter(p => p.status === filtroStatus);

  const handleAddItem = () => {
    setForm({ ...form, itens: [...form.itens, { produtoId: '', qtd: '1' }] });
  };

  const handleRemoveItem = (index: number) => {
    setForm({ ...form, itens: form.itens.filter((_, i) => i !== index) });
  };

  const calcularTotal = () => {
    return form.itens.reduce((total, item) => {
      const p = produtos.find(p => p.id === Number(item.produtoId));
      return total + (p ? p.preco * Number(item.qtd) : 0);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itensValidos = form.itens.filter(i => i.produtoId && Number(i.qtd) > 0);
    if (itensValidos.length === 0 || !form.clienteId) return;

    addPedido({
      clienteId: Number(form.clienteId),
      tipo: form.tipo,
      itens: itensValidos.map(i => ({ produtoId: Number(i.produtoId), qtd: Number(i.qtd) })),
      total: calcularTotal()
    });

    setForm({ clienteId: '', tipo: 'retirada', itens: [] });
    setMostrarForm(false);
  };

  const getStatusConfig = (status: typeof filtroStatus) => {
    const config = {
      todos: { bg: 'bg-gray-100', text: 'text-gray-700', icon: null },
      em_preparo: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock className="w-4 h-4" /> },
      pronto: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Package className="w-4 h-4" /> },
      saiu_para_entrega: { bg: 'bg-purple-100', text: 'text-purple-700', icon: <Truck className="w-4 h-4" /> },
      aguardando_retirada: { bg: 'bg-orange-100', text: 'text-orange-700', icon: <BellRing className="w-4 h-4" /> },
      entregue: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle className="w-4 h-4" /> },
      cancelado: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle className="w-4 h-4" /> }
    };
    return config[status] || config.todos;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Pedidos</h1>
          <p className="text-lg text-gray-600 mt-1">Gerencie todos os pedidos da galeteria</p>
        </div>
        <Button
          onClick={() => setMostrarForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg px-6 py-3"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Pedido
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        {(['todos', 'em_preparo', 'pronto', 'saiu_para_entrega', 'aguardando_retirada', 'entregue', 'cancelado'] as const).map(s => {
          const config = getStatusConfig(s);
          return (
            <button
              key={s}
              onClick={() => setFiltroStatus(s)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm flex items-center gap-2 ${
                filtroStatus === s
                  ? 'bg-red-600 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300 hover:shadow'
              }`}
            >
              {config.icon}
              {s === 'todos' ? 'Todos' : s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          );
        })}
      </div>

      {/* Formulário de Novo Pedido */}
      {mostrarForm && (
        <Card className="border-2 border-red-200 bg-red-50/30 rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-red-700 flex items-center gap-2">
              <ShoppingCart className="w-7 h-7" />
              Novo Pedido #{nextPedidoId}
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setMostrarForm(false);
                setForm({ clienteId: '', tipo: 'retirada', itens: [] });
              }}
              className="text-gray-600 hover:text-red-600 font-medium"
            >
              Fechar
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-bold text-gray-800 mb-2">
                  <User className="w-4 h-4 mr-1.5 text-red-600" />
                  Cliente
                </label>
                <Select
                  value={form.clienteId}
                  onChange={e => setForm({ ...form, clienteId: e.target.value })}
                  required
                  className="text-lg font-medium"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nome} - {c.telefone}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="flex items-center text-sm font-bold text-gray-800 mb-2">
                  <Package className="w-4 h-4 mr-1.5 text-red-600" />
                  Tipo de Pedido
                </label>
                <Select
                  value={form.tipo}
                  onChange={e => setForm({ ...form, tipo: e.target.value as any })}
                  className="text-lg font-medium"
                >
                  <option value="retirada">Retirada</option>
                  <option value="entrega">Entrega</option>
                  <option value="comanda">Comanda</option>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-red-600" />
                  Itens do Pedido
                </label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="font-semibold">
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </div>

              {form.itens.length === 0 ? (
                <p className="text-center text-gray-500 py-6 bg-white rounded-xl">Nenhum item adicionado</p>
              ) : (
                form.itens.map((item, i) => {
                  const produtoSelecionado = produtos.find(p => p.id === Number(item.produtoId));
                  const subtotal = produtoSelecionado ? produtoSelecionado.preco * Number(item.qtd || 0) : 0;
                  return (
                    <div key={i} className="flex gap-3 items-center p-4 bg-white rounded-xl border-2 border-gray-200">
                      <Select
                        value={item.produtoId}
                        onChange={e => {
                          const novos = [...form.itens];
                          novos[i].produtoId = e.target.value;
                          setForm({ ...form, itens: novos });
                        }}
                        className="flex-1 text-base font-medium"
                      >
                        <option value="">Selecione um produto</option>
                        {produtos.map(p => (
                          <option key={p.id} value={p.id} disabled={p.estoque === 0}>
                            {p.nome} - R$ {p.preco.toFixed(2)} ({p.estoque > 0 ? `${p.estoque} em estoque` : 'Esgotado'})
                          </option>
                        ))}
                      </Select>

                      <Input
                        type="number"
                        min="1"
                        value={item.qtd}
                        onChange={e => {
                          const novos = [...form.itens];
                          novos[i].qtd = e.target.value || '1';
                          setForm({ ...form, itens: novos });
                        }}
                        className="w-20 text-center text-lg font-medium"
                        placeholder="1"
                      />

                      {produtoSelecionado && (
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-700 whitespace-nowrap">
                          <span className="text-red-600">{produtoSelecionado.nome}</span>
                          <span className="text-xs text-gray-500">× R$ {produtoSelecionado.preco.toFixed(2)}</span>
                          {subtotal > 0 && (
                            <span className="text-green-600">= R$ {subtotal.toFixed(2)}</span>
                          )}
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveItem(i)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-between items-center pt-6 border-t-2 border-gray-300">
              <p className="text-3xl font-extrabold text-red-600">
                Total: R$ {calcularTotal().toFixed(2)}
              </p>
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 text-lg shadow-lg"
                >
                  Criar Pedido
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* Lista de Pedidos */}
      <div className="space-y-6">
        {pedidosFiltrados.length === 0 ? (
          <Card className="text-center py-20 bg-gradient-to-b from-gray-50 to-white rounded-3xl">
            <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-5" />
            <p className="text-xl text-gray-500 font-medium">Nenhum pedido encontrado.</p>
          </Card>
        ) : (
          pedidosFiltrados.map(p => {
            const cliente = clientes.find(c => c.id === p.clienteId);
            const config = getStatusConfig(p.status);

            const isRetiradaPronto = p.tipo === 'retirada' && p.status === 'pronto';
            const isAguardandoRetirada = p.tipo === 'retirada' && p.status === 'aguardando_retirada';
            const podeCancelar = !['entregue', 'cancelado'].includes(p.status);
            const isEntregaPronto = p.tipo === 'entrega' && p.status === 'pronto';

            return (
              <Card
                key={p.id}
                className={`border-2 ${config.bg} rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]`}
              >
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-2xl font-extrabold text-red-700 flex items-center gap-2">
                      <ShoppingCart className="w-6 h-6" />
                      Pedido #{p.id}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {cliente?.nome || 'Cliente não encontrado'}
                      <span className="mx-2">•</span>
                      {new Date(p.criadoEm).toLocaleString('pt-BR')}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {p.tipo === 'retirada' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                          <Package className="w-3 h-3" />
                          Retirada
                        </span>
                      )}
                      {p.tipo === 'entrega' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                          <Truck className="w-3 h-3" />
                          Entrega
                        </span>
                      )}
                      {p.tipo === 'comanda' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                          <Package className="w-3 h-3" />
                          Comanda
                        </span>
                      )}
                      {p.status === 'entregue' && (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          p.pago ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          <DollarSign className="w-3 h-3" />
                          {p.pago ? 'Pago' : 'Pendente'}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${config.text} flex items-center gap-2`}>
                    {config.icon}
                    {p.status === 'aguardando_retirada' ? 'Aguardando Retirada' : 
                     p.status === 'cancelado' ? 'Cancelado' :
                     p.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>

                {/* Itens do Pedido */}
                <div className="bg-white p-4 rounded-xl mb-5 space-y-3 border">
                  {p.itens.map((item, i) => {
                    const prod = produtos.find(pr => pr.id === item.produtoId);
                    return prod ? (
                      <div key={i} className="flex justify-between items-center text-base">
                        <span className="font-bold text-black flex items-center gap-1">
                          {prod.nome} <span className="text-gray-600 font-normal">× {item.qtd}</span>
                        </span>
                        <span className="text-red-600 font-bold">
                          R$ {(prod.preco * item.qtd).toFixed(2)}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>

                {/* AVISOS */}
                {isRetiradaPronto && (
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-xl p-4 mb-4">
                    <p className="text-base font-bold text-orange-800 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Informe o cliente que o pedido está pronto!
                    </p>
                  </div>
                )}

                {p.status === 'cancelado' && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-4">
                    <p className="text-base font-bold text-red-800 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Pedido cancelado – estoque devolvido
                    </p>
                  </div>
                )}

                {/* Total + Ações */}
                <div className="flex justify-between items-center">
                  <p className="text-3xl font-extrabold text-red-600">
                    Total: R$ {p.total.toFixed(2)}
                  </p>
                  <div className="flex gap-3 flex-wrap">

                    {/* COMANDA: Pronto = Pago */}
                    {p.status === 'em_preparo' && p.tipo === 'comanda' && (
                      <Button
                        size="sm"
                        onClick={() => updatePedidoStatus(p.id, 'pronto')}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Pronto e Pago
                      </Button>
                    )}

                    {/* RETIRADA: Pode Ser Retirado */}
                    {p.status === 'em_preparo' && p.tipo === 'retirada' && (
                      <Button
                        size="sm"
                        onClick={() => updatePedidoStatus(p.id, 'pronto')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                      >
                        <Package className="w-4 h-4 mr-1" />
                        Pode Ser Retirado
                      </Button>
                    )}

                    {/* ENTREGA: Pronto para Entrega */}
                    {p.tipo === 'entrega' && p.status === 'em_preparo' && (
                      <Button
                        size="sm"
                        onClick={() => marcarProntoParaEntrega(p.id)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold"
                      >
                        <Package className="w-4 h-4 mr-1" />
                        Pronto para Entrega
                      </Button>
                    )}

                    {/* ENTREGA: Iniciar Entrega */}
                    {p.tipo === 'entrega' && p.status === 'pronto' && (
                      <Button
                        size="sm"
                        onClick={() => iniciarEntrega(p.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                      >
                        <Truck className="w-4 h-4 mr-1" />
                        Iniciar Entrega
                      </Button>
                    )}

                    {/* Cliente Informado */}
                    {isRetiradaPronto && (
                      <Button
                        size="sm"
                        onClick={() => updatePedidoStatus(p.id, 'aguardando_retirada')}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold"
                      >
                        <BellRing className="w-4 h-4 mr-1" />
                        Cliente Informado
                      </Button>
                    )}

                    {/* Retirado (pergunta se pagou) */}
                    {isAguardandoRetirada && (
                      <Button
                        size="sm"
                        onClick={() => {
                          const pagou = confirm('O cliente já pagou?');
                          updatePedidoStatus(p.id, 'entregue', pagou);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Retirado
                      </Button>
                    )}

                    {/* ENTREGA: Entregue */}
                    {p.status === 'saiu_para_entrega' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          const pagou = confirm('O cliente já pagou?');
                          updatePedidoStatus(p.id, 'entregue', pagou);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Entregue
                      </Button>
                    )}

                    {/* CANCELAR */}
                    {podeCancelar && (
                      <Button
                        size="sm"
                        onClick={() => {
                          if (confirm('Tem certeza que deseja cancelar este pedido?\nO estoque será devolvido.')) {
                            cancelarPedido(p.id);
                          }
                        }}
                        className="bg-red-600 hover:bg-red-800 text-white font-bold"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </main>
  );
}