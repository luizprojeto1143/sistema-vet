import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        clinics: 0,
        users: 0,
        systemStatus: 'Online'
    });

    useEffect(() => {
        // In a real scenario, fetch these from an admin stats endpoint
        // For now, we'll just simulate a fetch or leave as 0/placeholder until endpoints exist
        // to avoid showing fake "3 Active" or "12 Collaborators"
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

            try {
                const resUsers = await fetch(`${baseUrl}/users`, { headers });
                if (resUsers.ok) {
                    const users = await resUsers.json();
                    setStats(prev => ({ ...prev, users: users.length }));
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="p-4">
            <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Painel Administrativo</h1>
                <p className="text-gray-500 mt-2 font-medium">Visão geral da sua clínica.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-brand-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="h-16 w-16 bg-brand-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-500 transition-colors duration-300">
                        <span className="text-3xl group-hover:scale-110 transition-transform">🏥</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Clínicas</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Gerencie as unidades e configurações.
                    </p>
                    <div className="mt-6">
                        <span className="inline-block py-2 px-4 bg-brand-50 text-brand-600 rounded-full text-sm font-bold">
                            Gestão Ativa
                        </span>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-brand-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors duration-300">
                        <span className="text-3xl group-hover:scale-110 transition-transform">👥</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Equipe</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Controle de acesso e colaboradores.
                    </p>
                    <div className="mt-6">
                        <span className="inline-block py-2 px-4 bg-blue-50 text-blue-600 rounded-full text-sm font-bold">
                            {stats.users} Colaboradores
                        </span>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-brand-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="h-16 w-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300">
                        <span className="text-3xl group-hover:scale-110 transition-transform">⚙️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Configurações</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Ajustes globais e integrações.
                    </p>
                    <div className="mt-6">
                        <span className="inline-block py-2 px-4 bg-amber-50 text-amber-600 rounded-full text-sm font-bold">
                            {stats.systemStatus}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
