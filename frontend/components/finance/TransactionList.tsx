import React from 'react';
import { Edit2, Trash2, FileText, CheckCircle, Clock } from 'lucide-react';

interface Transaction {
    id: string;
    description: string;
    category: string;
    date: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    status: 'PAID' | 'PENDING' | 'OVERDUE';
    paymentMethod: string;
}

interface TransactionListProps {
    transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={12} /> Pago</span>;
            case 'PENDING': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12} /> Pendente</span>;
            case 'OVERDUE': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12} /> Atrasado</span>;
            default: return null;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-lg">Últimos Lançamentos</h3>
                <div className="flex gap-2">
                    <button className="text-sm text-gray-500 hover:text-teal-600 font-medium">Ver Todos</button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Descrição</th>
                            <th className="px-6 py-4">Categoria</th>
                            <th className="px-6 py-4">Data</th>
                            <th className="px-6 py-4">Valor</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">{tx.description}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{tx.category}</span>
                                </td>
                                <td className="px-6 py-4">{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                                <td className={`px-6 py-4 font-bold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.type === 'INCOME' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">{getStatusBadge(tx.status)}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
