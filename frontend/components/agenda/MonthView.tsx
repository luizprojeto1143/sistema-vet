import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface MonthViewProps {
    appointments: any[];
    onSelectDate: (date: Date) => void;
}

export default function MonthView({ appointments = [], onSelectDate }: MonthViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    const getAppointmentsForDay = (day: number) => {
        return appointments.filter(appt => {
            const d = new Date(appt.date);
            return d.getDate() === day &&
                d.getMonth() === currentDate.getMonth() &&
                d.getFullYear() === currentDate.getFullYear();
        });
    };

    const renderCalendar = () => {
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);
        const slots = [];

        // Empty slots for previous month
        for (let i = 0; i < startDay; i++) {
            slots.push(<div key={`empty-${i}`} className="h-32 bg-gray-50/50 border-b border-r border-gray-100"></div>);
        }

        // Day slots
        for (let day = 1; day <= totalDays; day++) {
            const dayAppts = getAppointmentsForDay(day);
            const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

            slots.push(
                <div
                    key={day}
                    onClick={() => {
                        const selected = new Date(currentDate);
                        selected.setDate(day);
                        onSelectDate(selected);
                    }}
                    className={`h-32 border-b border-r border-gray-100 p-2 cursor-pointer transition-colors hover:bg-teal-50 group relative ${isToday ? 'bg-blue-50/30' : 'bg-white'}`}
                >
                    <span className={`text-sm font-medium ${isToday ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-700'}`}>
                        {day}
                    </span>

                    <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                        {dayAppts.map(appt => (
                            <div key={appt.id} className="text-[10px] bg-sky-100 text-sky-700 px-1 py-0.5 rounded truncate border border-sky-200">
                                {new Date(appt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} {appt.pet?.name}
                            </div>
                        ))}
                        {dayAppts.length > 3 && (
                            <div className="text-[10px] text-gray-400 pl-1">+ {dayAppts.length - 3} mais</div>
                        )}
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 border-2 border-teal-500 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
                </div>
            );
        }

        return slots;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="text-teal-600" size={20} />
                    <h2 className="text-lg font-bold text-gray-800 capitalize">
                        {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </h2>
                </div>
                <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                    <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><ChevronLeft size={16} /></button>
                    <button onClick={() => setCurrentDate(new Date())} className="px-3 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded">Hoje</button>
                    <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><ChevronRight size={16} /></button>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 bg-white border-b border-gray-100">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                    <div key={d} className="py-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {d}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 bg-gray-100 border-l border-t border-gray-100">
                {renderCalendar()}
            </div>
        </div>
    );
}
