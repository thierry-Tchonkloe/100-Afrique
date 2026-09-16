'use client';
// src/components/emploi/entreprises/EntreprisesHero.tsx
import { Search, X, MapPin } from 'lucide-react';
import { FEATURED_SECTORS } from '@/data/entreprisesPageConfig';

export default function EntreprisesHero({
  totalCount, search, setSearch, location, setLocation, activeSector, setActiveSector,
}: {
  totalCount: number;
  search: string; setSearch: (v: string) => void;
  location: string; setLocation: (v: string) => void;
  activeSector: string; setActiveSector: (v: string) => void;
}) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-[#1E2A3A]">
            Découvrir les Entreprises
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Explorez <span className="font-semibold text-[#E8622A]">{totalCount} entreprises</span> qui recrutent dans le tourisme & l'hôtellerie
          </p>
        </div>

        <div className="flex gap-3 flex-wrap md:flex-nowrap">
          <div className="relative flex-1 min-w-64">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom d'entreprise, secteur, mot-clé..."
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white
                         focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] transition"
            />
            {search && (
              <button onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="relative min-w-48">
            <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ville, région..."
              className="w-full pl-9 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white
                         focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] transition"
            />
          </div>
          <button className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#d4561f] text-white
                             font-semibold text-sm px-6 py-3 rounded-xl transition flex-shrink-0">
            <Search size={15} /> Rechercher
          </button>
        </div>

        <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveSector('')}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border
                       flex-shrink-0 transition-all ${!activeSector
                         ? 'bg-[#1E2A3A] text-white border-[#1E2A3A]'
                         : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'}`}
          >
            Tous les secteurs
          </button>
          {FEATURED_SECTORS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSector(activeSector === s.key ? '' : s.key)}
              className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border
                         flex-shrink-0 transition-all ${activeSector === s.key
                           ? 'bg-[#E8622A] text-white border-[#E8622A]'
                           : `border ${s.color} hover:shadow-sm`}`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
