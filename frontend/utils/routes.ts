import {
    LayoutDashboard,
    Stethoscope,
    Calendar,
    DollarSign,
    Settings,
    Package,
    Users,
    Activity,
    Clipboard,
    Megaphone,
    Shield,
    Briefcase
} from 'lucide-react';

export const APP_ROUTES = {
    DASHBOARD: '/',
    VET: {
        ROOT: '/vet',
        APPOINTMENTS: '/vet/appointments',
        PATIENTS: '/vet/patients',
        INTERNMENT: '/vet/internment',
    },
    ADMIN: {
        ROOT: '/admin',
        PULSE: '/admin/pulse',
        FINANCE: '/admin/finance',
        STOCK: '/admin/products',
        USERS: '/admin/users',
        SERVICES: '/admin/services',
        SETTINGS: '/admin/settings',
        MARKETING: '/admin/marketing',
        HR: '/admin/hr',
        CX: '/admin/cx',
        SECURITY: '/admin/security',
    },
    APPS: {
        RECEPTION: '/reception',
        PETSHOP: '/petshop',
        ANALISAVET: '/analisavet',
    }
};

export const MAIN_MENU_ITEMS = [
    { href: APP_ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { href: APP_ROUTES.VET.ROOT, label: 'Painel Vet', icon: Stethoscope },
    { href: '/agenda', label: 'Agenda', icon: Calendar },
    { href: APP_ROUTES.ADMIN.FINANCE, label: 'Financeiro', icon: DollarSign },
    { href: APP_ROUTES.ADMIN.STOCK, label: 'Estoque', icon: Package },
    { href: APP_ROUTES.APPS.RECEPTION, label: 'Recepção', icon: Clipboard },
    { href: APP_ROUTES.ADMIN.HR, label: 'RH & Escalas', icon: Briefcase },
    { href: APP_ROUTES.APPS.PETSHOP, label: 'Petshop', icon: Package },
    { href: '/admin/tutors', label: 'Tutores', icon: Users },
    { href: APP_ROUTES.ADMIN.MARKETING, label: 'Marketing', icon: Megaphone },
    { href: APP_ROUTES.ADMIN.USERS, label: 'Usuários', icon: Users },
    { href: APP_ROUTES.APPS.ANALISAVET, label: 'AnalisaVet AI', icon: Activity },
    { href: APP_ROUTES.ADMIN.SETTINGS, label: 'Configurações', icon: Settings },
];
