"use client";

import React, { useState } from 'react';
import {
    ArchiveBoxIcon,
    XMarkIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function KitConsumptionModal({ onClose, onConfirm, clinicId, userId, medicalRecordId }: any) {
    // Mock Kits - In prod, fetch from GET /stock/kits
    const [kits] = useState([
        { id: '1', name: 'Kit Castração Felina', items: 4 },
        { id: '2', name: 'Kit Vacina V10', items: 3 },
        { id: '3', name: 'Kit Sura Simples', items: 5 },
        { id: '4', name: 'Kit Fluidoterapia', items: 2 },
    ]);

    const [selectedKit, setSelectedKit] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleConfirm = async () => {
        if (!selectedKit) return;
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:3001/stock/kits/consume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    kitId: selectedKit,
                    quantity: quantity,
                    medicalRecordId: medicalRecordId,
                    userId: userId || 'mock-user-id' // Should come from auth context
                })
            });

            if (response.ok) {
                setSuccess(true);
                setSuccess(true);
                setTimeout(() => {
                    // Find the kit to pass its items back (Mock simulation of what backend deducted)
                    const kit = kits.find(k => k.id === selectedKit);
                    const mockedItems = kit ? [{ productId: 'kit-item-1', name: `${kit.name} (Pack)`, quantity: quantity, price: 0 }] : [];

                    onConfirm(mockedItems);
                    onClose();
                }, 1500);
            } else {
                alert('Erro ao processar consumo do kit.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl">
                    <CheckCircleIcon className="h-16 w-16 text-emerald-500 mb-4 animate-bounce" />
                    <h3 className="text-xl font-bold text-slate-800">Estoque Atualizado!</h3>
                    <p className="text-slate-500">Itens do kit baixados com sucesso.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold flex items-center gap-2">
                        <ArchiveBoxIcon className="h-6 w-6" />
                        Usar Kit de Procedimento
                    </h3>
                    <button onClick={onClose} className="hover:bg-indigo-500 p-1 rounded-full">
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-sm text-slate-500 mb-6 bg-indigo-50 p-3 rounded-lg border border-indigo-100 flex gap-2">
                        <ExclamationTriangleIcon className="h-5 w-5 text-indigo-500 shrink-0" />
                        Ao confirmar, todos os itens do kit serão baixados automaticamente do estoque desta unidade.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Selecione o Kit</label>
                            <select
                                value={selectedKit}
                                onChange={(e) => setSelectedKit(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800"
                            >
                                <option value="">Selecione...</option>
                                {kits.map(k => (
                                    <option key={k.id} value={k.id}>{k.name} ({k.items} itens)</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Quantidade utilizada</label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"
                                >-</button>
                                <span className="font-black text-xl w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"
                                >+</button>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={!selectedKit || isSubmitting}
                        className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all flex justify-center items-center gap-2"
                    >
                        {isSubmitting ? 'Processando...' : 'Confirmar Baixa de Estoque'}
                    </button>
                </div>
            </div>
        </div>
    );
}
