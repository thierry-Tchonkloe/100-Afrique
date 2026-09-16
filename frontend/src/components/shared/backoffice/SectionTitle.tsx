// src/components/shared/backoffice/SectionTitle.tsx
"use client";
import React from 'react';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
    {children}
  </h2>
);

export default SectionTitle;