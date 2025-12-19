"use client";

import React, { useState } from 'react';
import {
    CreditCardIcon,
    QrCodeIcon,
    BanknotesIcon,
    DevicePhoneMobileIcon,
    WifiIcon
} from '@heroicons/react/24/outline';

export default function POSPage() {
    const [total, setTotal] = useState(150.00);
    const [method, setMethod] = useState('');
    const [isProcessingPoint, setIsProcessingPoint] = useState(false);

    const handlePointPayment = () => {
        setIsProcessingPoint(true);
        // Simulate API call to Terminal
        setTimeout(() => {
            setIsProcessingPoint(false);
            alert("Pagamento Aprovado na Maquininha! (Split 5% realizado)");
        }, 3000);
    };

    return (
        <div className="p-8 bg-gray-50 h-screen flex gap-8">

            {/* CART SUMMARY */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Resumo do Pedido</h2>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                            <div className="font-bold text-gray-700">Consulta Veterinária</div>
                            <div className="text-xs text-gray-400">Dr. Gabriel • Thor</div>
                        </div>
                        <div className="font-bold text-gray-900">R$ 150,00</div>
                    </div>
                </div>

                <div className="flex justify-between items-center text-2xl font-bold text-indigo-900 border-t border-gray-200 pt-4">
                    <span>Total a Pagar</span>
                    <span>R$ {total.toFixed(2)}</span>
                </div>
            </div>

            {/* PAYMENT METHODS */}
            <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Pagamento</h3>

                <div className="flex-1 space-y-3">

                    {/* OPTION 1: POINT SMART (INTEGRATED) */}
                    <button
                        onClick={handlePointPayment}
                        disabled={isProcessingPoint}
                        className="w-full p-4 rounded-xl border-2 border-indigo-100 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 transition-all text-left flex items-center gap-4 group"
                    >
                        <div className={`h-12 w-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center ${isProcessingPoint ? 'animate-pulse' : ''}`}>
                            <WifiIcon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-indigo-900">Maquininha (Point)</h4>
                            <p className="text-xs text-indigo-600">
                                {isProcessingPoint ? 'Aguardando senha...' : 'Enviar valor para terminal'}
                            </p>
                        </div>
                        {isProcessingPoint && (
                            <div className="h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        )}
                    </button>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase">Outros (Sem Split Automático)</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* OPTION 2: MANUAL (BOLETO LATER) */}
                    <button className="w-full p-3 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-3 opacity-60">
                        <BanknotesIcon className="h-5 w-5 text-gray-500" />
                        <span className="font-bold text-gray-600 text-sm">Dinheiro / Outra Máquina</span>
                    </button>

                    <button className="w-full p-3 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-3 opacity-60">
                        <QrCodeIcon className="h-5 w-5 text-gray-500" />
                        <span className="font-bold text-gray-600 text-sm">Pix (Chave da Clínica)</span>
                    </button>

                </div>

                <div className="mt-6 bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-xs text-yellow-800">
                    <strong>Nota:</strong> Pagamentos fora da Maquininha Integrada não geram split automático e serão cobrados na fatura mensal.
                </div>

            </div>

        </div>
    );
}
