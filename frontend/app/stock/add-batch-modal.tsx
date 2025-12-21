import React, { useState } from 'react';
import { X, ArchiveBoxIcon, Truck } from 'lucide-react';

interface AddBatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
    onConfirm: (data: any) => void;
}

export default function AddBatchModal({ isOpen, onClose, product, onConfirm }: AddBatchModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        quantity: '',
        batchNumber: '',
        expirationDate: '',
        costPrice: '',
        provider: '',
        invoiceNumber: ''
    });

    if (!isOpen || !product) return null;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/stock/inbound', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: product.id,
                    quantity: Number(formData.quantity),
                    batchNumber: formData.batchNumber,
                    expirationDate: new Date(formData.expirationDate).toISOString(),
                    costPrice: Number(formData.costPrice),
                    provider: formData.provider,
                    invoiceNumber: formData.invoiceNumber
                })
            });

            if (res.ok) {
                onConfirm(formData);
                onClose();
            } else {
                alert('Erro ao dar entrada no lote');
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Truck size={20} className="text-indigo-600" />
                            Entrada de Estoque
                        </h3>
                        <p className="text-xs text-gray-500 font-medium mt-1">{product.name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nº Lote</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.batchNumber}
                                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.expirationDate}
                                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Custo Unit. (R$)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.costPrice}
                                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor / Nota Fiscal</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Fornecedor"
                                value={formData.provider}
                                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                            />
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Nº NF"
                                value={formData.invoiceNumber}
                                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                    >
                        {loading ? 'Processando...' : 'Confirmar Entrada'}
                    </button>
                </div>
            </div>
        </div>
    );
}
