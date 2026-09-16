'use client';
// src/components/emploi/metiers/SectorJobCard.tsx
import { useRouter } from 'next/navigation';
import { MapPin, Clock, Heart, Wifi, Star, Banknote, ChevronRight } from 'lucide-react';
import { SECTOR_CONTRACT_COLOR } from '@/data/sectorPageConfig';
import type { SectorConfig } from '@/data/sectorPageConfig';
import type { PublicOffre } from '@/services/emploi-public.service';

function timeAgo(iso: string): string {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return "À l'instant";
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'Hier' : `Il y a ${d} jours`;
}

export default function SectorJobCard({
  offre, sectorConfig, isFav, onFavorite,
}: {
  offre: PublicOffre; sectorConfig: SectorConfig; isFav: boolean; onFavorite: (id: string) => void;
}) {
  const router = useRouter();
  const ctColor = SECTOR_CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600 border-gray-100';
  const isNew = Date.now() - new Date(offre.publishedAt).getTime() < 48 * 3_600_000;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200
                    hover:shadow-md transition-all duration-200 group overflow-hidden">
      <div className="p-5">
        <div className="flex gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${sectorConfig.color}`}>
            {sectorConfig.iconLg}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <button
                  onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
                  className="font-bold text-[#1E2A3A] text-base group-hover:text-[#E8622A]
                             transition-colors leading-tight text-left hover:underline"
                >
                  {offre.title}
                </button>
                <p className="text-sm font-medium mt-0.5" style={{ color: sectorConfig.colorHex }}>
                  {offre.companyName}
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={11} /> {timeAgo(offre.publishedAt)}
                </span>
                <button
                  onClick={() => onFavorite(offre.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  aria-label="Sauvegarder"
                >
                  <Heart size={15} className={isFav ? 'text-red-500 fill-red-500' : 'text-gray-300 hover:text-red-400'} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${ctColor}`}>
                {offre.contractType}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={11} /> {offre.location}
              </span>
              {offre.remote && offre.remote !== 'none' && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50
                                 px-2 py-0.5 rounded-full">
                  <Wifi size={10} /> {offre.remote === 'full' ? 'Full remote' : 'Hybride'}
                </span>
              )}
              {offre.isPremium && (
                <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50
                                 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                  <Star size={9} fill="currentColor" /> Premium
                </span>
              )}
              {isNew && (
                <span className="text-[10px] font-bold text-[#E8622A] bg-orange-50 px-2 py-0.5
                                 rounded-full border border-orange-100">
                  Nouveau
                </span>
              )}
              {offre.salaryMin && (
                <span className="flex items-center gap-1 text-xs text-gray-500 font-medium ml-auto">
                  <Banknote size={11} className="text-green-500" />
                  {Math.round(offre.salaryMin / 1000)}–{Math.round((offre.salaryMax ?? offre.salaryMin) / 1000)}k€
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-4">
        <button
          onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold
                     border-2 transition-all duration-200 hover:text-white"
          style={{ borderColor: sectorConfig.colorHex, color: sectorConfig.colorHex }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = sectorConfig.colorHex;
            (e.currentTarget as HTMLButtonElement).style.color = 'white';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = sectorConfig.colorHex;
          }}
        >
          Voir l&apos;offre <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
