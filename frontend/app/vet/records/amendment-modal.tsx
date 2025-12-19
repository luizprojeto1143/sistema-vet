"use client";

import React, { useState } from 'react';
import {
    ExclamationTriangleIcon,
    PencilSquareIcon,
    DocumentCheckIcon
} from '@heroicons/react/24/outline';

export default function AmendmentModal({ onClose }: { onClose: () => void }) {
    const [reason, setReason] = useState('');
    const [correction, setCorrection] = useState('');

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200">

                {/* WARNING HEADER */}
                <div className="bg-amber-50 p-6 border-b border-amber-100 flex items-start gap-4">
                    <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                        <ExclamationTriangleIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-amber-900">Retificação de Prontuário</h3>
                        <p className="text-sm text-amber-800 mt-1">
                            Atenção: O registro original <strong>NÃO será apagado</strong>.
                            Esta ação criará uma "Nota de Retificação" vinculada e auditável,
                            preservando o histórico legal.
                        </p>
                    </div>
                </div>

                <div className="p-6 space-y-6">

                    {/* ORIGINAL CONTENT (READ ONLY) */}
                    <div className="opacity-60 bg-gray-50 p-4 rounded-lg border border-gray-200 pointer-events-none select-none">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Conteúdo Original (Travado)</label>
                        <p className="text-gray-800 font-mono text-sm">"Paciente apresentou vômito (3x)..."</p>
                    </div>

                    {/* CORRECTION FIELD */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <PencilSquareIcon className="h-4 w-4 text-indigo-600" />
                            Texto Corrigido / Adicional
                        </label>
                        <textarea
                            value={correction}
                            onChange={(e) => setCorrection(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 h-32"
                            placeholder="Ex: Correção: O paciente apresentou vômito apenas 1x, não 3x como relatado anteriormente."
                        />
                    </div>

                    {/* JUSTIFICATION */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Justificativa Legal *
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                        >
                            <option value="">Selecione o motivo...</option>
                            <option value="TYPO">Erro de Digitação</option>
                            <option value="NEW_INFO">Informação Adicional Tardia</option>
                            <option value="INCORRECT_PATIENT">Registro em Paciente Errado</option>
                        </select>
                    </div>

                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-200"
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={!reason || !correction}
                        className="px-6 py-2 rounded-lg font-bold bg-amber-600 text-white hover:bg-amber-700 shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <DocumentCheckIcon className="h-5 w-5" />
                        Assinar Retificação
                    </button>
                </div>

            </div>
        </div>
    );
}
