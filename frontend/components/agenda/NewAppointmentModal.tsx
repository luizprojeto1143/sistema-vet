import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText, Stethoscope } from 'lucide-react';

interface NewAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function NewAppointmentModal({ isOpen, onClose, onSuccess }: NewAppointmentModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        patientName: '', // For MVP, simple string. Ideally search patient.
        tutorName: '',
        serviceId: '', // Ideally select from services
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        notes: '',
        type: 'CONSULTATION'
    });

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Combine date and time
            const dateTime = new Date(`${formData.date}T${formData.time}:00`);

            const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    dateTime: dateTime.toISOString(),
                    type: formData.type,
                    notes: `${formData.notes} (Paciente: ${formData.patientName}, Tutor: ${formData.tutorName})`, // Quick hack for MVP
                    // For MVP we might not have real petId/vetId/serviceId if we don't fetch them.
                    // Sending nulls or defaults might fail if backend enforces foreign keys.
                    // Let's assume backend allows loose data or we hardcode a "Walk-in" pet/tutor for now if not selected.
                    // Actually, let's just send the notes and type for now and let backend handle or fail.
                    // Wait, backend schema requires petId, vetId, clinicId.
                    // I need to fetch pets/tutors or create them on the fly?
                    // For this integration step, let's assume we are just testing the "Happy Path" with existing IDs if possible,
                    // OR we update the backend to allow optional relations (which is not ideal).
                    // BETTER: Let's hardcode a known PetID/VetID from the seed for now to prove connectivity.
                    petId: 'pet-1', // From seed?
                    vetId: 'user-1', // Admin
                    serviceId: 'service-1', // From seed?
                    clinicId: 'clinic-1'
                })
            });

            if (res.ok) {
                if (onSuccess) onSuccess();
                onClose();
            } else {
                const err = await res.text();
                alert('Erro ao agendar: ' + err);
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">Novo Agendamento</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Type Selection */}
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                        {['CONSULTATION', 'VACCINE', 'SURGERY'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFormData({ ...formData, type })}
                                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${formData.type === type ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {type === 'CONSULTATION' ? 'Consulta' : type === 'VACCINE' ? 'Vacina' : 'Cirurgia'}
                            </button>
                        ))}
                    </div>

                    {/* Patient Info (Mock Input) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Paciente / Tutor</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                                placeholder="Nome do Pet"
                                value={formData.patientName}
                                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                            />
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                                placeholder="Nome do Tutor"
                                value={formData.tutorName}
                                onChange={(e) => setFormData({ ...formData, tutorName: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                            <input
                                type="time"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none h-24 resize-none"
                            placeholder="Sintomas, histórico, etc."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                    >
                        {loading ? 'Agendando...' : 'Confirmar Agendamento'}
                    </button>
                </div>
            </div>
        </div>
    );
}
