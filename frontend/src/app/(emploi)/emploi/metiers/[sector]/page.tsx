'use client';
// src/app/(emploi)/emploi/metiers/[sector]/page.tsx
//
// FIX (système de secteur) : SECTORS couvre maintenant les 8 secteurs canoniques
// de src/lib/sectors.ts (ajout de 'spa' et 'entertainment' qui manquaient —
// toute offre "Spa & Bien-être" ou "Divertissement" provoquait un redirect
// silencieux vers /emploi/jobs avant ce fix).

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Clock, ChevronRight, Heart, Search,
  Star, Wifi, SlidersHorizontal, X, Building2, ArrowRight,
  Hotel, Utensils, Plane, Briefcase, Monitor, Calendar,
  Banknote, RotateCcw, Loader2, Sparkles, PartyPopper,
} from 'lucide-react';
import { fetchPublicJobs, MOCK_OFFRES } from '@/services/emploi-public.service';
import type { PublicOffre } from '@/services/emploi-public.service';
import { normalizeSector, type SectorKey } from '@/lib/sectors';

// ── Auth helpers ───────────────────────────────────────────────────────────────

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

// ── Config secteurs ───────────────────────────────────────────────────────────

interface SectorConfig {
  label:       string;
  labelPlural: string;
  icon:        React.ReactNode;
  iconLg:      React.ReactNode;
  color:       string;
  colorHex:    string;
  bgHex:       string;
  banner:      string;
  description: string;
  roles:       string[];
}

// FIX : les 8 clés correspondent exactement aux SectorKey de src/lib/sectors.ts
const SECTORS: Record<SectorKey, SectorConfig> = {
  hotel: {
    label:       'Hôtellerie',
    labelPlural: 'dans l\'Hôtellerie',
    icon:        <Hotel    size={18} />,
    iconLg:      <Hotel    size={36} />,
    color:       'text-blue-600 bg-blue-50',
    colorHex:    '#2563EB',
    bgHex:       '#EFF6FF',
    banner:      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80',
    description: 'Réception, direction hôtelière, gouvernance, housekeeping, conciergerie... Découvrez les meilleures opportunités dans l\'univers de l\'hôtellerie.',
    roles:       ['Réceptionniste', 'Directeur d\'hôtel', 'Chef de réception', 'Gouvernante', 'Night Auditor', 'Concierge'],
  },
  restaurant: {
    label:       'Restauration',
    labelPlural: 'dans la Restauration',
    icon:        <Utensils size={18} />,
    iconLg:      <Utensils size={36} />,
    color:       'text-orange-600 bg-orange-50',
    colorHex:    '#EA580C',
    bgHex:       '#FFF7ED',
    banner:      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80',
    description: 'Chef de cuisine, pâtissier, sommelier, maître d\'hôtel, directeur de salle... Rejoignez les meilleures tables et brasseries du secteur.',
    roles:       ['Chef de cuisine', 'Chef de partie', 'Pâtissier', 'Sommelier', 'Maître d\'hôtel', 'Barman'],
  },
  transport: {
    label:       'Transport',
    labelPlural: 'dans le Transport',
    icon:        <Plane    size={18} />,
    iconLg:      <Plane    size={36} />,
    color:       'text-sky-600 bg-sky-50',
    colorHex:    '#0284C7',
    bgHex:       '#F0F9FF',
    banner:      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80',
    description: 'Pilote, agent d\'escale, hôtesse de l\'air, steward, agent de voyage aérien... Décollez vers une nouvelle carrière dans le transport.',
    roles:       ['Agent d\'escale', 'Hôtesse de l\'air / Steward', 'Pilote de ligne', 'Agent de comptoir', 'Chauffeur touristique'],
  },
  travel: {
    label:       'Agence de Voyage',
    labelPlural: 'en Agence de Voyage',
    icon:        <Briefcase size={18} />,
    iconLg:      <Briefcase size={36} />,
    color:       'text-amber-600 bg-amber-50',
    colorHex:    '#D97706',
    bgHex:       '#FFFBEB',
    banner:      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80',
    description: 'Conseiller voyages, tour-opérateur, guide touristique, chef de produit destination... Faites voyager vos clients et évoluez dans le tourisme.',
    roles:       ['Conseiller voyages', 'Chef de produit', 'Guide touristique', 'Billettiste', 'Responsable groupes'],
  },
  tech: {
    label:       'Tech Tourisme',
    labelPlural: 'en Tech Tourisme',
    icon:        <Monitor  size={18} />,
    iconLg:      <Monitor  size={36} />,
    color:       'text-green-600 bg-green-50',
    colorHex:    '#16A34A',
    bgHex:       '#F0FDF4',
    banner:      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80',
    description: 'Revenue Manager, Yield Manager, développeur SaaS tourisme, digital marketing, data analyst... La tech au service de l\'hospitality.',
    roles:       ['Revenue Manager', 'Yield Manager', 'Digital Marketing Manager', 'Data Analyst', 'Développeur SaaS'],
  },
  events: {
    label:       'MICE & Événementiel',
    labelPlural: 'en MICE & Événementiel',
    icon:        <Calendar size={18} />,
    iconLg:      <Calendar size={36} />,
    color:       'text-purple-600 bg-purple-50',
    colorHex:    '#9333EA',
    bgHex:       '#FAF5FF',
    banner:      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80',
    description: 'Event Manager, chargé de congrès, incentive planner, wedding planner, coordinateur séminaires... L\'événementiel professionnel n\'a plus de secrets pour vous.',
    roles:       ['Event Manager', 'Chargé de congrès', 'Incentive Planner', 'Wedding Planner', 'Coordinateur MICE'],
  },
  // ── NOUVEAU : manquait entièrement — toute offre "Spa & Bien-être" provoquait
  // un redirect silencieux vers /emploi/jobs faute de config correspondante.
  spa: {
    label:       'Spa & Bien-être',
    labelPlural: 'en Spa & Bien-être',
    icon:        <Sparkles size={18} />,
    iconLg:      <Sparkles size={36} />,
    color:       'text-pink-600 bg-pink-50',
    colorHex:    '#DB2777',
    bgHex:       '#FDF2F8',
    banner:      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1600&q=80',
    description: 'Praticien(ne) spa, esthéticienne, coach bien-être, réceptionniste spa... Prenez soin des autres dans un cadre apaisant.',
    roles:       ['Praticien(ne) spa', 'Esthéticienne', 'Réceptionniste spa', 'Masseur / Masseuse', 'Coach bien-être'],
  },
  // ── NOUVEAU : idem pour "Divertissement"
  entertainment: {
    label:       'Divertissement',
    labelPlural: 'en Divertissement',
    icon:        <PartyPopper size={18} />,
    iconLg:      <PartyPopper size={36} />,
    color:       'text-indigo-600 bg-indigo-50',
    colorHex:    '#4F46E5',
    bgHex:       '#EEF2FF',
    banner:      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&q=80',
    description: 'Animateur culturel, régisseur de spectacle, coordinateur de loisirs... Faites vivre des expériences mémorables.',
    roles:       ['Animateur(trice)', 'Régisseur(se) de spectacle', 'Coordinateur loisirs', 'Guide d\'animation'],
  },
};

