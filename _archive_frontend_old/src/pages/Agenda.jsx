import React from 'react';
import Calendar from '../components/calendar/Calendar';

const AgendaPage = () => {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Agenda</h2>
                <p className="text-muted-foreground">Gerencie consultas, retornos e procedimentos.</p>
            </div>
            <Calendar />
        </div>
    );
};

export default AgendaPage;
