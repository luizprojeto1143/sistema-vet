```javascript
"use client";

import React, { useState, useEffect } from 'react';
import NewTutorModal from '@/components/admin/tutors/NewTutorModal';
import {
    Users,
    Search,
    Plus,
    ArrowRight,
    Phone,
    Mail
} from 'lucide-react';

export default function AdminTutorsPage() {
    const [tutors, setTutors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchTutors();
    }, []);

    const fetchTutors = async (search?: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = search
                ? `${ process.env.NEXT_PUBLIC_API_URL } /tutors/search ? q = ${ search } `
                : `${ process.env.NEXT_PUBLIC_API_URL }/tutors`;

const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
});

if (res.ok) {
    setTutors(await res.json());
}
        } catch (error) {
    console.error("Failed to fetch tutors", error);
} finally {
    setLoading(false);
}
    };

const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTutors(searchTerm);
};

return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
        <NewTutorModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => fetchTutors()}
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="h-8 w-8 text-teal-600" />
                    Gestão de Tutores
                </h1>
                <p className="text-gray-500 mt-1">Base de clientes e seus pets</p>
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-sm font-bold"
            >
                <Plus size={20} />
                Novo Tutor
            </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    placeholder="Buscar por nome, CPF ou telefone..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <button type="submit" className="hidden">Buscar</button>
            </form>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
                <div className="p-10 text-center text-gray-500">Carregando tutores...</div>
            ) : tutors.length === 0 ? (
                <div className="p-10 text-center text-gray-500">Nenhum tutor encontrado.</div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {tutors.map((tutor) => (
                        <div key={tutor.id} className="p-6 hover:bg-gray-50 transition-colors group flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg text-gray-800">{tutor.fullName}</h3>
                                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-100 font-bold">
                                        {tutor.pets?.length || 0} Pets
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                                    {tutor.phone && (
                                        <div className="flex items-center gap-1">
                                            <Phone size={14} />
                                            <span>{tutor.phone}</span>
                                        </div>
                                    )}
                                    {tutor.email && (
                                        <div className="flex items-center gap-1">
                                            <Mail size={14} />
                                            <span>{tutor.email}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Mini Pets List */}
                                {tutor.pets && tutor.pets.length > 0 && (
                                    <div className="flex gap-2 mt-3">
                                        {tutor.pets.map((pet: any) => (
                                            <span key={pet.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200 flex items-center gap-1">
                                                {pet.species === 'DOG' ? '🐶' : pet.species === 'CAT' ? '🐱' : '🐾'} {pet.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button className="text-teal-600 font-bold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Ver Detalhes <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);
}
