"use client";

import React, { useState } from 'react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

const MOCK_BEDS = [
    { id: '101', name: 'Canil 01 (Atual)', status: 'CURRENT' },
    { id: '102', name: 'Canil 02', status: 'OCCUPIED' },
    { id: '103', name: 'Canil 03', status: 'AVAILABLE' },
    { id: '201', name: 'Isolamento 01', status: 'AVAILABLE' },
];

export default function BedSwapModal({ onClose }: { onClose: () => void }) {
    const [selectedBed, setSelectedBed] = useState('');

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideIn">

                <div className="bg-indigo-600 p-6 text-white text-center">
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                        <ArrowsRightLeftIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">Transferência de Leito</h3>
                    <p className="text-indigo-200 text-sm">Mover Thor do <strong className="text-white">Canil 101</strong> para...</p>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {MOCK_BEDS.map(bed => (
                            <button
                                key={bed.id}
                                disabled={bed.status === 'OCCUPIED'}
                                onClick={() => setSelectedBed(bed.id)}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${bed.status === 'CURRENT' ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' :
                                        bed.status === 'OCCUPIED' ? 'border-gray-200 bg-gray-100 opacity-40 cursor-not-allowed' :
                                            selectedBed === bed.id ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200' :
                                                'border-gray-200 hover:border-indigo-300'
                                    }`}
                            >
                                <div className="font-bold text-gray-800">{bed.name}</div>
                                <div className="text-xs uppercase font-bold mt-1 text-gray-500">
                                    {bed.status === 'CURRENT' ? 'Leito Atual' :
                                        bed.status === 'OCCUPIED' ? 'Ocupado' : 'Disponível'}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-6">
                        <strong>Nota:</strong> O histórico de aplicações e prescrições do paciente será mantido automaticamente. A taxa de diária será atualizada se o tipo de leito mudar (Ex: Canil -> Isolamento).
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancelar</button>
                        <button className="flex-1 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedBed}>
                            Confirmar Troca
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
