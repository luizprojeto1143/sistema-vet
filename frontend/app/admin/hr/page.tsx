"use client";

import React, { useState } from 'react';
import {
    UsersIcon,
    CalendarDaysIcon,
    ClockIcon,
    UserPlusIcon,
    BriefcaseIcon,
    ShieldExclamationIcon
} from '@heroicons/react/24/outline';

const MOCK_SHIFTS = [
    { id: 1, user: 'Dr. Gabriel', date: '2025-12-19', start: '08:00', end: '18:00', type: 'REGULAR', status: 'CONFIRMED' },
    { id: 2, user: 'Dr. Gabriel', date: '2025-12-20', start: '08:00', end: '18:00', type: 'REGULAR', status: 'CONFIRMED' },
    { id: 3, user: 'Dra. Ana', date: '2025-12-19', start: '18:00', end: '08:00', type: 'ON_CALL', status: 'CONFIRMED' }, // Plantão
    { id: 4, user: 'Enf. Carla', date: '2025-12-19', start: '07:00', end: '19:00', type: 'REGULAR', status: 'VACATION_SUB', subFor: 'Enf. Beatriz' },
];

export default function HRPage() {
    const [activeTab, setActiveTab] = useState('SCALE');

    return (
        <div className="p-8 bg-gray-50 min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BriefcaseIcon className="h-8 w-8 text-blue-600" />
                        RH e Escalas de Trabalho
                    </h1>
                    <p className="text-gray-500 text-sm">Gestão de plantões, férias e substituições.</p>
                </div>
                <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                    <button
                        onClick={() => setActiveTab('SCALE')}
                        className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${activeTab === 'SCALE' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Escala / Plantão
                    </button>
                    <button
                        onClick={() => setActiveTab('VACATION')}
                        className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${activeTab === 'VACATION' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Férias & Bloqueios
                    </button>
                </div>
            </div>

            {activeTab === 'SCALE' && (
                <div className="animate-fadeIn">
                    {/* ALERTS */}
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                        <ShieldExclamationIcon className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-yellow-800 text-sm">Buraco na Escala!</h4>
                            <p className="text-xs text-yellow-700">O plantão de Sábado (21/12) das 19:00 às 07:00 está sem veterinário responsável. <button className="underline font-bold">Resolver agora</button></p>
                        </div>
                    </div>

                    {/* CALENDAR VIEW (MOCKED AS LIST FOR NOW) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">Esta Semana (16/12 - 22/12)</h3>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700">
                                <UserPlusIcon className="h-4 w-4" />
                                Adicionar Turno
                            </button>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {MOCK_SHIFTS.map(shift => (
                                <div key={shift.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs ${shift.type === 'ON_CALL' ? 'bg-purple-100 text-purple-700' :
                                                shift.type === 'REGULAR' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {shift.type === 'ON_CALL' ? 'PL' : 'TN'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">{shift.user}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <CalendarDaysIcon className="h-3 w-3" /> {shift.date}
                                                <span className="text-gray-300">|</span>
                                                <ClockIcon className="h-3 w-3" /> {shift.start} - {shift.end}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {shift.status === 'VACATION_SUB' && (
                                            <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded border border-orange-200">
                                                Substituindo {shift.subFor}
                                            </span>
                                        )}
                                        {shift.type === 'ON_CALL' && (
                                            <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded border border-purple-200">
                                                PLANTÃO
                                            </span>
                                        )}
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <span className="sr-only">Opções</span>
                                            •••
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'VACATION' && (
                <div className="animate-fadeIn bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                    <CalendarDaysIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-800">Gestão de Ausências</h3>
                    <p className="text-gray-500 text-sm mb-6">Cadastre férias e o sistema bloqueará a agenda automaticamente.</p>
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">Registrar Férias / Atestado</button>
                </div>
            )}

        </div>
    );
}
