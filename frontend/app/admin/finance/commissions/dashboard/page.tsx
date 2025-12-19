"use client";

import React, { useState } from 'react';
import {
    BanknotesIcon,
    ArrowTrendingUpIcon,
    CheckCircleIcon,
    ClockIcon,
    ChevronRightIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';

const MOCK_REPORT = {
    summary: {
        totalGenerated: 15400.00,
        totalPending: 4200.00,
        totalPaid: 11200.00
    },
    byProvider: [
        {
            providerId: '1',
            providerName: 'Dr. Gabriel Martins',
            totalAmount: 8500.00,
            pendingAmount: 2100.00,
            details: [
                { serviceName: 'Consulta', salePrice: 150, providerAmount: 100, status: 'PAID', createdAt: '2024-12-10' },
                { serviceName: 'Cirurgia', salePrice: 1500, providerAmount: 800, status: 'PENDING', createdAt: '2024-12-18' }
            ]
        },
        {
            providerId: '2',
            providerName: 'Dra. Ana Silva',
            totalAmount: 6900.00,
            pendingAmount: 2100.00,
            details: []
        }
    ]
};

export default function CommissionDashboardPage() {
    const [month, setMonth] = useState('2024-12');
    const [report, setReport] = useState(MOCK_REPORT);
    const [selectedProvider, setSelectedProvider] = useState<any>(null);

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BanknotesIcon className="h-8 w-8 text-indigo-600" />
                        Fechamento de Comissões
                    </h1>
                    <p className="text-gray-500 mt-1">Visualize e realize o pagamento de comissões para a equipe.</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                    <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                    <input
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="outline-none text-gray-700 font-medium"
                    />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-indigo-50 p-2 rounded-lg">
                            <ArrowTrendingUpIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase">Gerado no Mês</span>
                    </div>
                    <div className="text-3xl font-black text-gray-900">
                        R$ {report.summary.totalGenerated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm ring-1 ring-orange-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-50 p-2 rounded-lg">
                            <ClockIcon className="h-6 w-6 text-orange-600" />
                        </div>
                        <span className="text-xs font-bold text-orange-400 uppercase">Pendente de Pagamento</span>
                    </div>
                    <div className="text-3xl font-black text-orange-600">
                        R$ {report.summary.totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm ring-1 ring-emerald-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-emerald-50 p-2 rounded-lg">
                            <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
                        </div>
                        <span className="text-xs font-bold text-emerald-400 uppercase">Pago no Mês</span>
                    </div>
                    <div className="text-3xl font-black text-emerald-600">
                        R$ {report.summary.totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </div>

            {/* Main Content: Provider List & Details */}
            <div className="flex flex-col lg:flex-row gap-6 h-[600px]">

                {/* Provider List */}
                <div className="w-full lg:w-1/3 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700">
                        Profissionais
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {report.byProvider.map(provider => (
                            <div
                                key={provider.providerId}
                                onClick={() => setSelectedProvider(provider)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedProvider?.providerId === provider.providerId ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900">{provider.providerName}</h3>
                                    {provider.pendingAmount > 0 && (
                                        <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            PENDENTE
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-xs text-gray-500">
                                        Total: <span className="font-semibold text-gray-700">R$ {provider.totalAmount.toLocaleString('pt-BR')}</span>
                                    </div>
                                    <div className="text-sm font-bold text-indigo-600">
                                        A Pagar: R$ {provider.pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details View */}
                <div className="flex-1 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col">
                    {selectedProvider ? (
                        <>
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedProvider.providerName}</h2>
                                    <p className="text-sm text-gray-500">Detalhamento de serviços e comissões</p>
                                </div>
                                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
                                    Realizar Pagamento
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-0">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 sticky top-0">
                                        <tr>
                                            <th className="p-4">Data</th>
                                            <th className="p-4">Serviço</th>
                                            <th className="p-4">Valor Venda</th>
                                            <th className="p-4">Comissão</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedProvider.details.map((log: any, idx: number) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="p-4">{new Date(log.createdAt).toLocaleDateString('pt-BR')}</td>
                                                <td className="p-4 font-medium text-gray-900">{log.serviceName}</td>
                                                <td className="p-4">R$ {log.salePrice}</td>
                                                <td className="p-4 font-bold text-indigo-600">R$ {log.providerAmount}</td>
                                                <td className="p-4">
                                                    {log.status === 'PENDING' ? (
                                                        <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs font-bold">PENDENTE</span>
                                                    ) : (
                                                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">PAGO</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {selectedProvider.details.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-gray-400">
                                                    Nenhum registro encontrado para este período.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
                            <BanknotesIcon className="h-20 w-20 mb-4 opacity-20" />
                            <h3 className="text-lg font-medium text-gray-500">Selecione um profissional</h3>
                            <p className="max-w-xs mx-auto mt-2">Clique em um nome na lista ao lado para ver o extrato detalhado de comissões.</p>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}
