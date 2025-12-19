"use client";

import React, { useState } from 'react';
import { 
  CurrencyDollarIcon, 
  BanknotesIcon, 
  CalculatorIcon, 
  Cog6ToothIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function CommissionsPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rules' | 'closing'>('dashboard');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                <BanknotesIcon className="h-6 w-6"/>
             </div>
             Motor de Comissões
           </h1>
           <p className="text-gray-500 mt-1">Regras automáticas, cálculo e repasse financeiro.</p>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
           <button 
             onClick={() => setActiveTab('dashboard')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Painel & Simulação
           </button>
           <button 
             onClick={() => setActiveTab('rules')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'rules' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Regras de Cálculo
           </button>
           <button 
             onClick={() => setActiveTab('closing')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'closing' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Fechamento (PIX)
           </button>
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
         <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">Pendente (Aberto)</div>
                    <div className="text-3xl font-bold text-orange-500">R$ 1.250,00</div>
                    <div className="text-xs text-gray-400 mt-2">Aguardando fechamento</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">Pago (Este Mês)</div>
                    <div className="text-3xl font-bold text-emerald-600">R$ 4.800,00</div>
                    <div className="text-xs text-gray-400 mt-2">Repasses confirmados</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">Total de Vendas (Base)</div>
                    <div className="text-3xl font-bold text-gray-900">R$ 42.000,00</div>
                    <div className="text-xs text-gray-400 mt-2">Faturamento elegível</div>
                </div>
            </div>

            {/* SIMULATOR */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
               <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-4">
                  <CalculatorIcon className="h-5 w-5"/>
                  Simulador de Comissão
               </h3>
               <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                     <label className="text-xs font-bold text-indigo-400 uppercase">Item/Serviço</label>
                     <select className="w-full mt-1 p-2 border-indigo-200 rounded-lg bg-white">
                        <option>Consulta Veterinária (R$ 150,00)</option>
                        <option>Cirurgia Complexa (R$ 1.200,00)</option>
                        <option>Venda Ração Premium (R$ 200,00)</option>
                     </select>
                  </div>
                  <div className="flex-1">
                     <label className="text-xs font-bold text-indigo-400 uppercase">Profissional</label>
                     <select className="w-full mt-1 p-2 border-indigo-200 rounded-lg bg-white">
                        <option>Dr. Gabriel (Vet)</option>
                        <option>Ana (Recepção)</option>
                     </select>
                  </div>
                  <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium h-10">
                     Simular
                  </button>
               </div>
               
               {/* SIMULATION RESULT */}
               <div className="mt-4 p-4 bg-white rounded-xl border border-indigo-100 shadow-sm flex items-center justify-between">
                  <div>
                     <div className="text-sm text-gray-600">Resultado da Simulação:</div>
                     <div className="font-medium text-gray-900">Regra Aplicada: <span className="font-bold">Específica por Serviço (10%)</span></div>
                  </div>
                  <div className="text-right">
                     <div className="text-xs text-gray-500 uppercase font-bold">Valor da Comissão</div>
                     <div className="text-xl font-bold text-emerald-600">+ R$ 15,00</div>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* RULES TAB */}
      {activeTab === 'rules' && (
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-fadeIn overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
               <h3 className="font-bold text-gray-900">Hierarquia de Regras</h3>
               <button className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                  + Nova Regra
               </button>
            </div>
            
            <div className="space-y-1 p-6">
                
                {/* Rule Card 1 */}
                <div className="flex items-center gap-4 p-4 border rounded-xl bg-white hover:border-indigo-300 transition-colors">
                   <div className="bg-purple-100 text-purple-600 p-2 rounded font-bold text-xs w-16 text-center">NÍVEL 1</div>
                   <div className="flex-1">
                      <h4 className="font-bold text-gray-900">Regra por Item Específico</h4>
                      <p className="text-sm text-gray-500">Ex: Vacina V10 = R$ 10,00 fixo; Ração Royal Canin = 8%.</p>
                   </div>
                   <div className="text-sm text-gray-400">Alta Prioridade</div>
                </div>

                {/* Rule Card 2 */}
                <div className="flex items-center gap-4 p-4 border rounded-xl bg-white hover:border-indigo-300 transition-colors">
                   <div className="bg-blue-100 text-blue-600 p-2 rounded font-bold text-xs w-16 text-center">NÍVEL 2</div>
                   <div className="flex-1">
                      <h4 className="font-bold text-gray-900">Regra por Categoria</h4>
                      <p className="text-sm text-gray-500">Ex: Todos Medicamentos = 5%; Todos Banho/Tosa = 30%.</p>
                   </div>
                </div>

                {/* Rule Card 3 */}
                <div className="flex items-center gap-4 p-4 border rounded-xl bg-white hover:border-indigo-300 transition-colors">
                   <div className="bg-gray-100 text-gray-600 p-2 rounded font-bold text-xs w-16 text-center">NÍVEL 3</div>
                   <div className="flex-1">
                      <h4 className="font-bold text-gray-900">Regra Geral (Fallback)</h4>
                      <p className="text-sm text-gray-500">Se nada mais se aplicar: Serviços 5%, Produtos 2%.</p>
                   </div>
                   <div className="text-green-600 font-bold text-sm">Ativa</div>
                </div>

            </div>
         </div>
      )}

      {/* CLOSING TAB */}
      {activeTab === 'closing' && (
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-fadeIn p-8 text-center">
            <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-xl mb-6 text-left flex gap-3 text-yellow-800">
               <ArrowPathIcon className="h-6 w-6 shrink-0"/>
               <div>
                  <h4 className="font-bold text-sm">Atenção ao Fechamento</h4>
                  <p className="text-xs mt-1">O sistema só libera comissões de itens com pagamento 100% confirmado no financeiro.</p>
               </div>
            </div>

            <table className="w-full text-left text-sm mb-6">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                        <th className="p-3">Profissional</th>
                        <th className="p-3">Chave PIX</th>
                        <th className="p-3 text-right">A Receber</th>
                        <th className="p-3 text-right">Ação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr>
                        <td className="p-3 font-medium">Dr. Gabriel Martins</td>
                        <td className="p-3 font-mono text-xs">CPF 123.***.***-00</td>
                        <td className="p-3 text-right font-bold text-gray-900">R$ 850,00</td>
                        <td className="p-3 text-right">
                           <button className="bg-emerald-600 text-white text-xs px-3 py-1 rounded hover:bg-emerald-700">Pagar (PIX)</button>
                        </td>
                    </tr>
                    <tr>
                        <td className="p-3 font-medium">Ana Beatriz</td>
                        <td className="p-3 font-mono text-xs">Email ana@vet.com</td>
                        <td className="p-3 text-right font-bold text-gray-900">R$ 124,50</td>
                        <td className="p-3 text-right">
                           <button className="bg-emerald-600 text-white text-xs px-3 py-1 rounded hover:bg-emerald-700">Pagar (PIX)</button>
                        </td>
                    </tr>
                </tbody>
            </table>
         </div>
      )}

    </div>
  );
}
