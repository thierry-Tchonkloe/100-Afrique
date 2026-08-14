'use client';
// src/components/emploi/home/HeroSearchForm.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, FileText, Building2 } from 'lucide-react';
import { POPULAR_SEARCHES } from '@/data/metiersHomeConfig';

export default function HeroSearchForm() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [contractType, setContractType] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (location.trim()) params.set('location', location.trim());
    if (contractType) params.set('contractType', contractType);
    router.push(`/emploi/jobs?${params.toString()}`);
  }

  function handlePopularSearch(term: string) {
    setSearch(term);
    router.push(`/emploi/jobs?search=${encodeURIComponent(term)}`);
  }

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-5 text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Quoi ?</label>
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#E8622A] transition-colors">
            <Building2 size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text" placeholder="Métier, poste..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="text-gray-300 hover:text-gray-500 text-lg leading-none" aria-label="Effacer">×</button>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Où ?</label>
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#E8622A] transition-colors">
            <MapPin size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text" placeholder="Ville, région..." value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            />
            {location && (
              <button type="button" onClick={() => setLocation('')} className="text-gray-300 hover:text-gray-500 text-lg leading-none" aria-label="Effacer">×</button>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Contrat</label>
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#E8622A] transition-colors">
            <FileText size={15} className="text-gray-400 flex-shrink-0" />
            <select
              value={contractType} onChange={(e) => setContractType(e.target.value)}
              className="flex-1 text-sm text-gray-700 outline-none bg-transparent appearance-none cursor-pointer"
            >
              <option value="">Tous les contrats</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="CDD Saisonnier">CDD Saisonnier</option>
              <option value="Alternance">Alternance</option>
              <option value="Stage">Stage</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
        </div>
      </div>

      <button type="submit" className="mt-4 w-full flex items-center justify-center gap-2 bg-[#E8622A] hover:bg-[#d4561f] active:scale-[0.99] text-white font-semibold py-3.5 rounded-xl transition-all text-sm">
        <Search size={15} /> Rechercher des offres
      </button>

      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">Populaires :</span>
        {POPULAR_SEARCHES.map((q) => (
          <button key={q} type="button" onClick={() => handlePopularSearch(q)} className="text-xs text-[#E8622A] hover:underline font-medium">
            {q}
          </button>
        ))}
      </div>
    </form>
  );
}
