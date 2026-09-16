'use client';
// src/components/emploi/home/HomeJobCard.tsx
import { useRouter } from 'next/navigation';
import { MapPin, Wifi, Star, ChevronRight, Clock } from 'lucide-react';
import { sectorIcon, sectorColorClasses } from '@/components/emploi/public/sectorVisuals';
import { timeAgoPublic } from '@/utils/date';
import { CONTRACT_COLOR } from '@/data/metiersHomeConfig';
import type { PublicOffre } from '@/services/emploi-public.service';

export default function HomeJobCard({ offre }: { offre: PublicOffre }) {
  const router = useRouter();
  const ctColor = CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600 border-gray-100';
  const isNew = Date.now() - new Date(offre.publishedAt).getTime() < 24 * 3_600_000;

  return (
    <button
      onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
      className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100
                 hover:border-[#E8622A]/30 hover:shadow-md transition-all duration-200 group text-left"
    >
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${sectorColorClasses(offre.sector)}`}>
        {sectorIcon(offre.sector)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-[#1E2A3A] text-sm group-hover:text-[#E8622A] transition-colors truncate">
            {offre.title}
          </h3>
          {isNew && (
            <span className="flex-shrink-0 text-[10px] font-bold text-[#E8622A] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
              Nouveau
            </span>
          )}
          {offre.isPremium && (
            <span className="flex-shrink-0 flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              <Star size={8} fill="currentColor" /> Premium
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-0.5 truncate">{offre.companyName}</p>

        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ctColor}`}>{offre.contractType}</span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={10} /> {offre.location}
          </span>
          {offre.remote && offre.remote !== 'none' && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <Wifi size={9} /> {offre.remote === 'full' ? 'Remote' : 'Hybride'}
            </span>
          )}
          {offre.salaryMin && (
            <span className="text-xs text-gray-400">
              {Math.round(offre.salaryMin / 1000)}–{Math.round((offre.salaryMax ?? offre.salaryMin) / 1000)}k€
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
            <Clock size={10} /> {timeAgoPublic(offre.publishedAt)}
          </span>
        </div>
      </div>

      <ChevronRight size={15} className="flex-shrink-0 text-gray-300 group-hover:text-[#E8622A] group-hover:translate-x-0.5 transition-all" />
    </button>
  );
}
