export default function AdminDashboard() {
    return (
        <div className="p-4">
            <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Painel Administrativo</h1>
                <p className="text-gray-500 mt-2 font-medium">Visão geral da sua clínica fofinha.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-brand-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="h-16 w-16 bg-brand-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-500 transition-colors duration-300">
                        <span className="text-3xl group-hover:scale-110 transition-transform">🏥</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Clínicas</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Gerencie as unidades, configure horários e personalize a identidade visual.
                    </p>
                    <div className="mt-6">
                        <span className="inline-block py-2 px-4 bg-brand-50 text-brand-600 rounded-full text-sm font-bold">
                            3 Ativas
                        </span>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-brand-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors duration-300">
                        <span className="text-3xl group-hover:scale-110 transition-transform">👥</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Equipe</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Controle de acesso, cadastro de veterinários e permissões de uso.
                    </p>
                    <div className="mt-6">
                        <span className="inline-block py-2 px-4 bg-blue-50 text-blue-600 rounded-full text-sm font-bold">
                            12 Colaboradores
                        </span>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-brand-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="h-16 w-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300">
                        <span className="text-3xl group-hover:scale-110 transition-transform">⚙️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Configurações</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Ajustes globais, regras de agendamento e integrações (Fiscal/Zap).
                    </p>
                    <div className="mt-6">
                        <span className="inline-block py-2 px-4 bg-amber-50 text-amber-600 rounded-full text-sm font-bold">
                            Sistema Atualizado
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
