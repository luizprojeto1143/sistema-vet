"use client";

import React, { useState } from 'react';
import { XMarkIcon, PrinterIcon, DocumentTextIcon, BanknotesIcon } from '@heroicons/react/24/outline';

interface PrintSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (options: string[]) => void;
}

export default function PrintSelectionModal({ isOpen, onClose, onConfirm }: PrintSelectionModalProps) {
    const [selected, setSelected] = useState<string[]>(['prescription']);

    const toggle = (id: string) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(item => item !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <PrinterIcon className="w-5 h-5 text-indigo-600" /> Imprimir Documentos
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3 mb-6">
                    <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                            type="checkbox"
                            checked={selected.includes('prescription')}
                            onChange={() => toggle('prescription')}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
                                <DocumentTextIcon className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-700">Receituário</span>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                            type="checkbox"
                            checked={selected.includes('budget')}
                            onChange={() => toggle('budget')}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <div className="flex items-center gap-2">
                            <div className="bg-green-100 text-green-600 p-1.5 rounded-lg">
                                <BanknotesIcon className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-700">Orçamento / Comanda</span>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                            type="checkbox"
                            checked={selected.includes('summary')}
                            onChange={() => toggle('summary')}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <div className="flex items-center gap-2">
                            <div className="bg-purple-100 text-purple-600 p-1.5 rounded-lg">
                                <DocumentTextIcon className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-700">Resumo de Atendimento</span>
                        </div>
                    </label>
                </div>

                <button
                    onClick={() => onConfirm(selected)}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                    Imprimir Selecionados
                </button>
            </div>
        </div>
    );
}
