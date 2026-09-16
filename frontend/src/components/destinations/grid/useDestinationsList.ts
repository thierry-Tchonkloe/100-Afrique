// src/components/destinations/grid/useDestinationsList.ts
"use client";
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AxiosError } from 'axios';
import api from '@/lib/api';

export interface GridDestination {
  id: number;
  name: string;
  slug: string;
  description?: string;
  coverImage: string;
  continent?: string;
  articleCount?: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    data: GridDestination[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      pageSize: number;
    };
  };
}

export const CONTINENTS = ['TOUTES', 'AFRIQUE', 'EUROPE', 'AMÉRIQUES', 'ASIE/MOYEN-ORIENT', 'OCÉANIE'];

export function useDestinationsList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [destinations, setDestinations] = useState<GridDestination[]>([]);
  const [filter, setFilter]             = useState('TOUTES');
  const [searchQuery, setSearchQuery]   = useState('');
  const [loading, setLoading]           = useState(false);
  const [page, setPage]                 = useState(1);
  const [hasMore, setHasMore]           = useState(true);

  // Filtre région précise (ex: "Afrique de l'Ouest"), alimenté par l'URL
  // (?region=...) quand on arrive depuis le méga-menu "Destinations" du
  // Header. Plus spécifique que le filtre continent : quand il est actif,
  // il prend le dessus sur les pills continent.
  const [regionFilter, setRegionFilter] = useState<string | null>(null);

  // ── Synchronisation avec l'URL (?region=...) ──
  useEffect(() => {
    const r = searchParams.get('region');
    setRegionFilter(r && r.trim() ? r : null);
  }, [searchParams]);

  const fetchDestinations = useCallback(async (isNewFilter = false) => {
    if (loading) return;
    try {
      setLoading(true);
      const currentPage = isNewFilter ? 1 : page;
      const response = await api.get<ApiResponse>('/destinations', {
        params: {
          // La région précise (venant du header) est prioritaire ; sinon
          // on retombe sur le filtre continent groupé.
          region: regionFilter || undefined,
          continent: !regionFilter && filter !== 'TOUTES' ? filter : undefined,
          search: searchQuery || undefined,
          page: currentPage,
          pageSize: 8,
          status: 'PUBLISHED',
        },
      });
      const apiData = response.data.data;
      const newDestinations = apiData.data || [];
      const pagination = apiData.pagination;

      if (isNewFilter) {
        setDestinations(newDestinations);
        setPage(2);
      } else {
        setDestinations((prev) => [...prev, ...newDestinations]);
        setPage((prev) => prev + 1);
      }
      setHasMore(pagination ? pagination.currentPage < pagination.totalPages : newDestinations.length >= 8);
    } catch (error) {
      if (error instanceof AxiosError) console.error('Erreur destinations:', error.response?.data || error.message);
      if (isNewFilter) setDestinations([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchQuery, page, regionFilter]);

  useEffect(() => {
    const t = setTimeout(() => fetchDestinations(true), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchQuery, regionFilter]);

  const clearRegionFilter = () => {
    setRegionFilter(null);
    router.replace('/destinations', { scroll: false });
  };

  const handleContinentClick = (c: string) => {
    // Choisir un continent explicitement doit prendre le pas sur un
    // filtre région venant de l'URL, sinon les deux entreraient en
    // conflit silencieusement.
    if (regionFilter) clearRegionFilter();
    setFilter(c);
  };

  return {
    destinations, filter, searchQuery, loading, hasMore, regionFilter,
    setSearchQuery, clearRegionFilter, handleContinentClick,
    loadMore: () => fetchDestinations(false),
  };
}