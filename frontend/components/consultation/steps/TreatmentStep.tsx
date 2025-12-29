import React, { useState } from 'react';
import {
    Pill as PillIcon,
    Syringe as SyringeIcon,
    Plus as PlusIcon,
    Trash as TrashIcon,
    Printer as PrinterIcon,
    Archive as ArchiveBoxIcon,
    BadgeCheck as CheckBadgeIcon,
    Clock as ClockIcon,
    Building2 as BuildingIcon
} from 'lucide-react';

interface PrescriptionItem {
    drugName: string;
    dosage: string;
    frequency: string;
    duration: string;
    route: string;
    type: 'INTERNAL' | 'EXTERNAL'; // INTERNAL = Stock deduction, EXTERNAL = Prescription only
    instructions?: string;
}

interface ProcedureItem {
    name: string;
    price: number;
    notes?: string;
}

interface TreatmentData {
    prescriptions: PrescriptionItem[];
    procedures: ProcedureItem[];
    finalNotes: string;
    diagnosis?: string;
}

import InternmentAdmissionModal from '../internment-admission-modal';

interface Props {
    data: TreatmentData;
    onChange: (data: TreatmentData) => void;
    onFinish: () => void;
    appointment?: any;
}

export function TreatmentStep({ data, onChange, onFinish, appointment }: Props) {
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
    const [showInternmentModal, setShowInternmentModal] = useState(false);

    // New Prescription State
    const [newRx, setNewRx] = useState<PrescriptionItem>({
        drugName: '',
        dosage: '',
        frequency: '',
        duration: '',
        route: 'Oral',
        type: 'EXTERNAL'
    });

    const addPrescription = () => {
        if (!newRx.drugName) return;
        onChange({
            ...data,
            prescriptions: [...(data.prescriptions || []), newRx]
        });
        setNewRx({ drugName: '', dosage: '', frequency: '', duration: '', route: 'Oral', type: 'EXTERNAL' });
        setShowPrescriptionForm(false);
    };

    const removePrescription = (idx: number) => {
        const list = [...(data.prescriptions || [])];
        list.splice(idx, 1);
        onChange({ ...data, prescriptions: list });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* 1. Prescrição (Medicamentos) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <PillIcon className="w-5 h-5 text-emerald-600" /> Prescrição & Medicamentos
                    </h3>
                    <button
                        onClick={() => setShowPrescriptionForm(true)}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold hover:bg-emerald-100 transition-colors flex items-center gap-2"
                    >
                        <PlusIcon className="w-4 h-4" /> Adicionar Item
                    </button>
                </div>

                {showPrescriptionForm && (
                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 mb-6 animate-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="lg:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Medicamento</label>
                                <input
                                    className="w-full p-2 border border-emerald-200 rounded-lg"
                                    placeholder="Ex: Dipirona Gotas"
                                    value={newRx.drugName}
                                    onChange={e => setNewRx({ ...newRx, drugName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Dose</label>
                                <input
                                    className="w-full p-2 border border-emerald-200 rounded-lg"
                                    placeholder="Ex: 5ml"
                                    value={newRx.dosage}
                                    onChange={e => setNewRx({ ...newRx, dosage: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Via</label>
                                <select
                                    className="w-full p-2 border border-emerald-200 rounded-lg bg-white"
                                    value={newRx.route}
                                    onChange={e => setNewRx({ ...newRx, route: e.target.value })}
                                >
                                    {['Oral', 'IV', 'IM', 'SC', 'Tópico', 'Oftálmico', 'Otológico'].map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Frequência</label>
                                <input
                                    className="w-full p-2 border border-emerald-200 rounded-lg"
                                    placeholder="Ex: 8/8h"
                                    value={newRx.frequency}
                                    onChange={e => setNewRx({ ...newRx, frequency: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Duração</label>
                                <input
                                    className="w-full p-2 border border-emerald-200 rounded-lg"
                                    placeholder="Ex: 5 dias"
                                    value={newRx.duration}
                                    onChange={e => setNewRx({ ...newRx, duration: e.target.value })}
                                />
                            </div>
                            <div className="lg:col-span-2 flex items-end">
                                <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-lg border border-gray-200 w-full hover:border-emerald-300">
                                    <input
                                        type="checkbox"
                                        checked={newRx.type === 'INTERNAL'}
                                        onChange={e => setNewRx({ ...newRx, type: e.target.checked ? 'INTERNAL' : 'EXTERNAL' })}
                                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        <ArchiveBoxIcon className="w-4 h-4 inline mr-1 text-orange-500" />
                                        Baixar do Estoque / Cobrar na Comanda
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowPrescriptionForm(false)} className="px-4 py-2 text-gray-500 font-bold text-sm">Cancelar</button>
                            <button onClick={addPrescription} className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 text-sm">Adicionar</button>
                        </div>
                    </div>
                )}

                {(!data.prescriptions || data.prescriptions.length === 0) ? (
                    <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                        Nenhum medicamento prescrito.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {data.prescriptions.map((rx, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-emerald-200 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${rx.type === 'INTERNAL' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                        {rx.type === 'INTERNAL' ? <ArchiveBoxIcon className="w-4 h-4" /> : <PillIcon className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">{rx.drugName} <span className="font-normal text-gray-500 text-xs">({rx.dosage} - {rx.route})</span></div>
                                        <div className="text-xs text-gray-500">{rx.frequency} por {rx.duration}</div>
                                    </div>
                                    {rx.type === 'INTERNAL' && (
                                        <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Estoque</span>
                                    )}
                                </div>
                                <button onClick={() => removePrescription(idx)} className="p-2 text-gray-300 hover:text-red-500 rounded-lg">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 2. Procedimentos & Serviços */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <SyringeIcon className="w-5 h-5 text-indigo-600" /> Procedimentos Realizados
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {['Consulta', 'Vacina V8', 'Vacina Raiva', 'Aplicação Injetável', 'Limpeza de Ouvido', 'Curativo Simples', 'Sedação'].map(proc => (
                        <button
                            key={proc}
                            onClick={() => {
                                const exists = data.procedures?.find(p => p.name === proc);
                                if (exists) return; // Prevent duplicates for now
                                onChange({
                                    ...data,
                                    procedures: [...(data.procedures || []), { name: proc, price: 0 }]
                                })
                            }}
                            className="p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 text-left transition-all group"
                        >
                            <span className="font-bold text-gray-700 group-hover:text-indigo-700">{proc}</span>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                <PlusIcon className="w-3 h-3" /> Adicionar
                            </div>
                        </button>
                    ))}
                </div>

                {/* Selected Procedures List */}
                {data.procedures && data.procedures.length > 0 && (
                    <div className="space-y-2 border-t border-gray-100 pt-4">
                        <label className="text-xs font-bold text-gray-400 uppercase">Procedimentos Selecionados</label>
                        {data.procedures.map((proc, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-bold text-gray-700">{proc.name}</span>
                                <button
                                    onClick={() => {
                                        const list = [...data.procedures];
                                        list.splice(idx, 1);
                                        onChange({ ...data, procedures: list });
                                    }}
                                    className="text-red-400 hover:text-red-600"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 3. Notes & Finish */}
            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wide">Encerramento</h3>
                <textarea
                    className="w-full h-24 p-4 bg-white border border-indigo-100 rounded-xl resize-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Orientações de alta, retorno ou observações finais..."
                    value={data.finalNotes}
                    onChange={e => onChange({ ...data, finalNotes: e.target.value })}
                ></textarea>

                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <ClockIcon className="w-4 h-4" /> Atendimento iniciado há -- min
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowInternmentModal(true)}
                            className="flex items-center gap-2 px-6 py-4 bg-pink-50 text-pink-700 rounded-xl font-bold hover:bg-pink-100 border border-pink-200 transition-all"
                        >
                            <BuildingIcon className="w-5 h-5" /> Internar
                        </button>

                        <button
                            onClick={async () => {
                                if (!data.finalNotes && !data.prescriptions.length) {
                                    if (!confirm("Sem prescrições ou notas. Finalizar?")) return;
                                }

                                // Ask for PDF
                                if (confirm("Deseja gerar o PDF da Receita/Resumo para o Tutor?")) {
                                    const { generateConsultationPDF } = await import('@/utils/pdf-generator');
                                    generateConsultationPDF({
                                        petName: appointment?.pet?.name || "Paciente",
                                        tutorName: appointment?.tutor?.fullName || "Tutor",
                                        vetName: appointment?.vet?.fullName || "Veterinário",
                                        date: new Date().toLocaleDateString(),
                                        diagnosis: data.diagnosis || "Consulta Veterinária",
                                        prescriptions: data.prescriptions.map((p: any) => ({
                                            drugName: p.drugName,
                                            dosage: p.dosage,
                                            frequency: p.frequency,
                                            duration: p.duration,
                                            route: p.route,
                                            details: p.type === 'INTERNAL' ? 'Uso durante procedimento' : undefined
                                        })),
                                        recommendations: data.finalNotes
                                    });
                                }

                                onFinish();
                            }}
                            className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-200 hover:scale-[1.02] transition-all"
                        >
                            <CheckBadgeIcon className="w-6 h-6" /> Finalizar Atendimento
                        </button>
                    </div>
                </div>
            </div>

            {/* Internment Modal */}
            {appointment?.pet?.id && (
                <InternmentAdmissionModal
                    isOpen={showInternmentModal}
                    onClose={() => setShowInternmentModal(false)}
                    petId={appointment.pet.id}
                    diagnosis={data.diagnosis || data.finalNotes || "Em investigação"}
                />
            )}
        </div>
    );
}
