import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AppointmentCard = ({ appointment }) => {
    const typeColors = {
        'consulta': 'bg-blue-100 text-blue-700 border-blue-200',
        'vacina': 'bg-green-100 text-green-700 border-green-200',
        'cirurgia': 'bg-red-100 text-red-700 border-red-200',
        'retorno': 'bg-purple-100 text-purple-700 border-purple-200',
    };

    return (
        <div className={`p-2 rounded-md text-xs border mb-1 cursor-pointer transition-transform hover:scale-[1.02] ${typeColors[appointment.type] || 'bg-gray-100'}`}>
            <span className="font-bold block">{appointment.time}</span>
            <span className="font-medium truncate block">{appointment.petName}</span>
            <span className="opacity-80 truncate block">{appointment.tutorName}</span>
        </div>
    );
};

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('week'); // week | day

    // Mock appointments
    const appointments = [
        { id: 1, date: new Date(), time: '09:00', petName: 'Thor', tutorName: 'Carlos', type: 'consulta' },
        { id: 2, date: new Date(), time: '10:30', petName: 'Mia', tutorName: 'Ana', type: 'vacina' },
        { id: 3, date: new Date(), time: '14:00', petName: 'Rex', tutorName: 'João', type: 'analisavet' },
        { id: 4, date: addDays(new Date(), 1), time: '09:00', petName: 'Luna', tutorName: 'Mariana', type: 'cirurgia' },
    ];

    const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
    const hours = Array.from({ length: 11 }).map((_, i) => 8 + i); // 08:00 as 18:00

    const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
    const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));

    return (
        <div className="bg-card rounded-lg border border-border shadow-sm flex flex-col h-[600px]">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    </h2>
                    <div className="flex items-center gap-1 bg-muted rounded-md p-1">
                        <button onClick={prevWeek} className="p-1 hover:bg-background rounded-sm"><ChevronLeft size={16} /></button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-2 text-sm font-medium">Hoje</button>
                        <button onClick={nextWeek} className="p-1 hover:bg-background rounded-sm"><ChevronRight size={16} /></button>
                    </div>
                </div>

                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-primary/90">
                    <Plus size={16} /> Novo Agendamento
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-auto flex">
                {/* Time Column */}
                <div className="w-16 flex-shrink-0 border-r border-border bg-muted/10">
                    <div className="h-10 border-b border-border"></div> {/* Empty corner */}
                    {hours.map(hour => (
                        <div key={hour} className="h-24 border-b border-border text-xs text-muted-foreground flex justify-center pt-2">
                            {String(hour).padStart(2, '0')}:00
                        </div>
                    ))}
                </div>

                {/* Days Columns */}
                <div className="flex-1 flex min-w-[800px]">
                    {weekDays.map((day, i) => (
                        <div key={i} className={`flex-1 min-w-[120px] border-r border-border ${i === 6 ? 'border-r-0' : ''}`}>
                            {/* Day Header */}
                            <div className={`h-10 border-b border-border flex flex-col items-center justify-center ${isSameDay(day, new Date()) ? 'bg-primary/10 text-primary' : ''}`}>
                                <span className="text-xs font-semibold uppercase">{format(day, 'EEE', { locale: ptBR })}</span>
                                <span className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ${isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground' : ''}`}>
                                    {format(day, 'd')}
                                </span>
                            </div>

                            {/* Slots */}
                            <div>
                                {hours.map(hour => {
                                    // Filter appointments for this day and approximate hour (mock logic)
                                    const dayApps = appointments.filter(app =>
                                        isSameDay(app.date, day) &&
                                        parseInt(app.time.split(':')[0]) === hour
                                    );

                                    return (
                                        <div key={`${day}-${hour}`} className="h-24 border-b border-border p-1 hover:bg-muted/30 transition-colors relative group">
                                            {dayApps.map(app => (
                                                <AppointmentCard key={app.id} appointment={app} />
                                            ))}
                                            <button className="hidden group-hover:flex absolute bottom-1 right-1 w-6 h-6 bg-primary/20 text-primary rounded-full items-center justify-center">
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
