import React, { useState } from 'react';
import { MoreVertical, Search, Filter, Stethoscope, Syringe, Scissors, Sparkles, Activity, Clock, Tag } from 'lucide-react';
import Link from 'next/link';

interface Service {
    id: string;
    name: string;
    category: string;
    duration: number; // minutes
    price: number;
    active: boolean;
}

const MOCK_SERVICES: Service[] = [
    { id: '1', name: 'Consulta Clínica', category: 'Consultas', duration: 60, price: 150.00, active: true },
    { id: '2', name: 'Vacina V10 (Importada)', category: 'Vacinas', duration: 30, price: 85.00, active: true },
    { id: '3', name: 'Castração Felina (Macho)', category: 'Cirurgias', duration: 90, price: 350.00, active: true },
    { id: '4', name: 'Limpeza de Tártaro', category: 'Odontologia', duration: 120, price: 450.00, active: true },
    { id: '5', name: 'Ultrassom Abdominal', category: 'Exames', duration: 45, price: 180.00, active: true },
];

export default function ServiceList() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredServices = MOCK_SERVICES.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getIcon = (category: string) => {
        switch (category) {
            case 'Consultas': return <Stethoscope size={18} className="text-blue-500" />;
            case 'Vacinas': return <Syringe size={18} className="text-green-500" />;
            case 'Cirurgias': return <Scissors size={18} className="text-red-500" />;
            case 'Odontologia': return <Sparkles size={18} className="text-purple-500" />;
            default: return <Activity size={18} className="text-orange-500" />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 flex flex-col gap-3 bg-gray-50">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Catálogo de Serviços</h3>
                </div>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar serviço..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Filter button can be functional later */}
                    <button className="p-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100">
                        <Filter size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px]">
                {filteredServices.length > 0 ? (
                    <ul className="divide-y divide-gray-50">
                        {filteredServices.map((service) => (
                            <li key={service.id} className="p-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                                            {getIcon(service.category)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm">{service.name}</h4>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Tag size={10} /> {service.category}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="text-gray-300 hover:text-gray-600">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                                <div className="mt-2 flex justify-between items-center pl-[44px]">
                                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                                        <Clock size={10} /> {service.duration} min
                                    </span>
                                    <span className="font-bold text-teal-600 text-sm">R$ {service.price.toFixed(2)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-8 text-center text-gray-400 text-sm">
                        Nenhum serviço encontrado.
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-gray-100 text-center bg-gray-50">
                <Link href="/admin/services" className="text-sm text-teal-600 font-bold hover:underline block w-full py-1">
                    Ver todos os serviços
                </Link>
            </div>
        </div>
    );
}
