'use client';
// src/components/emploi/home/MetiersSection.tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import MetierCard from './MetierCard';
import { METIERS } from '@/data/metiersHomeConfig';
import { normalizeSector } from '@/lib/sectors';
import type { PublicOffre } from '@/services/emploi-public.service';

export default function MetiersSection({ offres, loadingJobs }: { offres: PublicOffre[]; loadingJobs: boolean }) {
  const router = useRouter();

  return (
    <section className="py-14 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">Parcourir par Métiers</h2>
          <p className="text-gray-500 mt-1 text-sm">Cliquez sur un secteur pour voir toutes les offres disponibles</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {METIERS.map((m) => <MetierCard key={m.sector} metier={m} />)}
        </div>

        <div className="mt-8 grid grid-cols-4 sm:grid-cols-8 gap-3">
          {METIERS.map((m) => {
            const count = offres.filter((o) => normalizeSector(o.sector) === m.sector).length;
            return (
              <button key={m.sector} onClick={() => router.push(`/emploi/metiers/${m.sector}`)}
                className="text-center py-2 px-3 rounded-xl bg-white border border-gray-100 hover:border-[#E8622A]/30 transition-colors cursor-pointer group">
                <p className="text-lg font-extrabold text-[#1E2A3A] group-hover:text-[#E8622A] transition-colors">
                  {loadingJobs ? '—' : `${count}+`}
                </p>
                <p className="text-[10px] text-gray-400 leading-tight">{m.label}</p>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/emploi/jobs" className="flex items-center gap-2 bg-[#1E2A3A] hover:bg-[#2d3f55] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors">
            Voir toutes les offres <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
