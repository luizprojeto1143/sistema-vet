"use client";

import React from 'react';
import {
    BanknotesIcon,
    ArrowRightIcon,
    BuildingLibraryIcon,
    CpuChipIcon
} from '@heroicons/react/24/outline';

const MOCK_SALES = [
    { id: '#1001', service: 'Consulta', total: 150.00, fee: 7.50, net: 142.50 },
    { id: '#1002', service: 'Vacina V10', total: 120.00, fee: 6.00, net: 114.00 },
    { id: '#1003', service: 'Cirurgia', total: 1500.00, fee: 75.00, net: 1425.00 },
];

export default function RevenueSplitWidget() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <BanknotesIcon className="h-6 w-6 text-indigo-600" />
                        Transparência de Repasses
                    </h3>
                    <p className="text-xs text-gray-500">Modelo: 5% sobre Faturamento (Automático)</p>
                </div>
                <div className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                    Plataforma Ativa
                </div>
            </div>

            <div className="p-6 grid grid-cols-2 gap-8 items-center border-b border-gray-100">
                {/* LEFT: TOTAL */}
                <div className="text-center border-r border-gray-100 pr-8">
                    <div className="text-sm text-gray-500 font-bold uppercase mb-1">Faturamento Bruto</div>
                    <div className="text-3xl font-bold text-gray-900">R$ 1.770,00</div>
                    <div className="text-xs text-gray-400 mt-1">Acumulado Hoje</div>
                </div>

                {/* RIGHT: SPLIT VISUALIZATION */}
                <div className="flex items-center gap-2">
                    {/* CLINIC PART */}
                    <div className="flex-1 bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-center relative">
                        <BuildingLibraryIcon className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                        <div className="text-xs text-emerald-600 font-bold mb-1">Sua Clínica (95%)</div>
                        <div className="text-lg font-bold text-emerald-800">R$ 1.681,50</div>
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 text-gray-300">
                            <ArrowRightIcon className="h-4 w-4" />
                        </div>
                    </div>

                    {/* PLATFORM PART */}
                    <div className="w-24 bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-center opacity-75">
                        <CpuChipIcon className="h-5 w-5 text-indigo-600 mx-auto mb-1" />
                        <div className="text-[10px] text-indigo-600 font-bold mb-1">Taxa Sistema (5%)</div>
                        <div className="text-sm font-bold text-indigo-800">R$ 88,50</div>
                    </div>
                </div>
            </div>

            {/* RECENT TRANSACTIONS */}
            <div className="bg-gray-50/50">
                <div className="px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Últimos Lançamentos</div>
                {MOCK_SALES.map(sale => (
                    <div key={sale.id} className="px-6 py-3 flex justify-between items-center border-t border-gray-100 hover:bg-white transition-colors">
                        <div>
                            <div className="font-bold text-gray-700 text-sm">{sale.service} <span className="text-gray-400 font-normal">({sale.id})</span></div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-400 line-through decoration-red-300">R$ {sale.total.toFixed(2)}</span>
                            <ArrowRightIcon className="h-3 w-3 text-gray-300" />
                            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                R$ {sale.net.toFixed(2)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
