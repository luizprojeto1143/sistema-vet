"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_URL } from '@/utils/config';
import { PatientClinicalSummary } from '@/components/medical-record/PatientClinicalSummary';
import { PhysicalExamStep } from '@/components/consultation/steps/PhysicalExamStep';
import { DiagnosisStep } from '@/components/consultation/steps/DiagnosisStep';
import { TreatmentStep } from '@/components/consultation/steps/TreatmentStep';
import {
   CheckCircleIcon,
   ChevronRightIcon,
   ClipboardDocumentIcon,
   BeakerIcon,
   DocumentTextIcon,
   ArrowRightIcon,
   ArrowLeftIcon
} from '@heroicons/react/24/outline';

// Steps Component
const Steps = ({ current, steps, onStepClick }: any) => (
   <div className="flex items-center justify-between mb-8 px-4">
      {steps.map((step: any, idx: number) => {
         const isCompleted = idx < current;
         const isCurrent = idx === current;
         return (
            <div key={idx} className="flex flex-col items-center flex-1 cursor-pointer" onClick={() => onStepClick(idx)}>
               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2
                        ${isCompleted ? 'bg-indigo-600 text-white border-indigo-600' :
                     isCurrent ? 'bg-white text-indigo-600 border-indigo-600 shadow-lg scale-110' :
                        'bg-white text-gray-400 border-gray-200'}
                    `}>
                  {isCompleted ? <CheckCircleIcon className="w-6 h-6" /> : (idx + 1)}
               </div>
               <span className={`text-xs mt-2 font-bold uppercase tracking-wider ${isCurrent ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {step.label}
               </span>
               {idx < steps.length - 1 && (
                  <div className={`h-1 w-full mt-2 absolute left-1/2 top-4 -z-10 ${isCompleted ? 'bg-indigo-600' : 'bg-gray-200'}`} style={{ display: 'none' }}></div>
               )}
            </div>
         );
      })}
   </div>
);

export default function AdvancedConsultationPage() {
   const params = useParams();
   const router = useRouter();
   const [loading, setLoading] = useState(true);
   const [appointment, setAppointment] = useState<any>(null);
   const [currentStep, setCurrentStep] = useState(0);

   // Initial State for Form
   const [formData, setFormData] = useState({
      // Anamnesis
      mainComplaint: '',
      history: '',
      systemsReview: '',

      // Physical Exam
      weight: '',
      temperature: '',
      pulse: '',
      respiratoryRate: '',
      mucosa: '',
      tpc: '',
      hydration: '',
      abdominalPalpation: '',
      lymphNodes: '',
      physicalExamNotes: '',

      // Diagnosis
      differentialDiagnosis: '',
      diagnosis: '',
      prognosis: '',
      requestedExams: [] as any[],

      // Treatment (Step 3)
      prescriptions: [] as any[],
      procedures: [] as any[],
      finalNotes: ''
   });

   // Load Data
   useEffect(() => {
      if (!params?.id) return;
      const fetchAppt = async () => {
         const token = localStorage.getItem('token');
         const res = await fetch(`${API_URL}/appointments/${params.id}`, {
            headers: { Authorization: `Bearer ${token}` }
         });
         if (res.ok) {
            setAppointment(await res.json());
            setLoading(false);
         }
      };
      fetchAppt();
   }, [params?.id]);

   const steps = [
      { label: 'Anamnese', icon: ClipboardDocumentIcon },
      { label: 'Exame Físico', icon: BeakerIcon },
      { label: 'Diagnóstico', icon: DocumentTextIcon },
      { label: 'Conduta', icon: CheckCircleIcon },
   ];

   const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
   const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

   const handleFinish = async () => {
      try {
         const token = localStorage.getItem('token');
         const payload = {
            appointmentId: appointment.id,
            petId: appointment.pet.id,
            vetId: appointment.vetId, // Assuming vetId is available in appointment

            // Anamnesis
            mainComplaint: formData.mainComplaint,
            history: formData.history, // Maps to 'anamnesis' in backend

            // Physical Exam
            physicalExamNotes: formData.physicalExamNotes,
            temperature: formData.temperature,
            weight: formData.weight,
            pulse: formData.pulse,
            respiratoryRate: formData.respiratoryRate,
            mucosa: formData.mucosa,
            tpc: formData.tpc,
            hydration: formData.hydration,
            abdominalPalpation: formData.abdominalPalpation,
            lymphNodes: formData.lymphNodes,

            // Diagnosis
            differentialDiagnosis: formData.differentialDiagnosis,
            diagnosis: formData.diagnosis,
            prognosis: formData.prognosis,

            // Lists
            requestedExams: formData.requestedExams,
            prescriptions: formData.prescriptions,
            procedures: formData.procedures, // Will be processed by backend

            finalNotes: formData.finalNotes
         };

         const res = await fetch(`${API_URL}/medical-records`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
         });

         if (!res.ok) throw new Error('Falha ao salvar prontuário');

         alert('Atendimento finalizado com sucesso!');
         router.push('/vet/appointments');
      } catch (err) {
         console.error(err);
         alert('Erro ao finalizar atendimento. Tente novamente.');
      }
   };

   if (loading) return <div className="p-10 text-center text-gray-500">Carregando ambiente hospitalar...</div>;

   return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col font-sans">
         {/* 1. Intelligent Header */}
         {appointment?.pet && (
            <PatientClinicalSummary petId={appointment.pet.id} />
         )}

         {/* 2. Wizard Container */}
         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex-1 flex flex-col overflow-hidden">

            {/* Wizard Header */}
            <div className="bg-white border-b border-gray-100 p-6">
               <Steps current={currentStep} steps={steps} onStepClick={setCurrentStep} />
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 overflow-y-auto bg-slate-50/50">

               {/* STEP 0: ANAMNESE */}
               {currentStep === 0 && (
                  <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                           📝 Motivo da Consulta
                        </h2>
                        <label className="block text-sm font-bold text-gray-600 mb-2">Queixa Principal (O que trouxe o paciente hoje?)</label>
                        <textarea
                           className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all h-24"
                           placeholder="Ex: Vômito há 2 dias, apatia..."
                           value={formData.mainComplaint}
                           onChange={e => setFormData({ ...formData, mainComplaint: e.target.value })}
                        />
                     </div>

                     <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-700 mb-4">Histórico da Moléstia Atual (HMA)</h2>
                        <textarea
                           className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all h-40"
                           placeholder="Detalhes sobre a evolução, tratamentos prévios, alimentação..."
                           value={formData.history}
                           onChange={e => setFormData({ ...formData, history: e.target.value })}
                        />
                     </div>

                     <div className="flex justify-end pt-4">
                        <button
                           onClick={nextStep}
                           className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                        >
                           Próximo: Exame Físico <ArrowRightIcon className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
               )}

               {/* STEP 1: EXAME FÍSICO */}
               {currentStep === 1 && (
                  <div>
                     <PhysicalExamStep
                        data={formData}
                        onChange={(newData) => setFormData(prev => ({ ...prev, ...newData }))}
                        petId={appointment?.pet?.id}
                     />

                     <div className="flex justify-between pt-10 px-6 max-w-5xl mx-auto">
                        <button onClick={prevStep} className="text-gray-500 font-bold hover:text-indigo-600 flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
                           <ArrowLeftIcon className="w-5 h-5" /> Voltar
                        </button>
                        <button onClick={nextStep} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                           Próximo: Diagnóstico <ArrowRightIcon className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
               )}

               {/* STEP 2: DIAGNÓSTICO */}
               {currentStep === 2 && (
                  <div>
                     <DiagnosisStep
                        data={formData}
                        onChange={(newData) => setFormData(prev => ({ ...prev, ...newData }))}
                     />

                     <div className="flex justify-between pt-10 px-6 max-w-5xl mx-auto">
                        <button onClick={prevStep} className="text-gray-500 font-bold hover:text-indigo-600 flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
                           <ArrowLeftIcon className="w-5 h-5" /> Voltar
                        </button>
                        <button onClick={nextStep} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                           Próximo: Conduta <ArrowRightIcon className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
               )}

               {/* STEP 3: TREATMENT & FINISH */}
               {currentStep === 3 && (
                  <div>
                     <TreatmentStep
                        data={formData}
                        onChange={(newData: any) => setFormData(prev => ({ ...prev, ...newData }))}
                        onFinish={handleFinish}
                        appointment={appointment}
                     />

                     <div className="flex justify-start pt-10 px-6 max-w-5xl mx-auto">
                        <button onClick={prevStep} className="text-gray-500 font-bold hover:text-indigo-600 flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
                           <ArrowLeftIcon className="w-5 h-5" /> Voltar
                        </button>
                     </div>
                  </div>
               )}

            </div>
         </div>
      </div>
   );
}
