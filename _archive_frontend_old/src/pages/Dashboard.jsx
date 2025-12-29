import React from 'react';
import { Users, Calendar, AlertCircle, ShoppingBag } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, alert }) => (
  <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${alert ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
        <Icon size={20} />
      </div>
    </div>
    {subtext && <p className="text-xs text-muted-foreground mt-2">{subtext}</p>}
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Consultas Hoje" 
          value="12" 
          subtext="2 agendadas para tarde" 
          icon={Calendar} 
        />
        <StatCard 
          title="Pacientes Internados" 
          value="5" 
          subtext="1 alta prevista" 
          icon={Users} 
        />
        <StatCard 
          title="Produtos Críticos" 
          value="3" 
          subtext="Repor urgentemente" 
          icon={AlertCircle} 
          alert 
        />
        <StatCard 
          title="Faturamento Dia" 
          value="R$ 1.250" 
          subtext="+15% vs ontem" 
          icon={ShoppingBag} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border lg:col-span-2">
          <h3 className="font-semibold mb-4">Agenda do Dia</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-md border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 text-center text-sm font-bold text-muted-foreground">09:00</div>
                  <div>
                    <p className="font-medium">Thor (Golden Retriever)</p>
                    <p className="text-sm text-muted-foreground">Consulta de Rotina - Dr. Silva</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Confirmado</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="font-semibold mb-4">Avisos Rápidos</h3>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm border border-yellow-100">
              ⚠️ <strong>Estoque:</strong> Cefalexina acabando.
            </div>
            <div className="p-3 bg-blue-50 text-blue-800 rounded-md text-sm border border-blue-100">
              ℹ️ <strong>Reunião:</strong> Equipe às 14h.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
