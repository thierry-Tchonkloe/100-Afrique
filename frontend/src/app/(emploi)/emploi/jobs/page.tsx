'use client';
// src/app/(emploi)/emploi/jobs/page.tsx

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search, MapPin, SlidersHorizontal, X, ChevronDown, ChevronUp,
  Heart, Clock, RotateCcw, ArrowUpDown, Hotel, Utensils, Plane,
  Briefcase, Monitor, Calendar, Building2, Wifi, Home, Shield,
  Banknote, Car, Star, ExternalLink,
} from 'lucide-react';
import { fetchPublicJobs, MOCK_OFFRES } from '@/services/emploi-public.service';
import type { PublicOffre } from '@/services/emploi-public.service';

// ── Types ─────────────────────────────────────────────────────────────────────

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
  contractTypes: [], remote: [], sectors: [],
  experience: [], advantages: [],
};

// ── Constants ─────────────────────────────────────────────────────────────────

const CONTRACT_OPTIONS = ['CDI', 'CDD', 'Alternance', 'Stage', 'Freelance', 'CDD Saisonnier'];
const REMOTE_OPTIONS   = ['Total', 'Hybride', 'Ponctuel', 'Aucun'];
const SECTOR_OPTIONS   = [
  'Hôtellerie', 'Restauration', 'Aérien & Transport', 'Croisières',
  'MICE & Événementiel', 'Agence de voyage', 'Tech & Digital', 'Spa & Bien-être',
];
const EXPERIENCE_OPTIONS = ['Débutant', '2-5 ans', '5-10 ans', 'Senior'];
const ADVANTAGE_OPTIONS  = ['Logement fourni', 'Mutuelle', 'Primes', 'Véhicule'];
const SORT_OPTIONS = ['Plus récentes', 'Salaire (croissant)', 'Pertinence'];

const SECTOR_ICON: Record<string, React.ReactNode> = {
  'Hôtellerie':        <Hotel    size={18} />,
  'Restauration':      <Utensils size={18} />,
  'Aérien & Transport':<Plane    size={18} />,
  'Agence de voyage':  <Briefcase size={18} />,
  'Tech & Digital':    <Monitor  size={18} />,
  'MICE & Événementiel':<Calendar size={18} />,
  'hotel':             <Hotel    size={18} />,
  'restaurant':        <Utensils size={18} />,
  'transport':         <Plane    size={18} />,
  'travel':            <Briefcase size={18} />,
  'tech':              <Monitor  size={18} />,
  'events':            <Calendar size={18} />,
};

const SECTOR_COLOR: Record<string, string> = {
  hotel:       'bg-blue-50 text-blue-600',
  restaurant:  'bg-orange-50 text-orange-600',
  transport:   'bg-sky-50 text-sky-600',
  travel:      'bg-amber-50 text-amber-600',
  tech:        'bg-green-50 text-green-600',
  events:      'bg-purple-50 text-purple-600',
  Hôtellerie:  'bg-blue-50 text-blue-600',
  Restauration:'bg-orange-50 text-orange-600',
};

const CONTRACT_COLOR: Record<string, string> = {
  CDI:              'bg-blue-50 text-blue-700',
  CDD:              'bg-purple-50 text-purple-700',
  'CDD Saisonnier': 'bg-orange-50 text-orange-700',
  Alternance:       'bg-indigo-50 text-indigo-700',
  Stage:            'bg-teal-50 text-teal-700',
  Freelance:        'bg-pink-50 text-pink-700',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
  if (h < 1) return 'À l\'instant';
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `Il y a ${d}j`;
}

