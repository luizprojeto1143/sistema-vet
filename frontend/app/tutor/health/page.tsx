"use client";

import React, { useState } from 'react';
import {
    ArrowLeftIcon,
    ShieldCheckIcon,
    BeakerIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const MOCK_VACCINES = [
    { id: 1, name: 'Vanguard HTLP 5/CV-L (V10)', date: '10/12/2024', next: '10/12/2025', status: 'OK', vet: 'Dr. Gabriel' },
    { id: 2, name: 'Raiva (Rabisin)', date: '15/06/2024', next: '15/06/2025', status: 'OK', vet: 'Dr. Gabriel' },
    { id: 3, name: 'GiardiaVax', date: '20/01/2023', next: '20/01/2024', status: 'LATE', vet: 'Dra. Ana' },
];

export default function HealthCardPage() {
    const [activeTab, setActiveTab] = useState('VACCINES');

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">

            <div className="bg-indigo-600 p-6 text-white pb-32 rounded-b-[40px] shadow-lg relative">
                <div className="flex items-center gap-4 mb-4">
                    <ArrowLeftIcon className="h-6 w-6" />
                    <h1 className="text-xl font-bold">Carteira de Saúde</h1>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={() => setActiveTab('VACCINES')}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'VACCINES' ? 'bg-white text-indigo-600 shadow' : 'bg-indigo-500/50 text-indigo-100'
                            }`}
                    >
                        Vacinas
                    </button>
                    <button
                        onClick={() => setActiveTab('MEDS')}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'MEDS' ? 'bg-white text-indigo-600 shadow' : 'bg-indigo-500/50 text-indigo-100'
                            }`}
                    >
                        Receitas
                    </button>
                </div>
            </div>

            <div className="-mt-24 px-6 space-y-4">

                {activeTab === 'VACCINES' && MOCK_VACCINES.map(vac => (
                    <div key={vac.id} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 relative overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 w-2 ${vac.status === 'OK' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg leading-tight">{vac.name}</h3>
                                <div className="text-xs text-gray-500 mt-1">Aplicada por {vac.vet}</div>
                            </div>
                            <ShieldCheckIcon className={`h-8 w-8 ${vac.status === 'OK' ? 'text-emerald-100' : 'text-red-100'}`} />
                        </div>

                        <div className="flex gap-4 mt-4 text-sm bg-gray-50 p-3 rounded-lg">
                            <div className="opacity-60">
                                <div className="text-[10px] font-bold uppercase">Aplicada em</div>
                                <div className="font-mono text-gray-700">{vac.date}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold uppercase text-indigo-600">Vence em</div>
                                <div className={`font-mono font-bold ${vac.status === 'OK' ? 'text-indigo-600' : 'text-red-600'}`}>
                                    {vac.next}
                                </div>
                            </div>
                        </div>

                        {vac.status === 'LATE' && (
                            <div className="mt-3 text-xs bg-red-50 text-red-600 font-bold px-3 py-2 rounded flex items-center gap-2">
                                <ClockIcon className="h-4 w-4" />
                                Vacina Atrasada! Agende agora.
                            </div>
                        )}
                    </div>
                ))}

            </div>

        </div>
    );
}
