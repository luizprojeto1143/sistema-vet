"use client";
import React, { useEffect, useState } from 'react';
import { ShieldCheckIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

export default function AuditPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/audit?limit=100', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setLogs(await res.json());
            }
            setLoading(false);
        };
        fetchLogs();
    }, []);

    if (loading) return <div className="p-10 text-center">Carregando Auditoria...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-700">
                    <ShieldCheckIcon className="h-8 w-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Logs de Auditoria</h1>
                    <p className="text-gray-500">Rastreabilidade e Segurança do Sistema</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-bold text-gray-600 text-sm">Data/Hora</th>
                            <th className="p-4 font-bold text-gray-600 text-sm">Usuário</th>
                            <th className="p-4 font-bold text-gray-600 text-sm">Ação</th>
                            <th className="p-4 font-bold text-gray-600 text-sm">Detalhes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="p-4 text-sm text-gray-500 font-mono">
                                    <div className="flex items-center gap-2">
                                        <ClockIcon className="h-4 w-4" />
                                        {new Date(log.createdAt).toLocaleString()}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                                        <UserIcon className="h-4 w-4 text-gray-400" />
                                        {log.user?.fullName || log.userId}
                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">{log.user?.role}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="p-4 text-xs text-gray-500 max-w-md truncate" title={log.details}>
                                    {log.details ? log.details.slice(0, 100) : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.length === 0 && (
                    <div className="p-10 text-center text-gray-400">Nenhum registro encontrado.</div>
                )}
            </div>
        </div>
    );
}