const CONTRACT_COLOR: Record<string, string> = {
  CDI:              'bg-blue-50   text-blue-700   border-blue-100',
  CDD:              'bg-purple-50 text-purple-700 border-purple-100',
  'CDD Saisonnier': 'bg-orange-50 text-orange-700 border-orange-100',
  Alternance:       'bg-indigo-50 text-indigo-700 border-indigo-100',
  Stage:            'bg-teal-50   text-teal-700   border-teal-100',
  Freelance:        'bg-pink-50   text-pink-700   border-pink-100',
};

const OTHER_SECTORS = (Object.entries(SECTORS) as [SectorKey, SectorConfig][]).map(
  ([key, cfg]) => ({ key, ...cfg }),
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1)  return "À l'instant";
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'Hier' : `Il y a ${d} jours`;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function JobSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-14 h-14 bg-gray-100 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
          <div className="flex gap-2 mt-1">
            <div className="h-5 bg-gray-100 rounded-full w-12" />
            <div className="h-5 bg-gray-100 rounded-full w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Job Card ──────────────────────────────────────────────────────────────────

function JobCard({
  offre, sectorConfig, isFav, onFavorite,
}: {
  offre: PublicOffre;
  sectorConfig: SectorConfig;
  isFav: boolean;
  onFavorite: (id: string) => void;
}) {
  const router  = useRouter();
  const ctColor = CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600 border-gray-100';
  const isNew   = Date.now() - new Date(offre.publishedAt).getTime() < 48 * 3_600_000;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200
                    hover:shadow-md transition-all duration-200 group overflow-hidden">
      <div className="p-5">
        <div className="flex gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${sectorConfig.color}`}>
            {sectorConfig.iconLg}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <button
                  onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
                  className="font-bold text-[#1E2A3A] text-base group-hover:text-[#E8622A]
                             transition-colors leading-tight text-left hover:underline"
                >
                  {offre.title}
                </button>
                <p className="text-sm font-medium mt-0.5" style={{ color: sectorConfig.colorHex }}>
                  {offre.companyName}
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={11} /> {timeAgo(offre.publishedAt)}
                </span>
                <button
                  onClick={() => onFavorite(offre.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  aria-label="Sauvegarder"
                >
                  <Heart
                    size={15}
                    className={isFav ? 'text-red-500 fill-red-500' : 'text-gray-300 hover:text-red-400'}
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${ctColor}`}>
                {offre.contractType}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={11} /> {offre.location}
              </span>
              {offre.remote && offre.remote !== 'none' && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50
                                 px-2 py-0.5 rounded-full">
                  <Wifi size={10} /> {offre.remote === 'full' ? 'Full remote' : 'Hybride'}
                </span>
              )}
              {offre.isPremium && (
                <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50
                                 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                  <Star size={9} fill="currentColor" /> Premium
                </span>
              )}
              {isNew && (
                <span className="text-[10px] font-bold text-[#E8622A] bg-orange-50 px-2 py-0.5
                                 rounded-full border border-orange-100">
                  Nouveau
                </span>
              )}
              {offre.salaryMin && (
                <span className="flex items-center gap-1 text-xs text-gray-500 font-medium ml-auto">
                  <Banknote size={11} className="text-green-500" />
                  {Math.round(offre.salaryMin / 1000)}–{Math.round((offre.salaryMax ?? offre.salaryMin) / 1000)}k€
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-4">
        <button
          onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold
                     border-2 transition-all duration-200 hover:text-white"
          style={{
            borderColor:  sectorConfig.colorHex,
            color:        sectorConfig.colorHex,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = sectorConfig.colorHex;
            (e.currentTarget as HTMLButtonElement).style.color = 'white';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = sectorConfig.colorHex;
          }}
        >
          Voir l&apos;offre <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ── Filter Bar ────────────────────────────────────────────────────────────────

function FilterBar({
  search, setSearch, contractType, setContractType, location, setLocation,
  total, loading, onReset, hasFilters,
}: {
  search: string; setSearch: (v: string) => void;
  contractType: string; setContractType: (v: string) => void;
  location: string; setLocation: (v: string) => void;
  total: number; loading: boolean;
  onReset: () => void; hasFilters: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 flex-1 min-w-[180px] border border-gray-200 rounded-xl
                      px-3 py-2 focus-within:border-[#E8622A] transition-colors">
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Intitulé du poste..."
          className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-gray-300 hover:text-gray-500 text-lg leading-none">×</button>
        )}
      </div>

      <div className="flex items-center gap-2 min-w-[160px] border border-gray-200 rounded-xl
                      px-3 py-2 focus-within:border-[#E8622A] transition-colors">
        <MapPin size={14} className="text-gray-400 flex-shrink-0" />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ville, région..."
          className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
        />
      </div>

      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2
                      focus-within:border-[#E8622A] transition-colors">
        <SlidersHorizontal size={14} className="text-gray-400 flex-shrink-0" />
        <select
          value={contractType}
          onChange={(e) => setContractType(e.target.value)}
          className="text-sm text-gray-700 outline-none bg-transparent appearance-none cursor-pointer"
        >
          <option value="">Tous les contrats</option>
          {['CDI', 'CDD', 'CDD Saisonnier', 'Alternance', 'Stage', 'Freelance'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {hasFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400
                       hover:text-gray-600 transition-colors"
          >
            <RotateCcw size={12} /> Réinitialiser
          </button>
        )}
        <span className="text-sm font-bold text-gray-500">
          {loading
            ? <span className="inline-block w-8 h-4 bg-gray-200 rounded animate-pulse" />
            : <><span className="text-[#1E2A3A]">{total}</span> offre{total > 1 ? 's' : ''}</>
          }
        </span>
      </div>
    </div>
  );
}

// ── Alert CTA Button ──────────────────────────────────────────────────────────

function AlertCtaButton({ sectorColorHex }: { sectorColorHex: string }) {
  const router = useRouter();
  const [user,     setUser]     = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(getAuthUser());
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <button
        disabled
        className="flex items-center justify-center gap-1.5 w-full bg-white/60 text-sm font-bold
                   py-2.5 rounded-xl cursor-wait"
        style={{ color: sectorColorHex }}
      >
        <Loader2 size={14} className="animate-spin" /> Chargement...
      </button>
    );
  }

  if (user && getAuthToken() && user.role === 'CANDIDAT') {
    return (
      <button
        onClick={() => router.push('/candidat/alertes')}
        className="flex items-center justify-center gap-1.5 w-full bg-white text-sm font-bold
                   py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
        style={{ color: sectorColorHex }}
      >
        Gérer mes alertes <ArrowRight size={13} />
      </button>
    );
  }

  if (user && getAuthToken() && user.role === 'RECRUITER') {
    return (
      <div
        className="flex items-center justify-center gap-1.5 w-full bg-white/60 text-sm font-bold
                   py-2.5 rounded-xl cursor-not-allowed opacity-70"
        style={{ color: sectorColorHex }}
        title="Réservé aux candidats"
      >
        Réservé aux candidats
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push('/auth?redirect=/candidat/alertes')}
      className="flex items-center justify-center gap-1.5 w-full bg-white text-sm font-bold
                 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
      style={{ color: sectorColorHex }}
    >
      Créer une alerte <ArrowRight size={13} />
    </button>
  );
}

// ── Main Content ──────────────────────────────────────────────────────────────

function SectorContent() {
  const params     = useParams<{ sector: string }>();
  const router     = useRouter();
  const rawSector  = params.sector ?? '';

  // FIX : normalizeSector retourne '' (pas null) si non reconnu — on gère
  // les deux cas (déjà une clé canonique, ou à normaliser).
  const sector: SectorKey | '' = (rawSector in SECTORS)
    ? (rawSector as SectorKey)
    : normalizeSector(rawSector);
  const cfg = sector ? SECTORS[sector] : undefined;

  const [offres,       setOffres]       = useState<PublicOffre[]>([]);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(1);
  const [loading,      setLoading]      = useState(true);
  const [loadingMore,  setLoadingMore]  = useState(false);
  const [hasMore,      setHasMore]      = useState(false);
  const [favorites,    setFavorites]    = useState<Set<string>>(new Set());
  const [search,       setSearch]       = useState('');
  const [contractType, setContractType] = useState('');
  const [location,     setLocation]     = useState('');

  const LIMIT = 9;

  // Redirect uniquement si, même après normalisation, le secteur reste inconnu
  useEffect(() => {
    if (rawSector && !cfg) {
      router.replace('/emploi/jobs');
    }
  }, [rawSector, cfg, router]);

  const loadOffres = useCallback(async (reset = false) => {
    if (!sector || !cfg) return;
    const p = reset ? 1 : page;
    if (reset) setLoading(true); else setLoadingMore(true);

    try {
      const res = await fetchPublicJobs({
        sector, // clé canonique — le backend la traduit vers le libellé FR exact
        search:       search       || undefined,
        location:     location     || undefined,
        contractType: contractType || undefined,
        page:  p,
        limit: LIMIT,
      });

      const list = res.offres?.length
        ? res.offres
        : MOCK_OFFRES.filter((o) => normalizeSector(o.sector) === sector);

      if (reset) {
        setOffres(list);
        setTotal(res.total || list.length);
      } else {
        setOffres((prev) => [...prev, ...list]);
        setTotal(res.total);
      }
      setHasMore(p * LIMIT < (res.total || 0));
      if (!reset) setPage(p + 1);
    } catch {
      if (reset) {
        const mock = MOCK_OFFRES.filter((o) => normalizeSector(o.sector) === sector);
        setOffres(mock);
        setTotal(mock.length);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [sector, cfg, search, location, contractType, page]);

  useEffect(() => {
    setPage(1);
    loadOffres(true);
  }, [sector, search, location, contractType]); // eslint-disable-line

  function toggleFavorite(id: string) {
    setFavorites((f) => {
      const next = new Set(f);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function resetFilters() {
    setSearch('');
    setContractType('');
    setLocation('');
  }

  if (!cfg) return null;

  const hasFilters = !!search || !!contractType || !!location;
  const otherSectors = OTHER_SECTORS.filter((s) => s.key !== sector).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO SECTEUR ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ minHeight: 280 }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${cfg.banner})` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${cfg.colorHex}DD 0%, #1E2A3A99 60%, #1E2A3Acc 100%)` }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
          <nav className="flex items-center gap-2 text-xs text-white/60 mb-6">
            <Link href="/emploi" className="hover:text-white transition-colors">Emploi</Link>
            <ChevronRight size={12} />
            <Link href="/emploi/jobs" className="hover:text-white transition-colors">Offres</Link>
            <ChevronRight size={12} />
            <span className="text-white font-medium">{cfg.label}</span>
          </nav>

          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0
                            bg-white/20 backdrop-blur-sm border border-white/30 text-white">
              {cfg.iconLg}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  {cfg.label}
                </h1>
                {!loading && (
                  <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-bold
                                   px-3 py-1 rounded-full border border-white/30">
                    {total} offre{total > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-white/80 text-sm leading-relaxed max-w-2xl">
                {cfg.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {cfg.roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => setSearch(r)}
                    className="text-xs text-white/90 bg-white/15 hover:bg-white/25
                               border border-white/30 px-3 py-1 rounded-full transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENU ──────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

          <div className="space-y-4">

            <FilterBar
              search={search}             setSearch={setSearch}
              contractType={contractType} setContractType={setContractType}
              location={location}         setLocation={setLocation}
              total={total} loading={loading}
              onReset={resetFilters}      hasFilters={hasFilters}
            />

            {hasFilters && (
              <div className="flex flex-wrap gap-2">
                {[
                  search       && { key: 'search',       label: search },
                  contractType && { key: 'contractType', label: contractType },
                  location     && { key: 'location',     label: location },
                ].filter(Boolean).map((f: any) => (
                  <span key={f.key}
                    className="flex items-center gap-1.5 bg-white border px-2.5 py-1 rounded-full
                               text-xs font-medium"
                    style={{ borderColor: `${cfg.colorHex}40`, color: cfg.colorHex }}
                  >
                    {f.label}
                    <button
                      onClick={() => {
                        if (f.key === 'search')       setSearch('');
                        if (f.key === 'contractType') setContractType('');
                        if (f.key === 'location')     setLocation('');
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
                {Array.from({ length: 6 }).map((_, i) => <JobSkeleton key={i} />)}
              </div>
            ) : offres.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 py-20 flex flex-col
                              items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                     style={{ backgroundColor: cfg.bgHex, color: cfg.colorHex }}>
                  {cfg.iconLg}
                </div>
                <p className="font-semibold text-gray-700">Aucune offre trouvée</p>
                <p className="text-sm text-gray-400 mt-1">
                  Essayez de modifier vos critères de recherche
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-sm font-semibold hover:underline"
                  style={{ color: cfg.colorHex }}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3">
                  {offres.map((offre) => (
                    <JobCard
                      key={offre.id}
                      offre={offre}
                      sectorConfig={cfg}
                      isFav={favorites.has(offre.id)}
                      onFavorite={toggleFavorite}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => { setPage((p) => p + 1); loadOffres(false); }}
                      disabled={loadingMore}
                      className="flex items-center gap-2 text-white font-semibold px-8 py-3.5
                                 rounded-xl transition-all disabled:opacity-60 text-sm shadow-lg"
                      style={{ backgroundColor: cfg.colorHex }}
                    >
                      {loadingMore
                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Chargement...</>
                        : `Voir plus d'offres`
                      }
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── SIDEBAR ──────────────────────────────────────────────── */}
          <div className="space-y-4">

            <div className="rounded-2xl p-5 text-white" style={{ background: `linear-gradient(135deg, ${cfg.colorHex} 0%, #1E2A3A 100%)` }}>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                {cfg.icon}
              </div>
              <p className="font-bold text-base mb-1">Alerte emploi {cfg.label}</p>
              <p className="text-white/75 text-xs leading-relaxed mb-4">
                Recevez les nouvelles offres {cfg.labelPlural} directement par email.
              </p>
              <AlertCtaButton sectorColorHex={cfg.colorHex} />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="font-bold text-[#1E2A3A] text-sm mb-3">Autres secteurs</p>
              <div className="space-y-1">
                {otherSectors.map((s) => (
                  <Link
                    key={s.key}
                    href={`/emploi/metiers/${s.key}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50
                               transition-colors group"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}>
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-[#E8622A]
                                   transition-colors truncate">
                        {s.label}
                      </p>
                    </div>
                    <ChevronRight size={13} className="text-gray-300 group-hover:text-[#E8622A] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="font-bold text-[#1E2A3A] text-sm mb-3">Conseils pour {cfg.label}</p>
              <div className="space-y-2">
                {[
                  `Préparez votre entretien en ${cfg.label}`,
                  `CV parfait pour le secteur ${cfg.label}`,
                  'Salaires & négociation en 2024',
                ].map((tip) => (
                  <Link
                    key={tip}
                    href="/emploi/conseils"
                    className="flex items-start gap-2 p-2 rounded-xl hover:bg-gray-50
                               transition-colors group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: cfg.colorHex }} />
                    <p className="text-xs text-gray-600 group-hover:text-[#1E2A3A] transition-colors
                                  leading-relaxed">
                      {tip}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/emploi/jobs"
              className="flex items-center justify-center gap-2 w-full bg-[#1E2A3A]
                         hover:bg-[#2d3f55] text-white text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              <Building2 size={15} /> Toutes les offres <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

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