// Mock rich descriptions for visual richness
const MOCK_DESCRIPTIONS: Record<string, string> = {
  '1': 'Nous recherchons un(e) Réceptionniste de Nuit pour rejoindre notre équipe dynamique. Vous serez en charge de l\'accueil des clients, de la gestion des arrivées tardives et de la sécurité de l\'établissement...',
  '2': 'Nous recherchons un Revenue Manager expérimenté pour optimiser nos performances commerciales et maximiser nos revenus. Vous travaillerez en étroite collaboration avec les équipes commerciales...',
  '3': 'Rejoignez notre brigade culinaire d\'exception dans cet établissement gastronomique renommé. Vous encadrerez une équipe de 8 personnes et contribuerez à l\'élaboration de nos menus...',
  '4': 'Poste d\'Agent d\'Escale au départ de Roissy CDG. Vous assurerez l\'accueil des passagers, l\'enregistrement des bagages et la coordination avec les équipes au sol...',
  '5': 'Nous cherchons un Event Manager passionné pour organiser et coordonner nos événements d\'entreprise. Vous gérerez des projets de A à Z, des congrès aux soirées de gala...',
  '6': 'Conseiller(ère) Voyage Luxe pour notre agence haut de gamme. Vous concevrez des voyages sur-mesure pour une clientèle exigeante, en cultivant une expertise sur les destinations premium...',
};

const MOCK_TAGS: Record<string, string[]> = {
  '1': ['Anglais requis', 'Nuit'],
  '2': ['Anglais requis', 'Mutuelle'],
  '3': ['Logement fourni', 'Primes'],
  '4': ['Horaires décalés', 'Formation'],
  '5': ['Télétravail partiel', 'Primes'],
  '6': ['Langues étrangères', 'Formation'],
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
          <div className="h-3 bg-gray-100 rounded w-full mt-2" />
          <div className="h-3 bg-gray-100 rounded w-4/5" />
        </div>
      </div>
    </div>
  );
}

// ── Accordion section ─────────────────────────────────────────────────────────

