'use client';
// src/components/emploi/job-detail/JobHeaderCard.tsx
import { useState } from 'react';
import { MapPin, Wifi, Star, Share2, Heart, Clock, Banknote, Building2 } from 'lucide-react';
import { normalizeSector } from '@/lib/sectors';
import { SECTOR_ICON, SECTOR_COLOR, CONTRACT_COLOR, timeAgo, daysLeft } from './jobDetailVisuals';
import type { JobDetail } from '@/hooks/useJobDetail';

export default function JobHeaderCard({ job }: { job: JobDetail }) {
  const [isFav, setIsFav] = useState(false);
  const [copyDone, setCopyDone] = useState(false);

  const sectorKey = normalizeSector(job.sector);
  const sectorIcon = SECTOR_ICON[sectorKey] ?? <Building2 size={22} />;
  const sectorColor = SECTOR_COLOR[sectorKey] ?? 'bg-gray-50 text-gray-600';
  const ctColor = CONTRACT_COLOR[job.contractType] ?? 'bg-gray-50 text-gray-600 border-gray-100';
  const expiry = daysLeft(job.expiresAt);
  const isNew = Date.now() - new Date(job.publishedAt).getTime() < 48 * 3_600_000;
  const salaryText = job.salaryMin
    ? `${Math.round(job.salaryMin / 1000)}–${Math.round((job.salaryMax ?? job.salaryMin) / 1000)}k€ / an`
    : null;

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex gap-4">
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${sectorColor}`}>
          {job.company?.logo
            ? <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover rounded-xl" />
            : sectorIcon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold text-[#1E2A3A] leading-tight">{job.title}</h1>
              <p className="text-[#E8622A] font-semibold text-sm mt-0.5">
                {job.company?.name ?? job.companyName}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={handleShare}
                className="p-2 rounded-xl hover:bg-gray-50 border border-gray-100 text-gray-400
                           hover:text-gray-600 transition-colors relative"
                title="Copier le lien"
              >
                <Share2 size={15} />
                {copyDone && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white
                                   text-[10px] px-2 py-1 rounded-lg whitespace-nowrap">
                    Copié !
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsFav((v) => !v)}
                className="p-2 rounded-xl hover:bg-red-50 border border-gray-100 transition-colors"
              >
                <Heart size={15} className={isFav ? 'text-red-500 fill-red-500' : 'text-gray-300 hover:text-red-400'} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${ctColor}`}>
              {job.contractType}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={11} /> {job.location}
            </span>
            {job.remote && job.remote !== 'none' && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <Wifi size={10} /> {job.remote === 'full' ? 'Full remote' : 'Hybride'}
              </span>
            )}
            {job.isPremium && (
              <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50
                               border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                <Star size={9} fill="currentColor" /> Premium
              </span>
            )}
            {isNew && (
              <span className="text-xs font-bold text-[#E8622A] bg-orange-50 px-2 py-0.5
                               rounded-full border border-orange-100">
                Nouveau
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-gray-50">
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock size={11} /> {timeAgo(job.publishedAt)}
            </span>
            {salaryText && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <Banknote size={11} className="text-green-500" /> {salaryText}
              </span>
            )}
            {expiry && (
              <span className={`text-xs font-medium ${expiry === 'Expirée' ? 'text-red-500' : 'text-amber-500'}`}>
                ⏱ {expiry}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
