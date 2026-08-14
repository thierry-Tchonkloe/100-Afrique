// src/components/recruteur/dashboard/ChartTooltip.tsx
export function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg px-3 py-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-bold text-[#E8622A]">
        {payload[0].value} candidature{payload[0].value !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

export function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-[180px]">
      <p className="text-xs text-gray-400 text-center">{message}</p>
    </div>
  );
}
