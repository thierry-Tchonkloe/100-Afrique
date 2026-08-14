'use client';
// src/components/emploi/job-detail/JobInfoSidebar.tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Briefcase, MapPin, Banknote, Wifi, ExternalLink, ArrowLeft, ChevronRight,
} from 'lucide-react';
import { normalizeSector, sectorBrowseUrl } from '@/lib/sectors';
import { SECTOR_ICON, SECTOR_COLOR } from './jobDetailVisuals';
import JobApplyButton from './JobApplyButton';
import SimilarJobCard from './SimilarJobCard';
import type { JobDetail } from '@/hooks/useJobDetail';
import type { PublicOffre } from '@/services/emploi-public.service';

export default function JobInfoSidebar({
  jobId, job, similar,
}: { jobId: string; job: JobDetail; similar: PublicOffre[] }) {
  const router = useRouter();
  const sectorKey = normalizeSector(job.sector);
  const sectorIcon = SECTOR_ICON[sectorKey] ?? <Briefcase size={22} />;
  const sectorColor = SECTOR_COLOR[sectorKey] ?? 'bg-gray-50 text-gray-600';
  const browseUrl = sectorBrowseUrl(job.sector);
  const salaryText = job.salaryMin
    ? `${Math.round(job.salaryMin / 1000)}–${Math.round((job.salaryMax ?? job.salaryMin) / 1000)}k€ / an`
    : null;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
        <JobApplyButton jobId={jobId} />

        <div className="mt-5 space-y-3 border-t border-gray-50 pt-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
              <Briefcase size={14} className="text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Type de contrat</p>
              <p className="text-sm font-semibold text-[#1E2A3A]">{job.contractType}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
              <MapPin size={14} className="text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Localisation</p>
              <p className="text-sm font-semibold text-[#1E2A3A]">{job.location}</p>
            </div>
          </div>
          {salaryText && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Banknote size={14} className="text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Rémunération</p>
                <p className="text-sm font-semibold text-[#1E2A3A]">{salaryText}</p>
              </div>
            </div>
          )}
          {job.remote && job.remote !== 'none' && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Wifi size={14} className="text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Télétravail</p>
                <p className="text-sm font-semibold text-[#1E2A3A]">
                  {job.remote === 'full' ? 'Full remote' : 'Hybride'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {job.company && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${sectorColor}`}>
              {sectorIcon}
            </div>
            <div>
              <p className="font-bold text-[#1E2A3A] text-sm">{job.company.name}</p>
              {job.company.slogan && (
                <p className="text-xs text-gray-400 italic">{job.company.slogan}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <MapPin size={11} /> {job.company.city}
          </div>
          <Link
            href={`/emploi/entreprises/${job.company.id}`}
            className="flex items-center justify-center gap-1.5 w-full border border-gray-200
                       hover:border-[#E8622A] text-gray-600 hover:text-[#E8622A] text-xs font-semibold
                       py-2.5 rounded-xl transition-colors"
          >
            <ExternalLink size={12} /> Voir la vitrine entreprise
          </Link>
        </div>
      )}

      {similar.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-[#1E2A3A] text-sm mb-3">Offres similaires</h3>
          <div className="space-y-1">
            {similar.map((o) => <SimilarJobCard key={o.id} offre={o} />)}
          </div>

          {/* browseUrl pointe vers /emploi/metiers/{clé} quand la page métier existe,
              sinon vers /emploi/jobs?sector=... (repli sûr, jamais de redirection auto). */}
          <button
            type="button"
            onClick={() => router.push(browseUrl)}
            className="flex items-center justify-center gap-1.5 w-full mt-3 pt-3 border-t border-gray-50
                       text-xs font-semibold text-[#E8622A] hover:underline"
          >
            Voir toutes les offres · {job.sector} <ChevronRight size={12} />
          </button>
        </div>
      )}

      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors pl-1"
      >
        <ArrowLeft size={13} /> Retour aux résultats
      </button>
    </div>
  );
}
