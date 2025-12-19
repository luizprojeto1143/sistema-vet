"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function TelemedicineRoom() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [roomUrl, setRoomUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initRoom = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/telemedicine/room', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ appointmentId: id })
                });

                if (res.status === 403) {
                    setError('Telemedicina não está habilitada para sua clínica.');
                    return;
                }

                if (res.ok) {
                    const data = await res.json();
                    setRoomUrl(data.url);
                } else {
                    setError('Erro ao iniciar sala de vídeo.');
                }
            } catch (err) {
                setError('Erro de conexão.');
            }
        };

        if (id) initRoom();
    }, [id]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <div className="bg-red-50 text-red-700 p-6 rounded-lg text-center shadow-sm">
                    <h2 className="text-xl font-bold mb-2">Acesso Negado</h2>
                    <p>{error}</p>
                    <button onClick={() => router.back()} className="mt-4 text-sm underline hover:text-red-900">
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    if (!roomUrl) {
        return <div className="flex h-screen items-center justify-center">Preparando Sala Segura...</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-black">
            <header className="flex justify-between items-center p-4 bg-gray-900 text-white">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                    <h1 className="font-bold">Telemedicina VetSystem</h1>
                </div>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    Encerrar Chamada
                </button>
            </header>

            <div className="flex-1 w-full bg-black relative">
                <iframe
                    src={`${roomUrl}#config.prejoinPageEnabled=false&userInfo.displayName="Veterinário"`}
                    allow="camera; microphone; fullscreen; display-capture"
                    className="w-full h-full border-0"
                />
            </div>
        </div>
    );
}
