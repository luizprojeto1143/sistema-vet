"use client";
import { useEffect, useState } from 'react';

export default function FinancePage() {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newTrans, setNewTrans] = useState({
        description: '',
        amount: 0,
        type: 'INCOME', // INCOME, EXPENSE
        category: 'CONSULTATION'
    });

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [resTrans, resSum] = await Promise.all([
            fetch('http://localhost:4000/finance', { headers }),
            fetch('http://localhost:4000/finance/summary', { headers })
        ]);

        if (resTrans.ok) setTransactions(await resTrans.json());
        if (resSum.ok) setSummary(await resSum.json());
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await fetch('http://localhost:4000/finance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ ...newTrans, date: new Date(), paymentMethod: 'CASH', status: 'COMPLETED' })
        });
        setShowForm(false);
        fetchData();
    };

    if (loading) return <div className="p-8">Carregando financeiro...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Financeiro & Fluxo de Caixa</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                    <h3 className="text-gray-500 font-medium text-sm">Receita Total</h3>
                    <p className="text-3xl font-bold text-green-700">R$ {summary.income.toFixed(2)}</p>
                </div>
                <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                    <h3 className="text-gray-500 font-medium text-sm">Despesas</h3>
                    <p className="text-3xl font-bold text-red-700">R$ {summary.expense.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="text-gray-500 font-medium text-sm">Saldo Atual</h3>
                    <p className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                        R$ {summary.balance.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Transações Recentes</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                >
                    {showForm ? 'Cancelar' : '+ Nova Transação'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="bg-gray-100 p-4 rounded mb-6 flex gap-4 items-end">
                    <div>
                        <label className="block text-sm font-bold">Descrição</label>
                        <input className="border p-2 rounded" value={newTrans.description} onChange={e => setNewTrans({ ...newTrans, description: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold">Valor (R$)</label>
                        <input type="number" className="border p-2 rounded" value={newTrans.amount} onChange={e => setNewTrans({ ...newTrans, amount: parseFloat(e.target.value) })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold">Tipo</label>
                        <select className="border p-2 rounded w-32" value={newTrans.type} onChange={e => setNewTrans({ ...newTrans, type: e.target.value })}>
                            <option value="INCOME">Receita</option>
                            <option value="EXPENSE">Despesa</option>
                        </select>
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded">Salvar</button>
                </form>
            )}

            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-3 font-semibold">Data</th>
                            <th className="p-3 font-semibold">Descrição</th>
                            <th className="p-3 font-semibold">Categoria</th>
                            <th className="p-3 font-semibold text-right">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t: any) => (
                            <tr key={t.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="p-3 font-medium">{t.description}</td>
                                <td className="p-3 text-sm rounded bg-gray-100 w-min whitespace-nowrap px-2 py-1">{t.category}</td>
                                <td className={`p-3 font-bold text-right ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === 'INCOME' ? '+' : '-'} R$ {Number(t.amount).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
