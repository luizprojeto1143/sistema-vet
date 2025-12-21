"use client";

import React, { useState } from 'react';
import PatientHeader from '@/components/vet/PatientHeader';
import ActionButtons from '@/components/vet/ActionButtons';
import InternmentMap from '@/components/vet/InternmentMap';
import Timeline from '@/components/vet/Timeline';

// Mock Data for Demonstration
const MOCK_PET = {
    id: '12345',
    name: 'Pandora',
    species: 'DOG',
    breed: 'Border Collie',
    gender: 'FEMALE',
    age: '3 anos',
    weight: 16.5,
    isCastrated: true,
    photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200',
    allergies: 'Dipirona',
    chronicConditions: null
};

const MOCK_TUTOR = {
    fullName: 'Vania Leão Paulino',
    phone: '(31) 99999-9999'
};

const [wards, setWards] = useState<any[]>([]);

useEffect(() => {
    const fetchWards = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/internment/wards', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setWards(data);
            }
        } catch (error) {
            console.error("Failed to fetch wards:", error);
        }
    };

    fetchWards();
}, []);

const MOCK_HISTORY = [
    { id: '1', date: '2025-12-19', type: 'CONSULTATION', title: 'Consulta de Rotina', description: 'Paciente apresentou leve claudicação.', doctorName: 'Jéssica Goulart' },
    { id: '2', date: '2025-11-15', type: 'VACCINE', title: 'Vacina V10', description: 'Reforço anual aplicado.', doctorName: 'Roberto Silva' },
    { id: '3', date: '2025-06-10', type: 'SURGERY', title: 'Castração', description: 'Procedimento realizado sem intercorrências.', doctorName: 'Jéssica Goulart' },
];

export default function VetPage() {
    const [selectedPet, setSelectedPet] = useState(MOCK_PET);

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
                    <PatientHeader pet={selectedPet} tutor={MOCK_TUTOR} />

                    {/* Quick Actions */}
                    <ActionButtons onAction={handleAction} />

                    {/* Internment Map (Visual) */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            🏥 Mapa de Internação
                        </h2>
                        <InternmentMap wards={MOCK_WARDS} />
                    </div>
                </div>

                {/* Right Column: History & Queue */}
                <div className="space-y-6">
                    {/* Timeline */}
                    <Timeline events={MOCK_HISTORY as any[]} />

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
