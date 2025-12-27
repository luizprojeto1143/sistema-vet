"use client"; // Force rebuild
import React, { useState, useEffect } from 'react';
import CalendarView from '@/components/agenda/CalendarView';
import ServiceList from '@/components/agenda/ServiceList';
import NewAppointmentModal from '@/components/agenda/NewAppointmentModal';
import KanbanView from '@/components/agenda/KanbanView';
import MonthView from '@/components/agenda/MonthView';
import { Plus, LayoutGrid, Kanban, Calendar as CalendarIcon } from 'lucide-react';

export default function AgendaPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
    const [appointments, setAppointments] = useState([]);

    // View State: 'day' (Default/CalendarView), 'month' (MonthView), 'kanban' (KanbanView)
    const [viewMode, setViewMode] = useState<'day' | 'month' | 'kanban'>('day');

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

    const handleNewAppointment = (time?: string) => {
        setSelectedTime(time);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            {/* Top Bar with View Switcher */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Agenda & Serviços</h1>
                    <p className="text-sm text-gray-500">Gerencie seus horários e acompanhe o fluxo</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                    <button
                        onClick={() => setViewMode('day')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'day' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <CalendarIcon size={16} /> Diário
                    </button>
                    <button
                        onClick={() => setViewMode('month')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'month' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <LayoutGrid size={16} /> Mensal
                    </button>
                    <button
                        onClick={() => setViewMode('kanban')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'kanban' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Kanban size={16} /> Painel (Kanban)
                    </button>
                </div>

                <button
                    onClick={() => handleNewAppointment()}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 shadow-sm flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                >
                    <Plus size={18} /> Novo Agendamento
                </button>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* View Container (Takes 3/4 width usually, full width if Kanban/Month maybe?) */}
                <div className={`${viewMode === 'day' ? 'lg:col-span-3' : 'lg:col-span-4'}`}>

                    {viewMode === 'day' && (
                        <CalendarView appointments={appointments} onNewAppointment={handleNewAppointment} />
                    )}

                    {viewMode === 'month' && (
                        <div className="animate-in fade-in zoom-in duration-300">
                            <MonthView
                                appointments={appointments}
                                onSelectDate={(date) => {
                                    // Switch to day view for selected date (Need to implement date passing to CalendarView if fully robust, 
                                    // for now just switching view to demonstrate interactivity)
                                    setViewMode('day');
                                }}
                            />
                        </div>
                    )}

                    {viewMode === 'kanban' && (
                        <div className="animate-in slide-in-from-right duration-300">
                            <KanbanView
                                appointments={appointments}
                                onEditAppointment={(appt) => {
                                    // Ideally open edit modal, for now just log or re-open create with data
                                    console.log("Edit", appt);
                                    handleNewAppointment();
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Sidebar (Services & Stats) - Only show in Day View to save space in others, or keep it? 
                    Reference shows Kanban takes full width. Let's hide it for Kanban/Month for cleaner UI. 
                */}
                {viewMode === 'day' && (
                    <div className="space-y-6 lg:col-span-1 animate-in slide-in-from-right">
                        {/* Mini Stats */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-[10px] text-gray-500 font-bold uppercase">Hoje</p>
                                <h3 className="text-xl font-bold text-gray-800">{appointments.length}</h3>
                                <p className="text-[10px] text-green-600 font-medium">Agendamentos</p>
                            </div>
                            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-[10px] text-gray-500 font-bold uppercase">Fila</p>
                                <h3 className="text-xl font-bold text-gray-800">0</h3>
                                <p className="text-[10px] text-orange-600 font-medium">Aguardando</p>
                            </div>
                        </div>

                        {/* Service List */}
                        <div className="h-[500px]">
                            <ServiceList />
                        </div>
                    </div>
                )}
            </div>

            <NewAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchAppointments}
                initialTime={selectedTime}
            />
        </div>
    );
}
