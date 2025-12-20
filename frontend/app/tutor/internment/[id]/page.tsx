"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeftIcon, HeartIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function InternmentBulletin() {
    const router = useRouter();
    const params = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/internment/${params.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [params.id]);

    if (loading) return <div className="p-8 text-center">Carregando boletim...</div>;
    if (!data) return <div className="p-8 text-center">Boletim não encontrado.</div>;

    const lastVital = data.vitalSigns?.[data.vitalSigns.length - 1];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-orange-500 p-6 text-white pb-20 rounded-b-[40px] shadow-lg relative">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => router.back()}>
                        <ArrowLeftIcon className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-bold">Boletim de Internação</h1>
                </div>
                <div className="text-center mt-4">
                    <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center text-4xl backdrop-blur-sm">
                        🐶
                    </div>
                    <h2 className="text-2xl font-bold">{data.pet.name}</h2>
                    <p className="opacity-90 text-sm">Entrada: {new Date(data.entryDate).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="-mt-16 px-6 space-y-6">

                {/* Status Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-xs font-bold uppercase mb-4">Estado Atual</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded-xl">
                            <span className="text-xs text-blue-600 font-bold block">Temperatura</span>
                            <span className="text-xl font-bold text-gray-800">{lastVital?.temperature || '--'}°C</span>
                        </div>
                        <div className="bg-red-50 p-3 rounded-xl">
                            <span className="text-xs text-red-600 font-bold block">Batimentos</span>
                            <span className="text-xl font-bold text-gray-800">{lastVital?.heartRate || '--'} bpm</span>
                        </div>
                    </div>
                </div>

                {/* Daily Records (Timeline) */}
                <div>
                    <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center gap-2">
                        <ClipboardDocumentListIcon className="h-5 w-5 text-orange-500" />
                        Diário Clínico
                    </h3>

                    <div className="space-y-4">
                        {data.dailyRecords?.map((rec: any) => (
                            <div key={rec.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">
                                        {new Date(rec.date).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs font-bold text-orange-500">
                                        {rec.humor || 'Observação'}
                                    </span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {rec.notes || 'Sem observações adicionais.'}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {rec.feed && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Comeu</span>}
                                    {rec.water && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">Bebeu Água</span>}
                                    {rec.urine && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold">Urina</span>}
                                    {rec.feces && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold">Fezes</span>}

                                    {/* Custom Values */}
                                    {rec.customValues && Object.entries(JSON.parse(rec.customValues)).map(([key, val]) => (
                                        val && <span key={key} className="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded font-bold">{key}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {(!data.dailyRecords || data.dailyRecords.length === 0) && (
                            <div className="text-center text-gray-400 py-4 text-sm">
                                Nenhuma atualização registrada hoje.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
