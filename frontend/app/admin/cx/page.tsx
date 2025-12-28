"use client";

import CXSimulator from '@/components/cx/whatsapp-simulator';
import { ChatBubbleLeftRightIcon, UserGroupIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function CXPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <HeartIcon className="w-8 h-8 text-rose-500" />
                    Customer Experience (CX)
                </h1>
                <p className="text-gray-500 mt-2">Gestão da Jornada do Cliente e Satisfação (NPS).</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Simulator Card */}
                <div>
                    <CXSimulator />
                </div>

                {/* KPI Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <UserGroupIcon className="w-5 h-5 text-indigo-500" />
                        Indicadores de Felicidade
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-rose-50 p-4 rounded-xl text-center">
                            <p className="text-xs text-rose-400 font-bold uppercase">NPS (Net Promoter Score)</p>
                            <p className="text-3xl font-black text-rose-600 mt-1">78</p>
                            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-rose-400 mt-2 inline-block">Zona de Excelência</span>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl text-center">
                            <p className="text-xs text-blue-400 font-bold uppercase">Taxa de Retorno</p>
                            <p className="text-3xl font-black text-blue-600 mt-1">64%</p>
                            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-blue-400 mt-2 inline-block">Média de Mercado</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-sm font-bold text-gray-700 mb-3">Últimos Feedbacks</h4>
                        <div className="space-y-3">
                            <div className="text-sm p-3 bg-gray-50 rounded-lg">
                                <p className="italic text-gray-600">"O atendimento da Dra. Ana foi incrível, mas esperei 40min na recepção."</p>
                                <div className="flex justify-between mt-2">
                                    <span className="text-xs font-bold text-yellow-600">Nota: 8</span>
                                    <span className="text-xs text-gray-400">Há 2 horas</span>
                                </div>
                            </div>
                            <div className="text-sm p-3 bg-gray-50 rounded-lg">
                                <p className="italic text-gray-600">"Meu cachorro saiu do banho muito cheiroso! Adorei a gravata."</p>
                                <div className="flex justify-between mt-2">
                                    <span className="text-xs font-bold text-green-600">Nota: 10</span>
                                    <span className="text-xs text-gray-400">Há 5 horas</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
