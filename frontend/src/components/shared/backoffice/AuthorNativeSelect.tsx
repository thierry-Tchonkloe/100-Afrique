// src/components/shared/backoffice/AuthorNativeSelect.tsx
"use client";
import React from 'react';
import { ChevronDown, AlertCircle, Loader2 } from 'lucide-react';
import { initials } from '@/lib/backoffice/extractArray';
import type { Author } from './useAuthorsAndDestinations';

interface AuthorNativeSelectProps {
  authors: Author[];
  loading: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  label?: string;
  /** Affiche les initiales devant le nom (StaticPageModal) */
  showInitials?: boolean;
}

const AuthorNativeSelect = ({
  authors, loading, value, onChange, error, label = 'Auteur / Responsable', showInitials = false,
}: AuthorNativeSelectProps) => {
  if (loading) {
    return (
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label} <span className="text-orange-500">*</span>
        </label>
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 text-sm text-slate-400">
          <Loader2 size={15} className="animate-spin" /> Chargement des auteurs…
        </div>
      </div>
    );
  }

  if (authors.length === 0) {
    return (
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label} <span className="text-orange-500">*</span>
        </label>
        <p className="text-sm text-slate-400 px-4 py-3 rounded-xl border-2 border-slate-200">Aucun auteur disponible.</p>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} <span className="text-orange-500">*</span>
      </label>
      <div
        className={`relative rounded-xl border-2 transition-all duration-150 ${
          error
            ? 'border-rose-400 ring-2 ring-rose-100'
            : 'border-slate-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100'
        }`}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white px-4 py-3 text-sm text-slate-800 outline-none rounded-xl cursor-pointer"
        >
          <option value="">Sélectionner un auteur</option>
          {authors.map((a) => (
            <option key={a.id} value={String(a.id)}>
              {showInitials ? `${initials(a.name)} — ` : ''}{a.name}{a.role ? ` — ${a.role}` : ''}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
};

export default AuthorNativeSelect;