'use client';
// src/app/(emploi)/emploi/page.tsx
//
// FIX (localisation + secteur) : CompanyCard n'impose plus 'hotel' comme
// secteur par défaut quand company.sector est vide ou non reconnu — on
// affiche une icône neutre à la place. La ville s'affiche désormais dans
// la carte entreprise (elle ne l'était jamais avant).

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, MapPin, FileText, Clock, ArrowRight, Building2,
  Utensils, Plane, Briefcase, Monitor, Calendar, Hotel,
  ChevronRight, Star, Wifi, AlertCircle, Loader2, LayoutDashboard,
} from 'lucide-react';
import {
  fetchPublicJobs,
  fetchFeaturedCompanies,
  MOCK_OFFRES,
  MOCK_COMPANIES,
} from '@/services/emploi-public.service';
import type { PublicOffre, PublicEtablissement } from '@/services/emploi-public.service';
import { SECTOR_DEFS, normalizeSector, type SectorKey } from '@/lib/sectors';

// ─────────────────────────────────────────────────────────────────────────────
// AUTH HELPERS
// ─────────────────────────────────────────────────────────────────────────────

interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CANDIDAT' | 'RECRUITER';
  avatar?: string;
}

function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('emploi_user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch { return null; }
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('emploi_token');
}

// ─────────────────────────────────────────────────────────────────────────────
// RECRUITER CTA BUTTON
// ─────────────────────────────────────────────────────────────────────────────

function RecruiterCtaButton() {
  const router = useRouter();
  const [user,     setUser]     = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(getAuthUser());
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <button disabled
        className="inline-flex items-center gap-2 bg-white/60 text-[#E8622A]/60 font-bold
                   px-8 py-3.5 rounded-xl text-sm cursor-wait">
        <Loader2 size={15} className="animate-spin" /> Chargement...
      </button>
    );
  }

  if (user && getAuthToken() && user.role === 'RECRUITER') {
    return (
      <button
        onClick={() => router.push('/recruteur/vitrine')}
        className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold
                   px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm
                   shadow-lg shadow-black/10"
      >
        <LayoutDashboard size={15} /> Accéder à ma vitrine <ArrowRight size={15} />
      </button>
    );
  }

  if (user && getAuthToken() && user.role === 'CANDIDAT') {
    return (
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => router.push('/auth')}
          className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold
                     px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm
                     shadow-lg shadow-black/10"
        >
          Créer un compte recruteur <ArrowRight size={15} />
        </button>
        <p className="text-white/60 text-xs">
          Connecté en tant que candidat · Un compte recruteur est requis
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push('/auth?redirect=/recruteur/vitrine')}
      className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold
                 px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm
                 shadow-lg shadow-black/10"
    >
      Créer votre vitrine entreprise <ArrowRight size={15} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTEURS — dérivés de la source unique src/lib/sectors.ts
// ─────────────────────────────────────────────────────────────────────────────

const SECTOR_ICONS: Record<SectorKey, React.ReactNode> = {
  hotel:         <Hotel     size={20} />,
  restaurant:    <Utensils  size={20} />,
  transport:     <Plane     size={20} />,
  travel:        <Briefcase size={20} />,
  tech:          <Monitor   size={20} />,
  events:        <Calendar  size={20} />,
  spa:           <Star      size={20} />,
  entertainment: <Building2 size={20} />,
};

const SECTOR_COLORS: Record<SectorKey, string> = {
  hotel:         'bg-blue-50 text-blue-600',
  restaurant:    'bg-orange-50 text-orange-600',
  transport:     'bg-sky-50 text-sky-600',
  travel:        'bg-amber-50 text-amber-600',
  tech:          'bg-green-50 text-green-600',
  events:        'bg-purple-50 text-purple-600',
  spa:           'bg-pink-50 text-pink-600',
  entertainment: 'bg-indigo-50 text-indigo-600',
};

const SECTOR_HOVER_COLORS: Record<SectorKey, string> = {
  hotel:         'text-blue-600   bg-blue-50   hover:bg-blue-100',
  restaurant:    'text-orange-600 bg-orange-50 hover:bg-orange-100',
  transport:     'text-sky-600    bg-sky-50    hover:bg-sky-100',
  travel:        'text-amber-600  bg-amber-50  hover:bg-amber-100',
  tech:          'text-green-600  bg-green-50  hover:bg-green-100',
  events:        'text-purple-600 bg-purple-50 hover:bg-purple-100',
  spa:           'text-pink-600   bg-pink-50   hover:bg-pink-100',
  entertainment: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100',
};

const SECTOR_BG: Record<SectorKey, string> = {
  hotel:         'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  restaurant:    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  transport:     'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
  travel:        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
  tech:          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  events:        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  spa:           'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
  entertainment: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80',
};

const METIER_DESCRIPTIONS: Record<SectorKey, string> = {
  hotel:         'Réception, direction, housekeeping...',
  restaurant:    'Chef, cuisine, salle, bar...',
  transport:     "Pilote, agent d'escale, hôtesse...",
  travel:        'Conseiller voyage, TO, tourisme...',
  tech:          'Revenue, yield, digital, dev...',
  events:        'Congrès, séminaires, incentives...',
  spa:           'Praticien(ne) spa, bien-être...',
  entertainment: 'Animation, régie, loisirs...',
};

const METIERS = SECTOR_DEFS.map((s) => ({
  label:       s.label,
  icon:        SECTOR_ICONS[s.key],
  color:       SECTOR_HOVER_COLORS[s.key],
  sector:      s.key,
  description: METIER_DESCRIPTIONS[s.key],
  bg:          SECTOR_BG[s.key],
}));

const CONTRACT_COLOR: Record<string, string> = {
  CDI:              'bg-blue-50 text-blue-700 border-blue-100',
  CDD:              'bg-purple-50 text-purple-700 border-purple-100',
  'CDD Saisonnier': 'bg-orange-50 text-orange-700 border-orange-100',
  Alternance:       'bg-indigo-50 text-indigo-700 border-indigo-100',
  Stage:            'bg-teal-50 text-teal-700 border-teal-100',
  Freelance:        'bg-pink-50 text-pink-700 border-pink-100',
};

