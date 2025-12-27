"use client";

import React, { useState, useEffect } from 'react';
import { XMarkIcon, BoltIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ServiceSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (service: any) => void;
}

export default function ServiceSelectionModal({ isOpen, onClose, onConfirm }: ServiceSelectionModalProps) {
    const [services, setServices] = useState<any[]>([]);
    const [filteredServices, setFilteredServices] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchServices();
        }
    }, [isOpen]);

    useEffect(() => {
        if (search) {
            setFilteredServices(services.filter(s => s.name.toLowerCase().includes(search.toLowerCase())));
        } else {
            setFilteredServices(services);
        }
    }, [search, services]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/clinic/services`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setServices(data || []);
                setFilteredServices(data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
                    <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                        <BoltIcon className="w-5 h-5" /> Adicionar Serviço
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-indigo-100 rounded-full text-indigo-700">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Buscar serviço..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {loading ? (
                        <div className="text-center py-8 text-gray-400">Carregando serviços...</div>
                    ) : filteredServices.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">Nenhum serviço encontrado.</div>
                    ) : (
                        <div className="space-y-1">
                            {filteredServices.map(service => (
                                <button
                                    key={service.id}
                                    onClick={() => onConfirm(service)}
                                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex justify-between items-center group transition-colors"
                                >
                                    <div>
                                        <div className="font-bold text-gray-800">{service.name}</div>
                                        <div className="text-xs text-gray-500">{service.durationMin} min</div>
                                    </div>
                                    <div className="font-bold text-indigo-600 group-hover:scale-105 transition-transform">
                                        R$ {Number(service.price).toFixed(2)}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
