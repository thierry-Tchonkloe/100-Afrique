// src/components/shared/backoffice/AuthorSelectOption.tsx
"use client";
import React from 'react';
import CustomSelect, { type SelectOption } from './CustomSelect';
import { initials } from '@/lib/backoffice/extractArray';
import type { Author } from './useAuthorsAndDestinations';

interface AuthorSelectProps {
  authors: Author[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

const AuthorSelect = ({ authors, value, onChange, error }: AuthorSelectProps) => {
  const options: SelectOption[] = authors.map((a) => ({
    value: String(a.id), label: a.name, sublabel: a.role, avatar: a.avatar ?? (a.name ? initials(a.name) : '?'),
  }));

  return (
    <CustomSelect
      placeholder="Sélectionner un auteur"
      options={options}
      value={value}
      onChange={onChange}
      error={error}
      renderOption={(opt) => (
        <>
          <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold shrink-0">
            {opt.avatar}
          </span>
          <span>
            <span className="block text-sm font-medium text-slate-800">{opt.label}</span>
            {opt.sublabel && <span className="block text-xs text-slate-400">{opt.sublabel}</span>}
          </span>
        </>
      )}
      renderSelected={(opt) => (
        <span className="flex items-center gap-2 text-sm">
          <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">
            {opt.avatar}
          </span>
          <span className="font-medium text-slate-800">{opt.label}</span>
        </span>
      )}
    />
  );
};

export default AuthorSelect;