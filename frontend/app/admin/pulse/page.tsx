"use client";

import React, { useState, useEffect } from 'react';

// Real-time "Airport Style" Dashboard
export default function HospitalPulsePage() {
    const [time, setTime] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString('pt-BR'));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-mono">
            {/* Header */}
            <div className="flex justify-between items-end mb-12 border-b-2 border-gray-700 pb-4">
                <div>
                    <h1 className="text-4xl font-bold text-brand-400 tracking-wider">HOSPITAL PULSE</h1>
                    <p className="text-gray-400 mt-2">VETZ SYSTEM OPERATIONAL CENTER</p>
                </div>
                <div className="text-6xl font-bold text-white tracking-widest">
                    {time}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Column 1: Internment Status */}
                <div className="col-span-1 border border-gray-700 rounded-2xl p-6 bg-gray-800/50">
                    <h2 className="text-xl font-bold text-gray-400 mb-6 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                        INTERNAÇÃO (OCCUPANCY: 60%)
                    </h2>
                    <ul className="space-y-4">
                        {[
                            { box: '01', patient: 'THOR', status: 'ESTÁVEL', color: 'text-green-400' },
                            { box: '02', patient: 'MIA', status: 'CRÍTICO', color: 'text-red-500 animate-pulse' },
                            { box: '03', patient: 'LUNA', status: 'ALTA EM BREVE', color: 'text-yellow-400' },
                            { box: '04', patient: 'BOB', status: 'PÓS-OP', color: 'text-blue-400' },
                            { box: '05', patient: '---', status: 'LIVRE', color: 'text-gray-600' },
                        ].map((item, i) => (
                            <li key={i} className="flex justify-between items-center text-lg border-b border-gray-700/50 pb-2">
                                <span className="text-gray-500 font-bold w-12">BOX {item.box}</span>
                                <span className="font-bold flex-1">{item.patient}</span>
                                <span className={`font-bold ${item.color}`}>{item.status}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 2: Surgery & Consultations */}
                <div className="col-span-1 border border-gray-700 rounded-2xl p-6 bg-gray-800/50">
                    <h2 className="text-xl font-bold text-gray-400 mb-6">CENTRO CIRÚRGICO</h2>
                    <div className="space-y-6">
                        <div className="p-4 bg-red-900/30 border border-red-500/30 rounded-xl">
                            <div className="flex justify-between text-sm text-red-300 mb-2">
                                <span>SALA 1 • DR. RICARDO</span>
                                <span>EM ANDAMENTO (45min)</span>
                            </div>
                            <div className="text-2xl font-bold text-white">OVSH (CADELA 15KG)</div>
                            <div className="w-full bg-gray-700 h-2 mt-4 rounded-full overflow-hidden">
                                <div className="bg-red-500 h-full w-[60%]"></div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-700/30 border border-gray-600 rounded-xl opacity-60">
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                                <span>SALA 2</span>
                                <span>AGUARDANDO LIMPEZA</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-500">DISPONÍVEL</div>
                        </div>
                    </div>
                </div>

                {/* Column 3: Reception & Alerts */}
                <div className="col-span-1 space-y-8">
                    <div className="border border-gray-700 rounded-2xl p-6 bg-gray-800/50">
                        <h2 className="text-xl font-bold text-gray-400 mb-4">RECEPÇÃO (AGORA)</h2>
                        <div className="flex items-center gap-4">
                            <div className="text-5xl font-bold text-white">03</div>
                            <div className="text-sm text-gray-400 leading-tight">
                                PACIENTES<br />AGUARDANDO
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-yellow-500">
                            ⚠️ Tempo máx espera: 20min (Sra. Maria)
                        </div>
                    </div>

                    <div className="border border-gray-700 rounded-2xl p-6 bg-gray-800/50">
                        <h2 className="text-xl font-bold text-gray-400 mb-4">NOTIFICAÇÕES</h2>
                        <ul className="text-sm space-y-2 text-gray-300 font-mono">
                            <li className="flex gap-2">
                                <span className="text-blue-400">[14:32]</span>
                                <span>Novo Agendamento (App Tutor)</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-red-400">[14:15]</span>
                                <span>Estoque Baixo: Dipirona</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-400">[13:55]</span>
                                <span>Nuvem Fiscal: NFe 1024 Emitida</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}
