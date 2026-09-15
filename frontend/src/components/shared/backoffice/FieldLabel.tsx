// src/components/shared/backoffice/FieldLabel.tsx
"use client";
import React from 'react';

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
    {children}
  </label>
);

export default FieldLabel;