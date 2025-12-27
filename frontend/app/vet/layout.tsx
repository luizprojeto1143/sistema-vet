"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/auth-guard';

export default function VetLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menu = [
        { name: '📊 Painel', path: '/vet' },
        { name: '📅 Agenda', path: '/vet/appointments' },
        { name: '🐕 Pacientes', path: '/vet/patients' },
        { name: '🏥 Internação', path: '/vet/internment' },
        // { name: '🩺 Telemedicina', path: '/vet/telemedicine' }, // Uncomment when ready
    ];

    const isConsultation = pathname?.includes('/consultation');

    return (
        <AuthGuard allowedRoles={['VET', 'MASTER', 'ADMIN']}>
            <div className="flex min-h-screen bg-brand-50 font-sans">
                {/* Sidebar - Hidden on Consultation Page for Focus Mode */}
                {!isConsultation && (
                    <aside className="w-72 bg-white text-gray-600 flex flex-col shadow-2xl rounded-r-[2.5rem] z-20 my-4 ml-4 h-[calc(100vh-2rem)] sticky top-4 overflow-hidden border border-brand-100">
                        <div className="p-8 text-3xl font-extrabold text-brand-600 bg-brand-50/50 border-b border-brand-100 flex items-center gap-3">
                            <span className="text-4xl">🩺</span> Vet
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
                )}

                {/* Content */}
                <main className={`flex-1 overflow-y-auto ${isConsultation ? 'p-0' : 'p-8'}`}>
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
