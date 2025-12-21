"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-0 transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
