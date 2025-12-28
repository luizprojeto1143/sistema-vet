"use client";

import React, { useState } from 'react';
import { ClipboardDocumentCheckIcon, UserIcon } from '@heroicons/react/24/outline';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function HandoverModal({ isOpen, onClose }: Props) {
    const [step, setStep] = useState(1);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-indigo-600 p-6 text-white text-center">
                    <ClipboardDocumentCheckIcon className="w-12 h-12 mx-auto mb-2 opacity-80" />
                    <h2 className="text-2xl font-bold">Passagem de Plantão</h2>
                    <p className="text-indigo-200 text-sm">Transferência segura de responsabilidade</p>
                </div>

                <div className="p-6 space-y-4">
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-700 border-b pb-2">1. Pendências Críticas</h3>
                            <label className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100 cursor-pointer hover:bg-red-100 transition-colors">
                                <input type="checkbox" className="mt-1 w-4 h-4 text-red-600 rounded" />
                                <div className="text-sm text-gray-700">
                                    <strong>Thor (Box 3):</strong> Checar glicemia às 16h impreterivelmente.
                                </div>
                            </label>
                            <label className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100 cursor-pointer hover:bg-yellow-100 transition-colors">
                                <input type="checkbox" className="mt-1 w-4 h-4 text-yellow-600 rounded" />
                                <div className="text-sm text-gray-700">
                                    <strong>Mia (Box 1):</strong> Aguardando autorização do tutor para USG.
                                </div>
                            </label>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-700 border-b pb-2">2. Narcóticos & Controlados</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="block text-xs text-gray-500 uppercase">Morfina (Amps)</span>
                                    <strong className="text-xl text-gray-800">12</strong>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="block text-xs text-gray-500 uppercase">Propofol (Frascos)</span>
                                    <strong className="text-xl text-gray-800">03</strong>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 italic">
                                * Ao confirmar, você atesta que a contagem física bate com o sistema.
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-gray-50 flex justify-between">
                    {step > 1 ? (
                        <button onClick={() => setStep(step - 1)} className="text-gray-500 font-bold px-4 hover:text-gray-700">
                            Voltar
                        </button>
                    ) : (
                        <button onClick={onClose} className="text-gray-400 font-bold px-4 hover:text-gray-600">
                            Cancelar
                        </button>
                    )}

                    {step < 2 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition"
                        >
                            Próximo
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition flex items-center gap-2"
                        >
                            <span>✅</span> Confirmar Passagem
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
