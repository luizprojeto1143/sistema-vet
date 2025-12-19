"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPatientPage() {
    const router = useRouter();
    const [tutors, setTutors] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        gender: 'MACHO',
        tutorId: '',
    });

    useEffect(() => {
        // Fetch Tutors for selection
        const fetchTutors = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:4000/tutors', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setTutors(await res.json());
            }
        };
        fetchTutors();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Create Pet
        const res = await fetch('http://localhost:4000/pets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            router.push('/vet/patients');
        } else {
            alert('Erro ao criar paciente');
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Novo Paciente</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nome do Pet</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Espécie</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={formData.species}
                            onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                        >
                            <option value="">Selecione...</option>
                            <option value="Canino">Canino</option>
                            <option value="Felino">Felino</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Raça</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={formData.breed}
                            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Tutor Responsável</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={formData.tutorId}
                        onChange={(e) => setFormData({ ...formData, tutorId: e.target.value })}
                        required
                    >
                        <option value="">Selecione um tutor...</option>
                        {tutors.map((t: any) => (
                            <option key={t.id} value={t.id}>{t.fullName} ({t.cpf})</option>
                        ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                        Não encontrou? <a href="/vet/tutors/new" className="text-teal-600 hover:underline">Cadastrar novo tutor</a>
                    </p>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded hover:bg-gray-50">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">Salvar Paciente</button>
                </div>
            </form>
        </div>
    );
}
