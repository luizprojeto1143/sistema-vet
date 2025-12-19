"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);

    // Auto-advance frames for demo effect, or manual? 
    // Manual swipe is better for onboarding usually, but storyboard implied a "video-like" flow (20-30s).
    // Let's make it auto-advance every 4s but allow skip.
    useEffect(() => {
        const timer = setInterval(() => {
            setStep(s => (s < 5 ? s + 1 : 5));
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const frames = [
        {
            color: 'bg-teal-500',
            icon: '🐾',
            title: 'Cuidar do seu pet ficou mais fácil.',
            desc: 'Seu pet, sua clínica, tudo em um só lugar.',
            anim: 'animate-bounce'
        },
        {
            color: 'bg-blue-500',
            icon: '📝',
            title: 'Cadastro Simples',
            desc: 'Cadastre você e seu pet em poucos segundos.',
            anim: 'animate-pulse'
        },
        {
            color: 'bg-indigo-500',
            icon: '📅',
            title: 'Agende Fácil',
            desc: 'Marque consultas, vacinas e banhos quando quiser.',
            anim: 'animate-spin-slow' // custom class or replacement
        },
        {
            color: 'bg-pink-500',
            icon: '❤️',
            title: 'Acompanhe Tudo',
            desc: 'Siga a internação e o atendimento em tempo real.',
            anim: 'animate-pulse'
        },
        {
            color: 'bg-purple-500',
            icon: '📄',
            title: 'Exames e Receitas',
            desc: 'Receba documentos e resultados na palma da mão.',
            anim: 'animate-bounce'
        },
        {
            color: 'bg-green-600',
            icon: '🚀',
            title: 'Tudo pronto?',
            desc: 'Tudo sobre seu pet, na palma da mão.',
            isFinal: true
        }
    ];

    return (
        <div className={`h-screen w-full flex flex-col items-center justify-center transition-colors duration-1000 ${frames[step].color} text-white`}>

            {/* Animation Stage */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md">
                <div className={`text-9xl mb-8 transition-transform duration-500 ${frames[step].anim || ''} transform hover:scale-110`}>
                    {frames[step].icon}
                </div>

                <h1 className="text-3xl font-bold mb-4 animate-fade-in-up">
                    {frames[step].title}
                </h1>

                <p className="text-xl opacity-90 animate-fade-in-up delay-100">
                    {frames[step].desc}
                </p>
            </div>

            {/* Controls */}
            <div className="p-8 w-full max-w-md flex flex-col gap-4">
                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mb-4">
                    {frames.map((_, i) => (
                        <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
                    ))}
                </div>

                {frames[step].isFinal ? (
                    <button
                        onClick={() => router.push('/tutor/login')} // Assuming login route
                        className="w-full bg-white text-gray-900 font-bold py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
                    >
                        COMEÇAR
                    </button>
                ) : (
                    <div className="flex justify-between w-full">
                        <button onClick={() => setStep(5)} className="text-white/70 text-sm font-semibold">Pular</button>
                        <button onClick={() => setStep(s => s + 1)} className="text-white font-bold">Próximo ➡️</button>
                    </div>
                )}
            </div>
        </div>
    );
}
