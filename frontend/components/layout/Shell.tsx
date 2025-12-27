"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() || '';
    const isLoginPage = pathname === '/login';
    const isSaasPage = pathname.startsWith('/saas');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    if (isLoginPage || isSaasPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <main
                className={`flex-1 p-0 transition-all duration-300 relative z-0 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}
            >
                {children}
            </main>
        </div>
    );
}
