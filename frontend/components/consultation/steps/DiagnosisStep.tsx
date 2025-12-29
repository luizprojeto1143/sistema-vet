import React, { useState } from 'react';
import {
    BeakerIcon,
    PlusIcon,
    MicroscopeIcon,
    TrashIcon
} from 'lucide-react';

interface DiagnosisData {
    differentialDiagnosis: string;
    diagnosis: string;
    prognosis: string;
    requestedExams: any[]; // List of exams
}

interface Props {
    data: DiagnosisData;
    onChange: (data: DiagnosisData) => void;
}

export function DiagnosisStep({ data, onChange }: Props) {
    const [showExamInput, setShowExamInput] = useState(false);
    const [newExam, setNewExam] = useState('');

    const update = (field: keyof DiagnosisData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const addExam = () => {
        if (!newExam.trim()) return;
        update('requestedExams', [
            ...(data.requestedExams || []),
            { name: newExam, status: 'REQUESTED', date: new Date().toISOString() }
        ]);
        setNewExam('');
        setShowExamInput(false);
    };

    const removeExam = (idx: number) => {
        const list = [...(data.requestedExams || [])];
        list.splice(idx, 1);
        update('requestedExams', list);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Hipóteses Diagnósticas */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        ❓ Hipóteses Diagnósticas (Suspeitas)
                    </h3>
                    <textarea
                        value={data.differentialDiagnosis}
                        onChange={e => update('differentialDiagnosis', e.target.value)}
                        className="w-full h-40 p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl resize-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300 transition-all text-gray-700"
                        placeholder="Ex: Babesiose, Erliquiose, Gastroenterite Viral..."
                    ></textarea>
                </div>

                {/* 2. Diagnóstico Definitivo */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        ✅ Diagnóstico Definitivo (Se houver)
                    </h3>
                    <textarea
                        value={data.diagnosis}
                        onChange={e => update('diagnosis', e.target.value)}
                        className="w-full h-40 p-4 bg-green-50/50 border border-green-100 rounded-xl resize-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition-all text-gray-700"
                        placeholder="Confirmado via exame ou sinal patognomônico..."
                    ></textarea>
                </div>
            </div>

            {/* 3. Solicitação de Exames */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <MicroscopeIcon className="w-5 h-5 text-purple-600" /> Solicitação de Exames Complementares
                    </h3>
                    <button
                        onClick={() => setShowExamInput(true)}
                        className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-bold hover:bg-purple-100 transition-colors flex items-center gap-2"
                    >
                        <PlusIcon className="w-4 h-4" /> Adicionar Exame
                    </button>
                </div>

                {showExamInput && (
                    <div className="mb-4 flex gap-2 animate-in fade-in slide-in-from-top-2">
                        <input
                            autoFocus
                            type="text"
                            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                            placeholder="Digite o nome do exame (ex: Hemograma, Ultrassom)..."
                            value={newExam}
                            onChange={e => setNewExam(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addExam()}
                        />
                        <button
                            onClick={addExam}
                            className="px-6 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors"
                        >
                            Confirmar
                        </button>
                    </div>
                )}

                {(!data.requestedExams || data.requestedExams.length === 0) ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <BeakerIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Nenhum exame solicitado.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {data.requestedExams.map((exam, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-purple-200 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                        <BeakerIcon className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold text-gray-700">{exam.name}</span>
                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Solicitado</span>
                                </div>
                                <button
                                    onClick={() => removeExam(idx)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 4. Prognóstico */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Prognóstico</h3>
                <div className="flex gap-4">
                    {['Favorável', 'Reservado', 'Desfavorável'].map(p => (
                        <label key={p} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="prognosis"
                                checked={data.prognosis === p}
                                onChange={() => update('prognosis', p)}
                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-indigo-600 transition-colors font-medium">{p}</span>
                        </label>
                    ))}
                </div>
            </div>

        </div>
    );
}
