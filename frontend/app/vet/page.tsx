"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function VetDashboard() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [internments, setInternments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

            try {
                const [resApt, resInt] = await Promise.all([
                    fetch(`${baseUrl}/appointments?date=${new Date().toISOString().split('T')[0]}`, { headers }),
                    fetch(`${baseUrl}/internment/active`, { headers })
                ]);

                if (resApt.ok) setAppointments(await resApt.json());
                if (resInt.ok) setInternments(await resInt.json());
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8">Carregando painel...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Painel Veterinário</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded shadow border-l-4 border-teal-500">
                    <h2 className="text-xl font-bold mb-4">Meus Pacientes (Hoje)</h2>
                    {appointments.length > 0 ? (
                        <ul className="space-y-3">
                            {appointments.map((apt: any) => (
                                <li key={apt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <span>{apt.pet?.name} - {apt.pet?.breed}</span>
                                    <Link href={`/vet/appointments/consultation/${apt.id}`} className="text-teal-600 font-semibold text-sm hover:underline">Iniciar Atendimento</Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">Nenhum agendamento para hoje.</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded shadow border-l-4 border-red-500">
                    <h2 className="text-xl font-bold mb-4">Internação (Ativos)</h2>
                    {internments.length > 0 ? (
                        <ul className="space-y-3">
                            {internments.map((int: any) => (
                                <li key={int.id} className="p-3 bg-red-50 text-red-700 rounded text-sm flex justify-between items-center">
                                    <span><strong>{int.pet?.name}:</strong> Em observação</span>
                                    <Link href={`/vet/internment/${int.id}`} className="text-red-800 underline text-xs">Ver Ficha</Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">Nenhum paciente internado.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
