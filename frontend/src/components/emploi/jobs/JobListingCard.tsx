'use client';
// src/components/emploi/jobs/JobListingCard.tsx
import { useRouter } from 'next/navigation';
import { MapPin, Heart, Clock, Star, ChevronRight, Banknote } from 'lucide-react';
import { sectorIcon, sectorColorClasses } from '@/components/emploi/public/sectorVisuals';
import { timeAgoPublic } from '@/utils/date';
import ApplyButton from '@/components/emploi/public/ApplyButton';
import { CONTRACT_COLOR } from './JobsFilterTypes';
import type { PublicOffre } from '@/services/emploi-public.service';

// L'icône/couleur de secteur passe par sectorIcon()/sectorColorClasses()
// (normalisation via normalizeSector) pour éviter les secteurs non couverts.
export default function JobListingCard({
  offre, onFavorite, isFav,
}: { offre: PublicOffre; onFavorite: (id: string) => void; isFav: boolean }) {
  const router = useRouter();
  const ctColor = CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600';
  const isNew = Date.now() - new Date(offre.publishedAt).getTime() < 48 * 3_600_000;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 group overflow-hidden">
      <div className="p-5">
        <div className="flex gap-4">
          <button
            onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
            className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${sectorColorClasses(offre.sector)} hover:opacity-80 transition-opacity`}
            aria-label="Voir l'offre"
          >
            {sectorIcon(offre.sector)}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <button
                  onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
                  className="font-bold text-[#1E2A3A] text-base group-hover:text-[#E8622A] transition-colors leading-tight text-left hover:underline line-clamp-1 w-full"
                >
                  {offre.title}
                </button>
                <p className="text-[#E8622A] text-sm font-medium mt-0.5 truncate">{offre.companyName}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={11} /> {timeAgoPublic(offre.publishedAt)}
                </span>
                <button onClick={(e) => { e.stopPropagation(); onFavorite(offre.id); }} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" aria-label="Sauvegarder">
                  <Heart size={15} className={isFav ? 'text-red-500 fill-red-500' : 'text-gray-300 hover:text-red-400'} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${ctColor}`}>{offre.contractType}</span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={11} /> {offre.location}
              </span>
              {offre.remote && offre.remote !== 'none' && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {offre.remote === 'full' ? 'Télétravail' : 'Hybride'}
                </span>
              )}
              {offre.salaryMin && (
                <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                  <Banknote size={10} className="text-green-500" />
                  {Math.round(offre.salaryMin / 1000)}–{Math.round((offre.salaryMax ?? offre.salaryMin) / 1000)}k€
                </span>
              )}
              {offre.isPremium && (
                <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                  <Star size={9} fill="currentColor" /> Premium
                </span>
              )}
              {isNew && (
                <span className="text-[10px] font-bold text-[#E8622A] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">Nouveau</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-4 flex items-center justify-between gap-3 border-t border-gray-50 pt-3">
        <button onClick={() => router.push(`/emploi/jobs/${offre.id}`)} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#E8622A] transition-colors">
          Voir le détail <ChevronRight size={13} />
        </button>
        {/* ApplyButton partagé (hooks/useJobApply + useAuthUser) — ne montre jamais un faux succès. */}
        <ApplyButton jobId={String(offre.id)} variant="pill" />
      </div>
    </div>
  );
}
