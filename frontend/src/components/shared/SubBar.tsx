// src/components/shared/SubBar.tsx
"use client";

import React, { useReducer, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Clock, ArrowRight, Menu, X, ChevronRight, BookOpen, ExternalLink } from 'lucide-react';
import { megaMenuData } from '@/constants/navigation';
import { getToken } from '@/lib/auth';

// ─── Types ────────────────────────────────────────────────────────────────

interface Magazine {
  id: number;
  title: string;
  slug: string;
  coverImage: string | null;
  source: string;
  publishedAt: string;
  excerpt?: string | null;
}

// ─── Cache module-level ────────────────────────────────────────────────────

const magazinesCache: Record<string, Magazine[]> = {};

// ─── State & Reducer ───────────────────────────────────────────────────────

interface State {
  activeMenu:      string | null;
  magazinesMap:    Record<string, Magazine[]>;
  loadingMagSlug:  string | null;
}

type Action =
  | { type: 'SET_MENU';         payload: string | null }
  | { type: 'SET_LOADING_MAG';  payload: string | null }
  | { type: 'SET_MAGAZINES';    slug: string; magazines: Magazine[] };

const initialState: State = {
  activeMenu:     null,
  magazinesMap:   {},
  loadingMagSlug: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_MENU':
      return { ...state, activeMenu: action.payload };
    case 'SET_LOADING_MAG':
      return { ...state, loadingMagSlug: action.payload };
    case 'SET_MAGAZINES':
      return { ...state, loadingMagSlug: null, magazinesMap: { ...state.magazinesMap, [action.slug]: action.magazines } };
    default:
      return state;
  }
}

// ─── Magazine card (desktop mega-menu) ───────────────────────────────────