const POPULAR_SEARCHES = ['Réceptionniste', 'Revenue Manager', 'Chef de cuisine', 'Yield Manager'];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1)  return "À l'instant";
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'Il y a 1 jour' : `Il y a ${d} jours`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function CompanyCard({ company }: { company: PublicEtablissement }) {
  // FIX : company.sector est un LIBELLÉ brut (ex: "Hôtellerie") — on normalise
  // avant d'indexer les maps par clé canonique. Plus de fallback forcé sur
  // 'hotel' quand le secteur est vide/non reconnu : on affiche un état neutre.
  const sectorKey = normalizeSector(company.sector); // '' si vide/non reconnu
  const bg        = company.vitrine?.logoUrl
    ? undefined
    : (sectorKey ? SECTOR_BG[sectorKey] : undefined);
  const icon      = sectorKey ? SECTOR_ICONS[sectorKey]  : <Building2 size={20} />;
  const iconColor = sectorKey ? SECTOR_COLORS[sectorKey] : 'bg-gray-100 text-gray-500';

  return (
    <Link
      href={`/emploi/entreprises/${company.id}`}
      className="group relative overflow-hidden rounded-2xl aspect-[4/3] block"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 bg-gray-200"
        style={bg || company.vitrine?.bannerUrl ? { backgroundImage: `url(${company.vitrine?.bannerUrl ?? bg})` } : undefined}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2 ${iconColor} shadow-lg`}>
          {company.logo
            ? <img src={company.logo} alt={company.name} className="w-full h-full object-contain rounded-lg" />
            : icon
          }
        </div>
        <h3 className="text-white font-bold text-base leading-tight">{company.name}</h3>
        {/* FIX : la ville s'affiche maintenant réellement, en plus du nombre d'offres */}
        <p className="text-gray-300 text-xs mt-0.5">
          {company.city && <>{company.city} · </>}
          {company.offresCount} offre{company.offresCount > 1 ? 's' : ''} disponible{company.offresCount > 1 ? 's' : ''}
        </p>
      </div>
    </Link>
  );
}

function MetierCard({ metier }: { metier: typeof METIERS[0] }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/emploi/metiers/${metier.sector}`)}
      className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100
                 hover:border-[#E8622A]/40 hover:shadow-md transition-all duration-200 group cursor-pointer"
      aria-label={`Voir les offres ${metier.label}`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${metier.color}
                       group-hover:scale-110 transition-transform duration-200`}>
        {metier.icon}
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-700 leading-tight">{metier.label}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 leading-tight hidden sm:block">{metier.description}</p>
      </div>
    </button>
  );
}

function JobCard({ offre }: { offre: PublicOffre }) {
  const router    = useRouter();
  const sectorKey = normalizeSector(offre.sector) || 'hotel';
  const icon      = SECTOR_ICONS[sectorKey] ?? <Building2 size={18} />;
  const iconColor = SECTOR_COLORS[sectorKey] ?? 'bg-gray-50 text-gray-600';
  const ctColor   = CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600 border-gray-100';
  const isNew     = Date.now() - new Date(offre.publishedAt).getTime() < 24 * 3_600_000;

  return (
    <button
      onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
      className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100
                 hover:border-[#E8622A]/30 hover:shadow-md transition-all duration-200 group text-left"
    >
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${iconColor}`}>
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-[#1E2A3A] text-sm group-hover:text-[#E8622A]
                         transition-colors truncate">
            {offre.title}
          </h3>
          {isNew && (
            <span className="flex-shrink-0 text-[10px] font-bold text-[#E8622A] bg-orange-50
                             px-2 py-0.5 rounded-full border border-orange-100">
              Nouveau
            </span>
          )}
          {offre.isPremium && (
            <span className="flex-shrink-0 flex items-center gap-0.5 text-[10px] font-bold
                             text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              <Star size={8} fill="currentColor" /> Premium
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-0.5 truncate">{offre.companyName}</p>

        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ctColor}`}>
            {offre.contractType}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={10} /> {offre.location}
          </span>
          {offre.remote && offre.remote !== 'none' && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50
                             px-2 py-0.5 rounded-full">
              <Wifi size={9} /> {offre.remote === 'full' ? 'Remote' : 'Hybride'}
            </span>
          )}
          {offre.salaryMin && (
            <span className="text-xs text-gray-400">
              {Math.round(offre.salaryMin / 1000)}–{Math.round((offre.salaryMax ?? offre.salaryMin) / 1000)}k€
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
            <Clock size={10} /> {timeAgo(offre.publishedAt)}
          </span>
        </div>
      </div>

      <ChevronRight
        size={15}
        className="flex-shrink-0 text-gray-300 group-hover:text-[#E8622A]
                   group-hover:translate-x-0.5 transition-all"
      />
    </button>
  );
}

// ── Skeleton loaders ──────────────────────────────────────────────────────────

function CompanySkeleton() {
  return <div className="rounded-2xl aspect-[4/3] bg-gray-100 animate-pulse" />;
}

function JobSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 animate-pulse">
      <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-4 bg-gray-100 rounded-full w-10" />
          <div className="h-4 bg-gray-100 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function EmploiHomePage() {
  const router = useRouter();

  const [search,       setSearch]       = useState('');
  const [location,     setLocation]     = useState('');
  const [contractType, setContractType] = useState('');

  const [offres,      setOffres]      = useState<PublicOffre[]>([]);
  const [companies,   setCompanies]   = useState<PublicEtablissement[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingComp, setLoadingComp] = useState(true);
  const [jobsError,   setJobsError]   = useState(false);
  const [compError,   setCompError]   = useState(false);
  const [totalJobs,   setTotalJobs]   = useState<number | null>(null);

  useEffect(() => {
    setLoadingJobs(true);
    fetchPublicJobs({ limit: 6, page: 1 })
      .then((res) => {
        setOffres(res.offres?.length ? res.offres : MOCK_OFFRES);
        setTotalJobs(res.total ?? null);
        setJobsError(false);
      })
      .catch(() => {
        setOffres(MOCK_OFFRES);
        setJobsError(true);
      })
      .finally(() => setLoadingJobs(false));
  }, []);

  useEffect(() => {
    setLoadingComp(true);
    fetchFeaturedCompanies()
      .then((list) => {
        setCompanies(list?.length ? list : MOCK_COMPANIES);
        setCompError(false);
      })
      .catch(() => {
        setCompanies(MOCK_COMPANIES);
        setCompError(true);
      })
      .finally(() => setLoadingComp(false));
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim())   params.set('search',       search.trim());
    if (location.trim()) params.set('location',     location.trim());
    if (contractType)    params.set('contractType', contractType);
    router.push(`/emploi/jobs?${params.toString()}`);
  }

  function handlePopularSearch(term: string) {
    setSearch(term);
    router.push(`/emploi/jobs?search=${encodeURIComponent(term)}`);
  }

  return (
    <div className="bg-white">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[440px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80)' }}
        />
        <div className="absolute inset-0 bg-[#1E2A3A]/70" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 text-center">
          {totalJobs !== null && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20
                            rounded-full px-4 py-1.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/80 text-xs font-medium">
                {totalJobs.toLocaleString('fr-FR')} offre{totalJobs > 1 ? 's' : ''} disponible{totalJobs > 1 ? 's' : ''}
              </span>
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
            Propulsez votre carrière dans<br className="hidden md:block" /> l&apos;industrie du tourisme
          </h1>
          <p className="text-white/70 text-sm mb-8">
            Des milliers d&apos;offres dans l&apos;hôtellerie, la restauration, l&apos;aérien et plus encore.
          </p>

          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-5 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Quoi ?</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5
                                focus-within:border-[#E8622A] transition-colors">
                  <Building2 size={15} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Métier, poste..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="text-gray-300 hover:text-gray-500 text-lg leading-none"
                      aria-label="Effacer"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Où ?</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5
                                focus-within:border-[#E8622A] transition-colors">
                  <MapPin size={15} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Ville, région..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                  />
                  {location && (
                    <button
                      type="button"
                      onClick={() => setLocation('')}
                      className="text-gray-300 hover:text-gray-500 text-lg leading-none"
                      aria-label="Effacer"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Contrat</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5
                                focus-within:border-[#E8622A] transition-colors">
                  <FileText size={15} className="text-gray-400 flex-shrink-0" />
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                    className="flex-1 text-sm text-gray-700 outline-none bg-transparent appearance-none cursor-pointer"
                  >
                    <option value="">Tous les contrats</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="CDD Saisonnier">CDD Saisonnier</option>
                    <option value="Alternance">Alternance</option>
                    <option value="Stage">Stage</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#E8622A]
                         hover:bg-[#d4561f] active:scale-[0.99] text-white font-semibold
                         py-3.5 rounded-xl transition-all text-sm"
            >
              <Search size={15} /> Rechercher des offres
            </button>

            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">Populaires :</span>
              {POPULAR_SEARCHES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handlePopularSearch(q)}
                  className="text-xs text-[#E8622A] hover:underline font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* ── COMPANIES ─────────────────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
              Découvrez les entreprises qui recrutent
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Explorez les marques employeurs du secteur touristique
              {compError && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-500">
                  <AlertCircle size={11} /> données démo
                </span>
              )}
            </p>
          </div>
          <Link
            href="/emploi/entreprises"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#E8622A]
                       hover:underline flex-shrink-0"
          >
            Toutes les entreprises <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loadingComp
            ? Array.from({ length: 6 }).map((_, i) => <CompanySkeleton key={i} />)
            : companies.map((c) => <CompanyCard key={c.id} company={c} />)
          }
        </div>

        <div className="flex justify-center mt-6 sm:hidden">
          <Link
            href="/emploi/entreprises"
            className="flex items-center gap-2 border border-[#E8622A] text-[#E8622A] font-semibold
                       text-sm px-6 py-2.5 rounded-xl hover:bg-[#E8622A] hover:text-white transition-colors"
          >
            Voir toutes les entreprises <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── MÉTIERS ───────────────────────────────────────────────────── */}
      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
              Parcourir par Métiers
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Cliquez sur un secteur pour voir toutes les offres disponibles
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {METIERS.map((m) => <MetierCard key={m.sector} metier={m} />)}
          </div>

          <div className="mt-8 grid grid-cols-4 sm:grid-cols-8 gap-3">
            {METIERS.map((m) => {
              const count = offres.filter((o) => normalizeSector(o.sector) === m.sector).length;
              return (
                <button
                  key={m.sector}
                  onClick={() => router.push(`/emploi/metiers/${m.sector}`)}
                  className="text-center py-2 px-3 rounded-xl bg-white border border-gray-100
                             hover:border-[#E8622A]/30 transition-colors cursor-pointer group"
                >
                  <p className="text-lg font-extrabold text-[#1E2A3A] group-hover:text-[#E8622A] transition-colors">
                    {loadingJobs ? '—' : `${count}+`}
                  </p>
                  <p className="text-[10px] text-gray-400 leading-tight">{m.label}</p>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center mt-8">
            <Link
              href="/emploi/jobs"
              className="flex items-center gap-2 bg-[#1E2A3A] hover:bg-[#2d3f55] text-white
                         font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Voir toutes les offres <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── LATEST JOBS ───────────────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
              Les dernières opportunités à saisir
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Postes fraîchement publiés par nos partenaires
              {jobsError && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-500">
                  <AlertCircle size={11} /> données démo
                </span>
              )}
            </p>
          </div>
          <Link
            href="/emploi/jobs"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#E8622A]
                       hover:underline flex-shrink-0"
          >
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>

        <div className="space-y-3">
          {loadingJobs
            ? Array.from({ length: 5 }).map((_, i) => <JobSkeleton key={i} />)
            : offres.map((offre) => <JobCard key={offre.id} offre={offre} />)
          }
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            href="/emploi/jobs"
            className="inline-flex items-center gap-2 bg-[#1E2A3A] hover:bg-[#2d3f55] text-white
                       font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
          >
            Voir toutes les offres{totalJobs ? ` (${totalJobs.toLocaleString('fr-FR')})` : ''} <ArrowRight size={15} />
          </Link>
          <div className="flex flex-wrap justify-center gap-2">
            {METIERS.slice(0, 3).map((m) => (
              <Link
                key={m.sector}
                href={`/emploi/jobs?sector=${m.sector}`}
                className="text-xs text-gray-500 hover:text-[#E8622A] border border-gray-200
                           hover:border-[#E8622A]/40 px-3 py-1.5 rounded-full transition-colors"
              >
                {m.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECRUITER CTA ─────────────────────────────────────────────── */}
      <section
        className="py-20 px-6"
        style={{ background: 'linear-gradient(135deg, #1E2A3A 0%, #E8622A 100%)' }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 size={28} className="text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Vous êtes un recruteur ?
          </h2>
          <p className="text-white/75 text-sm leading-relaxed mb-8 max-w-md mx-auto">
            Valorisez votre marque employeur et trouvez les meilleurs talents du tourisme
            grâce à notre plateforme dédiée.
          </p>
          <RecruiterCtaButton />
        </div>
      </section>
    </div>
  );
}













// 'use client';
// // src/app/(emploi)/emploi/page.tsx
// //
// // FIX (système de secteur) : METIERS, SECTOR_ICONS, SECTOR_COLORS et SECTOR_BG
// // dérivent maintenant de SECTOR_DEFS (src/lib/sectors.ts) au lieu de listes
// // locales divergentes. Les lookups sur company.sector / offre.sector (qui sont
// // des LIBELLÉS bruts venant de la DB, ex: "Hôtellerie") passent systématiquement
// // par normalizeSector() avant d'indexer les maps par clé canonique.

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import {
//   Search, MapPin, FileText, Clock, ArrowRight, Building2,
//   Utensils, Plane, Briefcase, Monitor, Calendar, Hotel,
//   ChevronRight, Star, Wifi, AlertCircle, Loader2, LayoutDashboard,
// } from 'lucide-react';
// import {
//   fetchPublicJobs,
//   fetchFeaturedCompanies,
//   MOCK_OFFRES,
//   MOCK_COMPANIES,
// } from '@/services/emploi-public.service';
// import type { PublicOffre, PublicEtablissement } from '@/services/emploi-public.service';
// import { SECTOR_DEFS, normalizeSector, type SectorKey } from '@/lib/sectors';

// // ─────────────────────────────────────────────────────────────────────────────
// // AUTH HELPERS
// // ─────────────────────────────────────────────────────────────────────────────

// interface AuthUser {
//   id: number;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: 'CANDIDAT' | 'RECRUITER';
//   avatar?: string;
// }

// function getAuthUser(): AuthUser | null {
//   if (typeof window === 'undefined') return null;
//   try {
//     const raw = localStorage.getItem('emploi_user');
//     return raw ? (JSON.parse(raw) as AuthUser) : null;
//   } catch { return null; }
// }

// function getAuthToken(): string | null {
//   if (typeof window === 'undefined') return null;
//   return localStorage.getItem('emploi_token');
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // RECRUITER CTA BUTTON
// // ─────────────────────────────────────────────────────────────────────────────

// function RecruiterCtaButton() {
//   const router = useRouter();
//   const [user,     setUser]     = useState<AuthUser | null>(null);
//   const [hydrated, setHydrated] = useState(false);

//   useEffect(() => {
//     setUser(getAuthUser());
//     setHydrated(true);
//   }, []);

//   if (!hydrated) {
//     return (
//       <button disabled
//         className="inline-flex items-center gap-2 bg-white/60 text-[#E8622A]/60 font-bold
//                    px-8 py-3.5 rounded-xl text-sm cursor-wait">
//         <Loader2 size={15} className="animate-spin" /> Chargement...
//       </button>
//     );
//   }

//   if (user && getAuthToken() && user.role === 'RECRUITER') {
//     return (
//       <button
//         onClick={() => router.push('/recruteur/vitrine')}
//         className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold
//                    px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm
//                    shadow-lg shadow-black/10"
//       >
//         <LayoutDashboard size={15} /> Accéder à ma vitrine <ArrowRight size={15} />
//       </button>
//     );
//   }

//   if (user && getAuthToken() && user.role === 'CANDIDAT') {
//     return (
//       <div className="flex flex-col items-center gap-3">
//         <button
//           onClick={() => router.push('/auth')}
//           className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold
//                      px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm
//                      shadow-lg shadow-black/10"
//         >
//           Créer un compte recruteur <ArrowRight size={15} />
//         </button>
//         <p className="text-white/60 text-xs">
//           Connecté en tant que candidat · Un compte recruteur est requis
//         </p>
//       </div>
//     );
//   }

//   return (
//     <button
//       onClick={() => router.push('/auth?redirect=/recruteur/vitrine')}
//       className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold
//                  px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm
//                  shadow-lg shadow-black/10"
//     >
//       Créer votre vitrine entreprise <ArrowRight size={15} />
//     </button>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SECTEURS — dérivés de la source unique src/lib/sectors.ts
// // ─────────────────────────────────────────────────────────────────────────────

// const SECTOR_ICONS: Record<SectorKey, React.ReactNode> = {
//   hotel:         <Hotel     size={20} />,
//   restaurant:    <Utensils  size={20} />,
//   transport:     <Plane     size={20} />,
//   travel:        <Briefcase size={20} />,
//   tech:          <Monitor   size={20} />,
//   events:        <Calendar  size={20} />,
//   spa:           <Star      size={20} />,
//   entertainment: <Building2 size={20} />,
// };

// const SECTOR_COLORS: Record<SectorKey, string> = {
//   hotel:         'bg-blue-50 text-blue-600',
//   restaurant:    'bg-orange-50 text-orange-600',
//   transport:     'bg-sky-50 text-sky-600',
//   travel:        'bg-amber-50 text-amber-600',
//   tech:          'bg-green-50 text-green-600',
//   events:        'bg-purple-50 text-purple-600',
//   spa:           'bg-pink-50 text-pink-600',
//   entertainment: 'bg-indigo-50 text-indigo-600',
// };

// const SECTOR_HOVER_COLORS: Record<SectorKey, string> = {
//   hotel:         'text-blue-600   bg-blue-50   hover:bg-blue-100',
//   restaurant:    'text-orange-600 bg-orange-50 hover:bg-orange-100',
//   transport:     'text-sky-600    bg-sky-50    hover:bg-sky-100',
//   travel:        'text-amber-600  bg-amber-50  hover:bg-amber-100',
//   tech:          'text-green-600  bg-green-50  hover:bg-green-100',
//   events:        'text-purple-600 bg-purple-50 hover:bg-purple-100',
//   spa:           'text-pink-600   bg-pink-50   hover:bg-pink-100',
//   entertainment: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100',
// };

// const SECTOR_BG: Record<SectorKey, string> = {
//   hotel:         'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
//   restaurant:    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
//   transport:     'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
//   travel:        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
//   tech:          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
//   events:        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
//   spa:           'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
//   entertainment: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80',
// };

// const METIER_DESCRIPTIONS: Record<SectorKey, string> = {
//   hotel:         'Réception, direction, housekeeping...',
//   restaurant:    'Chef, cuisine, salle, bar...',
//   transport:     "Pilote, agent d'escale, hôtesse...",
//   travel:        'Conseiller voyage, TO, tourisme...',
//   tech:          'Revenue, yield, digital, dev...',
//   events:        'Congrès, séminaires, incentives...',
//   spa:           'Praticien(ne) spa, bien-être...',
//   entertainment: 'Animation, régie, loisirs...',
// };

// // FIX : METIERS dérive de SECTOR_DEFS — même clé, même libellé FR que
// // partout ailleurs (création d'offre, vitrine, filtres publics).
// const METIERS = SECTOR_DEFS.map((s) => ({
//   label:       s.label,
//   icon:        SECTOR_ICONS[s.key],
//   color:       SECTOR_HOVER_COLORS[s.key],
//   sector:      s.key,
//   description: METIER_DESCRIPTIONS[s.key],
//   bg:          SECTOR_BG[s.key],
// }));

// const CONTRACT_COLOR: Record<string, string> = {
//   CDI:              'bg-blue-50 text-blue-700 border-blue-100',
//   CDD:              'bg-purple-50 text-purple-700 border-purple-100',
//   'CDD Saisonnier': 'bg-orange-50 text-orange-700 border-orange-100',
//   Alternance:       'bg-indigo-50 text-indigo-700 border-indigo-100',
//   Stage:            'bg-teal-50 text-teal-700 border-teal-100',
//   Freelance:        'bg-pink-50 text-pink-700 border-pink-100',
// };

// const POPULAR_SEARCHES = ['Réceptionniste', 'Revenue Manager', 'Chef de cuisine', 'Yield Manager'];

// // ─────────────────────────────────────────────────────────────────────────────
// // HELPERS
// // ─────────────────────────────────────────────────────────────────────────────

// function timeAgo(iso: string): string {
//   const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
//   if (h < 1)  return "À l'instant";
//   if (h < 24) return `Il y a ${h}h`;
//   const d = Math.floor(h / 24);
//   return d === 1 ? 'Il y a 1 jour' : `Il y a ${d} jours`;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SUB-COMPONENTS
// // ─────────────────────────────────────────────────────────────────────────────

// function CompanyCard({ company }: { company: PublicEtablissement }) {
//   // FIX : company.sector est un LIBELLÉ brut (ex: "Hôtellerie") — on normalise
//   // avant d'indexer les maps par clé canonique.
//   const sectorKey = normalizeSector(company.sector) || 'hotel';
//   const bg        = company.vitrine?.logoUrl
//     ? undefined
//     : (SECTOR_BG[sectorKey] ?? SECTOR_BG.hotel);
//   const icon      = SECTOR_ICONS[sectorKey] ?? <Building2 size={20} />;
//   const iconColor = SECTOR_COLORS[sectorKey] ?? 'bg-gray-50 text-gray-600';

//   return (
//     <Link
//       href={`/emploi/entreprises/${company.id}`}
//       className="group relative overflow-hidden rounded-2xl aspect-[4/3] block"
//     >
//       <div
//         className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
//         style={{ backgroundImage: `url(${company.vitrine?.bannerUrl ?? bg})` }}
//       />
//       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

//       <div className="absolute bottom-0 left-0 right-0 p-4">
//         <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2 ${iconColor} shadow-lg`}>
//           {company.logo
//             ? <img src={company.logo} alt={company.name} className="w-full h-full object-contain rounded-lg" />
//             : icon
//           }
//         </div>
//         <h3 className="text-white font-bold text-base leading-tight">{company.name}</h3>
//         <p className="text-gray-300 text-xs mt-0.5">
//           {company.offresCount} offre{company.offresCount > 1 ? 's' : ''} disponible{company.offresCount > 1 ? 's' : ''}
//         </p>
//       </div>
//     </Link>
//   );
// }

// function MetierCard({ metier }: { metier: typeof METIERS[0] }) {
//   const router = useRouter();
//   return (
//     <button
//       onClick={() => router.push(`/emploi/metiers/${metier.sector}`)}
//       className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100
//                  hover:border-[#E8622A]/40 hover:shadow-md transition-all duration-200 group cursor-pointer"
//       aria-label={`Voir les offres ${metier.label}`}
//     >
//       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${metier.color}
//                        group-hover:scale-110 transition-transform duration-200`}>
//         {metier.icon}
//       </div>
//       <div className="text-center">
//         <p className="text-xs font-semibold text-gray-700 leading-tight">{metier.label}</p>
//         <p className="text-[10px] text-gray-400 mt-0.5 leading-tight hidden sm:block">{metier.description}</p>
//       </div>
//     </button>
//   );
// }

// function JobCard({ offre }: { offre: PublicOffre }) {
//   const router    = useRouter();
//   // FIX : offre.sector est un LIBELLÉ brut — normalisation avant lookup
//   const sectorKey = normalizeSector(offre.sector) || 'hotel';
//   const icon      = SECTOR_ICONS[sectorKey] ?? <Building2 size={18} />;
//   const iconColor = SECTOR_COLORS[sectorKey] ?? 'bg-gray-50 text-gray-600';
//   const ctColor   = CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600 border-gray-100';
//   const isNew     = Date.now() - new Date(offre.publishedAt).getTime() < 24 * 3_600_000;

//   return (
//     <button
//       onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
//       className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100
//                  hover:border-[#E8622A]/30 hover:shadow-md transition-all duration-200 group text-left"
//     >
//       <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${iconColor}`}>
//         {icon}
//       </div>

//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h3 className="font-semibold text-[#1E2A3A] text-sm group-hover:text-[#E8622A]
//                          transition-colors truncate">
//             {offre.title}
//           </h3>
//           {isNew && (
//             <span className="flex-shrink-0 text-[10px] font-bold text-[#E8622A] bg-orange-50
//                              px-2 py-0.5 rounded-full border border-orange-100">
//               Nouveau
//             </span>
//           )}
//           {offre.isPremium && (
//             <span className="flex-shrink-0 flex items-center gap-0.5 text-[10px] font-bold
//                              text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
//               <Star size={8} fill="currentColor" /> Premium
//             </span>
//           )}
//         </div>

//         <p className="text-xs text-gray-500 mt-0.5 truncate">{offre.companyName}</p>

//         <div className="flex flex-wrap items-center gap-2 mt-1.5">
//           <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ctColor}`}>
//             {offre.contractType}
//           </span>
//           <span className="flex items-center gap-1 text-xs text-gray-400">
//             <MapPin size={10} /> {offre.location}
//           </span>
//           {offre.remote && offre.remote !== 'none' && (
//             <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50
//                              px-2 py-0.5 rounded-full">
//               <Wifi size={9} /> {offre.remote === 'full' ? 'Remote' : 'Hybride'}
//             </span>
//           )}
//           {offre.salaryMin && (
//             <span className="text-xs text-gray-400">
//               {Math.round(offre.salaryMin / 1000)}–{Math.round((offre.salaryMax ?? offre.salaryMin) / 1000)}k€
//             </span>
//           )}
//           <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
//             <Clock size={10} /> {timeAgo(offre.publishedAt)}
//           </span>
//         </div>
//       </div>

//       <ChevronRight
//         size={15}
//         className="flex-shrink-0 text-gray-300 group-hover:text-[#E8622A]
//                    group-hover:translate-x-0.5 transition-all"
//       />
//     </button>
//   );
// }

// // ── Skeleton loaders ──────────────────────────────────────────────────────────

// function CompanySkeleton() {
//   return <div className="rounded-2xl aspect-[4/3] bg-gray-100 animate-pulse" />;
// }

// function JobSkeleton() {
//   return (
//     <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 animate-pulse">
//       <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0" />
//       <div className="flex-1 space-y-2">
//         <div className="h-4 bg-gray-100 rounded w-2/3" />
//         <div className="h-3 bg-gray-100 rounded w-1/2" />
//         <div className="flex gap-2">
//           <div className="h-4 bg-gray-100 rounded-full w-10" />
//           <div className="h-4 bg-gray-100 rounded w-16" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN PAGE
// // ─────────────────────────────────────────────────────────────────────────────

// export default function EmploiHomePage() {
//   const router = useRouter();

//   const [search,       setSearch]       = useState('');
//   const [location,     setLocation]     = useState('');
//   const [contractType, setContractType] = useState('');

//   const [offres,      setOffres]      = useState<PublicOffre[]>([]);
//   const [companies,   setCompanies]   = useState<PublicEtablissement[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [loadingComp, setLoadingComp] = useState(true);
//   const [jobsError,   setJobsError]   = useState(false);
//   const [compError,   setCompError]   = useState(false);
//   const [totalJobs,   setTotalJobs]   = useState<number | null>(null);

//   useEffect(() => {
//     setLoadingJobs(true);
//     fetchPublicJobs({ limit: 6, page: 1 })
//       .then((res) => {
//         setOffres(res.offres?.length ? res.offres : MOCK_OFFRES);
//         setTotalJobs(res.total ?? null);
//         setJobsError(false);
//       })
//       .catch(() => {
//         setOffres(MOCK_OFFRES);
//         setJobsError(true);
//       })
//       .finally(() => setLoadingJobs(false));
//   }, []);

//   useEffect(() => {
//     setLoadingComp(true);
//     fetchFeaturedCompanies()
//       .then((list) => {
//         setCompanies(list?.length ? list : MOCK_COMPANIES);
//         setCompError(false);
//       })
//       .catch(() => {
//         setCompanies(MOCK_COMPANIES);
//         setCompError(true);
//       })
//       .finally(() => setLoadingComp(false));
//   }, []);

//   function handleSearch(e: React.FormEvent) {
//     e.preventDefault();
//     const params = new URLSearchParams();
//     if (search.trim())   params.set('search',       search.trim());
//     if (location.trim()) params.set('location',     location.trim());
//     if (contractType)    params.set('contractType', contractType);
//     router.push(`/emploi/jobs?${params.toString()}`);
//   }

//   function handlePopularSearch(term: string) {
//     setSearch(term);
//     router.push(`/emploi/jobs?search=${encodeURIComponent(term)}`);
//   }

//   return (
//     <div className="bg-white">

//       {/* ── HERO ──────────────────────────────────────────────────────── */}
//       <section className="relative min-h-[440px] flex items-center overflow-hidden">
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80)' }}
//         />
//         <div className="absolute inset-0 bg-[#1E2A3A]/70" />

//         <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 text-center">
//           {totalJobs !== null && (
//             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20
//                             rounded-full px-4 py-1.5 mb-4">
//               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
//               <span className="text-white/80 text-xs font-medium">
//                 {totalJobs.toLocaleString('fr-FR')} offre{totalJobs > 1 ? 's' : ''} disponible{totalJobs > 1 ? 's' : ''}
//               </span>
//             </div>
//           )}

//           <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
//             Propulsez votre carrière dans<br className="hidden md:block" /> l&apos;industrie du tourisme
//           </h1>
//           <p className="text-white/70 text-sm mb-8">
//             Des milliers d&apos;offres dans l&apos;hôtellerie, la restauration, l&apos;aérien et plus encore.
//           </p>

//           <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-5 text-left">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

//               <div>
//                 <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Quoi ?</label>
//                 <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5
//                                 focus-within:border-[#E8622A] transition-colors">
//                   <Building2 size={15} className="text-gray-400 flex-shrink-0" />
//                   <input
//                     type="text"
//                     placeholder="Métier, poste..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
//                   />
//                   {search && (
//                     <button
//                       type="button"
//                       onClick={() => setSearch('')}
//                       className="text-gray-300 hover:text-gray-500 text-lg leading-none"
//                       aria-label="Effacer"
//                     >
//                       ×
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Où ?</label>
//                 <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5
//                                 focus-within:border-[#E8622A] transition-colors">
//                   <MapPin size={15} className="text-gray-400 flex-shrink-0" />
//                   <input
//                     type="text"
//                     placeholder="Ville, région..."
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
//                   />
//                   {location && (
//                     <button
//                       type="button"
//                       onClick={() => setLocation('')}
//                       className="text-gray-300 hover:text-gray-500 text-lg leading-none"
//                       aria-label="Effacer"
//                     >
//                       ×
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Contrat</label>
//                 <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5
//                                 focus-within:border-[#E8622A] transition-colors">
//                   <FileText size={15} className="text-gray-400 flex-shrink-0" />
//                   <select
//                     value={contractType}
//                     onChange={(e) => setContractType(e.target.value)}
//                     className="flex-1 text-sm text-gray-700 outline-none bg-transparent appearance-none cursor-pointer"
//                   >
//                     <option value="">Tous les contrats</option>
//                     <option value="CDI">CDI</option>
//                     <option value="CDD">CDD</option>
//                     <option value="CDD Saisonnier">CDD Saisonnier</option>
//                     <option value="Alternance">Alternance</option>
//                     <option value="Stage">Stage</option>
//                     <option value="Freelance">Freelance</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="mt-4 w-full flex items-center justify-center gap-2 bg-[#E8622A]
//                          hover:bg-[#d4561f] active:scale-[0.99] text-white font-semibold
//                          py-3.5 rounded-xl transition-all text-sm"
//             >
//               <Search size={15} /> Rechercher des offres
//             </button>

//             <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
//               <span className="text-xs text-gray-400">Populaires :</span>
//               {POPULAR_SEARCHES.map((q) => (
//                 <button
//                   key={q}
//                   type="button"
//                   onClick={() => handlePopularSearch(q)}
//                   className="text-xs text-[#E8622A] hover:underline font-medium"
//                 >
//                   {q}
//                 </button>
//               ))}
//             </div>
//           </form>
//         </div>
//       </section>

//       {/* ── COMPANIES ─────────────────────────────────────────────────── */}
//       <section className="py-16 px-6 max-w-7xl mx-auto">
//         <div className="flex items-end justify-between mb-8">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
//               Découvrez les entreprises qui recrutent
//             </h2>
//             <p className="text-gray-500 mt-1 text-sm">
//               Explorez les marques employeurs du secteur touristique
//               {compError && (
//                 <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-500">
//                   <AlertCircle size={11} /> données démo
//                 </span>
//               )}
//             </p>
//           </div>
//           <Link
//             href="/emploi/entreprises"
//             className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#E8622A]
//                        hover:underline flex-shrink-0"
//           >
//             Toutes les entreprises <ArrowRight size={14} />
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {loadingComp
//             ? Array.from({ length: 6 }).map((_, i) => <CompanySkeleton key={i} />)
//             : companies.map((c) => <CompanyCard key={c.id} company={c} />)
//           }
//         </div>

//         <div className="flex justify-center mt-6 sm:hidden">
//           <Link
//             href="/emploi/entreprises"
//             className="flex items-center gap-2 border border-[#E8622A] text-[#E8622A] font-semibold
//                        text-sm px-6 py-2.5 rounded-xl hover:bg-[#E8622A] hover:text-white transition-colors"
//           >
//             Voir toutes les entreprises <ArrowRight size={14} />
//           </Link>
//         </div>
//       </section>

//       {/* ── MÉTIERS ───────────────────────────────────────────────────── */}
//       <section className="py-14 px-6 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-8">
//             <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
//               Parcourir par Métiers
//             </h2>
//             <p className="text-gray-500 mt-1 text-sm">
//               Cliquez sur un secteur pour voir toutes les offres disponibles
//             </p>
//           </div>

//           {/* FIX : 8 secteurs désormais — grille adaptée */}
//           <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
//             {METIERS.map((m) => <MetierCard key={m.sector} metier={m} />)}
//           </div>

//           {/* Stats par secteur — comparaison via normalizeSector() car
//               offre.sector est un libellé brut, pas la clé m.sector */}
//           <div className="mt-8 grid grid-cols-4 sm:grid-cols-8 gap-3">
//             {METIERS.map((m) => {
//               const count = offres.filter((o) => normalizeSector(o.sector) === m.sector).length;
//               return (
//                 <button
//                   key={m.sector}
//                   onClick={() => router.push(`/emploi/metiers/${m.sector}`)}
//                   className="text-center py-2 px-3 rounded-xl bg-white border border-gray-100
//                              hover:border-[#E8622A]/30 transition-colors cursor-pointer group"
//                 >
//                   <p className="text-lg font-extrabold text-[#1E2A3A] group-hover:text-[#E8622A] transition-colors">
//                     {loadingJobs ? '—' : `${count}+`}
//                   </p>
//                   <p className="text-[10px] text-gray-400 leading-tight">{m.label}</p>
//                 </button>
//               );
//             })}
//           </div>

//           <div className="flex justify-center mt-8">
//             <Link
//               href="/emploi/jobs"
//               className="flex items-center gap-2 bg-[#1E2A3A] hover:bg-[#2d3f55] text-white
//                          font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
//             >
//               Voir toutes les offres <ArrowRight size={14} />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ── LATEST JOBS ───────────────────────────────────────────────── */}
//       <section className="py-16 px-6 max-w-4xl mx-auto">
//         <div className="flex items-end justify-between mb-8">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
//               Les dernières opportunités à saisir
//             </h2>
//             <p className="text-gray-500 mt-1 text-sm">
//               Postes fraîchement publiés par nos partenaires
//               {jobsError && (
//                 <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-500">
//                   <AlertCircle size={11} /> données démo
//                 </span>
//               )}
//             </p>
//           </div>
//           <Link
//             href="/emploi/jobs"
//             className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#E8622A]
//                        hover:underline flex-shrink-0"
//           >
//             Voir tout <ArrowRight size={14} />
//           </Link>
//         </div>

//         <div className="space-y-3">
//           {loadingJobs
//             ? Array.from({ length: 5 }).map((_, i) => <JobSkeleton key={i} />)
//             : offres.map((offre) => <JobCard key={offre.id} offre={offre} />)
//           }
//         </div>

//         <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
//           <Link
//             href="/emploi/jobs"
//             className="inline-flex items-center gap-2 bg-[#1E2A3A] hover:bg-[#2d3f55] text-white
//                        font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
//           >
//             Voir toutes les offres{totalJobs ? ` (${totalJobs.toLocaleString('fr-FR')})` : ''} <ArrowRight size={15} />
//           </Link>
//           <div className="flex flex-wrap justify-center gap-2">
//             {METIERS.slice(0, 3).map((m) => (
//               <Link
//                 key={m.sector}
//                 href={`/emploi/jobs?sector=${m.sector}`}
//                 className="text-xs text-gray-500 hover:text-[#E8622A] border border-gray-200
//                            hover:border-[#E8622A]/40 px-3 py-1.5 rounded-full transition-colors"
//               >
//                 {m.label}
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── RECRUITER CTA ─────────────────────────────────────────────── */}
//       <section
//         className="py-20 px-6"
//         style={{ background: 'linear-gradient(135deg, #1E2A3A 0%, #E8622A 100%)' }}
//       >
//         <div className="max-w-2xl mx-auto text-center">
//           <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
//             <Building2 size={28} className="text-white" />
//           </div>
//           <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
//             Vous êtes un recruteur ?
//           </h2>
//           <p className="text-white/75 text-sm leading-relaxed mb-8 max-w-md mx-auto">
//             Valorisez votre marque employeur et trouvez les meilleurs talents du tourisme
//             grâce à notre plateforme dédiée.
//           </p>
//           <RecruiterCtaButton />
//         </div>
//       </section>
//     </div>
//   );
// }















// 'use client';
// // src/app/(emploi)/emploi/page.tsx

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import {
//   Search, MapPin, FileText, Clock, ArrowRight, Building2,
//   Utensils, Plane, Briefcase, Monitor, Calendar, Hotel,
//   ChevronRight, Star, Wifi, AlertCircle, Loader2, LayoutDashboard,
// } from 'lucide-react';
// import {
//   fetchPublicJobs,
//   fetchFeaturedCompanies,
//   MOCK_OFFRES,
//   MOCK_COMPANIES,
// } from '@/services/emploi-public.service';
// import type { PublicOffre, PublicEtablissement } from '@/services/emploi-public.service';

// // ─────────────────────────────────────────────────────────────────────────────
// // AUTH HELPERS (client-side only — même pattern que EmploiHeader & ApplyButton)
// // ─────────────────────────────────────────────────────────────────────────────

// interface AuthUser {
//   id: number;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: 'CANDIDAT' | 'RECRUITER';
//   avatar?: string;
// }

// function getAuthUser(): AuthUser | null {
//   if (typeof window === 'undefined') return null;
//   try {
//     const raw = localStorage.getItem('emploi_user');
//     return raw ? (JSON.parse(raw) as AuthUser) : null;
//   } catch { return null; }
// }

// function getAuthToken(): string | null {
//   if (typeof window === 'undefined') return null;
//   return localStorage.getItem('emploi_token');
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // RECRUITER CTA BUTTON
// // Connecté RECRUITER  → /recruteur/vitrine
// // Connecté CANDIDAT   → /auth (compte recruteur requis)
// // Non connecté        → /auth?redirect=/recruteur/vitrine
// // ─────────────────────────────────────────────────────────────────────────────

// function RecruiterCtaButton() {
//   const router = useRouter();
//   const [user,     setUser]     = useState<AuthUser | null>(null);
//   const [hydrated, setHydrated] = useState(false);

//   useEffect(() => {
//     setUser(getAuthUser());
//     setHydrated(true);
//   }, []);

//   if (!hydrated) {
//     return (
//       <button disabled
//         className="inline-flex items-center gap-2 bg-white/60 text-[#E8622A]/60 font-bold
//                    px-8 py-3.5 rounded-xl text-sm cursor-wait">
//         <Loader2 size={15} className="animate-spin" /> Chargement...
//       </button>
//     );
//   }

//   // Recruteur connecté → accès direct à sa vitrine dashboard
//   if (user && getAuthToken() && user.role === 'RECRUITER') {
//     return (
//       <button
//         onClick={() => router.push('/recruteur/vitrine')}
//         className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold
//                    px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm
//                    shadow-lg shadow-black/10"
//       >
//         <LayoutDashboard size={15} /> Accéder à ma vitrine <ArrowRight size={15} />
//       </button>
//     );
//   }

//   // Candidat connecté → compte recruteur requis
//   if (user && getAuthToken() && user.role === 'CANDIDAT') {
//     return (
//       <div className="flex flex-col items-center gap-3">
//         <button
//           onClick={() => router.push('/auth')}
//           className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold
//                      px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm
//                      shadow-lg shadow-black/10"
//         >
//           Créer un compte recruteur <ArrowRight size={15} />
//         </button>
//         <p className="text-white/60 text-xs">
//           Connecté en tant que candidat · Un compte recruteur est requis
//         </p>
//       </div>
//     );
//   }

//   // Non connecté → auth avec redirect
//   return (
//     <button
//       onClick={() => router.push('/auth?redirect=/recruteur/vitrine')}
//       className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold
//                  px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm
//                  shadow-lg shadow-black/10"
//     >
//       Créer votre vitrine entreprise <ArrowRight size={15} />
//     </button>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // CONSTANTS
// // ─────────────────────────────────────────────────────────────────────────────

// const SECTOR_ICONS: Record<string, React.ReactNode> = {
//   hotel:       <Hotel    size={20} />,
//   restaurant:  <Utensils size={20} />,
//   transport:   <Plane    size={20} />,
//   travel:      <Briefcase size={20} />,
//   tech:        <Monitor  size={20} />,
//   events:      <Calendar size={20} />,
// };

// const SECTOR_COLORS: Record<string, string> = {
//   hotel:       'bg-blue-50 text-blue-600',
//   restaurant:  'bg-orange-50 text-orange-600',
//   transport:   'bg-sky-50 text-sky-600',
//   travel:      'bg-amber-50 text-amber-600',
//   tech:        'bg-green-50 text-green-600',
//   events:      'bg-purple-50 text-purple-600',
// };

// const SECTOR_BG: Record<string, string> = {
//   hotel:      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
//   restaurant: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
//   transport:  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
//   travel:     'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
//   tech:       'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
//   events:     'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
// };

// // Mapping slug API → label affichage, et inverse
// const SECTOR_LABEL: Record<string, string> = {
//   hotel:      'Hôtellerie',
//   restaurant: 'Restauration',
//   transport:  'Aérien & Transport',
//   travel:     'Agences de Voyage',
//   tech:       'Tech & Digital',
//   events:     'MICE & Événementiel',
// };

// const CONTRACT_COLOR: Record<string, string> = {
//   CDI:              'bg-blue-50 text-blue-700 border-blue-100',
//   CDD:              'bg-purple-50 text-purple-700 border-purple-100',
//   'CDD Saisonnier': 'bg-orange-50 text-orange-700 border-orange-100',
//   Alternance:       'bg-indigo-50 text-indigo-700 border-indigo-100',
//   Stage:            'bg-teal-50 text-teal-700 border-teal-100',
//   Freelance:        'bg-pink-50 text-pink-700 border-pink-100',
// };

// const POPULAR_SEARCHES = ['Réceptionniste', 'Revenue Manager', 'Chef de cuisine', 'Yield Manager'];

// const METIERS = [
//   {
//     label:       'Hôtellerie',
//     icon:        <Hotel    size={28} />,
//     color:       'text-blue-600   bg-blue-50   hover:bg-blue-100',
//     sector:      'hotel',
//     description: 'Réception, direction, housekeeping...',
//     bg:          SECTOR_BG.hotel,
//   },
//   {
//     label:       'Restauration',
//     icon:        <Utensils size={28} />,
//     color:       'text-orange-600 bg-orange-50 hover:bg-orange-100',
//     sector:      'restaurant',
//     description: 'Chef, cuisine, salle, bar...',
//     bg:          SECTOR_BG.restaurant,
//   },
//   {
//     label:       'Aérien & Transport',
//     icon:        <Plane    size={28} />,
//     color:       'text-sky-600    bg-sky-50    hover:bg-sky-100',
//     sector:      'transport',
//     description: "Pilote, agent d'escale, hôtesse...",
//     bg:          SECTOR_BG.transport,
//   },
//   {
//     label:       'Agence de Voyage',
//     icon:        <Briefcase size={28} />,
//     color:       'text-amber-600  bg-amber-50  hover:bg-amber-100',
//     sector:      'travel',
//     description: 'Conseiller voyage, TO, tourisme...',
//     bg:          SECTOR_BG.travel,
//   },
//   {
//     label:       'Tech & Digital',
//     icon:        <Monitor  size={28} />,
//     color:       'text-green-600  bg-green-50  hover:bg-green-100',
//     sector:      'tech',
//     description: 'Revenue, yield, digital, dev...',
//     bg:          SECTOR_BG.tech,
//   },
//   {
//     label:       'MICE & Événementiel',
//     icon:        <Calendar size={28} />,
//     color:       'text-purple-600 bg-purple-50 hover:bg-purple-100',
//     sector:      'events',
//     description: 'Congrès, séminaires, incentives...',
//     bg:          SECTOR_BG.events,
//   },
// ];

// // ─────────────────────────────────────────────────────────────────────────────
// // HELPERS
// // ─────────────────────────────────────────────────────────────────────────────

// function timeAgo(iso: string): string {
//   const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
//   if (h < 1)  return "À l'instant";
//   if (h < 24) return `Il y a ${h}h`;
//   const d = Math.floor(h / 24);
//   return d === 1 ? 'Il y a 1 jour' : `Il y a ${d} jours`;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SUB-COMPONENTS
// // ─────────────────────────────────────────────────────────────────────────────

// function CompanyCard({ company }: { company: PublicEtablissement }) {
//   const bg        = company.vitrine?.logoUrl
//     ? undefined
//     : (SECTOR_BG[company.sector] ?? SECTOR_BG.hotel);
//   const icon      = SECTOR_ICONS[company.sector] ?? <Building2 size={20} />;
//   const iconColor = SECTOR_COLORS[company.sector] ?? 'bg-gray-50 text-gray-600';

//   return (
//     <Link
//       href={`/emploi/entreprises/${company.id}`}
//       className="group relative overflow-hidden rounded-2xl aspect-[4/3] block"
//     >
//       {/* Background */}
//       <div
//         className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
//         style={{ backgroundImage: `url(${company.vitrine?.bannerUrl ?? bg})` }}
//       />
//       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

//       <div className="absolute bottom-0 left-0 right-0 p-4">
//         <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2 ${iconColor} shadow-lg`}>
//           {company.logo
//             ? <img src={company.logo} alt={company.name} className="w-full h-full object-contain rounded-lg" />
//             : icon
//           }
//         </div>
//         <h3 className="text-white font-bold text-base leading-tight">{company.name}</h3>
//         <p className="text-gray-300 text-xs mt-0.5">
//           {company.offresCount} offre{company.offresCount > 1 ? 's' : ''} disponible{company.offresCount > 1 ? 's' : ''}
//         </p>
//       </div>
//     </Link>
//   );
// }

// function MetierCard({ metier }: { metier: typeof METIERS[0] }) {
//   const router = useRouter();
//   return (
//     <button
//       onClick={() => router.push(`/emploi/metiers/${metier.sector}`)}
//       className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100
//                  hover:border-[#E8622A]/40 hover:shadow-md transition-all duration-200 group cursor-pointer"
//       aria-label={`Voir les offres ${metier.label}`}
//     >
//       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${metier.color}
//                        group-hover:scale-110 transition-transform duration-200`}>
//         {metier.icon}
//       </div>
//       <div className="text-center">
//         <p className="text-xs font-semibold text-gray-700 leading-tight">{metier.label}</p>
//         <p className="text-[10px] text-gray-400 mt-0.5 leading-tight hidden sm:block">{metier.description}</p>
//       </div>
//     </button>
//   );
// }

// function JobCard({ offre }: { offre: PublicOffre }) {
//   const router    = useRouter();
//   const icon      = SECTOR_ICONS[offre.sector] ?? <Building2 size={18} />;
//   const iconColor = SECTOR_COLORS[offre.sector] ?? 'bg-gray-50 text-gray-600';
//   const ctColor   = CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600 border-gray-100';
//   const isNew     = Date.now() - new Date(offre.publishedAt).getTime() < 24 * 3_600_000;

//   return (
//     <button
//       onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
//       className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100
//                  hover:border-[#E8622A]/30 hover:shadow-md transition-all duration-200 group text-left"
//     >
//       {/* Icon */}
//       <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${iconColor}`}>
//         {icon}
//       </div>

//       {/* Content */}
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h3 className="font-semibold text-[#1E2A3A] text-sm group-hover:text-[#E8622A]
//                          transition-colors truncate">
//             {offre.title}
//           </h3>
//           {isNew && (
//             <span className="flex-shrink-0 text-[10px] font-bold text-[#E8622A] bg-orange-50
//                              px-2 py-0.5 rounded-full border border-orange-100">
//               Nouveau
//             </span>
//           )}
//           {offre.isPremium && (
//             <span className="flex-shrink-0 flex items-center gap-0.5 text-[10px] font-bold
//                              text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
//               <Star size={8} fill="currentColor" /> Premium
//             </span>
//           )}
//         </div>

//         <p className="text-xs text-gray-500 mt-0.5 truncate">{offre.companyName}</p>

//         <div className="flex flex-wrap items-center gap-2 mt-1.5">
//           <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ctColor}`}>
//             {offre.contractType}
//           </span>
//           <span className="flex items-center gap-1 text-xs text-gray-400">
//             <MapPin size={10} /> {offre.location}
//           </span>
//           {offre.remote && offre.remote !== 'none' && (
//             <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50
//                              px-2 py-0.5 rounded-full">
//               <Wifi size={9} /> {offre.remote === 'full' ? 'Remote' : 'Hybride'}
//             </span>
//           )}
//           {offre.salaryMin && (
//             <span className="text-xs text-gray-400">
//               {Math.round(offre.salaryMin / 1000)}–{Math.round((offre.salaryMax ?? offre.salaryMin) / 1000)}k€
//             </span>
//           )}
//           <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
//             <Clock size={10} /> {timeAgo(offre.publishedAt)}
//           </span>
//         </div>
//       </div>

//       <ChevronRight
//         size={15}
//         className="flex-shrink-0 text-gray-300 group-hover:text-[#E8622A]
//                    group-hover:translate-x-0.5 transition-all"
//       />
//     </button>
//   );
// }

// // ── Skeleton loaders ──────────────────────────────────────────────────────────

// function CompanySkeleton() {
//   return <div className="rounded-2xl aspect-[4/3] bg-gray-100 animate-pulse" />;
// }

// function JobSkeleton() {
//   return (
//     <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 animate-pulse">
//       <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0" />
//       <div className="flex-1 space-y-2">
//         <div className="h-4 bg-gray-100 rounded w-2/3" />
//         <div className="h-3 bg-gray-100 rounded w-1/2" />
//         <div className="flex gap-2">
//           <div className="h-4 bg-gray-100 rounded-full w-10" />
//           <div className="h-4 bg-gray-100 rounded w-16" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN PAGE
// // ─────────────────────────────────────────────────────────────────────────────

// export default function EmploiHomePage() {
//   const router = useRouter();

//   // ── Search form state ─────────────────────────────────────────────────────
//   const [search,       setSearch]       = useState('');
//   const [location,     setLocation]     = useState('');
//   const [contractType, setContractType] = useState('');

//   // ── Data state ────────────────────────────────────────────────────────────
//   const [offres,      setOffres]      = useState<PublicOffre[]>([]);
//   const [companies,   setCompanies]   = useState<PublicEtablissement[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [loadingComp, setLoadingComp] = useState(true);
//   const [jobsError,   setJobsError]   = useState(false);
//   const [compError,   setCompError]   = useState(false);
//   const [totalJobs,   setTotalJobs]   = useState<number | null>(null);

//   // ── Load dernières offres ─────────────────────────────────────────────────
//   useEffect(() => {
//     setLoadingJobs(true);
//     fetchPublicJobs({ limit: 6, page: 1 })
//       .then((res) => {
//         setOffres(res.offres?.length ? res.offres : MOCK_OFFRES);
//         setTotalJobs(res.total ?? null);
//         setJobsError(false);
//       })
//       .catch(() => {
//         setOffres(MOCK_OFFRES);
//         setJobsError(true);
//       })
//       .finally(() => setLoadingJobs(false));
//   }, []);

//   // ── Load entreprises en vedette ───────────────────────────────────────────
//   useEffect(() => {
//     setLoadingComp(true);
//     fetchFeaturedCompanies()
//       .then((list) => {
//         setCompanies(list?.length ? list : MOCK_COMPANIES);
//         setCompError(false);
//       })
//       .catch(() => {
//         setCompanies(MOCK_COMPANIES);
//         setCompError(true);
//       })
//       .finally(() => setLoadingComp(false));
//   }, []);

//   // ── Handlers ──────────────────────────────────────────────────────────────

//   function handleSearch(e: React.FormEvent) {
//     e.preventDefault();
//     const params = new URLSearchParams();
//     if (search.trim())   params.set('search',       search.trim());
//     if (location.trim()) params.set('location',     location.trim());
//     if (contractType)    params.set('contractType', contractType);
//     router.push(`/emploi/jobs?${params.toString()}`);
//   }

//   function handlePopularSearch(term: string) {
//     setSearch(term);
//     router.push(`/emploi/jobs?search=${encodeURIComponent(term)}`);
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="bg-white">

//       {/* ── HERO ──────────────────────────────────────────────────────── */}
//       <section className="relative min-h-[440px] flex items-center overflow-hidden">
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80)' }}
//         />
//         <div className="absolute inset-0 bg-[#1E2A3A]/70" />

//         <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 text-center">
//           {/* Stats pill */}
//           {totalJobs !== null && (
//             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20
//                             rounded-full px-4 py-1.5 mb-4">
//               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
//               <span className="text-white/80 text-xs font-medium">
//                 {totalJobs.toLocaleString('fr-FR')} offre{totalJobs > 1 ? 's' : ''} disponible{totalJobs > 1 ? 's' : ''}
//               </span>
//             </div>
//           )}

//           <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
//             Propulsez votre carrière dans<br className="hidden md:block" /> l&apos;industrie du tourisme
//           </h1>
//           <p className="text-white/70 text-sm mb-8">
//             Des milliers d&apos;offres dans l&apos;hôtellerie, la restauration, l&apos;aérien et plus encore.
//           </p>

//           {/* Search card */}
//           <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-5 text-left">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

//               {/* Quoi */}
//               <div>
//                 <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Quoi ?</label>
//                 <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5
//                                 focus-within:border-[#E8622A] transition-colors">
//                   <Building2 size={15} className="text-gray-400 flex-shrink-0" />
//                   <input
//                     type="text"
//                     placeholder="Métier, poste..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
//                   />
//                   {search && (
//                     <button
//                       type="button"
//                       onClick={() => setSearch('')}
//                       className="text-gray-300 hover:text-gray-500 text-lg leading-none"
//                       aria-label="Effacer"
//                     >
//                       ×
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Où */}
//               <div>
//                 <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Où ?</label>
//                 <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5
//                                 focus-within:border-[#E8622A] transition-colors">
//                   <MapPin size={15} className="text-gray-400 flex-shrink-0" />
//                   <input
//                     type="text"
//                     placeholder="Ville, région..."
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
//                   />
//                   {location && (
//                     <button
//                       type="button"
//                       onClick={() => setLocation('')}
//                       className="text-gray-300 hover:text-gray-500 text-lg leading-none"
//                       aria-label="Effacer"
//                     >
//                       ×
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Contrat */}
//               <div>
//                 <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Contrat</label>
//                 <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5
//                                 focus-within:border-[#E8622A] transition-colors">
//                   <FileText size={15} className="text-gray-400 flex-shrink-0" />
//                   <select
//                     value={contractType}
//                     onChange={(e) => setContractType(e.target.value)}
//                     className="flex-1 text-sm text-gray-700 outline-none bg-transparent appearance-none cursor-pointer"
//                   >
//                     <option value="">Tous les contrats</option>
//                     <option value="CDI">CDI</option>
//                     <option value="CDD">CDD</option>
//                     <option value="CDD Saisonnier">CDD Saisonnier</option>
//                     <option value="Alternance">Alternance</option>
//                     <option value="Stage">Stage</option>
//                     <option value="Freelance">Freelance</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="mt-4 w-full flex items-center justify-center gap-2 bg-[#E8622A]
//                          hover:bg-[#d4561f] active:scale-[0.99] text-white font-semibold
//                          py-3.5 rounded-xl transition-all text-sm"
//             >
//               <Search size={15} /> Rechercher des offres
//             </button>

