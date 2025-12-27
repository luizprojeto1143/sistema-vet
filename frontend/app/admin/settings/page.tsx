"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    BuildingOfficeIcon,
    VideoCameraIcon,
    TruckIcon,
    ShoppingBagIcon,
    CpuChipIcon,
    CheckCircleIcon,
    DocumentTextIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

const MODULES = [
    { id: 'hasPetshop', label: 'Petshop & Varejo', icon: ShoppingBagIcon, desc: 'Venda de produtos, banho e tosa.' },
    { id: 'hasInternment', label: 'Internação (Hospital)', icon: BuildingOfficeIcon, desc: 'Gestão de leitos e pacientes internados.' },
    { id: 'hasHomeCare', label: 'Atendimento Domiciliar', icon: TruckIcon, desc: 'Agendamento e roteirização externa.' },
    { id: 'hasTelemedicine', label: 'Telemedicina', icon: VideoCameraIcon, desc: 'Videochamadas e Teleorientação.' },
    { id: 'hasAnalisaVet', label: 'AnalisaVet AI', icon: CpuChipIcon, desc: 'Inteligência Artificial para laudos.' },
];

export default function ClinicSettingsPage() {
    const router = useRouter();
    // Mock initial state (would come from DB)
    const [flags, setFlags] = useState<any>({
        hasPetshop: true,
        hasInternment: true,
        hasHomeCare: false,
        hasTelemedicine: false, // Default OFF as requested
        hasAnalisaVet: true,
    });

    const toggleFlag = (key: string) => {
        setFlags((prev: any) => ({ ...prev, [key]: !prev[key] }));
        // API call to update clinic settings would go here
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Configuração da Clínica</h1>
                <p className="text-gray-500">Gerencie módulos e personalize sua identidade.</p>
            </div>

            {/* NEW: Customization Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                            <DocumentTextIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Identidade & Documentos</h3>
                            <p className="text-sm text-gray-500">Configure logotipos, cabeçalhos e modelos de receitas/atestados.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/admin/settings/documents')}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                        Personalizar
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 bg-indigo-50 border-b border-indigo-100 flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                        <CpuChipIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-indigo-900">Módulos do Sistema</h3>
                        <p className="text-xs text-indigo-700">O que você não usa, o sistema esconde.</p>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {MODULES.map(module => (
                        <div key={module.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${flags[module.id] ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <module.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className={`font-bold ${flags[module.id] ? 'text-gray-900' : 'text-gray-400'}`}>{module.label}</h4>
                                    <p className="text-xs text-gray-500">{module.desc}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => toggleFlag(module.id)}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${flags[module.id] ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${flags[module.id] ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-emerald-600 flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5" />
                    Salvar Configurações
                </button>
            </div>

        </div>
    );
}
