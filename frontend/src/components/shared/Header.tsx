// src/components/shared/Header.tsx
"use client";

import React, { useState, useEffect, useRef, useReducer } from 'react';
import Link from 'next/link';
import {
  Search, Menu, X, ChevronDown, TrendingUp, MapPin,
  Star, ChevronRight, BookOpen, ExternalLink, ArrowRight, Clock,
} from 'lucide-react';
import { megaMenuData } from '@/constants/navigation';
import { getToken } from '@/lib/auth';
import MagazineImage from '@/components/shared/MagazineImage';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MegaMenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

interface NavItem {
  href: string;
  label: string;
  megaMenu?: MegaMenuItem[];
}

interface Magazine {
  id: number;
  title: string;
  slug: string;
  coverImage: string | null;
  source: string;
  publishedAt: string;
  excerpt?: string | null;
}

// ─── Cache ────────────────────────────────────────────────────────────────────

const magazinesCache: Record<string, Magazine[]> = {};

// ─── SubBar Reducer ───────────────────────────────────────────────────────────

interface SubState {
  magazinesMap:   Record<string, Magazine[]>;
  loadingMagSlug: string | null;
}

type SubAction =
  | { type: 'SET_LOADING_MAG'; payload: string | null }
  | { type: 'SET_MAGAZINES';   slug: string; magazines: Magazine[] };

function subReducer(state: SubState, action: SubAction): SubState {
  switch (action.type) {
    case 'SET_LOADING_MAG':
      return { ...state, loadingMagSlug: action.payload };
    case 'SET_MAGAZINES':
      return {
        ...state,
        loadingMagSlug: null,
        magazinesMap: { ...state.magazinesMap, [action.slug]: action.magazines },
      };
    default:
      return state;
  }
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  {
    href: '/actualites',
    label: 'Actualités',
    megaMenu: [
      { label: 'Hôtellerie',   href: '/secteurs/hotellerie',   icon: <Star size={16} />,        description: 'Tendances hôtels & resorts' },
      { label: 'Transport',    href: '/secteurs/transport',    icon: <TrendingUp size={16} />,   description: 'Aviation, train, maritime'  },
      { label: 'Restauration', href: '/secteurs/restauration', icon: <Star size={16} />,        description: 'Gastronomie africaine'       },
    ],
  },
  { href: '/evenements',  label: 'Événements'  },
  { href: '/partenaires', label: 'Partenaires' },
  {
    href: '/destinations',
    label: 'Destinations',
    megaMenu: [
      { label: "Afrique de l'Ouest", href: '/destinations/ouest', icon: <MapPin size={16} />, description: "Sénégal, Côte d'Ivoire…" },
      { label: "Afrique de l'Est",   href: '/destinations/est',   icon: <MapPin size={16} />, description: 'Kenya, Tanzanie…'        },
      { label: "Afrique du Nord",    href: '/destinations/nord',  icon: <MapPin size={16} />, description: 'Maroc, Tunisie…'         },
    ],
  },
  { href: '/videos',    label: 'Vidéos'    },
  { href: '/offres',    label: 'Nos offres' },
  { href: '/a-propos',  label: 'À propos'  },
  { href: '/contact',   label: 'Contact'   },
];

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Sous-composants ──────────────────────────────────────────────────────────

