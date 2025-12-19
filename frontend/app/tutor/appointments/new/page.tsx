"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    CalendarDaysIcon,
    CheckCircleIcon,
    ClockIcon,
    ChevronRightIcon,
    ChevronLeftIcon
} from '@heroicons/react/24/outline';

const STEPS = ['Pet', 'Serviço', 'Data/Hora', 'Confirmação'];

export default function NewAppointmentPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(true);

    // Data
    const [pets, setPets] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [slots, setSlots] = useState<string[]>([]);

    // Selection
    const [selectedPet, setSelectedPet] = useState<any>(null);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedSlot, setSelectedSlot] = useState<string>('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token'); // Tutor Token

        // 1. Fetch Pets
        const resPets = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/tutors/me/pets', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resPets.ok) setPets(await resPets.json());

        // 2. Fetch Services
        const resServ = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/services', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resServ.ok) setServices(await resServ.json());

        setLoading(false);
    };

    const fetchSlots = async (date: string) => {
        const token = localStorage.getItem('token');
        setSlots([]); // clear old slots
        // Assuming Clinic ID 1 or passed via context. For Tutor, maybe linked to their clinic?
        // Using 'clinic-1' as fallback or ideally getting from Tutor profile.
        // But let's assume 'clinic-1' for MVP.
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/appointments/slots?clinicId=clinic-1&date=${date}&serviceId=${selectedService?.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            setSlots(await res.json());
        }
    };

    const handleDateChange = (e: any) => {
        const date = e.target.value;
        setSelectedDate(date);
        setSelectedSlot('');
        if (date && selectedService) fetchSlots(date);
    };

    const handleConfirm = async () => {
        if (!selectedPet || !selectedService || !selectedDate || !selectedSlot) return;

        const token = localStorage.getItem('token');
        const dateTime = `${selectedDate}T${selectedSlot}:00`; // Simple ISO construction

        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                petId: selectedPet.id,
                serviceId: selectedService.id,
                dateTime: dateTime,
                notes: notes,
                type: selectedService.type || 'CONSULTATION'
            })
        });

        if (res.ok) {
            alert('Agendamento Confirmado! 🎉');
            router.push('/tutor/appointments');
        } else {
            alert('Erro ao agendar. Tente outro horário.');
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Carregando...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-2">
                <button onClick={() => step > 0 ? setStep(step - 1) : router.back()}>
                    <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
                </button>
                <h1 className="text-lg font-bold text-gray-800">Novo Agendamento</h1>
            </div>

            {/* Stepper */}
            <div className="flex justify-between px-8 py-4 bg-white border-t border-gray-100 mb-4">
                {STEPS.map((s, i) => (
                    <div key={i} className={`flex flex-col items-center gap-1 ${step >= i ? 'text-indigo-600' : 'text-gray-300'}`}>
                        <div className={`w-3 h-3 rounded-full ${step >= i ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                        <span className="text-[10px] font-bold uppercase">{s}</span>
                    </div>
                ))}
            </div>

            <div className="p-4 max-w-md mx-auto">

                {/* STEP 0: SELECT PET */}
                {step === 0 && (
                    <div className="animate-fade-in">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Quem será atendido?</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {pets.map(pet => (
                                <div
                                    key={pet.id}
                                    onClick={() => { setSelectedPet(pet); setStep(1); }}
                                    className={`bg-white p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${selectedPet?.id === pet.id ? 'border-indigo-600 shadow-md ring-2 ring-indigo-100' : 'border-gray-100 hover:border-indigo-200'}`}
                                >
                                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 overflow-hidden">
                                        {/* Avatar placeholder */}
                                        <div className="w-full h-full flex items-center justify-center text-2xl">🐶</div>
                                    </div>
                                    <p className="font-bold text-gray-800">{pet.name}</p>
                                    <p className="text-xs text-gray-500">{pet.breed || 'Pet'}</p>
                                </div>
                            ))}
                            <div className="bg-gray-100 p-4 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer" onClick={() => router.push('/tutor/pets/new')}>
                                <span className="text-2xl">+</span>
                                <span className="text-xs font-bold">Novo Pet</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 1: SELECT SERVICE */}
                {step === 1 && (
                    <div className="animate-fade-in">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Qual serviço?</h2>
                        <div className="space-y-3">
                            {services.map(srv => (
                                <div
                                    key={srv.id}
                                    onClick={() => { setSelectedService(srv); setStep(2); }}
                                    className={`bg-white p-4 rounded-xl border cursor-pointer flex justify-between items-center ${selectedService?.id === srv.id ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-gray-100'}`}
                                >
                                    <div>
                                        <p className="font-bold text-gray-800">{srv.name}</p>
                                        <p className="text-xs text-gray-500">{srv.durationMin} min</p>
                                    </div>
                                    <span className="font-mono font-bold text-indigo-600">
                                        R$ {Number(srv.price).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 2: DATE & TIME */}
                {step === 2 && (
                    <div className="animate-fade-in">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Escolha o Horário</h2>

                        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Data</label>
                            <input
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="w-full p-3 border rounded-lg font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {selectedDate && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
                                    <ClockIcon className="h-4 w-4" /> Horários Disponíveis
                                </h3>
                                {slots.length === 0 ? (
                                    <div className="p-8 bg-gray-100 rounded-xl text-center text-gray-500">
                                        Nenhum horário disponível para esta data.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-3">
                                        {slots.map(slot => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`py-3 px-2 rounded-lg font-bold text-sm transition-all ${selectedSlot === slot
                                                        ? 'bg-indigo-600 text-white shadow-lg scale-105'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                                    }`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-8 flex justify-end">
                            <button
                                disabled={!selectedSlot}
                                onClick={() => setStep(3)}
                                className="bg-indigo-600 disabled:opacity-50 text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
                            >
                                Continuar <ChevronRightIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: CONFIRMATION */}
                {step === 3 && (
                    <div className="animate-fade-in">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Confirmar Agendamento</h2>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500" />

                            <div className="space-y-4">
                                <div>
                                    <span className="text-xs text-gray-400 uppercase font-bold">Paciente</span>
                                    <p className="font-bold text-lg text-gray-800">{selectedPet?.name}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 uppercase font-bold">Serviço</span>
                                    <p className="font-bold text-lg text-gray-800">{selectedService?.name}</p>
                                    <p className="text-indigo-600 font-bold">R$ {Number(selectedService?.price).toFixed(2)}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 uppercase font-bold">Data e Hora</span>
                                    <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                                        <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                                        {new Date(selectedDate).toLocaleDateString()} às {selectedSlot}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-500 mb-2">Observações (Opcional)</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Ex: Tem medo de secador..."
                                rows={3}
                            />
                        </div>

                        <button
                            onClick={handleConfirm}
                            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all flex justify-center items-center gap-2"
                        >
                            <CheckCircleIcon className="h-6 w-6" /> Confirmar Agendamento
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
