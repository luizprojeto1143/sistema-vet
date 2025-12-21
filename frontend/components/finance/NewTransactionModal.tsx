import React, { useState } from 'react';
import { X, DollarSign, ShoppingBag, Stethoscope, Briefcase, Truck } from 'lucide-react';

interface NewTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function NewTransactionModal({ isOpen, onClose, onSuccess }: NewTransactionModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'INCOME',
        description: '',
        amount: '',
        category: 'Serviços',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'PIX'
    });

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/finance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    amount: parseFloat(formData.amount),
                    status: 'COMPLETED' // Auto-complete for now
                })
            });

            if (res.ok) {
                if (onSuccess) onSuccess();
                onClose();
            } else {
                alert('Erro ao salvar lançamento');
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">Novo Lançamento</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Type Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all group ${formData.type === 'INCOME' ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'}`}>
                            <input
                                type="radio"
                                name="type"
                                className="w-5 h-5 text-green-600"
                                checked={formData.type === 'INCOME'}
                                onChange={() => setFormData({ ...formData, type: 'INCOME' })}
                            />
                            <div>
                                <span className={`block font-bold group-hover:text-green-700 ${formData.type === 'INCOME' ? 'text-green-700' : 'text-gray-700'}`}>Receita</span>
                                <span className="text-xs text-gray-500">Entrada de valores</span>
                            </div>
                        </label>
                        <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all group ${formData.type === 'EXPENSE' ? 'bg-red-50 border-red-200' : 'hover:bg-gray-50'}`}>
                            <input
                                type="radio"
                                name="type"
                                className="w-5 h-5 text-red-600"
                                checked={formData.type === 'EXPENSE'}
                                onChange={() => setFormData({ ...formData, type: 'EXPENSE' })}
                            />
                            <div>
                                <span className={`block font-bold group-hover:text-red-700 ${formData.type === 'EXPENSE' ? 'text-red-700' : 'text-gray-700'}`}>Despesa</span>
                                <span className="text-xs text-gray-500">Saída de valores</span>
                            </div>
                        </label>
                    </div>

                    {/* Description & Value */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ex: Consulta Thor"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                placeholder="0,00"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Categories (Visual) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Categoria</label>
                        <div className="grid grid-cols-4 gap-3">
                            {['Serviços', 'Vendas', 'Administrativo', 'Fornecedores'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFormData({ ...formData, category: cat })}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${formData.category === cat ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 hover:border-teal-500 text-gray-600'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.category === cat ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <Briefcase size={20} />
                                    </div>
                                    <span className="text-xs font-medium">{cat}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Salvando...' : 'Salvar Lançamento'}
                    </button>
                </div>
            </div>
        </div>
    );
}
