"use client";

import React, { useState } from 'react';
import {
    UsersIcon,
    CurrencyDollarIcon,
    PlusIcon,
    TrashIcon,
    BriefcaseIcon
} from '@heroicons/react/24/outline';

export default function ProviderRulesPage() {
    const [rules, setRules] = useState([
        { id: '1', provider: 'Dr. House', service: 'Anestesia Geral', type: 'FIXED_PROVIDER_VALUE', value: 300.00, margin: null },
        { id: '2', provider: 'Dra. Ana', service: 'Ultrassom Abdominal', type: 'PERCENTAGE_CLINIC_MARGIN', value: null, margin: 30.0 }
    ]);

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <UsersIcon className="h-8 w-8 text-indigo-600" />
                Prestadores & Parceiros
            </h1>
            <p className="text-slate-500 mb-8">Defina os valores dos serviços terceirizados e automatize o Split de Pagamento.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* REGISTRATION FORM */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit lg:col-span-1">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <PlusIcon className="h-5 w-5 text-emerald-600" />
                        Novo Contrato de Serviço
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Prestador (VET)</label>
                            <select className="w-full border border-slate-300 rounded-lg p-2 bg-white">
                                <option>Selecione o Parceiro...</option>
                                <option>Dr. House (Anestesista)</option>
                                <option>Lab Partner (Exames)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Serviço Prestado</label>
                            <select className="w-full border border-slate-300 rounded-lg p-2 bg-white">
                                <option>Selecione o Serviço...</option>
                                <option>Anestesia Geral</option>
                                <option>Ultrassom</option>
                                <option>Consulta Especialista</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Modelo de Pagamento</label>
                            <div className="flex gap-2 mb-2">
                                <button className="flex-1 py-2 text-xs font-bold bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200">
                                    Valor Fixo (Prestador)
                                </button>
                                <button className="flex-1 py-2 text-xs font-bold bg-white text-slate-500 rounded-lg border border-slate-200 hover:bg-slate-50">
                                    Margem Clínica (%)
                                </button>
                            </div>

                            <label className="block text-xs text-slate-500 mb-1">Quanto o Prestador RECEBE?</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-500 font-bold">R$</span>
                                <input type="number" placeholder="0.00" className="w-full pl-10 border border-slate-300 rounded-lg p-2" />
                            </div>
                        </div>

                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-xs text-amber-800">
                            <strong>Simulação:</strong> Se cobrar R$ 500,00 do cliente:
                            <br />• Prestador recebe: R$ 300,00
                            <br />• Clínica recebe: R$ 200,00 (Margem)
                        </div>

                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-200 transition-all">
                            Salvar Regra
                        </button>
                    </div>
                </div>

                {/* RULES LIST */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-slate-700">Regras Ativas</h2>

                    {rules.map((rule) => (
                        <div key={rule.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center group hover:border-indigo-300 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                    {rule.provider.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 flex items-center gap-2">
                                        {rule.provider}
                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">VET</span>
                                    </div>
                                    <div className="text-sm text-slate-500 flex items-center gap-1">
                                        <BriefcaseIcon className="h-4 w-4" />
                                        {rule.service}
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                {rule.type === 'FIXED_PROVIDER_VALUE' ? (
                                    <>
                                        <div className="font-black text-lg text-emerald-600">R$ {rule.value?.toFixed(2)}</div>
                                        <div className="text-[10px] text-slate-400 uppercase font-bold">Valor do Prestador (Fixo)</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="font-black text-lg text-indigo-600">{rule.margin}%</div>
                                        <div className="text-[10px] text-slate-400 uppercase font-bold">Margem da Clínica</div>
                                    </>
                                )}
                            </div>

                            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-4">
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}

                    <div className="mt-8 p-6 bg-slate-800 rounded-xl text-slate-300 flex items-start gap-4">
                        <CurrencyDollarIcon className="h-8 w-8 text-indigo-400 shrink-0" />
                        <div>
                            <h3 className="font-bold text-white text-lg">Automação de Checkout</h3>
                            <p className="text-sm mt-1">
                                Ao finalizar uma consulta que contenha esses serviços e seja realizada por esses profissionais,
                                o sistema preencherá automaticamente o modal de Split de Pagamento com esses valores.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
