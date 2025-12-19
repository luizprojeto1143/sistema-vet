"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import KitConsumptionModal from '@/components/stock/kit-consumption-modal';
import {
   HeartIcon,
   BeakerIcon,
   DocumentTextIcon,
   ClipboardDocumentCheckIcon,
   MicrophoneIcon,
   SparklesIcon,
   ClockIcon,
   CheckBadgeIcon,
   PrinterIcon,
   TrashIcon,
   PlusCircleIcon,
   PaperAirplaneIcon,
   ArchiveBoxIcon,
} from '@heroicons/react/24/outline';

import { LabIcon } from 'lucide-react'; // Using lucide for Lab if Heroicons doesn't have it explicitly named nicely

export default function ConsultationPage({ params }: { params: { id: string } }) {
   const router = useRouter();
   const [appointment, setAppointment] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [activeTab, setActiveTab] = useState<'anamnesis' | 'exam' | 'analisavet' | 'diagnosis' | 'prescription' | 'docs'>('anamnesis');
   const [isRecording, setIsRecording] = useState(false);
   const [showKitModal, setShowKitModal] = useState(false);

   // Data States
   const [anamnesisText, setAnamnesisText] = useState('');
   const [vitals, setVitals] = useState({ temp: '', bpm: '', mpm: '', tpc: '', mucosa: 'Normocorada' });
   const [diagnosis, setDiagnosis] = useState({ main: '', notes: '' });
   const [prescriptionItems, setPrescriptionItems] = useState<any[]>([]);
   const [consumedItems, setConsumedItems] = useState<any[]>([]); // For Kit/Stock Logic

   // Fetch Appointment Data
   useEffect(() => {
      const fetchAppointment = async () => {
         try {
            const token = localStorage.getItem('token');
            // Assuming we have an endpoint to get detailed appointment info for consultation context
            // Ideally: GET /appointments/:id with includes
            const res = await fetch(`http://localhost:4000/appointments?id=${params.id}`, { // Fallback to list filter if specific endpoint missing
               headers: { 'Authorization': `Bearer ${token}` }
            });
            // Or better, GET /appointments/:id if supported. For now, filter list.
            // Actually, let's try direct fetch if supported or list.
            // Using a specific endpoint is better practice. Let's assume standard REST.
            const resSpecific = await fetch(`http://localhost:4000/appointments/${params.id}`, {
               headers: { 'Authorization': `Bearer ${token}` }
            });

            if (resSpecific.ok) {
               const data = await resSpecific.json();
               setAppointment(data);
               // Pre-fill history if available?
            } else {
               console.error("Failed to load appointment context");
            }
         } catch (e) {
            console.error(e);
         } finally {
            setLoading(false);
         }
      };
      fetchAppointment();
   }, [params.id]);

   const handleFinish = async () => {
      if (!appointment) return;

      try {
         const token = localStorage.getItem('token');
         const payload = {
            appointmentId: appointment.id,
            petId: appointment.petId,
            vetId: appointment.vetId,
            clinicId: appointment.clinicId,
            anamnesis: anamnesisText,
            physicalExam: JSON.stringify(vitals),
            diagnosis: diagnosis.main,
            treatment: diagnosis.notes,
            consumedItems: consumedItems, // Array of { productId, quantity, price }
            // Prescription could be saved separately or as part of treatment
         };

         const res = await fetch('http://localhost:4000/medical-records', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
         });

         if (res.ok) {
            // Update appointment status to COMPLETED
            await fetch(`http://localhost:4000/appointments/${appointment.id}/status`, {
               method: 'PATCH',
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
               },
               body: JSON.stringify({ status: 'COMPLETED' })
            });

            alert('Atendimento finalizado com sucesso! Encaminhando para Financeiro...');
            router.push('/vet/appointments'); // Or somewhere else
         } else {
            alert('Erro ao salvar prontuário.');
         }

      } catch (error) {
         console.error("Error saving record", error);
         alert('Erro de conexão.');
      }
   };

   const handleKitUsed = (items: any[]) => {
      // items come from KitConsumptionModal
      setConsumedItems([...consumedItems, ...items]);
      setShowKitModal(false);
      alert(`${items.length} itens adicionados ao consumo.`);
   };

   if (loading) return <div className="p-10 flex justify-center text-gray-500">Carregando prontuário...</div>;
   if (!appointment) return <div className="p-10 flex justify-center text-red-500">Erro: Agendamento não encontrado.</div>;

   return (
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden font-sans">

         {/* HEADER: CONTEXT BAR */}
         <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10 w-full">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xl uppercase">
                  {appointment.pet?.name?.charAt(0) || 'P'}
               </div>
               <div>
                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                     {appointment.pet?.name}
                     <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{appointment.pet?.breed || 'Sem Raça'}</span>
                  </h1>
                  <div className="text-sm text-gray-500 flex gap-4">
                     <span>{appointment.tutor?.name || 'Tutor Desconhecido'}</span>
                     {appointment.pet?.allergies && (
                        <span className="flex items-center gap-1 text-orange-600 font-medium">⚠️ Alergia: {appointment.pet.allergies}</span>
                     )}
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-mono font-bold flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  --:--
               </div>
               <button
                  onClick={handleFinish}
                  className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-700 shadow-md flex items-center gap-2 transition-all"
               >
                  <CheckBadgeIcon className="h-5 w-5" />
                  Finalizar Atendimento
               </button>
            </div>
         </div>

         <div className="flex flex-1 overflow-hidden w-full">

            {/* SIDEBAR: HISTORY (Simplified for Real Data) */}
            <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto hidden md:block">
               <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-700 uppercase text-xs mb-3">Detalhes do Agendamento</h3>
                  <div className="bg-indigo-50 p-3 rounded-lg text-sm text-indigo-900">
                     <span className="font-bold block text-indigo-400 text-xs mb-1">MOTIVO/SERVIÇO</span>
                     {appointment.service?.name || appointment.type || 'Consulta Geral'}
                     {appointment.notes && <p className="mt-2 italic text-gray-600">"{appointment.notes}"</p>}
                  </div>
               </div>

               <div className="p-4">
                  <h3 className="font-bold text-gray-700 uppercase text-xs mb-3">Itens Consumidos (Cobrança)</h3>
                  {consumedItems.length === 0 ? (
                     <div className="text-xs text-center text-gray-400 py-4 border border-dashed rounded">Nenhum item lançado</div>
                  ) : (
                     <ul className="space-y-2">
                        {consumedItems.map((item: any, idx) => (
                           <li key={idx} className="text-xs flex justify-between border-b pb-1">
                              <span>{item.name || item.productId}</span>
                              <span className="font-bold">x{item.quantity}</span>
                           </li>
                        ))}
                     </ul>
                  )}
               </div>
            </div>

            {/* MAIN: CLINICAL WORKSPACE */}
            <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto">

               {/* TABS */}
               <div className="flex border-b border-gray-200 bg-white px-6 gap-6 pt-4 overflow-x-auto w-full">
                  {[
                     { id: 'anamnesis', label: 'Anamnese', icon: MicrophoneIcon },
                     { id: 'exam', label: 'Exame Físico', icon: HeartIcon },
                     { id: 'diagnosis', label: 'Diagnóstico', icon: ClipboardDocumentCheckIcon },
                     // { id: 'prescription', label: 'Receituário', icon: DocumentTextIcon }, // Can implement later
                  ].map(tab => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`pb-4 px-2 flex items-center gap-2 font-medium transition-all text-sm relative whitespace-nowrap ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                           }`}
                     >
                        <tab.icon className="h-5 w-5" />
                        {tab.label}
                        {activeTab === tab.id && (
                           <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></div>
                        )}
                     </button>
                  ))}
               </div>

               {/* CONTENT AREA */}
               <div className="flex-1 overflow-y-auto p-8 bg-slate-50 relative w-full">

                  {/* QUICK ACTIONS FLOATING BUTTON */}
                  <div className="absolute top-4 right-6 flex gap-2 z-20">
                     <button
                        onClick={() => setShowKitModal(true)}
                        className="bg-white border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-indigo-50 flex items-center gap-2 text-sm transition-all"
                     >
                        <ArchiveBoxIcon className="h-5 w-5" />
                        Usar Kit / Estoque
                     </button>
                  </div>

                  {/* TAB: ANAMNESIS */}
                  {activeTab === 'anamnesis' && (
                     <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 relative">
                           <label className="text-sm font-bold text-gray-700 block mb-2">Relato Clínico (Evolução)</label>
                           <textarea
                              className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed text-gray-800"
                              placeholder="Descreva a queixa principal e evolução..."
                              value={anamnesisText}
                              onChange={(e) => setAnamnesisText(e.target.value)}
                           />
                        </div>
                     </div>
                  )}

                  {/* TAB: EXAM */}
                  {activeTab === 'exam' && (
                     <div className="max-w-4xl mx-auto animate-fadeIn">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                           <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                              <HeartIcon className="h-6 w-6 text-red-500" />
                              Sinais Vitais & Exame Físico
                           </h3>

                           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                              <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Temperatura (°C)</label>
                                 <input
                                    type="number"
                                    value={vitals.temp}
                                    onChange={e => setVitals({ ...vitals, temp: e.target.value })}
                                    className="w-full text-2xl font-bold p-3 border rounded-lg text-center"
                                    placeholder="00.0"
                                 />
                              </div>
                              {/* Other inputs similarly bound */}
                              <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">BPM</label>
                                 <input
                                    type="number"
                                    value={vitals.bpm}
                                    onChange={e => setVitals({ ...vitals, bpm: e.target.value })}
                                    className="w-full text-2xl font-bold p-3 border rounded-lg text-center"
                                    placeholder="000"
                                 />
                              </div>
                           </div>

                           <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mucosas</label>
                              <div className="flex gap-2 flex-wrap">
                                 {['Normocorada', 'Pálida', 'Cianótica', 'Ictérica', 'Congesta'].map(m => (
                                    <button
                                       key={m}
                                       onClick={() => setVitals({ ...vitals, mucosa: m })}
                                       className={`px-4 py-2 rounded-lg text-sm transition-all border ${vitals.mucosa === m ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200'
                                          }`}
                                    >
                                       {m}
                                    </button>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* TAB: DIAGNOSIS */}
                  {activeTab === 'diagnosis' && (
                     <div className="max-w-4xl mx-auto animate-fadeIn space-y-6">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                           <div className="mb-6">
                              <label className="text-sm font-bold text-gray-700 block mb-2">Diagnóstico Principal</label>
                              <input
                                 type="text"
                                 className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                 placeholder="Ex: Otite Bacteriana"
                                 value={diagnosis.main}
                                 onChange={(e) => setDiagnosis({ ...diagnosis, main: e.target.value })}
                              />
                           </div>

                           <div>
                              <label className="text-sm font-bold text-gray-700 block mb-2">Tratamento / Notas</label>
                              <textarea
                                 className="w-full h-40 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                 placeholder="Descreva o plano de tratamento..."
                                 value={diagnosis.notes}
                                 onChange={(e) => setDiagnosis({ ...diagnosis, notes: e.target.value })}
                              />
                           </div>
                        </div>
                     </div>
                  )}

               </div>

            </div>

         </div>

         {showKitModal && (
            <KitConsumptionModal
               isOpen={showKitModal}
               onClose={() => setShowKitModal(false)}
               onConfirm={handleKitUsed}
            />
         )}

      </div>
   );
}
