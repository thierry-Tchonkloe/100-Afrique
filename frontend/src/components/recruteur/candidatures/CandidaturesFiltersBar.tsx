'use client';
// src/components/recruteur/candidatures/CandidaturesFiltersBar.tsx
import { Search, ChevronDown } from 'lucide-react';
import type { CandidaturesRecResponse } from '@/types/candidatures-rec.types';

export default function CandidaturesFiltersBar({
  offerId, setOfferId, search, setSearch, offers,
}: {
  offerId: string; setOfferId: (v: string) => void;
  search: string; setSearch: (v: string) => void;
  offers: CandidaturesRecResponse['offers'];
}) {
  return (
    <>
      <div className="relative">
        <select value={offerId} onChange={(e) => setOfferId(e.target.value)}
          className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition cursor-pointer min-w-40">
          <option value="">Toutes les offres</option>
          {offers.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
        </select>
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, poste ou compétence…"
          className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white w-64 focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition" />
      </div>
    </>
  );
}
