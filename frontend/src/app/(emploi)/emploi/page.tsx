'use client';
// src/app/(emploi)/emploi/page.tsx

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, MapPin, FileText, Clock, ArrowRight, Building2,
  ChevronRight, Star, Wifi, AlertCircle, Loader2, LayoutDashboard,
} from 'lucide-react';
import {
  fetchPublicJobs, fetchFeaturedCompanies, MOCK_OFFRES, MOCK_COMPANIES,
} from '@/services/emploi-public.service';
import type { PublicOffre, PublicEtablissement } from '@/services/emploi-public.service';
import { SECTOR_DEFS, normalizeSector, type SectorKey } from '@/lib/sectors';
import { SECTOR_ICONS, SECTOR_HOVER_COLORS, SECTOR_BG_IMAGE, sectorIcon, sectorColorClasses } from '@/components/emploi/public/sectorVisuals';
import { timeAgoPublic } from '@/utils/date';
import { useAuthUser } from '@/hooks/useAuthUser';

// ─────────────────────────────────────────────────────────────────────────────
// RECRUITER CTA BUTTON — réécrit sur useAuthUser (fini le getAuthUser/hydrated dupliqués)
// ─────────────────────────────────────────────────────────────────────────────

function RecruiterCtaButton() {
  const router = useRouter();
  const { user, hydrated, isCandidat, isRecruiter } = useAuthUser();

  if (!hydrated) {
    return (
      <button disabled className="inline-flex items-center gap-2 bg-white/60 text-[#E8622A]/60 font-bold px-8 py-3.5 rounded-xl text-sm cursor-wait">
        <Loader2 size={15} className="animate-spin" /> Chargement...
      </button>
    );
  }

  if (isRecruiter) {
    return (
      <button
        onClick={() => router.push('/recruteur/vitrine')}
        className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm shadow-lg shadow-black/10"
      >
        <LayoutDashboard size={15} /> Accéder à ma vitrine <ArrowRight size={15} />
      </button>
    );
  }

  if (isCandidat) {
    return (
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => router.push('/auth')}
          className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm shadow-lg shadow-black/10"
        >
          Créer un compte recruteur <ArrowRight size={15} />
        </button>
        <p className="text-white/60 text-xs">Connecté en tant que candidat · Un compte recruteur est requis</p>
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push('/auth?redirect=/recruteur/vitrine')}
      className="inline-flex items-center gap-2 bg-white text-[#E8622A] font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-sm shadow-lg shadow-black/10"
    >
      Créer votre vitrine entreprise <ArrowRight size={15} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTEURS — dérivés de la source unique src/lib/sectors.ts + visuels partagés
// ─────────────────────────────────────────────────────────────────────────────

const METIER_DESCRIPTIONS: Record<SectorKey, string> = {
  hotel: 'Réception, direction, housekeeping...',
  restaurant: 'Chef, cuisine, salle, bar...',
  transport: "Pilote, agent d'escale, hôtesse...",
  travel: 'Conseiller voyage, TO, tourisme...',
  tech: 'Revenue, yield, digital, dev...',
  events: 'Congrès, séminaires, incentives...',
  spa: 'Praticien(ne) spa, bien-être...',
  entertainment: 'Animation, régie, loisirs...',
};

const METIERS = SECTOR_DEFS.map((s) => ({
  label: s.label,
  icon: SECTOR_ICONS[s.key],
  color: SECTOR_HOVER_COLORS[s.key],
  sector: s.key,
  description: METIER_DESCRIPTIONS[s.key],
  bg: SECTOR_BG_IMAGE[s.key],
}));

const CONTRACT_COLOR: Record<string, string> = {
  CDI: 'bg-blue-50 text-blue-700 border-blue-100',
  CDD: 'bg-purple-50 text-purple-700 border-purple-100',
  'CDD Saisonnier': 'bg-orange-50 text-orange-700 border-orange-100',
  Alternance: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  Stage: 'bg-teal-50 text-teal-700 border-teal-100',
  Freelance: 'bg-pink-50 text-pink-700 border-pink-100',
};

const POPULAR_SEARCHES = ['Réceptionniste', 'Revenue Manager', 'Chef de cuisine', 'Yield Manager'];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function CompanyCard({ company }: { company: PublicEtablissement }) {
  const sectorKey = normalizeSector(company.sector);
  const bg = company.vitrine?.logoUrl ? undefined : (sectorKey ? SECTOR_BG_IMAGE[sectorKey] : undefined);

  return (
    <Link href={`/emploi/entreprises/${company.id}`} className="group relative overflow-hidden rounded-2xl aspect-[4/3] block">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 bg-gray-200"
        style={bg || company.vitrine?.bannerUrl ? { backgroundImage: `url(${company.vitrine?.bannerUrl ?? bg})` } : undefined}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2 ${sectorColorClasses(company.sector)} shadow-lg`}>
          {company.logo
            ? <img src={company.logo} alt={company.name} className="w-full h-full object-contain rounded-lg" />
            : sectorIcon(company.sector)}
        </div>
        <h3 className="text-white font-bold text-base leading-tight">{company.name}</h3>
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
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${metier.color} group-hover:scale-110 transition-transform duration-200`}>
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
  const router = useRouter();
  const ctColor = CONTRACT_COLOR[offre.contractType] ?? 'bg-gray-50 text-gray-600 border-gray-100';
  const isNew = Date.now() - new Date(offre.publishedAt).getTime() < 24 * 3_600_000;

  return (
    <button
      onClick={() => router.push(`/emploi/jobs/${offre.id}`)}
      className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100
                 hover:border-[#E8622A]/30 hover:shadow-md transition-all duration-200 group text-left"
    >
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${sectorColorClasses(offre.sector)}`}>
        {sectorIcon(offre.sector)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-[#1E2A3A] text-sm group-hover:text-[#E8622A] transition-colors truncate">
            {offre.title}
          </h3>
          {isNew && (
            <span className="flex-shrink-0 text-[10px] font-bold text-[#E8622A] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
              Nouveau
            </span>
          )}
          {offre.isPremium && (
            <span className="flex-shrink-0 flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              <Star size={8} fill="currentColor" /> Premium
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-0.5 truncate">{offre.companyName}</p>

        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ctColor}`}>{offre.contractType}</span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={10} /> {offre.location}
          </span>
          {offre.remote && offre.remote !== 'none' && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <Wifi size={9} /> {offre.remote === 'full' ? 'Remote' : 'Hybride'}
            </span>
          )}
          {offre.salaryMin && (
            <span className="text-xs text-gray-400">
              {Math.round(offre.salaryMin / 1000)}–{Math.round((offre.salaryMax ?? offre.salaryMin) / 1000)}k€
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
            <Clock size={10} /> {timeAgoPublic(offre.publishedAt)}
          </span>
        </div>
      </div>

      <ChevronRight size={15} className="flex-shrink-0 text-gray-300 group-hover:text-[#E8622A] group-hover:translate-x-0.5 transition-all" />
    </button>
  );
}

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

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [contractType, setContractType] = useState('');

  const [offres, setOffres] = useState<PublicOffre[]>([]);
  const [companies, setCompanies] = useState<PublicEtablissement[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingComp, setLoadingComp] = useState(true);
  const [jobsError, setJobsError] = useState(false);
  const [compError, setCompError] = useState(false);
  const [totalJobs, setTotalJobs] = useState<number | null>(null);

  useEffect(() => {
    setLoadingJobs(true);
    fetchPublicJobs({ limit: 6, page: 1 })
      .then((res) => {
        // FIX : on n'affiche PLUS de mock quand l'appel réussit, même si
        // le tableau est vide — un tableau vide légitime (aucune offre
        // active en base) doit se voir tel quel, sinon on masque un vrai
        // problème de données derrière un faux contenu de démo.
        // eslint-disable-next-line no-console
        console.info('[EmploiHomePage] /jobs OK — total:', res.total, 'offres reçues:', res.offres?.length ?? 0);
        setOffres(res.offres ?? []);
        setTotalJobs(res.total ?? null);
        setJobsError(false);
      })
      .catch((err) => {
        // FIX : le mock ne doit intervenir QUE sur un vrai échec réseau/API,
        // et on logue l'erreur réelle pour pouvoir la diagnostiquer (avant,
        // l'erreur était totalement avalée par le .catch(() => {...})).
        // eslint-disable-next-line no-console
        console.error('[EmploiHomePage] /jobs a échoué —', err?.response?.status, err?.response?.data ?? err?.message);
        setOffres(MOCK_OFFRES);
        setJobsError(true);
      })
      .finally(() => setLoadingJobs(false));
  }, []);

  useEffect(() => {
    setLoadingComp(true);
    fetchFeaturedCompanies()
      .then((list) => {
        console.info('[EmploiHomePage] /entreprises OK — reçues:', list?.length ?? 0);
        setCompanies(list ?? []);
        setCompError(false);
      })
      .catch((err) => {
        console.error('[EmploiHomePage] /entreprises a échoué —', err?.response?.status, err?.response?.data ?? err?.message);
        setCompanies(MOCK_COMPANIES);
        setCompError(true);
      })
      .finally(() => setLoadingComp(false));
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (location.trim()) params.set('location', location.trim());
    if (contractType) params.set('contractType', contractType);
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
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80)' }} />
        <div className="absolute inset-0 bg-[#1E2A3A]/70" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 text-center">
          {totalJobs !== null && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4">
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
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#E8622A] transition-colors">
                  <Building2 size={15} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text" placeholder="Métier, poste..." value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                  />
                  {search && (
                    <button type="button" onClick={() => setSearch('')} className="text-gray-300 hover:text-gray-500 text-lg leading-none" aria-label="Effacer">×</button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Où ?</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#E8622A] transition-colors">
                  <MapPin size={15} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text" placeholder="Ville, région..." value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                  />
                  {location && (
                    <button type="button" onClick={() => setLocation('')} className="text-gray-300 hover:text-gray-500 text-lg leading-none" aria-label="Effacer">×</button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Contrat</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#E8622A] transition-colors">
                  <FileText size={15} className="text-gray-400 flex-shrink-0" />
                  <select
                    value={contractType} onChange={(e) => setContractType(e.target.value)}
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

            <button type="submit" className="mt-4 w-full flex items-center justify-center gap-2 bg-[#E8622A] hover:bg-[#d4561f] active:scale-[0.99] text-white font-semibold py-3.5 rounded-xl transition-all text-sm">
              <Search size={15} /> Rechercher des offres
            </button>

            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">Populaires :</span>
              {POPULAR_SEARCHES.map((q) => (
                <button key={q} type="button" onClick={() => handlePopularSearch(q)} className="text-xs text-[#E8622A] hover:underline font-medium">
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
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">Découvrez les entreprises qui recrutent</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Explorez les marques employeurs du secteur touristique
              {compError && (
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

        {loadingComp ? (
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
            {companies.map((c) => <CompanyCard key={c.id} company={c} />)}
          </div>
        )}

        <div className="flex justify-center mt-6 sm:hidden">
          <Link href="/emploi/entreprises" className="flex items-center gap-2 border border-[#E8622A] text-[#E8622A] font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-[#E8622A] hover:text-white transition-colors">
            Voir toutes les entreprises <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── MÉTIERS ───────────────────────────────────────────────────── */}
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

      {/* ── LATEST JOBS ───────────────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2A3A]">Les dernières opportunités à saisir</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Postes fraîchement publiés par nos partenaires
              {jobsError && (
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

        {loadingJobs ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <JobSkeleton key={i} />)}
          </div>
        ) : offres.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-2xl border border-gray-100">
            <Search size={28} className="text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-600">
              {jobsError ? 'Impossible de charger les offres pour le moment' : 'Aucune offre active pour le moment'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {offres.map((offre) => <JobCard key={offre.id} offre={offre} />)}
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

      {/* ── RECRUITER CTA ─────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #1E2A3A 0%, #E8622A 100%)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 size={28} className="text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">Vous êtes un recruteur ?</h2>
          <p className="text-white/75 text-sm leading-relaxed mb-8 max-w-md mx-auto">
            Valorisez votre marque employeur et trouvez les meilleurs talents du tourisme grâce à notre plateforme dédiée.
          </p>
          <RecruiterCtaButton />
        </div>
      </section>
    </div>
  );
}
