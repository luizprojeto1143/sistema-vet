"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Stethoscope,
    Calendar,
    DollarSign,
    Settings,
    LogOut,
    Package,
    Users,
    Activity
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/vet', label: 'Atendimento', icon: Stethoscope },
        { href: '/agenda', label: 'Agenda', icon: Calendar },
        { href: '/finance', label: 'Financeiro', icon: DollarSign },
        { href: '/stock', label: 'Estoque', icon: Package },
        { href: '/tutor', label: 'Tutores', icon: Users },
        { href: '/analisavet', label: 'AnalisaVet AI', icon: Activity },
        { href: '/settings', label: 'Configurações', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex flex-col z-50">
            {/* Logo */}
            <div className="p-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-teal-200">
                    V
                </div>
                <div>
                    <h1 className="font-bold text-xl text-gray-800 tracking-tight">VETZ</h1>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Sistema Premium</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-teal-50 text-teal-700 font-bold shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <Icon
                                size={20}
                                className={`transition-colors ${isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                            />
                            <span>{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-gray-100">
                <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold border-2 border-white shadow-sm">
                        AD
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-gray-800 truncate">Admin User</p>
                        <p className="text-xs text-gray-500 truncate">admin@vet.com</p>
                    </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm font-medium">
                    <LogOut size={16} /> Sair do Sistema
                </button>
            </div>
        </aside>
    );
}
