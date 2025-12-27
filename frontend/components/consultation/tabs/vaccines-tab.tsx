import React, { useEffect, useState } from 'react';
import { ShieldCheckIcon, CalendarDaysIcon, PlusIcon } from '@heroicons/react/24/outline';

interface VaccinesTabProps {
    petId: string;
}

export default function VaccinesTab({ petId }: VaccinesTabProps) {
    const [vaccines, setVaccines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVaccines = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/pets/${petId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setVaccines(data.vaccines || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        if (petId) fetchVaccines();
    }, [petId]);

    const handleAddVaccine = () => {
        alert("Funcionalidade de adicionar vacina será integrada ao módulo de estoque/serviços.");
    };

    if (loading) return <div className="p-8 text-center text-gray-400">Carregando carteira de vacinação...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-green-50 p-4 rounded-xl border border-green-100">
                <div>
                    <h3 className="text-green-800 font-bold flex items-center gap-2">
                        <ShieldCheckIcon className="w-5 h-5" /> Carteira Digital
                    </h3>
                    <p className="text-xs text-green-600 mt-1">Gerencie as aplicações e reforços.</p>
                </div>
                <button
                    onClick={handleAddVaccine}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors flex items-center gap-1 shadow-sm"
                >
                    <PlusIcon className="w-4 h-4" /> Nova Vacina
                </button>
            </div>

            {vaccines.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                    Nenhuma vacina registrada para este pet.
                </div>
            ) : (
                <div className="space-y-3">
                    {vaccines.map((vac) => {
                        const isLate = vac.nextDueDate && new Date(vac.nextDueDate) < new Date();
                        return (
                            <div key={vac.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-indigo-200 transition-colors">
                                <div>
                                    <h4 className="font-bold text-gray-800">{vac.name}</h4>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                        <span>Lote: {vac.batch || 'N/A'}</span>
                                        <span>Aplicado em: {new Date(vac.applicationDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className={`text-right ${isLate ? 'text-red-600' : 'text-green-600'}`}>
                                    <span className="block text-[10px] font-bold uppercase tracking-wide">Próximo Reforço</span>
                                    <div className="flex items-center justify-end gap-1 font-bold">
                                        <CalendarDaysIcon className="w-4 h-4" />
                                        {vac.nextDueDate ? new Date(vac.nextDueDate).toLocaleDateString() : 'Sem previsão'}
                                    </div>
                                    {isLate && <span className="text-[10px] font-bold bg-red-100 px-2 py-0.5 rounded-full">ATRASADA</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