function MagazineMenuCard({ magazine }: { magazine: Magazine }) {
  return (
    <Link
      href={`/magazine/${magazine.slug}`}
      className="group/mag flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Cover portrait */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 shrink-0">
        <img
          src={magazine.coverImage || '/images/magazine-placeholder.jpg'}
          alt={magazine.title}
          className="w-full h-full object-cover group-hover/mag:scale-105 transition-transform duration-500"
        />
        {/* Source badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none">
            {magazine.source}
          </span>
        </div>
      </div>
      {/* Info */}
      <div className="p-2 flex flex-col gap-1">
        <p className="font-bold text-[10.5px] text-[#001A4D] leading-tight line-clamp-2">
          {magazine.title}
        </p>
        <div className="flex items-center gap-1 text-[9px] text-gray-400 mt-0.5">
          <Clock size={9} />
          {new Date(magazine.publishedAt).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </div>
        <span className="flex items-center gap-1 text-[9px] font-bold text-[#D97706] mt-auto">
          Lire <ExternalLink size={9} />
        </span>
      </div>
    </Link>
  );
}

// ─── Magazine mini-card mobile ────────────────────────────────────────────

function MagazineMiniCardMobile({ magazine }: { magazine: Magazine }) {
  return (
    <Link
      href={`/magazine/${magazine.slug}`}
      className="flex gap-2.5 items-start bg-white rounded-lg p-2 border border-gray-100 active:bg-gray-50 transition-colors"
    >
      <div className="w-10 h-14 rounded-md overflow-hidden shrink-0 bg-gray-100">
        <img
          src={magazine.coverImage || '/images/magazine-placeholder.jpg'}
          alt={magazine.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className="inline-block bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-semibold mb-1">
          {magazine.source}
        </span>
        <p className="font-bold text-[10.5px] text-[#001A4D] leading-tight line-clamp-2">
          {magazine.title}
        </p>
      </div>
    </Link>
  );
}

// ─── Skeleton loaders ────────────────────────────────────────────────────

function MagazineSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-gray-100">
      <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
      <div className="p-2 space-y-1.5">
        <div className="h-2.5 bg-gray-100 rounded animate-pulse" />
        <div className="h-2.5 bg-gray-100 rounded animate-pulse w-2/3" />
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

const SubBar = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { activeMenu, magazinesMap, loadingMagSlug } = state;

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);

  const abortMagazines = useRef<AbortController | null>(null);

  // ── Fetch magazines by category slug ───────────────────────────────────
  useEffect(() => {
    abortMagazines.current?.abort();
    if (!activeMenu) return;

    const menuCategory = megaMenuData[activeMenu as keyof typeof megaMenuData];
    if (!menuCategory) return;
    const { slug } = menuCategory;

    // Already cached — skip fetch
    if (magazinesMap[slug] !== undefined || magazinesCache[slug] !== undefined) return;

    const controller = new AbortController();
    abortMagazines.current = controller;

    queueMicrotask(() => {
      if (controller.signal.aborted) return;
      dispatch({ type: 'SET_LOADING_MAG', payload: slug });
    });

    fetch(
      `${BASE_URL}/magazines/rss?category=${slug}&pageSize=3&page=1`,
      { headers: getAuthHeaders(), signal: controller.signal }
    )
      .then((r) => r.json())
      .then((json) => {
        const data: Magazine[] = json?.data?.magazines ?? [];
        magazinesCache[slug] = data;
        dispatch({ type: 'SET_MAGAZINES', slug, magazines: data });
      })
      .catch((err) => {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          dispatch({ type: 'SET_MAGAZINES', slug, magazines: [] });
        }
      });

    return () => controller.abort();
  }, [activeMenu]);

  // ── Derived values ──────────────────────────────────────────────────────
  const activeSlug = activeMenu
    ? megaMenuData[activeMenu as keyof typeof megaMenuData]?.slug ?? null
    : null;

  const categoryMagazines = activeSlug
    ? (magazinesMap[activeSlug] ?? magazinesCache[activeSlug] ?? [])
    : [];
  const loadingMags = activeSlug !== null && loadingMagSlug === activeSlug;

  const closeMobile = () => {
    setIsMobileDrawerOpen(false);
    setMobileExpandedCategory(null);
  };

  // ── JSX ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── DESKTOP SubBar (lg+) ─────────────────────────────────────── */}
      <div
        className="relative w-full bg-gradient-to-b from-[#F8FAFC] to-[#EDF2F7] border-b border-gray-200 shadow-sm z-40 hidden lg:block"
        onMouseLeave={() => dispatch({ type: 'SET_MENU', payload: null })}
      >
        <div className="max-w-[1400px] mx-auto px-4">
          <ul className="flex items-center justify-center gap-6 py-3">
            {Object.keys(megaMenuData).map((category) => (
              <li
                key={category}
                onMouseEnter={() => dispatch({ type: 'SET_MENU', payload: category })}
                className="group cursor-pointer py-1"
              >
                <div
                  className={`flex items-center gap-1.5 font-bold text-[10.5px] tracking-wider transition-colors ${
                    activeMenu === category ? 'text-blue-700' : 'text-[#001A4D]'
                  }`}
                >
                  {category}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${activeMenu === category ? 'rotate-180' : ''}`}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Mega menu panel ────────────────────────────────────────── */}
        {activeMenu && megaMenuData[activeMenu as keyof typeof megaMenuData] && (
          <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="max-w-[1400px] mx-auto p-8">

              {/* Top row: nav columns + magazines récents */}
              <div className="flex gap-10">
                {/* Nav columns */}
                {megaMenuData[activeMenu as keyof typeof megaMenuData].columns.map((col, idx) => (
                  <div key={idx} className="w-1/5">
                    <h3 className="text-[#D97706] font-extrabold text-[13px] mb-5 uppercase tracking-tight">
                      {col.title}
                    </h3>
                    <ul className="space-y-3">
                      {col.links.map((link) => (
                        <li key={link}>
                          <a
                            href="#"
                            className="text-gray-500 hover:text-blue-700 text-[12.5px] transition-colors leading-tight block"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Magazines de la catégorie */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[#D97706] font-extrabold text-[13px] uppercase flex items-center gap-2">
                      <BookOpen size={14} className="text-[#D97706]" />
                      Magazines &amp; Revues — {activeMenu}
                    </h3>
                    <Link
                      href="/magazine"
                      className="text-[10.5px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                    >
                      Voir tous <ChevronRight size={12} />
                    </Link>
                  </div>

                  {loadingMags ? (
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => <MagazineSkeleton key={i} />)}
                    </div>
                  ) : categoryMagazines.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {categoryMagazines.slice(0, 3).map((mag) => (
                        <MagazineMenuCard key={mag.id} magazine={mag} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <BookOpen size={32} className="text-gray-300 mb-3" />
                      <p className="text-gray-400 text-sm italic">
                        Aucun magazine disponible dans cette catégorie.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE SubBar trigger (< lg) ─────────────────────────────── */}
      <div className="lg:hidden w-full bg-gradient-to-b from-[#F8FAFC] to-[#EDF2F7] border-b border-gray-200 shadow-sm z-40">
        <div className="px-4 py-2 flex items-center justify-between">
          <p className="text-[11px] font-bold text-[#001A4D] uppercase tracking-wider">Rubriques</p>
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex items-center gap-1.5 bg-[#001A4D] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg"
          >
            <Menu size={14} />
            Explorer
          </button>
        </div>
      </div>

      {/* ── MOBILE Drawer ────────────────────────────────────────────── */}
      {isMobileDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={closeMobile}
          />

          <div className="fixed top-0 left-0 h-full w-[75%] max-w-sm bg-white shadow-2xl z-50 lg:hidden flex flex-col overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#001A4D] shrink-0">
              <p className="text-white font-bold text-sm uppercase tracking-widest">Rubriques</p>
              <button onClick={closeMobile} className="text-white p-1">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable */}
            <div className="overflow-y-auto flex-1">
              {Object.entries(megaMenuData).map(([category, data]) => {
                const isExpanded = mobileExpandedCategory === category;
                const slug       = data.slug;
                const magazines  = magazinesMap[slug] ?? magazinesCache[slug] ?? [];
                const isLoadingM = loadingMagSlug === slug;

                return (
                  <div key={category} className="border-b border-gray-100">
                    {/* Category row */}
                    <button
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                      onClick={() => {
                        const next = isExpanded ? null : category;
                        setMobileExpandedCategory(next);
                        if (next) dispatch({ type: 'SET_MENU', payload: next });
                      }}
                    >
                      <span className="font-bold text-[12px] text-[#001A4D] uppercase tracking-wider">
                        {category}
                      </span>
                      <ChevronRight
                        size={16}
                        className={`text-[#001A4D] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </button>

                    {/* Expanded panel */}
                    {isExpanded && (
                      <div className="bg-gray-50 px-4 pb-5 pt-1">

                        {/* Nav columns */}
                        {data.columns.map((col, idx) => (
                          <div key={idx} className="mb-4">
                            <p className="text-[#D97706] font-extrabold text-[10px] uppercase tracking-tight mb-2">
                              {col.title}
                            </p>
                            <ul className="space-y-2">
                              {col.links.map((link) => (
                                <li key={link}>
                                  <a
                                    href="#"
                                    className="flex items-center gap-1.5 text-gray-600 text-[12px] py-0.5"
                                    onClick={closeMobile}
                                  >
                                    <ArrowRight size={10} className="text-[#D97706] shrink-0" />
                                    {link}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        {/* Separator */}
                        <div className="border-t border-gray-200 my-3" />

                        {/* Magazines */}
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[#D97706] font-extrabold text-[10px] uppercase tracking-tight flex items-center gap-1">
                            <BookOpen size={10} />
                            Magazines — {category}
                          </p>
                          <Link
                            href="/magazine"
                            className="text-[9px] font-bold text-blue-600 flex items-center gap-0.5"
                            onClick={closeMobile}
                          >
                            Voir tous <ChevronRight size={10} />
                          </Link>
                        </div>

                        {isLoadingM ? (
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex gap-2.5 items-start bg-white rounded-lg p-2 border border-gray-100">
                                <div className="w-10 h-14 rounded-md bg-gray-100 animate-pulse shrink-0" />
                                <div className="flex-1 space-y-1.5 py-1">
                                  <div className="h-2.5 bg-gray-100 rounded animate-pulse" />
                                  <div className="h-2.5 bg-gray-100 rounded animate-pulse w-2/3" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : magazines.length === 0 ? (
                          <p className="text-gray-400 text-[11px] italic">
                            Aucun magazine disponible dans cette catégorie.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {magazines.slice(0, 4).map((mag) => (
                              <div key={mag.id} onClick={closeMobile}>
                                <MagazineMiniCardMobile magazine={mag} />
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
          </div>
        </>
      )}
    </>
  );
};

export default SubBar;























// // src/components/shared/SubBar.tsx
// "use client";

// import React, { useReducer, useEffect, useRef, useState } from 'react';
// import Link from 'next/link';
// import { ChevronDown, Clock, ArrowRight, Menu, X, ChevronRight, BookOpen, ExternalLink } from 'lucide-react';
// import { megaMenuData } from '@/constants/navigation';
// import api from '@/lib/api';
// import { getToken } from '@/lib/auth';

// // ─── Types ────────────────────────────────────────────────────────────────

// interface RecentArticle {
//   id: string;
//   title: string;
//   slug: string;
//   coverImage: string;
//   createdAt: string;
// }

// interface Magazine {
//   id: number;
//   title: string;
//   slug: string;
//   coverImage: string | null;
//   source: string;
//   publishedAt: string;
//   excerpt?: string | null;
// }

// // ─── Cache module-level ────────────────────────────────────────────────────

// const articlesCache: Record<string, RecentArticle[]> = {};
// const magazinesCache: Record<string, Magazine[]>     = {};

// // ─── State & Reducer ───────────────────────────────────────────────────────

// interface State {
//   activeMenu:      string | null;
//   newsMap:         Record<string, RecentArticle[]>;
//   magazinesMap:    Record<string, Magazine[]>;
//   loadingSlug:     string | null;
//   loadingMagSlug:  string | null;
// }

// type Action =
//   | { type: 'SET_MENU';         payload: string | null }
//   | { type: 'SET_LOADING';      payload: string | null }
//   | { type: 'SET_LOADING_MAG';  payload: string | null }
//   | { type: 'SET_NEWS';         slug: string; articles: RecentArticle[] }
//   | { type: 'SET_MAGAZINES';    slug: string; magazines: Magazine[] };

// const initialState: State = {
//   activeMenu:     null,
//   newsMap:        {},
//   magazinesMap:   {},
//   loadingSlug:    null,
//   loadingMagSlug: null,
// };

// function reducer(state: State, action: Action): State {
//   switch (action.type) {
//     case 'SET_MENU':
//       return { ...state, activeMenu: action.payload };
//     case 'SET_LOADING':
//       return { ...state, loadingSlug: action.payload };
//     case 'SET_LOADING_MAG':
//       return { ...state, loadingMagSlug: action.payload };
//     case 'SET_NEWS':
//       return { ...state, loadingSlug: null, newsMap: { ...state.newsMap, [action.slug]: action.articles } };
//     case 'SET_MAGAZINES':
//       return { ...state, loadingMagSlug: null, magazinesMap: { ...state.magazinesMap, [action.slug]: action.magazines } };
//     default:
//       return state;
//   }
// }

// // ─── Magazine mini-card ───────────────────────────────────────────────────

// function MagazineMiniCard({ magazine }: { magazine: Magazine }) {
//   return (
//     <Link
//       href={`/magazine/${magazine.slug}`}
//       className="group/mag flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
//     >
//       {/* Cover portrait */}
//       <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 shrink-0">
//         <img
//           src={magazine.coverImage || '/images/magazine-placeholder.jpg'}
//           alt={magazine.title}
//           className="w-full h-full object-cover group-hover/mag:scale-105 transition-transform duration-500"
//         />
//         {/* Source badge */}
//         <div className="absolute top-2 left-2">
//           <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none">
//             {magazine.source}
//           </span>
//         </div>
//       </div>
//       {/* Info */}
//       <div className="p-2 flex flex-col gap-1">
//         <p className="font-bold text-[10.5px] text-[#001A4D] leading-tight line-clamp-2">
//           {magazine.title}
//         </p>
//         <span className="flex items-center gap-1 text-[9px] font-bold text-[#D97706] mt-auto">
//           Lire <ExternalLink size={9} />
//         </span>
//       </div>
//     </Link>
//   );
// }

// // ─── Magazine mini-card mobile ────────────────────────────────────────────

// function MagazineMiniCardMobile({ magazine }: { magazine: Magazine }) {
//   return (
//     <Link
//       href={`/magazine/${magazine.slug}`}
//       className="flex gap-2.5 items-start bg-white rounded-lg p-2 border border-gray-100 active:bg-gray-50 transition-colors"
//     >
//       <div className="w-10 h-14 rounded-md overflow-hidden shrink-0 bg-gray-100">
//         <img
//           src={magazine.coverImage || '/images/magazine-placeholder.jpg'}
//           alt={magazine.title}
//           className="w-full h-full object-cover"
//         />
//       </div>
//       <div className="flex-1 min-w-0">
//         <span className="inline-block bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-semibold mb-1">
//           {magazine.source}
//         </span>
//         <p className="font-bold text-[10.5px] text-[#001A4D] leading-tight line-clamp-2">
//           {magazine.title}
//         </p>
//       </div>
//     </Link>
//   );
// }

// // ─── Skeleton loaders ────────────────────────────────────────────────────

// function MagazineSkeleton() {
//   return (
//     <div className="flex flex-col rounded-xl overflow-hidden border border-gray-100">
//       <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
//       <div className="p-2 space-y-1.5">
//         <div className="h-2.5 bg-gray-100 rounded animate-pulse" />
//         <div className="h-2.5 bg-gray-100 rounded animate-pulse w-2/3" />
//       </div>
//     </div>
//   );
// }

// function ArticleSkeleton() {
//   return (
//     <div className="flex-1 rounded-xl overflow-hidden border border-gray-100">
//       <div className="h-28 bg-gray-100 animate-pulse" />
//       <div className="p-3 space-y-2">
//         <div className="h-2 bg-gray-100 rounded animate-pulse w-1/2" />
//         <div className="h-3 bg-gray-100 rounded animate-pulse" />
//         <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
//       </div>
//     </div>
//   );
// }

// // ─── Component ────────────────────────────────────────────────────────────

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

// function getAuthHeaders(): HeadersInit {
//   const token = getToken();
//   return {
//     'Content-Type': 'application/json',
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// }

// const SubBar = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const { activeMenu, newsMap, magazinesMap, loadingSlug, loadingMagSlug } = state;

//   const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
//   const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);

//   const abortArticles = useRef<AbortController | null>(null);
//   const abortMagazines = useRef<AbortController | null>(null);

//   // ── Fetch articles ──────────────────────────────────────────────────────
//   useEffect(() => {
//     abortArticles.current?.abort();
//     if (!activeMenu) return;

//     const menuCategory = megaMenuData[activeMenu as keyof typeof megaMenuData];
//     if (!menuCategory) return;
//     const { slug } = menuCategory;

//     if (newsMap[slug] ?? articlesCache[slug]) return;

//     const controller = new AbortController();
//     abortArticles.current = controller;

//     queueMicrotask(() => {
//       if (controller.signal.aborted) return;
//       dispatch({ type: 'SET_LOADING', payload: slug });
//     });

//     api
//       .get('/mag/articles', {
//         params: { categorySlug: slug, pageSize: 3, page: 1, status: 'PUBLISHED', type: 'ARTICLE' },
//         signal: controller.signal,
//       })
//       .then((res) => {
//         const data: RecentArticle[] = res.data.data ?? [];
//         articlesCache[slug] = data;
//         dispatch({ type: 'SET_NEWS', slug, articles: data });
//       })
//       .catch((err) => {
//         if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
//           dispatch({ type: 'SET_NEWS', slug, articles: [] });
//         }
//       });

//     return () => controller.abort();
//   }, [activeMenu]);

//   // ── Fetch magazines ─────────────────────────────────────────────────────
//   useEffect(() => {
//     abortMagazines.current?.abort();
//     if (!activeMenu) return;

//     const menuCategory = megaMenuData[activeMenu as keyof typeof megaMenuData];
//     if (!menuCategory) return;
//     const { slug } = menuCategory;

//     if (magazinesMap[slug] ?? magazinesCache[slug]) return;

//     const controller = new AbortController();
//     abortMagazines.current = controller;

//     queueMicrotask(() => {
//       if (controller.signal.aborted) return;
//       dispatch({ type: 'SET_LOADING_MAG', payload: slug });
//     });

//     fetch(
//       `${BASE_URL}/magazines/rss?categorySlug=${slug}&pageSize=4&page=1`,
//       { headers: getAuthHeaders(), signal: controller.signal }
//     )
//       .then((r) => r.json())
//       .then((json) => {
//         const data: Magazine[] = json?.data?.magazines ?? [];
//         magazinesCache[slug] = data;
//         dispatch({ type: 'SET_MAGAZINES', slug, magazines: data });
//       })
//       .catch((err) => {
//         if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
//           dispatch({ type: 'SET_MAGAZINES', slug, magazines: [] });
//         }
//       });

//     return () => controller.abort();
//   }, [activeMenu]);

//   // ── Derived values ──────────────────────────────────────────────────────
//   const activeSlug = activeMenu
//     ? megaMenuData[activeMenu as keyof typeof megaMenuData]?.slug ?? null
//     : null;

//   const recentNews    = activeSlug ? (newsMap[activeSlug]      ?? articlesCache[activeSlug]  ?? []) : [];
//   const recentMags    = activeSlug ? (magazinesMap[activeSlug] ?? magazinesCache[activeSlug] ?? []) : [];
//   const loadingNews   = activeSlug !== null && loadingSlug    === activeSlug;
//   const loadingMags   = activeSlug !== null && loadingMagSlug === activeSlug;

//   const closeMobile = () => {
//     setIsMobileDrawerOpen(false);
//     setMobileExpandedCategory(null);
//   };

//   // ── JSX ─────────────────────────────────────────────────────────────────
//   return (
//     <>
//       {/* ── DESKTOP SubBar (lg+) ─────────────────────────────────────── */}
//       <div
//         className="relative w-full bg-gradient-to-b from-[#F8FAFC] to-[#EDF2F7] border-b border-gray-200 shadow-sm z-40 hidden lg:block"
//         onMouseLeave={() => dispatch({ type: 'SET_MENU', payload: null })}
//       >
//         <div className="max-w-[1400px] mx-auto px-4">
//           <ul className="flex items-center justify-center gap-6 py-3">
//             {Object.keys(megaMenuData).map((category) => (
//               <li
//                 key={category}
//                 onMouseEnter={() => dispatch({ type: 'SET_MENU', payload: category })}
//                 className="group cursor-pointer py-1"
//               >
//                 <div
//                   className={`flex items-center gap-1.5 font-bold text-[10.5px] tracking-wider transition-colors ${
//                     activeMenu === category ? 'text-blue-700' : 'text-[#001A4D]'
//                   }`}
//                 >
//                   {category}
//                   <ChevronDown
//                     size={14}
//                     className={`transition-transform duration-200 ${activeMenu === category ? 'rotate-180' : ''}`}
//                   />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* ── Mega menu panel ────────────────────────────────────────── */}
//         {activeMenu && megaMenuData[activeMenu as keyof typeof megaMenuData] && (
//           <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
//             <div className="max-w-[1400px] mx-auto p-8">

//               {/* Top row: columns + articles récents */}
//               <div className="flex gap-10 mb-8">
//                 {/* Nav columns */}
//                 {megaMenuData[activeMenu as keyof typeof megaMenuData].columns.map((col, idx) => (
//                   <div key={idx} className="w-1/5">
//                     <h3 className="text-[#D97706] font-extrabold text-[13px] mb-5 uppercase tracking-tight">
//                       {col.title}
//                     </h3>
//                     <ul className="space-y-3">
//                       {col.links.map((link) => (
//                         <li key={link}>
//                           <a
//                             href="#"
//                             className="text-gray-500 hover:text-blue-700 text-[12.5px] transition-colors leading-tight block"
//                           >
//                             {link}
//                           </a>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}

//                 {/* Articles récents */}
//                 <div className="flex-1">
//                   <h3 className="text-[#D97706] font-extrabold text-[13px] mb-5 uppercase">
//                     Actualités Récentes
//                   </h3>

//                   {loadingNews ? (
//                     <div className="flex gap-4">
//                       {[1, 2, 3].map((i) => <ArticleSkeleton key={i} />)}
//                     </div>
//                   ) : recentNews.length > 0 ? (
//                     <div className="flex gap-4">
//                       {recentNews.map((article) => (
//                         <Link
//                           key={article.id}
//                           href={`/actualites/${article.slug}`}
//                           className="flex-1 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group/card"
//                         >
//                           <div className="relative h-28 overflow-hidden">
//                             <img
//                               src={article.coverImage || '/images/placeholder.jpg'}
//                               alt={article.title}
//                               className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
//                             />
//                           </div>
//                           <div className="p-3">
//                             <div className="flex items-center gap-1.5 text-[9px] text-gray-400 mb-2">
//                               <Clock size={12} />
//                               {new Date(article.createdAt).toLocaleDateString('fr-FR', {
//                                 day: 'numeric', month: 'short', year: 'numeric',
//                               })}
//                             </div>
//                             <h4 className="font-bold text-[11.5px] text-[#001A4D] leading-tight mb-4 line-clamp-2 h-8">
//                               {article.title}
//                             </h4>
//                             <span className="flex items-center gap-1 text-[10px] font-bold text-[#D97706]">
//                               Lire la suite <ArrowRight size={12} />
//                             </span>
//                           </div>
//                         </Link>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-400 text-sm italic">
//                       Aucun article disponible dans cette catégorie.
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Bottom row: Magazines de la catégorie */}
//               <div className="border-t border-gray-100 pt-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-[#D97706] font-extrabold text-[13px] uppercase flex items-center gap-2">
//                     <BookOpen size={14} className="text-[#D97706]" />
//                     Magazines &amp; Revues de la catégorie
//                   </h3>
//                   <Link
//                     href="/magazine"
//                     className="text-[10.5px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
//                   >
//                     Voir tous <ChevronRight size={12} />
//                   </Link>
//                 </div>

//                 {loadingMags ? (
//                   <div className="grid grid-cols-4 gap-4">
//                     {[1, 2, 3, 4].map((i) => <MagazineSkeleton key={i} />)}
//                   </div>
//                 ) : recentMags.length > 0 ? (
//                   <div className="grid grid-cols-4 gap-4">
//                     {recentMags.slice(0, 4).map((mag) => (
//                       <MagazineMiniCard key={mag.id} magazine={mag} />
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-gray-400 text-[12px] italic">
//                     Aucun magazine disponible dans cette catégorie.
//                   </p>
//                 )}
//               </div>

//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── MOBILE SubBar trigger (< lg) ─────────────────────────────── */}
//       <div className="lg:hidden w-full bg-gradient-to-b from-[#F8FAFC] to-[#EDF2F7] border-b border-gray-200 shadow-sm z-40">
//         <div className="px-4 py-2 flex items-center justify-between">
//           <p className="text-[11px] font-bold text-[#001A4D] uppercase tracking-wider">Rubriques</p>
//           <button
//             onClick={() => setIsMobileDrawerOpen(true)}
//             className="flex items-center gap-1.5 bg-[#001A4D] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg"
//           >
//             <Menu size={14} />
//             Explorer
//           </button>
//         </div>
//       </div>

//       {/* ── MOBILE Drawer ────────────────────────────────────────────── */}
//       {isMobileDrawerOpen && (
//         <>
//           <div
//             className="fixed inset-0 bg-black/50 z-50 lg:hidden"
//             onClick={closeMobile}
//           />

//           <div className="fixed top-0 left-0 h-full w-[75%] max-w-sm bg-white shadow-2xl z-50 lg:hidden flex flex-col overflow-hidden">

//             {/* Header */}
//             <div className="flex items-center justify-between px-4 py-3 bg-[#001A4D] shrink-0">
//               <p className="text-white font-bold text-sm uppercase tracking-widest">Rubriques</p>
//               <button onClick={closeMobile} className="text-white p-1">
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Scrollable */}
//             <div className="overflow-y-auto flex-1">
//               {Object.entries(megaMenuData).map(([category, data]) => {
//                 const isExpanded = mobileExpandedCategory === category;
//                 const slug       = data.slug;
//                 const articles   = newsMap[slug]      ?? articlesCache[slug]  ?? [];
//                 const magazines  = magazinesMap[slug] ?? magazinesCache[slug] ?? [];
//                 const isLoadingA = loadingSlug    === slug;
//                 const isLoadingM = loadingMagSlug === slug;

//                 return (
//                   <div key={category} className="border-b border-gray-100">
//                     {/* Category row */}
//                     <button
//                       className="w-full flex items-center justify-between px-4 py-3.5 text-left"
//                       onClick={() => {
//                         const next = isExpanded ? null : category;
//                         setMobileExpandedCategory(next);
//                         if (next) dispatch({ type: 'SET_MENU', payload: next });
//                       }}
//                     >
//                       <span className="font-bold text-[12px] text-[#001A4D] uppercase tracking-wider">
//                         {category}
//                       </span>
//                       <ChevronRight
//                         size={16}
//                         className={`text-[#001A4D] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
//                       />
//                     </button>

//                     {/* Expanded panel */}
//                     {isExpanded && (
//                       <div className="bg-gray-50 px-4 pb-5 pt-1">

//                         {/* Nav columns */}
//                         {data.columns.map((col, idx) => (
//                           <div key={idx} className="mb-4">
//                             <p className="text-[#D97706] font-extrabold text-[10px] uppercase tracking-tight mb-2">
//                               {col.title}
//                             </p>
//                             <ul className="space-y-2">
//                               {col.links.map((link) => (
//                                 <li key={link}>
//                                   <a
//                                     href="#"
//                                     className="flex items-center gap-1.5 text-gray-600 text-[12px] py-0.5"
//                                     onClick={closeMobile}
//                                   >
//                                     <ArrowRight size={10} className="text-[#D97706] shrink-0" />
//                                     {link}
//                                   </a>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         ))}

//                         {/* Separator */}
//                         <div className="border-t border-gray-200 my-3" />

//                         {/* Articles récents */}
//                         <p className="text-[#D97706] font-extrabold text-[10px] uppercase tracking-tight mb-3">
//                           Actualités Récentes
//                         </p>

//                         {isLoadingA ? (
//                           <div className="space-y-2">
//                             {[1, 2].map((i) => (
//                               <div key={i} className="flex gap-3 items-start bg-white rounded-lg p-2 border border-gray-100">
//                                 <div className="w-14 h-14 rounded-md bg-gray-100 animate-pulse shrink-0" />
//                                 <div className="flex-1 space-y-1.5 py-1">
//                                   <div className="h-2 bg-gray-100 rounded animate-pulse w-1/3" />
//                                   <div className="h-3 bg-gray-100 rounded animate-pulse" />
//                                   <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         ) : articles.length === 0 ? (
//                           <p className="text-gray-400 text-[11px] italic mb-3">Aucun article disponible.</p>
//                         ) : (
//                           <div className="space-y-2 mb-4">
//                             {articles.slice(0, 3).map((article) => (
//                               <Link
//                                 key={article.id}
//                                 href={`/actualites/${article.slug}`}
//                                 className="flex gap-3 items-start bg-white rounded-lg p-2 border border-gray-100 active:bg-gray-50 transition-colors"
//                                 onClick={closeMobile}
//                               >
//                                 <div className="w-14 h-14 rounded-md overflow-hidden shrink-0">
//                                   <img
//                                     src={article.coverImage || '/images/placeholder.jpg'}
//                                     alt={article.title}
//                                     className="w-full h-full object-cover"
//                                   />
//                                 </div>
//                                 <div className="flex-1 min-w-0">
//                                   <div className="flex items-center gap-1 text-[9px] text-gray-400 mb-1">
//                                     <Clock size={10} />
//                                     {new Date(article.createdAt).toLocaleDateString('fr-FR', {
//                                       day: 'numeric', month: 'short', year: 'numeric',
//                                     })}
//                                   </div>
//                                   <p className="font-bold text-[11px] text-[#001A4D] leading-tight line-clamp-2">
//                                     {article.title}
//                                   </p>
//                                 </div>
//                               </Link>
//                             ))}
//                           </div>
//                         )}

//                         {/* Separator */}
//                         <div className="border-t border-gray-200 my-3" />

//                         {/* Magazines */}
//                         <div className="flex items-center justify-between mb-3">
//                           <p className="text-[#D97706] font-extrabold text-[10px] uppercase tracking-tight flex items-center gap-1">
//                             <BookOpen size={10} />
//                             Magazines
//                           </p>
//                           <Link
//                             href="/magazine"
//                             className="text-[9px] font-bold text-blue-600 flex items-center gap-0.5"
//                             onClick={closeMobile}
//                           >
//                             Voir tous <ChevronRight size={10} />
//                           </Link>
//                         </div>

//                         {isLoadingM ? (
//                           <div className="space-y-2">
//                             {[1, 2].map((i) => (
//                               <div key={i} className="flex gap-2.5 items-start bg-white rounded-lg p-2 border border-gray-100">
//                                 <div className="w-10 h-14 rounded-md bg-gray-100 animate-pulse shrink-0" />
//                                 <div className="flex-1 space-y-1.5 py-1">
//                                   <div className="h-2.5 bg-gray-100 rounded animate-pulse" />
//                                   <div className="h-2.5 bg-gray-100 rounded animate-pulse w-2/3" />
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         ) : magazines.length === 0 ? (
//                           <p className="text-gray-400 text-[11px] italic">Aucun magazine disponible.</p>
//                         ) : (
//                           <div className="space-y-2">
//                             {magazines.slice(0, 3).map((mag) => (
//                               <div key={mag.id} onClick={closeMobile}>
//                                 <MagazineMiniCardMobile magazine={mag} />
//                               </div>
//                             ))}
//                           </div>
//                         )}

//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default SubBar;



















// // src/components/shared/SubBar.tsx
// "use client";

// import React, { useReducer, useEffect, useRef, useState } from 'react';
// import Link from 'next/link';
// import { ChevronDown, Clock, ArrowRight, Menu, X, ChevronRight } from 'lucide-react';
// import { megaMenuData } from '@/constants/navigation';
// import api from '@/lib/api';

// interface RecentArticle {
//   id: string;
//   title: string;
//   slug: string;
//   coverImage: string;
//   createdAt: string;
// }

// // ─── Cache module-level ────────────────────────────────────────────────────
// const articlesCache: Record<string, RecentArticle[]> = {};

// // ─── State & Reducer ───────────────────────────────────────────────────────
// interface State {
//   activeMenu: string | null;
//   newsMap:    Record<string, RecentArticle[]>;
//   loadingSlug: string | null;
// }

// type Action =
//   | { type: 'SET_MENU';    payload: string | null }
//   | { type: 'SET_LOADING'; payload: string | null }
//   | { type: 'SET_NEWS';    slug: string; articles: RecentArticle[] };

// const initialState: State = {
//   activeMenu:  null,
//   newsMap:     {},
//   loadingSlug: null,
// };

// function reducer(state: State, action: Action): State {
//   switch (action.type) {
//     case 'SET_MENU':
//       return { ...state, activeMenu: action.payload };
//     case 'SET_LOADING':
//       return { ...state, loadingSlug: action.payload };
//     case 'SET_NEWS':
//       return {
//         ...state,
//         loadingSlug: null,
//         newsMap: { ...state.newsMap, [action.slug]: action.articles },
//       };
//     default:
//       return state;
//   }
// }

// // ─── Component ────────────────────────────────────────────────────────────
// const SubBar = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const { activeMenu, newsMap, loadingSlug } = state;

//   // Mobile state
//   const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
//   const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);

//   const abortRef = useRef<AbortController | null>(null);

//   useEffect(() => {
//     abortRef.current?.abort();

//     if (!activeMenu) return;

//     const menuCategory = megaMenuData[activeMenu as keyof typeof megaMenuData];
//     if (!menuCategory) return;

//     const { slug } = menuCategory;

//     if (newsMap[slug] ?? articlesCache[slug]) return;

//     const controller = new AbortController();
//     abortRef.current = controller;

//     queueMicrotask(() => {
//       if (controller.signal.aborted) return;
//       dispatch({ type: 'SET_LOADING', payload: slug });
//     });

//     api
//       .get('/mag/articles', {
//         params: { categorySlug: slug, pageSize: 3, page: 1, status: 'PUBLISHED', type: 'ARTICLE' },
//         signal: controller.signal,
//       })
//       .then((res) => {
//         const data: RecentArticle[] = res.data.data ?? [];
//         articlesCache[slug] = data;
//         dispatch({ type: 'SET_NEWS', slug, articles: data });
//       })
//       .catch((err) => {
//         if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
//           console.error('SubBar fetch error:', err);
//           dispatch({ type: 'SET_NEWS', slug, articles: [] });
//         }
//       });

//     return () => controller.abort();
//   }, [activeMenu]);

//   const activeSlug  = activeMenu
//     ? megaMenuData[activeMenu as keyof typeof megaMenuData]?.slug ?? null
//     : null;

//   const recentNews  = activeSlug
//     ? (newsMap[activeSlug] ?? articlesCache[activeSlug] ?? [])
//     : [];

//   const loadingNews = activeSlug !== null && loadingSlug === activeSlug;

//   // ─── JSX ────────────────────────────────────────────────────────────────
//   return (
//     <>
//       {/* ── DESKTOP SubBar (lg+) ─────────────────────────────────────── */}
//       <div
//         className="relative w-full bg-gradient-to-b from-[#F8FAFC] to-[#EDF2F7] border-b border-gray-200 shadow-sm z-40 hidden lg:block"
//         onMouseLeave={() => dispatch({ type: 'SET_MENU', payload: null })}
//       >
//         <div className="max-w-[1400px] mx-auto px-4">
//           <ul className="flex items-center justify-center gap-6 py-3">
//             {Object.keys(megaMenuData).map((category) => (
//               <li
//                 key={category}
//                 onMouseEnter={() => dispatch({ type: 'SET_MENU', payload: category })}
//                 className="group cursor-pointer py-1"
//               >
//                 <div
//                   className={`flex items-center gap-1.5 font-bold text-[10.5px] tracking-wider transition-colors ${
//                     activeMenu === category ? 'text-blue-700' : 'text-[#001A4D]'
//                   }`}
//                 >
//                   {category}
//                   <ChevronDown
//                     size={14}
//                     className={`transition-transform duration-200 ${
//                       activeMenu === category ? 'rotate-180' : ''
//                     }`}
//                   />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {activeMenu && megaMenuData[activeMenu as keyof typeof megaMenuData] && (
//           <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
//             <div className="max-w-[1400px] mx-auto p-8 flex gap-10">

//               {megaMenuData[activeMenu as keyof typeof megaMenuData].columns.map((col, idx) => (
//                 <div key={idx} className="w-1/5">
//                   <h3 className="text-[#D97706] font-extrabold text-[13px] mb-5 uppercase tracking-tight">
//                     {col.title}
//                   </h3>
//                   <ul className="space-y-3">
//                     {col.links.map((link) => (
//                       <li key={link}>
//                         <a
//                           href="#"
//                           className="text-gray-500 hover:text-blue-700 text-[12.5px] transition-colors leading-tight block"
//                         >
//                           {link}
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}

//               <div className="flex-1">
//                 <h3 className="text-[#D97706] font-extrabold text-[13px] mb-5 uppercase">
//                   Actualités Récentes
//                 </h3>

//                 {loadingNews ? (
//                   <div className="flex gap-4">
//                     {[1, 2, 3].map((i) => (
//                       <div key={i} className="flex-1 rounded-xl overflow-hidden border border-gray-100">
//                         <div className="h-28 bg-gray-100 animate-pulse" />
//                         <div className="p-3 space-y-2">
//                           <div className="h-2 bg-gray-100 rounded animate-pulse w-1/2" />
//                           <div className="h-3 bg-gray-100 rounded animate-pulse" />
//                           <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : recentNews.length > 0 ? (
//                   <div className="flex gap-4">
//                     {recentNews.map((article) => (
//                       <Link
//                         key={article.id}
//                         href={`/actualites/${article.slug}`}
//                         className="flex-1 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group/card"
//                       >
//                         <div className="relative h-28 overflow-hidden">
//                           <img
//                             src={article.coverImage || '/images/placeholder.jpg'}
//                             alt={article.title}
//                             className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
//                           />
//                         </div>
//                         <div className="p-3">
//                           <div className="flex items-center gap-1.5 text-[9px] text-gray-400 mb-2">
//                             <Clock size={12} />
//                             {new Date(article.createdAt).toLocaleDateString('fr-FR', {
//                               day: 'numeric',
//                               month: 'short',
//                               year: 'numeric',
//                             })}
//                           </div>
//                           <h4 className="font-bold text-[11.5px] text-[#001A4D] leading-tight mb-4 line-clamp-2 h-8">
//                             {article.title}
//                           </h4>
//                           <span className="flex items-center gap-1 text-[10px] font-bold text-[#D97706] hover:text-orange-700">
//                             Lire la suite <ArrowRight size={12} />
//                           </span>
//                         </div>
//                       </Link>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="flex gap-4">
//                     <p className="text-gray-400 text-sm italic">
//                       Aucun article disponible dans cette catégorie.
//                     </p>
//                   </div>
//                 )}
//               </div>

//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── MOBILE SubBar trigger (< lg) ─────────────────────────────── */}
//       <div className="lg:hidden w-full bg-gradient-to-b from-[#F8FAFC] to-[#EDF2F7] border-b border-gray-200 shadow-sm z-40">
//         <div className="px-4 py-2 flex items-center justify-between">
//           <p className="text-[11px] font-bold text-[#001A4D] uppercase tracking-wider">
//             Rubriques
//           </p>
//           <button
//             onClick={() => setIsMobileDrawerOpen(true)}
//             className="flex items-center gap-1.5 bg-[#001A4D] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg"
//           >
//             <Menu size={14} />
//             Explorer
//           </button>
//         </div>
//       </div>

//       {/* ── MOBILE Drawer ────────────────────────────────────────────── */}
//       {isMobileDrawerOpen && (
//         <>
//           {/* Overlay */}
//           <div
//             className="fixed inset-0 bg-black/50 z-50 lg:hidden"
//             onClick={() => {
//               setIsMobileDrawerOpen(false);
//               setMobileExpandedCategory(null);
//             }}
//           />

//           {/* Drawer panel — 75% width, slide from left */}
//           <div className="fixed top-0 left-0 h-full w-[75%] max-w-sm bg-white shadow-2xl z-50 lg:hidden flex flex-col overflow-hidden">

//             {/* Drawer header */}
//             <div className="flex items-center justify-between px-4 py-3 bg-[#001A4D] shrink-0">
//               <p className="text-white font-bold text-sm uppercase tracking-widest">Rubriques</p>
//               <button
//                 onClick={() => {
//                   setIsMobileDrawerOpen(false);
//                   setMobileExpandedCategory(null);
//                 }}
//                 className="text-white p-1"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Scrollable content */}
//             <div className="overflow-y-auto flex-1">
//               {Object.entries(megaMenuData).map(([category, data]) => {
//                 const isExpanded = mobileExpandedCategory === category;

//                 return (
//                   <div key={category} className="border-b border-gray-100">
//                     {/* Category row */}
//                     <button
//                       className="w-full flex items-center justify-between px-4 py-3.5 text-left"
//                       onClick={() => {
//                         const next = isExpanded ? null : category;
//                         setMobileExpandedCategory(next);
//                         if (next) dispatch({ type: 'SET_MENU', payload: next });
//                       }}
//                     >
//                       <span className="font-bold text-[12px] text-[#001A4D] uppercase tracking-wider">
//                         {category}
//                       </span>
//                       <ChevronRight
//                         size={16}
//                         className={`text-[#001A4D] transition-transform duration-200 ${
//                           isExpanded ? 'rotate-90' : ''
//                         }`}
//                       />
//                     </button>

//                     {/* Expanded: columns + links + articles récents */}
//                     {isExpanded && (
//                       <div className="bg-gray-50 px-4 pb-4 pt-1">
//                         {/* Colonnes de liens */}
//                         {data.columns.map((col, idx) => (
//                           <div key={idx} className="mb-4">
//                             <p className="text-[#D97706] font-extrabold text-[10px] uppercase tracking-tight mb-2">
//                               {col.title}
//                             </p>
//                             <ul className="space-y-2">
//                               {col.links.map((link) => (
//                                 <li key={link}>
//                                   <a
//                                     href="#"
//                                     className="flex items-center gap-1.5 text-gray-600 text-[12px] py-0.5"
//                                     onClick={() => {
//                                       setIsMobileDrawerOpen(false);
//                                       setMobileExpandedCategory(null);
//                                     }}
//                                   >
//                                     <ArrowRight size={10} className="text-[#D97706] shrink-0" />
//                                     {link}
//                                   </a>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         ))}

//                         {/* Séparateur */}
//                         <div className="border-t border-gray-200 my-3" />

//                         {/* Articles récents */}
//                         <p className="text-[#D97706] font-extrabold text-[10px] uppercase tracking-tight mb-3">
//                           Actualités Récentes
//                         </p>

//                         {(() => {
//                           const slug = data.slug;
//                           const articles = newsMap[slug] ?? articlesCache[slug] ?? [];
//                           const isLoading = loadingSlug === slug;

//                           if (isLoading) {
//                             return (
//                               <div className="space-y-2">
//                                 {[1, 2].map((i) => (
//                                   <div key={i} className="flex gap-3 items-start bg-white rounded-lg p-2 border border-gray-100">
//                                     <div className="w-14 h-14 rounded-md bg-gray-100 animate-pulse shrink-0" />
//                                     <div className="flex-1 space-y-1.5 py-1">
//                                       <div className="h-2 bg-gray-100 rounded animate-pulse w-1/3" />
//                                       <div className="h-3 bg-gray-100 rounded animate-pulse" />
//                                       <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             );
//                           }

//                           if (articles.length === 0) {
//                             return (
//                               <p className="text-gray-400 text-[11px] italic">
//                                 Aucun article disponible.
//                               </p>
//                             );
//                           }

//                           return (
//                             <div className="space-y-2">
//                               {articles.slice(0, 3).map((article) => (
//                                 <Link
//                                   key={article.id}
//                                   href={`/actualites/${article.slug}`}
//                                   className="flex gap-3 items-start bg-white rounded-lg p-2 border border-gray-100 active:bg-gray-50 transition-colors"
//                                   onClick={() => {
//                                     setIsMobileDrawerOpen(false);
//                                     setMobileExpandedCategory(null);
//                                   }}
//                                 >
//                                   <div className="w-14 h-14 rounded-md overflow-hidden shrink-0">
//                                     <img
//                                       src={article.coverImage || '/images/placeholder.jpg'}
//                                       alt={article.title}
//                                       className="w-full h-full object-cover"
//                                     />
//                                   </div>
//                                   <div className="flex-1 min-w-0">
//                                     <div className="flex items-center gap-1 text-[9px] text-gray-400 mb-1">
//                                       <Clock size={10} />
//                                       {new Date(article.createdAt).toLocaleDateString('fr-FR', {
//                                         day: 'numeric',
//                                         month: 'short',
//                                         year: 'numeric',
//                                       })}
//                                     </div>
//                                     <p className="font-bold text-[11px] text-[#001A4D] leading-tight line-clamp-2">
//                                       {article.title}
//                                     </p>
//                                   </div>
//                                 </Link>
//                               ))}
//                             </div>
//                           );
//                         })()}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default SubBar;