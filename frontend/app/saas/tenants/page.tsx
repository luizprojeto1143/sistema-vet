"use client";
import React, { useEffect, useState } from 'react';
import {
    MagnifyingGlassIcon,
    EllipsisHorizontalIcon,
    ArrowRightOnRectangleIcon,
    NoSymbolIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';

export default function TenantsPage() {
    const [clinics, setClinics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTenants();
    }, []);

    const loadTenants = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/saas/tenants', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setClinics(await res.json());
        setLoading(false);
    };

    const handleImpersonate = (clinicId: string) => {
        // Logic to swap token or redirect. 
        // Ideally: Call Backend -> Get Temp Token -> Redirect to /admin
        alert(`Impersonating Clinic ID: ${clinicId} (Feature to be implemented via AuthController)`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Clínicas (Tenants)</h1>
                    <p className="text-slate-500">Gerencie todos os clientes da plataforma.</p>
                </div>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition-all">
                    Nova Clínica
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                        <tr>
                            <th className="p-4">Clínica</th>
                            <th className="p-4">Plano</th>
                            <th className="p-4">Admin</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {clinics.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-slate-800">{c.name}</div>
                                    <div className="text-xs text-slate-500 font-mono">ID: {c.id.slice(0, 8)}...</div>
                                </td>
                                <td className="p-4">
                                    {c.plan ? (
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${c.plan.name.includes('Pro') ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {c.plan.name}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">Sem Plano</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="text-sm text-slate-700">{c.users?.[0]?.fullName || 'N/A'}</div>
                                    <div className="text-xs text-slate-500">{c.users?.[0]?.email}</div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
                                        Active
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleImpersonate(c.id)}
                                            className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg tooltip"
                                            title="Acessar Painel"
                                        >
                                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                        </button>
                                        <button className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg" title="Bloquear">
                                            <NoSymbolIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {clinics.length === 0 && <div className="p-10 text-center text-gray-400">Nenhuma clínica encontrada.</div>}
            </div>
        </div>
    );
}
