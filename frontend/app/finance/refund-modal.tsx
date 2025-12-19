"use client";

import React, { useState } from 'react';
import {
    ArrowPathIcon,
    BanknotesIcon,
    CalculatorIcon
} from '@heroicons/react/24/outline';

const MOCK_TRANSACTION = {
    id: '#9912',
    total: 450.00,
    items: [
        { name: 'Consulta Geral', value: 150.00 },
        { name: 'Vacina V10', value: 120.00 },
        { name: 'Exame de Sangue', value: 180.00 }
    ]
};

export default function RefundModal({ onClose }: { onClose: () => void }) {
    const [refundType, setRefundType] = useState('FULL');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-slideIn">

                <div className="bg-red-50 p-6 border-b border-red-100">
                    <h3 className="text-xl font-bold text-red-700 flex items-center gap-2">
                        <ArrowPathIcon className="h-6 w-6" />
                        Estorno / Devolução
                    </h3>
                    <p className="text-sm text-red-600">Transação {MOCK_TRANSACTION.id} • R$ {MOCK_TRANSACTION.total.toFixed(2)}</p>
                </div>

                <div className="p-6">
                    {/* TYPE SELECTOR */}
                    <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                        <button
                            onClick={() => setRefundType('FULL')}
                            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${refundType === 'FULL' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
                        >
                            Total (100%)
                        </button>
                        <button
                            onClick={() => setRefundType('PARTIAL')}
                            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${refundType === 'PARTIAL' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
                        >
                            Parcial (Item)
                        </button>
                    </div>

                    {refundType === 'PARTIAL' && (
                        <div className="space-y-3 mb-6 border border-gray-200 rounded-lg p-2 max-h-48 overflow-y-auto">
                            {MOCK_TRANSACTION.items.map((item, idx) => (
                                <label key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5 text-red-600 rounded"
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedItems([...selectedItems, item.name]);
                                                else setSelectedItems(selectedItems.filter(i => i !== item.name));
                                            }}
                                        />
                                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                    </div>
                                    <span className="font-mono font-bold text-gray-900">R$ {item.value.toFixed(2)}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600 font-bold">Valor a Estornar:</span>
                            <span className="text-2xl font-bold text-red-700">
                                {refundType === 'FULL'
                                    ? `R$ ${MOCK_TRANSACTION.total.toFixed(2)}`
                                    : 'R$ ...' // Calculate based on selection
                                }
                            </span>
                        </div>
                        <div className="text-xs text-gray-500">
                            O valor será devolvido para o método de origem (Cartão de Crédito).
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancelar</button>
                        <button className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-lg flex justify-center items-center gap-2">
                            <BanknotesIcon className="h-5 w-5" />
                            Confirmar Estorno
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
