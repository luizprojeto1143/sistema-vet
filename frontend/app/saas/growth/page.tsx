"use client";

import React, { useState, useEffect } from 'react';
import {
    UsersIcon,
    GiftIcon,
    TicketIcon,
    ArrowTrendingUpIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

export default function GrowthPage() {
    const [referrers, setReferrers] = useState<any[]>([]);

    useEffect(() => {
        // Fetch logic
        // fetch('http://localhost:3001/saas/referrers').then(...)
    }, []);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                        <SparklesIcon className="h-8 w-8 text-yellow-400" />
                        Growth & Indicações
                    </h1>
                    <p className="text-slate-400">Gerencie o motor de crescimento B2B (Clínica indica Clínica) e B2C (Tutor indica Tutor).</p>
                </div>
            </div>

            {/* B2B CONFIG CARD */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-gradient-to-r from-indigo-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TicketIcon className="h-48 w-48 text-white" />
                    </div>

                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <TicketIcon className="h-6 w-6 text-indigo-400" />
                        Programa de Parceria (B2B)
                    </h2>

                    <div className="flex gap-4 items-start bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
                        <div className="p-3 bg-green-500/20 text-green-400 rounded-lg">
                            <GiftIcon className="h-8 w-8" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-400 uppercase font-bold mb-1">Recompensa Atual</div>
                            <div className="text-white font-medium text-lg">1 Mês de Mensalidade Grátis (Crédito SaaS)</div>
                            <p className="text-xs text-slate-500 mt-1">Concedido automaticamente quando a clínica indicada paga a 1ª mensalidade.</p>
                        </div>
                        <button className="ml-auto text-sm font-bold text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded">
                            Editar Regra
                        </button>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="bg-slate-800/40 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-white">25</div>
                            <div className="text-xs text-slate-400">Clínicas Indicadas (Total)</div>
                        </div>
                        <div className="bg-slate-800/40 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-indigo-400">R$ 5k</div>
                            <div className="text-xs text-slate-400">MRR Gerado (Indicações)</div>
                        </div>
                        <div className="bg-slate-800/40 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-green-400">12</div>
                            <div className="text-xs text-slate-400">Meses Grátis Concedidos</div>
                        </div>
                    </div>
                </div>

                {/* B2C TEMPLATE */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <UsersIcon className="h-5 w-5 text-indigo-400" />
                        Template B2C (Tutores)
                    </h2>
                    <p className="text-sm text-slate-400 mb-4">Sugestão padrão para clínicas ativarem o "Indique um Amigo".</p>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm p-3 bg-slate-900 rounded-lg">
                            <span className="text-slate-300">Quem Indica Ganha:</span>
                            <span className="font-bold text-green-400">R$ 20,00 Crédito</span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 bg-slate-900 rounded-lg">
                            <span className="text-slate-300">Amigo Ganha:</span>
                            <span className="font-bold text-green-400">10% Off 1ª Cons.</span>
                        </div>
                    </div>

                    <button className="w-full mt-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-bold text-sm transition-colors">
                        Gerenciar Template Global
                    </button>
                </div>
            </div>

            {/* RANKING */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <ArrowTrendingUpIcon className="h-5 w-5 text-indigo-400" />
                        Top Parceiros (Ranking de Indicações)
                    </h3>
                    <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300">Ver Todos</button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-900/30 text-xs text-slate-400 uppercase font-bold">
                        <tr>
                            <th className="p-4 w-10">Rank</th>
                            <th className="p-4">Clínica Parceira</th>
                            <th className="p-4 text-center">Indicações Ativas</th>
                            <th className="p-4 text-center">Créditos Ganhos</th>
                            <th className="p-4 text-right">Última Atividade</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {referrers.map((ref, idx) => (
                            <tr key={ref.id} className="hover:bg-slate-700/50 transition-colors">
                                <td className="p-4 font-bold text-slate-500">#{idx + 1}</td>
                                <td className="p-4 font-bold text-white">{ref.name}</td>
                                <td className="p-4 text-center">
                                    <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold">{ref.referrals}</span>
                                </td>
                                <td className="p-4 text-center text-green-400 font-bold">{ref.creditsEarned} meses</td>
                                <td className="p-4 text-right text-slate-400 text-sm">{ref.lastReferral}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
