"use client";

import React, { useState } from 'react';
import {
    CheckCircleIcon,
    ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

export default function MPConnectButton({ isConnected = false }: { isConnected?: boolean }) {
    const handleConnect = () => {
        // 1. Redirect to Backend Endpoint that initiates OAuth
        // 2. Backend redirects to Mercado Pago
        // 3. User approves
        // 4. MP redirects back to us with the CODE
        // 5. We exchange CODE for TOKEN and save to Clinic Schema
        window.location.href = "https://api.vetsystem.com/finance/mp-connect";
    };

    if (isConnected) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-full">
                        <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">Conectado ao Mercado Pago</h4>
                        <p className="text-sm text-gray-500">Sua conta está pronta para receber pagamentos.</p>
                    </div>
                </div>
                <button className="text-xs text-red-500 hover:underline font-bold">Desconectar</button>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
                <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icon-1024.png" alt="MP Logo" className="h-10 w-10" />
                <div>
                    <h4 className="font-bold text-gray-800">Configurar Recebimentos</h4>
                    <p className="text-sm text-gray-500">Conecte sua conta Mercado Pago para receber dos clientes.</p>
                </div>
            </div>

            <button
                onClick={handleConnect}
                className="w-full bg-[#009EE3] text-white font-bold py-3 rounded-lg hover:bg-[#008CC9] shadow transition-colors flex items-center justify-center gap-2"
            >
                Conectar minha conta Mercado Pago
                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
            </button>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
                Você será redirecionado para autorizar o VetSystem a processar pagamentos.
            </p>
        </div>
    );
}
