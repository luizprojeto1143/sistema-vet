import React, { useState, useEffect } from 'react';
import { XMarkIcon, DocumentDuplicateIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { API_URL } from '@/utils/config';

interface TemplateSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (content: any) => void;
}

export default function TemplateSelectionModal({ isOpen, onClose, onSelect }: TemplateSelectionModalProps) {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) fetchTemplates();
    }, [isOpen]);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/templates`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setTemplates(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
                    <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                        <DocumentDuplicateIcon className="w-5 h-5" /> Modelos de Atendimento
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-indigo-100 rounded-full text-indigo-700">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto bg-gray-50">
                    {loading ? (
                        <div className="text-center py-8 text-gray-400">Carregando modelos...</div>
                    ) : templates.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 rounded-xl bg-white">
                            Nenhum modelo salvo.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {templates.map(tpl => (
                                <button
                                    key={tpl.id}
                                    onClick={() => {
                                        try {
                                            const content = JSON.parse(tpl.content);
                                            onSelect(content);
                                            onClose();
                                        } catch (e) {
                                            alert('Erro ao carregar modelo.');
                                        }
                                    }}
                                    className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition-all group flex justify-between items-center"
                                >
                                    <div>
                                        <div className="font-bold text-gray-800 group-hover:text-indigo-700">{tpl.name}</div>
                                        <div className="text-xs text-gray-500">{tpl.category || 'Geral'} • {tpl.species || 'Todas as espécies'}</div>
                                    </div>
                                    <ArrowRightIcon className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
