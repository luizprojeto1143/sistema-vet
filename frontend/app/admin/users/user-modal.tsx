"use client";

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const MOCK_ROLES = [
    { id: '1', name: 'Administrador' },
    { id: '2', name: 'Veterinário' },
    { id: '3', name: 'Recepcionista' },
    { id: '4', name: 'Auxiliar' },
];

export default function UserModal({ isOpen, onClose, user }: any) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        roleId: '',
        cpf: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        if (user) {
            setFormData(user);
        } else {
            setFormData({ fullName: '', email: '', roleId: '', cpf: '', status: 'ACTIVE' });
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving User:", formData);
        alert("Usuário salvo (simulado)!");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-[500px] shadow-2xl overflow-hidden animate-fade-in-up">

                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">
                        {user ? 'Editar Usuário' : 'Novo Usuário (Convite)'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email Corporativo</label>
                        <input
                            type="email"
                            required
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Perfil de Acesso</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.roleId}
                                onChange={e => setFormData({ ...formData, roleId: e.target.value })}
                                required
                            >
                                <option value="">Selecione...</option>
                                {MOCK_ROLES.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">CPF (Opcional)</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.cpf}
                                onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                            />
                        </div>
                    </div>

                    {user && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: 'ACTIVE' })}
                                    className={`flex-1 py-2 text-xs font-bold rounded ${formData.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500'}`}
                                >
                                    ATIVO
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: 'BLOCKED' })}
                                    className={`flex-1 py-2 text-xs font-bold rounded ${formData.status === 'BLOCKED' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-500'}`}
                                >
                                    BLOQUEADO
                                </button>
                            </div>
                        </div>
                    )}

                    {!user && (
                        <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2">
                            <div className="text-blue-500 text-lg">💡</div>
                            <p className="text-xs text-blue-700">
                                O usuário receberá um email com um link para definir sua senha e acessar o sistema.
                            </p>
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg">
                            Cancelar
                        </button>
                        <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg shadow-indigo-900/10">
                            {user ? 'Salvar Alterações' : 'Enviar Convite'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
