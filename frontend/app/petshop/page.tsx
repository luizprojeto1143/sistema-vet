"use client";
import { useState, useEffect } from 'react';

export default function PetShopDashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPackages, setShowPackages] = useState(false); // New State

    const stages = {
        'WAITING': '⏳ Aguardando',
        'BATHING': '🚿 No Banho',
        'DRYING': '💨 Secagem',
        'FINISHING': '✂️ Tosa/Acabamento',
        'READY': '🎀 Pronto',
        'COMPLETED': '✅ Entregue'
    };

    // State for Detail Modal
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [checklist, setChecklist] = useState({ nails: false, ears: false, perfume: false });
    const [obs, setObs] = useState('');

    const openTask = (task: any) => {
        setSelectedTask(task);
        if (task.notes) setObs(task.notes); // Pre-fill if exists
    }

    const saveDetails = async () => {
        // Save checklist/observations to backend (notes field or new json field)
        const notes = `Obs: ${obs} | Checklist: ${checklist.nails ? 'Unha ' : ''}${checklist.ears ? 'Ouvido ' : ''}`;

        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/appointments/${selectedTask.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ notes })
        });

        setSelectedTask(null);
        loadTasks(); // Refresh
        alert('Detalhes salvos!');
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/appointments?type=BANHO_TOSA', { // Filter by type
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            // Filter only today? Or active ones.
            setTasks(data);
        }
        setLoading(false);
    };

    const moveStage = async (id: string, currentStage: string) => {
        const flow = Object.keys(stages);
        const idx = flow.indexOf(currentStage);
        if (idx === -1 || idx === flow.length - 1) return;

        const nextStage = flow[idx + 1];

        // Optimistic update
        setTasks(prev => prev.map((t: any) => t.id === id ? { ...t, status: nextStage } : t));

        const token = localStorage.getItem('token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/appointments/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status: nextStage })
        });
    };

    if (loading) return <div className="p-10">Carregando Pet Shop...</div>;

    return (
        <div className="p-8 h-screen bg-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">🛁 Pet Shop - Controle de Fluxo</h1>
                <button
                    onClick={() => setShowPackages(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 shadow-sm flex items-center gap-2"
                >
                    🎟️ Pacotes & Assinaturas
                </button>
            </div>

            <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
                {Object.entries(stages).map(([key, label]) => (
                    <div key={key} className="flex-1 min-w-[280px] bg-gray-50 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                        {/* Header */}
                        <div className={`p-4 border-b font-bold text-center uppercase tracking-wide
                            ${key === 'READY' ? 'bg-green-100 text-green-700' :
                                key === 'WAITING' ? 'bg-orange-100 text-orange-700' : 'bg-white text-gray-700'}
                        `}>
                            {label} <span className="text-xs bg-white px-2 py-0.5 rounded-full ml-2 border">{tasks.filter((t: any) => t.status === key).length}</span>
                        </div>

                        <div className="p-3 flex-1 overflow-y-auto space-y-3">
                            {tasks.filter((t: any) => t.status === key).map((task: any) => (
                                <div key={task.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-gray-800">{task.pet?.name}</h3>
                                        <span className="text-xs text-gray-500">{new Date(task.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{task.pet?.tutor?.fullName}</p>
                                    <p className="text-xs text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded mb-3">
                                        {task.service?.name || 'Banho Simples'}
                                    </p>

                                    <div className="flex gap-2 mt-2">
                                        {key !== 'COMPLETED' && (
                                            <button
                                                onClick={() => moveStage(task.id, key)}
                                                className="flex-1 py-2 bg-gray-900 text-white text-sm font-bold rounded hover:bg-black transition-colors"
                                            >
                                                Mover ➡️
                                            </button>
                                        )}
                                        <button onClick={() => openTask(task)} className="px-3 py-2 border border-gray-200 rounded hover:bg-gray-50 text-gray-600">
                                            ✏️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Service Detail Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden">
                        <div className="bg-blue-600 p-6 text-white">
                            <h2 className="text-xl font-bold">Detalhes do Serviço: {selectedTask.pet.name}</h2>
                            <p className="opacity-80">{selectedTask.service?.name}</p>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-gray-700 mb-2">Checklist Operacional</h3>
                            <div className="flex gap-4 mb-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={checklist.nails} onChange={e => setChecklist({ ...checklist, nails: e.target.checked })} /> Corte de Unha
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={checklist.ears} onChange={e => setChecklist({ ...checklist, ears: e.target.checked })} /> Limpeza Ouvido
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={checklist.perfume} onChange={e => setChecklist({ ...checklist, perfume: e.target.checked })} /> Perfume
                                </label>
                            </div>

                            <h3 className="font-bold text-gray-700 mb-2">Observações (Comportamento/Nós)</h3>
                            <textarea
                                className="w-full border rounded p-2 h-24 mb-4"
                                placeholder="Ex: Cão agitado na secagem, nó atrás da orelha..."
                                value={obs}
                                onChange={e => setObs(e.target.value)}
                            />

                            <h3 className="font-bold text-gray-700 mb-2">Fotos (Antes/Depois)</h3>
                            <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500 mb-6 cursor-pointer hover:bg-gray-50">
                                📸 Toque para adicionar foto
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => setSelectedTask(null)} className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded font-bold">Cancelar</button>
                                <button onClick={saveDetails} className="flex-1 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded font-bold">Salvar Detalhes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Packages Modal */}
            {showPackages && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-[600px] h-[500px] flex flex-col">
                        <div className="bg-purple-600 p-6 text-white flex justify-between items-center">
                            <h2 className="text-xl font-bold">Gerenciar Pacotes</h2>
                            <button onClick={() => setShowPackages(false)} className="text-white hover:bg-purple-700 p-1 rounded">✕</button>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto">
                            <div className="bg-purple-50 p-4 rounded-lg mb-6 border border-purple-100">
                                <h3 className="font-bold text-purple-900 mb-2">Novo Pacote</h3>
                                <div className="flex gap-2">
                                    <select className="border p-2 rounded flex-1">
                                        <option>Pacote 4 Banhos (Mensal)</option>
                                        <option>Pacote 8 Banhos + 1 Tosa</option>
                                    </select>
                                    <input type="text" placeholder="Nome do Pet" className="border p-2 rounded flex-1" />
                                    <button className="bg-purple-600 text-white px-4 py-2 rounded font-bold hover:bg-purple-700">Vender</button>
                                </div>
                            </div>

                            <h3 className="font-bold text-gray-700 mb-4">Pacotes Ativos</h3>
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                                        <div>
                                            <p className="font-bold text-gray-800">Thor (Golden Retriever)</p>
                                            <p className="text-sm text-gray-500">Pacote 4 Banhos</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold block mb-1">2/4 Usados</span>
                                            <p className="text-xs text-gray-400">Validade: 20/01/2026</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
```
