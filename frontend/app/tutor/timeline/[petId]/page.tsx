"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircleIcon, ClockIcon, MapPinIcon, HomeIcon } from '@heroicons/react/24/solid';

// Components
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function TutorTimelinePage() {
    const params = useParams();
    const [timeline, setTimeline] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [petName, setPetName] = useState('Seu Pet');

    useEffect(() => {
        const fetchTimeline = async () => {
            if (!params?.petId) return;
            try {
                // For MVP using a fixed token or public endpoint if valid
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timeline/pet/${params.petId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setTimeline(data);
                    // In real app, fetch pet details to set name
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchTimeline();
    }, [params?.petId]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/tutor/home" className="text-gray-500 hover:text-gray-800">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <h1 className="font-bold text-lg text-gray-800">Jornada de {petName}</h1>
                    <div className="w-6"></div>
                </div>
            </div>

            {/* Timeline Content */}
            <div className="max-w-md mx-auto p-4 mt-4">
                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>)}
                    </div>
                ) : (
                    <div className="space-y-8 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-200"></div>

                        {timeline.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                Nenhuma atividade recente.
                            </div>
                        ) : (
                            timeline.map((event, idx) => (
                                <div key={idx} className="relative pl-14 group">
                                    {/* Dot */}
                                    <div className={`absolute left-4 top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm z-10 
                                        ${event.status === 'COMPLETED' ? 'bg-green-500' :
                                            event.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                    </div>

                                    {/* Card */}
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative group-hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-gray-800">{event.title}</h3>
                                            <span className="text-xs text-gray-400">
                                                {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                                            {event.description}
                                        </p>

                                        {/* Status Badge */}
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                                            ${event.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                                                event.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {event.type === 'APPOINTMENT' ? 'Atendimento' : 'Internação'}
                                        </span>
                                    </div>

                                    {/* Date Divider (If day changes) */}
                                    {/* Logic to show date header could go here */}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Floating Action / Promo */}
            <div className="fixed bottom-6 left-4 right-4 max-w-md mx-auto">
                <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-indigo-200 uppercase">Status Atual</p>
                        <p className="font-bold">
                            {timeline[0]?.status === 'IN_PROGRESS' ? 'Em Atendimento' : 'Estável / Em Casa'}
                        </p>
                    </div>
                    <div className="bg-white/10 p-2 rounded-lg">
                        <ClockIcon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
