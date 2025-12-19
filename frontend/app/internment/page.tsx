"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InternmentDashboard() {
    const [internments, setInternments] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchInternments = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/internment/active', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setInternments(await res.json());
            }
            setLoading(false);
        };
        fetchInternments();
    }, []);

    if (loading) return <div className="p-8">Carregando mapa de leitos...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">🏥 Internação (Mapa de Leitos)</h1>
                    <p className="text-gray-500">Gestão de pacientes hospitalizados</p>
                </div>
                <button
                    onClick={() => alert('Para internar, vá no Prontuário do paciente e clique em Internar.')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                    + Nova Internação
                </button>
            </div>

            {internments.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-xl text-gray-400">Nenhum paciente internado no momento. 🐾</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {internments.map((item: any) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-center">
                                <span className="font-bold text-blue-800">Leito: {item.bedNumber || 'Volante'}</span>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">ESTÁVEL</span>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                                        {item.pet?.species === 'CAT' ? '🐱' : '🐶'}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{item.pet?.name}</h3>
                                        <p className="text-sm text-gray-500">{item.pet?.species} • {item.pet?.breed}</p>
                                        <p className="text-xs text-gray-400">Tutor: {item.pet?.tutor?.fullName}</p>
                                    </div>
                                </div>

                                <div className="bg-red-50 p-3 rounded text-sm text-red-700 mb-4">
                                    <span className="font-bold">Motivo:</span> {item.reason}
                                </div>

                                <Link href={`/internment/${item.id}`} className="block w-full text-center bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition-colors">
                                    Acessar Prontuário / Prescrição
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
