"use client";

import React, { useState, useEffect } from 'react';
import {
    ArchiveBoxIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    ArrowTrendingDownIcon,
    ArrowTrendingUpIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import ProductForm from './product-form'; // Import the form

const MOCK_STOCK = [
    { id: 1, name: 'Vacina V10 (Vanguard)', category: 'Biologicos', stock: 45, min: 20, status: 'NORMAL', supplier: 'Zoetis' },
    { id: 2, name: 'Apoquel 16mg (20 comp)', category: 'Farmácia', stock: 4, min: 5, status: 'LOW', supplier: 'Zoetis' },
    { id: 3, name: 'Seringa 3ml (Agulhada)', category: 'Insumos', stock: 120, min: 50, status: 'NORMAL', supplier: 'BD' },
    { id: 4, name: 'Ração Royal Canin Renal 10kg', category: 'Alimentação', stock: 0, min: 2, status: 'CRITICAL', supplier: 'Royal Canin' },
];

import AddBatchModal from './add-batch-modal'; // Import the new modal

export default function StockPage() {
    const [filter, setFilter] = useState('ALL');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [selectedProductForBatch, setSelectedProductForBatch] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);

    const fetchProducts = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/products', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpenBatchModal = (product: any) => {
        setSelectedProductForBatch(product);
        setIsBatchModalOpen(true);
    };

    const handleSaveBatch = (batchData: any) => {
        fetchProducts(); // Refresh list
        setIsBatchModalOpen(false);
    };

    return (
        <div className="p-8 h-screen flex flex-col bg-gray-50 overflow-hidden relative">

            {/* MODALS */}
            {isFormOpen && <ProductForm onClose={() => setIsFormOpen(false)} onSuccess={fetchProducts} />}

            <AddBatchModal
                isOpen={isBatchModalOpen}
                onClose={() => setIsBatchModalOpen(false)}
                product={selectedProductForBatch}
                onConfirm={handleSaveBatch}
            />

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ArchiveBoxIcon className="h-8 w-8 text-indigo-600" />
                        Controle de Estoque
                    </h1>
                    <p className="text-sm text-gray-500">Gestão de produtos, lotes e validade.</p>
                </div>

                <div className="flex gap-2">
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-bold hover:bg-gray-50 shadow-sm transition-all text-sm">
                        Importar XML
                    </button>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 shadow-md flex items-center gap-2 transition-all"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Novo Item / Entrada
                    </button>
                </div>
            </div>

            {/* METRICS */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                        <ExclamationTriangleIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-800">4</div>
                        <div className="text-xs text-red-500 font-bold uppercase">Abaixo do Mínimo</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                        <ArchiveBoxIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-800">1.240</div>
                        <div className="text-xs text-gray-500 font-bold uppercase">Itens Totais</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                        <ArrowTrendingUpIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-800">R$ 42k</div>
                        <div className="text-xs text-gray-500 font-bold uppercase">Valor em Estoque</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                        <ArrowPathIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-800">2</div>
                        <div className="text-xs text-orange-500 font-bold uppercase">Prox. Validade</div>
                    </div>
                </div>
            </div>

            {/* FILTERS & LIST */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">

                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 flex gap-3">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                        <input type="text" placeholder="Buscar por Nome, SKU ou Fornecedor..." className="w-full pl-10 p-2 border rounded-lg bg-gray-50" />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
                        <FunnelIcon className="h-5 w-5" />
                        Filtros
                    </button>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-bold sticky top-0">
                            <tr>
                                <th className="p-4">Produto</th>
                                <th className="p-4">Categoria</th>
                                <th className="p-4">Fornecedor</th>
                                <th className="p-4 text-center">Estoque</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map(item => (
                                <tr key={item.id} className="hover:bg-indigo-50 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800">{item.name}</div>
                                        <div className="text-xs text-gray-400">SKU: {item.id.slice(0, 8).toUpperCase()}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{item.category}</td>
                                    <td className="p-4 text-sm text-gray-600">{item.supplier}</td>
                                    <td className="p-4 text-center font-bold text-gray-800">{item.currentStock} {item.unit}</td>
                                    <td className="p-4 text-center">
                                        {item.currentStock <= 0 && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-bold">ZERADO</span>}
                                        {item.currentStock > 0 && item.currentStock <= item.minStock && <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-bold">BAIXO</span>}
                                        {item.currentStock > item.minStock && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">OK</span>}
                                    </td>
                                    <td className="p-4 text-right flex gap-2 justify-end">
                                        <button
                                            onClick={() => handleOpenBatchModal(item)}
                                            className="text-indigo-600 font-bold text-xs border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 opacity-60 group-hover:opacity-100 transition-all"
                                        >
                                            + Lote
                                        </button>
                                        <button
                                            onClick={() => setIsFormOpen(true)}
                                            className="text-slate-500 font-bold text-xs hover:text-indigo-600 opacity-60 group-hover:opacity-100 transition-all"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    );
}
