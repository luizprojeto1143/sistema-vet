import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';

interface FinanceSummaryProps {
    summary: {
        totalRevenue: number;
        totalExpenses: number;
        netProfit: number;
        balance: number; // Assuming balance is same as netProfit for now or calculated differently
    }
}

export default function FinanceSummary({ summary }: FinanceSummaryProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">Receitas (Mês)</p>
                    <h3 className="text-2xl font-bold text-green-600">R$ {summary.totalRevenue.toFixed(2)}</h3>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                    <TrendingUp size={24} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">Despesas (Mês)</p>
                    <h3 className="text-2xl font-bold text-red-600">R$ {summary.totalExpenses.toFixed(2)}</h3>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                    <TrendingDown size={24} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">Lucro Líquido</p>
                    <h3 className={`text-2xl font-bold ${summary.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        R$ {summary.netProfit.toFixed(2)}
                    </h3>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <DollarSign size={24} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">Saldo em Caixa</p>
                    <h3 className="text-2xl font-bold text-gray-800">R$ {summary.netProfit.toFixed(2)}</h3>
                </div>
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">
                    <Wallet size={24} />
                </div>
            </div>
        </div>
    );
}
