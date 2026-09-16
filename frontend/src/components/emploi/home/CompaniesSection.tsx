'use client';
// src/components/emploi/home/CompaniesSection.tsx
import Link from 'next/link';
import { AlertCircle, ArrowRight, Building2 } from 'lucide-react';
import HomeCompanyCard from './HomeCompanyCard';
import { CompanySkeleton } from './HomeSkeletons';
import type { PublicEtablissement } from '@/services/emploi-public.service';

export default function CompaniesSection({
  companies, loading, error,
}: { companies: PublicEtablissement[]; loading: boolean; error: boolean }) {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">Découvrez les entreprises qui recrutent</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Explorez les marques employeurs du secteur touristique
            {error && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-500">
                <AlertCircle size={11} /> données démo (API indisponible)
              </span>
            )}
          </p>
        </div>
        <Link href="/emploi/entreprises" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#E8622A] hover:underline flex-shrink-0">
          Toutes les entreprises <ArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <CompanySkeleton key={i} />)}
        </div>
      ) : companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-2xl border border-gray-100">
          <Building2 size={28} className="text-gray-300 mb-2" />
          <p className="text-sm font-semibold text-gray-600">Aucune entreprise à afficher pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {companies.map((c) => <HomeCompanyCard key={c.id} company={c} />)}
        </div>
      )}

      <div className="flex justify-center mt-6 sm:hidden">
        <Link href="/emploi/entreprises" className="flex items-center gap-2 border border-[#E8622A] text-[#E8622A] font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-[#E8622A] hover:text-white transition-colors">
          Voir toutes les entreprises <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
