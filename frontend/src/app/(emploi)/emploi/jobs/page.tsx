'use client';
// src/app/(emploi)/emploi/jobs/page.tsx

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search, MapPin, SlidersHorizontal, X, ChevronDown, ChevronUp,
  Heart, Clock, RotateCcw, ArrowUpDown, Star, ChevronRight,
  Banknote,
} from 'lucide-react';
import { fetchPublicJobs, MOCK_OFFRES } from '@/services/emploi-public.service';
import type { PublicOffre } from '@/services/emploi-public.service';
import { sectorIcon, sectorColorClasses } from '@/components/emploi/public/sectorVisuals';
import { timeAgoPublic } from '@/utils/date';
import ApplyButton from '@/components/emploi/public/ApplyButton';

// ── Debounce hook ─────────────────────────────────────────────────────────────
function useDebouncedValue<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Types filtres ─────────────────────────────────────────────────────────────

interface Filters {
  search: string;
  location: string;
  radius: string;
  contractTypes: string[];
  remote: string[];
  sectors: string[];
  experience: string[];
  advantages: string[];
}

const EMPTY_FILTERS: Filters = {
  search: '', location: '', radius: '20',
  contractTypes: [], remote: [], sectors: [], experience: [], advantages: [],
};

const CONTRACT_OPTIONS = ['CDI', 'CDD', 'Alternance', 'Stage', 'Freelance', 'CDD Saisonnier'];

// FIX (déjà en place) : valeurs alignées sur le schéma réel de l'offre
// (remote: 'none' | 'partial' | 'full'), transmises telles quelles au backend.
const REMOTE_OPTIONS: { value: string; label: string }[] = [
  { value: 'full', label: 'Full remote' },
  { value: 'partial', label: 'Hybride' },
  { value: 'none', label: 'Présentiel uniquement' },
];

const EXPERIENCE_OPTIONS = ['Débutant', '2-5 ans', '5-10 ans', 'Senior'];
const ADVANTAGE_OPTIONS = ['Logement fourni', 'Mutuelle', 'Primes', 'Véhicule'];
const SORT_OPTIONS = ['Plus récentes', 'Salaire (croissant)', 'Pertinence'];

