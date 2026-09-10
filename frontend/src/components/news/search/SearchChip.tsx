// src/components/news/search/SearchChip.tsx
"use client";
import React from 'react';
import { X } from 'lucide-react';

interface SearchChipProps {
  label: string;
  icon: React.ReactNode;
  onRemove: () => void;
}

const SearchChip = ({ label, icon, onRemove }: SearchChipProps) => (
  <span
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
    style={{ background: 'rgba(26,92,67,0.08)', color: '#1A5C43', border: '1px solid rgba(26,92,67,0.15)' }}
  >
    <span className="opacity-70">{icon}</span>
    <span className="max-w-[120px] truncate">{label}</span>
    <button onClick={onRemove} className="ml-0.5 hover:text-[#B85C38] transition-colors">
      <X size={11} />
    </button>
  </span>
);

export default SearchChip;