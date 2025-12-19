"use client";

import React, { useState } from 'react';
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';
import RolesPage from './roles/page';
import UserModal from './user-modal';

// Mock Data for MVP
const MOCK_USERS = [
  { id: '1', fullName: 'Dr. Gabriel Martins', email: 'gabriel@vet.com', role: 'Veterinário', roleId: '2', status: 'ACTIVE', lastAccess: 'Hoje, 14:30' },
  { id: '2', fullName: 'Ana Beatriz', email: 'ana@vet.com', role: 'Recepção', roleId: '3', status: 'ACTIVE', lastAccess: 'Hoje, 08:00' },
  { id: '3', fullName: 'Marcos Silva', email: 'marcos@vet.com', role: 'Administrador', roleId: '1', status: 'ACTIVE', lastAccess: 'Ontem' },
  { id: '4', fullName: 'Julia Assistente', email: 'julia@vet.com', role: 'Auxiliar', roleId: '4', status: 'BLOCKED', lastAccess: '12/12/2024' },
];

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans h-screen flex flex-col">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserGroupIcon className="h-8 w-8 text-indigo-600" />
            Controle de Acesso & Equipe
          </h1>
          <p className="text-gray-500 mt-1">Gerencie usuários, funcionários e perfis de permissão.</p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Usuários
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'roles' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Perfis e Permissões
          </button>
        </div>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />

      {/* TABS CONTENT */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'users' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full animate-fadeIn">

            {/* TOOLBAR */}
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
              <div className="relative w-full md:w-96">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Novo Usuário
              </button>
            </div>

            {/* TABLE */}
            <div className="overflow-auto flex-1">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 sticky top-0 z-10">
                  <tr>
                    <th className="p-4">Nome / Email</th>
                    <th className="p-4">Perfil</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Último Acesso</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-gray-400 text-xs">{user.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          <ShieldCheckIcon className="h-3 w-3" />
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {user.status === 'ACTIVE' ? (
                          <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-100">ATIVO</span>
                        ) : (
                          <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold border border-red-100">BLOQUEADO</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-500">
                        {user.lastAccess}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(user)} className="text-gray-400 hover:text-indigo-600 p-1 font-bold">Editar</button>
                          <button className="text-gray-400 hover:text-red-600 p-1" title="Bloquear Acesso">
                            <NoSymbolIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        ) : (
          <div className="h-full">
            <RolesPage />
          </div>
        )}
      </div>

    </div>
  );
}
