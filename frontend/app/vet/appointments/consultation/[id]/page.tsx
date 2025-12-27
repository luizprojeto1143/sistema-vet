"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import KitConsumptionModal from '@/components/stock/kit-consumption-modal';
import ServiceSelectionModal from '@/components/consultation/service-selection-modal';
import PrintSelectionModal from '@/components/consultation/print-selection-modal';
import ProductSelectionModal from '@/components/consultation/product-selection-modal';
import MedicalHistoryTab from '@/components/consultation/tabs/medical-history-tab';
import VaccinesTab from '@/components/consultation/tabs/vaccines-tab';
import FilesTab from '@/components/consultation/tabs/files-tab';
import TemplatesModal from '@/components/consultation/templates-modal';
import VitalsModal from '@/components/consultation/vitals-modal';
import PrescriptionModal from '@/components/consultation/prescription-modal';
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
   DocumentTextIcon,
   HomeModernIcon,
   ScaleIcon,
   DocumentPlusIcon,
   BeakerIcon,
   PaperClipIcon,
   ClipboardDocumentCheckIcon,
   StarIcon,
} from '@heroicons/react/24/outline';
import { BoltIcon, PlusIcon, TrashIcon } from 'lucide-react';

export default function ConsultationPage() {
   const params = useParams();
   const router = useRouter();
   const [appointment, setAppointment] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [activeTab, setActiveTab] = useState<'anamnesis' | 'history' | 'files' | 'vaccines'>('anamnesis');

   // AI Recording State
   const [isRecording, setIsRecording] = useState(false);
   const recognitionRef = React.useRef<any>(null);

   // Modals State
   const [showKitModal, setShowKitModal] = useState(false);
   const [showServiceModal, setShowServiceModal] = useState(false);
   const [showPrintModal, setShowPrintModal] = useState(false);
   const [showProductModal, setShowProductModal] = useState(false);
   const [showTemplatesModal, setShowTemplatesModal] = useState(false);
   const [showVitalsModal, setShowVitalsModal] = useState(false);
   const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

   // Clinical Data
   const [anamnesisText, setAnamnesisText] = useState('');
   const [diagnosisText, setDiagnosisText] = useState('');
   const [consumedItems, setConsumedItems] = useState<any[]>([]);
   const [services, setServices] = useState<any[]>([]); // New state for added services

   // Fetch Data
   useEffect(() => {
      const fetchAppointment = async () => {
         if (!params?.id) return;

         try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/appointments/${params.id}`, {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            });

            if (res.ok) {
               const data = await res.json();
               setAppointment(data);
               // Pre-fill existing data if continuing an appointment?
               // For V1, we assume new consultation mainly.
            } else {
               console.error("Failed to fetch appointment");
               alert("Erro ao carregar agendamento. Retornando...");
               router.push('/vet');
            }
         } catch (error) {
            console.error("Error loading appointment", error);
            alert("Erro de conexão.");
         } finally {
            setLoading(false);
         }
      };

      fetchAppointment();
   }, [params?.id]);


   const toggleRecording = () => {
      if (isRecording) {
         recognitionRef.current?.stop();
         setIsRecording(false);
         return;
      }

      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
         const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
         const recognition = new SpeechRecognition();
         recognition.continuous = true;
         recognition.interimResults = true;
         recognition.lang = 'pt-BR';

         recognition.onresult = (event: any) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
               if (event.results[i].isFinal) {
                  setAnamnesisText(prev => prev + ' ' + event.results[i][0].transcript);
               } else {
                  interimTranscript += event.results[i][0].transcript;
               }
            }
         };

         recognition.start();
         recognitionRef.current = recognition;
         setIsRecording(true);
      } else {
         alert("Seu navegador não suporta reconhecimento de voz.");
      }
   };

   const handleFinish = async () => {
      // 1. Prepare Payload
      const mixedItems = [
         ...consumedItems.map(i => ({ ...i, productId: i.id || i.productId })),
         ...services.map(s => ({ name: s.name, price: Number(s.price), quantity: 1 }))
      ];

      const payload = {
         appointmentId: appointment.id,
         petId: appointment.pet?.id,
         anamnesis: anamnesisText,
         diagnosis: diagnosisText,
         // Physical exam data could be added here if we had fields for it
         consumedItems: mixedItems
      };

      try {
         setLoading(true);
         const token = localStorage.getItem('token');
         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/medical-records`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
         });

         if (!res.ok) throw new Error('Falha ao salvar atendimento');

         // 2. Success Feedback
         // In a real app we might redirect to a "Checkout" page or just Agenda
         alert('Atendimento finalizado com sucesso! Débito gerado no financeiro.');
         router.push('/vet');
      } catch (error) {
         console.error(error);
         alert('Erro ao finalizar atendimento. Tente novamente.');
      } finally {
         setLoading(false);
      }
   };

   const removeService = (index: number) => {
      setServices(prev => prev.filter((_, i) => i !== index));
   };

   const removeProduct = (index: number) => {
      setConsumedItems(prev => prev.filter((_, i) => i !== index));
   };

   const totalValue =
      (consumedItems?.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0) || 0) +
      (services?.reduce((acc, s) => acc + Number(s.price), 0) || 0) +
      (appointment?.service?.price ? Number(appointment.service.price) : 0);

   if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 text-indigo-600 font-bold animate-pulse">Carregando Ambiente Clínico...</div>;
   if (!appointment) return <div>Erro ao carregar dados.</div>;

   return (
      <div className="h-screen flex bg-gray-100 font-sans overflow-hidden">
         {/* ... (rest of layout) ... */}

         {/* MODALS */}
         {showKitModal && (
            <KitConsumptionModal
               isOpen={showKitModal}
               onClose={() => setShowKitModal(false)}
               onConfirm={(items: any[]) => {
                  setConsumedItems([...consumedItems, ...items]);
                  setShowKitModal(false);
               }}
            />
         )}

         {showServiceModal && (
            <ServiceSelectionModal
               isOpen={showServiceModal}
               onClose={() => setShowServiceModal(false)}
               onConfirm={(service) => {
                  setServices([...services, service]);
                  setShowServiceModal(false);
               }}
            />
         )}

         {showProductModal && (
            <ProductSelectionModal
               isOpen={showProductModal}
               onClose={() => setShowProductModal(false)}
               onConfirm={(products) => {
                  setConsumedItems([...consumedItems, ...products]);
                  setShowProductModal(false);
               }}
            />
         )}

         {showPrintModal && (
            <PrintSelectionModal
               isOpen={showPrintModal}
               onClose={() => setShowPrintModal(false)}
               onConfirm={(options) => {
                  // In real app, generate specific PDF
                  alert(`Gerando documentos para impressão: ${options.join(', ')}`);
                  setShowPrintModal(false);
                  setTimeout(() => window.print(), 500);
               }}
            />
         )}

         {/* LEFT TOOLBAR (Mini Sidebar) */}
         <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-6 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] print:hidden">
            <button
               onClick={() => alert("Histórico do paciente será exibido aqui.")}
               className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors" title="Histórico"
            >
               <ClockIcon className="w-6 h-6" />
            </button>
            <button
               onClick={() => alert("Modelos de documentos (Receitas, Atestados) aparecerão aqui.")}
               className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors" title="Modelos"
            >
               <DocumentTextIcon className="w-6 h-6" />
            </button>
            <button
               onClick={() => setShowPrintModal(true)}
               className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors" title="Imprimir"
            >
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
            <header className="bg-white border-b border-gray-200 p-4 shadow-sm z-10 print:hidden">
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
            <div className="bg-white border-b border-gray-200 px-6 flex gap-6 print:hidden">
               <button
                  onClick={() => setActiveTab('anamnesis')}
                  className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'anamnesis' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
               >
                  Anamnese & Exame
               </button>
               <button
                  onClick={() => setActiveTab('history')}
                  className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
               >
                  Histórico
               </button>
               <button
                  onClick={() => setActiveTab('files')}
                  className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'files' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
               >
                  Arquivos
               </button>
               <button
                  onClick={() => setActiveTab('vaccines')}
                  className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'vaccines' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
               >
                  Vacinas
               </button>
            </div>

            {/* SCROLLABLE WORKSPACE */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4 print:p-0 print:bg-white">

               {activeTab === 'anamnesis' ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-none">
                     <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
                        <div className="flex items-center gap-4">
                           <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avaliação Clínica</span>

                           {/* QUICK ACTIONS TOOLBAR (PREMIUM) */}
                           <div className="flex items-center bg-white border border-indigo-100/50 rounded-full shadow-[0_2px_8px_rgba(99,102,241,0.08)] p-1.5 gap-1 transition-all hover:shadow-indigo-100/50">
                              {[
                                 { icon: HomeModernIcon, label: 'Internar', action: () => alert("Internação: Redirecionar para mapa de leitos"), color: 'hover:text-amber-500 hover:bg-amber-50' },
                                 { icon: ScaleIcon, label: 'Sinais Vitais', action: () => setShowVitalsModal(true), color: 'hover:text-blue-500 hover:bg-blue-50' },
                                 { separator: true },
                                 { icon: DocumentPlusIcon, label: 'Receituário', action: () => setShowPrescriptionModal(true), color: 'hover:text-emerald-500 hover:bg-emerald-50' },
                                 { icon: BeakerIcon, label: 'Exames', action: () => alert("Exames: Solicitar exames laboratoriais/imagem"), color: 'hover:text-purple-500 hover:bg-purple-50' },
                                 { separator: true },
                                 { icon: PaperClipIcon, label: 'Anexos', action: () => setActiveTab('files'), color: 'hover:text-indigo-500 hover:bg-indigo-50' },
                                 { icon: ClipboardDocumentCheckIcon, label: 'Termos', action: () => alert("Termos: Gerar termo de consentimento"), color: 'hover:text-slate-500 hover:bg-slate-50' },
                                 { icon: StarIcon, label: 'Atestado', action: () => alert("Certificados: Gerar atestado/certificado"), color: 'hover:text-yellow-500 hover:bg-yellow-50' },
                              ].map((item: any, idx) => (
                                 item.separator ? (
                                    <div key={idx} className="w-px h-4 bg-gray-100 mx-1"></div>
                                 ) : (
                                    <button
                                       key={idx}
                                       onClick={item.action}
                                       className={`relative group p-2 rounded-full text-gray-400 transition-all duration-200 hover:-translate-y-0.5 ${item.color}`}
                                    >
                                       <item.icon className="w-5 h-5" />

                                       {/* Premium Tooltip */}
                                       <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-20">
                                          {item.label}
                                          <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
                                          {/* Triangle pointing up actually... sticky header means tooltip might need to be below. changed to below logic. */}
                                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                                       </span>
                                    </button>
                                 )
                              ))}
                           </div>
                        </div>

                        <div className="flex gap-2">
                           <button
                              onClick={() => setShowTemplatesModal(true)}
                              className="text-xs font-bold text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition-colors flex items-center gap-1"
                           >
                              <DocumentTextIcon className="w-3 h-3" /> Modelos
                           </button>
                           <button
                              onClick={() => setAnamnesisText(prev => prev + (prev ? '\n\n' : '') + "**Queixa Principal:** \n\n**Histórico:** \n\n**Alimentação:** ")}
                              className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
                           >
                              + Incluir Cabeçalho
                           </button>
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
                           <button
                              onClick={toggleRecording}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg transition-all font-bold text-xs ${isRecording
                                 ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
                                 : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-indigo-200 hover:scale-105'
                                 }`}
                           >
                              <MicrophoneIcon className={`w-4 h-4 ${isRecording ? 'animate-bounce' : ''}`} />
                              {isRecording ? 'Parar Gravação' : 'Iniciar Gravação (IA)'}
                           </button>
                        </div>
                        <span className="text-xs text-gray-400 italic">Rascunho salvo às 14:02</span>
                     </div>
                  </div>
               ) : activeTab === 'history' ? (
                  <MedicalHistoryTab petId={appointment?.pet?.id} />
               ) : activeTab === 'files' ? (
                  <FilesTab petId={appointment?.pet?.id} />
               ) : (
                  <VaccinesTab petId={appointment?.pet?.id} />
               )}

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
                     <button
                        onClick={() => setShowServiceModal(true)}
                        className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-bold hover:bg-indigo-100 transition-colors"
                     >
                        + Incluir
                     </button>
                  </div>
                  <div className="space-y-2">
                     {/* Base Appointment Service (if exists) */}
                     {appointment.service && (
                        <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg border border-gray-100 group hover:border-indigo-200 transition-colors">
                           <div>
                              <span className="block font-medium text-gray-700">{appointment.service.name}</span>
                              <span className="text-xs text-gray-400">Agendado</span>
                           </div>
                           <span className="font-bold text-gray-900">R$ {Number(appointment.service.price).toFixed(2)}</span>
                        </div>
                     )}

                     {/* Added Services */}
                     {services.map((svc, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm p-3 bg-white rounded-lg border border-gray-100 group hover:border-indigo-200 transition-colors">
                           <div>
                              <span className="block font-medium text-gray-700">{svc.name}</span>
                              <span className="text-xs text-gray-400">Adicional</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <span className="font-bold text-gray-900">R$ {Number(svc.price).toFixed(2)}</span>
                              <button onClick={() => removeService(idx)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1">
                                 <TrashIcon className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Products Section */}
               <div>
                  <div className="flex justify-between items-center mb-3">
                     <h4 className="text-xs font-bold text-green-600 uppercase flex items-center gap-1">
                        <ArchiveBoxIcon className="w-3 h-3" /> Produtos / Consumo
                     </h4>
                     <div className="flex gap-1">
                        <button
                           onClick={() => setShowKitModal(true)}
                           className="text-[10px] bg-amber-50 text-amber-600 px-2 py-1 rounded font-bold hover:bg-amber-100 transition-colors"
                           title="Usar Kit Prornto"
                        >
                           + Kit
                        </button>
                        <button
                           onClick={() => setShowProductModal(true)}
                           className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded font-bold hover:bg-green-100 transition-colors"
                           title="Buscar Produto no Estoque"
                        >
                           + Produto
                        </button>
                     </div>
                  </div>

                  {consumedItems.length === 0 ? (
                     <div className="text-xs text-center text-gray-400 py-6 border-2 border-dashed border-gray-100 rounded-xl">
                        Nenhum produto lançado
                     </div>
                  ) : (
                     <div className="space-y-2">
                        {consumedItems.map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center text-sm p-2 bg-white rounded border border-gray-100 group hover:border-green-200 transition-colors">
                              <div>
                                 <span className="block font-medium text-gray-600 truncate max-w-[150px]">{item.name}</span>
                                 <span className="text-xs text-gray-400">x{item.quantity}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <span className="font-bold text-gray-800">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                 <button onClick={() => removeProduct(idx)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1">
                                    <TrashIcon className="w-4 h-4" />
                                 </button>
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



         <ServiceSelectionModal
            isOpen={showServiceModal}
            onClose={() => setShowServiceModal(false)}
            onConfirm={(service) => {
               setServices([...services, service]);
               setShowServiceModal(false);
            }}
         />
         <ProductSelectionModal
            isOpen={showProductModal}
            onClose={() => setShowProductModal(false)}
            onConfirm={(products) => {
               setConsumedItems([...consumedItems, ...products]);
               setShowProductModal(false);
            }}
         />
         <PrintSelectionModal
            isOpen={showPrintModal}
            onClose={() => setShowPrintModal(false)}
            onConfirm={(selected) => {
               alert(`Gerando documentos: ${selected.join(', ')}`);
               setShowPrintModal(false);
            }}
         />
         <TemplatesModal
            isOpen={showTemplatesModal}
            onClose={() => setShowTemplatesModal(false)}
            onSelect={(text) => setAnamnesisText(prev => prev + (prev ? '\n\n' : '') + text)}
         />
         <VitalsModal
            isOpen={showVitalsModal}
            onClose={() => setShowVitalsModal(false)}
            onSave={(vitals) => setAnamnesisText(prev => prev + `\n\n**Sinais Vitais:**\nPeso: ${vitals.weight}kg | Temp: ${vitals.temp}°C | FC: ${vitals.bpm}bpm`)}
         />
         <PrescriptionModal
            isOpen={showPrescriptionModal}
            onClose={() => setShowPrescriptionModal(false)}
         />
      </div>
   );
}
```
