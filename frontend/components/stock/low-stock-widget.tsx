"use client";

import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const MOCK_LOW_STOCK = [
    { name: 'Dipirona Gotas 20ml', current: 2, min: 10 },
    { name: 'Seringa 3ml', current: 15, min: 100 },
    { name: 'Vacina V10 (Importada)', current: 1, min: 5 },
];

export default function LowStockWidget() {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-red-100 overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-700 font-bold">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    <span>Alertas de Estoque</span>
                </div>
                <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full font-bold">
                    {MOCK_LOW_STOCK.length} CRÍTICOS
                </span>
            </div>
            <div className="p-4">
                <div className="space-y-3">
                    {MOCK_LOW_STOCK.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 font-medium truncate max-w-[150px]">{item.name}</span>
                            <div className="flex items-center gap-3">
                                <span className="text-red-600 font-bold">{item.current} un</span>
                                <span className="text-xs text-gray-400">Min: {item.min}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    VER RELATÓRIO DE COMPRAS →
                </button>
            </div>
        </div>
    );
}