function FilterSection({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3 text-sm font-semibold text-gray-700
                   hover:text-[#E8622A] transition-colors"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

// ── Checkbox ──────────────────────────────────────────────────────────────────

function CheckItem({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 py-1 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition
          ${checked ? 'bg-[#E8622A] border-[#E8622A]' : 'border-gray-300 group-hover:border-[#E8622A]'}`}
      >
        {checked && <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
          <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>}
      </div>
      <span className="text-sm text-gray-600 group-hover:text-gray-900">{label}</span>
    </label>
  );
}

function RadioItem({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 py-1 cursor-pointer group" onClick={onChange}>
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition
        ${checked ? 'border-[#E8622A]' : 'border-gray-300 group-hover:border-[#E8622A]'}`}>
        {checked && <div className="w-2 h-2 rounded-full bg-[#E8622A]" />}
      </div>
      <span className="text-sm text-gray-600 group-hover:text-gray-900">{label}</span>
    </label>
  );
}

// ── Job Card ──────────────────────────────────────────────────────────────────

function JobCard({ offre, onFavorite, isFav }: {
  offre: PublicOffre; onFavorite: (id: string) => void; isFav: boolean;
}) {
  const icon      = SECTOR_ICON[offre.sector] ?? <Building2 size={18} />;
  const iconColor = SECTOR_COLOR[offre.sector] ?? 'bg-gray-50 text-gray-600';
  const ctColor   = CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600';
  const desc      = MOCK_DESCRIPTIONS[offre.id] ?? 'Rejoignez une équipe dynamique dans le secteur du tourisme et de l\'hôtellerie. Poste à pourvoir dès que possible...';
  const tags      = MOCK_TAGS[offre.id] ?? [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200
                    hover:shadow-md transition-all duration-200 group overflow-hidden">
      <div className="p-5">
        <div className="flex gap-4">
          {/* Logo / Icon */}
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
            {icon}
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-bold text-[#1E2A3A] text-base group-hover:text-[#E8622A] transition-colors
                               leading-tight truncate">
                  <Link href={`/emploi/jobs/${offre.id}`}>{offre.title}</Link>
                </h3>
                <p className="text-[#E8622A] text-sm font-medium mt-0.5 hover:underline cursor-pointer">
                  {offre.companyName}
                </p>
              </div>

              {/* Time + Favorite */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={11} /> {timeAgo(offre.publishedAt)}
                </span>
                <button
                  onClick={() => onFavorite(offre.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Heart
                    size={15}
                    className={isFav ? 'text-red-500 fill-red-500' : 'text-gray-300 hover:text-red-400'}
                  />
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${ctColor}`}>
                {offre.contractType}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={11} /> {offre.location}
              </span>
              {offre.remote && offre.remote !== 'none' && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <Wifi size={10} /> {offre.remote === 'full' ? 'Télétravail' : 'Hybride'}
                </span>
              )}
              {offre.isPremium && (
                <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50
                                 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                  <Star size={9} fill="currentColor" /> Premium
                </span>
              )}
            </div>

            {/* Description excerpt */}
            <p className="text-xs text-gray-500 mt-2.5 leading-relaxed line-clamp-2">{desc}</p>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {tags.map((t) => (
                  <span key={t} className="text-xs bg-gray-50 text-gray-500 border border-gray-100 px-2 py-0.5 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({ filters, setFilters, total, onClose }: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  total: number;
  onClose?: () => void;
}) {
  function toggle(key: keyof Filters, val: string) {
    setFilters((f) => {
      const arr = f[key] as string[];
      return {
        ...f,
        [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
      };
    });
  }

  const hasFilters =
    filters.contractTypes.length > 0 || filters.remote.length > 0 ||
    filters.sectors.length > 0 || filters.experience.length > 0 ||
    filters.advantages.length > 0;

  return (
    <aside className="w-full bg-white rounded-2xl border border-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
        <h2 className="font-bold text-gray-800 text-sm">Filtres</h2>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="text-xs font-semibold text-[#E8622A] hover:underline flex items-center gap-1"
            >
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

      {/* Recherche */}
      <FilterSection title="Recherche">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Métier, entreprise..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] transition"
          />
        </div>
      </FilterSection>

      {/* Localisation */}
      <FilterSection title="Localisation">
        <div className="relative mb-2">
          <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={filters.location}
            onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
            placeholder="Ville, région..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] transition"
          />
        </div>
        <select
          value={filters.radius}
          onChange={(e) => setFilters((f) => ({ ...f, radius: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600
                     focus:outline-none focus:border-[#E8622A] transition appearance-none bg-white"
        >
          {['10', '20', '50', '100'].map((r) => (
            <option key={r} value={r}>Rayon {r} km</option>
          ))}
        </select>
      </FilterSection>

      {/* Type de contrat */}
      <FilterSection title="Type de contrat">
        {CONTRACT_OPTIONS.map((c) => (
          <CheckItem key={c} label={c}
            checked={filters.contractTypes.includes(c)}
            onChange={() => toggle('contractTypes', c)} />
        ))}
      </FilterSection>

      {/* Télétravail */}
      <FilterSection title="Télétravail">
        {REMOTE_OPTIONS.map((r) => (
          <RadioItem key={r} label={r}
            checked={filters.remote.includes(r)}
            onChange={() => setFilters((f) => ({
              ...f,
              remote: f.remote.includes(r) ? f.remote.filter((x) => x !== r) : [...f.remote, r],
            }))} />
        ))}
      </FilterSection>

      {/* Niveau d'expérience */}
      <FilterSection title="Niveau d'expérience" defaultOpen={false}>
        {EXPERIENCE_OPTIONS.map((e) => (
          <CheckItem key={e} label={e}
            checked={filters.experience.includes(e)}
            onChange={() => toggle('experience', e)} />
        ))}
      </FilterSection>

      {/* Avantages */}
      <FilterSection title="Avantages" defaultOpen={false}>
        {ADVANTAGE_OPTIONS.map((a) => {
          const iconMap: Record<string, React.ReactNode> = {
            'Logement fourni': <Home    size={12} />,
            'Mutuelle':        <Shield  size={12} />,
            'Primes':          <Banknote size={12} />,
            'Véhicule':        <Car     size={12} />,
          };
          return (
            <CheckItem key={a} label={a}
              checked={filters.advantages.includes(a)}
              onChange={() => toggle('advantages', a)} />
          );
        })}
      </FilterSection>
    </aside>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

function JobsContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [filters, setFilters] = useState<Filters>({
    ...EMPTY_FILTERS,
    search:        searchParams.get('search')       ?? '',
    location:      searchParams.get('location')     ?? '',
    contractTypes: searchParams.get('contractType')
      ? [searchParams.get('contractType')!] : [],
  });

  const [offres,       setOffres]       = useState<PublicOffre[]>([]);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(1);
  const [loading,      setLoading]      = useState(true);
  const [loadingMore,  setLoadingMore]  = useState(false);
  const [hasMore,      setHasMore]      = useState(true);
  const [sort,         setSort]         = useState('Plus récentes');
  const [favorites,    setFavorites]    = useState<Set<string>>(new Set());
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const LIMIT = 8;

  const loadJobs = useCallback(async (reset = false) => {
    const p = reset ? 1 : page;
    if (reset) setLoading(true); else setLoadingMore(true);

    try {
      const res = await fetchPublicJobs({
        search:       filters.search   || undefined,
        location:     filters.location || undefined,
        contractType: filters.contractTypes[0] || undefined,
        page:         p,
        limit:        LIMIT,
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
  }, [filters, page]);

  // Initial load & filter changes
  useEffect(() => {
    setPage(1);
    loadJobs(true);
  }, [filters.search, filters.location, filters.contractTypes]);  // eslint-disable-line

  function toggleFavorite(id: string) {
    setFavorites((f) => {
      const next = new Set(f);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function loadMore() {
    setPage((p) => p + 1);
    loadJobs(false);
  }

  // Active filter count
  const activeFilters =
    filters.contractTypes.length + filters.remote.length +
    filters.experience.length + filters.advantages.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6">

          {/* ── SIDEBAR (Desktop) ─────────────────────────────────────── */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <Sidebar filters={filters} setFilters={setFilters} total={total} />
            </div>
          </div>

          {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 border border-gray-200 bg-white
                             rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:border-[#E8622A] transition"
                >
                  <SlidersHorizontal size={15} />
                  Filtrer
                  {activeFilters > 0 && (
                    <span className="w-4 h-4 bg-[#E8622A] text-white text-[10px] font-bold
                                     rounded-full flex items-center justify-center">
                      {activeFilters}
                    </span>
                  )}
                </button>
                <p className="text-sm font-semibold text-gray-700">
                  {loading ? (
                    <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <><span className="text-[#1E2A3A] font-bold">{total}</span> offres d'emploi trouvées</>
                  )}
                </p>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2
                             text-sm text-gray-600 bg-white focus:outline-none focus:border-[#E8622A]
                             transition cursor-pointer"
                >
                  {SORT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <ArrowUpDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilters > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {[...filters.contractTypes, ...filters.remote, ...filters.experience, ...filters.advantages].map((f) => (
                  <span key={f} className="flex items-center gap-1 bg-white border border-[#E8622A]/30
                                           text-[#E8622A] text-xs font-medium px-2.5 py-1 rounded-full">
                    {f}
                    <button
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          contractTypes: prev.contractTypes.filter((x) => x !== f),
                          remote:        prev.remote.filter((x) => x !== f),
                          experience:    prev.experience.filter((x) => x !== f),
                          advantages:    prev.advantages.filter((x) => x !== f),
                        }));
                      }}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setFilters(EMPTY_FILTERS)}
                  className="text-xs text-gray-400 hover:text-gray-600 underline"
                >
                  Effacer tout
                </button>
              </div>
            )}

            {/* Job list */}
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <JobCardSkeleton key={i} />)}
              </div>
            ) : offres.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                  <Search size={24} className="text-gray-300" />
                </div>
                <p className="font-semibold text-gray-700">Aucune offre trouvée</p>
                <p className="text-sm text-gray-400 mt-1">Essayez de modifier vos critères de recherche</p>
                <button
                  onClick={() => setFilters(EMPTY_FILTERS)}
                  className="mt-4 text-sm text-[#E8622A] font-semibold hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {offres.map((offre) => (
                  <JobCard
                    key={offre.id}
                    offre={offre}
                    onFavorite={toggleFavorite}
                    isFav={favorites.has(offre.id)}
                  />
                ))}

                {/* Load more */}
                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#d4561f] text-white
                                 font-semibold px-8 py-3.5 rounded-xl transition disabled:opacity-60 text-sm"
                    >
                      {loadingMore ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Chargement...</>
                      ) : 'Charger plus d\'offres'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ─────────────────────────────────────────── */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-50 overflow-y-auto shadow-2xl">
            <div className="p-4">
              <Sidebar
                filters={filters}
                setFilters={setFilters}
                total={total}
                onClose={() => setShowMobileFilters(false)}
              />
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-4 bg-[#E8622A] text-white font-semibold py-3 rounded-xl text-sm"
              >
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
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E8622A]/30 border-t-[#E8622A] rounded-full animate-spin" />
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
}