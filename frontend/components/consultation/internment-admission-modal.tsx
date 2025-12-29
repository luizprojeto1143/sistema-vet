import React, { useState, useEffect } from 'react';
import { XMarkIcon, HomeModernIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { API_URL } from '@/utils/config';
import { useRouter } from 'next/navigation';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    petId: string;
    clinicId?: string; // If known
    diagnosis: string;
}

export default function InternmentAdmissionModal({ isOpen, onClose, petId, diagnosis }: Props) {
    const router = useRouter();
    const [wards, setWards] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedBox, setSelectedBox] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) fetchWards();
    }, [isOpen]);

    const fetchWards = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/internment/wards`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setWards(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAdmit = async () => {
        if (!selectedBox) return alert("Selecione um leito.");

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/internment/admit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    petId,
                    clinicId: 'clinic-1', // TODO: Get from context/JWT
                    reason: diagnosis,
                    boxId: selectedBox,
                    bedNumber: '1', // Default for now
                })
            });

            if (res.ok) {
                alert("Paciente Internado com Sucesso! Redirecionando...");
                router.push('/vet/internment'); // Go to Internment Dashboard
            } else {
                alert("Erro ao internar");
            }
        } catch (e) {
            console.error(e);
            alert("Erro de conexão");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-pink-50">
                    <h3 className="font-bold text-pink-900 flex items-center gap-2">
                        <HomeModernIcon className="w-5 h-5" /> Internar Paciente
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-pink-100 rounded-full text-pink-700">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-4">
                        Selecione o local de internação para: <span className="font-bold text-gray-800">{diagnosis}</span>
                    </p>

                    {loading ? <div className="text-center py-4">Carregando leitos...</div> : (
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                            {wards.map(ward => (
                                <div key={ward.id} className="border border-gray-100 rounded-xl p-3">
                                    <h4 className="font-bold text-gray-700 text-sm mb-2">{ward.name}</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {ward.boxes.map((box: any) => {
                                            const isOccupied = box.internments && box.internments.length > 0;
                                            return (
                                                <button
                                                    key={box.id}
                                                    disabled={isOccupied}
                                                    onClick={() => setSelectedBox(box.id)}
                                                    className={`p-2 rounded-lg text-xs font-bold border transition-all
                                                        ${isOccupied
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : selectedBox === box.id
                                                                ? 'bg-pink-600 text-white border-pink-600 shadow-md ring-2 ring-pink-200'
                                                                : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                                                        }
                                                    `}
                                                >
                                                    {box.name} <br />
                                                    {isOccupied ? '(Ocupado)' : '(Livre)'}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-2">
                        <button onClick={onClose} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-50 rounded-lg">Cancelar</button>
                        <button
                            onClick={handleAdmit}
                            disabled={!selectedBox}
                            className={`px-6 py-2 rounded-lg font-bold text-white flex items-center gap-2
                                ${selectedBox ? 'bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-200' : 'bg-gray-300 cursor-not-allowed'}
                            `}
                        >
                            <CheckCircleIcon className="w-5 h-5" /> Confirmar Internação
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
