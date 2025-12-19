"use client";

import React, { useState } from 'react';
import {
    ShieldCheckIcon,
    PencilIcon,
    TrashIcon,
    PlusIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

const MOCK_ROLES = [
    { id: '1', name: 'Administrador', users: 2, isSystem: true, permissions: ['*'] },
    { id: '2', name: 'Veterinário', users: 5, isSystem: true, permissions: ['medical.view', 'medical.edit', 'prescription.create'] },
    { id: '3', name: 'Recepcionista', users: 3, isSystem: false, permissions: ['agenda.view', 'agenda.edit', 'tutor.view'] },
    { id: '4', name: 'Estágiario', users: 1, isSystem: false, permissions: ['agenda.view', 'medical.view'] },
];

const PERMISSION_GROUPS = [
    {
        name: 'Agenda & Recepção',
        perms: [
            { key: 'agenda.view', label: 'Ver Agenda' },
            { key: 'agenda.edit', label: 'Editar Agendamentos' },
            { key: 'tutor.create', label: 'Cadastrar Tutores' },
        ]
    },
    {
        name: 'Prontuário & Médico',
        perms: [
            { key: 'medical.view', label: 'Ver Prontuários' },
            { key: 'medical.edit', label: 'Editar Prontuários' },
            { key: 'prescription.create', label: 'Criar Receitas' },
        ]
    },
    {
        name: 'Financeiro & Estoque',
        perms: [
            { key: 'finance.view', label: 'Ver Financeiro' },
            { key: 'finance.edit', label: 'Aprovar/Editar Transações' },
            { key: 'stock.view', label: 'Ver Estoque' },
            { key: 'stock.adjust', label: 'Ajustar/Entrada Estoque' },
        ]
    }
];

export default function RolesPage() {
    const [roles, setRoles] = useState(MOCK_ROLES);
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleSelectRole = (role: any) => {
        setSelectedRole(role);
        setIsEditing(false); // View mode first
    };

    const handleCreate = () => {
        setSelectedRole({ id: 'new', name: 'Novo Cargo', isSystem: false, permissions: [] });
        setIsEditing(true);
    };

    const togglePermission = (key: string) => {
        if (!selectedRole) return;
        const perms = selectedRole.permissions.includes(key)
            ? selectedRole.permissions.filter((p: string) => p !== key)
            : [...selectedRole.permissions, key];
        setSelectedRole({ ...selectedRole, permissions: perms });
    };

    return (
        <div className="p-8 h-screen flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
                        Perfis de Acesso (Cargos)
                    </h1>
                    <p className="text-sm text-gray-500">Defina o que cada função pode acessar no sistema.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    Novo Perfil
                </button>
            </div>

            <div className="flex gap-6 flex-1 overflow-hidden">
                {/* LIST */}
                <div className="w-1/3 bg-white border border-gray-200 rounded-xl overflow-y-auto">
                    <div className="p-4 border-b border-gray-100 font-bold text-gray-700">Cargos Existentes</div>
                    <div className="divide-y divide-gray-100">
                        {roles.map(role => (
                            <div
                                key={role.id}
                                onClick={() => handleSelectRole(role)}
                                className={`p-4 cursor-pointer hover:bg-indigo-50 transition-colors ${selectedRole?.id === role.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`}
                            >
                                <div className="font-bold text-gray-800 flex justify-between">
                                    {role.name}
                                    {role.isSystem && <span className="text-[10px] uppercase bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Sistema</span>}
                                </div>
                                <div className="text-sm text-gray-500">{role.users} usuários vinculados</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* EDITOR */}
                <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col">
                    {selectedRole ? (
                        <>
                            <div className="p-6 border-b border-gray-200 flex justify-between items-start bg-gray-50 rounded-t-xl">
                                <div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="text-xl font-bold text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={selectedRole.name}
                                            onChange={e => setSelectedRole({ ...selectedRole, name: e.target.value })}
                                        />
                                    ) : (
                                        <h2 className="text-xl font-bold text-gray-900">{selectedRole.name}</h2>
                                    )}
                                    <p className="text-sm text-gray-500 mt-1">Configure as permissões deste perfil.</p>
                                </div>
                                <div className="flex gap-2">
                                    {!isEditing && !selectedRole.isSystem && (
                                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg hover:bg-indigo-100">
                                            <PencilIcon className="h-4 w-4" /> Editar
                                        </button>
                                    )}
                                    {isEditing && (
                                        <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 text-sm font-bold text-green-600 bg-green-50 px-3 py-2 rounded-lg hover:bg-green-100">
                                            <CheckIcon className="h-4 w-4" /> Salvar
                                        </button>
                                    )}
                                    {!selectedRole.isSystem && (
                                        <button className="flex items-center gap-1 text-sm font-bold text-red-600 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100">
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-6">
                                    {PERMISSION_GROUPS.map(group => (
                                        <div key={group.name} className="border border-gray-200 rounded-lg p-4">
                                            <h3 className="font-bold text-gray-700 mb-3 uppercase text-xs tracking-wider">{group.name}</h3>
                                            <div className="space-y-2">
                                                {group.perms.map(perm => (
                                                    <label key={perm.key} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedRole.permissions.includes(perm.key) ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                                                        <input
                                                            type="checkbox"
                                                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                            checked={selectedRole.permissions.includes(perm.key) || selectedRole.permissions.includes('*')}
                                                            disabled={!isEditing || selectedRole.isSystem || selectedRole.permissions.includes('*')}
                                                            onChange={() => togglePermission(perm.key)}
                                                        />
                                                        <span className={`text-sm font-medium ${selectedRole.permissions.includes(perm.key) ? 'text-indigo-900' : 'text-gray-600'}`}>
                                                            {perm.label}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <ShieldCheckIcon className="h-16 w-16 mb-4 opacity-20" />
                            <p>Selecione um cargo para editar as permissões.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
