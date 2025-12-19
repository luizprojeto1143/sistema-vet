"use client";

import React, { useState } from 'react';
import {
    XMarkIcon,
    BeakerIcon,
    TagIcon,
    QrCodeIcon,
    BanknotesIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function ProductForm({ onClose }: { onClose: () => void }) {
    const [productType, setProductType] = useState('MEDICATION');
    const [activeTab, setActiveTab] = useState('BASIC');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slideIn">

                {/* HEADER */}
                <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
                    <div>
                        <h2 className="text-2xl font-bold">Cadastro de Produto</h2>
                        <p className="text-indigo-200 text-sm">Defina detalhes físicos, fiscais e de controle.</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-indigo-700 p-2 rounded-lg transition-colors">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* TABS */}
                <div className="flex border-b border-gray-200 bg-gray-50 px-6">
                    <button
                        onClick={() => setActiveTab('BASIC')}
                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'BASIC' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Dados Básicos
                    </button>
                    <button
                        onClick={() => setActiveTab('CONTROL')}
                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'CONTROL' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Estoque & Fração
                    </button>
                    <button
                        onClick={() => setActiveTab('FISCAL')}
                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'FISCAL' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Fiscal (NCM/Impostos)
                    </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">

                    {/* TYPE SELECTOR (Always Visible) */}
                    <div className="mb-8 grid grid-cols-4 gap-4">
                        {['MEDICATION', 'SUPPLY', 'RETAIL', 'GROOMING'].map(type => (
                            <button
                                key={type}
                                onClick={() => setProductType(type)}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${productType === type
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-gray-200 bg-white text-gray-400 hover:border-indigo-200'
                                    }`}
                            >
                                <BeakerIcon className="h-6 w-6" />
                                <span className="text-xs font-bold uppercase">{
                                    type === 'MEDICATION' ? 'Medicamento' :
                                        type === 'SUPPLY' ? 'Insumo/Material' :
                                            type === 'RETAIL' ? 'PetShop/Varejo' : 'Banho & Tosa'
                                }</span>
                            </button>
                        ))}
                    </div>

                    {activeTab === 'BASIC' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nome Comercial Completo</label>
                                    <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Ex: Vacina Vanguard V10 (Dose)" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Categoria</label>
                                    <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                                        <option>Biológicos (Vacinas)</option>
                                        <option>Antibióticos</option>
                                        <option>Anestésicos</option>
                                        <option>Anti-inflamatórios</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Fornecedor Principal</label>
                                    <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                                        <option>Zoetis</option>
                                        <option>Boehringer Ingelheim</option>
                                        <option>Elanco</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Código de Barras (EAN)</label>
                                    <div className="relative">
                                        <QrCodeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input type="text" className="w-full pl-10 p-3 border border-gray-300 rounded-lg" placeholder="Escaneie ou digite..." />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Princípio Ativo (Se Medicamento)</label>
                                    <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Ex: Amoxicilina" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'CONTROL' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-yellow-800 text-sm mb-4">
                                <strong>Atenção:</strong> A unidade de controle define como o estoque será baixado.
                                Para medicamentos injetáveis, use <strong>ML</strong>. Para comprimidos, use <strong>UN</strong> ou <strong>CX</strong>.
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Unidade de Controle</label>
                                    <select className="w-full p-3 border border-gray-300 rounded-lg bg-white font-bold">
                                        <option value="UN">Unidade (UN)</option>
                                        <option value="ML">Mililitro (ML)</option>
                                        <option value="FR">Frasco (FR)</option>
                                        <option value="AMP">Ampola (AMP)</option>
                                        <option value="KG">Quilograma (KG)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Fração de Venda/Uso?</label>
                                    <div className="flex items-center gap-2 mt-2">
                                        <input type="checkbox" className="h-5 w-5 text-indigo-600 rounded" />
                                        <span className="text-gray-600">Sim, permitir uso fracionado (ex: 0.5 ml)</span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <TagIcon className="h-5 w-5 text-gray-400" />
                                Níveis de Estoque (Alertas)
                            </h3>

                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mínimo (Alerta)</label>
                                    <input type="number" className="w-full p-3 border-red-200 border bg-red-50 rounded-lg text-red-800 font-bold" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ideal (Meta)</label>
                                    <input type="number" className="w-full p-3 border-green-200 border bg-green-50 rounded-lg text-green-800 font-bold" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Máximo (Excesso)</label>
                                    <input type="number" className="w-full p-3 border-gray-300 border bg-white rounded-lg" placeholder="0" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'FISCAL' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Código NCM</label>
                                    <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Ex: 3004.90.99" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">CFOP Padrão (Entrada)</label>
                                    <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Ex: 1102" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Preço de Custo (Médio)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-500">R$</span>
                                        <input type="text" className="w-full pl-8 p-3 border border-gray-300 rounded-lg bg-gray-50" readOnly value="0,00 (Auto)" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Preço de Venda (Sugerido)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-500">R$</span>
                                        <input type="number" className="w-full pl-8 p-3 border border-indigo-300 rounded-lg text-indigo-700 font-bold" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-100 p-4 rounded-lg">
                                <h4 className="font-bold text-gray-700 mb-2 text-sm uppercase">Tributação (Simples Nacional)</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="tax_group" className="text-indigo-600" />
                                        <span className="text-sm">Tributado Integralmente</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="tax_group" className="text-indigo-600" />
                                        <span className="text-sm">Substituição Tributária (ST)</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="tax_group" className="text-indigo-600" />
                                        <span className="text-sm">Isento / Imune</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* FOOTER */}
                <div className="bg-white p-6 border-t border-gray-200 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-3 rounded-lg text-gray-600 font-bold hover:bg-gray-100">Cancelar</button>
                    <button className="px-8 py-3 rounded-lg bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-lg flex items-center gap-2">
                        <DocumentTextIcon className="h-5 w-5" />
                        Salvar Produto
                    </button>
                </div>

            </div>
        </div>
    );
}
