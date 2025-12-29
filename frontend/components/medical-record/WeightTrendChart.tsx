import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const WeightTrendChart = ({ data }: { data: any[] }) => {
    if (!data || data.length < 2) return null;

    const formattedData = data.map(d => ({
        date: format(new Date(d.createdAt), 'dd/MM/yy', { locale: ptBR }),
        weight: d.weight,
        fullDate: format(new Date(d.createdAt), "dd 'de' MMMM", { locale: ptBR })
    }));

    // Calculate trend
    const last = formattedData[formattedData.length - 1].weight;
    const penultra = formattedData[formattedData.length - 2].weight;
    const diff = last - penultra;
    const trendColor = diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-500' : 'text-gray-500';
    const trendIcon = diff > 0 ? '🔼' : diff < 0 ? '🔽' : '⏺';

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 flex justify-between">
                <span>Evolução de Peso</span>
                <span className={`text-xs ${trendColor}`}>
                    {trendIcon} {Math.abs(diff).toFixed(2)}kg vs. anterior
                </span>
            </h4>
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedData}>
                        <defs>
                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="date"
                            fontSize={10}
                            tickMargin={10}
                            tickLine={false}
                            axisLine={false}
                            stroke="#9CA3AF"
                        />
                        <YAxis
                            hide
                            domain={['dataMin - 1', 'dataMax + 1']}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ color: '#6B7280', fontSize: '12px', marginBottom: '4px' }}
                            itemStyle={{ color: '#4F46E5', fontWeight: 'bold' }}
                            formatter={(value: any) => [`${value} kg`, 'Peso']}
                            labelFormatter={(label) => label}
                        />
                        <Area
                            type="monotone"
                            dataKey="weight"
                            stroke="#4f46e5"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorWeight)"
                            activeDot={{ r: 4, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
