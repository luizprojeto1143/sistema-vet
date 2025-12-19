"use client";

import React, { useState } from 'react';
import {
    BanknotesIcon,
    HandThumbUpIcon,
    CalculatorIcon
} from '@heroicons/react/24/outline';

export default function NegotiationModal({ onClose }: { onClose: () => void }) {
    const [installments, setInstallments] = useState(1);
    const [discount, setDiscount] = useState(0);

    const TOTAL_DEBT = 1250.00;
    const newTotal = TOTAL_DEBT - discount;
    const installmentValue = newTotal / installments;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideIn">

                <div className="bg-slate-800 p-6 text-white border-b border-slate-700">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <HandThumbUpIcon className="h-6 w-6 text-emerald-400" />
                        Negociação de Débitos (Acordo)
                    </h3>
                    <p className="text-slate-400 text-sm">Regularize a situação do tutor <strong>Carlos Eduardo</strong>.</p>
                </div>

                <div className="p-6">

                    <div className="flex justify-between items-center mb-6 bg-red-50 p-4 rounded-lg border border-red-100">
                        <span className="text-red-800 font-bold">Dívida Total Selecionada</span>
                        <span className="text-2xl font-bold text-red-600">R$ {TOTAL_DEBT.toFixed(2)}</span>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Desconto / Abatimento (R$)</label>
                            <input
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(Number(e.target.value))}
                                className="w-full p-3 border border-gray-300 rounded-lg text-emerald-700 font-bold"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Parcelamento (Novo Plano)</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setInstallments(num)}
                                        className={`py-2 rounded-lg font-bold border transition-all ${installments === num
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                                            }`}
                                    >
                                        {num}x
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h4 className="font-bold text-gray-700 text-sm uppercase mb-2">Resumo do Acordo</h4>
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span>Valor Renegociado:</span>
                                <span className="font-bold">R$ {newTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg text-indigo-700 font-bold border-t border-gray-200 mt-2 pt-2">
                                <span>{installments}x de</span>
                                <span>R$ {installmentValue.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded" />
                            <span className="text-xs text-gray-600">Gerar "Termo de Confissão de Dívida" para assinatura.</span>
                        </div>

                    </div>

                    <div className="mt-8 flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-lg">Cancelar</button>
                        <button className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow flex justify-center items-center gap-2">
                            <BanknotesIcon className="h-5 w-5" />
                            Firmar Acordo
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
