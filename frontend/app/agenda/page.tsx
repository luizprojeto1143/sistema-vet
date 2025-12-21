"use client";
import React, { useState, useEffect } from 'react';
import CalendarView from '@/components/agenda/CalendarView';
import ServiceList from '@/components/agenda/ServiceList';
import NewAppointmentModal from '@/components/agenda/NewAppointmentModal';
import { Plus } from 'lucide-react';

export default function AgendaPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);

    const fetchAppointments = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/appointments?clinicId=clinic-1', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Agenda & Serviços</h1>
                    <p className="text-gray-500">Gerencie seus horários e catálogo de procedimentos</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 shadow-sm flex items-center gap-2"
                >
                    <Plus size={18} /> Novo Agendamento
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Calendar (2/3 width) */}
                <div className="lg:col-span-2">
                    <CalendarView appointments={appointments} />
                </div>

                {/* Right Column: Services & Quick Stats (1/3 width) */}
                <div className="space-y-6">
                    {/* Mini Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-500 font-medium uppercase">Hoje</p>
                            <h3 className="text-2xl font-bold text-gray-800">{appointments.length}</h3>
                            <p className="text-xs text-green-600 font-medium">Agendamentos</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-500 font-medium uppercase">Fila</p>
                            <h3 className="text-2xl font-bold text-gray-800">0</h3>
                            <p className="text-xs text-orange-600 font-medium">Aguardando</p>
                        </div>
                    </div>

                    {/* Service List */}
                    <ServiceList />
                </div>
            </div>

            <NewAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchAppointments}
            />
        </div>
    );
}
