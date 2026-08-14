'use client';
// src/components/emploi/home/LatestJobsSection.tsx
import Link from 'next/link';
import { AlertCircle, ArrowRight, Search } from 'lucide-react';
import HomeJobCard from './HomeJobCard';
import { JobSkeleton } from './HomeSkeletons';
import { METIERS } from '@/data/metiersHomeConfig';
import type { PublicOffre } from '@/services/emploi-public.service';

export default function LatestJobsSection({
  offres, loading, error, totalJobs,
}: { offres: PublicOffre[]; loading: boolean; error: boolean; totalJobs: number | null }) {
  return (
    <section className="py-16 px-6 max-w-4xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">Les dernières opportunités à saisir</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Postes fraîchement publiés par nos partenaires
            {error && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-500">
                <AlertCircle size={11} /> données démo (API indisponible)
              </span>
            )}
          </p>
        </div>
        <Link href="/emploi/jobs" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#E8622A] hover:underline flex-shrink-0">
          Voir tout <ArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <JobSkeleton key={i} />)}
        </div>
      ) : offres.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-2xl border border-gray-100">
          <Search size={28} className="text-gray-300 mb-2" />
          <p className="text-sm font-semibold text-gray-600">
            {error ? 'Impossible de charger les offres pour le moment' : 'Aucune offre active pour le moment'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {offres.map((offre) => <HomeJobCard key={offre.id} offre={offre} />)}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
        <Link href="/emploi/jobs" className="inline-flex items-center gap-2 bg-[#1E2A3A] hover:bg-[#2d3f55] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm">
          Voir toutes les offres{totalJobs ? ` (${totalJobs.toLocaleString('fr-FR')})` : ''} <ArrowRight size={15} />
        </Link>
        <div className="flex flex-wrap justify-center gap-2">
          {METIERS.slice(0, 3).map((m) => (
            <Link key={m.sector} href={`/emploi/jobs?sector=${m.sector}`} className="text-xs text-gray-500 hover:text-[#E8622A] border border-gray-200 hover:border-[#E8622A]/40 px-3 py-1.5 rounded-full transition-colors">
              {m.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
