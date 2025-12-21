import React, { useState } from 'react';
import { Dog, Home, Plus, Trash2 } from 'lucide-react';

interface InternmentMapProps {
    wards: any[]; // Array of Wards with Boxes
}

export default function InternmentMap({ wards }: InternmentMapProps) {
    const [activeWardId, setActiveWardId] = useState(wards[0]?.id);

    const activeWard = wards.find(w => w.id === activeWardId) || wards[0];

    if (!wards || wards.length === 0) return <div className="p-4 text-gray-500">Nenhuma ala de internação configurada.</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header / Tabs */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 pt-4 flex gap-2 overflow-x-auto">
                {wards.map(ward => (
                    <button
                        key={ward.id}
                        onClick={() => setActiveWardId(ward.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeWardId === ward.id
                                ? 'bg-white text-teal-600 border-t-2 border-teal-500 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {ward.name}
                    </button>
                ))}
            </div>

            {/* Map Content */}
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-700">{activeWard?.name}</h3>
                    <div className="flex gap-3 text-xs">
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 border border-green-300 rounded-full"></div> Livre</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-100 border border-red-300 rounded-full"></div> Ocupado</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded-full"></div> Limpeza</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {activeWard?.boxes?.map((box: any) => {
                        const isOccupied = box.status === 'OCCUPIED';
                        const isCleaning = box.status === 'CLEANING';

                        let bgClass = 'bg-green-50 border-green-200 hover:bg-green-100';
                        let textClass = 'text-green-700';

                        if (isOccupied) {
                            bgClass = 'bg-red-50 border-red-200 hover:bg-red-100';
                            textClass = 'text-red-700';
                        } else if (isCleaning) {
                            bgClass = 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
                            textClass = 'text-yellow-700';
                        }

                        return (
                            <div key={box.id} className={`border rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${bgClass}`}>
                                <span className={`text-xs font-bold uppercase ${textClass}`}>{box.name}</span>

                                {isOccupied ? (
                                    <div className="text-center">
                                        <div className="w-10 h-10 bg-white rounded-full mx-auto mb-1 flex items-center justify-center text-lg shadow-sm text-teal-600">
                                            <Dog size={20} />
                                        </div>
                                        <p className="text-xs font-bold text-gray-800 truncate w-24">{box.internments?.[0]?.pet?.name || 'Paciente'}</p>
                                        <p className="text-[10px] text-gray-500">{box.internments?.[0]?.tutor?.fullName?.split(' ')[0] || 'Tutor'}</p>
                                    </div>
                                ) : (
                                    <div className="text-2xl opacity-30 text-gray-400">
                                        <Home size={24} />
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Add Box Button (Mock) */}
                    <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 text-gray-400">
                        <Plus size={24} />
                        <span className="text-xs">Adicionar Box</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
