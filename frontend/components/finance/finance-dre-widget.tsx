"use client";

import React, { useEffect, useState } from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

interface DREData {
    grossRevenue: number;
    deductions: {
        taxes: number;
        commissions: number;
        returns: number;
    };
    netRevenue: number;
    costs: number;
    netProfit: number;
    margin: number;
}

export default function FinanceDREWidget() {
    const [data, setData] = useState<DREData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/finance/dre`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setData(await res.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>;
    if (!data) return null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CurrencyDollarIcon className="w-6 h-6 text-brand-600" />
                Demonstrativo de Resultado (DRE)
            </h3>

            <div className="space-y-4">
                {/* Gross Revenue */}
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Receita Bruta</span>
                    <span className="text-base font-bold text-gray-800">R$ {data.grossRevenue.toFixed(2)}</span>
                </div>

                {/* Deductions (Red) */}
                <div className="pl-4 border-l-2 border-red-200 space-y-2">
                    <div className="flex justify-between text-xs text-red-500">
                        <span>(-) Impostos (Simples)</span>
                        <span>R$ {data.deductions.taxes.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-red-500">
                        <span>(-) Custos Variáveis</span>
                        <span>R$ {data.costs.toFixed(2)}</span>
                    </div>
                </div>

                {/* Net Profit (Big) */}
                <div className={`flex justify-between items-center p-4 rounded-xl border-l-4 ${data.netProfit >= 0 ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'}`}>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Lucro Líquido</p>
                        <div className="flex items-center gap-2">
                            <span className={`text-2xl font-extrabold ${data.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                                R$ {data.netProfit.toFixed(2)}
                            </span>
                            {data.netProfit >= 0 ? (
                                <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-500" />
                            ) : (
                                <ArrowTrendingDownIcon className="w-5 h-5 text-red-500" />
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Margem</p>
                        <p className={`text-lg font-bold ${data.margin >= 20 ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {data.margin.toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
