"use client";

import React, { useState } from 'react';
import {
    GiftIcon,
    PlusIcon,
    TrashIcon,
    MegaphoneIcon
} from '@heroicons/react/24/outline';

export default function MarketingPage() {
    const [rewards, setRewards] = useState([
        { id: '1', name: 'Desconto de R$ 20', type: 'DISCOUNT_FIXED', value: 20.00, trigger: '1ª Consulta' },
        { id: '2', name: 'Banho Grátis', type: 'FREE_SERVICE', value: 0, trigger: 'Gasto > R$ 100' }
    ]);

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <MegaphoneIcon className="h-8 w-8 text-indigo-600" />
                Marketing & Indicações
            </h1>
            <p className="text-slate-500 mb-8">Configure as recompensas para o programa "Indique um Amigo".</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* CONFIGURATION FORM */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <PlusIcon className="h-5 w-5 text-emerald-600" />
                        Nova Recompensa
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Nome da Campanha</label>
                            <input type="text" placeholder="Ex: Ganhe R$ 20 na Vacina" className="w-full border border-slate-300 rounded-lg p-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Tipo de Prêmio</label>
                                <select className="w-full border border-slate-300 rounded-lg p-2 bg-white">
                                    <option value="DISCOUNT_FIXED">Desconto (Valor Fixo)</option>
                                    <option value="DISCOUNT_PERCENT">Desconto (%)</option>
                                    <option value="FREE_SERVICE">Serviço Grátis</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Valor</label>
                                <input type="number" placeholder="0.00" className="w-full border border-slate-300 rounded-lg p-2" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Gatilho (Quando o amigo ganha?)</label>
                            <select className="w-full border border-slate-300 rounded-lg p-2 bg-white">
                                <option value="FIRST_APPOINTMENT">Na 1ª Consulta Agendada</option>
                                <option value="FIRST_PAYMENT">Após o 1º Pagamento</option>
                            </select>
                        </div>

                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-200 transition-all">
                            Adicionar Recompensa
                        </button>
                    </div>
                </div>

                {/* ACTIVE REWARDS LIST */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-700">Recompensas Ativas</h2>

                    {rewards.map((reward) => (
                        <div key={reward.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center group hover:border-indigo-300 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <GiftIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800">{reward.name}</div>
                                    <div className="text-xs text-slate-500">
                                        Gatilho: <span className="font-medium text-slate-700">{reward.trigger}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="font-black text-lg text-emerald-600">
                                        {reward.type === 'FREE_SERVICE' ? 'Grátis' : `R$ ${reward.value}`}
                                    </div>
                                    <div className="text-[10px] text-slate-400 uppercase font-bold">Valor</div>
                                </div>
                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-700 text-sm">
                        <GiftIcon className="h-5 w-5 shrink-0" />
                        <div>
                            <strong>Dica Geek:</strong> Configure prêmios escalonáveis para aumentar o LTV (Lifetime Value) dos clientes.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
