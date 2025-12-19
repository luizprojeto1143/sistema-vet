"use client";

import React from 'react';
import { UserPlusIcon, UsersIcon } from '@heroicons/react/24/outline';

const MOCK_VETS = [
    { id: '1', name: 'Dr. Gabriel', spec: 'Clínico' },
    { id: '2', name: 'Dra. Ana', spec: 'Dermatologista' },
    { id: '3', name: 'Dr. Pedro', spec: 'Cirurgião' },
];

export default function CoAuthorModal() {
  return (
    <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm mb-4">
        <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-2">
                <UsersIcon className="h-5 w-5"/>
                Co-Autoria / Equipe Multidisciplinar
            </h4>
            <button className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                <UserPlusIcon className="h-3 w-3"/> Adicionar
            </button>
        </div>

        <div className="space-y-3">
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-700">DG</div>
                    <div>
                        <div className="text-sm font-bold text-gray-800">Dr. Gabriel</div>
                        <div className="text-[10px] text-gray-500">Autor Principal</div>
                    </div>
                </div>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Ativo</span>
            </div>

            <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-700">DA</div>
                    <div>
                        <div className="text-sm font-bold text-gray-800">Dra. Ana</div>
                        <div className="text-[10px] text-gray-500">Dermatologista (Co-autor)</div>
                    </div>
                </div>
                <button className="text-[10px] text-red-500 font-bold hover:underline">Remover</button>
            </div>
        </div>
        
        <p className="text-[10px] text-gray-400 mt-3 italic">
            * Todos os co-autores podem editar este prontuário. Alterações ficam registradas na Trilha de Auditoria individualmente.
        </p>
    </div>
  );
}
