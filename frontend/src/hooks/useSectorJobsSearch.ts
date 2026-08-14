// src/hooks/useSectorJobsSearch.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchPublicJobs, MOCK_OFFRES } from '@/services/emploi-public.service';
import type { PublicOffre } from '@/services/emploi-public.service';
import { normalizeSector, type SectorKey } from '@/lib/sectors';
import type { SectorConfig } from '@/data/sectorPageConfig';

const LIMIT = 9;

export function useSectorJobsSearch(sector: SectorKey | '', cfg: SectorConfig | undefined) {
  const [offres, setOffres] = useState<PublicOffre[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState('');
  const [contractType, setContractType] = useState('');
  const [location, setLocation] = useState('');

  const loadOffres = useCallback(async (reset = false) => {
    if (!sector || !cfg) return;
    const p = reset ? 1 : page;
    if (reset) setLoading(true); else setLoadingMore(true);

    try {
      const res = await fetchPublicJobs({
        sector,
        search: search || undefined,
        location: location || undefined,
        contractType: contractType || undefined,
        page: p, limit: LIMIT,
      });

      const list = res.offres?.length
        ? res.offres
        : MOCK_OFFRES.filter((o) => normalizeSector(o.sector) === sector);

      if (reset) {
        setOffres(list);
        setTotal(res.total || list.length);
      } else {
        setOffres((prev) => [...prev, ...list]);
        setTotal(res.total);
      }
      setHasMore(p * LIMIT < (res.total || 0));
      if (!reset) setPage(p + 1);
    } catch {
      if (reset) {
        const mock = MOCK_OFFRES.filter((o) => normalizeSector(o.sector) === sector);
        setOffres(mock);
        setTotal(mock.length);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [sector, cfg, search, location, contractType, page]);

  useEffect(() => {
    setPage(1);
    loadOffres(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sector, search, location, contractType]);

  function resetFilters() {
    setSearch('');
    setContractType('');
    setLocation('');
  }

  function loadMore() {
    setPage((p) => p + 1);
    loadOffres(false);
  }

  return {
    offres, total, loading, loadingMore, hasMore, loadMore,
    search, setSearch, contractType, setContractType, location, setLocation, resetFilters,
  };
}
