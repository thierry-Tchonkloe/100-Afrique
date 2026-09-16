// src/components/chatbot/SectionCard.tsx
"use client";
import React from 'react';

export const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
    {children}
  </div>
);

export const SectionHeader = ({ icon, title, iconBg }: { icon: React.ReactNode; title: string; iconBg: string }) => (
  <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-50">
    <div className={`p-2 rounded-xl ${iconBg}`}>{icon}</div>
    <h2 className="text-[15px] font-bold text-slate-800 tracking-tight">{title}</h2>
  </div>
);