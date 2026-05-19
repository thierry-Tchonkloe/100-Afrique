'use client';
// src/app/(emploi)/emploi/entreprises/page.tsx

import { useState, useEffect, useCallback, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search, SlidersHorizontal, X, ChevronDown, MapPin,
  Briefcase, Users, TrendingUp, Star, Heart, ArrowRight,
  LayoutGrid, List, Hotel, Utensils, Plane, Monitor,
  Calendar, Building2, Globe, RotateCcw, Check,
  Sparkles, Award, Zap,
} from 'lucide-react';
import {
  fetchPublicJobs,
  MOCK_COMPANIES,
  type PublicEtablissement,
} from '@/services/emploi-public.service';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

interface Company extends PublicEtablissement {
  description?: string;
  tags?: string[];
  employeeCount?: string;
  isFeatured?: boolean;
  isPremium?: boolean;
  rating?: number;
  growth?: string;
  coverUrl?: string;
  logoColor?: string;
}

type SortKey = 'pertinence' | 'offres' | 'alphabetique' | 'recent';
type ViewMode = 'grid' | 'list';

const SECTORS = [
  'Tous les secteurs',
  'Hôtellerie',
  'Restauration',
  'Aérien & Transport',
  'Agence de voyage',
  'Tech & Digital',
  'MICE & Événementiel',
  'Spa & Bien-être',
  'Croisières',
];

const COMPANY_SIZES = [
  'Toutes tailles',
  'Startup (< 50)',
  'PME (50–250)',
  'ETI (250–1 000)',
  'Grand groupe (> 1 000)',
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'pertinence',  label: 'Pertinence'        },
  { key: 'offres',      label: 'Offres actives'     },
  { key: 'alphabetique',label: 'A → Z'              },
  { key: 'recent',      label: 'Récemment actif'    },
];

const SECTOR_ICONS: Record<string, React.ReactNode> = {
  'Hôtellerie':          <Hotel    size={16} />,
  'Restauration':        <Utensils size={16} />,
  'Aérien & Transport':  <Plane    size={16} />,
  'Agence de voyage':    <Briefcase size={16} />,
  'Tech & Digital':      <Monitor  size={16} />,
  'MICE & Événementiel': <Calendar size={16} />,
  'Spa & Bien-être':     <Star     size={16} />,
  'Croisières':          <Globe    size={16} />,
  hotel:                 <Hotel    size={16} />,
  restaurant:            <Utensils size={16} />,
  transport:             <Plane    size={16} />,
  travel:                <Briefcase size={16} />,
  tech:                  <Monitor  size={16} />,
  events:                <Calendar size={16} />,
};

const SECTOR_COLORS: Record<string, { bg: string; text: string; light: string }> = {
  hotel:                 { bg:'bg-blue-100',   text:'text-blue-700',   light:'bg-blue-50'   },
  'Hôtellerie':          { bg:'bg-blue-100',   text:'text-blue-700',   light:'bg-blue-50'   },
  restaurant:            { bg:'bg-orange-100', text:'text-orange-700', light:'bg-orange-50' },
  'Restauration':        { bg:'bg-orange-100', text:'text-orange-700', light:'bg-orange-50' },
  transport:             { bg:'bg-sky-100',    text:'text-sky-700',    light:'bg-sky-50'    },
  'Aérien & Transport':  { bg:'bg-sky-100',    text:'text-sky-700',    light:'bg-sky-50'    },
  travel:                { bg:'bg-amber-100',  text:'text-amber-700',  light:'bg-amber-50'  },
  'Agence de voyage':    { bg:'bg-amber-100',  text:'text-amber-700',  light:'bg-amber-50'  },
  tech:                  { bg:'bg-green-100',  text:'text-green-700',  light:'bg-green-50'  },
  'Tech & Digital':      { bg:'bg-green-100',  text:'text-green-700',  light:'bg-green-50'  },
  events:                { bg:'bg-purple-100', text:'text-purple-700', light:'bg-purple-50' },
  'MICE & Événementiel': { bg:'bg-purple-100', text:'text-purple-700', light:'bg-purple-50' },
};

