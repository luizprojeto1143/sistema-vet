"use client";

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function PlanModal({ isOpen, onClose, plan }: any) {
    const [formData, setFormData] = useState({
        name: '',
        billingType: 'FIXED', // FIXED, PERCENTAGE, HYBRID
        priceMonthly: 0,
        percentageFee: 0,
        maxUsers: 5,
        maxPets: 500,
        hasAiAccess: false
    });

    useEffect(() => {
        if (plan) {
            setFormData(plan);
        }
    }, [plan]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving Plan:", formData);
        // await api.post('/saas/plans', formData);
        alert("Plano salvo (simulado)!");
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl w-[600px] border border-slate-700 shadow-2xl overflow-hidden animate-fade-in-up">

                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                    <h2 className="text-xl font-bold text-white">
                        {plan ? `Editar Plano: ${plan.name}` : 'Criar Novo Plano'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome do Plano</label>
                            <input
                                type="text"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                                placeholder="Ex: Starter, Enterprise..."
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Pricing Model */}
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Modelo de Cobrança</label>
                        <div className="flex gap-4 mb-4">
                            {['FIXED', 'PERCENTAGE', 'HYBRID'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, billingType: type })}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${formData.billingType === type
                                            ? 'bg-indigo-600 border-indigo-500 text-white'
                                            : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {type === 'FIXED' && 'Valor Fixo'}
                                    {type === 'PERCENTAGE' && '% Faturamento'}
                                    {type === 'HYBRID' && 'Híbrido'}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {(formData.billingType === 'FIXED' || formData.billingType === 'HYBRID') && (
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Mensalidade (R$)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                                        value={formData.priceMonthly}
                                        onChange={e => setFormData({ ...formData, priceMonthly: Number(e.target.value) })}
                                    />
                                </div>
                            )}
                            {(formData.billingType === 'PERCENTAGE' || formData.billingType === 'HYBRID') && (
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Taxa (%)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                                        value={formData.percentageFee}
                                        onChange={e => setFormData({ ...formData, percentageFee: Number(e.target.value) })}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Limits */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Limites & Recursos</label>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Max Usuários</label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                                    value={formData.maxUsers}
                                    onChange={e => setFormData({ ...formData, maxUsers: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Max Pets</label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                                    value={formData.maxPets}
                                    onChange={e => setFormData({ ...formData, maxPets: Number(e.target.value) })}
                                />
                            </div>
                            <div className="flex items-center justify-center">
                                <label className="flex items-center gap-2 cursor-pointer mt-4">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                                        checked={formData.hasAiAccess}
                                        onChange={e => setFormData({ ...formData, hasAiAccess: e.target.checked })}
                                    />
                                    <span className="text-sm font-medium text-white">Acesso IA</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 font-bold"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-bold shadow-lg shadow-indigo-900/20"
                        >
                            Salvar Plano
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
