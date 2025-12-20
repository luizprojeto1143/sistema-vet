import Link from 'next/link';

export default function VetDashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Painel Veterinário</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded shadow border-l-4 border-teal-500">
                    <h2 className="text-xl font-bold mb-4">Meus Pacientes (Hoje)</h2>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>Thor - Golden Retriever</span>
                            <Link href="/vet/appointments" className="text-teal-600 font-semibold text-sm hover:underline">Iniciar Atendimento</Link>
                        </li>
                        <li className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>Mia - Persa</span>
                            <span className="text-gray-400 text-sm">Agendado 14:00</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded shadow border-l-4 border-red-500">
                    <h2 className="text-xl font-bold mb-4">Internação (Alertas)</h2>
                    <ul className="space-y-3">
                        <li className="p-3 bg-red-50 text-red-700 rounded text-sm">
                            <strong>Bob:</strong> Medicação atrasada (10min)
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
