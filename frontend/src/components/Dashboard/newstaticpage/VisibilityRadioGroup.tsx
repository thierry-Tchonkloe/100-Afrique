// src/components/Dashboard/newstaticpage/VisibilityRadioGroup.tsx
"use client";
import React from 'react';
import type { Visibility } from './useNewStaticPageForm';

const OPTIONS: { value: Visibility; label: string; desc: string }[] = [
  { value: 'public', label: 'Publique', desc: 'Visible dans le sitemap et les moteurs de recherche' },
  { value: 'private', label: 'Privée', desc: 'Accessible par URL directe uniquement (ex : page de remerciement)' },
];

interface VisibilityRadioGroupProps {
  value: Visibility;
  onChange: (v: Visibility) => void;
}

const VisibilityRadioGroup = ({ value, onChange }: VisibilityRadioGroupProps) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2.5">
      Visibilité et Navigation <span className="text-orange-500 ml-0.5">*</span>
    </label>
    <div className="space-y-2.5">
      {OPTIONS.map(({ value: v, label, desc }) => (
        <label
          key={v}
          className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
            value === v ? 'border-orange-400 bg-orange-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 border-current flex items-center justify-center transition-colors">
            <div className={`w-2 h-2 rounded-full transition-all ${value === v ? 'bg-orange-500 scale-100' : 'scale-0'}`} />
          </div>
          <input type="radio" name="visibility" value={v} checked={value === v} onChange={() => onChange(v)} className="sr-only" />
          <div>
            <p className="text-sm font-medium text-slate-800">{label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
          </div>
        </label>
      ))}
    </div>
  </div>
);

export default VisibilityRadioGroup;