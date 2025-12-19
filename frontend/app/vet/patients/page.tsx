"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PatientList() {
    const router = useRouter();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:4000/pets', {
                    headers: {
                        'Authorization': `Bearer ${token} `
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setPets(data);
                }
            } catch (error) {
                console.error('Failed to fetch pets', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, []);

    if (loading) return <div className="p-8">Carregando pacientes...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Pacientes</h1>
                <button
                    onClick={() => router.push('/vet/patients/new')}
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                >
                    + Novo Paciente
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Nome</th>
                            <th className="p-4 font-semibold text-gray-600">Espécie/Raça</th>
                            <th className="p-4 font-semibold text-gray-600">Tutor</th>
                            <th className="p-4 font-semibold text-gray-600">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pets.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    Nenhum paciente encontrado.
                                </td>
                            </tr>
                        ) : (
                            pets.map((pet: any) => (
                                <tr key={pet.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium">{pet.name}</td>
                                    <td className="p-4 text-gray-600">{pet.species} - {pet.breed}</td>
                                    <td className="p-4 text-gray-600">{pet.tutor?.fullName || '-'}</td>
                                    <td className="p-4">
                                        <button className="text-teal-600 hover:text-teal-800 font-medium">Ver Prontuário</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
