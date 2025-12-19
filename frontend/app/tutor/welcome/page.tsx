"use client";

import React, { useState } from 'react';
import {
    QrCodeIcon,
    BuildingStorefrontIcon,
    MagnifyingGlassIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function AppOnboarding() {
    const [step, setStep] = useState('SEARCH'); // SEARCH, RESULTS, CODE
    const [cpf, setCpf] = useState('');

    const MOCK_FOUND_CLINICS = [
        { id: 1, name: 'Clínica Veterinária São Francisco', pet: 'Thor (Golden)', lastBranch: 'Moema' },
        { id: 2, name: 'Hospital PetCare 24h', pet: 'Thor (Golden)', lastBranch: 'Morumbi' },
    ];

    return (
        <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center p-6 text-white text-center">

            {/* LOGO AREA */}
            <div className="mb-10 animate-bounce">
                <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md inline-block">
                    <span className="text-4xl">🐾</span>
                </div>
                <h1 className="text-2xl font-bold mt-4 tracking-tight">VetSystem <span className="font-normal opacity-80">App</span></h1>
                <p className="text-indigo-200 text-sm">Seu pet conectado à sua clínica.</p>
            </div>

            {step === 'SEARCH' && (
                <div className="w-full max-w-sm bg-white text-gray-800 rounded-2xl p-6 shadow-2xl animate-fadeIn">
                    <h2 className="font-bold text-lg mb-2 text-indigo-900">Vamos começar?</h2>
                    <p className="text-gray-500 text-sm mb-6">Digite seu CPF para localizarmos seus pets.</p>

                    <input
                        type="text"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-center font-bold text-lg mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />

                    <button
                        onClick={() => setStep('RESULTS')}
                        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        <MagnifyingGlassIcon className="h-5 w-5" />
                        Buscar Cadastros
                    </button>

                    <div className="mt-6 border-t border-gray-100 pt-6">
                        <button
                            onClick={() => setStep('CODE')}
                            className="text-indigo-600 text-xs font-bold hover:underline flex items-center justify-center gap-1 w-full"
                        >
                            <QrCodeIcon className="h-4 w-4" />
                            Tenho um Código ou QR Code
                        </button>
                    </div>
                </div>
            )}

            {step === 'RESULTS' && (
                <div className="w-full max-w-sm animate-fadeIn">
                    <p className="text-indigo-100 text-sm mb-4 font-bold">Encontramos você nestas clínicas:</p>

                    <div className="space-y-4">
                        {MOCK_FOUND_CLINICS.map(clinic => (
                            <button
                                key={clinic.id}
                                className="w-full bg-white text-left p-4 rounded-xl shadow-lg hover:bg-indigo-50 transition-colors group relative overflow-hidden"
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                        <BuildingStorefrontIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 leading-tight">{clinic.name}</h3>
                                        <p className="text-xs text-gray-500">Paciente: <strong className="text-indigo-600">{clinic.pet}</strong></p>
                                    </div>
                                    <ChevronRightIcon className="h-5 w-5 text-gray-300 ml-auto group-hover:text-indigo-500" />
                                </div>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setStep('CODE')}
                        className="mt-8 text-indigo-200 text-sm hover:text-white underline"
                    >
                        Não encontrou sua clínica?
                    </button>
                </div>
            )}

            {step === 'CODE' && (
                <div className="w-full max-w-sm bg-white text-gray-800 rounded-2xl p-6 shadow-2xl animate-rotateIn">
                    <div onClick={() => setStep('SEARCH')} className="cursor-pointer mb-4 text-left text-gray-400 hover:text-gray-600">← Voltar</div>
                    <h2 className="font-bold text-lg mb-2 text-indigo-900">Vincular Manualmente</h2>
                    <p className="text-gray-500 text-sm mb-6">Peça o "Token do App" na recepção da sua clínica.</p>

                    <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="w-10 h-12 border-2 border-gray-200 rounded-lg flex items-center justify-center text-xl font-bold text-gray-400 bg-gray-50">
                                -
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center p-4 border-2 border-dashed border-indigo-100 rounded-xl bg-indigo-50 text-indigo-600 mb-4 cursor-pointer hover:bg-indigo-100 transition-colors">
                        <QrCodeIcon className="h-8 w-8" />
                        <span className="ml-2 font-bold text-sm">Ler QR Code da Balcão</span>
                    </div>

                    <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black shadow-lg">
                        Entrar
                    </button>
                </div>
            )}

        </div>
    );
}
