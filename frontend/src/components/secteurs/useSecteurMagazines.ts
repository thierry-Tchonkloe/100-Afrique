// src/components/secteurs/useSecteurMagazines.ts
"use client";
import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';

export interface SecteurMagazine {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage: string | null;
  source: string;
  publishedAt: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const PAGE_SIZE = 9;

export function useSecteurMagazines(slug: string) {
  const [magazines, setMagazines]     = useState<SecteurMagazine[]>([]);
  const [pagination, setPagination]   = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery]             = useState('');
  const [draftQuery, setDraftQuery]   = useState('');
  const [loading, setLoading]         = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  const fetchMagazines = useCallback(async (page: number, search: string) => {
    page === 1 && !search ? setLoading(true) : setPageLoading(true);
    try {
      const res = await api.get('/magazines/rss', {
        params: { category: slug, pageSize: PAGE_SIZE, page, ...(search ? { search } : {}) },
      });
      setMagazines(res.data?.data?.magazines ?? []);
      setPagination(res.data?.data?.pagination ?? null);
    } catch {
      /* fail silently */
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchMagazines(1, '');
  }, [fetchMagazines]);

  const handleSearch = () => {
    setQuery(draftQuery);
    setCurrentPage(1);
    fetchMagazines(1, draftQuery);
  };

  const clearSearch = () => {
    setDraftQuery('');
    setQuery('');
    fetchMagazines(1, '');
  };

  const handlePageChange = (page: number) => {
    if (!pagination || page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
    fetchMagazines(page, query);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    magazines, pagination, currentPage, query, draftQuery, loading, pageLoading,
    setDraftQuery, handleSearch, clearSearch, handlePageChange,
  };
}