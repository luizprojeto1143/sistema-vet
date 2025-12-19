"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewAppointmentPage() {
    const router = useRouter();
    const [pets, setPets] = useState([]);
    const [formData, setFormData] = useState({
        dateTime: '',
        type: 'CONSULTATION',
        petId: '',
        notes: ''
    });

    useEffect(() => {
        // Fetch Pets for selection
        const fetchPets = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:4000/pets', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setPets(await res.json());
        };
        fetchPets();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Create Appointment
        const res = await fetch('http://localhost:4000/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            router.push('/vet/appointments');
        } else {
            alert('Erro ao agendar');
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Novo Agendamento</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Data e Hora</label>
                    <input
                        type="datetime-local"
                        className="w-full border p-2 rounded"
                        value={formData.dateTime}
                        onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Tipo</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="CONSULTATION">Consulta</option>
                        <option value="VACCINE">Vacina</option>
                        <option value="SURGERY">Cirurgia</option>
                        <option value="RETURN">Retorno</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Paciente</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={formData.petId}
                        onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                        required
                    >
                        <option value="">Selecione o paciente...</option>
                        {pets.map((p: any) => (
                            <option key={p.id} value={p.id}>{p.name} ({p.tutor?.fullName})</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Observações</label>
                    <textarea
                        className="w-full border p-2 rounded h-24"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded hover:bg-gray-50">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Agendar</button>
                </div>
            </form>
        </div>
    );
}