const CONTRACT_COLOR: Record<string, string> = {
  CDI: 'bg-blue-50 text-blue-700',
  CDD: 'bg-purple-50 text-purple-700',
  'CDD Saisonnier': 'bg-orange-50 text-orange-700',
  Alternance: 'bg-indigo-50 text-indigo-700',
  Stage: 'bg-teal-50 text-teal-700',
  Freelance: 'bg-pink-50 text-pink-700',
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-14 h-14 bg-gray-100 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
          <div className="flex gap-2 mt-2">
            <div className="h-5 bg-gray-100 rounded-full w-12" />
            <div className="h-5 bg-gray-100 rounded-full w-16" />
            <div className="h-5 bg-gray-100 rounded-full w-14" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Accordion ─────────────────────────────────────────────────────────────────

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between py-3 text-sm font-semibold text-gray-700 hover:text-[#E8622A] transition-colors">
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 py-1 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${checked ? 'bg-[#E8622A] border-[#E8622A]' : 'border-gray-300 group-hover:border-[#E8622A]'}`}
      >
        {checked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-600 group-hover:text-gray-900">{label}</span>
    </label>
  );
}

// ── Job Card ──────────────────────────────────────────────────────────────────
// FIX : l'icône/couleur de secteur passe désormais par sectorIcon()/
// sectorColorClasses() (normalisation via normalizeSector), au lieu
// d'indexer directement `offre.sector` — l'ancienne map SECTOR_ICON
// mélangeait clés canoniques ('hotel') et libellés bruts ('Hôtellerie'),
// et un secteur non couvert tombait silencieusement sur une icône
// générique sans qu'on s'en aperçoive.

function JobCard({ offre, onFavorite, isFav }: { offre: PublicOffre; onFavorite: (id: string) => void; isFav: boolean }) {
  const router = useRouter();
  const ctColor = CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600';
  const isNew = Date.now() - new Date(offre.publishedAt).getTime() < 48 * 3_600_000;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 group overflow-hidden">
      <div className="p-5">
        <div className="flex gap-4">
          <button
            onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
            className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${sectorColorClasses(offre.sector)} hover:opacity-80 transition-opacity`}
            aria-label="Voir l'offre"
          >
            {sectorIcon(offre.sector)}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <button
                  onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
                  className="font-bold text-[#1E2A3A] text-base group-hover:text-[#E8622A] transition-colors leading-tight text-left hover:underline line-clamp-1 w-full"
                >
                  {offre.title}
                </button>
                <p className="text-[#E8622A] text-sm font-medium mt-0.5 truncate">{offre.companyName}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={11} /> {timeAgoPublic(offre.publishedAt)}
                </span>
                <button onClick={(e) => { e.stopPropagation(); onFavorite(offre.id); }} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" aria-label="Sauvegarder">
                  <Heart size={15} className={isFav ? 'text-red-500 fill-red-500' : 'text-gray-300 hover:text-red-400'} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${ctColor}`}>{offre.contractType}</span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={11} /> {offre.location}
              </span>
              {offre.remote && offre.remote !== 'none' && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {offre.remote === 'full' ? 'Télétravail' : 'Hybride'}
                </span>
              )}
              {offre.salaryMin && (
                <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                  <Banknote size={10} className="text-green-500" />
                  {Math.round(offre.salaryMin / 1000)}–{Math.round((offre.salaryMax ?? offre.salaryMin) / 1000)}k€
                </span>
              )}
              {offre.isPremium && (
                <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                  <Star size={9} fill="currentColor" /> Premium
                </span>
              )}
              {isNew && (
                <span className="text-[10px] font-bold text-[#E8622A] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">Nouveau</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-4 flex items-center justify-between gap-3 border-t border-gray-50 pt-3">
        <button onClick={() => router.push(`/emploi/jobs/${offre.id}`)} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#E8622A] transition-colors">
          Voir le détail <ChevronRight size={13} />
        </button>
        {/* FIX : ApplyButton partagé (hooks/useJobApply + useAuthUser) au lieu
            d'InlineApplyButton dupliqué — ne montre plus jamais un faux succès. */}
        <ApplyButton jobId={String(offre.id)} variant="pill" />
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({ filters, setFilters, onClose }: {
  filters: Filters; setFilters: React.Dispatch<React.SetStateAction<Filters>>; onClose?: () => void;
}) {
  function toggle(key: keyof Filters, val: string) {
    setFilters((f) => {
      const arr = f[key] as string[];
      return { ...f, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });
  }

  const hasFilters = filters.contractTypes.length > 0 || filters.remote.length > 0
    || filters.sectors.length > 0 || filters.experience.length > 0 || filters.advantages.length > 0;

  return (
    <aside className="w-full bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
        <h2 className="font-bold text-gray-800 text-sm">Filtres</h2>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button onClick={() => setFilters(EMPTY_FILTERS)} className="text-xs font-semibold text-[#E8622A] hover:underline flex items-center gap-1">
              <RotateCcw size={11} /> Réinitialiser
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <FilterSection title="Recherche">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Métier, entreprise..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] transition" />
        </div>
      </FilterSection>

      <FilterSection title="Localisation">
        <div className="relative mb-2">
          <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={filters.location} onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
            placeholder="Ville, région..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] transition" />
        </div>
        <select value={filters.radius} onChange={(e) => setFilters((f) => ({ ...f, radius: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#E8622A] transition appearance-none bg-white">
          {['10', '20', '50', '100'].map((r) => <option key={r} value={r}>Rayon {r} km</option>)}
        </select>
      </FilterSection>

      <FilterSection title="Type de contrat">
        {CONTRACT_OPTIONS.map((c) => (
          <CheckItem key={c} label={c} checked={filters.contractTypes.includes(c)} onChange={() => toggle('contractTypes', c)} />
        ))}
      </FilterSection>

      <FilterSection title="Télétravail">
        {REMOTE_OPTIONS.map(({ value, label }) => (
          <CheckItem key={value} label={label} checked={filters.remote.includes(value)} onChange={() => toggle('remote', value)} />
        ))}
      </FilterSection>

      <FilterSection title="Niveau d'expérience" defaultOpen={false}>
        {EXPERIENCE_OPTIONS.map((e) => (
          <CheckItem key={e} label={e} checked={filters.experience.includes(e)} onChange={() => toggle('experience', e)} />
        ))}
      </FilterSection>

      <FilterSection title="Avantages" defaultOpen={false}>
        {ADVANTAGE_OPTIONS.map((a) => (
          <CheckItem key={a} label={a} checked={filters.advantages.includes(a)} onChange={() => toggle('advantages', a)} />
        ))}
      </FilterSection>
    </aside>
  );
}

// ── Main Content ──────────────────────────────────────────────────────────────

function JobsContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    ...EMPTY_FILTERS,
    search: searchParams.get('search') ?? '',
    location: searchParams.get('location') ?? '',
    contractTypes: searchParams.get('contractType') ? [searchParams.get('contractType')!] : [],
  });

  const [offres, setOffres] = useState<PublicOffre[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [sort, setSort] = useState('Plus récentes');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const LIMIT = 8;
  const debouncedSearch = useDebouncedValue(filters.search);
  const debouncedLocation = useDebouncedValue(filters.location);

  const loadJobs = useCallback(async (reset = false) => {
    const p = reset ? 1 : page;
    if (reset) setLoading(true); else setLoadingMore(true);

    try {
      const res = await fetchPublicJobs({
        search: debouncedSearch || undefined,
        location: debouncedLocation || undefined,
        contractType: filters.contractTypes.length ? filters.contractTypes.join(',') : undefined,
        remote: filters.remote.length ? filters.remote.join(',') : undefined,
        page: p, limit: LIMIT,
      });
      if (reset) {
        setOffres(res.offres.length ? res.offres : MOCK_OFFRES.slice(0, LIMIT));
        setTotal(res.total || MOCK_OFFRES.length);
      } else {
        setOffres((prev) => [...prev, ...res.offres]);
        setTotal(res.total);
      }
      setHasMore(p * LIMIT < (res.total || 0));
      if (!reset) setPage(p + 1);
    } catch {
      if (reset) {
        setOffres(MOCK_OFFRES);
        setTotal(MOCK_OFFRES.length);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearch, debouncedLocation, filters.contractTypes, filters.remote, page]);

  useEffect(() => {
    setPage(1);
    loadJobs(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, debouncedLocation, filters.contractTypes, filters.remote]);

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
              <Sidebar filters={filters} setFilters={setFilters} />
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

            {activeFilters > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {[...filters.contractTypes, ...filters.remote.map((r) => REMOTE_OPTIONS.find((o) => o.value === r)?.label ?? r), ...filters.experience, ...filters.advantages].map((f) => (
                  <span key={f} className="flex items-center gap-1 bg-white border border-[#E8622A]/30 text-[#E8622A] text-xs font-medium px-2.5 py-1 rounded-full">
                    {f}
                    <button onClick={() => setFilters((prev) => ({
                      ...prev,
                      contractTypes: prev.contractTypes.filter((x) => x !== f),
                      remote: prev.remote.filter((x) => (REMOTE_OPTIONS.find((o) => o.value === x)?.label ?? x) !== f),
                      experience: prev.experience.filter((x) => x !== f),
                      advantages: prev.advantages.filter((x) => x !== f),
                    }))}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <button onClick={() => setFilters(EMPTY_FILTERS)} className="text-xs text-gray-400 hover:text-gray-600 underline">Effacer tout</button>
              </div>
            )}

            {loading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <JobCardSkeleton key={i} />)}</div>
            ) : offres.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                  <Search size={24} className="text-gray-300" />
                </div>
                <p className="font-semibold text-gray-700">Aucune offre trouvée</p>
                <p className="text-sm text-gray-400 mt-1">Essayez de modifier vos critères</p>
                <button onClick={() => setFilters(EMPTY_FILTERS)} className="mt-4 text-sm text-[#E8622A] font-semibold hover:underline">Réinitialiser les filtres</button>
              </div>
            ) : (
              <div className="space-y-3">
                {offres.map((offre) => <JobCard key={offre.id} offre={offre} onFavorite={toggleFavorite} isFav={favorites.has(offre.id)} />)}

                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <button onClick={() => { setPage((p) => p + 1); loadJobs(false); }} disabled={loadingMore}
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
              <Sidebar filters={filters} setFilters={setFilters} onClose={() => setShowMobileFilters(false)} />
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
