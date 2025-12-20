"use client";
import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function InternmentSettingsPage() {
    const [checklist, setChecklist] = useState<string[]>([]);
    const [newItem, setNewItem] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            // Assuming clinic-1 for now, or fetch from /clinics/me if available
            // Using a known clinic ID or the first one found would be better.
            // For this MVP, we'll assume the user is Admin of 'clinic-1' and we fetch that.
            // Actually, let's fetch the clinic details.
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/clinics`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const clinics = await res.json();
                const myClinic = clinics[0]; // Simplification
                if (myClinic && myClinic.internmentChecklist) {
                    setChecklist(JSON.parse(myClinic.internmentChecklist));
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        // Need clinic ID. Fetching again or storing in context would be best.
        // Let's fetch to get ID then update.
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/clinics`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const clinics = await res.json();
        const clinicId = clinics[0].id;

        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/clinics/${clinicId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                internmentChecklist: JSON.stringify(checklist)
            })
        });
        alert('Configurações salvas com sucesso!');
    };

    const addItem = () => {
        if (newItem && !checklist.includes(newItem)) {
            setChecklist([...checklist, newItem]);
            setNewItem('');
        }
    };

    const removeItem = (item: string) => {
        setChecklist(checklist.filter(i => i !== item));
    };

    if (loading) return <div className="p-8">Carregando...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Configuração de Internação</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-2xl">
                <h2 className="text-lg font-bold text-gray-700 mb-4">Checklist Diário Personalizado</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Defina quais perguntas devem aparecer no boletim diário (ex: "Vomitou?", "Passeou?", "Trocou Curativo?").
                </p>

                <div className="flex gap-2 mb-6">
                    <input
                        className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Nova pergunta (ex: Aceitou sachê?)"
                        value={newItem}
                        onChange={e => setNewItem(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addItem()}
                    />
                    <button
                        onClick={addItem}
                        className="bg-indigo-600 text-white px-6 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5" /> Adicionar
                    </button>
                </div>

                <div className="space-y-3 mb-8">
                    {checklist.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="font-medium text-gray-700">{item}</span>
                            <button onClick={() => removeItem(item)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    {checklist.length === 0 && (
                        <div className="text-center text-gray-400 py-4 border-2 border-dashed rounded-lg">
                            Nenhum item configurado.
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSave}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg flex justify-center items-center gap-2"
                >
                    <CheckCircleIcon className="h-6 w-6" /> Salvar Configurações
                </button>
            </div>
        </div>
    );
}
