"use client";

import React, { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    ArrowDownTrayIcon,
    BarsArrowDownIcon
} from '@heroicons/react/24/outline';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch Transactions
        // In real app: fetch(`/finance?clinicId=...`)
        setTimeout(() => {
            const mockData = [
                {
                    id: 'tx_123456789',
                    date: '2025-12-19 10:30',
                    description: 'Consulta Dr. House - Thor',
                    amount: 150.00,
                    platformFee: 7.50, // 5%
                    netAmount: 142.50,
                    status: 'COMPLETED',
                    type: 'INCOME',
                    method: 'CREDIT_CARD'
                },
                {
                    id: 'tx_987654321',
                    date: '2025-12-19 11:15',
                    description: 'Vacina V10 - Luna',
                    amount: 80.00,
                    platformFee: 4.00, // 5%
                    netAmount: 76.00,
                    status: 'COMPLETED',
                    type: 'INCOME',
                    method: 'PIX'
                },
                {
                    id: 'tx_456123789',
                    date: '2025-12-18 16:20',
                    description: 'Banho e Tosa - Mel',
                    amount: 60.00,
                    platformFee: 3.00, // 5%
                    netAmount: 57.00,
                    status: 'COMPLETED',
                    type: 'INCOME',
                    method: 'DEBIT_CARD'
                },
                {
                    id: 'tx_EXP_001',
                    date: '2025-12-18 09:00',
                    description: 'Reposição de Estoque (Fornecedor X)',
                    amount: 450.00,
                    platformFee: 0,
                    netAmount: -450.00,
                    status: 'COMPLETED',
                    type: 'EXPENSE',
                    method: 'TRANSFER'
                },
            ];
            setTransactions(mockData);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Transações</h1>
                    <p className="text-slate-500">Histórico completo e detalhamento de taxas.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-all shadow-sm">
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    Exportar CSV
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4">
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 absolute left-3 top-3" />
                    <input
                        type="text"
                        placeholder="Buscar por descrição, ID ou cliente..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <select className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 outline-none">
                    <option>Status: Todos</option>
                    <option>Concluído</option>
                    <option>Pendente</option>
                </select>
                <select className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 outline-none">
                    <option>Período: Este Mês</option>
                    <option>Hoje</option>
                    <option>Ontem</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Data / ID</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Descrição</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Método</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Valor Bruto</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right text-indigo-600">Taxa SaaS (5%)</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right text-green-600">Líquido Clínica</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={7} className="p-8 text-center text-slate-500">Carregando...</td></tr>
                        ) : transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-slate-700">{tx.date.split(' ')[0]}</div>
                                    <div className="text-xs text-slate-400 font-mono">{tx.id.slice(0, 8)}...</div>
                                </td>
                                <td className="p-4 text-slate-700 font-medium">{tx.description}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded-md bg-slate-100 text-xs font-bold text-slate-600">
                                        {tx.method}
                                    </span>
                                </td>
                                <td className={`p-4 text-right font-bold ${tx.type === 'EXPENSE' ? 'text-red-600' : 'text-slate-800'}`}>
                                    {tx.type === 'EXPENSE' ? '-' : ''} R$ {tx.amount.toFixed(2)}
                                </td>
                                <td className="p-4 text-right font-bold text-indigo-600">
                                    {tx.platformFee > 0 ? `- R$ ${tx.platformFee.toFixed(2)}` : '-'}
                                </td>
                                <td className="p-4 text-right font-bold text-green-700">
                                    {tx.type === 'INCOME'
                                        ? `R$ ${tx.netAmount.toFixed(2)}`
                                        : '-'
                                    }
                                </td>
                                <td className="p-4 text-center">
                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
