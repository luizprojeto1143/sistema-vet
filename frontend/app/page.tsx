"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [stats, setStats] = useState({
    appointmentsToday: 0,
    revenueToday: 0,
    lowStockCount: 0,
    alerts: [] as string[]
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      // In a real app, we would have a dedicated /dashboard/stats endpoint.
      // Here we will do a "smart" aggregation on the client for V1 speed, 
      // fetching from our existing endpoints.

      const [resApt, resFin, resProd] = await Promise.all([
        fetch('http://localhost:4000/appointments', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:4000/finance', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:4000/products', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      let appointmentsToday = 0;
      let revenueToday = 0;
      let lowStockCount = 0;
      let alerts = [];

      if (resApt.ok) {
        const data = await resApt.json();
        const today = new Date().toISOString().split('T')[0];
        appointmentsToday = data.filter((a: any) => a.dateTime.startsWith(today)).length;
      }

      if (resFin.ok) {
        const data = await resFin.json();
        const today = new Date().toISOString().split('T')[0];
        // Filter income from today
        revenueToday = data
          .filter((t: any) => t.type === 'INCOME' && new Date(t.date || t.createdAt).toISOString().startsWith(today))
          .reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
      }

      if (resProd.ok) {
        const data = await resProd.json();
        const lowStockItems = data.filter((p: any) => p.stockQuantity <= 10); // Threshold 10
        lowStockCount = lowStockItems.length;
        if (lowStockCount > 0) {
          alerts.push(`${lowStockCount} produtos com estoque baixo.`);
        }
      }

      setStats({ appointmentsToday, revenueToday, lowStockCount, alerts });
    };

    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Smart Vet Dashboard 🧠
        </h1>
        <p className="text-gray-500 mt-2">Visão geral inteligente da sua clínica.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex flex-col">
          <span className="text-gray-500 font-medium">Agendamentos Hoje</span>
          <span className="text-4xl font-bold text-blue-700 mt-2">{stats.appointmentsToday}</span>
          <Link href="/vet/appointments" className="text-sm text-blue-500 mt-4 hover:underline">Ver agenda →</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 flex flex-col">
          <span className="text-gray-500 font-medium">Receita Hoje (Beta)</span>
          <span className="text-4xl font-bold text-green-700 mt-2">R$ {stats.revenueToday.toFixed(2)}</span>
          <Link href="/finance" className="text-sm text-green-500 mt-4 hover:underline">Ver financeiro →</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex flex-col">
          <span className="text-gray-500 font-medium">Alertas de Estoque</span>
          <span className="text-4xl font-bold text-red-700 mt-2">{stats.lowStockCount}</span>
          <Link href="/stock" className="text-sm text-red-500 mt-4 hover:underline">Repor estoque →</Link>
        </div>
      </div>

      {/* Intelligent Alerts Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-3xl border border-gray-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>🔔 Avisos Inteligentes</span>
          <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
        </h2>

        <div className="space-y-4">
          {stats.alerts.length > 0 ? (
            stats.alerts.map((alert, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-l-orange-400 flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-bold text-gray-800">Atenção Necessária</p>
                  <p className="text-gray-600 text-sm">{alert}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              <p>Nenhum alerta crítico no momento. A clínica está operando perfeitamente! ✨</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Access Grid */}
      <h2 className="text-xl font-bold mt-10 mb-6">Acesso Rápido</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/vet/appointments" className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center border">
          Agenda 📅
        </Link>
        <Link href="/vet/patients" className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center border">
          Pacientes 🐕
        </Link>
        <Link href="/analisavet" className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center border">
          AnalisaVet AI 🤖
        </Link>
        <Link href="/stock" className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center border">
          Estoque 📦
        </Link>
      </div>
    </div>
  );
}