//             {/* Quick searches */}
//             <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
//               <span className="text-xs text-gray-400">Populaires :</span>
//               {POPULAR_SEARCHES.map((q) => (
//                 <button
//                   key={q}
//                   type="button"
//                   onClick={() => handlePopularSearch(q)}
//                   className="text-xs text-[#E8622A] hover:underline font-medium"
//                 >
//                   {q}
//                 </button>
//               ))}
//             </div>
//           </form>
//         </div>
//       </section>

//       {/* ── COMPANIES ─────────────────────────────────────────────────── */}
//       <section className="py-16 px-6 max-w-7xl mx-auto">
//         <div className="flex items-end justify-between mb-8">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
//               Découvrez les entreprises qui recrutent
//             </h2>
//             <p className="text-gray-500 mt-1 text-sm">
//               Explorez les marques employeurs du secteur touristique
//               {compError && (
//                 <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-500">
//                   <AlertCircle size={11} /> données démo
//                 </span>
//               )}
//             </p>
//           </div>
//           <Link
//             href="/emploi/entreprises"
//             className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#E8622A]
//                        hover:underline flex-shrink-0"
//           >
//             Toutes les entreprises <ArrowRight size={14} />
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {loadingComp
//             ? Array.from({ length: 6 }).map((_, i) => <CompanySkeleton key={i} />)
//             : companies.map((c) => <CompanyCard key={c.id} company={c} />)
//           }
//         </div>

//         <div className="flex justify-center mt-6 sm:hidden">
//           <Link
//             href="/emploi/entreprises"
//             className="flex items-center gap-2 border border-[#E8622A] text-[#E8622A] font-semibold
//                        text-sm px-6 py-2.5 rounded-xl hover:bg-[#E8622A] hover:text-white transition-colors"
//           >
//             Voir toutes les entreprises <ArrowRight size={14} />
//           </Link>
//         </div>
//       </section>

//       {/* ── MÉTIERS ───────────────────────────────────────────────────── */}
//       <section className="py-14 px-6 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-8">
//             <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
//               Parcourir par Métiers
//             </h2>
//             <p className="text-gray-500 mt-1 text-sm">
//               Cliquez sur un secteur pour voir toutes les offres disponibles
//             </p>
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
//             {METIERS.map((m) => <MetierCard key={m.sector} metier={m} />)}
//           </div>

//           {/* Stats par secteur — après les cards */}
//           <div className="mt-8 grid grid-cols-3 sm:grid-cols-6 gap-3">
//             {METIERS.map((m) => {
//               const count = offres.filter((o) => o.sector === m.sector).length;
//               return (
//                 <button
//                   key={m.sector}
//                   onClick={() => router.push(`/emploi/metiers/${m.sector}`)}
//                   className="text-center py-2 px-3 rounded-xl bg-white border border-gray-100
//                              hover:border-[#E8622A]/30 transition-colors cursor-pointer group"
//                 >
//                   <p className="text-lg font-extrabold text-[#1E2A3A] group-hover:text-[#E8622A] transition-colors">
//                     {loadingJobs ? '—' : `${count}+`}
//                   </p>
//                   <p className="text-[10px] text-gray-400 leading-tight">{m.label}</p>
//                 </button>
//               );
//             })}
//           </div>

//           <div className="flex justify-center mt-8">
//             <Link
//               href="/emploi/jobs"
//               className="flex items-center gap-2 bg-[#1E2A3A] hover:bg-[#2d3f55] text-white
//                          font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
//             >
//               Voir toutes les offres <ArrowRight size={14} />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ── LATEST JOBS ───────────────────────────────────────────────── */}
//       <section className="py-16 px-6 max-w-4xl mx-auto">
//         <div className="flex items-end justify-between mb-8">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
//               Les dernières opportunités à saisir
//             </h2>
//             <p className="text-gray-500 mt-1 text-sm">
//               Postes fraîchement publiés par nos partenaires
//               {jobsError && (
//                 <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-500">
//                   <AlertCircle size={11} /> données démo
//                 </span>
//               )}
//             </p>
//           </div>
//           <Link
//             href="/emploi/jobs"
//             className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#E8622A]
//                        hover:underline flex-shrink-0"
//           >
//             Voir tout <ArrowRight size={14} />
//           </Link>
//         </div>

//         <div className="space-y-3">
//           {loadingJobs
//             ? Array.from({ length: 5 }).map((_, i) => <JobSkeleton key={i} />)
//             : offres.map((offre) => <JobCard key={offre.id} offre={offre} />)
//           }
//         </div>

//         {/* CTA voir tout */}
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
//           <Link
//             href="/emploi/jobs"
//             className="inline-flex items-center gap-2 bg-[#1E2A3A] hover:bg-[#2d3f55] text-white
//                        font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
//           >
//             Voir toutes les offres{totalJobs ? ` (${totalJobs.toLocaleString('fr-FR')})` : ''} <ArrowRight size={15} />
//           </Link>
//           {/* Liens rapides par secteur */}
//           <div className="flex flex-wrap justify-center gap-2">
//             {METIERS.slice(0, 3).map((m) => (
//               <Link
//                 key={m.sector}
//                 href={`/emploi/jobs?sector=${m.sector}`}
//                 className="text-xs text-gray-500 hover:text-[#E8622A] border border-gray-200
//                            hover:border-[#E8622A]/40 px-3 py-1.5 rounded-full transition-colors"
//               >
//                 {m.label}
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── RECRUITER CTA ─────────────────────────────────────────────── */}
//       <section
//         className="py-20 px-6"
//         style={{ background: 'linear-gradient(135deg, #1E2A3A 0%, #E8622A 100%)' }}
//       >
//         <div className="max-w-2xl mx-auto text-center">
//           <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
//             <Building2 size={28} className="text-white" />
//           </div>
//           <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
//             Vous êtes un recruteur ?
//           </h2>
//           <p className="text-white/75 text-sm leading-relaxed mb-8 max-w-md mx-auto">
//             Valorisez votre marque employeur et trouvez les meilleurs talents du tourisme
//             grâce à notre plateforme dédiée.
//           </p>
//           <RecruiterCtaButton />
//         </div>
//       </section>
//     </div>
//   );
// }













