import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, Syringe, Users, TestTube2, ShoppingCart, Settings, LogOut, Calendar } from 'lucide-react';

const MainLayout = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Agenda', icon: Calendar, path: '/agenda' },
        { name: 'Consultório', icon: Stethoscope, path: '/consultorio' },
        { name: 'AnalisaVet', icon: TestTube2, path: '/analisavet' },
        { name: 'Internação', icon: Syringe, path: '/internacao' },
        { name: 'Pacientes', icon: Users, path: '/pacientes' },
        { name: 'Estoque', icon: ShoppingCart, path: '/estoque' },
        { name: 'Configurações', icon: Settings, path: '/configuracoes' },
    ];

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                        V
                    </div>
                    <span className="font-bold text-lg">VetSystem Pro</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto border-t border-border pt-4">
                    <button className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-destructive w-full transition-colors">
                        <LogOut size={20} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-muted/20">
                <header className="h-16 border-b border-border bg-card flex items-center px-6 justify-between sticky top-0 z-10">
                    <h1 className="font-semibold text-lg capitalize">
                        {menuItems.find(i => i.path === location.pathname)?.name || 'VetSystem'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Dr. Veterinário</span>
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center">
                            D
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
