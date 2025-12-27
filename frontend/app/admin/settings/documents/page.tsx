"use client";

import React, { useState, useEffect } from 'react';
import {
    DocumentTextIcon,
    CloudArrowUpIcon,
    PhotoIcon,
    TrashIcon,
    CheckCircleIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function DocumentSettingsPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [clinicId, setClinicId] = useState<string | null>(null);
    const [clinicLogo, setClinicLogo] = useState<string | null>(null);
    const [headerName, setHeaderName] = useState('');
    const [footerText, setFooterText] = useState('');

    const [templates, setTemplates] = useState([
        { id: 1, name: 'Receita Padrão', type: 'PRESCRIPTION', fileName: 'fundo_receita_A4.pdf', size: '1.2 MB' },
    ]);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.clinicId) {
                setClinicId(user.clinicId);
                fetchClinic(user.clinicId);
            }
        }
    }, []);

    const fetchClinic = async (id: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clinics/${id}`);
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    setClinicLogo(data.logoUrl || null);
                    setHeaderName(data.name || '');
                    setFooterText(data.address || ''); // Using address as footer text for now
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async () => {
        if (!clinicId) {
            alert("ID da clínica não encontrado. Não é possível salvar.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clinics/${clinicId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: headerName || undefined,
                    logoUrl: clinicLogo,
                    address: footerText // reusing address field for footer text for now
                })
            });

            if (res.ok) {
                alert("Configurações salvas com sucesso!");
            } else {
                alert("Erro ao salvar.");
            }
        } catch (err) {
            alert("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024 * 2) {
                alert("Arquivo muito grande (Max 2MB)");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setClinicLogo(reader.result as string);
                // Also set header name defaults if empty
                if (!headerName) setHeaderName(file.name.split('.')[0]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setTemplates([...templates, {
                id: Date.now(),
                name: file.name.split('.')[0],
                type: 'CUSTOM',
                fileName: file.name,
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
            }]);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-2">
                        <ArrowLeftIcon className="w-4 h-4" /> Voltar
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Personalização de Documentos</h1>
                    <p className="text-gray-500">Defina a identidade visual e os modelos de documentos da sua clínica.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    <CheckCircleIcon className="w-5 h-5" /> {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Identity Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <PhotoIcon className="w-5 h-5 text-indigo-600" /> Logotipo da Clínica
                        </h3>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative cursor-pointer group">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleLogoUpload}
                            />
                            {clinicLogo ? (
                                <div className="relative w-full h-32 flex items-center justify-center">
                                    <img src={clinicLogo} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                                        <span className="text-white font-bold text-sm">Trocar Imagem</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="bg-indigo-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-indigo-600">
                                        <CloudArrowUpIcon className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">Clique para enviar</p>
                                    <p className="text-xs text-gray-400">PNG, JPG (Max 2MB)</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome no Cabeçalho</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                placeholder="Ex: Clínica Veterinária PetLove"
                                value={headerName}
                                onChange={e => setHeaderName(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Templates Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <DocumentTextIcon className="w-5 h-5 text-indigo-600" /> Modelos de Documentos
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Envie PDFs de fundo ou use nossos modelos.</p>
                            </div>
                            <label className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-colors cursor-pointer flex items-center gap-2">
                                <CloudArrowUpIcon className="w-4 h-4" /> Novo Modelo
                                <input type="file" accept=".pdf" className="hidden" onChange={handleTemplateUpload} />
                            </label>
                        </div>

                        <div className="space-y-3">
                            {templates.map((template) => (
                                <div key={template.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all bg-gray-50/50">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                            <DocumentTextIcon className="w-6 h-6 text-red-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{template.name}</h4>
                                            <p className="text-xs text-gray-500">{template.fileName} • {template.size}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase bg-gray-200 text-gray-600 px-2 py-1 rounded">{template.type}</span>
                                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm">
                            <strong>💡 Como funciona?</strong>
                            <ul className="list-disc ml-5 mt-2 space-y-1 text-blue-700/80">
                                <li>Envie um arquivo PDF com a arte da sua clínica (fundo).</li>
                                <li>O sistema irá sobrepor o texto da receita/atestado sobre este fundo na hora da impressão.</li>
                                <li>Você pode ter fundos diferentes para Receitas, Atestados e Termos.</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
