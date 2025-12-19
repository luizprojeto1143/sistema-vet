"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CashierHistoryPage() {
    const router = useRouter();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:4000/finance/cashier/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setSessions(await res.json());
            }
            setLoading(false);
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="p-10">Carregando Histórico...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Histórico de Caixas Fechados</h1>
                <button onClick={() => router.back()} className="px-4 py-2 border rounded hover:bg-gray-50">Voltar</button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Data Abertura</th>
                            <th className="p-4 font-semibold text-gray-600">Data Fechamento</th>
                            <th className="p-4 font-semibold text-gray-600">Aberto Por</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Inicial (R$)</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Calculado (R$)</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Conferido (R$)</th>
                            <th className="p-4 font-semibold text-gray-600 text-center">Quebra/Sobra</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sessions.map((session: any) => {
                            const diff = (session.finalAmount || 0) - (session.calculatedAmount || 0);
                            return (
                                <tr key={session.id} className="hover:bg-gray-50">
                                    <td className="p-4">{new Date(session.openedAt).toLocaleString()}</td>
                                    <td className="p-4">{session.closedAt ? new Date(session.closedAt).toLocaleString() : '-'}</td>
                                    <td className="p-4">{session.openedByUser?.fullName}</td>
                                    <td className="p-4 text-right">{session.initialAmount.toFixed(2)}</td>
                                    <td className="p-4 text-right">{session.calculatedAmount?.toFixed(2) || '-'}</td>
                                    <td className="p-4 text-right font-bold">{session.finalAmount?.toFixed(2) || '-'}</td>
                                    <td className={`p-4 text-center font-bold ${diff < 0 ? 'text-red-500' : diff > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                                        {diff !== 0 ? `R$ ${diff.toFixed(2)}` : 'OK'}
                                    </td>
                                </tr>
                            );
                        })}
                        {sessions.length === 0 && (
                            <tr><td colSpan={7} className="p-10 text-center text-gray-500">Nenhum caixa fechado encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
