'use client';
// src/components/emploi/entreprise-detail/OffresTab.tsx
import { useState } from 'react';
import Link from 'next/link';
import { Clock, Eye, Send } from 'lucide-react';
import { CONTRACT_COLOR } from '@/data/perkMeta';
import { timeAgo, fmtSalary } from './detailHelpers';
import type { PublicCompanyDetail } from '@/services/emploi-public.service';

const FILTER_OPTIONS = ['Tous', 'CDI', 'CDD', 'Alternance', 'Stage', 'Télétravail possible'];
const PER_PAGE = 5;

export default function OffresTab({ data }: { data: PublicCompanyDetail }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [page, setPage] = useState(1);

  const offres = data.offres ?? [];

  const filtered = offres.filter((o) => {
    const matchSearch = !search || o.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === 'Tous' ||
      activeFilter === o.contractType ||
      (activeFilter === 'Télétravail possible' && (o.remote === 'partial' || o.remote === 'full'));
    return matchSearch && matchFilter;
  });

  const counts: Record<string, number> = { Tous: offres.length };
  for (const o of offres) counts[o.contractType] = (counts[o.contractType] ?? 0) + 1;
  const teleCount = offres.filter((o) => o.remote === 'partial' || o.remote === 'full').length;

  const shown = filtered.slice(0, page * PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={`Rechercher un métier chez ${data.name}...`}
            className="w-full pl-4 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] transition"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((f) => {
            const count = f === 'Tous' ? offres.length
              : f === 'Télétravail possible' ? teleCount
              : (counts[f] ?? 0);
            if (f !== 'Tous' && f !== 'Télétravail possible' && count === 0) return null;
            return (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); setPage(1); }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                  activeFilter === f ? 'bg-[#E8622A] border-[#E8622A] text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                }`}
              >
                {f} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-sm font-semibold text-gray-700">
        <span className="text-[#1E2A3A]">{filtered.length}</span> offre{filtered.length > 1 ? 's' : ''} d'emploi
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center bg-white rounded-2xl border border-gray-100">
          <p className="text-sm font-semibold text-gray-500">Aucune offre trouvée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((offre) => (
            <div key={offre.id}
                 className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-[#1E2A3A] text-base leading-tight">{offre.title}</h3>
                    <p className="text-[#E8622A] font-semibold text-xs mt-0.5 flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600'}`}>
                        {offre.contractType}
                      </span>
                      •&nbsp;{offre.location}
                    </p>
                  </div>
                  {fmtSalary(offre) && (
                    <p className="font-extrabold text-[#1E2A3A] text-base flex-shrink-0">{fmtSalary(offre)}</p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={10} /> Publié {timeAgo(offre.publishedAt)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link href={`/emploi/jobs/${offre.id}`}
                          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500
                                     border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition">
                      <Eye size={12} /> Voir détails
                    </Link>
                    <Link href={`/emploi/jobs/${offre.id}`}
                          className="flex items-center gap-1.5 text-xs font-semibold text-white
                                     bg-[#E8622A] hover:bg-[#d4561f] px-3 py-1.5 rounded-xl transition">
                      <Send size={12} /> Postuler
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {shown.length < filtered.length && (
        <div className="flex justify-center pt-2">
          <button onClick={() => setPage((p) => p + 1)}
                  className="border border-gray-200 bg-white text-gray-600 font-semibold text-sm px-8 py-3 rounded-xl hover:bg-gray-50 transition">
            Charger plus d'offres
          </button>
        </div>
      )}
    </div>
  );
}
