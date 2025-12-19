"use client";

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const MOCK_PROVIDERS = [
    { id: 'p1', name: 'Dr. House' },
    { id: 'p2', name: 'Dra. Ana (Anestesista)' },
    { id: 'p3', name: 'Banho & Tosa Team' },
];

const MOCK_SERVICES = [
    { id: 's1', name: 'Consulta Especialista' },
    { id: 's2', name: 'Anestesia Geral' },
    { id: 's3', name: 'Cirurgia Ortopédica' },
    { id: 's4', name: 'Banho Simples' },
];

export default function CommissionModal({ isOpen, onClose, rule }: any) {
    const [formData, setFormData] = useState({
        providerId: '',
        serviceId: '',
        ruleType: 'PERCENTAGE_CLINIC_MARGIN', // or FIXED_PROVIDER_VALUE
        value: 0
    });

    useEffect(() => {
        if (rule) {
            setFormData({
                providerId: 'p1', // mock
                serviceId: 's1', // mock
                ruleType: rule.ruleType,
                value: rule.ruleType === 'FIXED_PROVIDER_VALUE' ? rule.providerValue : rule.clinicMargin
            });
        } else {
            setFormData({
                providerId: '',
                serviceId: '',
                ruleType: 'PERCENTAGE_CLINIC_MARGIN',
                value: 0
            });
        }
    }, [rule, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving Rule:", formData);
        alert("Regra salva com sucesso!");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-[500px] shadow-2xl overflow-hidden animate-fade-in-up">

                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">
                        {rule ? 'Editar Regra de Repasse' : 'Nova Regra de Repasse'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Selections */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Prestador (Recebedor)</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={formData.providerId}
                                onChange={e => setFormData({ ...formData, providerId: e.target.value })}
                                required
                            >
                                <option value="">Selecione um profissional...</option>
                                {MOCK_PROVIDERS.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Serviço / Procedimento</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={formData.serviceId}
                                onChange={e => setFormData({ ...formData, serviceId: e.target.value })}
                                required
                            >
                                <option value="">Selecione o serviço...</option>
                                {MOCK_SERVICES.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Logic Toggle */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Modelo de Cálculo</label>

                        <div className="flex gap-2 mb-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, ruleType: 'PERCENTAGE_CLINIC_MARGIN' })}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${formData.ruleType === 'PERCENTAGE_CLINIC_MARGIN'
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                % Margem Clínica
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, ruleType: 'FIXED_PROVIDER_VALUE' })}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${formData.ruleType === 'FIXED_PROVIDER_VALUE'
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                Valor Fixo (Prestador)
                            </button>
                        </div>

                        {formData.ruleType === 'PERCENTAGE_CLINIC_MARGIN' && (
                            <div className="animate-fade-in">
                                <label className="block text-sm text-indigo-700 font-bold mb-1">Porcentagem que FICA na Clínica (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        className="w-full border border-indigo-300 rounded-lg p-2.5 pl-4 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-indigo-900"
                                        placeholder="Ex: 20"
                                        value={formData.value}
                                        onChange={e => setFormData({ ...formData, value: Number(e.target.value) })}
                                    />
                                    <span className="absolute right-4 top-2.5 text-gray-400 font-bold">%</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Ex: Se o serviço custa R$ 100 e a margem é 20%, a clínica fica com <b className="text-gray-900">R$ 20,00</b> e o prestador recebe automaticamente <b className="text-gray-900">R$ 80,00</b>.
                                </p>
                            </div>
                        )}

                        {formData.ruleType === 'FIXED_PROVIDER_VALUE' && (
                            <div className="animate-fade-in">
                                <label className="block text-sm text-blue-700 font-bold mb-1">Valor que vai para o Prestador (R$)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400 font-bold">R$</span>
                                    <input
                                        type="number"
                                        className="w-full border border-blue-300 rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-900"
                                        placeholder="Ex: 350.00"
                                        value={formData.value}
                                        onChange={e => setFormData({ ...formData, value: Number(e.target.value) })}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Valor fixo garantido ao prestador, independente do valor cobrado do cliente. O restante (Lucro ou Prejuízo) fica com a clínica.
                                </p>
                            </div>
                        )}

                    </div>

                    <div className="border-t border-gray-100 pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-lg shadow-emerald-900/10 transition-colors">
                            Salvar Regra
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
