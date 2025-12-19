"use client";

import React, { useState } from 'react';
import {
    BanknotesIcon,
    ArrowPathIcon,
    BuildingLibraryIcon,
    ClockIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function WithdrawalPage() {
    const [balance, setBalance] = useState(3450.00); // Mock Available Balance
    const [pending, setPending] = useState(1200.00); // Mock Pending (Future release)
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [history, setHistory] = useState([
        { id: 1, date: '2024-03-10', amount: 2000.00, status: 'COMPLETED', destination: 'Banco Itaú **** 3211' },
        { id: 2, date: '2024-03-01', amount: 1500.00, status: 'COMPLETED', destination: 'Banco Itaú **** 3211' },
    ]);

    const handleWithdraw = () => {
        if (!withdrawAmount) return;
        const amount = Number(withdrawAmount);
        if (amount > balance) {
            alert('Saldo insuficiente!');
            return;
        }

        if (confirm(`Confirma o saque de R$ ${amount.toFixed(2)} para sua conta bancária cadastrada?`)) {
            // Mock API Call
            alert('Solicitação de saque enviada! O dinheiro estará na conta em até 1 dia útil.');
            setBalance(prev => prev - amount);
            setHistory([{
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                amount: amount,
                status: 'PROCESSING',
                destination: 'Banco Itaú **** 3211'
            }, ...history]);
            setWithdrawAmount('');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <BuildingLibraryIcon className="h-8 w-8 text-indigo-600" />
                Meus Ganhos & Saques
            </h1>
            <p className="text-slate-500 mb-8">Gerencie seu saldo disponível no Mercado Pago e realize transferências.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* BALANCE CARDS */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* AVAILABLE */}
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
                            <div className="flex items-center gap-2 mb-4 opacity-80">
                                <BanknotesIcon className="h-6 w-6" />
                                <span className="text-sm font-bold uppercase tracking-wider">Saldo Disponível</span>
                            </div>
                            <div className="text-4xl font-black mb-2">{balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                            <div className="text-xs opacity-70">Livre para saque imediato</div>
                        </div>

                        {/* PENDING */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 text-slate-500">
                                <ClockIcon className="h-6 w-6" />
                                <span className="text-sm font-bold uppercase tracking-wider">A Liberar (Futuro)</span>
                            </div>
                            <div className="text-4xl font-black text-slate-700">{pending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                            <div className="text-xs text-slate-400">Vendas crédito/parcelado</div>
                        </div>
                    </div>

                    {/* WITHDRAWAL ACTION */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
                            Solicitar Transferência (Saque)
                        </h2>

                        <div className="flex flex-col md:flex-row gap-6 items-end">
                            <div className="w-full">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Valor do Saque</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-slate-500 font-bold text-lg">R$</span>
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        className="w-full text-lg pl-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-800"
                                        placeholder="0,00"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleWithdraw}
                                disabled={!withdrawAmount || Number(withdrawAmount) > balance}
                                className="w-full md:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                            >
                                <ArrowPathIcon className="h-5 w-5" />
                                Confirmar Saque
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
                            <BuildingLibraryIcon className="h-4 w-4" />
                            Transferência para conta: <strong>Banco Itaú (Ag **** Conta ****-1)</strong>
                        </p>
                    </div>
                </div>

                {/* HISTORY */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-fit">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                        Histórico de Saques
                    </div>
                    <div className="divide-y divide-slate-100">
                        {history.map((item) => (
                            <div key={item.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                <div>
                                    <div className="font-bold text-slate-700">{item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                    <div className="text-xs text-slate-400">{item.date}</div>
                                </div>
                                <div>
                                    {item.status === 'COMPLETED' ? (
                                        <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                                            <CheckCircleIcon className="h-3 w-3" /> Pago
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded-full">
                                            <ClockIcon className="h-3 w-3" /> Processando
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
