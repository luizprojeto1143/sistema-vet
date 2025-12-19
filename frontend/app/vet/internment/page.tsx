"use client";

import React, { useEffect, useState } from 'react';
import {
    HeartIcon,
    ClockIcon,
    BeakerIcon,
    UserIcon,
    ExclamationCircleIcon,
    PlusIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

// Define static bed structure for the clinic (could be dynamic later)
const CLINIC_LAYOUT = [
    { id: 101, type: 'CANIL', label: 'Canil 01' },
    { id: 102, type: 'CANIL', label: 'Canil 02' },
    { id: 103, type: 'CANIL', label: 'Canil 03' },
    { id: 104, type: 'GATIL', label: 'Gatil 01' },
    { id: 105, type: 'GATIL', label: 'Gatil 02' },
    { id: 201, type: 'ISOLAMENTO', label: 'ISO 01' },
];

export default function InternmentDashboard() {
    const [internments, setInternments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        loadData();
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const loadData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/internment/active', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setInternments(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Merge Static Layout with Active Data
    const beds = CLINIC_LAYOUT.map(bed => {
        const active = internments.find(i => i.bedNumber === bed.id);
        return {
            ...bed,
            status: active ? 'OCCUPIED' : 'AVAILABLE',
            internment: active
        };
    });

    return (
        <div className="p-8 h-screen bg-gray-900 text-white flex flex-col overflow-hidden font-sans">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <HeartIcon className="h-10 w-10 text-red-500 animate-pulse" />
                        Painel de Internação
                    </h1>
                    <p className="text-gray-400 mt-1">Monitoramento em Tempo Real • Setor Geral</p>
                </div>

                <div className="text-right">
                    <div className="text-4xl font-mono font-bold text-white">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-sm text-gray-400">
                        {currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                </div>
            </div>

            {/* BEDS GRID */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center text-gray-500 animate-pulse">Carregando Leitos...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pb-20">
                    {beds.map(bed => (
                        <div
                            key={bed.id}
                            className={`relative rounded-2xl p-6 border-l-8 shadow-lg transition-transform hover:scale-[1.02] cursor-pointer group ${bed.status === 'AVAILABLE'
                                    ? 'bg-gray-800 border-gray-600 opacity-60 hover:opacity-100'
                                    : bed.internment?.reason.toLowerCase().includes('parvo') || bed.internment?.reason.toLowerCase().includes('contágio')
                                        ? 'bg-red-900/20 border-red-500' // Isolation style
                                        : 'bg-gray-800 border-emerald-500'
                                }`}
                            onClick={() => {
                                if (bed.status === 'OCCUPIED' && bed.internment) {
                                    // Navigate to Folio/Details
                                    window.location.href = `/vet/internment/${bed.internment.id}`;
                                } else {
                                    // Open Admit Modal (TODO)
                                    alert(`Deseja internar um paciente no Leito ${bed.label}? (Funcionalidade em desenvolvimento)`);
                                }
                            }}
                        >
                            {/* Bed Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl font-bold text-gray-200">#{bed.id}</span>
                                    <span className="text-xs font-bold px-2 py-1 rounded bg-gray-700 text-gray-300">{bed.label}</span>
                                </div>
                                {bed.status === 'OCCUPIED' && bed.internment && (
                                    <div className="flex flex-col items-end">
                                        <h2 className="text-2xl font-bold text-white">{bed.internment.pet?.name}</h2>
                                        <p className="text-xs text-gray-400 uppercase">{bed.internment.pet?.species}</p>
                                    </div>
                                )}
                            </div>

                            {bed.status === 'AVAILABLE' ? (
                                <div className="h-32 flex flex-col items-center justify-center text-gray-500 group-hover:text-emerald-400 transition-colors">
                                    <span className="font-bold text-xl uppercase tracking-widest mb-2">Disponível</span>
                                    <PlusIcon className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-xs opacity-0 group-hover:opacity-100">Clique para Internar</span>
                                </div>
                            ) : (
                                <>
                                    {/* Reason & Alerts */}
                                    <div className="mb-6 space-y-2">
                                        <div className="text-sm text-gray-300 font-medium bg-gray-700/50 p-2 rounded border border-gray-600/50">
                                            {bed.internment?.reason || 'Sem diagnóstico'}
                                        </div>
                                        {/* <div className="flex flex-wrap gap-2">
                                            <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-red-500/20 text-red-300 border border-red-500/50">
                                                <ExclamationCircleIcon className="h-3 w-3" />
                                                Alertas viriam aqui
                                            </span>
                                        </div> */}
                                    </div>

                                    {/* Next Medication Logic (Frontend Mock for Visual) */}
                                    <div className="bg-gray-700/50 rounded-xl p-4 flex justify-between items-center border border-gray-600">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/20 text-blue-300 rounded-lg">
                                                <ClockIcon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-400 uppercase font-bold">Próxima Medicação</div>
                                                <div className="text-lg font-bold text-white">--:--</div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
