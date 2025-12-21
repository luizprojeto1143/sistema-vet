import React from 'react';
import { Stethoscope, Syringe, Microscope, Scissors, Building2, Calendar, User } from 'lucide-react';

interface TimelineEvent {
    id: string;
    date: string;
    type: 'CONSULTATION' | 'VACCINE' | 'EXAM' | 'SURGERY' | 'INTERNMENT';
    title: string;
    description: string;
    doctorName?: string;
}

interface TimelineProps {
    events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'CONSULTATION': return <Stethoscope size={16} />;
            case 'VACCINE': return <Syringe size={16} />;
            case 'EXAM': return <Microscope size={16} />;
            case 'SURGERY': return <Scissors size={16} />;
            case 'INTERNMENT': return <Building2 size={16} />;
            default: return <Calendar size={16} />;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'CONSULTATION': return 'bg-blue-100 text-blue-600';
            case 'VACCINE': return 'bg-green-100 text-green-600';
            case 'EXAM': return 'bg-purple-100 text-purple-600';
            case 'SURGERY': return 'bg-red-100 text-red-600';
            case 'INTERNMENT': return 'bg-orange-100 text-orange-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Histórico Clínico</h3>

            <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                {events.map((event) => (
                    <div key={event.id} className="relative">
                        {/* Dot */}
                        <div className={`absolute -left-[21px] top-0 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-sm ${getColor(event.type)}`}>
                            {getIcon(event.type)}
                        </div>

                        {/* Content */}
                        <div className="pl-4">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-gray-800">{event.title}</h4>
                                <span className="text-xs text-gray-400 font-medium">{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                            {event.doctorName && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                    <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                        <User size={12} />
                                    </div>
                                    <span>Dr. {event.doctorName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
