"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from "@/components/admin/sidebar";
import Header from "@/components/admin/header";
import CommandPalette from "@/components/ui/command-palette";
import RagChatWidget from "@/components/ai/rag-chat-widget";

import AuthGuard from '@/components/auth-guard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menu = [
        { name: '📊 Dashboard', path: '/admin' },
        { name: '👥 Usuários & Acesso', path: '/admin/users' },
        { name: '🩺 Serviços & Preços', path: '/admin/services' },
        { name: '⚙️ Configurações & Regras', path: '/admin/settings' },
        { name: '📄 Documentos & Templates', path: '/admin/settings/documents' },
        { name: '📦 Produtos (Estoque)', path: '/admin/products' },
        { name: '🏥 Internação (Config)', path: '/admin/settings/internment' },
        { name: '💰 Financeiro', path: '/admin/finance/commissions' },
    ];

    return (
        <AuthGuard allowedRoles={['ADMIN', 'MASTER', 'VET', 'RECEPTION']}>
            <div className="flex min-h-screen bg-brand-50 font-sans">
                {/* Global Command Palette */}
                <CommandPalette />

                {/* Global AI Chat */}
                <RagChatWidget />

                {/* Sidebar */}
                <aside className="w-72 bg-white text-gray-600 flex flex-col shadow-2xl rounded-r-[2.5rem] z-20 my-4 ml-4 h-[calc(100vh-2rem)] sticky top-4 overflow-hidden border border-brand-100">
                    <div className="p-8 text-3xl font-extrabold text-brand-600 bg-brand-50/50 border-b border-brand-100 flex items-center gap-3">
                        <span className="text-4xl">⚙️</span> Admin
                    </div>
                    <nav className="flex-1 p-6 space-y-3 overflow-y-auto custom-scrollbar">
                        {menu.map(item => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`block p-4 rounded-2xl transition-all duration-200 font-bold flex items-center gap-3 ${pathname === item.path
                                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 transform scale-105'
                                    : 'hover:bg-brand-50 text-gray-500 hover:text-brand-500 hover:pl-6'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                        <Link href="/vet" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-600 transition-colors mb-4 p-2 hover:bg-white rounded-xl">
                            <span>←</span> Voltar para Sistema
                        </Link>
                        <button
                            onClick={() => {
                                localStorage.clear();
                                window.location.href = '/login';
                            }}
                            className="w-full py-3 px-4 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            <span>🚪</span> Sair
                        </button>
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
