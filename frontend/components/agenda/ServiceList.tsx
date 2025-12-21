import React from 'react';
import { MoreVertical, Search, Filter } from 'lucide-react';

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
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800">Catálogo de Serviços</h3>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar serviço..."
                            className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none w-48"
                        />
                    </div>
                    <button className="p-1.5 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                        <Filter size={16} />
                    </button>
                </div>
            </div>

            <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-3">Nome do Serviço</th>
                        <th className="px-6 py-3">Categoria</th>
                        <th className="px-6 py-3">Duração</th>
                        <th className="px-6 py-3">Preço</th>
                        <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {MOCK_SERVICES.map((service) => (
                        <tr key={service.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-3 font-medium text-gray-800">{service.name}</td>
                            <td className="px-6 py-3">
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{service.category}</span>
                            </td>
                            <td className="px-6 py-3">{service.duration} min</td>
                            <td className="px-6 py-3 font-bold text-teal-600">R$ {service.price.toFixed(2)}</td>
                            <td className="px-6 py-3 text-right">
                                <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200">
                                    <MoreVertical size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="p-3 border-t border-gray-100 text-center">
                <button className="text-sm text-teal-600 font-medium hover:underline">Ver todos os serviços</button>
            </div>
        </div>
    );
}
