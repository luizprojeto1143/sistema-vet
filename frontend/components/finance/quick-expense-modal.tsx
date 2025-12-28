"use client";

import React, { useState } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

const QuickExpenseModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                <div className="flex items-center gap-2 mb-4 text-red-600 font-bold text-lg">
                    <CurrencyDollarIcon className="w-6 h-6" />
                    <h2>Lançar Despesa Rápida</h2>
                </div>

                <form className="space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">VALOR (R$)</label>
                        <input type="number" className="w-full text-2xl font-bold p-2 border-b-2 border-red-100 focus:border-red-500 outline-none text-gray-800" placeholder="0,00" autoFocus />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">DESCRIÇÃO</label>
                        <input type="text" className="w-full p-2 bg-gray-50 rounded-lg text-sm" placeholder="Ex: Café, Material Limpeza..." />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button type="button" className="py-2 bg-gray-100 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-200">PIX</button>
                        <button type="button" className="py-2 bg-gray-100 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-200">DINHEIRO</button>
                    </div>

                    <button className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 mt-4">
                        CONFIRMAR SAÍDA
                    </button>
                </form>

                <button onClick={onClose} className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600">Cancelar</button>
            </div>
        </div>
    );
}

export default QuickExpenseModal;
