// src/components/shared/SubBar.tsx
"use client";

import React, { useReducer, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, Clock, ArrowRight } from 'lucide-react';
import { megaMenuData } from '@/constants/navigation';
import api from '@/lib/api';

interface RecentArticle {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  createdAt: string;
}

// ─── Cache module-level ────────────────────────────────────────────────────
const articlesCache: Record<string, RecentArticle[]> = {};

// ─── State & Reducer ───────────────────────────────────────────────────────
interface State {
  activeMenu: string | null;
  newsMap:    Record<string, RecentArticle[]>;
  loadingSlug: string | null;
}

type Action =
  | { type: 'SET_MENU';    payload: string | null }
  | { type: 'SET_LOADING'; payload: string | null }
  | { type: 'SET_NEWS';    slug: string; articles: RecentArticle[] };

const initialState: State = {
  activeMenu:  null,
  newsMap:     {},
  loadingSlug: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_MENU':
      return { ...state, activeMenu: action.payload };
    case 'SET_LOADING':
      return { ...state, loadingSlug: action.payload };
    case 'SET_NEWS':
      return {
        ...state,
        loadingSlug: null,
        newsMap: { ...state.newsMap, [action.slug]: action.articles },
      };
    default:
      return state;
  }
}

// ─── Component ────────────────────────────────────────────────────────────
const SubBar = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { activeMenu, newsMap, loadingSlug } = state;

  const abortRef = useRef<AbortController | null>(null);

  // ✅ L'effet ne fait QUE lancer/annuler des requêtes réseau.
  // Tous les setState sont remplacés par dispatch dans les callbacks async.
  useEffect(() => {
    abortRef.current?.abort();

    if (!activeMenu) return;

    const menuCategory = megaMenuData[activeMenu as keyof typeof megaMenuData];
    if (!menuCategory) return;

    const { slug } = menuCategory;

    // Déjà en cache → rien à faire, le rendu se fait via newsMap / articlesCache
    if (newsMap[slug] ?? articlesCache[slug]) return;

    // Lancement du fetch — dispatch dans un callback async, jamais synchrone
    const controller = new AbortController();
    abortRef.current = controller;

    // ✅ startTransition ou simplement un microtask pour sortir du corps sync
    queueMicrotask(() => {
      if (controller.signal.aborted) return;
      dispatch({ type: 'SET_LOADING', payload: slug });
    });

    api
      .get('/mag/articles', {
        params: { categorySlug: slug, pageSize: 3, page: 1, status: 'PUBLISHED' },
        signal: controller.signal,
      })
      .then((res) => {
        const data: RecentArticle[] = res.data.data ?? [];
        articlesCache[slug] = data;
        dispatch({ type: 'SET_NEWS', slug, articles: data });
      })
      .catch((err) => {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          console.error('SubBar fetch error:', err);
          dispatch({ type: 'SET_NEWS', slug, articles: [] });
        }
      });

    return () => controller.abort();
  }, [activeMenu]); // newsMap hors des deps intentionnellement

  // ─── Valeurs dérivées (pas de state supplémentaire) ─────────────────────
  const activeSlug  = activeMenu
    ? megaMenuData[activeMenu as keyof typeof megaMenuData]?.slug ?? null
    : null;

  const recentNews  = activeSlug
    ? (newsMap[activeSlug] ?? articlesCache[activeSlug] ?? [])
    : [];

  const loadingNews = activeSlug !== null && loadingSlug === activeSlug;

  // ─── JSX ────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative w-full bg-gradient-to-b from-[#F8FAFC] to-[#EDF2F7] border-b border-gray-200 shadow-sm z-40"
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
                  className={`transition-transform duration-200 ${
                    activeMenu === category ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {activeMenu && megaMenuData[activeMenu as keyof typeof megaMenuData] && (
        <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="max-w-[1400px] mx-auto p-8 flex gap-10">

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

            <div className="flex-1">
              <h3 className="text-[#D97706] font-extrabold text-[13px] mb-5 uppercase">
                Actualités Récentes
              </h3>

              {loadingNews ? (
                <div className="flex gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex-1 rounded-xl overflow-hidden border border-gray-100">
                      <div className="h-28 bg-gray-100 animate-pulse" />
                      <div className="p-3 space-y-2">
                        <div className="h-2 bg-gray-100 rounded animate-pulse w-1/2" />
                        <div className="h-3 bg-gray-100 rounded animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentNews.length > 0 ? (
                <div className="flex gap-4">
                  {recentNews.map((article) => (
                    <Link
                      key={article.id}
                      href={`/actualites/${article.slug}`}
                      className="flex-1 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group/card"
                    >
                      <div className="relative h-28 overflow-hidden">
                        <img
                          src={article.coverImage || '/images/placeholder.jpg'}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-1.5 text-[9px] text-gray-400 mb-2">
                          <Clock size={12} />
                          {new Date(article.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <h4 className="font-bold text-[11.5px] text-[#001A4D] leading-tight mb-4 line-clamp-2 h-8">
                          {article.title}
                        </h4>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#D97706] hover:text-orange-700">
                          Lire la suite <ArrowRight size={12} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex gap-4">
                  <p className="text-gray-400 text-sm italic">
                    Aucun article disponible dans cette catégorie.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default SubBar;