"use client";

import React, { useState } from 'react';
import {
    BanknotesIcon,
    UserIcon,
    ScissorsIcon,
    PlusIcon,
    TrashIcon,
    PencilIcon
} from '@heroicons/react/24/outline';
import CommissionModal from './commission-modal';

const MOCK_RULES = [
    { id: '1', providerName: 'Dr. House', serviceName: 'Consulta Especialista', ruleType: 'PERCENTAGE_CLINIC_MARGIN', clinicMargin: 20, providerValue: null },
    { id: '2', providerName: 'Dra. Ana (Anestesista)', serviceName: 'Anestesia Geral', ruleType: 'FIXED_PROVIDER_VALUE', clinicMargin: null, providerValue: 350.00 },
    { id: '3', providerName: 'Dr. House', serviceName: 'Cirurgia Ortopédica', ruleType: 'PERCENTAGE_CLINIC_MARGIN', clinicMargin: 15, providerValue: null },
];

export default function CommissionRulesPage() {
    const [rules, setRules] = useState(MOCK_RULES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<any>(null);

    const handleOpenModal = (rule: any = null) => {
        setSelectedRule(rule);
        setIsModalOpen(true);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BanknotesIcon className="h-8 w-8 text-emerald-600" />
                        Regras de Repasse & Comissões
                    </h1>
                    <p className="text-sm text-gray-500">Defina quanto cada prestador recebe por serviço (Split Automático).</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all"
                >
                    <PlusIcon className="h-5 w-5" />
                    Nova Regra
                </button>
            </div>

            <CommissionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                rule={selectedRule}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-bold border-b border-gray-200">
                        <tr>
                            <th className="p-4">Prestador</th>
                            <th className="p-4">Serviço / Procedimento</th>
                            <th className="p-4">Modelo de Repasse</th>
                            <th className="p-4 text-emerald-700">Valor do Prestador (Receita)</th>
                            <th className="p-4 text-indigo-700">Margem da Clínica</th>
                            <th className="p-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {rules.map((rule) => (
                            <tr key={rule.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-bold text-gray-800 flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        <UserIcon className="h-5 w-5" />
                                    </div>
                                    {rule.providerName}
                                </td>
                                <td className="p-4 text-gray-600 flex items-center gap-2">
                                    <ScissorsIcon className="h-4 w-4 text-gray-400" />
                                    {rule.serviceName}
                                </td>
                                <td className="p-4">
                                    {rule.ruleType === 'FIXED_PROVIDER_VALUE' && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-bold border border-blue-200">
                                            Valor Fixo (Prestador)
                                        </span>
                                    )}
                                    {rule.ruleType === 'PERCENTAGE_CLINIC_MARGIN' && (
                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-bold border border-purple-200">
                                            % Margem Clínica
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 font-bold text-emerald-600">
                                    {rule.ruleType === 'FIXED_PROVIDER_VALUE'
                                        ? `R$ ${rule.providerValue?.toFixed(2)}`
                                        : 'Variável (Restante)'}
                                </td>
                                <td className="p-4 font-bold text-indigo-600">
                                    {rule.ruleType === 'PERCENTAGE_CLINIC_MARGIN'
                                        ? `${rule.clinicMargin}%`
                                        : 'Variável (Excedente)'}
                                </td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button onClick={() => handleOpenModal(rule)} className="text-gray-400 hover:text-indigo-600 transition-colors">
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button className="text-gray-400 hover:text-red-600 transition-colors">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {rules.length === 0 && (
                    <div className="p-10 text-center text-gray-500">
                        Nenhuma regra definida. O sistema usará o padrão (100% Clínica) se não houver regras.
                    </div>
                )}
            </div>
        </div>
    );
}
