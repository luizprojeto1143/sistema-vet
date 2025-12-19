"use client";

import React, { useEffect, useState } from 'react';
import {
    BanknotesIcon,
    UserIcon,
    ArrowsRightLeftIcon,
    BuildingStorefrontIcon,
    ServerStackIcon
} from '@heroicons/react/24/outline';

export default function SplitPaymentModal({ total, items, onClose, onConfirm }: any) {
    const [loading, setLoading] = useState(true);
    const [simulation, setSimulation] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSimulation();
    }, []);

    const fetchSimulation = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:4000/finance/pos/preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ amount: total, items: items })
            });
            if (!res.ok) throw new Error('Falha ao calcular split');
            const data = await res.json();
            setSimulation(data.splitDetails);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl animate-pulse flex flex-col items-center gap-3">
                <ArrowsRightLeftIcon className="h-10 w-10 text-indigo-500 animate-spin" />
                <p className="font-bold text-slate-600">Calculando Divisões...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl border-red-200 border text-center">
                <p className="text-red-500 font-bold mb-4">{error}</p>
                <button onClick={onClose} className="px-4 py-2 bg-slate-100 rounded-lg">Fechar</button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <ArrowsRightLeftIcon className="h-6 w-6" />
                        Repasse Automático
                    </h3>
                    <button onClick={onClose} className="hover:bg-indigo-500 p-1 rounded-full text-indigo-100">✕</button>
                </div>

                <div className="p-6">
                    <div className="bg-slate-50 p-4 rounded-xl mb-6 flex justify-between items-center border border-slate-200">
                        <span className="text-slate-500 font-medium">Valor Total</span>
                        <span className="text-2xl font-black text-slate-800">R$ {Number(simulation.total).toFixed(2)}</span>
                    </div>

                    <div className="space-y-3 mb-6">
                        {/* PLATFORM FEE */}
                        <div className="flex justify-between items-center p-3 border border-slate-100 rounded-lg bg-gray-50 shadow-sm opacity-75">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                                    <ServerStackIcon className="h-4 w-4 text-slate-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-700">Taxa de Serviço</div>
                                    <div className="text-[10px] text-slate-500">Plataforma ({simulation.platformRate}%)</div>
                                </div>
                            </div>
                            <div className="font-bold text-slate-600">- R$ {Number(simulation.platformFee).toFixed(2)}</div>
                        </div>

                        {/* PROVIDERS */}
                        {simulation.providers?.map((split: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center p-3 border border-orange-100 rounded-lg bg-orange-50 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center">
                                        <UserIcon className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-800">Profissional</div>
                                        <div className="text-[10px] text-orange-600">{split.reason}</div>
                                    </div>
                                </div>
                                <div className="font-bold text-orange-700">- R$ {Number(split.amount).toFixed(2)}</div>
                            </div>
                        ))}

                        {/* CLINIC NET */}
                        <div className="flex justify-between items-center p-3 border-t-2 border-indigo-100 bg-indigo-50/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <BuildingStorefrontIcon className="h-4 w-4 text-indigo-600" />
                                </div>
                                <div className="text-sm font-bold text-indigo-900">Saldo Líquido (Clínica)</div>
                            </div>
                            <div className="font-bold text-indigo-700 text-lg">R$ {Number(simulation.clinicNet).toFixed(2)}</div>
                        </div>
                    </div>

                    <button
                        onClick={() => onConfirm(simulation.providers)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
                    >
                        Confirmar e Gerar QR Code
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-2">
                        Os valores serão divididos automaticamente no momento do pagamento via Pix/Cartão.
                    </p>
                </div>
            </div>
        </div>
    );
}
