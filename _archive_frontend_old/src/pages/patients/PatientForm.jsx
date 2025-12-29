import React, { useState } from 'react';
import { ArrowLeft, Save, User, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientForm = () => {
    const [activeTab, setActiveTab] = useState('tutor'); // tutor | pet

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/pacientes" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Novo Cadastro</h2>
                    <p className="text-muted-foreground">Cadastre o tutor e seus pets.</p>
                </div>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-border">
                    <button
                        onClick={() => setActiveTab('tutor')}
                        className={`flex-1 py-4 text-center font-medium text-sm flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'tutor' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:bg-muted/50'}`}
                    >
                        <User size={18} /> Dados do Tutor
                    </button>
                    <button
                        onClick={() => setActiveTab('pet')}
                        className={`flex-1 py-4 text-center font-medium text-sm flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'pet' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:bg-muted/50'}`}
                    >
                        <PawPrint size={18} /> Dados do Pet
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'tutor' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nome Completo *</label>
                                    <input type="text" className="w-full flex h-10 rounded-md border border-input px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none" placeholder="Ex: Maria Silva" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">CPF *</label>
                                    <input type="text" className="w-full flex h-10 rounded-md border border-input px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none" placeholder="000.000.000-00" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">WhatsApp *</label>
                                    <input type="text" className="w-full flex h-10 rounded-md border border-input px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none" placeholder="(00) 00000-0000" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">E-mail</label>
                                    <input type="email" className="w-full flex h-10 rounded-md border border-input px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none" placeholder="cliente@email.com" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pet' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nome do Pet *</label>
                                    <input type="text" className="w-full flex h-10 rounded-md border border-input px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none" placeholder="Ex: Rex" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Espécie *</label>
                                    <select className="w-full flex h-10 rounded-md border border-input px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none bg-background">
                                        <option>Cão</option>
                                        <option>Gato</option>
                                        <option>Ave</option>
                                        <option>Silvestre</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Raça</label>
                                    <input type="text" className="w-full flex h-10 rounded-md border border-input px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none" placeholder="Ex: SRD" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Sexo</label>
                                    <div className="flex gap-4 pt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="sexo" className="accent-primary" /> Macho
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="sexo" className="accent-primary" /> Fêmea
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-muted/20 border-t border-border flex justify-end gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors">
                        Cancelar
                    </button>
                    <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
                        <Save size={16} /> Salvar Cadastro
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientForm;
