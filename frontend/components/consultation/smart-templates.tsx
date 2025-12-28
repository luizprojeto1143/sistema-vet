"use client";

import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

const TEMPLATES = [
    { label: 'Normal', text: 'Paciente alerta, responsivo, mucosas normocoradas, TPC < 2s. Ausculta cardíaca e pulmonar sem alterações.' },
    { label: 'Vômito', text: 'Histórico de êmese (3 episódios nas últimas 12h). Apatia moderada. Dor à palpação abdominal cranial.' },
    { label: 'Diarreia', text: 'Fezes pastosas/líquidas com presença de muco e estrias de sangue (hematoquezia). Tenesmo positivo.' },
    { label: 'Otite', text: 'Eritema moderado em pavilhão auricular D/E. Secreção ceruminosa enegrecida. Prurido intenso (Escala de dor 4/5).' },
    { label: 'Pós-Cirúrgico', text: 'Ferida cirúrgica limpa e seca, sem sinais de deiscência ou infecção. Pontos íntegros. Animal confortável.' }
];

interface Props {
    onApply: (text: string) => void;
}

export default function SmartTemplates({ onApply }: Props) {
    return (
        <div className="mt-3">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                <SparklesIcon className="w-3 h-3 text-brand-500" />
                <span>Smart Templates (IA Lite)</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {TEMPLATES.map((t, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => onApply(t.text)}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-colors shadow-sm"
                    >
                        {t.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
