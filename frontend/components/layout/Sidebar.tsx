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
    Activity,
    ChevronLeft,
    ChevronRight,
    Menu
} from 'lucide-react';

interface SidebarProps {
    isCollapsed?: boolean;
    toggle?: () => void;
}

export default function Sidebar({ isCollapsed = false, toggle }: SidebarProps) {
    const pathname = usePathname();

    const menuItems = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/vet', label: 'Atendimento', icon: Stethoscope },
        { href: '/agenda', label: 'Agenda', icon: Calendar },
        { href: '/finance', label: 'Financeiro', icon: DollarSign },
        { href: '/stock', label: 'Estoque', icon: Package },
        { href: '/admin/tutors', label: 'Tutores', icon: Users },
        { href: '/analisavet', label: 'AnalisaVet AI', icon: Activity },
        { href: '/settings', label: 'Configurações', icon: Settings },
    ];

    return (
        <aside
            className={`bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex flex-col z-50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
        >
            {/* Logo */}
            <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-teal-200 shrink-0">
                    V
                </div>
                {!isCollapsed && (
                    <div className="animate-in fade-in duration-200 overflow-hidden whitespace-nowrap">
                        <h1 className="font-bold text-xl text-gray-800 tracking-tight">VETZ</h1>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Sistema Premium</p>
                    </div>
                )}
            </div>

            {/* Toggle Button (Desktop) */}
            <button
                onClick={toggle}
                className="absolute -right-3 top-10 bg-white border border-gray-200 rounded-full p-1 text-gray-400 hover:text-teal-600 shadow-sm z-50 hidden md:flex"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-2 overflow-y-auto mt-2 scrollbar-hide">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={isCollapsed ? item.label : ''}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-teal-50 text-teal-700 font-bold shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                } ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            <Icon
                                size={22}
                                className={`transition-colors shrink-0 ${isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                            />
                            {!isCollapsed && <span className="whitespace-nowrap overflow-hidden text-sm">{item.label}</span>}

                            {!isCollapsed && isActive && (
                                <div className="ml-auto w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-gray-100">
                <div className={`bg-gray-50 p-2 rounded-xl flex items-center gap-3 mb-2 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold border-2 border-white shadow-sm shrink-0">
                        AD
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 overflow-hidden animate-in fade-in duration-200">
                            <p className="text-sm font-bold text-gray-800 truncate">Admin User</p>
                            <p className="text-xs text-gray-500 truncate">admin@vet.com</p>
                        </div>
                    )}
                </div>
                <button className={`w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm font-medium ${isCollapsed ? 'px-0' : ''}`} title="Sair">
                    <LogOut size={20} className="shrink-0" /> {!isCollapsed && <span>Sair</span>}
                </button>
            </div>
        </aside>
    );
}