// 'use client';
// // src/app/(emploi)/emploi/page.tsx

// import { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import {
//   Search, MapPin, FileText, Clock, ArrowRight, Building2,
//   Utensils, Plane, Briefcase, Monitor, Calendar, Hotel,
//   ChevronRight, Star, Wifi, AlertCircle,
// } from 'lucide-react';
// import {
//   fetchPublicJobs,
//   fetchFeaturedCompanies,
//   MOCK_OFFRES,
//   MOCK_COMPANIES,
// } from '@/services/emploi-public.service';
// import type { PublicOffre, PublicEtablissement } from '@/services/emploi-public.service';

// // ─────────────────────────────────────────────────────────────────────────────
// // CONSTANTS
// // ─────────────────────────────────────────────────────────────────────────────

// const SECTOR_ICONS: Record<string, React.ReactNode> = {
//   hotel:       <Hotel    size={20} />,
//   restaurant:  <Utensils size={20} />,
//   transport:   <Plane    size={20} />,
//   travel:      <Briefcase size={20} />,
//   tech:        <Monitor  size={20} />,
//   events:      <Calendar size={20} />,
// };

// const SECTOR_COLORS: Record<string, string> = {
//   hotel:       'bg-blue-50 text-blue-600',
//   restaurant:  'bg-orange-50 text-orange-600',
//   transport:   'bg-sky-50 text-sky-600',
//   travel:      'bg-amber-50 text-amber-600',
//   tech:        'bg-green-50 text-green-600',
//   events:      'bg-purple-50 text-purple-600',
// };

