"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { maskCPF, maskPhone } from '../../../../utils/masks';

export default function NewTutorPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        cpf: '',
        phone: '',
        address: '' // Simple string for now
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Remove masks for backend if needed, or keep. Assuming backend handles or valid format.
        // Usually we strip non-digits.
        const payload = {
            ...formData,
            cpf: formData.cpf.replace(/\D/g, ''),
            phone: formData.phone.replace(/\D/g, '')
        };

        // Create Tutor
        const res = await fetch('http://localhost:4000/tutors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            router.back(); // Go back to patient creation
        } else {
            alert('Erro ao criar tutor');
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Novo Tutor</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nome Completo</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">CPF</label>
                        <input
                            type="text"
                            maxLength={14}
                            className="w-full border p-2 rounded"
                            value={formData.cpf}
                            onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Telefone</label>
                        <input
                            type="text"
                            maxLength={15}
                            className="w-full border p-2 rounded"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full border p-2 rounded"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded hover:bg-gray-50">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">Salvar Tutor</button>
                </div>
            </form>
        </div>
    );
}
