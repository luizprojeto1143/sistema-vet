import React, { useState } from 'react';
import { X, Save, Plus, Trash, User } from 'lucide-react';

interface NewTutorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (createdTutor?: any) => void;
}

export default function NewTutorModal({ isOpen, onClose, onSuccess }: NewTutorModalProps) {
    const [loading, setLoading] = useState(false);
    const [tutor, setTutor] = useState({
        fullName: '',
        cpf: '',
        phone: '',
        email: '',
        address: {
            zipCode: '',
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            state: ''
        }
    });

    const handleAddressChange = (field: string, value: string) => {
        setTutor(prev => ({
            ...prev,
            address: { ...prev.address, [field]: value }
        }));
    };

    const checkCEP = async (cep: string) => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length === 8) {
            setLoading(true);
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    setTutor(prev => ({
                        ...prev,
                        address: {
                            ...prev.address,
                            street: data.logradouro,
                            neighborhood: data.bairro,
                            city: data.localidade,
                            state: data.uf,
                            zipCode: cleanCep
                        }
                    }));
                }
            } catch (error) {
                console.error("CEP Error", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const [pets, setPets] = useState([
        {
            name: '',
            species: 'DOG',
            breed: '',
            gender: 'MACHO',
            birthDate: '',
            weight: '',
            microchip: '',
            coatColor: '',
            temperament: 'DOCILE',
            isCastrated: false // New Checkbox
        }
    ]);

    if (!isOpen) return null;

    const handleAddPet = () => {
        setPets([...pets, {
            name: '', species: 'DOG', breed: '', gender: 'MACHO',
            birthDate: '', weight: '', microchip: '', coatColor: '', temperament: 'DOCILE', isCastrated: false
        }]);
    };

    const handleRemovePet = (index: number) => {
        setPets(pets.filter((_, i) => i !== index));
    };

    const handlePetChange = (index: number, field: string, value: any) => {
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
                const createdData = await res.json();
                alert('Tutor cadastrado com sucesso!');
                onSuccess(createdData);
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
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Novo Cadastro</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">

                    {/* Tutor & Address Combined Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">

                        {/* Row 1: Personal Data */}
                        <div className="md:col-span-12">
                            <h3 className="text-xs font-bold text-teal-600 uppercase mb-2 tracking-wider flex items-center gap-2">
                                <User size={16} /> Dados do Responsável
                            </h3>
                        </div>

                        <div className="md:col-span-4">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Nome Completo *</label>
                            <input required className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-teal-500"
                                value={tutor.fullName} onChange={e => setTutor({ ...tutor, fullName: e.target.value })} placeholder="Ex: Maria Silva" />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Telefone *</label>
                            <input required className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-teal-500"
                                value={tutor.phone} onChange={e => setTutor({ ...tutor, phone: e.target.value })} placeholder="(00) 00000-0000" />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-500 mb-1">CPF</label>
                            <input className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-teal-500"
                                value={tutor.cpf} onChange={e => setTutor({ ...tutor, cpf: e.target.value })} placeholder="000.000.000-00" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                            <input type="email" className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-teal-500"
                                value={tutor.email} onChange={e => setTutor({ ...tutor, email: e.target.value })} placeholder="email@..." />
                        </div>

                        {/* Row 2: Address */}
                        <div className="md:col-span-12 mt-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Endereço (Fiscal)</h4>
                        </div>

                        <div className="md:col-span-2">
                            <input className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="CEP" value={tutor.address?.zipCode || ''}
                                onChange={e => handleAddressChange('zipCode', e.target.value)} onBlur={(e) => checkCEP(e.target.value)} maxLength={9} />
                        </div>
                        <div className="md:col-span-4">
                            <input className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Logradouro" value={tutor.address?.street || ''} onChange={e => handleAddressChange('street', e.target.value)} />
                        </div>
                        <div className="md:col-span-1">
                            <input className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Nº" value={tutor.address?.number || ''} onChange={e => handleAddressChange('number', e.target.value)} />
                        </div>
                        <div className="md:col-span-3">
                            <input className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Bairro" value={tutor.address?.neighborhood || ''} onChange={e => handleAddressChange('neighborhood', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <input className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Cidade/UF" value={tutor.address?.city ? `${tutor.address.city}/${tutor.address.state}` : ''} readOnly />
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
                                <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group animate-in slide-in-from-bottom-2">
                                    {pets.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemovePet(idx)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    )}

                                    <div className="grid grid-cols-12 gap-3">
                                        {/* Row 1 */}
                                        <div className="col-span-12 md:col-span-4">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nome do Pet *</label>
                                            <input required className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                                                value={pet.name} onChange={e => handlePetChange(idx, 'name', e.target.value)} placeholder="Ex: Rex" />
                                        </div>
                                        <div className="col-span-6 md:col-span-2">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Espécie</label>
                                            <select className="w-full p-2 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-teal-500"
                                                value={pet.species} onChange={e => handlePetChange(idx, 'species', e.target.value)}>
                                                <option value="DOG">Cachorro</option>
                                                <option value="CAT">Gato</option>
                                                <option value="BIRD">Ave</option>
                                                <option value="EXOTIC">Exótico</option>
                                            </select>
                                        </div>
                                        <div className="col-span-6 md:col-span-3">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Raça</label>
                                            <input className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                                                value={pet.breed} onChange={e => handlePetChange(idx, 'breed', e.target.value)} placeholder="Ex: Poodle" />
                                        </div>
                                        <div className="col-span-6 md:col-span-2">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Sexo</label>
                                            <select className="w-full p-2 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-teal-500"
                                                value={pet.gender} onChange={e => handlePetChange(idx, 'gender', e.target.value)}>
                                                <option value="MACHO">Macho</option>
                                                <option value="FEMEA">Fêmea</option>
                                            </select>
                                        </div>
                                        <div className="col-span-6 md:col-span-1 flex items-center pt-6">
                                            <label className="flex items-center cursor-pointer gap-2">
                                                <input type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                                                    checked={pet.isCastrated} onChange={e => handlePetChange(idx, 'isCastrated', e.target.checked)} />
                                                <span className="text-xs text-gray-600 font-bold">Castrado?</span>
                                            </label>
                                        </div>

                                        {/* Row 2: VET DATA */}
                                        <div className="col-span-4 md:col-span-2">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nascimento</label>
                                            <input type="date" className="w-full p-2 border rounded-lg text-xs outline-none focus:ring-2 focus:ring-teal-500"
                                                value={pet.birthDate || ''} onChange={e => handlePetChange(idx, 'birthDate', e.target.value)} />
                                        </div>
                                        <div className="col-span-4 md:col-span-2">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Peso (kg)</label>
                                            <input type="number" step="0.1" className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                                                value={pet.weight || ''} onChange={e => handlePetChange(idx, 'weight', parseFloat(e.target.value))} placeholder="0.0" />
                                        </div>
                                        <div className="col-span-4 md:col-span-3">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Microchip</label>
                                            <input className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                                                value={pet.microchip || ''} onChange={e => handlePetChange(idx, 'microchip', e.target.value)} placeholder="Código" />
                                        </div>
                                        <div className="col-span-6 md:col-span-3">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Pelagem</label>
                                            <input className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                                                value={pet.coatColor || ''} onChange={e => handlePetChange(idx, 'coatColor', e.target.value)} placeholder="Cor / Tipo" />
                                        </div>
                                        <div className="col-span-6 md:col-span-2">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Temperamento</label>
                                            <select className="w-full p-2 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-teal-500"
                                                value={pet.temperament || 'DOCILE'} onChange={e => handlePetChange(idx, 'temperament', e.target.value)}>
                                                <option value="DOCILE">Dócil</option>
                                                <option value="AGGRESSIVE">Bravo</option>
                                                <option value="SCARED">Assustado</option>
                                            </select>
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
