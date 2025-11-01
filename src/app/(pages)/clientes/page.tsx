'use client';

import { useState } from 'react';
import { useApp, type Cliente } from '@/contexts/AppContext';
import { Plus, Edit, Trash2, Search, User, Phone, MapPin } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';

export default function ClientesPage() {
  const { clientes, addCliente, updateCliente, deleteCliente } = useApp();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [form, setForm] = useState({ nome: '', telefone: '', endereco: '' });
  const [busca, setBusca] = useState('');

  const filtrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone.includes(busca)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.telefone || !form.endereco) return;

    if (editando) {
      updateCliente(editando.id, form);
      setEditando(null);
    } else {
      addCliente(form);
    }
    setForm({ nome: '', telefone: '', endereco: '' });
    setMostrarForm(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Clientes</h1>
          <p className="text-lg text-gray-600 mt-1">Gerencie seus clientes com facilidade</p>
        </div>
        <Button
          onClick={() => setMostrarForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg px-6 py-3"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Barra de Busca */}
      <Card className="border-2 border-gray-200 bg-white shadow-md p-5">
        <div className="flex items-center space-x-4">
          <Search className="w-6 h-6 text-gray-500" />
          <Input
            placeholder="Buscar por nome ou telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="text-lg text-gray-900 placeholder:text-gray-400 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </Card>

      {/* Formulário */}
      {mostrarForm && (
        <Card className={`border-2 ${editando ? 'border-orange-300 bg-orange-50/30' : 'border-red-200 bg-red-50/30'} rounded-3xl shadow-xl p-8`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-red-700">
              {editando ? 'Editar Cliente' : 'Novo Cliente'}
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setMostrarForm(false);
                setEditando(null);
                setForm({ nome: '', telefone: '', endereco: '' });
              }}
              className="text-gray-600 hover:text-red-600 font-medium"
            >
              ✕ Fechar
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center text-sm font-bold text-gray-800 mb-2">
                  <User className="w-4 h-4 mr-1.5 text-red-600" />
                  Nome Completo
                </label>
                <Input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                  placeholder="João Silva"
                  className="text-lg font-medium"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-bold text-gray-800 mb-2">
                  <Phone className="w-4 h-4 mr-1.5 text-red-600" />
                  Telefone
                </label>
                <Input
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  required
                  placeholder="(11) 99999-9999"
                  className="text-lg font-medium"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-bold text-gray-800 mb-2">
                  <MapPin className="w-4 h-4 mr-1.5 text-red-600" />
                  Endereço
                </label>
                <Input
                  value={form.endereco}
                  onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                  required
                  placeholder="Rua das Flores, 123 - Bairro"
                  className="text-lg font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 text-lg shadow-lg"
              >
                {editando ? 'Salvar Alterações' : 'Criar Cliente'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Lista de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtrados.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <User className="w-20 h-20 text-gray-300 mx-auto mb-5" />
            <p className="text-xl text-gray-500 font-medium">Nenhum cliente encontrado.</p>
            <p className="text-sm text-gray-400 mt-2">Tente buscar por nome ou telefone.</p>
          </div>
        ) : (
          filtrados.map((c) => (
            <Card
              key={c.id}
              className="border-2 border-gray-200 bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-extrabold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-red-600" />
                    {c.nome}
                  </h3>
                  <div className="mt-3 space-y-2">
                    <p className="flex items-center text-red-600 font-semibold">
                      <Phone className="w-4 h-4 mr-2" />
                      {c.telefone}
                    </p>
                    <p className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {c.endereco}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 font-bold border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    setEditando(c);
                    setForm({ nome: c.nome, telefone: c.telefone, endereco: c.endereco });
                    setMostrarForm(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-1.5" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1 font-bold bg-red-600 hover:bg-red-700"
                  onClick={() => deleteCliente(c.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}