"use client";

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ProductModal({ onClose, onSave, initialData }: any) {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Medicamentos',
        usageType: 'BOTH', // INTERNAL, SALE, BOTH
        price: '',
        cost: '',
        minStock: '5',
        currentStock: '0',
        ...initialData
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSave({
            ...formData,
            salePrice: parseFloat(formData.price || '0'),
            costPrice: parseFloat(formData.cost || '0'),
            currentStock: parseFloat(formData.currentStock || '0'),
            minStock: parseFloat(formData.minStock || '5'),
            totalVolumeMl: formData.totalVolumeMl ? parseFloat(formData.totalVolumeMl) : null
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fade-in-up">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {initialData ? 'Editar Produto' : 'Novo Produto'}
                    </h2>
                    <button onClick={onClose}><XMarkIcon className="h-6 w-6 text-gray-400" /></button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Produto</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Ex: Vacina V10" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Categoria</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white">
                                <option>Medicamentos</option>
                                <option>Vacinas</option>
                                <option>Materiais</option>
                                <option>Alimentos</option>
                                <option>Banho e Tosa</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Finalidade (Uso)</label>
                            <select name="usageType" value={formData.usageType} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white font-bold text-indigo-700">
                                <option value="BOTH">Venda e Uso Interno</option>
                                <option value="SALE">Apenas Venda (Loja)</option>
                                <option value="INTERNAL">Apenas Uso Interno</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-4">
                        <h3 className="font-bold text-indigo-800 mb-2">Preços e Estoque</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Custo (R$)</label>
                                <input type="number" name="costPrice" value={formData.costPrice} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Venda (R$)</label>
                                <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Estoque Mínimo</label>
                                <input type="number" name="minStock" value={formData.minStock} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Ex: 5" />
                            </div>
                        </div>
                    </div>

                    {/* ADVANCED / FISCAL DETAILS */}
                    <div className="mt-4">
                        <h3 className="font-bold text-gray-700 mb-2 border-b pb-1">Detalhes Fiscais & Unidades</h3>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Unidade de Controle</label>
                                <select name="controlType" value={formData.controlType || 'UN'} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white">
                                    <option value="UN">Unidade (UN)</option>
                                    <option value="ML">Mililitro (mL) - Fracionável</option>
                                    <option value="KG">Quilo (kg) - Fracionável</option>
                                    <option value="CX">Caixa (CX)</option>
                                </select>
                            </div>
                            {(formData.controlType === 'ML' || formData.controlType === 'KG') && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Conteúdo Total ({formData.controlType})</label>
                                    <input type="number" name="totalVolumeMl" value={formData.totalVolumeMl || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder={`Ex: ${formData.controlType === 'ML' ? '500' : '10'}`} />
                                    <p className="text-[10px] text-gray-400">Para cálculos de dose/fração.</p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">NCM</label>
                                <input name="ncm" value={formData.ncm || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="8 dígitos" maxLength={8} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">CFOP</label>
                                <input name="cfop" value={formData.cfop || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="4 dígitos" maxLength={4} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Regra Fiscal</label>
                                <select name="taxRule" value={formData.taxRule || ''} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white">
                                    <option value="">Padrão (Simples)</option>
                                    <option value="ST">Subst. Tributária</option>
                                    <option value="ISENTO">Isento</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Estoque Inicial</label>
                            <input name="currentStock" type="number" value={formData.currentStock} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Estoque Mínimo</label>
                            <input name="minStock" type="number" value={formData.minStock} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                        </div>
                    </div>

                </div>

                <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-bold">Cancelar</button>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg">
                        Salvar Produto
                    </button>
                </div>
            </div>
        </div>
    );
}
