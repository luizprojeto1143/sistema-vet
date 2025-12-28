"use client";

import React, { useState } from 'react';
import { SparklesIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';

export default function RagChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: 'Olá! Li todo o histórico do Thor. Pode me perguntar qualquer coisa sobre exames passados ou tratamentos.' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { role: 'user', text: input }]);
        setInput('');

        // Mock AI Response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                text: '🔍 Encontrei no PDF de 12/08/2024: A Creatinina estava 1.8 mg/dL (Levemente aumentada). O Dr. Ricardo prescreveu ração Renal na época.'
            }]);
        }, 1500);
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform z-40"
            >
                <SparklesIcon className="w-7 h-7" />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden z-40 animate-in slide-in-from-bottom-10 fade-in">
                    <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                        <div className="font-bold flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5" /> AnalisaVet AI
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-indigo-200 text-xs">Fechar</button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-xl text-sm ${m.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none'
                                    }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            className="flex-1 bg-gray-100 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            placeholder="Ex: Qual foi o último hemograma?"
                        />
                        <button onClick={handleSend} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
