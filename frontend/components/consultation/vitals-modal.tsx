import React, { useState } from 'react';
import { XMarkIcon, ScaleIcon } from '@heroicons/react/24/outline';

interface VitalsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (vitals: any) => void;
}

export default function VitalsModal({ isOpen, onClose, onSave }: VitalsModalProps) {
    const [weight, setWeight] = useState('');
    const [temp, setTemp] = useState('');
    const [bpm, setBpm] = useState('');
    const [rr, setRr] = useState('');
    const [tpc, setTpc] = useState('');
    const [hydration, setHydration] = useState('Normal');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ weight, temp, bpm, rr, tpc, hydration });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-blue-50">
                    <h3 className="font-bold text-blue-900 flex items-center gap-2">
                        <ScaleIcon className="w-5 h-5" /> Sinais Vitais
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-blue-100 rounded-full text-blue-700">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Peso (kg)</label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-200 rounded-lg text-lg font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="0.00"
                            value={weight}
                            onChange={e => setWeight(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Temperatura (°C)</label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-200 rounded-lg text-lg font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="38.5"
                            value={temp}
                            onChange={e => setTemp(e.target.value)}
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Freq. Cardíaca (BPM)</label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="--"
                            value={bpm}
                            onChange={e => setBpm(e.target.value)}
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Freq. Respiratória</label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="--"
                            value={rr}
                            onChange={e => setRr(e.target.value)}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hidratação</label>
                        <select
                            className="w-full p-2 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={hydration}
                            onChange={e => setHydration(e.target.value)}
                        >
                            <option value="Normal">Normal</option>
                            <option value="Levemente Desidratado (5%)">Levemente Desidratado (5%)</option>
                            <option value="Moderado (8%)">Moderado (8%)</option>
                            <option value="Grave (10%+)">Grave (10%+)</option>
                        </select>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
                    <button onClick={handleSave} className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-200 transition-colors">Salvar Dados</button>
                </div>
            </div>
        </div>
    );
}
