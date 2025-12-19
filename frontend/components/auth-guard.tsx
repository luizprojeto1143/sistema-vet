"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children, allowedRoles = [] }: { children: React.ReactNode, allowedRoles?: string[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            // Not logged in
            console.warn(`Access denied to ${pathname}: No token found.`);
            router.push('/login');
            return;
        }

        try {
            const user = JSON.parse(userStr);

            // Optional: Role Check
            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                console.warn(`Access denied to ${pathname}: Role ${user.role} not allowed.`);
                // If role mismatch, maybe redirect to a forbidden page or their home
                if (user.role === 'TUTOR') router.push('/tutor');
                else router.push('/login'); // Fallback
                return;
            }

            setAuthorized(true);

        } catch (e) {
            console.error("Auth Error:", e);
            localStorage.clear();
            router.push('/login');
        }

    }, [router, pathname, allowedRoles]);

    if (!authorized) {
        // Show loading or nothing while checking
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Verificando acesso...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
