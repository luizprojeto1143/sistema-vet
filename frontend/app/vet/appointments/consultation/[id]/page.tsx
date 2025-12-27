"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import KitConsumptionModal from '@/components/stock/kit-consumption-modal';
import {
   HeartIcon,
   MicrophoneIcon,
   ClockIcon,
   PrinterIcon,
   ArchiveBoxIcon,
   UserIcon,
   PhoneIcon,
   MapPinIcon,
   TagIcon,
   CurrencyDollarIcon,
   ShoppingCartIcon,
   EllipsisVerticalIcon,
   ChevronDownIcon,
   PlayIcon,
   CreditCardIcon,
   DocumentTextIcon
} from '@heroicons/react/24/outline';
import { BoltIcon, PlusIcon, TrashIcon } from 'lucide-react';

export default function ConsultationPage() {
   const params = useParams();
   const router = useRouter();
   const [appointment, setAppointment] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [activeTab, setActiveTab] = useState<'anamnesis' | 'exam' | 'history'>('anamnesis');
   const [showKitModal, setShowKitModal] = useState(false);

   // Clinical Data
   const [anamnesisText, setAnamnesisText] = useState('');
   const [diagnosisText, setDiagnosisText] = useState('');
   const [consumedItems, setConsumedItems] = useState<any[]>([]);

   // Fetch Data
   useEffect(() => {
      const fetchAppointment = async () => {
         try {
            const token = localStorage.getItem('token');
            // Fetch appointment details
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/appointments/${params?.id}`, {
               headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
               const data = await res.json();
               setAppointment(data);
            }
         } catch (e) {
            console.error(e);
         } finally {
            setLoading(false);
         }
      };
      fetchAppointment();
   }, [params?.id]);


   const handleFinish = async () => {
      // Logic to save medical record and finish appointment
      alert('Salvando atendimento e gerando cobrança...');
      router.push('/vet');
   };

   const totalValue = consumedItems.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.quantity || 1)), 0);

   if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 text-indigo-600 font-bold animate-pulse">Carregando Ambiente Clínico...</div>;
   if (!appointment) return <div>Erro ao carregar dados.</div>;

   return (
      <div className="h-screen flex bg-gray-100 font-sans overflow-hidden">

         {/* LEFT TOOLBAR (Mini Sidebar) */}
         <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-6 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <button className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors" title="Histórico">
               <ClockIcon className="w-6 h-6" />
            </button>
            <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors" title="Modelos">
               <DocumentTextIcon className="w-6 h-6" />
            </button>
            <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors" title="Imprimir">
               <PrinterIcon className="w-6 h-6" />
            </button>
            <div className="flex-1" />
            <button onClick={() => router.back()} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Sair">
               <BoltIcon className="w-6 h-6" />
            </button>
         </aside>

         {/* CENTER WORKSPACE */}
         <main className="flex-1 flex flex-col min-w-0">

            {/* HEADER: PATIENT & TUTOR CARDS */}
            <header className="bg-white border-b border-gray-200 p-4 shadow-sm z-10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Tutor Card */}
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                        <UserIcon className="w-6 h-6" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-bold text-gray-900 truncate flex items-center gap-2">
                           {appointment.tutor?.fullName || 'Tutor Visitante'}
                           <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">Sem Débitos</span>
                        </h2>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                           <span className="flex items-center gap-1"><PhoneIcon className="w-3 h-3" /> {appointment.tutor?.phone}</span>
                           <span className="flex items-center gap-1"><MapPinIcon className="w-3 h-3" /> {appointment.tutor?.address?.city || 'Local não inf.'}</span>
                        </div>
                     </div>
                  </div>

                  {/* Pet Card */}
                  <div className="flex items-center gap-4 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-2 opacity-10 text-indigo-900">
                        <HeartIcon className="w-24 h-24" />
                     </div>
                     <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg z-10">
                        P
                     </div>
                     <div className="flex-1 min-w-0 z-10">
                        <div className="flex justify-between items-start">
                           <h2 className="text-sm font-bold text-indigo-900 truncate">
                              {appointment.pet?.name || 'Pet Visitante'}
                              <span className="ml-2 text-[10px] text-indigo-500 font-normal">{appointment.pet?.breed}</span>
                           </h2>
                           <button className="text-gray-400 hover:text-indigo-600"><EllipsisVerticalIcon className="w-5 h-5" /></button>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-indigo-700/70 mt-1 font-medium">
                           <span>{appointment.pet?.gender === 'MALE' ? 'Macho' : 'Fêmea'}</span>
                           <span className="w-1 h-1 bg-indigo-300 rounded-full"></span>
                           <span>{appointment.pet?.weight || '--'} kg</span>
                           <span className="w-1 h-1 bg-indigo-300 rounded-full"></span>
                           <span>{appointment.pet?.age || '2 anos'}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </header>

            {/* TAB NAVIGATION */}
            <div className="bg-white border-b border-gray-200 px-6 flex gap-6">
               {['Anamnese & Exame', 'Histórico', 'Arquivos', 'Vacinas'].map((tab) => (
                  <button
                     key={tab}
                     className={`py-3 text-sm font-bold border-b-2 transition-colors ${tab === 'Anamnese & Exame' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                  >
                     {tab}
                  </button>
               ))}
            </div>

            {/* SCROLLABLE WORKSPACE */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">

               {/* Editor Section */}
               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avaliação Clínica</span>
                     <div className="flex gap-2">
                        <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg hover:bg-indigo-100">+ Incluir Cabeçalho</button>
                     </div>
                  </div>
                  <div className="p-6 space-y-6">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Queixa Principal / Anamnese</label>
                        <textarea
                           className="w-full h-32 p-4 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                           placeholder="Descreva os sintomas relatados pelo tutor..."
                           value={anamnesisText}
                           onChange={e => setAnamnesisText(e.target.value)}
                        ></textarea>
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Exame Físico & Diagnóstico</label>
                        <textarea
                           className="w-full h-32 p-4 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                           placeholder="Achados clínicos e hipóteses diagnósticas..."
                           value={diagnosisText}
                           onChange={e => setDiagnosisText(e.target.value)}
                        ></textarea>
                     </div>
                  </div>
                  {/* Bottom Toolbar */}
                  <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                     <div className="flex gap-2">
                        {/* AI Button */}
                        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:scale-105 transition-transform font-bold text-xs">
                           <MicrophoneIcon className="w-4 h-4" /> Iniciar Gravação (IA)
                        </button>
                     </div>
                     <span className="text-xs text-gray-400 italic">Rascunho salvo às 14:02</span>
                  </div>
               </div>

            </div>
         </main>

         {/* RIGHT PANEL: CONSUMPTION (COMANDA) */}
         <aside className="w-[320px] bg-white border-l border-gray-200 flex flex-col shadow-xl z-30">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 bg-gray-50/30">
               <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-green-600" /> Resumo Financeiro
               </h3>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-2 gap-2 p-3">
               <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
                  <span className="block text-[10px] text-blue-400 font-bold uppercase">Total Parcial</span>
                  <span className="block text-lg font-extrabold text-blue-700">R$ {totalValue.toFixed(2)}</span>
               </div>
               <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 text-center">
                  <span className="block text-[10px] text-orange-400 font-bold uppercase">Pendente</span>
                  <span className="block text-lg font-extrabold text-orange-700">R$ 0,00</span>
               </div>
            </div>

            {/* Lists */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">

               {/* Services Section */}
               <div>
                  <div className="flex justify-between items-center mb-3">
                     <h4 className="text-xs font-bold text-indigo-600 uppercase flex items-center gap-1">
                        <BoltIcon className="w-3 h-3" /> Serviços
                     </h4>
                     <button className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-bold hover:bg-indigo-100 transition-colors">
                        + Incluir
                     </button>
                  </div>
                  <div className="space-y-2">
                     {/* Appointment Service */}
                     <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg border border-gray-100 group hover:border-indigo-200 transition-colors">
                        <div>
                           <span className="block font-medium text-gray-700">Consulta Geral</span>
                           <span className="text-xs text-gray-400">Dr. André Luis</span>
                        </div>
                        <span className="font-bold text-gray-900">R$ 150,00</span>
                     </div>
                  </div>
               </div>

               {/* Products Section */}
               <div>
                  <div className="flex justify-between items-center mb-3">
                     <h4 className="text-xs font-bold text-green-600 uppercase flex items-center gap-1">
                        <ArchiveBoxIcon className="w-3 h-3" /> Produtos / Consumo
                     </h4>
                     <button
                        onClick={() => setShowKitModal(true)}
                        className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded font-bold hover:bg-green-100 transition-colors"
                     >
                        + Incluir
                     </button>
                  </div>

                  {consumedItems.length === 0 ? (
                     <div className="text-xs text-center text-gray-400 py-6 border-2 border-dashed border-gray-100 rounded-xl">
                        Nenhum produto lançado
                     </div>
                  ) : (
                     <div className="space-y-2">
                        {consumedItems.map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center text-sm p-2 bg-white rounded border border-gray-100">
                              <span className="text-gray-600 truncate max-w-[150px]">{item.name}</span>
                              <div className="flex items-center gap-2">
                                 <span className="text-xs text-gray-400">x{item.quantity}</span>
                                 <span className="font-bold text-gray-800">R$ {(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>

            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
               <button
                  onClick={handleFinish}
                  className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-200 hover:bg-green-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
               >
                  <CreditCardIcon className="w-6 h-6" /> Pagamento
               </button>
            </div>
         </aside>

         {/* MODALS */}
         {showKitModal && (
            <KitConsumptionModal
               isOpen={showKitModal}
               onClose={() => setShowKitModal(false)}
               onConfirm={(items) => {
                  setConsumedItems([...consumedItems, ...items]);
                  setShowKitModal(false);
               }}
            />
         )}

      </div>
   );
}