// Rich mock data enriching the base companies
const COMPANY_ENRICHMENTS: Record<string, Partial<Company>> = {
  'Luxury Hotels Group': {
    description: 'Chaîne hôtelière de prestige avec 45 établissements en Europe. Excellence, innovation et art de vivre à la française.',
    tags: ['Great Place to Work', 'Éco-responsable'],
    employeeCount: '2 000+', isPremium: true, isFeatured: true, rating: 4.8, growth: '+18%',
    coverUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
    logoColor: 'bg-blue-600',
  },
  'Voyages Prestige': {
    description: 'Agence de voyages sur-mesure spécialisée dans le luxe et l\'aventure. Destinations exclusives, service 5 étoiles.',
    tags: ['Label Diversité', 'Formation certifiante'],
    employeeCount: '150–300', isPremium: false, isFeatured: true, rating: 4.6, growth: '+12%',
    coverUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    logoColor: 'bg-amber-500',
  },
  'Gastronomie & Co': {
    description: 'Groupe de restauration gastronomique regroupant 30 restaurants étoilés. La passion du goût et de l\'excellence culinaire.',
    tags: ['Étoilé Michelin', 'Engagement durable'],
    employeeCount: '500–1 000', isPremium: true, isFeatured: false, rating: 4.7, growth: '+25%',
    coverUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    logoColor: 'bg-orange-600',
  },
  'Events International': {
    description: 'Leader européen de l\'organisation d\'événements MICE. Congrès, incentives, séminaires et gala dans le monde entier.',
    tags: ['ISO 20121', 'Parité exemplaire'],
    employeeCount: '100–250', isPremium: false, isFeatured: false, rating: 4.4, growth: '+8%',
    coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    logoColor: 'bg-purple-600',
  },
  'TravelTech Solutions': {
    description: 'Scale-up tech du tourisme. Nous développons les plateformes numériques qui révolutionnent l\'industrie des voyages.',
    tags: ['Remote friendly', 'Stock options'],
    employeeCount: '50–150', isPremium: false, isFeatured: true, rating: 4.9, growth: '+45%',
    coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    logoColor: 'bg-green-600',
  },
  'Sky Airlines': {
    description: 'Compagnie aérienne régionale en forte croissance. Flotte moderne, culture bienveillante et opportunités d\'évolution.',
    tags: ['Mobilité internationale', 'Avantages vol'],
    employeeCount: '1 000–3 000', isPremium: false, isFeatured: false, rating: 4.3, growth: '+10%',
    coverUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    logoColor: 'bg-sky-600',
  },
};

