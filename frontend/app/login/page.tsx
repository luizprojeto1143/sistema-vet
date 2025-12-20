"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    EnvelopeIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Use environment variable in production
            const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '';

            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();

                // Securely store token (HttpOnly cookie is better, but localStorage for MVP)
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirect based on Role
                if (data.user.role === 'TUTOR') {
                    router.push('/tutor/home');
                } else if (data.user.role === 'MASTER') {
                    router.push('/saas');
                } else {
                    router.push('/admin'); // Default for Vets/Admin
                }
            } else {
                const errData = await res.json().catch(() => ({}));
                console.error("Login Error Data:", errData); // Debug log for user

                // Safely extract message, handling objects or arrays
                let errorMessage = 'Credenciais inválidas. Tente novamente.';

                if (errData.error && typeof errData.error === 'string') {
                    errorMessage = errData.error;
                } else if (errData.message) {
                    errorMessage = typeof errData.message === 'string'
                        ? errData.message
                        : JSON.stringify(errData.message);
                } else if (errData.details) {
                    errorMessage = JSON.stringify(errData.details);
                }

                setError(errorMessage);
            }
        } catch (err) {
            setError('Erro de conexão. Verifique sua internet ou contate o suporte.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full h-screen bg-brand-50">

            {/* Left Side - Hero / Brand */}
            <div className="hidden lg:flex w-1/2 bg-brand-500 relative overflow-hidden items-center justify-center p-12 rounded-r-[3rem] shadow-2xl z-10">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-400 to-brand-600 z-0"></div>

                <div className="relative z-10 text-center text-white max-w-lg">
                    <div className="mb-8 relative w-96 h-96 mx-auto rounded-[2rem] overflow-hidden shadow-2xl shadow-brand-900/30 border-8 border-white/30 transform hover:scale-105 transition-transform duration-500">
                        <Image
                            src="/login-mascot.png"
                            alt="Cute Vet Mascot"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <h1 className="text-5xl font-extrabold mb-4 font-sans tracking-tight drop-shadow-sm">VETZ</h1>
                    <p className="text-brand-100 text-xl font-medium leading-relaxed">
                        Cuidando com carinho de quem você ama. 🐾
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 animated-fadeIn bg-white/50 backdrop-blur-sm">
                <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-brand-100">

                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-3xl">👋</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Oie! Bem-vindo!</h2>
                        <p className="mt-2 text-gray-500 font-medium">
                            Entre para cuidar dos bichinhos.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl animate-shake">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-bold text-red-800">Ops! Algo deu errado.</h3>
                                    <div className="text-sm text-red-600 mt-1 font-medium">{error}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700 ml-1">Email</label>
                                <div className="mt-1 relative rounded-2xl shadow-sm group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <EnvelopeIcon className="h-5 w-5 text-brand-300 group-focus-within:text-brand-500 transition-colors" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="focus:ring-2 focus:ring-brand-400 focus:border-brand-400 block w-full pl-12 sm:text-sm border-gray-200 rounded-2xl p-4 outline-none border transition-all bg-gray-50 focus:bg-white"
                                        placeholder="doutor@petfeliz.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center ml-1">
                                    <label htmlFor="password" className="block text-sm font-bold text-gray-700">Senha</label>
                                    <a href="#" className="text-xs font-bold text-brand-500 hover:text-brand-600">Esqueceu?</a>
                                </div>
                                <div className="mt-1 relative rounded-2xl shadow-sm group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-brand-300 group-focus-within:text-brand-500 transition-colors" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        className="focus:ring-2 focus:ring-brand-400 focus:border-brand-400 block w-full pl-12 pr-12 sm:text-sm border-gray-200 rounded-2xl p-4 outline-none border transition-all bg-gray-50 focus:bg-white"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-brand-500 transition-colors" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-brand-500 transition-colors" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-bold rounded-full text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-200 shadow-xl shadow-brand-500/30 transform hover:-translate-y-1 transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Entrando...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Entrar
                                        <ArrowRightIcon className="h-5 w-5 text-brand-100 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            Novo por aqui? <a href="/onboarding" className="font-bold text-brand-500 hover:text-brand-600 underline decoration-2 decoration-brand-200 underline-offset-2">Crie sua conta grátis</a>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
