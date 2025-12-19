"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TutorAppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Don't show nav on onboarding or login
    if (pathname.includes('onboarding') || pathname.includes('login')) {
        return <>{children}</>;
    }

    return (
        <div className="bg-brand-50 min-h-screen pb-24 font-sans">
            {children}

            {/* Mobile Bottom Nav */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-brand-100 flex justify-around py-4 px-2 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[2rem]">
                <Link href="/tutor/home" className={`flex flex-col items-center group ${pathname.includes('home') ? 'text-brand-500' : 'text-gray-400 hover:text-brand-300'}`}>
                    <span className={`text-2xl mb-1 transition-transform group-active:scale-90 ${pathname.includes('home') ? '-translate-y-1' : ''}`}>🏠</span>
                    <span className="text-[10px] font-extrabold tracking-wide">Início</span>
                </Link>
                <Link href="/tutor/pets" className={`flex flex-col items-center group ${pathname.includes('pets') ? 'text-brand-500' : 'text-gray-400 hover:text-brand-300'}`}>
                    <span className={`text-2xl mb-1 transition-transform group-active:scale-90 ${pathname.includes('pets') ? '-translate-y-1' : ''}`}>🐾</span>
                    <span className="text-[10px] font-extrabold tracking-wide">Pets</span>
                </Link>
                <div className="relative -top-8">
                    <Link href="/tutor/appointments/new" className="h-16 w-16 bg-brand-500 rounded-full flex items-center justify-center shadow-lg shadow-brand-500/40 text-3xl border-4 border-brand-50 transform active:scale-95 transition-transform">
                        📅
                    </Link>
                </div>
                <Link href="/tutor/schedule" className={`flex flex-col items-center group ${pathname.includes('schedule') ? 'text-brand-500' : 'text-gray-400 hover:text-brand-300'}`}>
                    <span className={`text-2xl mb-1 transition-transform group-active:scale-90 ${pathname.includes('schedule') ? '-translate-y-1' : ''}`}>📆</span>
                    <span className="text-[10px] font-extrabold tracking-wide">Agenda</span>
                </Link>
                <Link href="/tutor/profile" className={`flex flex-col items-center group ${pathname.includes('profile') ? 'text-brand-500' : 'text-gray-400 hover:text-brand-300'}`}>
                    <span className={`text-2xl mb-1 transition-transform group-active:scale-90 ${pathname.includes('profile') ? '-translate-y-1' : ''}`}>👤</span>
                    <span className="text-[10px] font-extrabold tracking-wide">Perfil</span>
                </Link>
            </div>
        </div>
    );
}
