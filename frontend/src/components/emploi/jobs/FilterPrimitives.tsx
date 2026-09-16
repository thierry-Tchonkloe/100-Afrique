'use client';
// src/components/emploi/jobs/FilterPrimitives.tsx
// Petits blocs réutilisés par toutes les sidebars de filtres (jobs, secteurs...)
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function FilterSection({
  title, children, defaultOpen = true,
}: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between py-3 text-sm font-semibold text-gray-700 hover:text-[#E8622A] transition-colors">
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

export function CheckItem({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 py-1 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${checked ? 'bg-[#E8622A] border-[#E8622A]' : 'border-gray-300 group-hover:border-[#E8622A]'}`}
      >
        {checked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-600 group-hover:text-gray-900">{label}</span>
    </label>
  );
}
