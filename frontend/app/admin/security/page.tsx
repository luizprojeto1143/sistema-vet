"use client";

import React, { useState } from 'react';
import {
    ShieldCheckIcon,
    FingerPrintIcon,
    GlobeAltIcon,
    EyeSlashIcon,
    ClockIcon,
    DocumentMagnifyingGlassIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const MOCK_AUDIT_LOGS = [
    { id: 1, action: 'EXPORT_DATA', resource: 'PATIENT_LIST', user: 'Dr. Gabriel', time: '10:42', ip: '192.168.1.50', reason: 'Backup Mensal' },
    { id: 2, action: 'VIEW_RECORD', resource: 'MEDICAL_RECORD #492', user: 'Enf. Carla', time: '10:38', ip: '192.168.1.52', reason: '-' },
    { id: 3, action: 'LOGIN_FAILED', resource: 'AUTH', user: 'admin@vet.com', time: '09:15', ip: '201.55.92.10', reason: 'Senha Incorreta' },
    { id: 4, action: 'DELETE_RECORD', resource: 'TRANSACTION #991', user: 'Financeiro', time: 'Yesterday', ip: '192.168.1.60', reason: 'Lançamento Duplicado' },
];

export default function SecurityPage() {
    const [activeTab, setActiveTab] = useState('DASHBOARD');

    return (
        <div className="p-8 bg-gray-50 min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
                        Segurança e Governança
                    </h1>
                    <p className="text-gray-500 text-sm">Controle de acesso, auditoria e conformidade (LGPD).</p>
                </div>
                <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                    <button
                        onClick={() => setActiveTab('DASHBOARD')}
                        className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${activeTab === 'DASHBOARD' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Painel Geral
                    </button>
                    <button
                        onClick={() => setActiveTab('AUDIT')}
                        className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${activeTab === 'AUDIT' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Logs de Auditoria
                    </button>
                </div>
            </div>

            {activeTab === 'DASHBOARD' && (
                <div className="grid grid-cols-2 gap-6 animate-fadeIn">

                    {/* LOGIN & SESSION POLICY */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                            <FingerPrintIcon className="h-5 w-5 text-indigo-500" />
                            Autenticação e Sessão
                        </h3>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-gray-700">Autenticação em Duas Etapas (MFA)</div>
                                    <div className="text-xs text-gray-500">Exige código extra apenas para Admin e Vet.</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-gray-700">Timeout por Inatividade</div>
                                    <div className="text-xs text-gray-500">Deslogar automaticamente após X minutos.</div>
                                </div>
                                <select className="border border-gray-300 rounded-lg p-2 text-sm">
                                    <option>15 minutos</option>
                                    <option>30 minutos</option>
                                    <option>60 minutos</option>
                                </select>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-gray-700">Bloqueio Automático</div>
                                    <div className="text-xs text-gray-500">Após 5 tentativas erradas de senha.</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* DATA PRIVACY (LGPD) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                            <EyeSlashIcon className="h-5 w-5 text-indigo-500" />
                            Privacidade de Dados (LGPD)
                        </h3>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-gray-700">Mascaramento de Dados</div>
                                    <div className="text-xs text-gray-500">Ocultar CPF/Telefone em listas gerais.</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-gray-700">Log de Acesso Clínico</div>
                                    <div className="text-xs text-gray-500">Registrar visualização de cada prontuário.</div>
                                </div>
                                <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">Obrigatório</span>
                            </div>

                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex gap-2 text-yellow-800 font-bold text-sm mb-1">
                                    <ExclamationTriangleIcon className="h-5 w-5" />
                                    Solicitações LGPD
                                </div>
                                <p className="text-xs text-yellow-700 mb-2">Há 1 solicitação de exportação de dados pendente (Tutor #391).</p>
                                <button className="text-xs font-bold text-indigo-600 hover:underline">Resolver Solicitação</button>
                            </div>
                        </div>
                    </div>

                    {/* NETWORK */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 col-span-2">
                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                            <GlobeAltIcon className="h-5 w-5 text-indigo-500" />
                            Restrição de Rede (IP Whitelist)
                        </h3>
                        <div className="flex gap-4">
                            <input type="text" className="flex-1 p-2 border border-gray-300 rounded-lg" placeholder="Ex: 201.55.0.0/16 (Deixe vazio para liberar tudo)" />
                            <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-200">Salvar IPs</button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Dica: Use isso para impedir que funcionários acessem o sistema de casa.</p>
                    </div>

                </div>
            )}

            {activeTab === 'AUDIT' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 animate-fadeIn flex flex-col h-[600px]">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2">
                            <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                            Trilha de Auditoria (Audit Log)
                        </h3>
                        <button className="text-indigo-600 text-sm font-bold hover:underline">Exportar Relatório</button>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-bold sticky top-0">
                                <tr>
                                    <th className="p-4">Data/Hora</th>
                                    <th className="p-4">Usuário</th>
                                    <th className="p-4">Ação</th>
                                    <th className="p-4">Recurso/Alvo</th>
                                    <th className="p-4">IP</th>
                                    <th className="p-4">Motivo/Detalhe</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {MOCK_AUDIT_LOGS.map(log => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-mono text-gray-600">{log.time}</td>
                                        <td className="p-4 font-bold text-gray-800">{log.user}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${log.action.includes('DELETE') ? 'bg-red-100 text-red-600' :
                                                    log.action.includes('LOGIN_FAIL') ? 'bg-orange-100 text-orange-600' :
                                                        'bg-blue-100 text-blue-600'
                                                }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">{log.resource}</td>
                                        <td className="p-4 font-mono text-xs text-gray-500">{log.ip}</td>
                                        <td className="p-4 text-gray-500 italic">{log.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
}
