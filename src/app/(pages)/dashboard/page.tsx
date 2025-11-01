
'use client';

import { useApp } from '@/contexts/AppContext';
import { ShoppingBag, DollarSign, AlertCircle, Package, Users, ShoppingCart, Truck } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { pedidos, produtos } = useApp();

  const hoje = new Date().toISOString().split('T')[0];
  const pedidosHoje = pedidos.filter(p => p.criadoEm.startsWith(hoje));

  // FATURAMENTO REAL: CORRETO PARA COMANDA E OUTROS
  const faturamento = pedidosHoje
    .filter(p => {
      const isComandaPago = p.tipo === 'comanda' && p.status === 'pronto' && p.pago === true;
      const isEntreguePago = p.tipo !== 'comanda' && p.status === 'entregue' && p.pago === true;
      return isComandaPago || isEntreguePago;
    })
    .reduce((acc, p) => acc + p.total, 0);

  const baixoEstoque = produtos.filter(p => p.estoque < 5);

  const cards = [
    { 
      label: 'Pedidos Hoje', 
      value: pedidosHoje.length, 
      icon: ShoppingBag, 
      color: 'text-red-600', 
      bg: 'bg-red-50',
      border: 'border-red-200'
    },
    { 
      label: 'Faturamento Real', 
      value: `R$ ${faturamento.toFixed(2)}`, 
      icon: DollarSign, 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      border: 'border-green-200'
    },
    { 
      label: 'Estoque Baixo', 
      value: baixoEstoque.length, 
      icon: AlertCircle, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50',
      border: 'border-orange-200'
    },
  ];

  const atalhos = [
    { label: 'Produtos', href: '/produtos', icon: Package, bg: 'bg-red-100', iconColor: 'text-red-600', hover: 'hover:bg-red-200' },
    { label: 'Clientes', href: '/clientes', icon: Users, bg: 'bg-orange-100', iconColor: 'text-orange-600', hover: 'hover:bg-orange-200' },
    { label: 'Pedidos', href: '/pedidos', icon: ShoppingCart, bg: 'bg-yellow-100', iconColor: 'text-yellow-700', hover: 'hover:bg-yellow-200' },
    { label: 'Entregas', href: '/entregas', icon: Truck, bg: 'bg-green-100', iconColor: 'text-green-600', hover: 'hover:bg-green-200' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Título */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-lg text-gray-600 mt-1">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div
            key={label}
            className={`${bg} ${border} border-2 rounded-3xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{label}</p>
                <p className={`text-5xl font-extrabold mt-3 ${color}`}>
                  {typeof value === 'number' && value < 10 ? value : value}
                </p>
              </div>
              <div className={`p-4 rounded-2xl ${bg} shadow-inner`}>
                <Icon className={`w-12 h-12 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerta de Estoque Baixo */}
      {baixoEstoque.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-3xl p-8 shadow-md">
          <div className="flex items-center mb-5">
            <AlertCircle className="w-7 h-7 text-orange-600 mr-3" />
            <h3 className="text-xl font-bold text-orange-800">
              Produtos com Estoque Baixo ({baixoEstoque.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {baixoEstoque.map(p => (
              <div
                key={p.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-orange-200 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-800">{p.nome}</p>
                  <p className="text-sm text-gray-500">{p.categoria}</p>
                </div>
                <span className="text-2xl font-bold text-orange-600">
                  {p.estoque}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Atalhos */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Acesso Rápido</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {atalhos.map(({ label, href, icon: Icon, bg, iconColor, hover }) => (
            <Link
              key={href}
              href={href}
              className={`${bg} ${hover} rounded-3xl p-8 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 flex flex-col items-center justify-center text-center group`}
            >
              <div className={`p-4 rounded-2xl ${bg} shadow-inner group-hover:scale-110 transition-transform`}>
                <Icon className={`w-10 h-10 ${iconColor}`} />
              </div>
              <p className={`mt-4 font-bold text-lg ${iconColor.replace('text-', 'text-').replace('600', '700')}`}>
                {label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}