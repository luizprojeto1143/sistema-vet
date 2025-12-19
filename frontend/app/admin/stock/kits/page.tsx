"use client";

import React, { useState } from 'react';
import {
    CubeIcon,
    PlusIcon,
    TrashIcon,
    BeakerIcon,
    ArchiveBoxIcon
} from '@heroicons/react/24/outline';

export default function KitsPage() {
    const [kits, setKits] = useState([
        {
            id: '1',
            name: 'Kit Castração Felina',
            description: 'Insumos padrão para OSH Gata',
            items: [
                { id: '101', name: 'Propofol 20ml', qty: 0.2, unit: 'FR' }, // 0.2 frasco = 4ml?
                { id: '102', name: 'Seringa 3ml', qty: 1, unit: 'UN' },
                { id: '103', name: 'Agulha 25x7', qty: 1, unit: 'UN' },
                { id: '104', name: 'Campo Cirúrgico Estéril', qty: 1, unit: 'UN' }
            ]
        }
    ]);

    const [isCreating, setIsCreating] = useState(false);
    const [newKit, setNewKit] = useState({ name: '', description: '', items: [] as any[] });

    // Mock Product Search
    const [searchTerm, setSearchTerm] = useState('');
    const [mockProducts] = useState([
        { id: 'p1', name: 'Dipirona Injetável', unit: 'FR' },
        { id: 'p2', name: 'Meloxicam 0.2%', unit: 'FR' },
        { id: 'p3', name: 'Seringa 3ml', unit: 'UN' },
        { id: 'p4', name: 'Luva Cirúrgica 7.5', unit: 'PAR' },
        { id: 'p5', name: 'Cateter 24G', unit: 'UN' }
    ]);

    const addToKit = (product: any) => {
        setNewKit({
            ...newKit,
            items: [...newKit.items, { ...product, qty: 1 }]
        });
        setSearchTerm('');
    };

    const updateQty = (idx: number, val: number) => {
        const items = [...newKit.items];
        items[idx].qty = val;
        setNewKit({ ...newKit, items });
    };

    const removeitem = (idx: number) => {
        const items = [...newKit.items];
        items.splice(idx, 1);
        setNewKit({ ...newKit, items });
    };

    const saveKit = () => {
        setKits([...kits, { ...newKit, id: Date.now().toString() }]);
        setIsCreating(false);
        setNewKit({ name: '', description: '', items: [] });
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
                        <ArchiveBoxIcon className="h-8 w-8 text-indigo-600" />
                        Kits & Combos
                    </h1>
                    <p className="text-slate-500 mt-1">Crie agrupamentos de produtos para baixa rápida no estoque.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all"
                >
                    <PlusIcon className="h-5 w-5" />
                    Novo Kit
                </button>
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100 mb-8 animate-fade-in-down">
                    <h3 className="text-lg font-bold mb-4 text-indigo-900">Montando Novo Kit</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Kit</label>
                            <input
                                value={newKit.name}
                                onChange={e => setNewKit({ ...newKit, name: e.target.value })}
                                placeholder="Ex: Kit Vacina V10"
                                className="w-full border border-slate-300 rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Descrição (Opcional)</label>
                            <input
                                value={newKit.description}
                                onChange={e => setNewKit({ ...newKit, description: e.target.value })}
                                placeholder="Ex: Itens usados na vacinação anual"
                                className="w-full border border-slate-300 rounded-lg p-2"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Adicionar Itens ao Kit</label>
                        <div className="relative mb-4">
                            <input
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Busque um produto para adicionar..."
                                className="w-full border border-slate-300 rounded-lg p-2 pl-10"
                            />
                            <BeakerIcon className="h-5 w-5 text-slate-400 absolute left-3 top-2.5" />

                            {searchTerm && (
                                <div className="absolute top-12 left-0 w-full bg-white shadow-xl rounded-lg border border-slate-100 z-10 overflow-hidden">
                                    {mockProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => addToKit(p)}
                                            className="w-full text-left p-3 hover:bg-indigo-50 border-b border-slate-50 flex justify-between"
                                        >
                                            <span className="font-bold text-slate-700">{p.name}</span>
                                            <span className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600">{p.unit}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {newKit.items.length > 0 ? (
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-100">
                                    <tr>
                                        <th className="p-3">Produto</th>
                                        <th className="p-3 w-32">Quantidade</th>
                                        <th className="p-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newKit.items.map((item, idx) => (
                                        <tr key={idx} className="bg-white border-b border-slate-100">
                                            <td className="p-3 font-bold text-slate-700">{item.name}</td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={item.qty}
                                                        onChange={e => updateQty(idx, Number(e.target.value))}
                                                        className="w-20 border border-slate-300 rounded p-1 text-center"
                                                    />
                                                    <span className="text-xs text-slate-400 font-bold">{item.unit}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-center">
                                                <button onClick={() => removeitem(idx)} className="text-red-400 hover:text-red-600">
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-6 text-slate-400 italic text-sm">Nenhum item adicionado ainda.</div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-bold">Cancelar</button>
                        <button
                            onClick={saveKit}
                            disabled={!newKit.name || newKit.items.length === 0}
                            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white rounded-lg font-bold shadow-lg shadow-emerald-200 transition-all"
                        >
                            Salvar Kit
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kits.map(kit => (
                    <div key={kit.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-indigo-300 transition-all group">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">{kit.name}</h3>
                                <p className="text-xs text-slate-500">{kit.description}</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors">
                                <CubeIcon className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Composição</h4>
                            <ul className="space-y-1">
                                {kit.items.map((item, i) => (
                                    <li key={i} className="text-sm flex justify-between text-slate-600">
                                        <span>{item.name}</span>
                                        <span className="font-bold text-slate-800 bg-slate-100 px-2 rounded-full text-xs">{item.qty} {item.unit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
                            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Editar Composição</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
