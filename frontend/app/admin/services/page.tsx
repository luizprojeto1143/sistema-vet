"use client";
import { useState, useEffect } from 'react';

export default function ServicesManagement() {
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newService, setNewService] = useState({ name: '', price: '', duration: '30', type: 'CONSULTA' });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        const token = localStorage.getItem('token');
        // Filter products by category 'SERVICE'
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/products?category=SERVICE', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const all = await res.json();
            // Client-side filter if backend doesnt support query yet, or assume backend supports it
            // For now, I'll filter client side if needed, but lets assume filtering works or I fix it
            setServices(all.filter((p: any) => p.category === 'SERVICE'));
        }
    };

    const handleCreate = async () => {
        const token = localStorage.getItem('token');
        await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                name: newService.name,
                category: 'SERVICE',
                salePrice: parseFloat(newService.price),
                costPrice: 0, // Services usually 0 cost
                minStock: 0,
                currentStock: 9999, // Infinite stock for services
                unit: 'UNIT',
                controlType: 'UNIT',
                description: `Duração: ${newService.duration} min | Tipo: ${newService.type}`,
                clinicId: 'clinic-1'
            })
        });
        setIsModalOpen(false);
        loadServices();
        alert('Serviço criado!');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Catálogo de Serviços</h1>
                    <p className="text-gray-500">Defina preços e durações das consultas e procedimentos.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">
                    + Novo Serviço
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((s: any) => (
                    <div key={s.id} className="bg-white p-6 rounded-xl shadow border border-indigo-50 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-indigo-100 text-indigo-700 p-3 rounded-lg text-2xl">
                                🩺
                            </div>
                            <span className="font-bold text-lg text-gray-800">R$ {s.salePrice}</span>
                        </div>
                        <h3 className="font-bold text-xl mb-1">{s.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{s.description}</p>

                        <div className="flex gap-2">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">30 min</span>
                            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">Retorno Incluso</span>
                        </div>

                        <button className="mt-4 w-full border border-indigo-200 text-indigo-600 py-2 rounded hover:bg-indigo-50 font-bold text-sm">
                            Editar Regras
                        </button>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Novo Serviço</h2>
                        <input className="w-full border p-2 mb-2 rounded" placeholder="Nome (Ex: Consulta Geral)" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} />
                        <input className="w-full border p-2 mb-2 rounded" type="number" placeholder="Preço (R$)" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} />

                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <div>
                                <label className="text-xs font-bold text-gray-500">Duração (min)</label>
                                <select className="w-full border p-2 rounded" value={newService.duration} onChange={e => setNewService({ ...newService, duration: e.target.value })}>
                                    <option value="15">15 min</option>
                                    <option value="30">30 min</option>
                                    <option value="60">1h</option>
                                    <option value="90">1h 30m</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Tipo</label>
                                <select className="w-full border p-2 rounded" value={newService.type} onChange={e => setNewService({ ...newService, type: e.target.value })}>
                                    <option value="CONSULTA">Consulta</option>
                                    <option value="VACINA">Vacina</option>
                                    <option value="CIRURGIA">Cirurgia</option>
                                    <option value="EXAME">Exame</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:bg-gray-100 px-4 py-2 rounded">Cancelar</button>
                            <button onClick={handleCreate} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-bold">Salvar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
