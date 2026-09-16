// src/components/shared/backoffice/SelectDropdown.tsx
"use client";
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectDropdownProps {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder: string;
}

const SelectDropdown = ({ value, options, onChange, placeholder }: SelectDropdownProps) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-9 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent cursor-pointer"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
  </div>
);

export default SelectDropdown;