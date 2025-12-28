"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { StarIcon, CurrencyDollarIcon, UserIcon } from '@heroicons/react/24/solid';

// Mock Data for MVP
const MOCK_TUTOR = {
    id: '1',
    name: 'João da Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    totalSpent: 12500.00,
    pets: [
        { name: 'Thor', species: 'Cachorro', breed: 'Golden' },
        { name: 'Mia', species: 'Gato', breed: 'SRD' }
    ]
};

export default function TutorProfilePage() {
    const params = useParams();
    // In real app, fetch tutor by params.id
    const tutor = MOCK_TUTOR;

    const getLeadScore = (spent: number) => {
        if (spent > 10000) return { label: 'DIAMANTE', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '💎' };
        if (spent > 5000) return { label: 'OURO', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '🏆' };
        return { label: 'PRATA', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '🥈' };
    };

    const score = getLeadScore(tutor.totalSpent);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center text-3xl">
                        👤
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            {tutor.name}
                            <span className={`text-xs px-2 py-1 rounded-full border ${score.color} font-bold flex items-center gap-1`}>
                                {score.icon} {score.label}
                            </span>
                        </h1>
                        <p className="text-gray-500 text-sm flex gap-4 mt-1">
                            <span>📧 {tutor.email}</span>
                            <span>📱 {tutor.phone}</span>
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">LTV (Total Gasto)</div>
                    <div className="text-2xl font-bold text-brand-600">R$ {tutor.totalSpent.toLocaleString('pt-BR')}</div>
                </div>
            </div>

            {/* Pets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        🐾 Meus Pets
                    </h2>
                    <div className="space-y-3">
                        {tutor.pets.map((pet, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="font-medium text-gray-700">{pet.name}</div>
                                <div className="text-sm text-gray-500">{pet.species} • {pet.breed}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        📊 Insights de Vendas
                    </h2>
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-sm text-indigo-800">
                        💡 <strong>Sugestão de Upsell:</strong> O Thor está com as vacinas em dia, mas não comprou Antipulgas nos últimos 3 meses. Ofereça um Bravecto!
                    </div>
                </div>
            </div>
        </div>
    );
}
