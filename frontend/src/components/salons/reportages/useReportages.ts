// src/components/salons/reportages/useReportages.ts
"use client";
import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import {
  buildRequestParams,
  type Reportage,
  type ReportageApiResponse,
  type ReportageFilterState,
} from './reportageUtils';

const DEFAULT_FILTERS: ReportageFilterState = { year: 'all', region: 'all', type: 'all' };

export function useReportages() {
  const [reportages, setReportages]     = useState<Reportage[]>([]);
  const [loading, setLoading]           = useState(true);
  const [loadingMore, setLoadingMore]   = useState(false);
  const [page, setPage]                 = useState(1);
  const [hasMore, setHasMore]           = useState(false);
  const [filters, setFilters]           = useState<ReportageFilterState>(DEFAULT_FILTERS);

  const fetchReportages = useCallback((targetPage: number, append: boolean) => {
    if (append) setLoadingMore(true); else setLoading(true);

    const params = buildRequestParams(filters, targetPage);

    api.get<ReportageApiResponse>('/mag/articles', { params })
      .then((res) => {
        const newItems = res.data.data ?? [];
        const pagination = res.data.pagination;

        setReportages((prev) => (append ? [...prev, ...newItems] : newItems));
        setPage(targetPage);
        setHasMore(pagination?.hasNextPage ?? false);
      })
      .catch((err: AxiosError) => {
        console.error('Erreur reportages:', err.message);
        if (!append) setReportages([]);
        setHasMore(false);
      })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Rechargement complet à chaque changement de filtre
  useEffect(() => {
    fetchReportages(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    fetchReportages(page + 1, true);
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return { reportages, loading, loadingMore, hasMore, filters, setFilters, resetFilters, handleLoadMore };
}