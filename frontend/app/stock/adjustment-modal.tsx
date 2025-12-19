"use client";

import React, { useState } from 'react';
import {
    ArchiveBoxXMarkIcon,
    TrashIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function StockAdjustmentModal({ onClose }: { onClose: () => void }) {
    const [reason, setReason] = useState('');
    const [quantity, setQuantity] = useState('');

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">

                <div className="bg-gray-800 p-6 text-white border-b border-gray-700">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <ArchiveBoxXMarkIcon className="h-6 w-6 text-red-400" />
                        Ajuste de Estoque (Baixa)
                    </h3>
                    <p className="text-gray-400 text-sm">Registro de perdas, avarias ou consumo interno.</p>
                </div>

                <div className="p-6 space-y-6">

                    {/* PRODUCT INFO */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">📦</div>
                        <div>
                            <div className="font-bold text-gray-800">Vacina V10 (Dose)</div>
                            <div className="text-xs text-gray-500">Lote: 88291 • Val: 12/26</div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Quantidade a Remover</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-lg font-bold"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Motivo *</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                        >
                            <option value="">Selecione...</option>
                            <option value="BREAKAGE">Quebra / Avaria (Vidro quebrou)</option>
                            <option value="EXPIRY">Vencimento (Lixo Hospitalar)</option>
                            <option value="INTERNAL_USE">Consumo Interno (Limpeza/Uso Próprio)</option>
                            <option value="THEFT">Furto / Desaparecimento</option>
                            <option value="RECALL">Recall de Fabricante</option>
                        </select>
                    </div>

                    {reason === 'THEFT' && (
                        <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex gap-2 items-start text-xs text-red-700">
                            <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            Esta ação enviará um alerta imediato para a Administração.
                        </div>
                    )}
                    {reason === 'RECALL' && (
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex gap-2 items-start text-xs text-amber-700">
                            <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            O lote será bloqueado preventivamente até segunda ordem.
                        </div>
                    )}

                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <button onClick={onClose} className="text-gray-500 font-bold hover:text-gray-700">Cancelar</button>
                    <button
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50"
                        disabled={!reason || !quantity}
                    >
                        Confirmar Baixa
                    </button>
                </div>

            </div>
        </div>
    );
}
