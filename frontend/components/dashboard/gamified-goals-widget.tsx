"use client";

import React, { useEffect, useState } from 'react';
import { TrophyIcon, FireIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

export default function GamifiedGoalsWidget() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/growth/goals`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="animate-pulse h-32 bg-gray-100 rounded-xl"></div>;
    if (!data) return null;

    return (
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>

            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-indigo-200 font-medium text-sm uppercase tracking-wider">Meta Diária</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-black">
                            {data.daily.percent}%
                        </span>
                        <span className="text-sm text-indigo-300">
                            (R$ {data.daily.current} / R$ {data.daily.target})
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                    <FireIcon className="w-5 h-5 text-orange-400 animate-pulse" />
                    <span className="font-bold text-sm">{data.streak} Dias seguidos!</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-4 bg-indigo-950/50 rounded-full overflow-hidden border border-indigo-700/50">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                    style={{ width: `${Math.min(data.daily.percent, 100)}%` }}
                >
                    {data.daily.percent >= 100 && (
                        <div className="absolute inset-0 animate-shimmer bg-white/20"></div>
                    )}
                </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <p className="text-xs text-indigo-300">
                    {data.daily.percent >= 100
                        ? '🚀 Parabéns! Meta batida!'
                        : `Faltam R$ ${(data.daily.target - data.daily.current).toFixed(2)} para bater a meta!`}
                </p>
                <TrophyIcon className={`w-8 h-8 ${data.daily.percent >= 100 ? 'text-yellow-400 animate-bounce' : 'text-indigo-900'}`} />
            </div>
        </div>
    );
}
