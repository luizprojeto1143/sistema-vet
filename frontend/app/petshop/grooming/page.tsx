"use client";

import React, { useState, useEffect } from 'react';
import {
    ScissorsIcon,
    ClockIcon,
    CheckCircleIcon,
    UserIcon,
    TicketIcon
} from '@heroicons/react/24/outline';

const GROOMING_COLUMNS = [
    { id: 'scheduled', label: 'Agendado', color: 'border-blue-500', bg: 'bg-blue-50' },
    { id: 'bathing', label: 'Em Banho', color: 'border-cyan-500', bg: 'bg-cyan-50' },
    { id: 'drying', label: 'Secagem', color: 'border-orange-500', bg: 'bg-orange-50' },
    { id: 'ready', label: 'Pronto / Aguardando', color: 'border-green-500', bg: 'bg-green-50' },
];

export default function GroomingPage() {
    const [tasks, setTasks] = useState<any[]>([]);

    useEffect(() => {
        async function loadTasks() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3001/appointments', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setTasks(data.map((t: any) => ({
                        id: t.id,
                        pet: t.pet?.name || 'Pet',
                        breed: t.pet?.breed || 'SRD',
                        service: t.service?.name || 'Banho',
                        status: mapStatus(t.status),
                        groomer: t.vet?.fullName || 'Staff',
                        time: new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    })));
                }
            } catch (e) { console.error(e); }
        }
        loadTasks();
    }, []);

    const mapStatus = (s: string) => {
        if (s === 'SCHEDULED') return 'scheduled';
        if (s === 'IN_PROGRESS') return 'bathing';
        if (s === 'COMPLETED') return 'ready';
        return 'scheduled';
    };

    return (
        <div className="p-8 h-screen flex flex-col bg-gray-50 overflow-hidden">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ScissorsIcon className="h-8 w-8 text-pink-600" />
                        Banho e Tosa (Kanban)
                    </h1>
                    <p className="text-sm text-gray-500">Gestão visual do fluxo de estética.</p>
                </div>

                <button className="bg-pink-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-pink-700 shadow-md flex items-center gap-2 transition-all">
                    <TicketIcon className="h-5 w-5" />
                    Nova Comanda
                </button>
            </div>

            {/* BOARD */}
            <div className="flex-1 flex gap-4 overflow-x-auto pb-4">

                {GROOMING_COLUMNS.map(col => (
                    <div key={col.id} className="flex-1 min-w-[280px] bg-gray-100 rounded-xl flex flex-col max-h-full">

                        {/* Column Header */}
                        <div className={`p-4 border-t-4 ${col.color} bg-white rounded-t-xl shadow-sm flex justify-between items-center`}>
                            <h3 className="font-bold text-gray-800 uppercase text-sm">{col.label}</h3>
                            <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full">
                                {tasks.filter((t: any) => t.status === col.id).length}
                            </span>
                        </div>

                        {/* Drop Zone */}
                        <div className="p-3 flex-1 overflow-y-auto space-y-3">
                            {tasks.filter((t: any) => t.status === col.id).length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center opacity-30 min-h-[100px]">
                                    <div className="text-4xl mb-2">☁️</div>
                                    <p className="text-xs font-bold text-gray-400">Sem agendamentos</p>
                                </div>
                            )}

                            {tasks.filter((t: any) => t.status === col.id).map((task: any) => (
                                <div key={task.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md cursor-grab active:cursor-grabbing transition-all relative group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-gray-900 text-lg">{task.pet}</div>
                                        <div className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{task.time}</div>
                                    </div>

                                    <div className="text-sm text-gray-600 mb-3">{task.breed} • {task.service}</div>

                                    <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                                        <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                            <UserIcon className="h-3 w-3" />
                                            {task.groomer}
                                        </div>
                                        <button className="text-pink-600 text-xs font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                                            Ver Comanda
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}
