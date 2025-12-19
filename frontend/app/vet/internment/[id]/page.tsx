"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeftIcon,
    HeartIcon,
    ClipboardDocumentCheckIcon,
    ChatBubbleLeftRightIcon,
    BeakerIcon,
    PlusCircleIcon,
    ClockIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const TABS = [
    { id: 'prescription', label: 'Prescrições Ativas', icon: ClipboardDocumentCheckIcon },
    { id: 'evolution', label: 'Evolução Clínica', icon: HeartIcon },
    // { id: 'bulletin', label: 'Boletim Méd', icon: ChatBubbleLeftRightIcon },
    // { id: 'exams', label: 'Exames', icon: BeakerIcon },
];

export default function InternmentFolioPage() {
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('prescription');
    const [internment, setInternment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form Strings
    const [newLog, setNewLog] = useState('');
    const [isPrescribing, setIsPrescribing] = useState(false);
    const [newPrescription, setNewPrescription] = useState({ medicationName: '', dosage: '', frequency: '', duration: '' });

    const [products, setProducts] = useState<any[]>([]);
    const [selectedProductId, setSelectedProductId] = useState('');

    useEffect(() => {
        loadData();
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/stock/products`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            setProducts(await res.json());
        }
    };

    const loadData = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/internment/${params.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            setInternment(await res.json());
        }
        setLoading(false);
    };

    // ... (handleDischarge, handleLog remain same)

    const handlePrescribe = async () => {
        const token = localStorage.getItem('token');
        await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/internment/prescribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                internmentId: params.id,
                ...newPrescription,
                productId: selectedProductId || undefined, // Send if selected
                prescribedById: 'vet-uuid-placeholder'
            })
        });
        setIsPrescribing(false);
        setNewPrescription({ medicationName: '', dosage: '', frequency: '', duration: '' });
        setSelectedProductId('');
        loadData();
    };

    // ... (handleExecute remains same)

    // RENDER PART
    // ...

    {
        isPrescribing && (
            <div className="bg-indigo-50 p-4 rounded-xl mb-4 border border-indigo-200 animate-fade-in-down">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Selecione o Produto (Estoque) ou Digite</label>
                        <select
                            className="w-full p-2 rounded border mb-2 bg-white"
                            value={selectedProductId}
                            onChange={e => {
                                const pid = e.target.value;
                                setSelectedProductId(pid);
                                if (pid) {
                                    const p = products.find(x => x.id === pid);
                                    setNewPrescription({ ...newPrescription, medicationName: p?.name || '' });
                                }
                            }}
                        >
                            <option value="">-- Selecionar do Estoque --</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({p.currentStock} un) - {p.usageType === 'INTERNAL' ? 'Uso Interno' : (p.usageType === 'SALE' ? 'Venda' : 'Híbrido')}</option>
                            ))}
                        </select>
                        <input
                            className="w-full p-2 rounded border"
                            placeholder="Ou digite o nome do medicamento (se não estiver no estoque)"
                            value={newPrescription.medicationName}
                            onChange={e => setNewPrescription({ ...newPrescription, medicationName: e.target.value })}
                        />
                    </div>
                    <input className="p-2 rounded border" placeholder="Dose (ex: 1 amp, 2ml)" value={newPrescription.dosage} onChange={e => setNewPrescription({ ...newPrescription, dosage: e.target.value })} />
                    <input className="p-2 rounded border" placeholder="Frequência (ex: 8h, 12h)" value={newPrescription.frequency} onChange={e => setNewPrescription({ ...newPrescription, frequency: e.target.value })} />
                    <input className="p-2 rounded border" placeholder="Duração (ex: 3 dias)" value={newPrescription.duration} onChange={e => setNewPrescription({ ...newPrescription, duration: e.target.value })} />
                    <input className="col-span-2 p-2 rounded border" placeholder="Instruções Adicionais" />
                </div>
                <button onClick={handlePrescribe} className="w-full bg-indigo-600 text-white font-bold py-2 rounded">Salvar Prescrição e Vincular Estoque</button>
            </div>
        )
    }

    <div className="space-y-4">
        {internment.prescriptions?.map((item: any) => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">

                {/* Drug Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="font-bold text-lg text-gray-800">{item.medicationName}</div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">{item.frequency}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                        Dose: <strong>{item.dosage}</strong> • Duração: <strong>{item.duration}</strong>
                    </div>
                    {/* Show Executions */}
                    <div className="mt-2 flex gap-1">
                        {item.executions?.map((ex: any) => (
                            <span key={ex.id} title={new Date(ex.executedAt).toLocaleString()} className="h-2 w-2 rounded-full bg-green-500"></span>
                        ))}
                    </div>
                </div>

                {/* Schedule (Simplified) */}
                <div className="flex items-center gap-8 px-8 border-l border-r border-gray-100">
                    <div className="text-center">
                        <div className="text-xs text-indigo-500 font-bold uppercase mb-1">Próxima</div>
                        <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                            <ClockIcon className="h-5 w-5" />
                            <span className="font-mono font-bold text-xl">--:--</span>
                        </div>
                    </div>
                </div>

                {/* Action */}
                <div className="pl-6">
                    <button
                        onClick={() => handleExecute(item.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg transform transition-transform hover:scale-105 flex items-center gap-2"
                    >
                        <CheckCircleIcon className="h-5 w-5" />
                        Aplicar
                    </button>
                </div>

            </div>
        ))}
        {(!internment.prescriptions || internment.prescriptions.length === 0) && (
            <div className="text-center text-gray-400 italic py-10">Nenhuma prescrição ativa.</div>
        )}
    </div>
                        </div >
                    )
}

{
    activeTab === 'evolution' && (
        <div className="animate-fadeIn max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                <textarea
                    className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                    placeholder="Descreva a evolução do paciente..."
                    value={newLog}
                    onChange={e => setNewLog(e.target.value)}
                />
                <div className="flex justify-end mt-3">
                    <button onClick={handleLog} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700">Registrar Evolução</button>
                </div>
            </div>

            {/* Timeline */}
            <div className="border-l-2 border-gray-200 ml-4 space-y-8 pl-8 relative">
                {internment.dailyRecords?.map((log: any) => (
                    <div key={log.id} className="relative">
                        <div className="absolute -left-[39px] bg-indigo-600 h-5 w-5 rounded-full border-4 border-white shadow-sm"></div>
                        <div className="text-xs font-bold text-gray-400 mb-1">{new Date(log.date).toLocaleString()}</div>
                        <p className="text-gray-700 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            {log.notes}
                        </p>
                    </div>
                ))}
            </div>

            {(!internment.dailyRecords || internment.dailyRecords.length === 0) && (
                <div className="text-center text-gray-400 italic mt-10">Nenhuma evolução registrada.</div>
            )}
        </div>
    )
}

                </div >

            </div >
        </div >
    );
}