// const SECTOR_BG: Record<string, string> = {
//   hotel:      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
//   restaurant: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
//   transport:  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
//   travel:     'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
//   tech:       'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
//   events:     'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
// };

// const SECTOR_LABEL: Record<string, string> = {
//   hotel:      'Hôtellerie',
//   restaurant: 'Restauration',
//   transport:  'Aérien & Transport',
//   travel:     'Agences de Voyage',
//   tech:       'Tech & Digital',
//   events:     'MICE & Événementiel',
// };

// const CONTRACT_COLOR: Record<string, string> = {
//   CDI:              'bg-blue-50 text-blue-700 border-blue-100',
//   CDD:              'bg-purple-50 text-purple-700 border-purple-100',
//   'CDD Saisonnier': 'bg-orange-50 text-orange-700 border-orange-100',
//   Alternance:       'bg-indigo-50 text-indigo-700 border-indigo-100',
//   Stage:            'bg-teal-50 text-teal-700 border-teal-100',
//   Freelance:        'bg-pink-50 text-pink-700 border-pink-100',
// };

// const POPULAR_SEARCHES = ['Réceptionniste', 'Revenue Manager', 'Chef de cuisine', 'Yield Manager'];

// const METIERS = [
//   {
//     label:       'Hôtellerie',
//     icon:        <Hotel    size={28} />,
//     color:       'text-blue-600   bg-blue-50   hover:bg-blue-100',
//     sector:      'hotel',
//     description: 'Réception, direction, housekeeping...',
//     bg:          SECTOR_BG.hotel,
//   },
//   {
//     label:       'Restauration',
//     icon:        <Utensils size={28} />,
//     color:       'text-orange-600 bg-orange-50 hover:bg-orange-100',
//     sector:      'restaurant',
//     description: 'Chef, cuisine, salle, bar...',
//     bg:          SECTOR_BG.restaurant,
//   },
//   {
//     label:       'Aérien & Transport',
//     icon:        <Plane    size={28} />,
//     color:       'text-sky-600    bg-sky-50    hover:bg-sky-100',
//     sector:      'transport',
//     description: "Pilote, agent d'escale, hôtesse...",
//     bg:          SECTOR_BG.transport,
//   },
//   {
//     label:       'Agence de Voyage',
//     icon:        <Briefcase size={28} />,
//     color:       'text-amber-600  bg-amber-50  hover:bg-amber-100',
//     sector:      'travel',
//     description: 'Conseiller voyage, TO, tourisme...',
//     bg:          SECTOR_BG.travel,
//   },
//   {
//     label:       'Tech & Digital',
//     icon:        <Monitor  size={28} />,
//     color:       'text-green-600  bg-green-50  hover:bg-green-100',
//     sector:      'tech',
//     description: 'Revenue, yield, digital, dev...',
//     bg:          SECTOR_BG.tech,
//   },
//   {
//     label:       'MICE & Événementiel',
//     icon:        <Calendar size={28} />,
//     color:       'text-purple-600 bg-purple-50 hover:bg-purple-100',
//     sector:      'events',
//     description: 'Congrès, séminaires, incentives...',
//     bg:          SECTOR_BG.events,
//   },
// ];

// // ─────────────────────────────────────────────────────────────────────────────
// // HELPERS
// // ─────────────────────────────────────────────────────────────────────────────

// function timeAgo(iso: string): string {
//   const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
//   if (h < 1)  return "À l'instant";
//   if (h < 24) return `Il y a ${h}h`;
//   const d = Math.floor(h / 24);
//   return d === 1 ? 'Il y a 1 jour' : `Il y a ${d} jours`;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SUB-COMPONENTS
// // ─────────────────────────────────────────────────────────────────────────────

// function CompanyCard({ company }: { company: PublicEtablissement }) {
//   const bg        = company.vitrine?.logoUrl
//     ? undefined
//     : (SECTOR_BG[company.sector] ?? SECTOR_BG.hotel);
//   const icon      = SECTOR_ICONS[company.sector] ?? <Building2 size={20} />;
//   const iconColor = SECTOR_COLORS[company.sector] ?? 'bg-gray-50 text-gray-600';

//   return (
//     <Link
//       href={`/emploi/entreprises/${company.id}`}
//       className="group relative overflow-hidden rounded-2xl aspect-[4/3] block"
//     >
//       {/* Background */}
//       <div
//         className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
//         style={{ backgroundImage: `url(${company.vitrine?.bannerUrl ?? bg})` }}
//       />
//       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

//       <div className="absolute bottom-0 left-0 right-0 p-4">
//         <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2 ${iconColor} shadow-lg`}>
//           {company.logo
//             ? <img src={company.logo} alt={company.name} className="w-full h-full object-contain rounded-lg" />
//             : icon
//           }
//         </div>
//         <h3 className="text-white font-bold text-base leading-tight">{company.name}</h3>
//         <p className="text-gray-300 text-xs mt-0.5">
//           {company.offresCount} offre{company.offresCount > 1 ? 's' : ''} disponible{company.offresCount > 1 ? 's' : ''}
//         </p>
//       </div>
//     </Link>
//   );
// }

// function MetierCard({ metier }: { metier: typeof METIERS[0] }) {
//   const router = useRouter();
//   return (
//     <button
//       onClick={() => router.push(`/emploi/metiers/${metier.sector}`)}
//       className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100
//                  hover:border-[#E8622A]/40 hover:shadow-md transition-all duration-200 group cursor-pointer"
//       aria-label={`Voir les offres ${metier.label}`}
//     >
//       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${metier.color}
//                        group-hover:scale-110 transition-transform duration-200`}>
//         {metier.icon}
//       </div>
//       <div className="text-center">
//         <p className="text-xs font-semibold text-gray-700 leading-tight">{metier.label}</p>
//         <p className="text-[10px] text-gray-400 mt-0.5 leading-tight hidden sm:block">{metier.description}</p>
//       </div>
//     </button>
//   );
// }

// function JobCard({ offre }: { offre: PublicOffre }) {
//   const router    = useRouter();
//   const icon      = SECTOR_ICONS[offre.sector] ?? <Building2 size={18} />;
//   const iconColor = SECTOR_COLORS[offre.sector] ?? 'bg-gray-50 text-gray-600';
//   const ctColor   = CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600 border-gray-100';
//   const isNew     = Date.now() - new Date(offre.publishedAt).getTime() < 24 * 3_600_000;

