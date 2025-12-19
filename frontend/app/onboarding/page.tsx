"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    BuildingOffice2Icon,
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
    PhoneIcon,
    CheckCircleIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        clinicName: '',
        clinicPhone: '',
        ownerName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:4000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setStep(2); // Success step
                setTimeout(() => {
                    router.push('/admin'); // Redirect to tutorial or dashboard
                }, 3000);
            } else {
                const err = await res.json();
                setError(err.message || 'Falha ao registrar.');
            }
        } catch (err) {
            setError('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    if (step === 2) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-indigo-600 text-white p-8 text-center animate-fadeIn">
                <CheckCircleIcon className="h-24 w-24 mb-6 animate-bounce" />
                <h1 className="text-4xl font-bold mb-4">Bem-vindo à VetSaaS!</h1>
                <p className="text-xl text-indigo-100 max-w-lg">
                    Sua clínica foi criada com sucesso. Estamos preparando seu ambiente...
                </p>
                <div className="mt-8">
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="flex justify-center mb-4 text-indigo-600">
                    <SparklesIcon className="h-12 w-12" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">
                    Comece sua jornada
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Experimente grátis por 7 dias. Sem cartão de crédito.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-indigo-100 sm:rounded-2xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleRegister}>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700">Nome da Clínica</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BuildingOffice2Icon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="clinicName"
                                    required
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 outline-none border"
                                    placeholder="Ex: Clínica Veterinária PetLove"
                                    value={formData.clinicName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700">Telefone / WhatsApp</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="clinicPhone"
                                    required
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 outline-none border"
                                    placeholder="(11) 99999-9999"
                                    value={formData.clinicPhone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-4 pt-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Dados do Administrador</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Seu Nome Completo</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <UserIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            name="ownerName"
                                            required
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 outline-none border"
                                            placeholder="Dr(a). Ana Silva"
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Email Corporativo</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 outline-none border"
                                            placeholder="ana@clinica.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700">Senha</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                name="password"
                                                type="password"
                                                required
                                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 outline-none border"
                                                placeholder="******"
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700">Confirmar</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <input
                                                name="confirmPassword"
                                                type="password"
                                                required
                                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 sm:text-sm border-gray-300 rounded-lg p-2.5 outline-none border"
                                                placeholder="******"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Criando conta...' : 'Criar Conta Grátis'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Ao criar uma conta, você concorda com nossos <a href="#" className="font-bold text-indigo-600">Termos de Uso</a>.
                        </p>
                        <p className="mt-4 text-sm text-gray-600">
                            Já tem uma conta? <a href="/login" className="font-bold text-indigo-600 hover:text-indigo-500">Fazer Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
