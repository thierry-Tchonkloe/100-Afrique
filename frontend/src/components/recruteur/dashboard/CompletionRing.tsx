// src/components/recruteur/dashboard/CompletionRing.tsx
export default function CompletionRing({ pct }: { pct: number }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#F3F4F6" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none" stroke="#E8622A" strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={circ - (pct / 100) * circ}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{pct}%</span>
      </div>
    </div>
  );
}