//   return (
//     <button
//       onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
//       className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100
//                  hover:border-[#E8622A]/30 hover:shadow-md transition-all duration-200 group text-left"
//     >
//       {/* Icon */}
//       <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${iconColor}`}>
//         {icon}
//       </div>

//       {/* Content */}
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h3 className="font-semibold text-[#1E2A3A] text-sm group-hover:text-[#E8622A]
//                          transition-colors truncate">
//             {offre.title}
//           </h3>
//           {isNew && (
//             <span className="flex-shrink-0 text-[10px] font-bold text-[#E8622A] bg-orange-50
//                              px-2 py-0.5 rounded-full border border-orange-100">
//               Nouveau
//             </span>
//           )}
//           {offre.isPremium && (
//             <span className="flex-shrink-0 flex items-center gap-0.5 text-[10px] font-bold
//                              text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
//               <Star size={8} fill="currentColor" /> Premium
//             </span>
//           )}
//         </div>

//         <p className="text-xs text-gray-500 mt-0.5 truncate">{offre.companyName}</p>

//         <div className="flex flex-wrap items-center gap-2 mt-1.5">
//           <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ctColor}`}>
//             {offre.contractType}
//           </span>
//           <span className="flex items-center gap-1 text-xs text-gray-400">
//             <MapPin size={10} /> {offre.location}
//           </span>
//           {offre.remote && offre.remote !== 'none' && (
//             <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50
//                              px-2 py-0.5 rounded-full">
//               <Wifi size={9} /> {offre.remote === 'full' ? 'Remote' : 'Hybride'}
//             </span>
//           )}
//           {offre.salaryMin && (
//             <span className="text-xs text-gray-400">
//               {Math.round(offre.salaryMin / 1000)}–{Math.round((offre.salaryMax ?? offre.salaryMin) / 1000)}k€
//             </span>
//           )}
//           <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
//             <Clock size={10} /> {timeAgo(offre.publishedAt)}
//           </span>
//         </div>
//       </div>

//       <ChevronRight
//         size={15}
//         className="flex-shrink-0 text-gray-300 group-hover:text-[#E8622A]
//                    group-hover:translate-x-0.5 transition-all"
//       />
//     </button>
//   );
// }

// // ── Skeleton loaders ──────────────────────────────────────────────────────────

// function CompanySkeleton() {
//   return <div className="rounded-2xl aspect-[4/3] bg-gray-100 animate-pulse" />;
// }

// function JobSkeleton() {
//   return (
//     <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 animate-pulse">
//       <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0" />
//       <div className="flex-1 space-y-2">
//         <div className="h-4 bg-gray-100 rounded w-2/3" />
//         <div className="h-3 bg-gray-100 rounded w-1/2" />
//         <div className="flex gap-2">
//           <div className="h-4 bg-gray-100 rounded-full w-10" />
//           <div className="h-4 bg-gray-100 rounded w-16" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN PAGE
// // ─────────────────────────────────────────────────────────────────────────────

// export default function EmploiHomePage() {
//   const router = useRouter();

//   // ── Search form state ─────────────────────────────────────────────────────
//   const [search,       setSearch]       = useState('');
//   const [location,     setLocation]     = useState('');
//   const [contractType, setContractType] = useState('');

//   // ── Data state ────────────────────────────────────────────────────────────
//   const [offres,      setOffres]      = useState<PublicOffre[]>([]);
//   const [companies,   setCompanies]   = useState<PublicEtablissement[]>([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [loadingComp, setLoadingComp] = useState(true);
//   const [jobsError,   setJobsError]   = useState(false);
//   const [compError,   setCompError]   = useState(false);
//   const [totalJobs,   setTotalJobs]   = useState<number | null>(null);

//   // ── Load dernières offres ─────────────────────────────────────────────────
//   useEffect(() => {
//     setLoadingJobs(true);
//     fetchPublicJobs({ limit: 6, page: 1 })
//       .then((res) => {
//         setOffres(res.offres?.length ? res.offres : MOCK_OFFRES);
//         setTotalJobs(res.total ?? null);
//         setJobsError(false);
//       })
//       .catch(() => {
//         setOffres(MOCK_OFFRES);
//         setJobsError(true);
//       })
//       .finally(() => setLoadingJobs(false));
//   }, []);

//   // ── Load entreprises en vedette ───────────────────────────────────────────
//   useEffect(() => {
//     setLoadingComp(true);
//     fetchFeaturedCompanies()
//       .then((list) => {
//         setCompanies(list?.length ? list : MOCK_COMPANIES);
//         setCompError(false);
//       })
//       .catch(() => {
//         setCompanies(MOCK_COMPANIES);
//         setCompError(true);
//       })
//       .finally(() => setLoadingComp(false));
//   }, []);

//   // ── Handlers ──────────────────────────────────────────────────────────────

//   function handleSearch(e: React.FormEvent) {
//     e.preventDefault();
//     const params = new URLSearchParams();
//     if (search.trim())   params.set('search',       search.trim());
//     if (location.trim()) params.set('location',     location.trim());
//     if (contractType)    params.set('contractType', contractType);
//     router.push(`/emploi/jobs?${params.toString()}`);
//   }

//   function handlePopularSearch(term: string) {
//     setSearch(term);
//     router.push(`/emploi/jobs?search=${encodeURIComponent(term)}`);
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="bg-white">

//       {/* ── HERO ──────────────────────────────────────────────────────── */}
//       <section className="relative min-h-[440px] flex items-center overflow-hidden">
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80)' }}
//         />
//         <div className="absolute inset-0 bg-[#1E2A3A]/70" />

//         <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 text-center">
//           {/* Stats pill */}
//           {totalJobs !== null && (
//             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20
//                             rounded-full px-4 py-1.5 mb-4">
//               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
//               <span className="text-white/80 text-xs font-medium">
//                 {totalJobs.toLocaleString('fr-FR')} offre{totalJobs > 1 ? 's' : ''} disponible{totalJobs > 1 ? 's' : ''}
//               </span>
//             </div>
//           )}

//           <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
//             Propulsez votre carrière dans<br className="hidden md:block" /> l&apos;industrie du tourisme
//           </h1>
//           <p className="text-white/70 text-sm mb-8">
//             Des milliers d&apos;offres dans l&apos;hôtellerie, la restauration, l&apos;aérien et plus encore.
//           </p>

//           {/* Search card */}
//           <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-5 text-left">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

//               {/* Quoi */}
//               <div>
//                 <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Quoi ?</label>
//                 <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5
//                                 focus-within:border-[#E8622A] transition-colors">
//                   <Building2 size={15} className="text-gray-400 flex-shrink-0" />
//                   <input
//                     type="text"
//                     placeholder="Métier, poste..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
//                   />
//                   {search && (
//                     <button
//                       type="button"
//                       onClick={() => setSearch('')}
//                       className="text-gray-300 hover:text-gray-500 text-lg leading-none"
//                       aria-label="Effacer"
//                     >
//                       ×
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Où */}
//               <div>
//                 <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Où ?</label>
//                 <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5
//                                 focus-within:border-[#E8622A] transition-colors">
//                   <MapPin size={15} className="text-gray-400 flex-shrink-0" />
//                   <input
//                     type="text"
//                     placeholder="Ville, région..."
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
//                   />
//                   {location && (
//                     <button
//                       type="button"
//                       onClick={() => setLocation('')}
//                       className="text-gray-300 hover:text-gray-500 text-lg leading-none"
//                       aria-label="Effacer"
//                     >
//                       ×
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Contrat */}
//               <div>
//                 <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Contrat</label>
//                 <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5
//                                 focus-within:border-[#E8622A] transition-colors">
//                   <FileText size={15} className="text-gray-400 flex-shrink-0" />
//                   <select
//                     value={contractType}
//                     onChange={(e) => setContractType(e.target.value)}
//                     className="flex-1 text-sm text-gray-700 outline-none bg-transparent appearance-none cursor-pointer"
//                   >
//                     <option value="">Tous les contrats</option>
//                     <option value="CDI">CDI</option>
//                     <option value="CDD">CDD</option>
//                     <option value="CDD Saisonnier">CDD Saisonnier</option>
//                     <option value="Alternance">Alternance</option>
//                     <option value="Stage">Stage</option>
//                     <option value="Freelance">Freelance</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="mt-4 w-full flex items-center justify-center gap-2 bg-[#E8622A]
//                          hover:bg-[#d4561f] active:scale-[0.99] text-white font-semibold
//                          py-3.5 rounded-xl transition-all text-sm"
//             >
//               <Search size={15} /> Rechercher des offres
//             </button>

//             {/* Quick searches */}
//             <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
//               <span className="text-xs text-gray-400">Populaires :</span>
//               {POPULAR_SEARCHES.map((q) => (
//                 <button
//                   key={q}
//                   type="button"
//                   onClick={() => handlePopularSearch(q)}
//                   className="text-xs text-[#E8622A] hover:underline font-medium"
//                 >
//                   {q}
//                 </button>
//               ))}
//             </div>
//           </form>
//         </div>
//       </section>

//       {/* ── COMPANIES ─────────────────────────────────────────────────── */}
//       <section className="py-16 px-6 max-w-7xl mx-auto">
//         <div className="flex items-end justify-between mb-8">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
//               Découvrez les entreprises qui recrutent
//             </h2>
//             <p className="text-gray-500 mt-1 text-sm">
//               Explorez les marques employeurs du secteur touristique
//               {compError && (
//                 <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-500">
//                   <AlertCircle size={11} /> données démo
//                 </span>
//               )}
//             </p>
//           </div>
//           <Link
//             href="/emploi/entreprises"
//             className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#E8622A]
//                        hover:underline flex-shrink-0"
//           >
//             Toutes les entreprises <ArrowRight size={14} />
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {loadingComp
//             ? Array.from({ length: 6 }).map((_, i) => <CompanySkeleton key={i} />)
//             : companies.map((c) => <CompanyCard key={c.id} company={c} />)
//           }
//         </div>

//         <div className="flex justify-center mt-6 sm:hidden">
//           <Link
//             href="/emploi/entreprises"
//             className="flex items-center gap-2 border border-[#E8622A] text-[#E8622A] font-semibold
//                        text-sm px-6 py-2.5 rounded-xl hover:bg-[#E8622A] hover:text-white transition-colors"
//           >
//             Voir toutes les entreprises <ArrowRight size={14} />
//           </Link>
//         </div>
//       </section>

//       {/* ── MÉTIERS ───────────────────────────────────────────────────── */}
//       <section className="py-14 px-6 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-8">
//             <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
//               Parcourir par Métiers
//             </h2>
//             <p className="text-gray-500 mt-1 text-sm">
//               Cliquez sur un secteur pour voir toutes les offres disponibles
//             </p>
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
//             {METIERS.map((m) => <MetierCard key={m.sector} metier={m} />)}
//           </div>

//           {/* Stats par secteur */}
//           <div className="mt-8 grid grid-cols-3 sm:grid-cols-6 gap-3">
//             {METIERS.map((m) => {
//               const count = offres.filter((o) => o.sector === m.sector).length;
//               return (
//                 <button
//                   key={m.sector}
//                   onClick={() => router.push(`/emploi/metiers/${m.sector}`)}
//                   className="text-center py-2 px-3 rounded-xl bg-white border border-gray-100
//                              hover:border-[#E8622A]/30 transition-colors cursor-pointer group"
//                 >
//                   <p className="text-lg font-extrabold text-[#1E2A3A] group-hover:text-[#E8622A] transition-colors">
//                     {loadingJobs ? '—' : `${count}+`}
//                   </p>
//                   <p className="text-[10px] text-gray-400 leading-tight">{m.label}</p>
//                 </button>
//               );
//             })}
//           </div>

//           <div className="flex justify-center mt-8">
//             <Link
//               href="/emploi/jobs"
//               className="flex items-center gap-2 bg-[#1E2A3A] hover:bg-[#2d3f55] text-white
//                          font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
//             >
//               Voir toutes les offres <ArrowRight size={14} />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ── LATEST JOBS ───────────────────────────────────────────────── */}
//       <section className="py-16 px-6 max-w-4xl mx-auto">
//         <div className="flex items-end justify-between mb-8">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
//               Les dernières opportunités à saisir
//             </h2>
//             <p className="text-gray-500 mt-1 text-sm">
//               Postes fraîchement publiés par nos partenaires
//               {jobsError && (
//                 <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-500">
//                   <AlertCircle size={11} /> données démo
//                 </span>
//               )}
//             </p>
//           </div>
//           <Link
//             href="/emploi/jobs"
//             className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#E8622A]
//                        hover:underline flex-shrink-0"
//           >
//             Voir tout <ArrowRight size={14} />
//           </Link>
//         </div>

//         <div className="space-y-3">
//           {loadingJobs
//             ? Array.from({ length: 5 }).map((_, i) => <JobSkeleton key={i} />)
//             : offres.map((offre) => <JobCard key={offre.id} offre={offre} />)
//           }
//         </div>

//         {/* CTA voir tout */}
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
//           <Link
//             href="/emploi/jobs"
//             className="inline-flex items-center gap-2 bg-[#1E2A3A] hover:bg-[#2d3f55] text-white
//                        font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
//           >
//             Voir toutes les offres{totalJobs ? ` (${totalJobs.toLocaleString('fr-FR')})` : ''} <ArrowRight size={15} />
//           </Link>
//           {/* Liens rapides par secteur */}
//           <div className="flex flex-wrap justify-center gap-2">
//             {METIERS.slice(0, 3).map((m) => (
//               <Link
//                 key={m.sector}
//                 href={`/emploi/metiers/${m.sector}`}
//                 className="text-xs text-gray-500 hover:text-[#E8622A] border border-gray-200
//                            hover:border-[#E8622A]/40 px-3 py-1.5 rounded-full transition-colors"
//               >
//                 {m.label}
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── RECRUITER CTA ─────────────────────────────────────────────── */}
//       <section
//         className="py-20 px-6"
//         style={{ background: 'linear-gradient(135deg, #1E2A3A 0%, #E8622A 100%)' }}
//       >
//         <div className="max-w-2xl mx-auto text-center">
//           <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
//             <Building2 size={28} className="text-white" />
//           </div>
//           <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
//             Vous êtes un recruteur ?
//           </h2>
//           <p className="text-white/75 text-sm leading-relaxed mb-8 max-w-md mx-auto">
//             Valorisez votre marque employeur et trouvez les meilleurs talents du tourisme
//             grâce à notre plateforme dédiée.
//           </p>
//           <Link
//             href="/recruteur/register"
//             className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold
//                        px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm"
//           >
//             Créer votre vitrine entreprise <ArrowRight size={15} />
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// }




















