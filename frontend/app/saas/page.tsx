"use client";
import React, { useEffect, useState } from 'react';
import {
    CurrencyDollarIcon,
    BuildingStorefrontIcon,
    UserGroupIcon,
    ArrowTrendingUpIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

function StatCard({ title, value, subtext, icon: Icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
            <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
                <p className={`text-xs mt-1 font-bold ${subtext.includes('+') ? 'text-green-500' : 'text-slate-400'}`}>
                    {subtext}
                </p>
            </div>
            <div className={`p-3 rounded-xl ${color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : color === 'green' ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'}`}>
                <Icon className="h-6 w-6" />
            </div>
        </div>
    );
}

export default function SaasDashboard() {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/saas/dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setMetrics(await res.json());
        setLoading(false);
    };

    if (loading) return <div className="p-10 text-center">Carregando painel master...</div>;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Visão Geral</h1>
                <p className="text-slate-500">Acompanhe a saúde do seu SaaS Veterinário.</p>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="MRR (Mensal)"
                    value={`R$ ${metrics?.mrr?.toLocaleString() || '0,00'}`}
                    subtext="+12% este mês"
                    icon={CurrencyDollarIcon}
                    color="green"
                />
                <StatCard
                    title="Clínicas Ativas"
                    value={metrics?.activeClinics || 0}
                    subtext={`${metrics?.totalClinics || 0} registradas`}
                    icon={BuildingStorefrontIcon}
                    color="indigo"
                />
                <StatCard
                    title="Churn Rate"
                    value={`${metrics?.churnRate || 0}%`}
                    subtext="Abaixo da média (2%)"
                    icon={ArrowTrendingUpIcon}
                    color="rose"
                />
                <StatCard
                    title="System Health"
                    value={metrics?.healthStatus || 'OK'}
                    subtext="Sem incidentes recentes"
                    icon={ShieldCheckIcon}
                    color="blue"
                />
            </div>

            {/* Recent Activity Mock */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Atividade Recente (Global)</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4 text-sm border-b pb-4 last:border-0 last:pb-0">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="font-bold text-slate-700">Nova Clínica Cadastrada:</span>
                            <span className="text-slate-500">VetCare Pinheiros (Plano Pro)</span>
                            <span className="ml-auto text-slate-400">há {i}h</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
