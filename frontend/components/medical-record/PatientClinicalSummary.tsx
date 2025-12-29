import React, { useEffect, useState } from 'react';
import { API_URL } from '@/utils/config';
import {
    HeartIcon,
    ScaleIcon,
    CalendarIcon,
    ExclamationTriangleIcon,
    ShieldCheckIcon,
    BoltIcon
} from '@heroicons/react/24/outline';

export function PatientClinicalSummary({ petId }: { petId: string }) {
    const [summary, setSummary] = useState<any>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/medical-records/patient-summary/${petId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setSummary(await res.json());
        };
        fetchSummary();
    }, [petId]);

    if (!summary) return <div className="p-4 animate-pulse bg-gray-100 rounded-xl h-24 m-6"></div>;

    const { pet, alerts } = summary;

    return (
        <div className="bg-white border-b border-gray-100 py-4 px-6 mb-6 shadow-sm sticky top-0 z-30 opacity-95 backdrop-blur-sm">
            <div className="flex justify-between items-start">

                {/* Pet Info */}
                <div className="flex gap-4 items-center">
                    <img
                        src={pet.photoUrl || "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Mimi"}
                        alt="Pet"
                        className="w-16 h-16 rounded-full border-2 border-white shadow-md bg-gray-100 object-cover"
                    />
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                            {pet.name}
                            <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                                {pet.species} • {pet.breed || 'SRD'}
                            </span>
                        </h1>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600 font-medium h-5">
                            <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4 text-gray-400" /> {new Date(pet.birthDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><ScaleIcon className="w-4 h-4 text-gray-400" /> {summary.lastWeight ? `${summary.lastWeight} kg` : '--'}</span>
                        </div>
                    </div>
                </div>

                {/* Alerts Section (Smart) */}
                <div className="flex-1 flex justify-end gap-3 flex-wrap max-w-2xl">
                    {/* Render Alerts computed by Backend */}
                    {alerts && alerts.map((alert: any, idx: number) => {
                        let style = "bg-blue-50 text-blue-700 border-blue-200";
                        let Icon = ShieldCheckIcon;

                        if (alert.type === 'CRITICAL') {
                            style = "bg-red-50 text-red-700 border-red-200 animate-pulse";
                            Icon = ExclamationTriangleIcon;
                        } else if (alert.type === 'WARNING') {
                            style = "bg-amber-50 text-amber-700 border-amber-200";
                            Icon = BoltIcon;
                        }

                        return (
                            <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold shadow-sm ${style}`}>
                                <Icon className="w-4 h-4" />
                                {alert.message}
                            </div>
                        );
                    })}

                    {/* Internment Status */}
                    {summary.isInterned && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-50 text-pink-700 border border-pink-200 text-xs font-bold shadow-sm">
                            <HeartIcon className="w-4 h-4" /> Em Internação (Box {summary.internmentInfo?.box?.name})
                        </div>
                    )}
                </div>
            </div>

            {/* Context Line - Only if crucial info exists */}
            {(summary.allergies || summary.chronicConditions) && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-6 text-xs font-bold">
                    {summary.allergies && <span className="text-red-600 uppercase">🚨 Alergias: {summary.allergies}</span>}
                    {summary.chronicConditions && <span className="text-indigo-600 uppercase">⚕️ Crônico: {summary.chronicConditions}</span>}
                </div>
            )}
        </div>
    );
}