// 'use client';
// // src/app/(emploi)/emploi/page.tsx

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import {
//   Search, MapPin, FileText, Clock, ArrowRight, Building2,
//   Utensils, Plane, Briefcase, Monitor, Calendar, Hotel, ChevronRight,
// } from 'lucide-react';
// import {
//   fetchPublicJobs,
//   fetchFeaturedCompanies,
//   MOCK_OFFRES,
//   MOCK_COMPANIES,
// } from '@/services/emploi-public.service';
// import type { PublicOffre, PublicEtablissement } from '@/services/emploi-public.service';

// // ─────────────────────────────────────────────────────────────────────────────
// // CONSTANTS
// // ─────────────────────────────────────────────────────────────────────────────

// const SECTOR_ICONS: Record<string, React.ReactNode> = {
//   hotel:       <Hotel    size={20} />,
//   restaurant:  <Utensils size={20} />,
//   transport:   <Plane    size={20} />,
//   travel:      <Briefcase size={20} />,
//   tech:        <Monitor  size={20} />,
//   events:      <Calendar size={20} />,
// };

// const SECTOR_COLORS: Record<string, string> = {
//   hotel:       'bg-blue-50 text-blue-600',
//   restaurant:  'bg-orange-50 text-orange-600',
//   transport:   'bg-sky-50 text-sky-600',
//   travel:      'bg-amber-50 text-amber-600',
//   tech:        'bg-green-50 text-green-600',
//   events:      'bg-purple-50 text-purple-600',
// };

// const SECTOR_BG: Record<string, string> = {
//   hotel:      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
//   restaurant: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
//   transport:  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
//   travel:     'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
//   tech:       'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
//   events:     'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
// };

// // Metiers avec label, icône, couleur, secteur API et image de fond
// const METIERS = [
//   {
//     label: 'Hôtellerie',
//     icon:  <Hotel    size={28} />,
//     color: 'text-blue-600   bg-blue-50   hover:bg-blue-100',
//     sector: 'hotel',
//     description: 'Réception, direction, housekeeping...',
//     bg: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
//   },
//   {
//     label: 'Restauration',
//     icon:  <Utensils size={28} />,
//     color: 'text-orange-600 bg-orange-50 hover:bg-orange-100',
//     sector: 'restaurant',
//     description: 'Chef, cuisine, salle, bar...',
//     bg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
//   },
//   {
//     label: 'Aérien & Transport',
//     icon:  <Plane    size={28} />,
//     color: 'text-sky-600    bg-sky-50    hover:bg-sky-100',
//     sector: 'transport',
//     description: 'Pilote, agent d\'escale, hôtesse...',
//     bg: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
//   },
//   {
//     label: 'Agence de Voyage',
//     icon:  <Briefcase size={28} />,
//     color: 'text-amber-600  bg-amber-50  hover:bg-amber-100',
//     sector: 'travel',
//     description: 'Conseiller voyage, TO, tourisme...',
//     bg: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
//   },
//   {
//     label: 'Tech & Digital',
//     icon:  <Monitor  size={28} />,
//     color: 'text-green-600  bg-green-50  hover:bg-green-100',
//     sector: 'tech',
//     description: 'Revenue, yield, digital, dev...',
//     bg: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
//   },
//   {
//     label: 'MICE & Événementiel',
//     icon:  <Calendar size={28} />,
//     color: 'text-purple-600 bg-purple-50 hover:bg-purple-100',
//     sector: 'events',
//     description: 'Congrès, séminaires, incentives...',
//     bg: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
//   },
// ];

// const CONTRACT_COLOR: Record<string, string> = {
//   CDI:              'bg-blue-50 text-blue-700',
//   CDD:              'bg-purple-50 text-purple-700',
//   'CDD Saisonnier': 'bg-orange-50 text-orange-700',
//   Alternance:       'bg-indigo-50 text-indigo-700',
//   Stage:            'bg-teal-50 text-teal-700',
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // HELPERS
// // ─────────────────────────────────────────────────────────────────────────────

// function timeAgo(iso: string): string {
//   const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
//   if (h < 1)  return 'À l\'instant';
//   if (h < 24) return `Il y a ${h}h`;
//   const d = Math.floor(h / 24);
//   return d === 1 ? 'Il y a 1 jour' : `Il y a ${d} jours`;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SUB-COMPONENTS
// // ─────────────────────────────────────────────────────────────────────────────

// // Company card (entreprises qui recrutent)
// function CompanyCard({ company }: { company: PublicEtablissement }) {
//   const bg        = SECTOR_BG[company.sector] ?? SECTOR_BG['hotel'];
//   const icon      = SECTOR_ICONS[company.sector] ?? <Building2 size={20} />;
//   const iconColor = SECTOR_COLORS[company.sector] ?? 'bg-gray-50 text-gray-600';

//   return (
//     <Link
//       href={`/emploi/entreprises/${company.id}`}
//       className="group relative overflow-hidden rounded-2xl aspect-[4/3] block"
//     >
//       <div
//         className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
//         style={{ backgroundImage: `url(${bg})` }}
//       />
//       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
//       <div className="absolute bottom-0 left-0 right-0 p-4">
//         <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2 ${iconColor} shadow-lg`}>
//           {icon}
//         </div>
//         <h3 className="text-white font-bold text-base leading-tight">{company.name}</h3>
//         <p className="text-gray-300 text-xs mt-0.5">{company.offresCount} offre{company.offresCount > 1 ? 's' : ''} disponibles</p>
//       </div>
//     </Link>
//   );
// }

// // Metier card — clique → /emploi/jobs?sector=xxx
// function MetierCard({ metier }: { metier: typeof METIERS[0] }) {
//   const router = useRouter();
//   return (
//     <button
//       onClick={() => router.push(`/emploi/jobs?sector=${metier.sector}`)}
//       className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100
//                  hover:border-[#E8622A]/40 hover:shadow-md transition-all duration-200 group cursor-pointer"
//     >
//       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${metier.color}
//                        group-hover:scale-110 transition-transform duration-200`}>
//         {metier.icon}
//       </div>
//       <div className="text-center">
//         <p className="text-xs font-semibold text-gray-700 leading-tight">{metier.label}</p>
//         <p className="text-[10px] text-gray-400 mt-0.5 leading-tight hidden sm:block">{metier.description}</p>
//       </div>
//     </button>
//   );
// }

// // Job card — clique → /emploi/jobs/[id]
// function JobCard({ offre }: { offre: PublicOffre }) {
//   const icon      = SECTOR_ICONS[offre.sector] ?? <Building2 size={18} />;
//   const iconColor = SECTOR_COLORS[offre.sector] ?? 'bg-gray-50 text-gray-600';
//   const ctColor   = CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600';
//   const isNew     = Date.now() - new Date(offre.publishedAt).getTime() < 24 * 3_600_000;

//   return (
//     <Link
//       href={`/emploi/jobs/${offre.id}`}
//       className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100
//                  hover:border-[#E8622A]/30 hover:shadow-md transition-all duration-200 group"
//     >
//       {/* Icon */}
//       <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${iconColor}`}>
//         {icon}
//       </div>

//       {/* Content */}
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 flex-wrap">
//           <h3 className="font-semibold text-[#1E2A3A] text-sm group-hover:text-[#E8622A]
//                          transition-colors truncate">
//             {offre.title}
//           </h3>
//           {isNew && (
//             <span className="flex-shrink-0 text-[10px] font-bold text-[#E8622A] bg-orange-50
//                              px-2 py-0.5 rounded-full border border-orange-100">
//               Nouveau
//             </span>
//           )}
//           {offre.isPremium && (
//             <span className="flex-shrink-0 text-[10px] font-bold text-amber-600 bg-amber-50
//                              px-2 py-0.5 rounded-full border border-amber-100">
//               ⭐ Premium
//             </span>
//           )}
//         </div>

//         <p className="text-xs text-gray-500 mt-0.5 truncate">{offre.companyName}</p>

//         <div className="flex flex-wrap items-center gap-2 mt-1.5">
//           <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ctColor}`}>
//             {offre.contractType}
//           </span>
//           <span className="flex items-center gap-1 text-xs text-gray-400">
//             <MapPin size={10} /> {offre.location}
//           </span>
//           {offre.salaryMin && (
//             <span className="text-xs text-gray-400">
//               {Math.round(offre.salaryMin / 1000)}–{Math.round((offre.salaryMax ?? offre.salaryMin) / 1000)}k€
//             </span>
//           )}
//           <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
//             <Clock size={10} /> {timeAgo(offre.publishedAt)}
//           </span>
//         </div>
//       </div>

//       <ChevronRight
//         size={15}
//         className="flex-shrink-0 text-gray-300 group-hover:text-[#E8622A]
//                    group-hover:translate-x-0.5 transition-all"
//       />
//     </Link>
//   );
// }

// // Skeleton loaders
// function CompanySkeleton() {
//   return <div className="rounded-2xl aspect-[4/3] bg-gray-100 animate-pulse" />;
// }
// function JobSkeleton() {
//   return (
//     <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 animate-pulse">
//       <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0" />
//       <div className="flex-1 space-y-2">
//         <div className="h-4 bg-gray-100 rounded w-2/3" />
//         <div className="h-3 bg-gray-100 rounded w-1/2" />
//         <div className="flex gap-2">
//           <div className="h-4 bg-gray-100 rounded-full w-10" />
//           <div className="h-4 bg-gray-100 rounded w-16" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN PAGE
// // ─────────────────────────────────────────────────────────────────────────────

// export default function EmploiHomePage() {
//   const router = useRouter();

//   // Search form state
//   const [search,       setSearch]       = useState('');
//   const [location,     setLocation]     = useState('');
//   const [contractType, setContractType] = useState('');

//   // Data state
//   const [offres,        setOffres]        = useState<PublicOffre[]>([]);
//   const [companies,     setCompanies]     = useState<PublicEtablissement[]>([]);
//   const [loadingJobs,   setLoadingJobs]   = useState(true);
//   const [loadingComp,   setLoadingComp]   = useState(true);
//   const [jobsError,     setJobsError]     = useState(false);
//   const [compError,     setCompError]     = useState(false);

//   // Load jobs
//   useEffect(() => {
//     setLoadingJobs(true);
//     fetchPublicJobs({ limit: 6, page: 1 })
//       .then((res) => {
//         setOffres(res.offres?.length ? res.offres : MOCK_OFFRES);
//         setJobsError(false);
//       })
//       .catch(() => {
//         setOffres(MOCK_OFFRES);
//         setJobsError(true);
//       })
//       .finally(() => setLoadingJobs(false));
//   }, []);

//   // Load companies
//   useEffect(() => {
//     setLoadingComp(true);
//     fetchFeaturedCompanies()
//       .then((list) => {
//         setCompanies(list?.length ? list : MOCK_COMPANIES);
//         setCompError(false);
//       })
//       .catch(() => {
//         setCompanies(MOCK_COMPANIES);
//         setCompError(true);
//       })
//       .finally(() => setLoadingComp(false));
//   }, []);

//   // Search form submit → redirect to job board with params
//   function handleSearch(e: React.FormEvent) {
//     e.preventDefault();
//     const params = new URLSearchParams();
//     if (search.trim())   params.set('search',       search.trim());
//     if (location.trim()) params.set('location',     location.trim());
//     if (contractType)    params.set('contractType', contractType);
//     router.push(`/emploi/jobs?${params.toString()}`);
//   }

//   return (
//     <div className="bg-white">

//       {/* ── HERO ──────────────────────────────────────────────────────── */}
//       <section className="relative min-h-[440px] flex items-center overflow-hidden">
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80)' }}
//         />
//         <div className="absolute inset-0 bg-[#1E2A3A]/70" />

//         <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 text-center">
//           <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
//             Propulsez votre carrière dans l'industrie du tourisme
//           </h1>
//           <p className="text-white/70 text-sm mb-8">
//             Des milliers d'offres dans l'hôtellerie, la restauration, l'aérien et plus encore.
//           </p>

//           {/* Search card */}
//           <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-5 text-left">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

//               {/* Quoi */}
//               <div>
//                 <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Quoi ?</label>
//                 <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5
//                                 focus-within:border-[#E8622A] transition-colors">
//                   <Building2 size={15} className="text-gray-400 flex-shrink-0" />
//                   <input
//                     type="text"
//                     placeholder="Métier, poste..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
//                   />
//                   {search && (
//                     <button type="button" onClick={() => setSearch('')}
//                             className="text-gray-300 hover:text-gray-500">
//                       x
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Où */}
//               <div>
//                 <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Où ?</label>
//                 <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5
//                                 focus-within:border-[#E8622A] transition-colors">
//                   <MapPin size={15} className="text-gray-400 flex-shrink-0" />
//                   <input
//                     type="text"
//                     placeholder="Ville, région..."
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
//                   />
//                 </div>
//               </div>

//               {/* Contrat */}
//               <div>
//                 <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Contrat</label>
//                 <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5
//                                 focus-within:border-[#E8622A] transition-colors">
//                   <FileText size={15} className="text-gray-400 flex-shrink-0" />
//                   <select
//                     value={contractType}
//                     onChange={(e) => setContractType(e.target.value)}
//                     className="flex-1 text-sm text-gray-700 outline-none bg-transparent appearance-none cursor-pointer"
//                   >
//                     <option value="">Tous les contrats</option>
//                     <option value="CDI">CDI</option>
//                     <option value="CDD">CDD</option>
//                     <option value="CDD Saisonnier">CDD Saisonnier</option>
//                     <option value="Alternance">Alternance</option>
//                     <option value="Stage">Stage</option>
//                     <option value="Freelance">Freelance</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="mt-4 w-full flex items-center justify-center gap-2 bg-[#E8622A]
//                          hover:bg-[#d4561f] text-white font-semibold py-3.5 rounded-xl
//                          transition-colors text-sm active:scale-[0.99]"
//             >
//               <Search size={15} /> Rechercher
//             </button>

//             {/* Quick links */}
//             <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
//               <span className="text-xs text-gray-400">Populaires :</span>
//               {['Réceptionniste', 'Revenue Manager', 'Chef de cuisine', 'Yield Manager'].map((q) => (
//                 <button
//                   key={q}
//                   type="button"
//                   onClick={() => { setSearch(q); router.push(`/emploi/jobs?search=${encodeURIComponent(q)}`); }}
//                   className="text-xs text-[#E8622A] hover:underline font-medium"
//                 >
//                   {q}
//                 </button>
//               ))}
//             </div>
//           </form>
//         </div>
//       </section>

