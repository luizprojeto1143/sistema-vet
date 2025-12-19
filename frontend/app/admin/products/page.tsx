"use client";
import { useState, useEffect } from 'react';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>({});

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/products', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setProducts(await res.json());
        setLoading(false);
    };

    const handleEdit = (prod: any) => {
        setEditingId(prod.id);
        setEditForm({ ...prod });
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/products/${editingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                name: editForm.name,
                salePrice: parseFloat(editForm.salePrice),
                currentStock: parseFloat(editForm.currentStock),
                boosterIntervalDays: editForm.boosterIntervalDays ? parseInt(editForm.boosterIntervalDays) : null
            })
        });

        if (res.ok) {
            alert('Produto atualizado!');
            setEditingId(null);
            loadProducts();
        } else {
            alert('Erro ao salvar. Verifique se o backend suporta PATCH /products/:id');
        }
    };

    if (loading) return <div className="p-10">Carregando Estoque...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">📦 Inteligência de Estoque & Vacinas</h1>
            <p className="text-gray-500 mb-8">Configure aqui o comportamento inteligente dos produtos no sistema.</p>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden md:col-span-2">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-4 font-bold text-gray-600">Produto</th>
                            <th className="p-4 font-bold text-gray-600">Preço (R$)</th>
                            <th className="p-4 font-bold text-gray-600">Estoque Atual</th>
                            <th className="p-4 font-bold text-gray-600 text-center">Reforço Automático (Dias)</th>
                            <th className="p-4 font-bold text-gray-600 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.map(prod => (
                            <tr key={prod.id} className="hover:bg-gray-50 group">
                                <td className="p-4">
                                    {editingId === prod.id ? (
                                        <input
                                            className="border p-2 rounded w-full"
                                            value={editForm.name}
                                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                        />
                                    ) : <span className="font-bold text-gray-800">{prod.name}</span>}
                                </td>
                                <td className="p-4">
                                    {editingId === prod.id ? (
                                        <input
                                            type="number"
                                            className="border p-2 rounded w-24"
                                            value={editForm.salePrice}
                                            onChange={e => setEditForm({ ...editForm, salePrice: e.target.value })}
                                        />
                                    ) : `R$ ${prod.salePrice}`}
                                </td>
                                <td className="p-4">
                                    {editingId === prod.id ? (
                                        <input
                                            type="number"
                                            className="border p-2 rounded w-20"
                                            value={editForm.currentStock}
                                            onChange={e => setEditForm({ ...editForm, currentStock: e.target.value })}
                                        />
                                    ) : (
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${prod.currentStock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {prod.currentStock} un
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    {editingId === prod.id ? (
                                        <input
                                            type="number"
                                            placeholder="Ex: 21"
                                            className="border p-2 rounded w-20 text-center border-blue-300 bg-blue-50"
                                            value={editForm.boosterIntervalDays || ''}
                                            onChange={e => setEditForm({ ...editForm, boosterIntervalDays: e.target.value })}
                                        />
                                    ) : (
                                        prod.boosterIntervalDays ?
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">↻ {prod.boosterIntervalDays} dias</span>
                                            : <span className="text-gray-300">-</span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    {editingId === prod.id ? (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Salvar</button>
                                            <button onClick={() => setEditingId(null)} className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400">Cancel</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleEdit(prod)} className="text-blue-600 hover:text-blue-800 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                            ✏️ Editar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-2">🧠 Lógica do Sistema</h3>
                <p className="text-sm text-blue-700">
                    Ao definir o intervalo de reforço aqui (ex: 365 dias para Raiva), o sistema irá ler essa configuração durante a consulta.
                    Se o Veterinário utilizar este item, o Agendamento de Retorno (Vacina) será criado automaticamente para a data exata.
                </p>
                <p className="text-sm text-blue-700 mt-2">
                    Além disso, apenas itens com <b>estoque positivo</b> serão exibidos com prioridade na tela do Veterinário.
                </p>
            </div>
        </div>
    );
}