// Featured sectors for the filter carousel
const FEATURED_SECTORS = [
  { key: 'hotel',      label: 'Hôtellerie',    icon: <Hotel    size={20} />, color: 'text-blue-600   bg-blue-50   border-blue-100'   },
  { key: 'restaurant', label: 'Restauration',   icon: <Utensils size={20} />, color: 'text-orange-600 bg-orange-50 border-orange-100' },
  { key: 'transport',  label: 'Aérien',         icon: <Plane    size={20} />, color: 'text-sky-600    bg-sky-50    border-sky-100'    },
  { key: 'travel',     label: 'Voyage',         icon: <Briefcase size={20}/>, color: 'text-amber-600  bg-amber-50  border-amber-100'  },
  { key: 'tech',       label: 'Tech & Digital', icon: <Monitor  size={20} />, color: 'text-green-600  bg-green-50  border-green-100'  },
  { key: 'events',     label: 'MICE',           icon: <Calendar size={20} />, color: 'text-purple-600 bg-purple-50 border-purple-100' },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function enrichCompany(c: PublicEtablissement): Company {
  const e = COMPANY_ENRICHMENTS[c.name] ?? {};
  return { ...c, ...e };
}

function getSectorColor(sector: string) {
  return SECTOR_COLORS[sector] ?? { bg: 'bg-gray-100', text: 'text-gray-700', light: 'bg-gray-50' };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPANY CARD — GRID VIEW
// ─────────────────────────────────────────────────────────────────────────────

function CompanyCardGrid({ company, isFav, onFav }: {
  company: Company; isFav: boolean; onFav: (id: string) => void;
}) {
  const sc = getSectorColor(company.sector);
  const icon = SECTOR_ICONS[company.sector] ?? <Building2 size={16} />;
  const enriched = COMPANY_ENRICHMENTS[company.name];

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden
                    hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col">
      {/* Cover */}
      <div className="relative h-36 overflow-hidden flex-shrink-0">
        {enriched?.coverUrl ? (
          <img src={enriched.coverUrl} alt={company.name}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className={`w-full h-full ${sc.light} flex items-center justify-center`}>
            <div className={`text-6xl opacity-10 ${sc.text}`}><Building2 size={64} /></div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {company.isPremium && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600
                             bg-amber-50/95 border border-amber-200 px-2 py-0.5 rounded-full backdrop-blur-sm">
              <Star size={9} fill="currentColor" /> Premium
            </span>
          )}
          {company.isFeatured && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#E8622A]
                             bg-white/95 border border-orange-100 px-2 py-0.5 rounded-full backdrop-blur-sm">
              <Zap size={9} fill="currentColor" /> Recrute activement
            </span>
          )}
        </div>

        {/* Fav button */}
        <button onClick={() => onFav(company.id)}
                className="absolute top-3 right-3 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full
                           flex items-center justify-center hover:bg-white transition shadow-sm">
          <Heart size={13} className={isFav ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
        </button>

        {/* Logo */}
        <div className={`absolute bottom-0 left-4 translate-y-1/2 w-12 h-12 rounded-xl shadow-lg
                         flex items-center justify-center border-2 border-white
                         ${enriched?.logoColor ?? 'bg-[#1E2A3A]'} z-10`}>
          <div className="text-white">{icon}</div>
        </div>
      </div>

      {/* Body */}
      <div className="pt-8 pb-5 px-4 flex-1 flex flex-col">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-[#1E2A3A] text-sm leading-tight group-hover:text-[#E8622A] transition-colors">
                {company.name}
              </h3>
              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${sc.bg} ${sc.text}`}>
                {company.sector}
              </span>
            </div>
            {company.rating && (
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-gray-700">{company.rating}</span>
              </div>
            )}
          </div>

          {enriched?.description && (
            <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
              {enriched.description}
            </p>
          )}
        </div>

        {/* Tags */}
        {enriched?.tags && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {enriched.tags.map((t) => (
              <span key={t} className="text-[10px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50 mt-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={11} /> {company.city}
          </div>
          <div className="flex items-center gap-2">
            {company.growth && (
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                {company.growth}
              </span>
            )}
            <span className="text-xs font-bold text-[#E8622A]">
              {company.offresCount} offre{company.offresCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link href={`/emploi/entreprises/${company.id}`}
            className="mx-4 mb-4 flex items-center justify-center gap-2 text-xs font-semibold
                       text-[#E8622A] border border-[#E8622A]/30 py-2.5 rounded-xl
                       hover:bg-[#E8622A] hover:text-white transition-all duration-200 group-hover:border-[#E8622A]">
        Voir la vitrine <ArrowRight size={13} />
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPANY CARD — LIST VIEW
// ─────────────────────────────────────────────────────────────────────────────

function CompanyCardList({ company, isFav, onFav }: {
  company: Company; isFav: boolean; onFav: (id: string) => void;
}) {
  const sc = getSectorColor(company.sector);
  const icon = SECTOR_ICONS[company.sector] ?? <Building2 size={18} />;
  const enriched = COMPANY_ENRICHMENTS[company.name];

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:border-gray-200
                    transition-all duration-200 overflow-hidden">
      <div className="flex gap-0">
        {/* Left color bar + logo */}
        <div className={`w-1.5 flex-shrink-0 ${enriched?.logoColor?.replace('bg-', 'bg-') ?? 'bg-[#E8622A]'}`} />

        <div className="flex items-center gap-4 p-4 flex-1 min-w-0">
          {/* Logo */}
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100
                           shadow-sm ${enriched?.logoColor ?? 'bg-[#1E2A3A]'}`}>
            <div className="text-white">{icon}</div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-[#1E2A3A] text-sm group-hover:text-[#E8622A] transition-colors">
                {company.name}
              </h3>
              {company.isPremium && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  ⭐ Premium
                </span>
              )}
              {company.isFeatured && (
                <span className="text-[10px] font-bold text-[#E8622A] bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                  ⚡ Recrute
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                {company.sector}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin size={10} /> {company.city}
              </span>
              {enriched?.employeeCount && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Users size={10} /> {enriched.employeeCount}
                </span>
              )}
              {company.rating && (
                <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                  <Star size={10} className="text-amber-400 fill-amber-400" /> {company.rating}
                </span>
              )}
            </div>

            {enriched?.description && (
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-1">
                {enriched.description}
              </p>
            )}

            {enriched?.tags && (
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {enriched.tags.map((t) => (
                  <span key={t} className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              {company.growth && (
                <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded-full">
                  {company.growth}
                </span>
              )}
              <span className="text-sm font-bold text-[#E8622A]">
                {company.offresCount} offre{company.offresCount > 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => onFav(company.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition">
                <Heart size={14} className={isFav ? 'text-red-500 fill-red-500' : 'text-gray-300'} />
              </button>
              <Link href={`/emploi/entreprises/${company.id}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#E8622A]
                               border border-[#E8622A]/30 px-3 py-1.5 rounded-xl
                               hover:bg-[#E8622A] hover:text-white transition-all duration-200">
                Voir la vitrine <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────

interface FilterState {
  sectors: string[];
  sizes: string[];
  tags: string[];
  hasOffres: boolean;
  isPremium: boolean;
  isRecruiting: boolean;
  minRating: number | null;
}

const EMPTY_FILTERS: FilterState = {
  sectors: [], sizes: [], tags: [],
  hasOffres: false, isPremium: false, isRecruiting: false, minRating: null,
};

function FilterSidebar({ filters, setFilters, total, onClose }: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  total: number;
  onClose?: () => void;
}) {
  const hasActive = filters.sectors.length || filters.sizes.length || filters.hasOffres
    || filters.isPremium || filters.isRecruiting || filters.minRating;

  function toggleArr<K extends 'sectors' | 'sizes'>(key: K, val: string) {
    const arr = filters[key] as string[];
    setFilters({ ...filters, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] });
  }

  return (
    <aside className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-gray-500" />
          <span className="font-bold text-gray-800 text-sm">Filtres</span>
          {hasActive && (
            <span className="w-5 h-5 bg-[#E8622A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {[filters.sectors.length, filters.sizes.length, +filters.hasOffres, +filters.isPremium, +filters.isRecruiting, +(filters.minRating !== null)].reduce((a,b)=>a+b,0)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActive && (
            <button onClick={() => setFilters(EMPTY_FILTERS)}
                    className="text-[11px] font-semibold text-[#E8622A] hover:underline flex items-center gap-1">
              <RotateCcw size={10} /> Tout effacer
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-5">

        {/* Quick filters */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Statut</p>
          {[
            { key:'isRecruiting', label:'Recrute activement', icon:<Zap      size={12} className="text-[#E8622A]" /> },
            { key:'isPremium',    label:'Entreprise Premium', icon:<Star     size={12} className="text-amber-500" /> },
            { key:'hasOffres',    label:'Avec offres ouvertes',icon:<Briefcase size={12} className="text-blue-500" /> },
          ].map(({ key, label, icon }) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer py-1 group">
              <div
                onClick={() => setFilters({ ...filters, [key]: !filters[key as keyof FilterState] })}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition
                  ${filters[key as keyof FilterState]
                    ? 'bg-[#E8622A] border-[#E8622A]'
                    : 'border-gray-300 group-hover:border-[#E8622A]'}`}
              >
                {filters[key as keyof FilterState] && <Check size={9} className="text-white" strokeWidth={3} />}
              </div>
              <span className="flex items-center gap-1.5 text-sm text-gray-600 group-hover:text-gray-900">
                {icon} {label}
              </span>
            </label>
          ))}
        </div>

        <div className="h-px bg-gray-100" />

        {/* Sector filter */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Secteur</p>
          {SECTORS.slice(1).map((s) => (
            <label key={s} className="flex items-center gap-2.5 cursor-pointer py-0.5 group">
              <div
                onClick={() => toggleArr('sectors', s)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition
                  ${filters.sectors.includes(s)
                    ? 'bg-[#E8622A] border-[#E8622A]'
                    : 'border-gray-300 group-hover:border-[#E8622A]'}`}
              >
                {filters.sectors.includes(s) && <Check size={9} className="text-white" strokeWidth={3} />}
              </div>
              <span className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-gray-900">
                <span className="text-gray-400">{SECTOR_ICONS[s] ?? <Building2 size={12} />}</span>
                {s}
              </span>
            </label>
          ))}
        </div>

        <div className="h-px bg-gray-100" />

        {/* Size filter */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Taille</p>
          {COMPANY_SIZES.slice(1).map((s) => (
            <label key={s} className="flex items-center gap-2.5 cursor-pointer py-0.5 group">
              <div
                onClick={() => toggleArr('sizes', s)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition
                  ${filters.sizes.includes(s)
                    ? 'bg-[#E8622A] border-[#E8622A]'
                    : 'border-gray-300 group-hover:border-[#E8622A]'}`}
              >
                {filters.sizes.includes(s) && <Check size={9} className="text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-900">{s}</span>
            </label>
          ))}
        </div>

        <div className="h-px bg-gray-100" />

        {/* Rating filter */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Note minimale</p>
          <div className="flex gap-1.5 flex-wrap">
            {[null, 4, 4.5, 4.8].map((r) => (
              <button
                key={String(r)}
                onClick={() => setFilters({ ...filters, minRating: r })}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition ${
                  filters.minRating === r
                    ? 'bg-[#E8622A] border-[#E8622A] text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {r === null ? 'Toutes' : `≥ ${r} ⭐`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE CONTENT
// ─────────────────────────────────────────────────────────────────────────────

function EntreprisesContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [companies,      setCompanies]      = useState<Company[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [search,         setSearch]         = useState(searchParams.get('search') ?? '');
  const [location,       setLocation]       = useState(searchParams.get('location') ?? '');
  const [activeSector,   setActiveSector]   = useState(searchParams.get('sector') ?? '');
  const [sort,           setSort]           = useState<SortKey>('pertinence');
  const [viewMode,       setViewMode]       = useState<ViewMode>('grid');
  const [filters,        setFilters]        = useState<FilterState>(EMPTY_FILTERS);
  const [favorites,      setFavorites]      = useState<Set<string>>(new Set());
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Load companies
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetchPublicJobs({ limit: 50 });
        const offres = res.offres;

        // Group by company name
        const map = new Map<string, Company>();
        for (const o of offres) {
          const key = o.companyName;
          if (!map.has(key)) {
            map.set(key, enrichCompany({
              id: o.id, name: o.companyName, sector: o.sector,
              city: o.location.split(' ')[0], offresCount: 0,
            }));
          }
          map.get(key)!.offresCount++;
        }
        const list = [...map.values()];
        setCompanies(list.length ? list : MOCK_COMPANIES.map(enrichCompany));
      } catch {
        setCompanies(MOCK_COMPANIES.map(enrichCompany));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter + sort
  const processed = useMemo(() => {
    let list = [...companies];

    // Search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        COMPANY_ENRICHMENTS[c.name]?.description?.toLowerCase().includes(q)
      );
    }

    // Location
    if (location) {
      list = list.filter((c) => c.city.toLowerCase().includes(location.toLowerCase()));
    }

    // Sector carousel filter
    if (activeSector) {
      list = list.filter((c) => c.sector.toLowerCase().includes(activeSector.toLowerCase())
        || c.sector === activeSector);
    }

    // Sidebar filters
    if (filters.sectors.length) {
      list = list.filter((c) => filters.sectors.some((s) =>
        c.sector.toLowerCase().includes(s.toLowerCase()) || c.sector === s));
    }
    if (filters.hasOffres)    list = list.filter((c) => c.offresCount > 0);
    if (filters.isPremium)    list = list.filter((c) => COMPANY_ENRICHMENTS[c.name]?.isPremium);
    if (filters.isRecruiting) list = list.filter((c) => COMPANY_ENRICHMENTS[c.name]?.isFeatured);
    if (filters.minRating !== null) {
      list = list.filter((c) => (COMPANY_ENRICHMENTS[c.name]?.rating ?? 0) >= (filters.minRating!));
    }

    // Sort
    if (sort === 'offres')       list.sort((a, b) => b.offresCount - a.offresCount);
    if (sort === 'alphabetique') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'pertinence') {
      list.sort((a, b) => {
        const ea = COMPANY_ENRICHMENTS[a.name]; const eb = COMPANY_ENRICHMENTS[b.name];
        if (eb?.isPremium && !ea?.isPremium) return 1;
        if (ea?.isPremium && !eb?.isPremium) return -1;
        return b.offresCount - a.offresCount;
      });
    }

    return list;
  }, [companies, search, location, activeSector, sort, filters]);

  function toggleFav(id: string) {
    setFavorites((f) => { const n = new Set(f); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  const activeFilterCount = filters.sectors.length + filters.sizes.length +
    +filters.hasOffres + +filters.isPremium + +filters.isRecruiting + +(filters.minRating !== null);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── PAGE HERO ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-[#1E2A3A]">
              Découvrir les Entreprises
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Explorez <span className="font-semibold text-[#E8622A]">{companies.length} entreprises</span> qui recrutent dans le tourisme & l'hôtellerie
            </p>
          </div>

          {/* Search bar */}
          <div className="flex gap-3 flex-wrap md:flex-nowrap">
            <div className="relative flex-1 min-w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nom d'entreprise, secteur, mot-clé..."
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] transition"
              />
              {search && (
                <button onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="relative min-w-48">
              <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ville, région..."
                className="w-full pl-9 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white
                           focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] transition"
              />
            </div>
            <button className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#d4561f] text-white
                               font-semibold text-sm px-6 py-3 rounded-xl transition flex-shrink-0">
              <Search size={15} /> Rechercher
            </button>
          </div>

          {/* Sector pill carousel */}
          <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveSector('')}
              className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border
                         flex-shrink-0 transition-all ${!activeSector
                           ? 'bg-[#1E2A3A] text-white border-[#1E2A3A]'
                           : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'}`}
            >
              Tous les secteurs
            </button>
            {FEATURED_SECTORS.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSector(activeSector === s.key ? '' : s.key)}
                className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border
                           flex-shrink-0 transition-all ${activeSector === s.key
                             ? 'bg-[#E8622A] text-white border-[#E8622A]'
                             : `border ${s.color} hover:shadow-sm`}`}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">

          {/* Sidebar — desktop */}
          <div className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar filters={filters} setFilters={setFilters} total={processed.length} />
            </div>
          </div>

          {/* Main */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
              <div className="flex items-center gap-3">
                {/* Mobile filter btn */}
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
                {/* Active filter chips */}
                {activeFilterCount > 0 && (
                  <button onClick={() => setFilters(EMPTY_FILTERS)}
                          className="text-xs font-semibold text-[#E8622A] flex items-center gap-1 hover:underline">
                    <RotateCcw size={11} /> Effacer filtres
                  </button>
                )}

                {/* Sort */}
                <div className="relative">
                  <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                          className="appearance-none border border-gray-200 bg-white rounded-xl pl-3 pr-8 py-2
                                     text-xs text-gray-600 focus:outline-none focus:border-[#E8622A] transition cursor-pointer">
                    {SORT_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {/* View toggle */}
                <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button onClick={() => setViewMode('grid')}
                          className={`p-2 transition ${viewMode==='grid' ? 'bg-[#E8622A] text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                    <LayoutGrid size={14} />
                  </button>
                  <button onClick={() => setViewMode('list')}
                          className={`p-2 transition ${viewMode==='list' ? 'bg-[#E8622A] text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter chips strip */}
            {(filters.sectors.length > 0 || filters.isPremium || filters.isRecruiting || filters.hasOffres || filters.minRating !== null) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.sectors.map((s) => (
                  <span key={s} className="flex items-center gap-1 text-xs font-medium text-[#E8622A]
                                           bg-white border border-[#E8622A]/30 px-2.5 py-1 rounded-full">
                    {s}
                    <button onClick={() => setFilters({ ...filters, sectors: filters.sectors.filter((x) => x !== s) })}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
                {filters.isRecruiting && (
                  <span className="flex items-center gap-1 text-xs font-medium text-[#E8622A]
                                   bg-white border border-[#E8622A]/30 px-2.5 py-1 rounded-full">
                    Recrute activement <button onClick={() => setFilters({ ...filters, isRecruiting: false })}><X size={10} /></button>
                  </span>
                )}
                {filters.isPremium && (
                  <span className="flex items-center gap-1 text-xs font-medium text-[#E8622A]
                                   bg-white border border-[#E8622A]/30 px-2.5 py-1 rounded-full">
                    Premium <button onClick={() => setFilters({ ...filters, isPremium: false })}><X size={10} /></button>
                  </span>
                )}
                {filters.minRating !== null && (
                  <span className="flex items-center gap-1 text-xs font-medium text-[#E8622A]
                                   bg-white border border-[#E8622A]/30 px-2.5 py-1 rounded-full">
                    ≥ {filters.minRating} ⭐ <button onClick={() => setFilters({ ...filters, minRating: null })}><X size={10} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Grid / List */}
            {loading ? (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
                : 'space-y-3'}>
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
                <button onClick={() => { setSearch(''); setLocation(''); setActiveSector(''); setFilters(EMPTY_FILTERS); }}
                        className="mt-4 text-sm font-semibold text-[#E8622A] hover:underline">
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

      {/* ── MOBILE FILTER DRAWER ──────────────────────────────────────── */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-50 overflow-y-auto shadow-2xl">
            <div className="p-4">
              <FilterSidebar filters={filters} setFilters={setFilters} total={processed.length}
                             onClose={() => setShowMobileFilters(false)} />
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