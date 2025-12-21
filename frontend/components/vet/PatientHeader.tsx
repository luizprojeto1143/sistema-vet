import React from 'react';
import { User, Phone, AlertTriangle, Activity } from 'lucide-react';

interface PatientHeaderProps {
    pet: any;
    tutor: any;
}

export default function PatientHeader({ pet, tutor }: PatientHeaderProps) {
    if (!pet) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

            {/* Avatar */}
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-3xl text-gray-400">
                    {pet.photoUrl ? (
                        <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
                    ) : (
                        <span>🐾</span>
                    )}
                </div>
                {pet.isCastrated && (
                    <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-sm" title="Castrado">
                        ✂️
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-gray-800">{pet.name}</h1>
                    <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                        {pet.species === 'DOG' ? 'Cão' : pet.species === 'CAT' ? 'Gato' : pet.species}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded">
                        {pet.id.split('-')[0]}
                    </span>
                </div>

                <p className="text-gray-500 text-sm mb-3">
                    {pet.breed || 'SRD'} • {pet.gender === 'MALE' ? 'Macho' : 'Fêmea'} • {pet.age || 'N/A'} • {pet.weight ? `${pet.weight} kg` : '-- kg'}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <User size={16} className="text-gray-400" />
                        <span className="font-medium">{tutor?.fullName || 'Tutor Desconhecido'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Phone size={16} className="text-gray-400" />
                        <span>{tutor?.phone || '--'}</span>
                    </div>
                </div>
            </div>

            {/* Alerts */}
            <div className="flex flex-col gap-2 items-end">
                {pet.allergies && (
                    <div className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2">
                        <AlertTriangle size={16} /> Alérgico: {pet.allergies}
                    </div>
                )}
                {pet.chronicConditions && (
                    <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-sm font-medium border border-orange-100 flex items-center gap-2">
                        <Activity size={16} /> {pet.chronicConditions}
                    </div>
                )}
            </div>
        </div>
    );
}
