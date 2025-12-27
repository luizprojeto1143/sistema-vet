import React, { useState } from 'react';
import { X, Save, Plus, Trash } from 'lucide-react';

interface NewTutorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function NewTutorModal({ isOpen, onClose, onSuccess }: NewTutorModalProps) {
    const [loading, setLoading] = useState(false);
    const [tutor, setTutor] = useState({
        fullName: '',
        cpf: '',
        phone: '',
        email: ''
    });

    const [pets, setPets] = useState([
        { name: '', species: 'DOG', breed: '', gender: 'MACHO' }
    ]);

    if (!isOpen) return null;

    const handleAddPet = () => {
        setPets([...pets, { name: '', species: 'DOG', breed: '', gender: 'MACHO' }]);
    };

    const handleRemovePet = (index: number) => {
        setPets(pets.filter((_, i) => i !== index));
    };

    const handlePetChange = (index: number, field: string, value: string) => {
        const newPets = [...pets];
        newPets[index] = { ...newPets[index], [field]: value };
        setPets(newPets);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...tutor,
                pets: {
                    create: pets.filter(p => p.name.length > 0) // Only send valid pets
                }
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/tutors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Tutor cadastrado com sucesso!');
                onSuccess();
                onClose();
            } else {
                const err = await res.json();
                alert(`Erro ao cadastrar: ${err.message || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão ao tentar cadastrar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Novo Cadastro</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">

                    {/* Tutor Section */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-teal-600 uppercase mb-4 tracking-wider">Dados do Responsável</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                                <input
                                    required
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={tutor.fullName}
                                    onChange={e => setTutor({ ...tutor, fullName: e.target.value })}
                                    placeholder="Ex: Maria Silva"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                                <input
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={tutor.cpf}
                                    onChange={e => setTutor({ ...tutor, cpf: e.target.value })}
                                    placeholder="000.000.000-00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone/WhatsApp *</label>
                                <input
                                    required
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={tutor.phone}
                                    onChange={e => setTutor({ ...tutor, phone: e.target.value })}
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={tutor.email}
                                    onChange={e => setTutor({ ...tutor, email: e.target.value })}
                                    placeholder="email@exemplo.com"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-100" />

                    {/* Pets Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-teal-600 uppercase tracking-wider">Animais / Pacientes</h3>
                            <button
                                type="button"
                                onClick={handleAddPet}
                                className="text-sm flex items-center gap-1 text-teal-600 hover:text-teal-700 font-bold bg-teal-50 px-3 py-1 rounded-lg"
                            >
                                <Plus size={16} /> Adicionar Outro
                            </button>
                        </div>

                        <div className="space-y-4">
                            {pets.map((pet, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                                    {pets.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemovePet(idx)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Nome do Pet *</label>
                                            <input
                                                required
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                                                value={pet.name}
                                                onChange={e => handlePetChange(idx, 'name', e.target.value)}
                                                placeholder="Ex: Rex"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Espécie</label>
                                            <select
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm bg-white"
                                                value={pet.species}
                                                onChange={e => handlePetChange(idx, 'species', e.target.value)}
                                            >
                                                <option value="DOG">Cachorro 🐶</option>
                                                <option value="CAT">Gato 🐱</option>
                                                <option value="BIRD">Ave/Exótico 🦜</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Sexo</label>
                                            <select
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm bg-white"
                                                value={pet.gender}
                                                onChange={e => handlePetChange(idx, 'gender', e.target.value)}
                                            >
                                                <option value="MACHO">Macho</option>
                                                <option value="FEMEA">Fêmea</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Raça (Opcional)</label>
                                            <input
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                                                value={pet.breed}
                                                onChange={e => handlePetChange(idx, 'breed', e.target.value)}
                                                placeholder="Ex: Poodle, SRD..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? 'Salvando...' : <><Save size={20} /> Salvar Cadastro</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
