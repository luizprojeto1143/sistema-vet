import React, { useEffect, useState } from 'react';
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

interface MedicalHistoryTabProps {
    petId: string;
}

export default function MedicalHistoryTab({ petId }: MedicalHistoryTabProps) {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/pets/${petId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    // data.medicalRecords comes from the backend include
                    setHistory(data.medicalRecords || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        if (petId) fetchHistory();
    }, [petId]);

    if (loading) return <div className="p-8 text-center text-gray-400">Carregando histórico...</div>;

    if (history.length === 0) {
        return (
            <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                <p className="text-gray-500 font-medium">Nenhum histórico médico encontrado.</p>
                <p className="text-sm text-gray-400 mt-1">Este é o primeiro atendimento registrado para este pet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {history.map((record) => (
                <div key={record.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2 text-indigo-900 font-bold">
                            <CalendarIcon className="w-5 h-5 text-indigo-500" />
                            {new Date(record.createdAt).toLocaleDateString()}
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                            {record.diagnosis ? 'Diagnóstico Fechado' : 'Rotina'}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {record.anamnesis && (
                            <div>
                                <span className="text-xs font-bold text-gray-500 uppercase">Anamnese</span>
                                <p className="text-sm text-gray-700 line-clamp-3">{record.anamnesis}</p>
                            </div>
                        )}
                        {record.diagnosis && (
                            <div>
                                <span className="text-xs font-bold text-gray-500 uppercase">Diagnóstico</span>
                                <p className="text-sm text-gray-700 font-medium text-indigo-700">{record.diagnosis}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <UserIcon className="w-3 h-3" /> Dr. Responsável
                        </span>
                        <button className="text-indigo-600 font-bold hover:underline">Ver Detalhes</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
