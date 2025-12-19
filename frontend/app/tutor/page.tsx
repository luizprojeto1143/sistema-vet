"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TutorDashboard() {
    const router = useRouter();
    const [tutor, setTutor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:4000/tutors/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setTutor(await res.json());
                } else {
                    router.push('/login');
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchMe();
    }, []);

    if (loading) return <div className="p-8 text-center">Carregando perfil...</div>;
    if (!tutor) return <div className="p-8 text-center"><p className="mb-4">Perfil não encontrado.</p><button onClick={() => router.push('/login')} className="text-blue-600">Fazer Login</button></div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Mobile Header */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-6 text-white shadow-lg rounded-b-3xl">
                <h1 className="text-2xl font-bold">Olá, {tutor.fullName.split(' ')[0]} 👋</h1>
                <p className="text-teal-100 text-sm">Bem-vindo ao App do Tutor</p>
            </div>

            <div className="p-6 space-y-6">

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-gray-50">
                        <span className="text-2xl">📅</span>
                        <span className="font-bold text-gray-700 text-sm">Agendar</span>
                    </button>
                    <button className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-gray-50">
                        <span className="text-2xl">💉</span>
                        <span className="font-bold text-gray-700 text-sm">Vacinas</span>
                    </button>
                </div>

                {/* My Pets Carousel */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-3 ml-1">Meus Pets 🐾</h2>
                    <div className="space-y-4">
                        {tutor.pets?.map((pet: any) => (
                            <div key={pet.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                                    {pet.species === 'Canino' ? '🐶' : pet.species === 'Felino' ? '🐱' : '🐾'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{pet.name}</h3>
                                    <p className="text-sm text-gray-500">{pet.breed} • {pet.gender === 'MACHO' ? 'Macho' : 'Fêmea'}</p>
                                </div>
                            </div>
                        ))}
                        {(!tutor.pets || tutor.pets.length === 0) && (
                            <div className="text-gray-400 text-center py-8 bg-white rounded-2xl border border-dashed">
                                Você ainda não tem pets cadastrados.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
