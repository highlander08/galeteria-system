'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Plus, Edit, Trash2, AlertCircle, Package } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Select from '@/components/Select';


type Produto = {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  categoria: 'galeto' | 'combo' | 'quentinha';
};

export default function ProdutosPage() {
  const { produtos, addProduto, updateProduto, deleteProduto } = useApp();
  const [filtro, setFiltro] = useState<'todos' | 'galeto' | 'combo' | 'quentinha'>('todos');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [form, setForm] = useState({
    nome: '',
    preco: '',
    estoque: '',
    categoria: 'galeto' as 'galeto' | 'combo' | 'quentinha'
  });

  const produtosFiltrados = filtro === 'todos' ? produtos : produtos.filter(p => p.categoria === filtro);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preco = parseFloat(form.preco);
    const estoque = parseInt(form.estoque);

    if (isNaN(preco) || isNaN(estoque) || !form.nome) return;

    if (editando) {
      updateProduto(editando.id, {
        nome: form.nome,
        preco,
        estoque,
        categoria: form.categoria
      });
      setEditando(null);
    } else {
      addProduto({
        nome: form.nome,
        preco,
        estoque,
        categoria: form.categoria
      });
    }
    setForm({ nome: '', preco: '', estoque: '', categoria: 'galeto' });
    setMostrarForm(false);
  };

  const cores = {
    galeto: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-600' },
    combo: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-600' },
    quentinha: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: 'text-yellow-600' }
  };

  const getCategoriaIcon = (cat: string) => {
    switch (cat) {
      case 'galeto': return <Package className="w-5 h-5" />;
      case 'combo': return <Package className="w-5 h-5" />;
      case 'quentinha': return <Package className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Produtos</h1>
          <p className="text-lg text-gray-600 mt-1">Gerencie seu cardápio com facilidade</p>
        </div>
        <Button
          onClick={() => setMostrarForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        {(['todos', 'galeto', 'combo', 'quentinha'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm ${
              filtro === cat
                ? 'bg-red-600 text-white shadow-md scale-105'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300 hover:shadow'
            }`}
          >
            {cat === 'todos' ? 'Todos' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <Card className={`border-2 ${editando ? 'border-orange-300 bg-orange-50/30' : 'border-red-200 bg-red-50/30'} rounded-3xl shadow-xl`}>
          <form onSubmit={handleSubmit} className="space-y-6 p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-red-700">
                {editando ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setMostrarForm(false);
                  setEditando(null);
                  setForm({ nome: '', preco: '', estoque: '', categoria: 'galeto' });
                }}
                className="text-gray-600 hover:text-red-600"
              >
                ✕ Fechar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Nome do Produto</label>
                <Input
                  value={form.nome}
                  onChange={e => setForm({ ...form, nome: e.target.value })}
                  required
                  placeholder="Ex: Galeto Tradicional"
                  className="text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Preço (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.preco}
                  onChange={e => setForm({ ...form, preco: e.target.value })}
                  required
                  placeholder="25.00"
                  className="text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Estoque</label>
                <Input
                  type="number"
                  min="0"
                  value={form.estoque}
                  onChange={e => setForm({ ...form, estoque: e.target.value })}
                  required
                  placeholder="30"
                  className="text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Categoria</label>
                <Select
                  value={form.categoria}
                  onChange={e => setForm({ ...form, categoria: e.target.value as any })}
                  className="text-lg font-medium"
                >
                  <option value="galeto">Galeto</option>
                  <option value="combo">Combo</option>
                  <option value="quentinha">Quentinha</option>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 text-lg shadow-lg"
              >
                {editando ? 'Salvar Alterações' : 'Criar Produto'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Lista de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {produtosFiltrados.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">Nenhum produto encontrado.</p>
          </div>
        ) : (
          produtosFiltrados.map(p => {
            const cor = cores[p.categoria];
            return (
              <Card
                key={p.id}
                className={`${cor.bg} ${cor.border} border-2 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${cor.text} flex items-center gap-2`}>
                    {getCategoriaIcon(p.categoria)}
                    {p.categoria}
                  </span>
                  {p.estoque < 5 && (
                    <span className="flex items-center text-orange-600 text-sm font-bold">
                      <AlertCircle className="w-5 h-5 mr-1" />
                      Baixo
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-extrabold text-gray-900 mb-3 line-clamp-2">{p.nome}</h3>
                
                <div className="space-y-2 mb-5">
                  <p className="text-3xl font-bold text-red-600">
                    R$ {p.preco.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    Estoque: <span className={`ml-1 font-bold ${p.estoque < 5 ? 'text-orange-600' : 'text-green-600'}`}>
                      {p.estoque} unid.
                    </span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 font-semibold border-gray-300 hover:bg-gray-100"
                    onClick={() => {
                      setEditando(p);
                      setForm({
                        nome: p.nome,
                        preco: p.preco.toString(),
                        estoque: p.estoque.toString(),
                        categoria: p.categoria
                      });
                      setMostrarForm(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 font-semibold bg-red-600 hover:bg-red-700"
                    onClick={() => deleteProduto(p.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </main>
  );
}