import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, Plus } from 'lucide-react';

interface CalendarViewProps {
    appointments: any[];
    onNewAppointment: (time?: string) => void;
}

export default function CalendarView({ appointments = [], onNewAppointment }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8); // 8:00 to 18:00

    const changeDate = (days: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + days);
        setCurrentDate(newDate);
    };

    const getAppointmentStyle = (appt: any) => {
        const date = new Date(appt.date);

        // Filter: Check if appointment is on correct day
        if (date.getDate() !== currentDate.getDate() ||
            date.getMonth() !== currentDate.getMonth() ||
            date.getFullYear() !== currentDate.getFullYear()) {
            return { display: 'none', top: '0px', height: '0px', className: '' };
        }

        const hour = date.getHours();
        const minute = date.getMinutes();
        const startOffset = (hour - 8) * 60 + minute;
        const height = 30;
        let colorClass = 'bg-blue-100 border-blue-200 text-blue-700';
        if (appt.type === 'VACCINE') colorClass = 'bg-green-100 border-green-200 text-green-700';
        if (appt.type === 'SURGERY') colorClass = 'bg-red-100 border-red-200 text-red-700';
        return {
            top: `${startOffset * 2}px`,
            height: `${height * 2}px`,
            className: `absolute w-[95%] left-1 rounded-lg border p-2 text-xs shadow-sm hover:shadow-md transition-all cursor-pointer z-10 ${colorClass}`
        };
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-4">
                    {/* ... (existing header) ... */}
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Clock size={20} className="text-teal-600" /> Agenda do Dia
                    </h2>
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                        <button onClick={() => changeDate(-1)} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-teal-600 transition-colors"><ChevronLeft size={16} /></button>
                        <span className="px-3 text-sm font-medium text-gray-700 capitalize min-w-[200px] text-center">{currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        <button onClick={() => changeDate(1)} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-teal-600 transition-colors"><ChevronRight size={16} /></button>
                    </div>
                </div>
                <button
                    onClick={() => onNewAppointment()}
                    className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-1 shadow-sm"
                >
                    <Plus size={16} /> Novo Agendamento
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-y-auto relative">
                {/* Time Labels */}
                <div className="absolute top-0 left-0 w-16 border-r border-gray-100 h-full bg-gray-50 z-20">
                    {timeSlots.map(hour => (
                        <div key={hour} className="h-[120px] border-b border-gray-100 text-xs text-gray-400 font-medium flex justify-center pt-2 relative">
                            {hour}:00
                        </div>
                    ))}
                </div>

                {/* Grid Lines & Clickable Slots */}
                <div className="ml-16 relative min-h-[1320px]">
                    {timeSlots.map(hour => (
                        <div
                            key={hour}
                            onClick={() => onNewAppointment(`${hour}:00`)}
                            className="h-[120px] border-b border-gray-100 relative group cursor-pointer hover:bg-gray-50 transition-colors"
                            title={`Agendar para ${hour}:00`}
                        >
                            <div className="absolute top-1/2 w-full border-t border-dashed border-gray-50 group-hover:border-gray-200"></div>
                            {/* Hover Add Button hint */}
                            <div className="hidden group-hover:flex absolute right-4 top-4 bg-teal-50 text-teal-600 p-1 rounded-md text-xs font-bold items-center gap-1">
                                <Plus size={12} /> Agendar
                            </div>
                        </div>
                    ))}

                    {/* Appointments Overlay */}
                    {appointments.map(appt => {
                        const style = getAppointmentStyle(appt);
                        // Only render if within 8:00 - 19:00 range roughly
                        if (parseInt(style.top) < 0) return null;

                        return (
                            <div key={appt.id} style={{ top: style.top, height: style.height }} className={style.className}>
                                <div className="font-bold truncate">{appt.pet?.name || 'Pet'} <span className="font-normal opacity-75">({appt.pet?.tutor?.fullName || 'Tutor'})</span></div>
                                <div className="truncate opacity-90">{appt.notes || appt.type}</div>
                                <div className="absolute bottom-1 right-2 opacity-50 text-[10px] flex items-center gap-1">
                                    <Clock size={10} /> 30min
                                </div>
                            </div>
                        );
                    })}

                    {/* Current Time Indicator (Mock) */}
                    <div className="absolute top-[300px] w-full border-t-2 border-red-400 z-20 flex items-center">
                        <div className="w-2 h-2 bg-red-400 rounded-full -ml-1"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
