"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ACTIONS = [
    { name: 'Ir para Dashboard', path: '/admin', shortcut: 'G+D' },
    { name: 'Nova Consulta', path: '/admin/agenda?new=true', shortcut: 'N+C' },
    { name: 'Buscar Tutor', path: '/admin/tutors', shortcut: 'S+T' },
    { name: 'Financeiro > DRE', path: '/admin/finance', shortcut: 'F+D' },
    { name: 'Estoque > Kits', path: '/admin/stock/kits', shortcut: 'E+K' },
    { name: 'Configurações', path: '/admin/settings', shortcut: 'G+S' },
    { name: 'Hospital Pulse', path: '/admin/pulse', shortcut: 'H+P' }
];

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const router = useRouter();

    // Toggle with CTRL+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const filteredActions = ACTIONS.filter(action =>
        action.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (path: string) => {
        router.push(path);
        setIsOpen(false);
        setQuery('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300 ring-1 ring-gray-900/5">
                <div className="flex items-center border-b border-gray-100 px-4">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        className="w-full px-4 py-4 text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent"
                        placeholder="O que você precisa? (Digite para buscar...)"
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">ESC</div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2 bg-gray-50/50">
                    {filteredActions.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            Nenhum resultado encontrado.
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredActions.map((action) => (
                                <button
                                    key={action.path}
                                    onClick={() => handleSelect(action.path)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white hover:shadow-sm rounded-lg group transition-all text-left"
                                >
                                    <span className="text-gray-700 font-medium group-hover:text-indigo-600">
                                        {action.name}
                                    </span>
                                    {action.shortcut && (
                                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-mono group-hover:bg-indigo-50 group-hover:text-indigo-500">
                                            {action.shortcut}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-[10px] text-gray-400">
                    <span>VETZ Command Center</span>
                    <span>Use ↑↓ para navegar (Em breve)</span>
                </div>
            </div>
        </div>
    );
}
