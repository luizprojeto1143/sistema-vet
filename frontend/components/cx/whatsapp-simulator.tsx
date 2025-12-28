"use client";

import React, { useState } from 'react';
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

export default function CXSimulator() {
    const [messages, setMessages] = useState<any[]>([]);

    const triggerMessage = (type: string) => {
        const newMessage = {
            id: Date.now(),
            type,
            text: type === 'VACCINE'
                ? "Olá! Passando para lembrar que o reforço da V10 do Thor vence amanhã. Vamos agendar?"
                : "Oi! Como o Bob está se sentindo após a cirurgia? Responda 1 para Bem, 2 para Mal.",
            status: 'SENDING'
        };
        setMessages([...messages, newMessage]);

        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'SENT' } : m));
        }, 1500);

        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'READ' } : m));
        }, 3000);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-500" />
                Régua de Relacionamento (CX Simulator)
            </h3>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => triggerMessage('VACCINE')}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
                >
                    Simular: Lembrete Vacina
                </button>
                <button
                    onClick={() => triggerMessage('NPS')}
                    className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-bold hover:bg-purple-100 transition-colors"
                >
                    Simular: Pós-Cirúrgico (NPS)
                </button>
            </div>

            <div className="space-y-3">
                {messages.map(m => (
                    <div key={m.id} className="flex flex-col animate-slide-in-right">
                        <div className="bg-green-100 p-3 rounded-tr-xl rounded-tl-xl rounded-bl-xl self-end max-w-[80%] text-sm text-gray-800 relative">
                            {m.text}
                            <div className="absolute -bottom-4 right-0 text-[10px] text-gray-400 flex items-center gap-1">
                                {m.status === 'SENDING' && 'Enviando...'}
                                {m.status === 'SENT' && <span className="text-gray-400">✓ Entregue</span>}
                                {m.status === 'READ' && <span className="text-blue-500 font-bold">✓✓ Lido</span>}
                            </div>
                        </div>
                    </div>
                ))}
                {messages.length === 0 && <p className="text-xs text-gray-400 text-center italic">Nenhuma mensagem disparada hoje.</p>}
            </div>
        </div>
    );
}
