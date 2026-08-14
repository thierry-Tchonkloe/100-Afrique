'use client';
// src/components/emploi/conseils/OffresWidget.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Euro, ArrowRight } from 'lucide-react';
import { fetchPublicJobs } from '@/services/emploi-public.service';
import type { PublicOffre } from '@/services/emploi-public.service';
import InlineApplyButton from './InlineApplyButton';

const CONTRACT_COLOR: Record<string, string> = {
  CDI: 'bg-green-100 text-green-700',
  CDD: 'bg-purple-100 text-purple-700',
  'CDD Saisonnier': 'bg-orange-100 text-orange-700',
  Alternance: 'bg-indigo-100 text-indigo-700',
  Stage: 'bg-teal-100 text-teal-700',
  Freelance: 'bg-pink-100 text-pink-700',
};

export default function OffresWidget() {
  const router = useRouter();
  const [offres, setOffres] = useState<PublicOffre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicJobs({ limit: 3, page: 1 })
      .then((res) => setOffres(res.offres?.length ? res.offres.slice(0, 3) : []))
      .catch(() => setOffres([]))
      .finally(() => setLoading(false));
  }, []);

  // Ne pas afficher le widget si pas d'offres (API down et pas de mock)
  if (!loading && offres.length === 0) return null;

  return (
    <div className="rounded-3xl overflow-hidden my-10"
         style={{ background: 'linear-gradient(135deg, #E8622A 0%, #f5892c 100%)' }}>
      <div className="px-8 py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-white">Les offres pour vous</h2>
          <p className="text-white/75 text-sm mt-1.5">Sélection des dernières opportunités</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white/80 rounded-2xl p-4 h-36 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {offres.map((offre) => {
              const ctColor = CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-100 text-gray-700';
              return (
                <div key={offre.id} className="bg-white rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#1E2A3A] text-sm leading-tight truncate">
                        {offre.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{offre.companyName}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${ctColor}`}>
                      {offre.contractType}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={10} /> {offre.location}
                    </span>
                    {offre.salaryMin && (
                      <span className="flex items-center gap-1">
                        <Euro size={10} />
                        {Math.round(offre.salaryMin / 1000)}–{Math.round((offre.salaryMax ?? offre.salaryMin) / 1000)}k
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <button
                      onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
                      className="flex-1 border border-gray-200 hover:border-[#E8622A] text-gray-600
                                 hover:text-[#E8622A] font-semibold text-xs py-2.5 rounded-xl
                                 transition-colors text-center"
                    >
                      Voir
                    </button>
                    <div className="flex-1">
                      <InlineApplyButton jobId={String(offre.id)} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-6">
          <Link
            href="/emploi/jobs"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30
                       text-white font-semibold text-sm px-6 py-2.5 rounded-xl
                       border border-white/30 transition-colors"
          >
            Voir toutes les offres <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
