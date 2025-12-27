import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, FileText, Dog, ChevronLeft, Check, Plus } from 'lucide-react';
import Autocomplete from '../ui/Autocomplete';

interface NewAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialTime?: string;
}

// Simple types for local state
interface Tutor { id: string; fullName: string; phone: string; pets: Pet[] }
interface Pet { id: string; name: string; species: string }

export default function NewAppointmentModal({ isOpen, onClose, onSuccess, initialTime }: NewAppointmentModalProps) {
    const [step, setStep] = useState(1); // 1: Tutor, 2: Pet, 3: Details
    const [loading, setLoading] = useState(false);

    // Selection State
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

    // Creation State (Inline)
    const [isCreatingTutor, setIsCreatingTutor] = useState(false);
    const [newTutorName, setNewTutorName] = useState('');
    const [newTutorPhone, setNewTutorPhone] = useState('');

    const [isCreatingPet, setIsCreatingPet] = useState(false);
    const [newPetName, setNewPetName] = useState('');
    const [newPetSpecies, setNewPetSpecies] = useState('DOG');

    // Details State
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        time: initialTime || '09:00',
        notes: '',
        type: 'CONSULTATION'
    });

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedTutor(null);
            setSelectedPet(null);
            setIsCreatingTutor(false);
            setIsCreatingPet(false);
            if (initialTime) setFormData(prev => ({ ...prev, time: initialTime }));
        }
    }, [isOpen, initialTime]);

    if (!isOpen) return null;

    // --- Actions ---

    const handleTutorSearch = async (query: string) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/tutors/search?q=${query}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.ok ? await res.json() : [];
    };

    const handleCreateTutor = () => {
        // Mock creation for UI flow - in reality we treat "New Tutor" as a flag or create immediately?
        // Let's create a "Virtual" tutor object to proceed to Step 2
        setSelectedTutor({
            id: 'NEW',
            fullName: newTutorName,
            phone: newTutorPhone,
            pets: []
        });
        setStep(2); // Move to Pet
    };

    const handleCreatePet = () => {
        setSelectedPet({
            id: 'NEW',
            name: newPetName,
            species: newPetSpecies
        });
        setStep(3); // Move to Details
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const dateTime = new Date(`${formData.date}T${formData.time}:00`);

            const payload: any = {
                dateTime: dateTime.toISOString(),
                type: formData.type,
                notes: formData.notes,
                clinicId: 'clinic-1',
                // Resolving IDs or Names
                vetId: 'user-1', // Default until we add Vet Selector
                serviceId: 'service-1'
            };

            if (selectedTutor?.id === 'NEW') {
                payload.tutorName = selectedTutor.fullName;
                // If creating completely new structure, backend supports it
            } else {
                payload.tutorId = selectedTutor?.id;
            }

            if (selectedPet?.id === 'NEW') {
                payload.patientName = selectedPet.name;
                // Backend will create pet linked to tutor
            } else {
                payload.petId = selectedPet?.id;
            }

            if (!payload.petId && !payload.patientName) {
                // Should not happen in this flow
                alert("Selecione um Pet");
                setLoading(false);
                return;
            }

            const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-2">
                        {step > 1 && (
                            <button onClick={() => setStep(step - 1)} className="text-gray-400 hover:text-gray-600">
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <h3 className="text-lg font-bold text-gray-800">
                            {step === 1 ? 'Identificar Tutor' : step === 2 ? 'Selecionar Pet' : 'Detalhes do Agendamento'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="flex w-full h-1 bg-gray-100">
                    <div className={`h-full bg-teal-500 transition-all duration-300 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`} />
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">

                    {/* STEP 1: TUTOR */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            {!isCreatingTutor ? (
                                <>
                                    <p className="text-sm text-gray-500">Busque pelo nome, CPF ou telefone do tutor.</p>
                                    <Autocomplete
                                        label="Buscar Tutor"
                                        placeholder="Ex: Maria Silva"
                                        onSearch={handleTutorSearch}
                                        displayField={(item) => (
                                            <div>
                                                <div className="font-bold text-gray-800">{item.fullName}</div>
                                                <div className="text-xs text-gray-400 flex gap-2">
                                                    <span>CPF: {item.cpf || '---'}</span>
                                                    <span>Tel: {item.phone || '---'}</span>
                                                </div>
                                                <div className="text-xs text-teal-600 mt-1">
                                                    {item.pets?.length || 0} pets cadastrados
                                                </div>
                                            </div>
                                        )}
                                        onSelect={(tutor) => {
                                            setSelectedTutor(tutor);
                                            setStep(2);
                                        }}
                                        onCreateNew={(query) => {
                                            setNewTutorName(query);
                                            setIsCreatingTutor(true);
                                        }}
                                    />
                                </>
                            ) : (
                                <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <h4 className="font-bold text-gray-700 flex items-center gap-2">
                                        <Plus size={16} className="text-teal-600" /> Novo Cadastro Rápido
                                    </h4>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo</label>
                                        <input
                                            value={newTutorName}
                                            onChange={e => setNewTutorName(e.target.value)}
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Telefone</label>
                                        <input
                                            value={newTutorPhone}
                                            onChange={e => setNewTutorPhone(e.target.value)}
                                            className="w-full p-2 border rounded-lg"
                                            placeholder="(00) 00000-0000"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button onClick={() => setIsCreatingTutor(false)} className="text-sm text-gray-500 hover:underline">Cancelar</button>
                                        <button
                                            onClick={handleCreateTutor}
                                            disabled={!newTutorName}
                                            className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm disabled:opacity-50"
                                        >
                                            Continuar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 2: PET */}
                    {step === 2 && selectedTutor && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-blue-500 font-bold uppercase">Tutor Selecionado</p>
                                    <p className="font-bold text-blue-900">{selectedTutor.fullName}</p>
                                </div>
                                <button onClick={() => setStep(1)} className="text-xs text-blue-600 underline">Trocar</button>
                            </div>

                            {!isCreatingPet ? (
                                <>
                                    <p className="text-sm font-medium text-gray-700">Selecione o paciente:</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {selectedTutor.pets?.map(pet => (
                                            <div
                                                key={pet.id}
                                                onClick={() => { setSelectedPet(pet); setStep(3); }}
                                                className="p-3 border rounded-xl hover:border-teal-500 hover:bg-teal-50 cursor-pointer transition-all flex items-center gap-3"
                                            >
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                                    <Dog size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{pet.name}</p>
                                                    <p className="text-xs text-gray-500">{pet.species}</p>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() => setIsCreatingPet(true)}
                                            className="p-3 border border-dashed border-gray-300 rounded-xl hover:border-teal-500 hover:bg-teal-50 cursor-pointer transition-all flex flex-col items-center justify-center text-gray-400 hover:text-teal-600 gap-1"
                                        >
                                            <Plus size={24} />
                                            <span className="text-xs font-bold">Novo Pet</span>
                                        </button>
                                    </div>
                                    {selectedTutor.pets?.length === 0 && (
                                        <p className="text-sm text-gray-400 italic text-center py-4">Nenhum pet encontrado para este tutor.</p>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <h4 className="font-bold text-gray-700 flex items-center gap-2">
                                        <Plus size={16} className="text-teal-600" /> Cadastrar Novo Pet
                                    </h4>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Nome do Pet</label>
                                        <input
                                            value={newPetName}
                                            onChange={e => setNewPetName(e.target.value)}
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Espécie</label>
                                        <select
                                            value={newPetSpecies}
                                            onChange={e => setNewPetSpecies(e.target.value)}
                                            className="w-full p-2 border rounded-lg bg-white"
                                        >
                                            <option value="DOG">Cachorro</option>
                                            <option value="CAT">Gato</option>
                                            <option value="BIRD">Ave</option>
                                            <option value="EXOTIC">Exótico</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button onClick={() => setIsCreatingPet(false)} className="text-sm text-gray-500 hover:underline">Cancelar</button>
                                        <button
                                            onClick={handleCreatePet}
                                            disabled={!newPetName}
                                            className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm disabled:opacity-50"
                                        >
                                            Continuar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 3: DETAILS */}
                    {step === 3 && selectedTutor && selectedPet && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <div className="flex gap-2">
                                <div className="flex-1 bg-blue-50 p-2 rounded-lg border border-blue-100 text-xs">
                                    <p className="text-blue-500 font-bold uppercase">Tutor</p>
                                    <p className="font-bold text-blue-900 truncate">{selectedTutor.fullName}</p>
                                </div>
                                <div className="flex-1 bg-purple-50 p-2 rounded-lg border border-purple-100 text-xs">
                                    <p className="text-purple-500 font-bold uppercase">Paciente</p>
                                    <p className="font-bold text-purple-900 truncate">{selectedPet.name}</p>
                                </div>
                            </div>

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
                    )}

                </div>

                {/* Footer Actions */}
                {step === 3 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? <span className="animate-spin">⏳</span> : <Check size={18} />}
                            Confirmar Agendamento
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
