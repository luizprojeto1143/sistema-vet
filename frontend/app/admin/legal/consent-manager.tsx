"use client";

import React, { useState } from 'react';
import {
    ClipboardDocumentCheckIcon,
    UserMinusIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

const MOCK_CONSENTS = [
    { id: 1, type: 'LGPD_DATA', title: 'Armazenamento de Dados (LGPD)', status: 'GRANTED', date: '10/01/2024', version: 'v1.0' },
    { id: 2, type: 'IMAGE_USE', title: 'Uso de Imagem (Redes Sociais)', status: 'GRANTED', date: '10/01/2024', version: 'v2.0' },
    { id: 3, type: 'MARKETING', title: 'Recebimento de Promoções (Email/Zap)', status: 'REVOKED', date: '15/05/2024', version: 'v1.0' },
];

export default function ConsentManager() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <ClipboardDocumentCheckIcon className="h-6 w-6 text-indigo-600" />
                    Gestão de Consentimentos (LGPD)
                </h3>
                <span className="text-sm text-gray-500">Tutor: <strong>Ana Silva</strong></span>
            </div>

            <div className="p-6 space-y-4">
                {MOCK_CONSENTS.map(consent => (
                    <div key={consent.id} className="flex justify-between items-center p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all">

                        <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${consent.status === 'GRANTED' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'
                                }`}>
                                {consent.status === 'GRANTED' ? <CheckCircleIcon className="h-6 w-6" /> : <XCircleIcon className="h-6 w-6" />}
                            </div>
                            <div>
                                <div className="font-bold text-gray-800">{consent.title}</div>
                                <div className="text-xs text-gray-500 flex gap-2">
                                    <span>Versão: {consent.version}</span>
                                    <span>•</span>
                                    <span>Atualizado em: {consent.date}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            {consent.status === 'GRANTED' ? (
                                <button className="text-red-500 text-xs font-bold border border-red-200 px-3 py-1.5 rounded hover:bg-red-50 flex items-center gap-1">
                                    <UserMinusIcon className="h-3 w-3" />
                                    Revogar
                                </button>
                            ) : (
                                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded">
                                    Revogado
                                </span>
                            )}
                        </div>

                    </div>
                ))}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-400 mb-3">
                    A revogação de consentimento não apaga dados históricos obrigatórios por lei fiscal ou sanitária (5 anos).
                </p>
                <button className="text-indigo-600 text-sm font-bold hover:underline">
                    + Enviar Novo Termo para Assinatura (App)
                </button>
            </div>
        </div>
    );
}
