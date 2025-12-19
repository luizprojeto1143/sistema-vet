"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    CalendarDaysIcon,
    PlusIcon,
    FunnelIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

import { NewAppointmentModal } from './new-appointment';

// Helper to format Date to "HH:mm"
const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export default function SmartAgendaPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
    const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Fetch Real Data
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : {};

                // If backend supports filtering by clinic, it usually gets it from token or query
                const res = await fetch(`http://localhost:4000/appointments?clinicId=${user.clinicId || ''}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setAppointments(data);
                }
            } catch (err) {
                console.error("Failed to fetch appointments", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [refreshTrigger]);

    "use client";

    import React, { useEffect, useState } from 'react';
    import { useRouter } from 'next/navigation';
    import {
        CalendarDaysIcon,
        PlusIcon,
        FunnelIcon,
        ArrowPathIcon
    } from '@heroicons/react/24/outline';

    import { NewAppointmentModal } from './new-appointment';

    // Helper to format Date to "HH:mm"
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    export default function SmartAgendaPage() {
        const router = useRouter();
        const [appointments, setAppointments] = useState<any[]>([]);
        const [loading, setLoading] = useState(true);
        const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
        const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
        const [refreshTrigger, setRefreshTrigger] = useState(0);

        // Fetch Real Data
        useEffect(() => {
            const fetchAppointments = async () => {
                try {
                    setLoading(true);
                    const token = localStorage.getItem('token');
                    const userStr = localStorage.getItem('user');
                    const user = userStr ? JSON.parse(userStr) : {};

                    // If backend supports filtering by clinic, it usually gets it from token or query
                    const res = await fetch(`http://localhost:4000/appointments?clinicId=${user.clinicId || ''}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        setAppointments(data);
                    }
                } catch (err) {
                    console.error("Failed to fetch appointments", err);
                } finally {
                    setLoading(false);
                }
            };

            fetchAppointments();
        }, [refreshTrigger]);

        const handleAppointmentCreated = () => {
            setIsNewAppointmentOpen(false);
            setRefreshTrigger(prev => prev + 1); // Refresh list
        };

        return (
            <div className="p-6 h-screen flex flex-col bg-brand-50 font-sans">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3 tracking-tight">
                            <div className="bg-white p-2 rounded-2xl shadow-sm">
                                <CalendarDaysIcon className="h-8 w-8 text-brand-500" />
                            </div>
                            Agenda Fofinha
                        </h1>
                        <p className="text-brand-600 font-bold ml-14 mt-1 capitalize opacity-80">
                            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} 📅
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setRefreshTrigger(prev => prev + 1)}
                            className="p-3 bg-white text-brand-300 hover:text-brand-500 rounded-2xl shadow-sm hover:shadow-md transition-all"
                            title="Atualizar"
                        >
                            <ArrowPathIcon className={`h-6 w-6 ${loading ? 'animate-spin' : ''}`} />
                        </button>

                        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-brand-100">
                            <button
                                onClick={() => setViewMode('day')}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'day' ? 'bg-brand-100 text-brand-700 shadow-sm' : 'text-gray-400 hover:text-brand-400'}`}
                            >
                                Dia
                            </button>
                            <button
                                onClick={() => setViewMode('week')}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'week' ? 'bg-brand-100 text-brand-700 shadow-sm' : 'text-gray-400 hover:text-brand-400'}`}
                            >
                                Semana
                            </button>
                        </div>

                        <button className="flex items-center gap-2 px-5 py-2 bg-white border border-brand-100 text-gray-600 font-bold rounded-2xl hover:bg-brand-50 hover:text-brand-600 transition-colors shadow-sm">
                            <FunnelIcon className="h-5 w-5" />
                            Filtros
                        </button>

                        <button
                            onClick={() => setIsNewAppointmentOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-full hover:bg-brand-600 shadow-lg shadow-brand-500/30 transform hover:-translate-y-1 transition-all font-bold"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Novo Agendamento
                        </button>
                    </div>
                </div>

                {/* AGENDA GRID */}
                <div className="flex-1 overflow-y-auto bg-white rounded-[2.5rem] shadow-xl border border-brand-100 p-6 relative custom-scrollbar">
                    {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(hour => (
                        <div key={hour} className="flex border-b border-brand-50 min-h-[120px] group hover:bg-brand-50/30 transition-colors last:border-0">

                            {/* Time Label */}
                            <div className="w-24 text-brand-400 font-bold text-lg py-6 text-center border-r border-brand-50">
                                {hour}
                            </div>

                            {/* Appointments in this hour */}
                            <div className="flex-1 p-4 flex flex-wrap gap-4 items-center">
                                {appointments.filter(apt => {
                                    const aptTime = formatTime(apt.dateTime || apt.date);
                                    return aptTime.startsWith(hour.split(':')[0]);
                                }).map(apt => (
                                    <AppointmentCard key={apt.id} data={apt} router={router} />
                                ))}

                                {/* Empty State / Add Button on Hover */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setIsNewAppointmentOpen(true)}
                                        className="h-10 w-10 rounded-full bg-brand-100 text-brand-500 flex items-center justify-center hover:bg-brand-200 hover:scale-110 transition-all"
                                    >
                                        <PlusIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* MODAL */}
                {isNewAppointmentOpen && (
                    <NewAppointmentModal
                        onClose={() => setIsNewAppointmentOpen(false)}
                        onSuccess={handleAppointmentCreated}
                    />
                )}

            </div>
        );
    }

    // Sub-component for individual card
    function AppointmentCard({ data, router }: { data: any, router: any }) {
        // Pastel Palette for Status
        const statusConfig: any = {
            SCHEDULED: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', icon: '📅' },
            CONFIRMED: { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-600', icon: '✅' },
            IN_PROGRESS: { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600', icon: '🩺' },
            COMPLETED: { bg: 'bg-gray-50', border: 'border-gray-100', text: 'text-gray-500', icon: '🏁' },
            MISSED: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-500', icon: '❌' },
        };

        const config = statusConfig[data.status] || statusConfig.SCHEDULED;

        return (
            <div className={`p-4 rounded-3xl border-2 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all w-72 ${config.bg} ${config.border} group cursor-pointer`}>
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                            {data.pet?.species === 'CAT' ? '🐱' : '🐶'}
                        </div>
                        <div>
                            <span className="font-extrabold text-gray-800 block text-sm">
                                {data.pet?.name || 'Pet'}
                            </span>
                            <span className="text-xs font-bold text-gray-400">
                                {data.pet?.tutor?.name || 'Tutor'}
                            </span>
                        </div>
                    </div>
                    <span className="text-lg">{config.icon}</span>
                </div>

                <div className={`text-xs font-bold mb-4 px-3 py-1 rounded-full inline-block bg-white/60 ${config.text}`}>
                    {data.service?.name || data.type || 'Consulta'}
                </div>

                <div className="flex justify-between items-center mt-2">
                    <button
                        onClick={() => router.push(`/vet/appointments/consultation/${data.id}`)}
                        className="px-4 py-2 bg-white text-gray-700 rounded-xl text-xs font-extrabold hover:bg-brand-500 hover:text-white transition-colors shadow-sm"
                    >
                        Atender
                    </button>
                    <span className="text-xs font-bold text-gray-400">
                        {formatTime(data.dateTime)}
                    </span>
                </div>
            </div>
        );
    }
