'use client';
// src/components/recruteur/dashboard/MetierPieChart.tsx
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { EmptyChart } from './ChartTooltip';

export default function MetierPieChart({
  metierParts,
}: { metierParts: { value: number; color: string; name?: string }[] }) {
  const hasMetierParts = metierParts.length > 0 && metierParts.some((m) => m.value > 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="font-semibold text-gray-800 text-sm mb-4">Répartition par métier</h2>
      {hasMetierParts ? (
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={metierParts} cx="42%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={2} dataKey="value">
              {metierParts.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" iconSize={8}
              formatter={(value) => <span className="text-xs text-gray-600">{value}</span>} />
            <Tooltip formatter={(value) => [`${value}%`, '']} contentStyle={{ borderRadius: 12, border: '1px solid #F3F4F6', fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChart message="Publiez des offres pour voir la répartition par métier." />
      )}
    </div>
  );
}
