'use client';
// src/components/emploi/job-detail/SimilarJobCard.tsx
import { useRouter } from 'next/navigation';
import { Building2, ChevronRight } from 'lucide-react';
import { normalizeSector } from '@/lib/sectors';
import { SECTOR_ICON, SECTOR_COLOR, CONTRACT_COLOR } from './jobDetailVisuals';
import type { PublicOffre } from '@/services/emploi-public.service';

export default function SimilarJobCard({ offre }: { offre: PublicOffre }) {
  const router = useRouter();
  const sectorKey = normalizeSector(offre.sector);
  const icon = SECTOR_ICON[sectorKey] ?? <Building2 size={16} />;
  const iconColor = SECTOR_COLOR[sectorKey] ?? 'bg-gray-50 text-gray-600';
  const ctColor = CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600 border-gray-100';

  return (
    <button
      onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50
                 transition-colors duration-150 text-left group"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1E2A3A] group-hover:text-[#E8622A]
                      transition-colors truncate leading-tight">
          {offre.title}
        </p>
        <p className="text-xs text-gray-400 truncate mt-0.5">{offre.companyName} · {offre.location}</p>
        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${ctColor}`}>
          {offre.contractType}
        </span>
      </div>
      <ChevronRight size={14} className="text-gray-300 group-hover:text-[#E8622A] flex-shrink-0 transition-colors" />
    </button>
  );
}
