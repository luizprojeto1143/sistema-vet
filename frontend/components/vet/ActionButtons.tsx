import React from 'react';
import { Syringe, FileText, Stethoscope, Scissors, FileCheck, Scale } from 'lucide-react';

interface ActionButtonsProps {
    onAction: (action: string) => void;
}

export default function ActionButtons({ onAction }: ActionButtonsProps) {
    const actions = [
        { id: 'internment', label: 'Internar', icon: <Stethoscope size={24} />, color: 'bg-red-50 text-red-600 hover:bg-red-100' },
        { id: 'prescription', label: 'Receita', icon: <FileText size={24} />, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
        { id: 'vaccine', label: 'Vacina', icon: <Syringe size={24} />, color: 'bg-green-50 text-green-600 hover:bg-green-100' },
        { id: 'exam', label: 'Exames', icon: <Scissors size={24} />, color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
        { id: 'document', label: 'Documentos', icon: <FileCheck size={24} />, color: 'bg-gray-50 text-gray-600 hover:bg-gray-100' },
        { id: 'weight', label: 'Peso', icon: <Scale size={24} />, color: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' },
    ];

    return (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {actions.map((action) => (
                <button
                    key={action.id}
                    onClick={() => onAction(action.id)}
                    className={`${action.color} p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-sm border border-transparent hover:border-current`}
                >
                    <div className="mb-1">{action.icon}</div>
                    <span className="text-xs font-bold uppercase tracking-wide">{action.label}</span>
                </button>
            ))}
        </div>
    );
}
