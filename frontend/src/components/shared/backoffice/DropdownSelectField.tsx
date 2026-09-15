// src/components/shared/backoffice/DropdownSelectField.tsx
"use client";
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface DropdownSelectFieldProps<T extends string> {
  label: string;
  value: T | '';
  placeholder: string;
  options: DropdownOption<T>[];
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
  onChange: (v: T) => void;
}

function DropdownSelectField<T extends string>({
  label, value, placeholder, options, error, icon, required = true, onChange,
}: DropdownSelectFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {icon && <span className="inline-flex mr-1.5 align-middle text-orange-500">{icon}</span>}
        {label} {required && <span className="text-orange-500">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 bg-white text-left transition-all duration-150
          ${error
            ? 'border-rose-400 ring-2 ring-rose-100'
            : open
            ? 'border-orange-400 ring-2 ring-orange-100'
            : 'border-slate-200 hover:border-slate-300'
          }`}
      >
        <span className={selected ? 'text-slate-800 font-medium' : 'text-slate-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180 text-orange-400' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                value === opt.value ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
}

export default DropdownSelectField;