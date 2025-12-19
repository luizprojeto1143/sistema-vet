import {
    Squares2X2Icon,
    BuildingOfficeIcon,
    CreditCardIcon,
    Cog6ToothIcon,
    ArrowLeftStartOnRectangleIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function SaasLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full z-10 flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        VetSaaS <span className="text-xs text-slate-400 block font-light tracking-widest">OWNER PANEL</span>
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <Link href="/saas" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all font-medium">
                        <Squares2X2Icon className="h-5 w-5" /> Dashboard
                    </Link>
                    <Link href="/saas/tenants" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all font-medium">
                        <BuildingOfficeIcon className="h-5 w-5" /> Clínicas (Tenants)
                    </Link>
                    <Link href="/saas/plans" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all font-medium">
                        <CreditCardIcon className="h-5 w-5" /> Planos
                    </Link>
                    <Link href="/saas/growth" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all font-medium">
                        <RocketLaunchIcon className="h-5 w-5" /> Growth (MGM)
                    </Link>
                    <Link href="/saas/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all font-medium">
                        <Cog6ToothIcon className="h-5 w-5" /> Config Global
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center gap-2 text-red-400 hover:text-red-300 w-full px-4 py-2 text-sm font-bold">
                        <ArrowLeftStartOnRectangleIcon className="h-5 w-5" /> Sair
                    </button>
                    <p className="text-center text-[10px] text-slate-600 mt-2">v2.0.0 (Master)</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 animate-fade-in">
                {children}
            </main>
        </div>
    );
}
