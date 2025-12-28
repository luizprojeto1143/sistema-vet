"use client";

import React, { useEffect, useState } from 'react';
import { LightBulbIcon, PlusCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface Suggestion {
    id: string;
    name: string;
    type: 'PRODUCT' | 'SERVICE';
    reason: string;
    price: number;
    script?: string;
}

interface Props {
    items: string[];
    onAddItem: (item: Suggestion) => void;
}

export default function UpsellWidget({ items, onAddItem }: Props) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (items.length > 0) {
            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [items]); // Re-fetch when items change

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sales/suggestions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items, species: 'DOG' }) // Mock species for now
            });
            if (res.ok) {
                const data = await res.json();
                // Filter out suggestions already in the list to avoid duplicates
                const newSuggestions = data.filter((s: Suggestion) =>
                    !items.some(i => i.toLowerCase() === s.name.toLowerCase())
                );
                setSuggestions(newSuggestions);
            }
        } catch (error) {
            console.error("Failed to fetch upsell suggestions", error);
        } finally {
            setLoading(false);
        }
    };

    if (suggestions.length === 0) return null;

    return (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 mb-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-amber-100 rounded-full text-amber-600">
                    <SparklesIcon className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                    <h4 className="font-bold text-amber-900 text-sm">Oportunidades Identificadas</h4>
                    <p className="text-xs text-amber-700">Sugestões baseadas no tratamento atual.</p>
                </div>
            </div>

            <div className="space-y-2">
                {suggestions.map((s) => (
                    <div key={s.id} className="flex items-center justify-between bg-white/60 p-2 rounded-lg border border-amber-100/50 hover:bg-white transition-colors">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800">{s.name}</span>
                            <p className="text-xs text-gray-500 mt-1">{s.reason}</p>

                            {/* Sales Script (The "Script" Context) */}
                            {s.script && (
                                <div className="mt-2 bg-yellow-50 p-2 rounded border border-yellow-100 text-[10px] text-yellow-800 italic">
                                    <span className="font-bold not-italic">💬 Fale:</span> "{s.script}"
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-600">R$ {s.price.toFixed(2)}</span>
                            <button
                                onClick={() => onAddItem(s)}
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-1 rounded-full transition-colors"
                                title="Adicionar ao Atendimento"
                            >
                                <PlusCircleIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
