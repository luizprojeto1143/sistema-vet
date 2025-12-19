"use client";
import React, { useState } from 'react';
import {
    XMarkIcon,
    CheckCircleIcon,
    UserIcon,
    ClockIcon,
    SparklesIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const SERVICES_MOCK = [
    { id: '1', name: 'Consulta Geral', duration: 30, price: 150 },
    { id: '2', name: 'Vacina V10', duration: 15, price: 80, canOverlap: true },
    { id: '3', name: 'Cirurgia Castração', duration: 120, price: 450 },
];

export function NewAppointmentModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [selectedTutor, setSelectedTutor] = useState<any>(null); // { name, petId, ... }
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Mock Data (In production, fetch from /services and /pets)
    const SERVICES = [
        { id: 'srv-1', name: 'Consulta Geral', duration: 30, price: 150 },
        { id: 'srv-2', name: 'Vacina V10', duration: 15, price: 80 },
        { id: 'srv-3', name: 'Cirurgia', duration: 120, price: 450 },
    ];

    const confirmAppointment = async () => {
        if (!selectedTime || !selectedService) return;
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const today = new Date();
            const [hours, mins] = selectedTime.split(':').map(Number);
            today.setHours(hours, mins, 0, 0);

            const payload = {
                dateTime: today.toISOString(),
                type: 'CONSULTATION',
                serviceId: selectedService.id, // Ensure this ID exists in DB or handle error
                petId: selectedTutor?.petId || 'pet-uuid-placeholder', // Needs real ID
                vetId: 'vet-uuid-placeholder', // Needs real ID or from Auth
                status: 'SCHEDULED',
                notes: `Agendado via Wizard: ${selectedService.name}`
            };

            // Since we might not have real relations in DB for these placeholders, 
            // the backend might throw Foreign Key Error. 
            // For this "UI First" approach, we will try to submit.

            const res = await fetch('http://localhost:4000/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSuccess();
            } else {
                alert('Erro ao agendar. Verifique se os dados (IDs) existem no banco.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    // ... Render Steps ... 
    // Simplified for brevity in replace, effectively keeping original render logic but adding the confirm call

    // STEP 1: SERVICE
    const renderStep1 = () => (
        <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Passo 1: Qual o objetivo?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SERVICES.map(srv => (
                    <button
                        key={srv.id}
                        onClick={() => { setSelectedService(srv); setStep(2); }}
                        className="p-4 border rounded-xl hover:bg-indigo-50 hover:border-indigo-300 text-left transition-all"
                    >
                        <div className="font-bold text-gray-800">{srv.name}</div>
                        <div className="text-sm text-gray-500 flex justify-between mt-1">
                            <span>{srv.duration} min</span>
                            <span className="font-medium text-green-600">R$ {srv.price}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    // STEP 2: TUTOR
    const renderStep2 = () => (
        <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Passo 2: Quem será atendido?</h3>
            <input type="text" placeholder="Buscar Tutor..." className="w-full p-3 border rounded-lg" />
            <div className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-indigo-50"
                onClick={() => {
                    // Using a placeholder ID that SHOULD exist if seeded, or fails safely
                    setSelectedTutor({ name: 'Thor', petId: 'pet-1' });
                    setStep(3);
                }}
            >
                <div className="font-bold">Thor (Golden Retriever)</div>
                <div className="text-xs text-gray-500">Tutor: Maria Silva</div>
            </div>
            <button onClick={() => setStep(1)} className="text-sm text-gray-500 mt-2">Voltar</button>
        </div>
    );

    // STEP 3: TIME
    const renderStep3 = () => (
        <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Passo 3: Horário</h3>
            <div className="grid grid-cols-4 gap-2">
                {['09:00', '10:00', '11:00', '14:00', '15:00'].map(time => (
                    <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 border rounded-lg ${selectedTime === time ? 'bg-indigo-600 text-white' : 'bg-white'}`}
                    >
                        {time}
                    </button>
                ))}
            </div>
            {selectedTime && (
                <button
                    onClick={confirmAppointment}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold mt-4"
                >
                    {loading ? 'Agendando...' : 'Confirmar Agendamento'}
                </button>
            )}
            <button onClick={() => setStep(2)} className="text-sm text-gray-500 mt-2 hover:underline w-full">Voltar</button>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 flex justify-between items-center bg-gray-50 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800">Novo Agendamento</h2>
                    <button onClick={onClose}><XMarkIcon className="h-6 w-6 text-gray-400" /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                </div>
                {/* Dots */}
                <div className="p-4 bg-gray-50 flex justify-center gap-2">
                    {[1, 2, 3].map(i => <div key={i} className={`h-2 w-2 rounded-full ${step >= i ? 'bg-indigo-600' : 'bg-gray-300'}`} />)}
                </div>
            </div>
        </div>
    );
}
