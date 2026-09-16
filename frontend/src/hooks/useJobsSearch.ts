// src/hooks/useJobsSearch.ts
// Charge la liste paginée des offres publiques en fonction des filtres,
// avec debounce sur la recherche texte / localisation et repli mock.

import { useState, useEffect, useCallback } from 'react';
import { fetchPublicJobs, MOCK_OFFRES } from '@/services/emploi-public.service';
import type { PublicOffre } from '@/services/emploi-public.service';
import { useDebouncedValue } from './useDebouncedValue';
import type { JobsFilters } from '@/components/emploi/jobs/JobsFilterTypes';

const LIMIT = 8;

export function useJobsSearch(filters: JobsFilters) {
  const [offres, setOffres] = useState<PublicOffre[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const debouncedSearch = useDebouncedValue(filters.search);
  const debouncedLocation = useDebouncedValue(filters.location);

  const loadJobs = useCallback(async (reset = false) => {
    const p = reset ? 1 : page;
    if (reset) setLoading(true); else setLoadingMore(true);

    try {
      const res = await fetchPublicJobs({
        search: debouncedSearch || undefined,
        location: debouncedLocation || undefined,
        contractType: filters.contractTypes.length ? filters.contractTypes.join(',') : undefined,
        remote: filters.remote.length ? filters.remote.join(',') : undefined,
        page: p, limit: LIMIT,
      });
      if (reset) {
        setOffres(res.offres.length ? res.offres : MOCK_OFFRES.slice(0, LIMIT));
        setTotal(res.total || MOCK_OFFRES.length);
      } else {
        setOffres((prev) => [...prev, ...res.offres]);
        setTotal(res.total);
      }
      setHasMore(p * LIMIT < (res.total || 0));
      if (!reset) setPage(p + 1);
    } catch {
      if (reset) {
        setOffres(MOCK_OFFRES);
        setTotal(MOCK_OFFRES.length);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearch, debouncedLocation, filters.contractTypes, filters.remote, page]);

  useEffect(() => {
    setPage(1);
    loadJobs(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, debouncedLocation, filters.contractTypes, filters.remote]);

  function loadMore() {
    setPage((p) => p + 1);
    loadJobs(false);
  }

  return { offres, total, loading, loadingMore, hasMore, loadMore };
}
