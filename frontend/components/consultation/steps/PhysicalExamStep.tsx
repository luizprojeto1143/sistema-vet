import React from 'react';
import {
    HeartIcon,
    Wind as LungsIcon,
    ThermometerIcon,
    ScaleIcon,
    DropletsIcon, // For Hydration/Mucosa
    ActivityIcon,
    AlertCircleIcon
} from 'lucide-react';

interface PhysicalExamData {
    weight: string;
    temperature: string;
    pulse: string;
    respiratoryRate: string;
    mucosa: string;
    tpc: string;
    hydration: string;
    abdominalPalpation: string;
    lymphNodes: string;
    physicalExamNotes: string; // General notes
}

interface Props {
    data: PhysicalExamData;
    onChange: (data: PhysicalExamData) => void;
    petId?: string;
}

export function PhysicalExamStep({ data, onChange, petId }: Props) {

    const update = (field: keyof PhysicalExamData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* 1. Sinais Vitais (Vitals) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <ActivityIcon className="w-5 h-5 text-indigo-600" /> Sinais Vitais
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                            <ScaleIcon className="w-3 h-3" /> Peso (kg)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={data.weight}
                                onChange={e => update('weight', e.target.value)}
                                className="w-full text-2xl font-bold p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center"
                                placeholder="0.0"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                            <ThermometerIcon className="w-3 h-3" /> Temp (°C)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={data.temperature}
                                onChange={e => update('temperature', e.target.value)}
                                className={`w-full text-2xl font-bold p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 text-center
                                    ${Number(data.temperature) > 39.2 ? 'border-red-300 bg-red-50 text-red-600' : 'border-gray-200'}
                                `}
                                placeholder="00.0"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">°C</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                            <HeartIcon className="w-3 h-3" /> Freq. Cardíaca
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={data.pulse}
                                onChange={e => update('pulse', e.target.value)}
                                className="w-full text-2xl font-bold p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-center"
                                placeholder="--"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium font-xs">bpm</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                            <ActivityIcon className="w-3 h-3" /> Freq. Respiratória
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={data.respiratoryRate}
                                onChange={e => update('respiratoryRate', e.target.value)}
                                className="w-full text-2xl font-bold p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-center"
                                placeholder="--"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">mpm</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Parameters (Mucosa, Hydration, TPC) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Mucosa Selector */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-800 mb-4">Mucosa</h3>
                    <div className="space-y-2">
                        {[
                            { value: 'Normocorada', color: 'bg-rose-400', label: 'Normocorada' },
                            { value: 'Hipocorada', color: 'bg-red-100 border border-red-200', label: 'Hipocorada (Pálida)', text: 'text-gray-600' },
                            { value: 'Ictérica', color: 'bg-yellow-400', label: 'Ictérica (Amarela)', text: 'text-yellow-900' },
                            { value: 'Cianótica', color: 'bg-blue-600', label: 'Cianótica (Roxa)', text: 'text-white' },
                            { value: 'Congesta', color: 'bg-red-700', label: 'Congesta (Vermelha)', text: 'text-white' },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => update('mucosa', opt.value)}
                                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all border
                                    ${data.mucosa === opt.value
                                        ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/50'
                                        : 'border-transparent hover:bg-gray-50'}
                                `}
                            >
                                <div className={`w-6 h-6 rounded-full shadow-sm ${opt.color}`}></div>
                                <span className={`text-sm font-medium ${data.mucosa === opt.value ? 'text-indigo-900 font-bold' : 'text-gray-600'}`}>{opt.label}</span>
                                {data.mucosa === opt.value && <div className="ml-auto w-2 h-2 bg-indigo-600 rounded-full"></div>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TPC & Hydration */}
                <div className="space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-800 mb-4">TPC (Tempo de Preenchimento Capilar)</h3>
                        <div className="flex gap-2">
                            {['< 1s', '1-2s', '> 2s'].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => update('tpc', val)}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all
                                        ${data.tpc === val
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}
                                    `}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                            Hidratação
                        </h3>
                        <div className="space-y-1">
                            {['Normal', 'Desidratação Leve (5%)', 'Moderada (6-8%)', 'Grave (>10%)'].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => update('hydration', val)}
                                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors
                                        ${data.hydration === val
                                            ? 'bg-blue-100 text-blue-800 font-bold'
                                            : 'text-gray-600 hover:bg-gray-50'}
                                    `}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Palpation & Nodes */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-2">Palpação Abdominal</h3>
                        <select
                            value={data.abdominalPalpation}
                            onChange={e => update('abdominalPalpation', e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        >
                            <option value="">Selecione...</option>
                            <option value="Normal/Indolor">Normal / Indolor</option>
                            <option value="Tensa">Tensa</option>
                            <option value="Dolorosa (Cranial)">Dolorosa (Cranial)</option>
                            <option value="Dolorosa (Caudal)">Dolorosa (Caudal)</option>
                            <option value="Dolorosa (Difusa)">Dolorosa (Difusa)</option>
                            <option value="Presença de Massa">Presença de Massa</option>
                            <option value="Timpanismo">Timpanismo</option>
                        </select>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-2">Linfonodos</h3>
                        <select
                            value={data.lymphNodes}
                            onChange={e => update('lymphNodes', e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        >
                            <option value="">Selecione...</option>
                            <option value="Normais">Normais</option>
                            <option value="Reativos (Submandibulares)">Reativos (Submandibulares)</option>
                            <option value="Reativos (Poplíteos)">Reativos (Poplíteos)</option>
                            <option value="Reativos (Generalizado)">Reativos (Generalizado)</option>
                            <option value="Aumentados">Aumentados</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* General Notes */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3">Observações Gerais do Exame Físico</h3>
                <textarea
                    value={data.physicalExamNotes}
                    onChange={e => update('physicalExamNotes', e.target.value)}
                    className="w-full h-24 p-4 bg-gray-50 border-0 rounded-xl resize-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="Descreva achados e especificidades não cobertas acima..."
                ></textarea>
            </div>
        </div>
    );
}
