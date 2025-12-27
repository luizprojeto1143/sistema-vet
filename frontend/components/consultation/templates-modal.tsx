import React, { useState } from 'react';
import { XMarkIcon, DocumentTextIcon, CheckIcon } from '@heroicons/react/24/outline';

interface TemplatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (content: string) => void;
}

export default function TemplatesModal({ isOpen, onClose, onSelect }: TemplatesModalProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // MOCK TEMPLATES (In real app, fetch from backend)
    const templates = [
        { id: 1, title: 'Consulta Pediátrica', category: 'Geral', content: "**Queixa:** Primeira consulta.\n**Histórico:** Adotado recentemente.\n**Exame Físico:** Mucosas normocoradas, TPC < 2s, Ausculta limpa." },
        { id: 2, title: 'Vômito e Diarreia', category: 'Gastro', content: "**Queixa:** Vômitos (3x hoje) e fezes pastosas.\n**Histórico:** Troca de ração recente.\n**Exame Físico:** Desidratação leve (5%), dor abdominal à palpação." },
        { id: 3, title: 'Dermatite', category: 'Dermato', content: "**Queixa:** Prurido intenso.\n**Histórico:** Piora no verão.\n**Exame Físico:** Eritema em região interdigital e axilar. Alopecia focal." },
        { id: 4, title: 'Vacinação Anual', category: 'Preventiva', content: "**Queixa:** Retorno para vacinas.\n**Exame Físico:** Hígido. Apto para vacinação." },
        { id: 5, title: 'Otite Externa', category: 'Dermato', content: "**Queixa:** Meneios de cabeça e secreção.\n**Exame Físico:** Conduto auditivo edemaciado, secreção enegrecida. Citologia solicitada." },
    ];

    const categories = Array.from(new Set(templates.map(t => t.category)));

    const filteredTemplates = templates.filter(t =>
        (t.title.toLowerCase().includes(search.toLowerCase()) || t.content.toLowerCase().includes(search.toLowerCase())) &&
        (!selectedCategory || t.category === selectedCategory)
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-indigo-600" /> Modelos de Texto
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full text-gray-500">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-100 space-y-3">
                    <input
                        type="text"
                        placeholder="Buscar modelo..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        autoFocus
                    />
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${!selectedCategory ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Todos
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 gap-3 bg-gray-50/50">
                    {filteredTemplates.map(template => (
                        <button
                            key={template.id}
                            onClick={() => { onSelect(template.content); onClose(); }}
                            className="bg-white p-4 rounded-xl border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all text-left group relative"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-gray-800 group-hover:text-indigo-700">{template.title}</span>
                                <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{template.category}</span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">{template.content}</p>

                            <div className="absolute inset-0 bg-indigo-50/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                <span className="bg-white px-3 py-1 rounded-full shadow-sm text-indigo-600 font-bold text-xs flex items-center gap-1">
                                    <CheckIcon className="w-4 h-4" /> Selecionar
                                </span>
                            </div>
                        </button>
                    ))}
                    {filteredTemplates.length === 0 && (
                        <div className="text-center text-gray-400 py-10">
                            Nenhum modelo encontrado.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