function MegaMenuPanel({ items, visible }: { items: MegaMenuItem[]; visible: boolean }) {
  return (
    <div
      className={`
        absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72
        bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden
        transition-all duration-200 origin-top z-50
        ${visible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
      `}
    >
      <div className="p-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-start gap-3 px-4 py-3 rounded-xl group transition-colors"
            style={{ color: 'inherit' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D4EDE5')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span
              className="mt-0.5 w-8 h-8 flex items-center justify-center rounded-lg shrink-0 text-white"
              style={{ backgroundColor: '#1A5C43' }}
            >
              {item.icon}
            </span>
            <div>
              <p className="font-semibold text-sm transition-colors" style={{ color: '#001A4D' }}>
                {item.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MagazineMenuCard({ magazine }: { magazine: Magazine }) {
  return (
    <Link
      href={`/magazine/${magazine.slug}`}
      className="group/mag flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100 shrink-0">
        <MagazineImage
          src={magazine.coverImage}
          alt={magazine.title}
          className="w-full h-full object-cover group-hover/mag:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2">
          <span
            className="text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none"
            style={{ backgroundColor: 'rgba(0,26,77,0.8)', backdropFilter: 'blur(4px)' }}
          >
            {magazine.source}
          </span>
        </div>
      </div>
      <div className="p-2.5 flex flex-col gap-1">
        <p className="font-bold text-[11px] leading-tight line-clamp-2" style={{ color: '#001A4D' }}>
          {magazine.title}
        </p>
        <div className="flex items-center gap-1 text-[9px] mt-0.5" style={{ color: '#9ca3af' }}>
          <Clock size={9} />
          {new Date(magazine.publishedAt).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </div>
        <span className="flex items-center gap-1 text-[9px] font-bold mt-1" style={{ color: '#C8A84B' }}>
          Lire <ExternalLink size={9} />
        </span>
      </div>
    </Link>
  );
}

function MagazineMiniCard({ magazine }: { magazine: Magazine }) {
  return (
    <Link
      href={`/magazine/${magazine.slug}`}
      className="flex gap-2.5 items-start bg-white rounded-lg p-2 border border-gray-100 active:bg-gray-50 transition-colors"
    >
      <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-gray-100">
        <MagazineImage
          src={magazine.coverImage}
          alt={magazine.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <span
          className="inline-block text-white text-[8px] px-1.5 py-0.5 rounded-full font-semibold mb-1"
          style={{ backgroundColor: '#001A4D' }}
        >
          {magazine.source}
        </span>
        <p className="font-bold text-[10.5px] leading-tight line-clamp-2" style={{ color: '#001A4D' }}>
          {magazine.title}
        </p>
      </div>
    </Link>
  );
}

function MagazineSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-gray-100">
      <div className="w-full aspect-video bg-gray-100 animate-pulse" />
      <div className="p-2.5 space-y-1.5">
        <div className="h-2.5 bg-gray-100 rounded animate-pulse" />
        <div className="h-2.5 bg-gray-100 rounded animate-pulse w-2/3" />
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

const Header = () => {
  // Header state
  const [isSearchOpen,    setIsSearchOpen]    = useState(false);
  const [activeNavMenu,   setActiveNavMenu]   = useState<string | null>(null);
  const [scrolled,        setScrolled]        = useState(false);
  const [searchValue,     setSearchValue]     = useState('');
  const searchRef    = useRef<HTMLInputElement>(null);
  const navTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // SubBar / Rubriques drawer state
  const [isRubriquesOpen,        setIsRubriquesOpen]        = useState(false);
  const [expandedCategory,       setExpandedCategory]       = useState<string | null>(null);
  const [activeDesktopRubrique,  setActiveDesktopRubrique]  = useState<string | null>(null);

  const [subState, subDispatch] = useReducer(subReducer, { magazinesMap: {}, loadingMagSlug: null });
  const { magazinesMap, loadingMagSlug } = subState;
  const abortRef = useRef<AbortController | null>(null);

  // ── Scroll ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

  // ── Fetch magazines ──────────────────────────────────────────────────────────
  const fetchMagazines = (category: string) => {
    const menuCategory = megaMenuData[category as keyof typeof megaMenuData];
    if (!menuCategory) return;
    const { slug } = menuCategory;

    if (magazinesMap[slug] !== undefined || magazinesCache[slug] !== undefined) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    subDispatch({ type: 'SET_LOADING_MAG', payload: slug });

    fetch(
      `${BASE_URL}/magazines/rss?category=${slug}&pageSize=3&page=1`,
      { headers: getAuthHeaders(), signal: controller.signal }
    )
      .then(r => r.json())
      .then(json => {
        const data: Magazine[] = json?.data?.magazines ?? [];
        magazinesCache[slug] = data;
        subDispatch({ type: 'SET_MAGAZINES', slug, magazines: data });
      })
      .catch(err => {
        if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
          subDispatch({ type: 'SET_MAGAZINES', slug, magazines: [] });
        }
      });
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const handleNavEnter = (label: string) => {
    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    setActiveNavMenu(label);
  };
  const handleNavLeave = () => {
    navTimerRef.current = setTimeout(() => setActiveNavMenu(null), 150);
  };

  const activeSlug = activeDesktopRubrique
    ? megaMenuData[activeDesktopRubrique as keyof typeof megaMenuData]?.slug ?? null
    : null;
  const categoryMagazines = activeSlug
    ? (magazinesMap[activeSlug] ?? magazinesCache[activeSlug] ?? [])
    : [];
  const loadingMags = activeSlug !== null && loadingMagSlug === activeSlug;

  const closeDrawer = () => {
    setIsRubriquesOpen(false);
    setExpandedCategory(null);
    setActiveDesktopRubrique(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      <nav
        className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-xl' : ''}`}
      >
        {/* Barre d'accent terre cuite */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: '#B85C38' }} />

        {/* Fond émeraude */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, #fff 0%, #fff 13%, #1A5C43 22%, #1A5C43 100%)',
          }}
        />

        <div className="px-4 sm:px-6 lg:px-8 pt-[3px] pb-0 relative z-10">
          <div className="flex items-center justify-between h-[72px]">

            {/* ── LOGO ── */}
            <div className="flex flex-col items-center shrink-0">
              <Link href="/" className="flex items-center group">
                <div className="bg-white px-2 py-1.5 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  <img
                    src="/logos/itourismenomade.png"
                    alt="100% Afrique"
                    className="h-11 sm:h-14 object-contain"
                  />
                </div>
              </Link>
              <span
                className="hidden md:block ml-3 text-[11px] font-semibold tracking-wide animate-pulse"
                style={{ color: '#C8A84B' }}
              >
                La voix du tourisme en Afrique
              </span>
            </div>

            {/* ── NAV DESKTOP ── */}
            <div className="hidden xl:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.megaMenu && handleNavEnter(item.label)}
                  onMouseLeave={handleNavLeave}
                >
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-semibold uppercase tracking-wide
                      text-white transition-all duration-150 hover:bg-white/10
                      ${activeNavMenu === item.label ? 'bg-white/10' : ''}
                    `}
                  >
                    {item.label}
                    {item.megaMenu && (
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${activeNavMenu === item.label ? 'rotate-180' : ''}`}
                      />
                    )}
                  </Link>
                  {item.megaMenu && (
                    <MegaMenuPanel items={item.megaMenu} visible={activeNavMenu === item.label} />
                  )}
                </div>
              ))}
            </div>

            {/* ── ACTIONS DROITE ── */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">

              {/* Recherche */}
              <div
                className={`
                  hidden sm:flex items-center rounded-full overflow-hidden
                  transition-all duration-300 bg-white/10 hover:bg-white/15
                  ${isSearchOpen ? 'w-52 ring-2 ring-white/30' : 'w-9'}
                `}
              >
                <button
                  onClick={() => setIsSearchOpen(v => !v)}
                  className="flex items-center justify-center w-9 h-9 shrink-0"
                >
                  {isSearchOpen
                    ? <X size={16} className="text-white" />
                    : <Search size={16} className="text-white" />
                  }
                </button>
                {isSearchOpen && (
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    placeholder="Rechercher…"
                    className="flex-1 bg-transparent text-white text-sm placeholder-white/60 outline-none pr-3"
                  />
                )}
              </div>

              {/* ── BOUTON RUBRIQUES (ex-SubBar) ── */}
              <button
                onClick={() => setIsRubriquesOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
                aria-label="Explorer les rubriques"
              >
                <Menu size={15} />
                <span className="hidden sm:inline">Rubriques</span>
              </button>

              {/* CTA Emploi */}
              <Link
                href="/emploi"
                className="relative overflow-hidden font-bold py-2 px-4 sm:px-5 rounded-full text-xs sm:text-sm uppercase tracking-widest text-white transition-all shadow-md hover:shadow-lg active:scale-95"
                style={{ backgroundColor: '#B85C38' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#8A3E22')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#B85C38')}
              >
                EMPLOI
              </Link>

              {/* Burger mobile */}
              <button
                onClick={() => setIsRubriquesOpen(!isRubriquesOpen)}
                className="xl:hidden flex items-center justify-center w-9 h-9 rounded-lg text-white hover:bg-white/10 transition-colors"
                aria-label={isRubriquesOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              >
                {isRubriquesOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ── DRAWER OVERLAY ── */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${isRubriquesOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeDrawer}
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      />

      {/* ── DRAWER PANEL ── */}
      <div
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 ease-out ${isRubriquesOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '75vw', maxWidth: '420px', backgroundColor: '#ffffff' }}
      >
        {/* Header drawer */}
        <div
          className="flex items-center justify-between p-5 shrink-0"
          style={{ backgroundColor: '#1A5C43', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="bg-white px-2 py-1 rounded-lg">
            <img src="/logos/itourismenomade.png" alt="100% Afrique" className="h-9 object-contain" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#C8A84B' }}>
              Rubriques
            </span>
            <button onClick={closeDrawer} className="p-1 text-white/70 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nav links (mobile only) */}
        <div className="xl:hidden border-b" style={{ borderColor: '#e5e7eb' }}>
          <div className="p-3 grid grid-cols-2 gap-1">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeDrawer}
                className="block px-3 py-2 rounded-lg font-semibold text-xs uppercase tracking-wide transition-colors"
                style={{ color: '#001A4D' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D4EDE5')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Catégories */}
        <div className="overflow-y-auto flex-1">
          {Object.entries(megaMenuData).map(([category, data]) => {
            const isExpanded = expandedCategory === category;
            const { slug }   = data;
            const magazines  = magazinesMap[slug] ?? magazinesCache[slug] ?? [];
            const isLoadingM = loadingMagSlug === slug;

            return (
              <div key={category} style={{ borderBottom: '1px solid #f3f4f6' }}>

                {/* Ligne catégorie */}
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  onClick={() => {
                    const next = isExpanded ? null : category;
                    setExpandedCategory(next);
                    setActiveDesktopRubrique(next);
                    if (next) fetchMagazines(next);
                  }}
                >
                  <span className="font-bold text-[12px] uppercase tracking-wider" style={{ color: '#001A4D' }}>
                    {category}
                  </span>
                  <ChevronRight
                    size={16}
                    style={{ color: '#1A5C43', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  />
                </button>

                {/* Panneau expandé */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1" style={{ backgroundColor: '#f8fafc' }}>

                    {/* Colonnes de liens */}
                    {data.columns.map((col, idx) => (
                      <div key={idx} className="mb-4">
                        <p className="font-extrabold text-[10px] uppercase tracking-tight mb-2" style={{ color: '#C8A84B' }}>
                          {col.title}
                        </p>
                        <ul className="space-y-2">
                          {col.links.map((link) => (
                            <li key={link}>
                              <a
                                href="#"
                                className="flex items-center gap-1.5 text-[12px] py-0.5 transition-colors"
                                style={{ color: '#4b5563' }}
                                onClick={closeDrawer}
                                onMouseEnter={e => (e.currentTarget.style.color = '#001A4D')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}
                              >
                                <ArrowRight size={10} style={{ color: '#C8A84B', flexShrink: 0 }} />
                                {link}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    <div style={{ borderTop: '1px solid #e5e7eb', margin: '12px 0' }} />

                    {/* Actualités récentes */}
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-extrabold text-[10px] uppercase tracking-tight flex items-center gap-1" style={{ color: '#C8A84B' }}>
                        <BookOpen size={10} />
                        Actualités Récentes
                      </p>
                      <Link
                        href={`/secteurs/${slug}`}
                        className="text-[9px] font-bold flex items-center gap-0.5 transition-colors"
                        style={{ color: '#001A4D' }}
                        onClick={closeDrawer}
                        onMouseEnter={e => (e.currentTarget.style.color = '#C8A84B')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#001A4D')}
                      >
                        Voir tous <ChevronRight size={10} />
                      </Link>
                    </div>

                    {isLoadingM ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex gap-2.5 items-start bg-white rounded-lg p-2 border border-gray-100">
                            <div className="w-12 h-12 rounded-md bg-gray-100 animate-pulse shrink-0" />
                            <div className="flex-1 space-y-1.5 py-1">
                              <div className="h-2.5 bg-gray-100 rounded animate-pulse" />
                              <div className="h-2.5 bg-gray-100 rounded animate-pulse w-2/3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : magazines.length === 0 ? (
                      <p className="text-[11px] italic" style={{ color: '#9ca3af' }}>
                        Aucune actualité disponible dans cette catégorie.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {magazines.slice(0, 4).map(mag => (
                          <div key={mag.id} onClick={closeDrawer}>
                            <MagazineMiniCard magazine={mag} />
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA emploi bas du drawer */}
        <div className="p-4 shrink-0" style={{ borderTop: '1px solid #e5e7eb' }}>
          <Link
            href="/emploi"
            onClick={closeDrawer}
            className="block w-full text-center font-bold py-3 rounded-full text-sm uppercase tracking-widest text-white transition-colors"
            style={{ backgroundColor: '#B85C38' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#8A3E22')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#B85C38')}
          >
            Espace EMPLOI
          </Link>
        </div>
      </div>

      <style jsx global>{`
        body { padding-top: 75px; }
      `}</style>
    </>
  );
};

export default Header;











// // src/components/shared/Header.tsx
// "use client";

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { Search, Menu, X } from 'lucide-react';
// import NewsletterButton from '@/components/shared/Newsletterbutton';

// const Header = () => {
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     <nav className="w-full shadow-lg relative z-50">
//       {/* Fond : blanc à gauche (logo) → émeraude foncé à droite (nav) */}
//       <div
//         className="absolute inset-0"
//         style={{
//           background: 'linear-gradient(to right, white 0%, white 12%, #1A5C43 25%, #1A5C43 100%)'
//         }}
//       />

//       <div className="px-4 sm:px-6 lg:px-8 py-4 relative z-10">
//         <div className="flex items-center justify-between">

//           {/* --- LOGOS (Gauche) --- */}
//           <div className="flex items-center gap-2 sm:gap-4 shrink-0">
//             <Link href="/" className="flex items-center relative">
//               <div className="bg-white p-1 sm:p-2 rounded-sm">
//                 <img
//                   src="/logos/itourismenomade.png"
//                   alt="iTourisme Nomade"
//                   className="h-12 sm:h-16 md:h-20 object-contain"
//                 />
//               </div>
//               <div className="absolute -bottom-4 left-0 whitespace-nowrap">
//                 <p className="text-xs sm:text-sm font-semibold animate-pulse" style={{ color: '#C8A84B' }}>
//                   "La voix du tourisme en Afrique"
//                 </p>
//               </div>
//             </Link>
//           </div>

//           {/* --- NAVIGATION PRINCIPALE (Desktop) --- */}
//           <div className="hidden xl:flex items-center gap-3 xl:gap-5 text-xs sm:text-sm font-medium uppercase tracking-wider">
//             {[
//               { href: '/actualites',  label: 'Actualités' },
//               { href: '/evenements',  label: 'Événements' },
//               { href: '/partenaires', label: 'Partenaires' },
//               { href: '/destinations',label: 'Destinations' },
//               { href: '/videos',      label: 'Vidéos' },
//               { href: '/offres',      label: 'Nos offres' },
//               { href: '/contact',     label: 'À propos & Contact' },
//             ].map(({ href, label }) => (
//               <Link
//                 key={href}
//                 href={href}
//                 className="py-2 transition-colors"
//                 style={{ color: '#ffffff' }}
//                 onMouseEnter={e => (e.currentTarget.style.color = '#C8A84B')}
//                 onMouseLeave={e => (e.currentTarget.style.color = '#ffffff')}
//               >
//                 {label}
//               </Link>
//             ))}
//           </div>

//           {/* --- ACTIONS (Droite) --- */}
//           <div className="flex items-center gap-2 sm:gap-4 shrink-0">

//             {/* Barre de recherche extensible (Desktop) */}
//             <div className="hidden sm:flex items-center rounded-full px-3 py-1 transition-all duration-300" style={{ background: 'rgba(255,255,255,0.1)' }}>
//               <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
//                 <Search size={18} className="text-white cursor-pointer" />
//               </button>
//               {isSearchOpen && (
//                 <input
//                   type="text"
//                   placeholder="Rechercher..."
//                   className="bg-transparent border-none outline-none text-white text-sm ml-2 w-32 sm:w-48"
//                   autoFocus
//                 />
//               )}
//             </div>

//             {/* Bouton Newsletter (Desktop) */}
//             <div className="hidden sm:flex">
//               <NewsletterButton />
//             </div>

//             {/* Bouton EMPLOI — terre cuite */}
//             <Link
//               href="/emploi"
//               className="font-bold py-2 px-3 sm:px-6 rounded-lg text-xs sm:text-sm transition-all shadow-md uppercase tracking-widest"
//               style={{ background: '#B85C38', color: '#ffffff' }}
//               onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
//               onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
//             >
//               EMPLOI
//             </Link>

//             {/* Menu Mobile */}
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="xl:hidden p-2 text-white"
//             >
//               {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- MENU MOBILE --- */}
//       {isMobileMenuOpen && (
//         <>
//           <div
//             className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//             onClick={() => setIsMobileMenuOpen(false)}
//           />

//           <div
//             className="fixed top-0 left-0 h-full w-[40%] max-w-xs shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out"
//             style={{ background: '#1A5C43' }}
//           >
//             <div className="p-4">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="bg-white p-1 rounded-sm">
//                   <img
//                     src="/logos/itourismenomade.png"
//                     alt="iTourisme Nomade"
//                     className="h-10 object-contain"
//                   />
//                 </div>
//                 <button
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="p-2 text-white transition-colors"
//                   onMouseEnter={e => (e.currentTarget.style.color = '#C8A84B')}
//                   onMouseLeave={e => (e.currentTarget.style.color = '#ffffff')}
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               {/* Navigation Mobile */}
//               <div className="space-y-1">
//                 {[
//                   { href: '/actualites',   label: 'Actualités' },
//                   { href: '/evenements',   label: 'Événements' },
//                   { href: '/partenaires',  label: 'Partenaires' },
//                   { href: '/destinations', label: 'Destinations' },
//                   { href: '/videos',       label: 'Vidéos' },
//                   { href: '/offres',       label: 'Nos offres' },
//                   { href: '/contact',      label: 'À propos & Contact' },
//                 ].map(({ href, label }) => (
//                   <Link
//                     key={href}
//                     href={href}
//                     className="block py-3 px-2 rounded transition-colors text-white"
//                     style={{}}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     onMouseEnter={e => {
//                       e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
//                       e.currentTarget.style.color = '#C8A84B';
//                     }}
//                     onMouseLeave={e => {
//                       e.currentTarget.style.background = 'transparent';
//                       e.currentTarget.style.color = '#ffffff';
//                     }}
//                   >
//                     {label}
//                   </Link>
//                 ))}

//                 <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
//                   <Link
//                     href="/emploi"
//                     className="block w-full font-bold py-3 px-4 rounded-lg text-sm text-center transition-all shadow-md uppercase tracking-widest text-white"
//                     style={{ background: '#B85C38' }}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     onMouseEnter={e => (e.currentTarget.style.background = '#8A3E22')}
//                     onMouseLeave={e => (e.currentTarget.style.background = '#B85C38')}
//                   >
//                     EMPLOI
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </nav>
//   );
// };

// export default Header;




















// // src/components/shared/Header.tsx
// "use client";

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { Search, Menu, X } from 'lucide-react';
// import NewsletterButton from '@/components/shared/Newsletterbutton';

// const Header = () => {
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     <nav className="w-full shadow-lg relative z-50">
//       <div 
//         className="absolute inset-0" 
//         style={{
//           background: 'linear-gradient(to right, white 0%, white 12%, #001A4D 25%, #001A4D 100%)'
//         }}
//       ></div>
//       <div className="px-4 sm:px-6 lg:px-8 py-4 relative z-10">
//         <div className="flex items-center justify-between">
          
//           {/* --- LOGOS (Gauche) --- */}
//           <div className="flex items-center gap-2 sm:gap-4 shrink-0">
//             <Link href="/" className="flex items-center relative">
//               <div className="bg-white p-1 sm:p-2 rounded-sm">
//                 <img 
//                   src="/logos/itourismenomade.png" 
//                   alt="iTourisme Nomade" 
//                   className="h-12 sm:h-16 md:h-20 object-contain" 
//                 />
//               </div>
//               <div className="absolute -bottom-4 left-0 whitespace-nowrap">
//                 <p className="text-xs sm:text-sm text-orange-400 font-semibold animate-pulse">
//                   "La voix du tourisme en Afrique"
//                 </p>
//               </div>
//             </Link>
//           </div>

//           {/* --- NAVIGATION PRINCIPALE (Desktop) --- */}
//           <div className="hidden xl:flex items-center gap-3 xl:gap-5 text-xs sm:text-sm font-medium uppercase tracking-wider">
//             <Link href="/actualites" className="text-white hover:text-orange-400 transition-colors py-2">Actualités</Link>
//             {/* <Link href="/magazine" className="text-center leading-tight text-white hover:text-orange-400 transition-colors py-2">
//               Magazine<br/><span className="text-[10px]">WAXEHO</span>
//             </Link> */}
//             <Link href="/evenements" className="text-center leading-tight text-white hover:text-orange-400 transition-colors py-2">
//               {/* Salons &<br/><span className="text-[10px]">Événements</span> */}
//               Événements
//             </Link>
//             <Link href="/partenaires" className="text-center leading-tight text-white hover:text-orange-400 transition-colors py-2">
//               {/* Partenaires &<br/><span className="text-[10px]">Annonceurs</span> */}
//               Partenaires
//             </Link>
//             <Link href="/destinations" className="text-white hover:text-orange-400 transition-colors py-2">Destinations</Link>
//             <Link href="/videos" className="text-center leading-tight text-white hover:text-orange-400 transition-colors py-2">
//               {/* Vidéos /<br/><span className="text-[10px]">Web TV</span> */}
//               Vidéos
//             </Link>
//             <Link href="/offres" className="text-white hover:text-orange-400 transition-colors py-2">Nos offres</Link>
//             <Link href="/contact" className="text-center leading-tight text-white hover:text-orange-400 transition-colors py-2">
//               À propos & Contact
//             </Link>
//           </div>

//           {/* --- ACTIONS (Droite) --- */}
//           <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
//             {/* Barre de recherche extensible (Desktop) */}
//             <div className="hidden sm:flex items-center bg-white/10 rounded-full px-3 py-1 transition-all duration-300">
//               <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
//                 <Search size={18} className="text-white cursor-pointer" />
//               </button>
//               {isSearchOpen && (
//                 <input 
//                   type="text" 
//                   placeholder="Rechercher..." 
//                   className="bg-transparent border-none outline-none text-white text-sm ml-2 w-32 sm:w-48"
//                   autoFocus
//                 />
//               )}
//             </div>

//             {/* Bouton Newsletter (Desktop) */}
//             <div className="hidden sm:flex">
//               <NewsletterButton />
//             </div>

//             {/* Bouton EMPLOI */}
//             <Link 
//               href="/emploi" 
//               className="bg-[#FF9900] hover:bg-[#e68a00] text-[#001A4D] font-bold py-2 px-3 sm:px-6 rounded-lg text-xs sm:text-sm transition-all shadow-md uppercase tracking-widest"
//             >
//               EMPLOI
//             </Link>

//             {/* Menu Mobile */}
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="xl:hidden p-2 text-white"
//             >
//               {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- MENU MOBILE --- */}
//       {isMobileMenuOpen && (
//         <>
//           <div 
//             className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//             onClick={() => setIsMobileMenuOpen(false)}
//           />
          
//           <div className="fixed top-0 left-0 h-full w-[40%] max-w-xs bg-[#001A4D] shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
//             <div className="p-4">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center">
//                   <div className="bg-white p-1 rounded-sm">
//                     <img 
//                       src="/logos/itourismenomade.png" 
//                       alt="iTourisme Nomade" 
//                       className="h-10 object-contain" 
//                     />
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="p-2 text-white hover:text-orange-400 transition-colors"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               {/* Recherche Mobile */}
//               <div className="hidden flex xl:flex items-center bg-white/10 rounded-lg px-3 py-2 mb-4">
//                 <Search size={18} className="text-white mr-2" />
//                 <input 
//                   type="text" 
//                   placeholder="Rechercher..." 
//                   className="bg-transparent border-none outline-none text-white text-sm flex-1"
//                 />
//               </div>

//               {/* Newsletter Mobile */}
//               <div className="hidden xl:flex mb-6">
//                 <NewsletterButton />
//               </div>

//               {/* Navigation Mobile */}
//               <div className="space-y-1">
//                 <Link href="/actualites" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Actualités</Link>
//                 {/* <Link href="/magazine" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Magazine WAXEHO</Link> */}
//                 <Link href="/evenements" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Événements</Link>
//                 <Link href="/partenaires" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Partenaires</Link>
//                 <Link href="/destinations" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Destinations</Link>
//                 <Link href="/videos" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Vidéos</Link>
//                 <Link href="/offres" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Nos offres</Link>
//                 <Link href="/contact" className="block py-3 px-2 text-white hover:bg-white/10 hover:text-orange-400 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>À propos & Contact</Link>
                
//                 <div className="pt-4 border-t border-gray-700">
//                   <Link href="/emploi" className="block w-full bg-[#FF9900] hover:bg-[#e68a00] text-[#001A4D] font-bold py-3 px-4 rounded-lg text-sm text-center transition-all shadow-md uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>
//                     EMPLOI
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </nav>
//   );
// };

// export default Header;