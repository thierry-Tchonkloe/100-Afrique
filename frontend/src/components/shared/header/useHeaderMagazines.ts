// src/components/shared/header/useHeaderMagazines.ts
"use client";
import { useReducer, useRef } from 'react';
import { getToken } from '@/lib/auth';
import { megaMenuData } from '@/constants/navigation';

export interface HeaderMagazine {
  id: number;
  title: string;
  slug: string;
  coverImage: string | null;
  source: string;
  publishedAt: string;
  excerpt?: string | null;
}

// Cache module-level : survit aux remontages du composant Header,
// évite de re-fetcher une catégorie déjà chargée dans la session.
const magazinesCache: Record<string, HeaderMagazine[]> = {};

interface SubState {
  magazinesMap: Record<string, HeaderMagazine[]>;
  loadingMagSlug: string | null;
}

type SubAction =
  | { type: 'SET_LOADING_MAG'; payload: string | null }
  | { type: 'SET_MAGAZINES'; slug: string; magazines: HeaderMagazine[] };

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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function useHeaderMagazines() {
  const [state, dispatch] = useReducer(subReducer, { magazinesMap: {}, loadingMagSlug: null });
  const { magazinesMap, loadingMagSlug } = state;
  const abortRef = useRef<AbortController | null>(null);

  const fetchMagazines = (category: string) => {
    const menuCategory = megaMenuData[category as keyof typeof megaMenuData];
    if (!menuCategory) return;
    const { slug } = menuCategory;

    if (magazinesMap[slug] !== undefined || magazinesCache[slug] !== undefined) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: 'SET_LOADING_MAG', payload: slug });

    fetch(
      `${BASE_URL}/magazines/rss?category=${slug}&pageSize=3&page=1`,
      { headers: getAuthHeaders(), signal: controller.signal }
    )
      .then((r) => r.json())
      .then((json) => {
        const data: HeaderMagazine[] = json?.data?.magazines ?? [];
        magazinesCache[slug] = data;
        dispatch({ type: 'SET_MAGAZINES', slug, magazines: data });
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
          dispatch({ type: 'SET_MAGAZINES', slug, magazines: [] });
        }
      });
  };

  const getMagazinesFor = (slug: string): HeaderMagazine[] =>
    magazinesMap[slug] ?? magazinesCache[slug] ?? [];

  const isLoading = (slug: string): boolean => loadingMagSlug === slug;

  return { fetchMagazines, getMagazinesFor, isLoading };
}