//       {/* ── COMPANIES ─────────────────────────────────────────────────── */}
//       <section className="py-16 px-6 max-w-7xl mx-auto">
//         <div className="flex items-end justify-between mb-8">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
//               Découvrez les entreprises qui recrutent
//             </h2>
//             <p className="text-gray-500 mt-1 text-sm">
//               Explorez les marques employeurs du secteur touristique
//             </p>
//           </div>
//           <Link
//             href="/emploi/entreprises"
//             className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#E8622A]
//                        hover:underline flex-shrink-0"
//           >
//             Toutes les entreprises <ArrowRight size={14} />
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {loadingComp
//             ? Array.from({ length: 6 }).map((_, i) => <CompanySkeleton key={i} />)
//             : companies.map((c) => <CompanyCard key={c.id} company={c} />)
//           }
//         </div>

//         <div className="flex justify-center mt-6 sm:hidden">
//           <Link
//             href="/emploi/entreprises"
//             className="flex items-center gap-2 border border-[#E8622A] text-[#E8622A] font-semibold
//                        text-sm px-6 py-2.5 rounded-xl hover:bg-[#E8622A] hover:text-white transition-colors"
//           >
//             Voir toutes les entreprises <ArrowRight size={14} />
//           </Link>
//         </div>
//       </section>

//       {/* ── MÉTIERS ───────────────────────────────────────────────────── */}
//       <section className="py-14 px-6 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-8">
//             <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
//               Parcourir par Métiers
//             </h2>
//             <p className="text-gray-500 mt-1 text-sm">
//               Cliquez sur un secteur pour voir toutes les offres disponibles
//             </p>
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
//             {METIERS.map((m) => <MetierCard key={m.sector} metier={m} />)}
//           </div>

//           {/* CTA "Voir toutes les offres" after metiers */}
//           <div className="flex justify-center mt-8">
//             <Link
//               href="/emploi/jobs"
//               className="flex items-center gap-2 bg-[#1E2A3A] hover:bg-[#2d3f55] text-white
//                          font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
//             >
//               Voir toutes les offres <ArrowRight size={14} />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ── LATEST JOBS ───────────────────────────────────────────────── */}
//       <section className="py-16 px-6 max-w-4xl mx-auto">
//         <div className="flex items-end justify-between mb-8">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
//               Les dernières opportunités à saisir
//             </h2>
//             <p className="text-gray-500 mt-1 text-sm">
//               Postes fraîchement publiés par nos partenaires
//               {jobsError && (
//                 <span className="ml-2 text-xs text-amber-500">(données démo)</span>
//               )}
//             </p>
//           </div>
//           <Link
//             href="/emploi/jobs"
//             className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#E8622A]
//                        hover:underline flex-shrink-0"
//           >
//             Voir tout <ArrowRight size={14} />
//           </Link>
//         </div>

//         <div className="space-y-3">
//           {loadingJobs
//             ? Array.from({ length: 5 }).map((_, i) => <JobSkeleton key={i} />)
//             : offres.map((offre) => <JobCard key={offre.id} offre={offre} />)
//           }
//         </div>

//         <div className="flex justify-center mt-8">
//           <Link
//             href="/emploi/jobs"
//             className="inline-flex items-center gap-2 bg-[#1E2A3A] hover:bg-[#2d3f55] text-white
//                        font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
//           >
//             Voir toutes les offres <ArrowRight size={15} />
//           </Link>
//         </div>
//       </section>

//       {/* ── RECRUITER CTA ─────────────────────────────────────────────── */}
//       <section
//         className="py-20 px-6"
//         style={{ background: 'linear-gradient(135deg, #1E2A3A 0%, #E8622A 100%)' }}
//       >
//         <div className="max-w-2xl mx-auto text-center">
//           <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
//             <Building2 size={28} className="text-white" />
//           </div>
//           <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
//             Vous êtes un recruteur ?
//           </h2>
//           <p className="text-white/75 text-sm leading-relaxed mb-8 max-w-md mx-auto">
//             Valorisez votre marque employeur et trouvez les meilleurs talents du tourisme
//             grâce à notre plateforme dédiée.
//           </p>
//           <Link
//             href="/recruteur/register"
//             className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold
//                        px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm"
//           >
//             Créer votre vitrine entreprise <ArrowRight size={15} />
//           </Link>
//         </div>
//       </section>

//     </div>
//   );
// }


















// 'use client';
// // src/app/(emploi)/emploi/page.tsx

// import { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import {
//   Search,
//   MapPin,
//   FileText,
//   Clock,
//   ArrowRight,
//   Building2,
//   Utensils,
//   Plane,
//   Briefcase,
//   Monitor,
//   Calendar,
//   Hotel,
// } from 'lucide-react';
// import { fetchPublicJobs, fetchFeaturedCompanies, MOCK_OFFRES, MOCK_COMPANIES } from '@/services/emploi-public.service';
// import type { PublicOffre, PublicEtablissement } from '@/services/emploi-public.service';

// // ── Helpers ───────────────────────────────────────────────────────────────────

// function timeAgo(dateStr: string): string {
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const h = Math.floor(diff / 3600000);
//   if (h < 1) return 'À l\'instant';
//   if (h < 24) return `Il y a ${h} heure${h > 1 ? 's' : ''}`;
//   const d = Math.floor(h / 24);
//   if (d === 1) return 'Il y a 1 jour';
//   return `Il y a ${d} jours`;
// }

// const SECTOR_ICONS: Record<string, React.ReactNode> = {
//   hotel:       <Hotel      size={20} />,
//   restaurant:  <Utensils   size={20} />,
//   transport:   <Plane      size={20} />,
//   travel:      <Briefcase  size={20} />,
//   tech:        <Monitor    size={20} />,
//   events:      <Calendar   size={20} />,
//   Hôtellerie:  <Hotel      size={20} />,
//   Restauration:<Utensils   size={20} />,
// };

// const SECTOR_COLORS: Record<string, string> = {
//   hotel:       'bg-blue-50 text-blue-600',
//   restaurant:  'bg-orange-50 text-orange-600',
//   transport:   'bg-sky-50 text-sky-600',
//   travel:      'bg-amber-50 text-amber-600',
//   tech:        'bg-green-50 text-green-600',
//   events:      'bg-purple-50 text-purple-600',
//   Hôtellerie:  'bg-blue-50 text-blue-600',
//   Restauration:'bg-orange-50 text-orange-600',
// };

// // Sector images via Unsplash for company cards (fallback backgrounds)
// const SECTOR_BG: Record<string, string> = {
//   hotel:       'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
//   restaurant:  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
//   transport:   'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
//   travel:      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
//   tech:        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
//   events:      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
//   Hôtellerie:  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
//   Restauration:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
// };

// const METIERS = [
//   { label: 'Hôtellerie',        icon: <Hotel      size={28} />, color: 'text-blue-600   bg-blue-50',   sector: 'hotel'      },
//   { label: 'Restauration',      icon: <Utensils   size={28} />, color: 'text-orange-600 bg-orange-50', sector: 'restaurant' },
//   { label: 'Aérien & Transport',icon: <Plane      size={28} />, color: 'text-sky-600    bg-sky-50',    sector: 'transport'  },
//   { label: 'Agence de Voyage',  icon: <Briefcase  size={28} />, color: 'text-amber-600  bg-amber-50',  sector: 'travel'     },
//   { label: 'Tech & Digital',    icon: <Monitor    size={28} />, color: 'text-green-600  bg-green-50',  sector: 'tech'       },
//   { label: 'MICE & Événementiel',icon:<Calendar   size={28} />, color: 'text-purple-600 bg-purple-50', sector: 'events'     },
// ];

// // ── Company Card Component ────────────────────────────────────────────────────

// function CompanyCard({ company }: { company: PublicEtablissement }) {
//   const bg = SECTOR_BG[company.sector] ?? SECTOR_BG['hotel'];
//   const icon = SECTOR_ICONS[company.sector] ?? <Building2 size={20} />;
//   const iconColor = SECTOR_COLORS[company.sector] ?? 'bg-gray-50 text-gray-600';

//   return (
//     <Link
//       href={`/emploi/entreprises/${company.id}`}
//       className="group relative overflow-hidden rounded-2xl aspect-[4/3] block"
//     >
//       {/* Background image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
//         style={{ backgroundImage: `url(${bg})` }}
//       />
//       {/* Gradient overlay */}
//       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

//       {/* Content */}
//       <div className="absolute bottom-0 left-0 right-0 p-4">
//         {/* Sector icon badge */}
//         <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2 ${iconColor} shadow-lg`}>
//           {icon}
//         </div>
//         <h3 className="text-white font-bold text-base leading-tight">{company.name}</h3>
//         <p className="text-gray-300 text-xs mt-0.5">{company.offresCount} offres disponibles</p>
//       </div>
//     </Link>
//   );
// }

// // ── Job Card Component ────────────────────────────────────────────────────────

// function JobCard({ offre }: { offre: PublicOffre }) {
//   const icon = SECTOR_ICONS[offre.sector] ?? <Building2 size={18} />;
//   const iconColor = SECTOR_COLORS[offre.sector] ?? 'bg-gray-50 text-gray-600';
//   const isNew = Date.now() - new Date(offre.publishedAt).getTime() < 24 * 3600000;

//   return (
//     <Link
//       href={`/emploi/jobs/${offre.id}`}
//       className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100
//                  hover:border-[#E8622A]/30 hover:shadow-md transition-all duration-200 group"
//     >
//       {/* Icon */}
//       <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${iconColor}`}>
//         {icon}
//       </div>

//       {/* Info */}
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2">
//           <h3 className="font-semibold text-[#1E2A3A] text-sm group-hover:text-[#E8622A] transition-colors truncate">
//             {offre.title}
//           </h3>
//           {isNew && (
//             <span className="flex-shrink-0 text-xs font-semibold text-[#E8622A] bg-orange-50 px-2 py-0.5 rounded-full">
//               Nouveau
//             </span>
//           )}
//         </div>
//         <p className="text-xs text-gray-500 mt-0.5 truncate">{offre.companyName}</p>
//         <div className="flex items-center gap-3 mt-1.5">
//           <span className="flex items-center gap-1 text-xs text-gray-400">
//             <MapPin size={11} /> {offre.location}
//           </span>
//           <span className="flex items-center gap-1 text-xs text-gray-400">
//             <FileText size={11} /> {offre.contractType}
//           </span>
//           <span className="flex items-center gap-1 text-xs text-gray-400">
//             <Clock size={11} /> {timeAgo(offre.publishedAt)}
//           </span>
//         </div>
//       </div>

//       {/* Arrow */}
//       <ArrowRight
//         size={16}
//         className="flex-shrink-0 text-gray-300 group-hover:text-[#E8622A] group-hover:translate-x-0.5 transition-all"
//       />
//     </Link>
//   );
// }

// // ── Main Page ─────────────────────────────────────────────────────────────────

// export default function EmploiHomePage() {
//   const router = useRouter();

//   const [search,       setSearch]       = useState('');
//   const [location,     setLocation]     = useState('');
//   const [contractType, setContractType] = useState('');
//   const [offres,       setOffres]       = useState<PublicOffre[]>(MOCK_OFFRES);
//   const [companies,    setCompanies]    = useState<PublicEtablissement[]>(MOCK_COMPANIES);
//   const [loading,      setLoading]      = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const [jobsRes, companiesRes] = await Promise.all([
//           fetchPublicJobs({ limit: 6 }),
//           fetchFeaturedCompanies(),
//         ]);
//         setOffres(jobsRes.offres.length  ? jobsRes.offres  : MOCK_OFFRES);
//         setCompanies(companiesRes.length ? companiesRes    : MOCK_COMPANIES);
//       } catch {
//         // Fallback to mock data (already set as default state)
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   function handleSearch(e: React.FormEvent) {
//     e.preventDefault();
//     const params = new URLSearchParams();
//     if (search)       params.set('search',       search);
//     if (location)     params.set('location',     location);
//     if (contractType) params.set('contractType', contractType);
//     router.push(`/emploi/jobs?${params.toString()}`);
//   }

//   function handleMetier(sector: string) {
//     router.push(`/emploi/jobs?sector=${sector}`);
//   }

//   return (
//     <div className="bg-white">

//       {/* ── HERO ──────────────────────────────────────────────────────────── */}
//       <section className="relative min-h-[420px] flex items-center overflow-hidden">
//         {/* Background image */}
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{
//             backgroundImage:
//               'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80)',
//           }}
//         />
//         <div className="absolute inset-0 bg-[#1E2A3A]/70" />

//         <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 text-center">
//           <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-8">
//             Propulsez votre carrière dans l'industrie du tourisme
//           </h1>

//           {/* Search card */}
//           <form
//             onSubmit={handleSearch}
//             className="bg-white rounded-2xl shadow-2xl p-6 text-left"
//           >
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {/* Quoi */}
//               <div>
//                 <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Quoi ?</label>
//                 <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#E8622A] transition-colors">
//                   <Building2 size={16} className="text-gray-400 flex-shrink-0" />
//                   <input
//                     type="text"
//                     placeholder="Métier, poste..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
//                   />
//                 </div>
//               </div>

//               {/* Où */}
//               <div>
//                 <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Où ?</label>
//                 <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#E8622A] transition-colors">
//                   <MapPin size={16} className="text-gray-400 flex-shrink-0" />
//                   <input
//                     type="text"
//                     placeholder="Ville, région..."
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
//                   />
//                 </div>
//               </div>

//               {/* Contrat */}
//               <div>
//                 <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Contrat</label>
//                 <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#E8622A] transition-colors">
//                   <FileText size={16} className="text-gray-400 flex-shrink-0" />
//                   <select
//                     value={contractType}
//                     onChange={(e) => setContractType(e.target.value)}
//                     className="flex-1 text-sm text-gray-700 outline-none bg-transparent appearance-none cursor-pointer"
//                   >
//                     <option value="">Tous les contrats</option>
//                     <option value="CDI">CDI</option>
//                     <option value="CDD">CDD</option>
//                     <option value="CDD Saisonnier">CDD Saisonnier</option>
//                     <option value="Alternance">Alternance</option>
//                     <option value="Stage">Stage</option>
//                     <option value="Freelance">Freelance</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="mt-4 w-full flex items-center justify-center gap-2 bg-[#E8622A] hover:bg-[#d4561f]
//                          text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
//             >
//               <Search size={16} />
//               Rechercher
//             </button>
//           </form>
//         </div>
//       </section>

//       {/* ── COMPANIES ─────────────────────────────────────────────────────── */}
//       <section className="py-16 px-6 max-w-7xl mx-auto">
//         <div className="text-center mb-10">
//           <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
//             Découvrez les entreprises qui recrutent
//           </h2>
//           <p className="text-gray-500 mt-2 text-sm">
//             Explorez les marques employeurs du secteur touristique
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {companies.map((c) => (
//             <CompanyCard key={c.id} company={c} />
//           ))}
//         </div>
//       </section>

//       {/* ── MÉTIERS ───────────────────────────────────────────────────────── */}
//       <section className="py-12 px-6 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10">
//             <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
//               Parcourir par Métiers
//             </h2>
//             <p className="text-gray-500 mt-2 text-sm">
//               Trouvez rapidement les opportunités dans votre domaine
//             </p>
//           </div>

//           <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
//             {METIERS.map((m) => (
//               <button
//                 key={m.sector}
//                 onClick={() => handleMetier(m.sector)}
//                 className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100
//                            hover:border-[#E8622A]/40 hover:shadow-md transition-all duration-200 group cursor-pointer"
//               >
//                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${m.color} group-hover:scale-110 transition-transform`}>
//                   {m.icon}
//                 </div>
//                 <span className="text-xs font-medium text-gray-700 text-center leading-tight">{m.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── LATEST JOBS ───────────────────────────────────────────────────── */}
//       <section className="py-16 px-6 max-w-4xl mx-auto">
//         <div className="text-center mb-10">
//           <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">
//             Les dernières opportunités à saisir
//           </h2>
//           <p className="text-gray-500 mt-2 text-sm">Postes fraîchement publiés par nos partenaires</p>
//         </div>

//         <div className="space-y-3">
//           {offres.map((offre) => (
//             <JobCard key={offre.id} offre={offre} />
//           ))}
//         </div>

//         <div className="flex justify-center mt-10">
//           <Link
//             href="/emploi/jobs"
//             className="inline-flex items-center gap-2 bg-[#1E2A3A] hover:bg-[#2d3f55] text-white
//                        font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
//           >
//             Voir toutes les offres
//             <ArrowRight size={16} />
//           </Link>
//         </div>
//       </section>

//       {/* ── RECRUITER CTA ─────────────────────────────────────────────────── */}
//       <section
//         className="relative overflow-hidden py-20 px-6"
//         style={{
//           background: 'linear-gradient(135deg, #1E2A3A 0%, #E8622A 100%)',
//         }}
//       >
//         <div className="relative z-10 max-w-2xl mx-auto text-center">
//           {/* Icon */}
//           <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
//             <Building2 size={28} className="text-white" />
//           </div>

//           <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
//             Vous êtes un recruteur ?
//           </h2>
//           <p className="text-white/80 text-sm leading-relaxed mb-8 max-w-md mx-auto">
//             Valorisez votre marque employeur et trouvez les meilleurs talents du tourisme grâce à notre plateforme dédiée.
//           </p>

//           <Link
//             href="/auth"
//             className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold
//                        px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm"
//           >
//             Créer votre vitrine entreprise
//             <ArrowRight size={16} />
//           </Link>
//         </div>
//       </section>

//     </div>
//   );
// }