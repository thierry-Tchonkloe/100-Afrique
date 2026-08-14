'use client';
// src/app/(emploi)/emploi/jobs/page.tsx

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown, Search } from 'lucide-react';
import JobListingCard from '@/components/emploi/jobs/JobListingCard';
import JobsSidebar from '@/components/emploi/jobs/JobsSidebar';
import JobCardSkeleton from '@/components/emploi/jobs/JobCardSkeleton';
import ActiveJobsFilterChips from '@/components/emploi/jobs/ActiveJobsFilterChips';
import { EMPTY_JOBS_FILTERS, SORT_OPTIONS, type JobsFilters } from '@/components/emploi/jobs/JobsFilterTypes';
import { useJobsSearch } from '@/hooks/useJobsSearch';

function JobsContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<JobsFilters>({
    ...EMPTY_JOBS_FILTERS,
    search: searchParams.get('search') ?? '',
    location: searchParams.get('location') ?? '',
    contractTypes: searchParams.get('contractType') ? [searchParams.get('contractType')!] : [],
  });

  const { offres, total, loading, loadingMore, hasMore, loadMore } = useJobsSearch(filters);
  const [sort, setSort] = useState('Plus récentes');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  function toggleFavorite(id: string) {
    setFavorites((f) => { const next = new Set(f); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }

  const activeFilters = filters.contractTypes.length + filters.remote.length + filters.experience.length + filters.advantages.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <JobsSidebar filters={filters} setFilters={setFilters} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowMobileFilters(true)} className="lg:hidden flex items-center gap-2 border border-gray-200 bg-white rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:border-[#E8622A] transition">
                  <SlidersHorizontal size={15} /> Filtrer
                  {activeFilters > 0 && <span className="w-4 h-4 bg-[#E8622A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{activeFilters}</span>}
                </button>
                <p className="text-sm font-semibold text-gray-700">
                  {loading
                    ? <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse" />
                    : <><span className="text-[#1E2A3A] font-bold">{total}</span> offres d&apos;emploi trouvées</>}
                </p>
              </div>

              <div className="relative">
                <select value={sort} onChange={(e) => setSort(e.target.value)}
                  className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:border-[#E8622A] transition cursor-pointer">
                  {SORT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <ArrowUpDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {activeFilters > 0 && <ActiveJobsFilterChips filters={filters} setFilters={setFilters} />}

            {loading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <JobCardSkeleton key={i} />)}</div>
            ) : offres.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                  <Search size={24} className="text-gray-300" />
                </div>
                <p className="font-semibold text-gray-700">Aucune offre trouvée</p>
                <p className="text-sm text-gray-400 mt-1">Essayez de modifier vos critères</p>
                <button onClick={() => setFilters(EMPTY_JOBS_FILTERS)} className="mt-4 text-sm text-[#E8622A] font-semibold hover:underline">Réinitialiser les filtres</button>
              </div>
            ) : (
              <div className="space-y-3">
                {offres.map((offre) => <JobListingCard key={offre.id} offre={offre} onFavorite={toggleFavorite} isFav={favorites.has(offre.id)} />)}

                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <button onClick={loadMore} disabled={loadingMore}
                      className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#d4561f] text-white font-semibold px-8 py-3.5 rounded-xl transition disabled:opacity-60 text-sm">
                      {loadingMore
                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Chargement...</>
                        : "Charger plus d'offres"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-50 overflow-y-auto shadow-2xl">
            <div className="p-4">
              <JobsSidebar filters={filters} setFilters={setFilters} onClose={() => setShowMobileFilters(false)} />
              <button onClick={() => setShowMobileFilters(false)} className="w-full mt-4 bg-[#E8622A] text-white font-semibold py-3 rounded-xl text-sm">
                Voir les {total} offres
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#E8622A]/30 border-t-[#E8622A] rounded-full animate-spin" /></div>}>
      <JobsContent />
    </Suspense>
  );
}
