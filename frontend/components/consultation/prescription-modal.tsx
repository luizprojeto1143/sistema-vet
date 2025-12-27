import React, { useState } from 'react';
import { XMarkIcon, DocumentPlusIcon, PlusIcon, PrinterIcon } from '@heroicons/react/24/outline';

import { printDocument } from '@/utils/print';

interface PrescriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    clinic?: { name: string; address?: string; logoUrl?: string };
}

export default function PrescriptionModal({ isOpen, onClose, clinic }: PrescriptionModalProps) {
    const [medications, setMedications] = useState<any[]>([]);
    const [drugName, setDrugName] = useState('');
    const [dosage, setDosage] = useState('');
    const [instructions, setInstructions] = useState('');

    if (!isOpen) return null;

    const addMedication = () => {
        if (!drugName) return;
        setMedications([...medications, { drugName, dosage, instructions }]);
        setDrugName('');
        setDosage('');
        setInstructions('');
    };

    const handlePrint = () => {
        const content = medications.map(m =>
            `• ${m.drugName} (${m.dosage})\n  ${m.instructions}`
        ).join('\n\n');

        // Use provided clinic logo or fallback
        const logo = clinic?.logoUrl;

        printDocument('Receituário Médico Veterinário', content, logo);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5 duration-300">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-emerald-50">
                    <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                        <DocumentPlusIcon className="w-5 h-5" /> Receituário Inteligente
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-emerald-100 rounded-full text-emerald-700">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
                        <div className="grid grid-cols-12 gap-3 mb-3">
                            <div className="col-span-6">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Medicamento</label>
                                <input
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="Ex: Dipirona 500mg"
                                    value={drugName}
                                    onChange={e => setDrugName(e.target.value)}
                                />
                            </div>
                            <div className="col-span-6">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dose / Via</label>
                                <input
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="Ex: 1 Comprimido, VO"
                                    value={dosage}
                                    onChange={e => setDosage(e.target.value)}
                                />
                            </div>
                            <div className="col-span-12">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Posologia / Instruções</label>
                                <textarea
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                    placeholder="Ex: Dar 1 comprimido a cada 8 horas por 5 dias..."
                                    rows={2}
                                    value={instructions}
                                    onChange={e => setInstructions(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            onClick={addMedication}
                            className="w-full py-2 bg-emerald-50 text-emerald-700 font-bold rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 text-sm border border-emerald-100"
                        >
                            <PlusIcon className="w-4 h-4" /> Adicionar à Receita
                        </button>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Itens da Receita</h4>
                        {medications.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 italic bg-white rounded-xl border border-dashed border-gray-200">
                                Nenhum medicamento adicionado.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {medications.map((med, idx) => (
                                    <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-gray-800">{med.drugName} <span className="text-gray-400 font-normal text-xs">({med.dosage})</span></div>
                                            <div className="text-sm text-gray-600 mt-1">{med.instructions}</div>
                                        </div>
                                        <button
                                            onClick={() => setMedications(prev => prev.filter((_, i) => i !== idx))}
                                            className="text-gray-300 hover:text-red-500"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-white border-t border-gray-100 flex justify-between items-center z-10">
                    <div className="text-xs text-gray-400">
                        {medications.length} itens na receita
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Fechar</button>
                        <button
                            onClick={handlePrint}
                            className="px-6 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-lg shadow-emerald-200 transition-colors flex items-center gap-2"
                        >
                            <PrinterIcon className="w-4 h-4" /> Imprimir Receita
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
