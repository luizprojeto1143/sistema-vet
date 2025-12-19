"use client";

import React, { useState } from 'react';
import {
    ShieldCheckIcon,
    WrenchScrewdriverIcon,
    DocumentTextIcon,
    DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

export default function GlobalSettingsPage() {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [byokEnabled, setByokEnabled] = useState(true);
    const [minVersion, setMinVersion] = useState('1.2.0');

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
            <h1 className="text-3xl font-bold mb-2">Configurações Globais</h1>
            <p className="text-slate-400 mb-8">Definições que afetam todo o ecossistema SaaS.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* SECURITY & CONTROL */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 border-b border-slate-700 pb-4">
                        <WrenchScrewdriverIcon className="h-6 w-6 text-indigo-500" />
                        Controle Operacional
                    </h2>

                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                        <div>
                            <div className="font-bold text-white">Modo Manutenção</div>
                            <div className="text-xs text-slate-400">Bloqueia acesso de todas as clínicas, exceto Admins.</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                        <div>
                            <div className="font-bold text-white">BYOK Global (Bring Your Own Key)</div>
                            <div className="text-xs text-slate-400">Permitir que clínicas usem suas próprias chaves de IA.</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={byokEnabled} onChange={(e) => setByokEnabled(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>
                </div>

                {/* LEGAL DOCS */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 border-b border-slate-700 pb-4">
                        <DocumentTextIcon className="h-6 w-6 text-indigo-500" />
                        Jurídico / Legal
                    </h2>

                    <div>
                        <label className="block text-sm font-bold mb-2">Termos de Uso (URL)</label>
                        <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2" defaultValue="https://vetSaaS.com/terms" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Política de Privacidade (URL)</label>
                        <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2" defaultValue="https://vetSaaS.com/privacy" />
                    </div>
                </div>

                {/* MOBILE APP */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-6 md:col-span-2">
                    <h2 className="text-xl font-bold flex items-center gap-2 border-b border-slate-700 pb-4">
                        <DevicePhoneMobileIcon className="h-6 w-6 text-indigo-500" />
                        Versões do App Mobile
                    </h2>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">Versão Mínima iOS</label>
                            <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2" value={minVersion} onChange={(e) => setMinVersion(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Versão Mínima Android</label>
                            <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2" defaultValue="1.5.0" />
                        </div>
                    </div>
                    <div className="bg-blue-500/10 text-blue-400 text-xs p-3 rounded">
                        <strong>Nota:</strong> Usuários com versões abaixo destas serão forçados a atualizar o app ao abrir.
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-lg font-bold shadow-lg shadow-indigo-900/50">
                    Salvar Alterações Globais
                </button>
            </div>
        </div>
    );
}
