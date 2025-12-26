"use client";

import React, { useState } from 'react';
import PatientHeader from '@/components/vet/PatientHeader';
import ActionButtons from '@/components/vet/ActionButtons';
import InternmentMap from '@/components/vet/InternmentMap';
import Timeline from '@/components/vet/Timeline';

// Mock Data for Demonstration

export default function VetPage() {
    const [selectedPet, setSelectedPet] = useState<any>(null);
    const [tutor, setTutor] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);


    const handleAction = (action: string) => {
        console.log('Action triggered:', action);
        alert(`Ação: ${action} (Funcionalidade em desenvolvimento)`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Atendimento Veterinário</h1>
                    <p className="text-gray-500">Gerencie seus pacientes e internações</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 shadow-sm">
                        📅 Minha Agenda
                    </button>
                    <button className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 shadow-sm flex items-center gap-2">
                        + Novo Atendimento
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Active Patient */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Patient Header */}
                    {selectedPet ? (
                        <PatientHeader pet={selectedPet} tutor={tutor || {}} />
                    ) : (
                        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 text-center">
                            <h3 className="text-gray-500">Nenhum paciente selecionado.</h3>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <ActionButtons onAction={handleAction} />

                    {/* Internment Map (Visual) */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            🏥 Mapa de Internação
                        </h2>
                        <InternmentMap wards={wards} />
                    </div>
                </div>

                {/* Right Column: History & Queue */}
                <div className="space-y-6">
                    {/* Timeline */}
                    <Timeline events={history} />

                    {/* Queue (Mini) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-800 mb-4">Fila de Espera</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">B</div>
                                <div>
                                    <p className="font-bold text-sm">Bob (Golden)</p>
                                    <p className="text-xs text-gray-500">Aguardando há 15min</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">L</div>
                                <div>
                                    <p className="font-bold text-sm">Lola (Poodle)</p>
                                    <p className="text-xs text-gray-500">Chegou agora</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
