"use client";

import React, { useState } from 'react';
import {
    XMarkIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArchiveBoxXMarkIcon
} from '@heroicons/react/24/outline';

export default function ManualConsumptionModal({ onClose, onConfirm, products = [] }: any) {
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [reason, setReason] = useState('Uso Interno');
    const [customReason, setCustomReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API Call
        setTimeout(() => {
            setIsSubmitting(false);
            setSuccess(true);
            setTimeout(() => {
                onConfirm?.();
                onClose();
            }, 1500);
        }, 1000);

        // In real impl: POST /stock/consume ...
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl">
                    <CheckCircleIcon className="h-16 w-16 text-emerald-500 mb-4 animate-bounce" />
                    <h3 className="text-xl font-bold text-slate-800">Baixa Realizada!</h3>
                    <p className="text-slate-500">Estoque atualizado com sucesso.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-rose-600 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold flex items-center gap-2">
                        <ArchiveBoxXMarkIcon className="h-6 w-6" />
                        Baixa Manual / Perda
                    </h3>
                    <button onClick={onClose} className="hover:bg-rose-500 p-1 rounded-full">
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">

                    {/* PRODUCT SELECT */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Produto</label>
                        <select
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        >
                            <option value="">Selecione o produto...</option>
                            <option value="1">Vacina V10 (Lote A)</option>
                            <option value="2">Seringa 3ml</option>
                            <option value="3">Dipirona Injetável</option>
                            {/* {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)} */}
                        </select>
                    </div>

                    {/* QUANTITY */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Quantidade</label>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg bg-slate-100 font-bold hover:bg-slate-200">-</button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="w-20 text-center font-bold border border-slate-300 rounded-lg p-2"
                            />
                            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg bg-slate-100 font-bold hover:bg-slate-200">+</button>
                        </div>
                    </div>

                    {/* REASON */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Motivo da Baixa</label>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            {['Uso Interno', 'Quebra / Dano', 'Validade Vencida', 'Ajuste de Inventário'].map(r => (
                                <button
                                    key={r}
                                    onClick={() => setReason(r)}
                                    className={`p-2 rounded-lg text-sm font-medium border ${reason === r ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                        {reason === 'Outro' && (
                            <input
                                type="text"
                                placeholder="Especifique o motivo..."
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                            />
                        )}
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg flex gap-3 items-start border border-slate-200">
                        <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-500">
                            <span className="font-bold text-slate-700">Atenção:</span> O sistema utilizará automaticamente os lotes com vencimento mais próximo (FIFO). Esta ação é irreversível.
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!selectedProduct || isSubmitting}
                        className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-200 transition-all flex justify-center items-center gap-2 mt-4"
                    >
                        {isSubmitting ? 'Processando...' : 'Confirmar Baixa'}
                    </button>

                </div>
            </div>
        </div>
    );
}
