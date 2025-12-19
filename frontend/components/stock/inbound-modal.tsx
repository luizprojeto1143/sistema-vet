import React, { useState } from 'react';
import { XMarkIcon, ArrowUpTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function InboundModal({ onClose, products, onConfirm }: any) {
    const [mode, setMode] = useState<'MANUAL' | 'XML'>('MANUAL');
    const [fileName, setFileName] = useState('');

    // Manual Form
    const [formData, setFormData] = useState({
        productId: '',
        quantity: '',
        costPrice: '',
        expirationDate: '',
        batchNumber: '',
        provider: '',
        invoiceNumber: ''
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleXmlUpload = (e: any) => {
        // MOCK XML PARSING
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            // Simulate parsing delay
            setTimeout(() => {
                alert('XML Processado com Sucesso! (Simulação)');
                setMode('MANUAL');
                // Pre-fill with mock data derived from "XML"
                setFormData({
                    productId: products[0]?.id || '',
                    quantity: '50',
                    costPrice: '12.50',
                    expirationDate: '2026-12-31',
                    batchNumber: 'LOTE-XML-99',
                    provider: 'Distribuidora Pets S.A.',
                    invoiceNumber: 'NF-12345'
                });
            }, 1000);
        }
    };

    const handleSubmit = async () => {
        if (!formData.productId || !formData.quantity) return alert('Preencha os campos obrigatórios');

        const payload = {
            ...formData,
            quantity: Number(formData.quantity),
            costPrice: Number(formData.costPrice),
            expirationDate: formData.expirationDate, // ISO String ideally
            batchNumber: formData.batchNumber || 'LOTE-AUTO'
        };

        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/stock/inbound', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('Entrada Realizada com Sucesso! Estoque Atualizado.');
            onConfirm();
            onClose();
        } else {
            alert('Erro ao processar entrada.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-fade-in-up">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Nova Entrada de Estoque</h2>
                    <button onClick={onClose}><XMarkIcon className="h-6 w-6 text-gray-400" /></button>
                </div>

                <div className="p-6">
                    {/* TABS */}
                    <div className="flex gap-4 mb-6 border-b">
                        <button
                            onClick={() => setMode('MANUAL')}
                            className={`pb-2 px-1 font-bold ${mode === 'MANUAL' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400'}`}
                        >
                            Entrada Manual
                        </button>
                        <button
                            onClick={() => setMode('XML')}
                            className={`pb-2 px-1 font-bold ${mode === 'XML' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400'}`}
                        >
                            Importar XML (NFe)
                        </button>
                    </div>

                    {mode === 'XML' ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:bg-gray-50 transition-colors">
                            <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 font-medium mb-1">Arraste o arquivo XML da Nota Fiscal aqui</p>
                            <p className="text-xs text-gray-400 mb-4">ou clique para selecionar</p>
                            <input type="file" onChange={handleXmlUpload} className="hidden" id="xml-upload" accept=".xml" />
                            <label htmlFor="xml-upload" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold cursor-pointer hover:bg-indigo-700">
                                Selecionar Arquivo
                            </label>
                            {fileName && <p className="mt-4 text-green-600 font-bold flex items-center justify-center gap-2"><DocumentTextIcon className="h-5 w-5" /> {fileName}</p>}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Nota Fiscal (Opcional)</label>
                                    <input name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Ex: 55032" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Fornecedor</label>
                                    <input name="provider" value={formData.provider} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Nome do Fornecedor" />
                                </div>
                            </div>

                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                <label className="block text-xs font-bold text-indigo-700 mb-1">Produto</label>
                                <select
                                    name="productId"
                                    value={formData.productId}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-indigo-200 rounded-lg mb-4 bg-white"
                                >
                                    <option value="">Selecione o Produto para Entrada...</option>
                                    {products.map((p: any) => (
                                        <option key={p.id} value={p.id}>{p.name} (Atual: {p.currentStock} un)</option>
                                    ))}
                                </select>

                                <div className="grid grid-cols-4 gap-4">
                                    <div className="col-span-1">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Quantidade</label>
                                        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="0" />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Custo Unit. (R$)</label>
                                        <input type="number" name="costPrice" value={formData.costPrice} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="0.00" />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Lote</label>
                                        <input name="batchNumber" value={formData.batchNumber} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Lote ABC" />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Validade</label>
                                        <input type="date" name="expirationDate" value={formData.expirationDate} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-bold">Cancelar</button>
                    {mode === 'MANUAL' && (
                        <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg flex items-center gap-2">
                            <CheckCircleIcon className="h-5 w-5" /> Confirmar Entrada
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
