"use client";

import React from 'react';
import {
    CalendarIcon,
    ExclamationCircleIcon,
    HeartIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

const MOCK_TIMELINE = [
    { id: 1, type: 'URGENT', title: 'Vacina Atrasada', desc: 'V10 do Thor venceu há 3 dias.', date: 'Hoje' },
    { id: 2, type: 'APPOINTMENT', title: 'Retorno Agendado', desc: 'Dra. Ana (Clínica Geral) para Luna.', date: 'Amanhã, 14:00' },
    { id: 3, type: 'INTERNMENT', title: 'Boletim Médico Disponível', desc: 'Mel (Internação) - Manhã', date: 'Hoje, 09:30' },
    { id: 4, type: 'FINANCIAL', title: 'Fatura em Aberto', desc: 'Ref. Atendimento #3910', date: 'Vence em 2 dias' },
];

export default function TutorHomePage() {
    return (
        <div className="min-h-screen bg-brand-50 pb-20 font-sans">

            {/* HEADER */}
            <div className="bg-brand-500 p-8 text-white rounded-b-[3rem] shadow-2xl shadow-brand-500/30 relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Olá, Luiza! 👋</h1>
                        <p className="text-brand-100 font-bold text-sm opacity-90">Vamos cuidar dos bichinhos?</p>
                    </div>
                    <div className="h-12 w-12 bg-white text-brand-500 rounded-full flex items-center justify-center font-extrabold text-xl shadow-lg border-4 border-brand-400">L</div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="flex justify-between gap-4 overflow-x-auto pb-2 no-scrollbar">
                    <button className="flex flex-col items-center gap-2 min-w-[70px] group">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30 shadow-inner group-active:scale-95 transition-transform"><CalendarIcon className="h-6 w-6 text-white" /></div>
                        <span className="text-[10px] font-bold tracking-wide opacity-90">Agendar</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 min-w-[70px] group">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30 shadow-inner group-active:scale-95 transition-transform"><HeartIcon className="h-6 w-6 text-white" /></div>
                        <span className="text-[10px] font-bold tracking-wide opacity-90">Pets</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 min-w-[70px] group">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30 shadow-inner group-active:scale-95 transition-transform"><DocumentTextIcon className="h-6 w-6 text-white" /></div>
                        <span className="text-[10px] font-bold tracking-wide opacity-90">Receitas</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 min-w-[70px] group">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30 shadow-inner group-active:scale-95 transition-transform"><CurrencyDollarIcon className="h-6 w-6 text-white" /></div>
                        <span className="text-[10px] font-bold tracking-wide opacity-90">Finan.</span>
                    </button>
                </div>
            </div>

            {/* FEED / TIMELINE */}
            <div className="p-6 space-y-5 -mt-6 relative z-0">
                <h2 className="text-gray-800 font-extrabold text-lg mb-2 pl-2 flex items-center gap-2">
                    <span>🔔</span> Acontece Agora
                </h2>

                {MOCK_TIMELINE.map(item => (
                    <div key={item.id} className="bg-white p-5 rounded-[2rem] shadow-lg shadow-brand-100/50 border border-white flex items-start gap-4 active:scale-95 transition-transform">
                        <div className={`p-4 rounded-2xl flex-shrink-0 shadow-sm ${item.type === 'URGENT' ? 'bg-red-50 text-red-500' :
                            item.type === 'INTERNMENT' ? 'bg-purple-50 text-purple-500' :
                                item.type === 'FINANCIAL' ? 'bg-amber-50 text-amber-500' :
                                    'bg-brand-50 text-brand-500'
                            }`}>
                            {item.type === 'URGENT' && <ExclamationCircleIcon className="h-6 w-6" />}
                            {item.type === 'APPOINTMENT' && <CalendarIcon className="h-6 w-6" />}
                            {item.type === 'INTERNMENT' && <HeartIcon className="h-6 w-6" />}
                            {item.type === 'FINANCIAL' && <CurrencyDollarIcon className="h-6 w-6" />}
                        </div>
                        <div className="flex-1 py-1">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-gray-800 text-base">{item.title}</h3>
                                <span className="text-[10px] font-extrabold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{item.date}</span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
