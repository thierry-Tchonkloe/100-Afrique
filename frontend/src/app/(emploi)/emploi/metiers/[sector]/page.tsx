'use client';
// src/app/(emploi)/emploi/metiers/[sector]/page.tsx

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { SECTORS } from '@/data/sectorPageConfig';
import { normalizeSector, type SectorKey } from '@/lib/sectors';
import { useSectorJobsSearch } from '@/hooks/useSectorJobsSearch';
import SectorHero from '@/components/emploi/metiers/SectorHero';
import SectorFilterBar from '@/components/emploi/metiers/SectorFilterBar';
import SectorJobCard from '@/components/emploi/metiers/SectorJobCard';
import SectorJobSkeleton from '@/components/emploi/metiers/SectorJobSkeleton';
import SectorSidebar from '@/components/emploi/metiers/SectorSidebar';

function SectorContent() {
  const params = useParams<{ sector: string }>();
  const router = useRouter();
  const rawSector = params.sector ?? '';

  // normalizeSector retourne '' (pas null) si non reconnu.
  const sector: SectorKey | '' = (rawSector in SECTORS) ? (rawSector as SectorKey) : normalizeSector(rawSector);
  const cfg = sector ? SECTORS[sector] : undefined;

  const {
    offres, total, loading, loadingMore, hasMore, loadMore,
    search, setSearch, contractType, setContractType, location, setLocation, resetFilters,
  } = useSectorJobsSearch(sector, cfg);

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Redirect uniquement si, même après normalisation, le secteur reste inconnu
  useEffect(() => {
    if (rawSector && !cfg) {
      router.replace('/emploi/jobs');
    }
  }, [rawSector, cfg, router]);

  function toggleFavorite(id: string) {
    setFavorites((f) => { const next = new Set(f); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }

  if (!cfg) return null;

  const hasFilters = !!search || !!contractType || !!location;

  return (
    <div className="min-h-screen bg-gray-50">
      <SectorHero cfg={cfg} total={total} loading={loading} onRoleClick={setSearch} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

          <div className="space-y-4">
            <SectorFilterBar
              search={search} setSearch={setSearch}
              contractType={contractType} setContractType={setContractType}
              location={location} setLocation={setLocation}
              total={total} loading={loading}
              onReset={resetFilters} hasFilters={hasFilters}
            />

            {hasFilters && (
              <div className="flex flex-wrap gap-2">
                {[
                  search && { key: 'search', label: search },
                  contractType && { key: 'contractType', label: contractType },
                  location && { key: 'location', label: location },
                ].filter(Boolean).map((f: any) => (
                  <span key={f.key}
                    className="flex items-center gap-1.5 bg-white border px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ borderColor: `${cfg.colorHex}40`, color: cfg.colorHex }}
                  >
                    {f.label}
                    <button
                      onClick={() => {
                        if (f.key === 'search') setSearch('');
                        if (f.key === 'contractType') setContractType('');
                        if (f.key === 'location') setLocation('');
                      }}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => <SectorJobSkeleton key={i} />)}
              </div>
            ) : offres.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 py-20 flex flex-col
                              items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                     style={{ backgroundColor: cfg.bgHex, color: cfg.colorHex }}>
                  {cfg.iconLg}
                </div>
                <p className="font-semibold text-gray-700">Aucune offre trouvée</p>
                <p className="text-sm text-gray-400 mt-1">Essayez de modifier vos critères de recherche</p>
                <button onClick={resetFilters} className="mt-4 text-sm font-semibold hover:underline" style={{ color: cfg.colorHex }}>
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3">
                  {offres.map((offre) => (
                    <SectorJobCard key={offre.id} offre={offre} sectorConfig={cfg} isFav={favorites.has(offre.id)} onFavorite={toggleFavorite} />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="flex items-center gap-2 text-white font-semibold px-8 py-3.5
                                 rounded-xl transition-all disabled:opacity-60 text-sm shadow-lg"
                      style={{ backgroundColor: cfg.colorHex }}
                    >
                      {loadingMore
                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Chargement...</>
                        : `Voir plus d'offres`}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <SectorSidebar sector={sector} cfg={cfg} />
        </div>
      </div>
    </div>
  );
}

export default function SectorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E8622A]/30 border-t-[#E8622A] rounded-full animate-spin" />
      </div>
    }>
      <SectorContent />
    </Suspense>
  );
}
