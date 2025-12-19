"use client";
import { useEffect, useState } from 'react';

export default function TVPanel() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Clock
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Poll Data every 30 seconds
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/internment/active', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();

                    // Flatten prescriptions from all active patients
                    // Logic: Find Meds relevant for NOW (Overdue or Due in next 2h)
                    // For prototype, we show ALL active prescriptions to demonstrate visual

                    let allTasks: any[] = [];
                    data.forEach((internment: any) => {
                        internment.prescriptions?.forEach((p: any) => {
                            // Check if already executed today/now? 
                            // Simplified: Just showing the prescription card
                            allTasks.push({
                                ...p,
                                patientName: internment.pet?.name,
                                bed: internment.bedNumber,
                                species: internment.pet?.species
                            });
                        });
                    });

                    setTasks(allTasks);
                }
            } catch (e) {
                console.error("Connection Error", e);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // 30s refresh
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-4 overflow-hidden">
            {/* Header / Relógio */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-4xl font-bold text-blue-500 tracking-wider">🏥 PAINEL DE CONTROLE - INTERNAÇÃO</h1>
                <div className="text-6xl font-mono font-bold text-yellow-400">
                    {currentTime.toLocaleTimeString()}
                </div>
            </div>

            {/* Grid de Tarefas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tasks.map((task, idx) => (
                    <div key={idx} className="bg-gray-900 border-l-8 border-red-500 rounded-lg p-6 relative animate-pulse-slow">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-3xl font-bold">{task.bed}</span>
                            <span className="text-2xl">{task.species === 'CAT' ? '🐱' : '🐶'}</span>
                        </div>
                        <h2 className="text-3xl font-bold truncate mb-1">{task.patientName}</h2>
                        <div className="mt-4">
                            <p className="text-gray-400 text-sm uppercase">Medicação</p>
                            <p className="text-4xl font-bold text-yellow-300">{task.medicationName}</p>
                            <p className="text-xl text-white mt-1">{task.dosage} • {task.frequency}</p>
                        </div>

                        {/* Status Alert Badge */}
                        <div className="absolute top-4 right-4 animate-bounce">
                            <span className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm">ATRASADO</span>
                        </div>
                    </div>
                ))}

                {tasks.length === 0 && (
                    <div className="col-span-full h-96 flex items-center justify-center text-gray-700">
                        <p className="text-4xl">Nenhuma medicação pendente. ✅</p>
                    </div>
                )}
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 p-2 text-center text-gray-500 text-sm">
                Atualização Automática • Sistema Veterinário V1
            </div>

            <style jsx global>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.95; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s infinite;
                }
            `}</style>
        </div>
    );
}
