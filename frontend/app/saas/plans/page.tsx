"use client";

import React, { useState } from 'react';
import {
    CheckCircleIcon,
    XCircleIcon,
    CurrencyDollarIcon,
    UsersIcon,
    CpuChipIcon
} from '@heroicons/react/24/outline';
import PlanModal from './plan-modal';

// Mock until API Integration
const MOCK_PLANS = [
    {
        id: '1',
        name: 'Starter',
        billingType: 'FIXED',
        priceMonthly: 199.00,
        percentageFee: 0,
        maxUsers: 2,
        maxPets: 100,
        hasAiAccess: false,
        activeClinics: 15
    },
    {
        id: '2',
        name: 'Growth (Híbrido)',
        billingType: 'HYBRID',
        priceMonthly: 499.00,
        percentageFee: 2.0,
        maxUsers: 10,
        maxPets: 1000,
        hasAiAccess: true,
        activeClinics: 8
    },
    {
        id: '3',
        name: 'Enterprise (Parceiro)',
        billingType: 'PERCENTAGE',
        priceMonthly: 0.00,
        percentageFee: 5.0,
        maxUsers: 999,
        maxPets: 99999,
        hasAiAccess: true,
        activeClinics: 4
    },
];

export default function PlansPage() {
    const [plans, setPlans] = useState(MOCK_PLANS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);

    const handleEdit = (plan: any) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedPlan(null);
        setIsModalOpen(true);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Planos & Limites</h1>
                    <p className="text-slate-400">Configure os modelos de cobrança e limites de recursos por plano.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2"
                >
                    + Criar Novo Plano
                </button>
            </div>

            {isModalOpen && (
                <PlanModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    plan={selectedPlan}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-indigo-500 transition-all group relative">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-700 bg-slate-900/50">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white max-w-[70%]">{plan.name}</h3>
                                {plan.billingType === 'FIXED' && <span className="text-xs font-bold px-2 py-1 bg-blue-500/20 text-blue-400 rounded">FIXO</span>}
                                {plan.billingType === 'PERCENTAGE' && <span className="text-xs font-bold px-2 py-1 bg-purple-500/20 text-purple-400 rounded">% REC.</span>}
                                {plan.billingType === 'HYBRID' && <span className="text-xs font-bold px-2 py-1 bg-amber-500/20 text-amber-400 rounded">HÍBRIDO</span>}
                            </div>

                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-white">
                                    {plan.billingType !== 'PERCENTAGE' && `R$ ${plan.priceMonthly}`}
                                    {plan.billingType === 'PERCENTAGE' && `${plan.percentageFee}%`}
                                </span>
                                {plan.billingType === 'HYBRID' && (
                                    <span className="text-sm text-slate-400 font-medium">+ {plan.percentageFee}%</span>
                                )}
                                <span className="text-sm text-slate-500">/mês</span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <UsersIcon className="h-5 w-5 text-indigo-400" />
                                <span>Até <b>{plan.maxUsers}</b> usuários</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <div className="h-5 w-5 flex items-center justify-center text-xs font-bold border border-slate-600 rounded text-slate-400">Pet</div>
                                <span>Até <b>{plan.maxPets < 10000 ? plan.maxPets : 'Ilimitados'}</b> pacientes</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <CpuChipIcon className="h-5 w-5 text-emerald-400" />
                                <span>
                                    AnalisaVet (AI):
                                    {plan.hasAiAccess ?
                                        <b className="text-emerald-400 ml-1">Incluso</b> :
                                        <b className="text-slate-500 ml-1">Não incluso</b>
                                    }
                                </span>
                            </div>

                            <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <CheckCircleIcon className="h-4 w-4" /> {plan.activeClinics} Clínicas ativas
                                </span>
                                <button
                                    onClick={() => handleEdit(plan)}
                                    className="text-sm font-bold text-indigo-400 hover:text-indigo-300"
                                >
                                    Editar Configurações
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
