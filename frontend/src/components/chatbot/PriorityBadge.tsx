// src/components/chatbot/PriorityBadge.tsx
"use client";
import React from 'react';
import type { Priority } from './types';

const CONFIG: Record<Priority, { label: string; className: string }> = {
  HIGH: { label: 'Priorité Élevée', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  MEDIUM: { label: 'Priorité Normale', className: 'bg-amber-50 text-amber-600 border-amber-100' },
  LOW: { label: 'Priorité Basse', className: 'bg-slate-50 text-slate-600 border-slate-100' },
};

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const { label, className } = CONFIG[priority];
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${className}`}>
      {label}
    </span>
  );
};

export default PriorityBadge;