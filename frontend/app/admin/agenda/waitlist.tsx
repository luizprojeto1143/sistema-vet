"use client";

import React, { useState } from 'react';
import {
    QueueListIcon,
    PhoneIcon,
    CheckBadgeIcon,
    XCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const MOCK_WAITLIST = [
    { id: 1, pet: 'Mel', tutor: 'Sra. Maria', phone: '(11) 99999-9999', notes: 'Prefere Sábado de manhã', priority: 'NORMAL', since: '2 dias atrás' },
    { id: 2, pet: 'Thor', tutor: 'Carlos', phone: '(11) 98888-8888', notes: 'Dor de ouvido - Encaixe Urgente', priority: 'URGENT', since: 'Hoje, 09:00' },
];

export default function WaitlistPanel() {
    return (
        <div className="bg-white border-l border-gray-200 w-80 h-full flex flex-col shadow-xl">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <QueueListIcon className="h-5 w-5 text-indigo-600" />
                    Fila de Espera
                </h3>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">2</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {MOCK_WAITLIST.map(item => (
                    <div key={item.id} className={`p-3 rounded-lg border shadow-sm relative group ${item.priority === 'URGENT' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                        }`}>
                        {item.priority === 'URGENT' && (
                            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                URGENTE
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-1">
                            <div className="font-bold text-gray-800">{item.pet} <span className="font-normal text-gray-500 text-xs">({item.tutor})</span></div>
                        </div>

                        <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                            <PhoneIcon className="h-3 w-3" /> {item.phone}
                        </div>

                        <p className="text-xs text-gray-600 italic bg-white/50 p-1 rounded mb-2">"{item.notes}"</p>

                        <div className="flex justify-between items-center mt-2 border-t pt-2 border-gray-100">
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                <ClockIcon className="h-3 w-3" /> {item.since}
                            </span>
                            <div className="flex gap-1">
                                <button className="text-emerald-600 hover:bg-emerald-50 p-1 rounded" title="Agendar (Encaixe)">
                                    <CheckBadgeIcon className="h-5 w-5" />
                                </button>
                                <button className="text-red-400 hover:bg-red-50 p-1 rounded" title="Remover">
                                    <XCircleIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-sm font-bold hover:border-indigo-400 hover:text-indigo-500 transition-colors">
                    + Adicionar à Fila
                </button>
            </div>
        </div>
    );
}
