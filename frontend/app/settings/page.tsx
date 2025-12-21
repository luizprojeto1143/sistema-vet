"use client";

import React from 'react';
import { User, Building, Shield, Bell, Database, CreditCard, Mail } from 'lucide-react';

export default function SettingsPage() {
    const settingsSections = [
        {
            title: 'Perfil da Clínica',
            description: 'Gerencie logo, endereço e contatos.',
            icon: Building,
            color: 'bg-blue-100 text-blue-600'
        },
        {
            title: 'Usuários e Permissões',
            description: 'Adicione veterinários e recepcionistas.',
            icon: User,
            color: 'bg-green-100 text-green-600'
        },
        {
            title: 'Financeiro e Fiscal',
            description: 'Configure NF-e, taxas e contas bancárias.',
            icon: CreditCard,
            color: 'bg-purple-100 text-purple-600'
        },
        {
            title: 'Notificações',
            description: 'Alertas de vacinas e lembretes.',
            icon: Bell,
            color: 'bg-yellow-100 text-yellow-600'
        },
        {
            title: 'Segurança',
            description: 'Alterar senha e logs de acesso.',
            icon: Shield,
            color: 'bg-red-100 text-red-600'
        },
        {
            title: 'Backup e Dados',
            description: 'Exportar dados e backups automáticos.',
            icon: Database,
            color: 'bg-gray-100 text-gray-600'
        },
        {
            title: 'Integrações',
            description: 'WhatsApp, Email e APIs externas.',
            icon: Mail,
            color: 'bg-teal-100 text-teal-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Configurações</h1>
            <p className="text-gray-500 mb-8">Central de controle do seu sistema VETZ.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {settingsSections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${section.color}`}>
                                <Icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-teal-600 transition-colors">{section.title}</h3>
                            <p className="text-gray-500 text-sm mt-2">{section.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
