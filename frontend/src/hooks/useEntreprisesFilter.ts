// src/hooks/useEntreprisesFilter.ts
// Charge les entreprises publiques + applique recherche/tri/filtres pour la
// page /emploi/entreprises.

import { useState, useEffect, useMemo } from 'react';
import { fetchPublicCompanies, MOCK_COMPANIES } from '@/services/emploi-public.service';
import { normalizeSector } from '@/lib/sectors';
import { enrichCompany, COMPANY_ENRICHMENTS } from '@/data/companyEnrichments';
import type { SortKey } from '@/data/entreprisesPageConfig';
import { EMPTY_COMPANY_FILTERS, type Company, type CompanyFilterState } from '@/components/emploi/entreprises/types';

export function useEntreprisesFilter(initial: { search: string; location: string; sector: string }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initial.search);
  const [location, setLocation] = useState(initial.location);
  const [activeSector, setActiveSector] = useState(initial.sector);
  const [sort, setSort] = useState<SortKey>('pertinence');
  const [filters, setFilters] = useState<CompanyFilterState>(EMPTY_COMPANY_FILTERS);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await fetchPublicCompanies();
        setCompanies(list.length ? list.map(enrichCompany) : MOCK_COMPANIES.map(enrichCompany));
      } catch {
        setCompanies(MOCK_COMPANIES.map(enrichCompany));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const processed = useMemo(() => {
    let list = [...companies];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        COMPANY_ENRICHMENTS[c.name]?.description?.toLowerCase().includes(q)
      );
    }

    if (location) {
      list = list.filter((c) => c.city.toLowerCase().includes(location.toLowerCase()));
    }

    if (activeSector) {
      list = list.filter((c) => normalizeSector(c.sector) === activeSector);
    }

    if (filters.sectors.length) {
      list = list.filter((c) => filters.sectors.includes(normalizeSector(c.sector) || ''));
    }
    if (filters.hasOffres) list = list.filter((c) => c.offresCount > 0);
    if (filters.isPremium) list = list.filter((c) => COMPANY_ENRICHMENTS[c.name]?.isPremium);
    if (filters.isRecruiting) list = list.filter((c) => COMPANY_ENRICHMENTS[c.name]?.isFeatured);
    if (filters.minRating !== null) {
      list = list.filter((c) => (COMPANY_ENRICHMENTS[c.name]?.rating ?? 0) >= (filters.minRating!));
    }

    if (sort === 'offres') list.sort((a, b) => b.offresCount - a.offresCount);
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

  function resetAll() {
    setSearch(''); setLocation(''); setActiveSector(''); setFilters(EMPTY_COMPANY_FILTERS);
  }

  return {
    companies, processed, loading,
    search, setSearch, location, setLocation, activeSector, setActiveSector,
    sort, setSort, filters, setFilters, favorites, toggleFav, resetAll,
  };
}
