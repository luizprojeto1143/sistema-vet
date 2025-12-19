"use client";

import React, { useState } from 'react';
import {
    EyeSlashIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';

interface SensitiveGuardProps {
    children: React.ReactNode;
    isSensitive: boolean;
    blurReason?: string; // e.g. "VIP Client", "Aggressive Tutor", "Legal Dispute"
}

export default function SensitiveGuard({ children, isSensitive, blurReason = "Dados Sensíveis" }: SensitiveGuardProps) {
    const [isRevealed, setIsRevealed] = useState(!isSensitive);

    if (isRevealed) {
        return (
            <div className="relative">
                {isSensitive && (
                    <div className="bg-red-50 border-b border-red-100 p-2 text-xs text-red-700 font-bold flex items-center justify-between mb-2 rounded">
                        <span className="flex items-center gap-2">
                            <EyeSlashIcon className="h-4 w-4" />
                            Modo Auditado: Visualizando Registro Sensível ({blurReason})
                        </span>
                        <button
                            onClick={() => setIsRevealed(false)}
                            className="underline hover:text-red-900"
                        >
                            Ocultar Novamente
                        </button>
                    </div>
                )}
                {children}
            </div>
        );
    }

    return (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-64 flex flex-col items-center justify-center text-center p-8">
            <div className="absolute inset-0 bg-gray-100 backdrop-blur-xl z-0"></div>

            <div className="relative z-10 p-6 bg-white rounded-2xl shadow-xl max-w-sm">
                <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LockClosedIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Conteúdo Protegido</h3>
                <p className="text-sm text-gray-500 mb-6">
                    Este prontuário foi marcado como <strong>{blurReason}</strong>.
                    Sua visualização será registrada no Log de Auditoria.
                </p>
                <button
                    onClick={() => {
                        // TODO: Trigger Audit Log API Call here
                        console.log("AUDIT: User viewed sensitive record");
                        setIsRevealed(true);
                    }}
                    className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 shadow-lg transition-transform active:scale-95"
                >
                    Confirmar e Revelar
                </button>
            </div>
        </div>
    );
}
