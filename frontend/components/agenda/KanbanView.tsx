import React from 'react';
import { Clock, User, Calendar, MoreVertical } from 'lucide-react';

interface KanbanViewProps {
    appointments: any[];
    onEditAppointment: (appt: any) => void;
}

const STATUS_COLUMNS = [
    {
        id: 'OPEN',
        label: 'ABERTO',
        statuses: ['SCHEDULED', 'CONFIRMED', 'WAITING'],
        color: 'border-l-4 border-blue-400'
    },
    {
        id: 'IN_PROGRESS',
        label: 'EM ANDAMENTO',
        statuses: ['IN_SERVICE', 'EXAMS'], // Assuming these statuses exist/will exist
        color: 'border-l-4 border-yellow-400'
    },
    {
        id: 'FINISHED',
        label: 'FINALIZADO',
        statuses: ['COMPLETED', 'FINISHED'], // Assuming these statuses exist/will exist
        color: 'border-l-4 border-green-400'
    }
];

export default function KanbanView({ appointments = [], onEditAppointment }: KanbanViewProps) {

    const getColumnAppointments = (columnStatuses: string[]) => {
        return appointments.filter(appt =>
            columnStatuses.includes(appt.status || 'SCHEDULED') // Default to SCHEDULED if no status
        );
    };

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 h-[600px]">
            {STATUS_COLUMNS.map(col => {
                const columnAppts = getColumnAppointments(col.statuses);

                return (
                    <div key={col.id} className="min-w-[350px] flex-1 bg-gray-50 rounded-xl border border-gray-200 flex flex-col">
                        {/* Column Header */}
                        <div className="p-4 border-b border-gray-100 bg-white rounded-t-xl flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-700">{col.label} ({columnAppts.length})</h3>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mt-1">
                                    {col.statuses.join(', ').toLowerCase().replace(/_/g, ' ')}
                                </p>
                            </div>
                        </div>

                        {/* Cards List */}
                        <div className="p-4 space-y-3 overflow-y-auto flex-1">
                            {columnAppts.map(appt => (
                                <div
                                    key={appt.id}
                                    onClick={() => onEditAppointment(appt)}
                                    className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 ${col.color} group`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-teal-600 uppercase bg-teal-50 px-2 py-0.5 rounded-md">
                                            {appt.type === 'CONSULTATION' ? 'Consulta' : appt.type}
                                        </span>
                                        <button className="text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>

                                    <h4 className="font-bold text-gray-800 text-sm mb-1">
                                        {appt.pet?.name || 'Pet Desconhecido'}
                                        <span className="font-normal text-gray-500"> - {appt.pet?.tutor?.fullName || 'Tutor Desconhecido'}</span>
                                    </h4>

                                    <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {new Date(appt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(appt.date).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>

                                    <div className="mt-2 text-xs text-slate-400">
                                        Status: <span className="font-medium text-slate-600">{appt.status || 'Agendado'}</span>
                                    </div>
                                </div>
                            ))}

                            {columnAppts.length === 0 && (
                                <div className="text-center py-8 text-gray-300 text-sm italic">
                                    Nenhum agendamento
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
