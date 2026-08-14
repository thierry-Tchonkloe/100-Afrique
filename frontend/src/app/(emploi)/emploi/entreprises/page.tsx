'use client';
// src/app/(emploi)/emploi/entreprises/page.tsx

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  SlidersHorizontal, ChevronDown, LayoutGrid, List, Building2, RotateCcw,
} from 'lucide-react';
import { useEntreprisesFilter } from '@/hooks/useEntreprisesFilter';
import { SORT_OPTIONS, type ViewMode } from '@/data/entreprisesPageConfig';
import EntreprisesHero from '@/components/emploi/entreprises/EntreprisesHero';
import CompanyFilterSidebar from '@/components/emploi/entreprises/CompanyFilterSidebar';
import CompanyCardGrid from '@/components/emploi/entreprises/CompanyCardGrid';
import CompanyCardList from '@/components/emploi/entreprises/CompanyCardList';
import ActiveCompanyFilterChips from '@/components/emploi/entreprises/ActiveCompanyFilterChips';

function EntreprisesContent() {
  const searchParams = useSearchParams();
  const {
    companies, processed, loading,
    search, setSearch, location, setLocation, activeSector, setActiveSector,
    sort, setSort, filters, setFilters, favorites, toggleFav, resetAll,
  } = useEntreprisesFilter({
    search: searchParams.get('search') ?? '',
    location: searchParams.get('location') ?? '',
    sector: searchParams.get('sector') ?? '',
  });

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const activeFilterCount = filters.sectors.length + filters.sizes.length +
    +filters.hasOffres + +filters.isPremium + +filters.isRecruiting + +(filters.minRating !== null);

  return (
    <div className="min-h-screen bg-gray-50">
      <EntreprisesHero
        totalCount={companies.length}
        search={search} setSearch={setSearch}
        location={location} setLocation={setLocation}
        activeSector={activeSector} setActiveSector={setActiveSector}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">

          <div className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-24">
              <CompanyFilterSidebar filters={filters} setFilters={setFilters} />
            </div>
          </div>

          <div className="flex-1 min-w-0">

            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 border border-gray-200 bg-white
                             text-sm font-medium text-gray-600 px-3 py-2 rounded-xl hover:border-[#E8622A] transition"
                >
                  <SlidersHorizontal size={14} />
                  Filtrer
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 bg-[#E8622A] text-white text-[10px] font-bold
                                     rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {loading ? (
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-[#1E2A3A]">{processed.length}</span> entreprise{processed.length > 1 ? 's' : ''} trouvée{processed.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <button onClick={() => setFilters({ sectors: [], sizes: [], hasOffres: false, isPremium: false, isRecruiting: false, minRating: null })}
                          className="text-xs font-semibold text-[#E8622A] flex items-center gap-1 hover:underline">
                    <RotateCcw size={11} /> Effacer filtres
                  </button>
                )}

                <div className="relative">
                  <select value={sort} onChange={(e) => setSort(e.target.value as any)}
                          className="appearance-none border border-gray-200 bg-white rounded-xl pl-3 pr-8 py-2
                                     text-xs text-gray-600 focus:outline-none focus:border-[#E8622A] transition cursor-pointer">
                    {SORT_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button onClick={() => setViewMode('grid')}
                          className={`p-2 transition ${viewMode === 'grid' ? 'bg-[#E8622A] text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                    <LayoutGrid size={14} />
                  </button>
                  <button onClick={() => setViewMode('list')}
                          className={`p-2 transition ${viewMode === 'list' ? 'bg-[#E8622A] text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            <ActiveCompanyFilterChips filters={filters} setFilters={setFilters} />

            {loading ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-36 bg-gray-100" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : processed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                  <Building2 size={24} className="text-gray-300" />
                </div>
                <p className="font-semibold text-gray-700">Aucune entreprise trouvée</p>
                <p className="text-sm text-gray-400 mt-1">Modifiez votre recherche ou vos filtres</p>
                <button onClick={resetAll} className="mt-4 text-sm font-semibold text-[#E8622A] hover:underline">
                  Tout réinitialiser
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {processed.map((c) => (
                  <CompanyCardGrid key={c.id} company={c} isFav={favorites.has(c.id)} onFav={toggleFav} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {processed.map((c) => (
                  <CompanyCardList key={c.id} company={c} isFav={favorites.has(c.id)} onFav={toggleFav} />
                ))}
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
              <CompanyFilterSidebar filters={filters} setFilters={setFilters} onClose={() => setShowMobileFilters(false)} />
              <button onClick={() => setShowMobileFilters(false)}
                      className="w-full mt-4 bg-[#E8622A] text-white font-bold py-3 rounded-xl text-sm">
                Voir {processed.length} entreprise{processed.length > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EntreprisesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E8622A]/30 border-t-[#E8622A] rounded-full animate-spin" />
      </div>
    }>
      <EntreprisesContent />
    </Suspense>
  );
}
