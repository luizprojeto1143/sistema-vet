"use client";

import React, { useState, useEffect } from 'react';
import FinanceSummary from '@/components/finance/FinanceSummary';
import TransactionList from '@/components/finance/TransactionList';
import NewTransactionModal from '@/components/finance/NewTransactionModal';
import { Plus, Filter, Download } from 'lucide-react';

// Mock Data
export default function FinancePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        balance: 0
    });

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const [resTx, resDash] = await Promise.all([
                fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/finance', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/finance/dashboard', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (resTx.ok) {
                const data = await resTx.json();
                setTransactions(data);
            }

            if (resDash.ok) {
                const data = await resDash.json();
                setSummary(data.summary);
            }
        } catch (error) {
            console.error("Failed to fetch finance data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Financeiro</h1>
                    <p className="text-gray-500">Gestão completa de receitas e despesas</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 shadow-sm flex items-center gap-2">
                        <Filter size={18} /> Filtros
                    </button>
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 shadow-sm flex items-center gap-2">
                        <Download size={18} /> Exportar
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 shadow-sm flex items-center gap-2"
                    >
                        <Plus size={18} /> Novo Lançamento
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <FinanceSummary summary={summary} />

            {/* Transaction List */}
            <TransactionList transactions={transactions} />

            {/* Modal */}
            <NewTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
            />
        </div>
    );
}
