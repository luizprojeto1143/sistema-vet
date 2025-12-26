
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Mock data for clinics since we don't have a "List Clinics" endpoint yet
export default function MasterClinicsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [clinics, setClinics] = useState<any[]>([]);

    useEffect(() => {
        // Fetch Real Clinics
        async function fetchClinics() {
            setLoading(true);
            try {
                // Assuming we are "Master" and don't need tenant isolation for this list
                // We might need to handle Auth if protected, but assuming localhost/dev
                const res = await fetch("http://localhost:3001/saas/tenants");
                if (res.ok) {
                    const data = await res.json();
                    setClinics(data);
                }
            } catch (e) {
                console.error("Failed to fetch clinics", e);
            } finally {
                setLoading(false);
            }
        }
        fetchClinics();
    }, []);

    const handleImpersonate = async (clinicId: string) => {
        try {
            setLoading(true);
            // Call the impersonation endpoint
            const res = await fetch("http://localhost:3001/auth/impersonate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clinicId }),
            });

            if (!res.ok) throw new Error("Failed to impersonate");

            const data = await res.json();

            // Store the token (in a real app, manage this carefully)
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect to the Clinic Dashboard
            router.push("/admin/dashboard");
        } catch (error) {
            console.error(error);
            alert("Erro ao acessar painel. Verifique se o backend está rodando e se a clínica possui admin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 font-sans">
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Painel Master - Clínicas</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-100 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Nome da Clínica</th>
                            <th className="p-4 font-semibold text-slate-600">Dono (Admin)</th>
                            <th className="p-4 font-semibold text-slate-600">Plano</th>
                            <th className="p-4 font-semibold text-slate-600">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clinics.map((clinic) => (
                            <tr key={clinic.id} className="border-b hover:bg-slate-50">
                                <td className="p-4">
                                    <div className="font-bold text-slate-700">{clinic.name}</div>
                                    <div className="text-xs text-slate-400">{clinic.id}</div>
                                </td>
                                <td className="p-4">
                                    {clinic.users && clinic.users[0] ? (
                                        <>
                                            <div>{clinic.users[0].fullName}</div>
                                            <div className="text-xs text-slate-400">{clinic.users[0].email}</div>
                                        </>
                                    ) : (
                                        <span className="text-slate-400 italic">Sem admin</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-bold">
                                        {clinic.plan?.name || "Sem Plano"}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleImpersonate(clinic.id)}
                                        disabled={loading || !clinic.users || clinic.users.length === 0}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                    >
                                        Acessar Painel
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {clinics.length === 0 && !loading && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                    Nenhuma clínica encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
