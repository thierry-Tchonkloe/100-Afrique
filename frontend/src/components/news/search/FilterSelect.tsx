// src/components/news/search/FilterSelect.tsx
"use client";
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  icon: React.ReactNode;
}

const FilterSelect = ({ value, onChange, options, placeholder, icon }: FilterSelectProps) => {
  const isActive = !!value;
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: isActive ? '#1A5C43' : '#9CA3AF' }}>
        {icon}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-8 py-2.5 rounded-xl text-sm outline-none appearance-none font-medium transition-all"
        style={{
          border: `1.5px solid ${isActive ? '#1A5C43' : '#E5E7EB'}`,
          background: isActive ? 'rgba(26,92,67,0.05)' : '#fff',
          color: isActive ? '#1A5C43' : '#374151',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
    </div>
  );
};

export default FilterSelect;