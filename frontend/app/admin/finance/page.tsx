"use client";

import React, { useState, useEffect } from 'react';
import {
    BanknotesIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CreditCardIcon
} from '@heroicons/react/24/outline';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

export default function FinanceDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch Dashboard Data
        // mock logic for now
        setTimeout(() => {
            setStats({
                totalRevenue: 15450.00,
                totalExpenses: 3200.00,
                netProfit: 12250.00,
                platformFeesPaid: 772.50, // 5%
                margin: 79.3
            });
            setChartData([
                { date: '01/12', income: 1200, expense: 300 },
                { date: '02/12', income: 1500, expense: 100 },
                { date: '03/12', income: 800, expense: 50 },
                { date: '04/12', income: 2000, expense: 600 },
                { date: '05/12', income: 2500, expense: 200 },
                { date: '06/12', income: 1800, expense: 400 },
                { date: '07/12', income: 3000, expense: 800 },
            ] as any);
            setRecentTransactions([
                { id: '1', description: 'Consulta - Thor', amount: 150, type: 'INCOME', status: 'COMPLETED', date: 'Hoje' },
                { id: '2', description: 'Vacina - Luna', amount: 80, type: 'INCOME', status: 'COMPLETED', date: 'Hoje' },
                { id: '3', description: 'Compra de Suprimentos', amount: 450, type: 'EXPENSE', status: 'COMPLETED', date: 'Ontem' },
            ] as any);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return <div className="p-8 text-slate-500">Carregando Finanças...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Painel Financeiro</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <ArrowTrendingUpIcon className="h-6 w-6" />
                        </div>
                        <span className="text-slate-500 font-medium">Receita</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-800">
                        R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                            <ArrowTrendingDownIcon className="h-6 w-6" />
                        </div>
                        <span className="text-slate-500 font-medium">Despesas</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-800">
                        R$ {stats.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                            <BanknotesIcon className="h-6 w-6" />
                        </div>
                        <span className="text-slate-500 font-medium">Lucro Líquido</span>
                    </div>
                    <div className="text-3xl font-bold text-indigo-600">
                        R$ {stats.netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-green-600 font-bold mt-1">Margem: {stats.margin}%</div>
                </div>

                {/* SaaS Fee Highlight - The Split */}
                <div className="bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-700 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-slate-700 text-white rounded-lg">
                                <CreditCardIcon className="h-6 w-6" />
                            </div>
                            <span className="text-slate-300 font-medium">Taxas Plataforma</span>
                        </div>
                        <div className="text-3xl font-bold">
                            R$ {stats.platformFeesPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">Split Automático (5%)</div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96">
                    <h3 className="font-bold text-slate-700 mb-6">Fluxo de Caixa (7 Dias)</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#1e293b' }}
                            />
                            <Bar dataKey="income" name="Entradas" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar dataKey="expense" name="Saídas" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96">
                    <h3 className="font-bold text-slate-700 mb-6">Transações Recentes</h3>
                    <div className="space-y-4 overflow-y-auto h-[80%] pr-2">
                        {recentTransactions.map((tx: any) => (
                            <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {tx.type === 'INCOME' ? <ArrowTrendingUpIcon className="h-5 w-5" /> : <ArrowTrendingDownIcon className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-700">{tx.description}</div>
                                        <div className="text-xs text-slate-400">{tx.date} • {tx.status}</div>
                                    </div>
                                </div>
                                <div className={`font-bold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.type === 'INCOME' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
