"use client";
import React, { useEffect, useState } from 'react';
import {
    GiftIcon,
    ShareIcon,
    ClipboardDocumentIcon,
    UserGroupIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

export default function InvitePage() {
    const [referralData, setReferralData] = useState<any>(null);
    const [stats, setStats] = useState<any>({ invitedCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const token = localStorage.getItem('token');

        try {
            const [resCode, resStats] = await Promise.all([
                fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/growth/referral-code', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/growth/stats', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (resCode.ok) setReferralData(await resCode.json());
            if (resStats.ok) setStats(await resStats.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        if (!referralData) return;
        const text = `Oi! Use meu código ${referralData.code} no VetApp e ganhe descontaços! 🐶🐱 ${referralData.url}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const handleCopy = () => {
        if (referralData?.code) {
            navigator.clipboard.writeText(referralData.code);
            alert('Código copiado!');
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-400">Carregando recompensas...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-500 to-purple-600 pb-20 text-white">
            <div className="p-6 pt-10 text-center">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <GiftIcon className="h-10 w-10 text-yellow-300" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Indique e Ganhe</h1>
                <p className="text-indigo-100 text-sm max-w-xs mx-auto">
                    Convide amigos para cuidar dos pets deles e ganhe descontos nas próximas vacinas!
                </p>
            </div>

            <div className="bg-white rounded-t-3xl min-h-[60vh] p-6 text-gray-800">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8 -mt-12">
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-indigo-50 text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Amigos</p>
                        <p className="text-3xl font-bold text-indigo-600">{stats.invitedCount}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-indigo-50 text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Ganhos</p>
                        <p className="text-3xl font-bold text-green-500">R$ 0</p>
                    </div>
                </div>

                {/* Code Card */}
                <div className="bg-gray-50 border-2 border-dashed border-indigo-200 rounded-xl p-6 mb-6 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <SparklesIcon className="h-24 w-24 text-indigo-600" />
                    </div>

                    <p className="text-sm font-bold text-gray-500 mb-2">SEU CÓDIGO EXCLUSIVO</p>
                    <div
                        onClick={handleCopy}
                        className="bg-white border border-gray-200 py-3 px-6 rounded-lg text-2xl font-mono font-bold tracking-widest text-indigo-700 cursor-pointer hover:scale-105 transition-transform shadow-sm"
                    >
                        {referralData?.code || '...'}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1 cursor-pointer hover:text-indigo-600" onClick={handleCopy}>
                        <ClipboardDocumentIcon className="h-3 w-3" /> Toque para copiar
                    </p>
                </div>

                {/* Action */}
                <button
                    onClick={handleShare}
                    className="w-full bg-green-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition-all flex items-center justify-center gap-2 mb-4"
                >
                    <ShareIcon className="h-6 w-6" />
                    Enviar no WhatsApp
                </button>

                <div className="bg-indigo-50 p-4 rounded-xl flex items-start gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm text-indigo-600">
                        <UserGroupIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-indigo-900">Como funciona?</h4>
                        <p className="text-xs text-indigo-700 mt-1">
                            Seu amigo ganha <span className="font-bold">10% OFF</span> na primeira consulta e você ganha <span className="font-bold">R$ 20</span> em créditos!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
