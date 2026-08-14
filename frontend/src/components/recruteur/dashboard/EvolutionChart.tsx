'use client';
// src/components/recruteur/dashboard/EvolutionChart.tsx
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { CustomTooltip, EmptyChart } from './ChartTooltip';

export default function EvolutionChart({ chartData }: { chartData: { date: string; value: number }[] }) {
  const hasChartData = chartData.some((d) => d.value > 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="font-semibold text-gray-800 text-sm mb-4">Évolution des candidatures</h2>
      {hasChartData ? (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E8622A" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#E8622A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke="#E8622A" strokeWidth={2.5} fill="url(#areaGrad)" dot={false}
              activeDot={{ r: 5, fill: '#E8622A', stroke: '#fff', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChart message="Aucune candidature reçue sur cette période." />
      )}
    </div>
  );
}
