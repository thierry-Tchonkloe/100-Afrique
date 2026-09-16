// src/components/shared/backoffice/CustomSelect.tsx
"use client";
import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  color?: string;
  dot?: string;
  badgeColor?: string;
  avatar?: string;
}

interface CustomSelectProps {
  placeholder: string;
  options: SelectOption[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  disabled?: boolean;
  renderOption?: (opt: SelectOption) => React.ReactNode;
  renderSelected?: (opt: SelectOption) => React.ReactNode;
}

const CustomSelect = ({
  placeholder, options, value, onChange, error, disabled, renderOption, renderSelected,
}: CustomSelectProps) => {
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
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 bg-white text-left transition-all duration-200 outline-none
          ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}
          ${error
            ? 'border-rose-400 ring-2 ring-rose-100'
            : open
            ? 'border-orange-400 ring-2 ring-orange-100'
            : 'border-slate-200 hover:border-slate-300'
          }`}
      >
        <span className={selected ? 'text-slate-800' : 'text-slate-400'}>
          {selected ? (renderSelected ? renderSelected(selected) : selected.label) : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 transition-colors duration-150
                ${value === opt.value ? 'bg-orange-50 text-orange-700' : 'text-slate-700'}`}
            >
              {renderOption ? renderOption(opt) : <span>{opt.label}</span>}
              {value === opt.value && (
                <svg className="w-4 h-4 text-orange-500 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
          <AlertCircle size={13} className="shrink-0" /> {error}
        </p>
      )}
    </div>
  );
};

export default CustomSelect;