"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuditTimeline from './audit-timeline';

export default function AuditPage() {
    const router = useRouter();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/audit`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        🛡️ Trilha de Auditoria
                    </h1>
                    <p className="text-gray-500">Rastreabilidade completa de todas as ações no sistema (LGPD & Compliance).</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    🔄 Atualizar
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Carregando logs de segurança...</div>
            ) : (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    {logs.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            Nenhum registro de auditoria encontrado ainda.
                        </div>
                    ) : (
                        <AuditTimeline logs={logs} />
                    )}
                </div>
            )}
        </div>
    );
}
