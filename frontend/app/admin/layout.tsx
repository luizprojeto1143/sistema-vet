"use client";

import Sidebar from "@/components/layout/Sidebar"; // Use the real Sidebar
import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/auth-guard';
// import CommandPalette from '@/components/ui/CommandPalette'; // TODO: Implement or find
// import RagChatWidget from '@/components/ai/RagChatWidget'; // TODO: Implement or find

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AuthGuard allowedRoles={['ADMIN', 'MASTER', 'VET', 'RECEPTION']}>
            <div className="flex min-h-screen bg-brand-50 font-sans">
                {/* Global Command Palette */}
                {/* <CommandPalette /> */}

                {/* Global AI Chat */}
                {/* <RagChatWidget /> */}

                {/* Sidebar - Using the Component now */}
                <div className="z-20 my-4 ml-4 h-[calc(100vh-2rem)] sticky top-4">
                    <Sidebar />
                </div>

                {/* Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
