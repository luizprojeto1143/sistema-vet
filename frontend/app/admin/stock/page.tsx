"use client";

import React, { useState, useEffect } from 'react';
import {
    ArchiveBoxIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    FunnelIcon,
    ExclamationCircleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import ManualConsumptionModal from '@/components/stock/manual-consumption-modal';
import ProductModal from '@/components/stock/product-modal';
import InboundModal from '@/components/stock/inbound-modal';

export default function StockPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [showManualConsume, setShowManualConsume] = useState(false);
    const [showInboundModal, setShowInboundModal] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showProductModal, setShowProductModal] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/products', { // Helper endpoint
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            setProducts(await res.json());
        }
        setLoading(false);
    };

    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const handleEdit = (product: any) => {
        // Map backend fields to modal form data names if necessary
        // ProductModal expects: price (salePrice), cost (costPrice), currentStock, minStock
        setSelectedProduct({
            ...product,
            price: product.salePrice,
            cost: product.costPrice
        });
        setShowProductModal(true);
    };

    const handleSaveProduct = async (data: any) => {
        const token = localStorage.getItem('token');

        if (data.id) {
            // UDPATE
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/products/${data.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data)
            });
        } else {
            // CREATE
            await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data)
            });
        }

        setShowProductModal(false);
        setSelectedProduct(null);
        loadProducts();
    };

    // ... inside return ...

    // Update the "Novo Produto" button to clear selection
    // onClick={() => { setSelectedProduct(null); setShowProductModal(true); }}





    const filteredProducts = products.filter(p =>
        (activeCategory === 'Todos' || p.category === activeCategory) &&
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-8">

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
                        <ArchiveBoxIcon className="h-8 w-8 text-indigo-600" />
                        Gestão de Estoque
                    </h1>
                    <p className="text-slate-500 mt-1">Controle inteligente de lotes, validades e kits.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowManualConsume(true)}
                        className="bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                        Baixa Manual / Perda
                    </button>
                    <button
                        onClick={() => setShowInboundModal(true)}
                        className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Nova Entrada (Nota Fiscal)
                    </button>
                    <button
                        onClick={() => { setSelectedProduct(null); setShowProductModal(true); }}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Novo Produto
                    </button>
                </div>
            </div>

            {/* METRICS SHOULD BE DYNAMIC BUT KEEPING MOCK FOR NOW TO SAVE BYTES */}
            {/* ... stats ... */}

            {/* FILTERS & SEARCH */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {['Todos', 'Vacinas', 'Medicamentos', 'Materiais', 'Alimentos', 'Banho e Tosa'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80">
                    <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, SKU ou Lote..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold tracking-wider">
                            <th className="p-4">Produto</th>
                            <th className="p-4">Tipo</th>
                            <th className="p-4 text-center">Estoque Atual</th>
                            <th className="p-4 text-center">Lotes</th>
                            <th className="p-4 text-right">Preço Venda</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredProducts.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="p-4">
                                    <div className="font-bold text-slate-800">{p.name}</div>
                                    <div className="text-xs text-slate-500 font-mono">{p.sku || 'N/A'}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="w-fit px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wide">{p.category}</span>
                                        {p.usageType === 'INTERNAL' && <span className="w-fit px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wide">Uso Interno</span>}
                                        {p.usageType === 'SALE' && <span className="w-fit px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide">Venda</span>}
                                        {p.usageType === 'BOTH' && <span className="w-fit px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wide">Híbrido</span>}
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <div className={`font-bold ${p.currentStock <= p.minStock ? 'text-red-500' : 'text-slate-700'}`}>
                                        {p.currentStock} un
                                    </div>
                                    {p.currentStock <= p.minStock && <div className="text-[10px] text-red-500 font-bold">Repor Estoque</div>}
                                </td>
                                <td className="p-4 text-center">
                                    <div className="text-sm font-medium text-slate-600">{p.batches?.length || 0} Lotes</div>
                                </td>
                                <td className="p-4 text-right font-medium text-slate-600">
                                    R$ {Number(p.salePrice).toFixed(2)}
                                </td>
                                <td className="p-4 text-center">
                                    {p.currentStock <= p.minStock ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                                            <ExclamationCircleIcon className="h-3 w-3" /> Crítico
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
                                            <CheckCircleIcon className="h-3 w-3" /> Normal
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="text-indigo-600 hover:text-indigo-800 font-bold text-sm"
                                    >
                                        Editar / Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && <div className="p-10 text-center text-gray-400">Nenhum produto encontrado.</div>}
            </div>

            {showManualConsume && (
                <ManualConsumptionModal
                    onClose={() => setShowManualConsume(false)}
                    products={products}
                    onConfirm={() => loadProducts()}
                />
            )}

            {showProductModal && (
                <ProductModal
                    onClose={() => { setShowProductModal(false); setSelectedProduct(null); }}
                    onSave={handleSaveProduct}
                    initialData={selectedProduct}
                />
            )}

            {showInboundModal && (
                <InboundModal
                    onClose={() => setShowInboundModal(false)}
                    products={products}
                    onConfirm={() => loadProducts()}
                />
            )}

        </div>
    );
}
