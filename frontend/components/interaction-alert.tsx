"use client";

import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

export default function InteractionAlert({ drugs }: { drugs: string[] }) {
    // Mock logic for demonstration
    // Real logic would query a knowledge base
    const hasInteraction = drugs.some(d => d.includes('Anti-inflamatório')) && drugs.some(d => d.includes('Corticóide'));

    if (!hasInteraction) return null;

    return (
        <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg animate-slideIn">
            <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-amber-500 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-amber-800 text-sm uppercase">Alerta de Interação Medicamentosa</h4>
                    <p className="text-amber-700 text-sm mt-1">
                        Combinação potencialmente perigosa detectada: <strong>AINEs + Corticóides</strong>.
                    </p>
                    <p className="text-amber-600 text-xs mt-2 italic">
                        Risco aumentado de úlcera gástrica e hemorragia. Considere gastroproteção ou revisão terapêutica.
                    </p>
                </div>
            </div>
        </div>
    );
}
