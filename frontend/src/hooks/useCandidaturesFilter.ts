// src/hooks/useCandidaturesFilter.ts
import { useMemo } from 'react';
import { ACTIVE_STATUSES, ARCHIVED_STATUSES } from '@/data/candidaturesFilters';
import type { Application, FilterTab } from '@/types/candidatures.types';

export function useCandidaturesFilter(
  data: { applications: Application[] } | null,
  search: string,
  tab: FilterTab,
) {
  return useMemo(() => {
    if (!data) return [];
    return data.applications.filter((app) => {
      const matchSearch =
        !search ||
        app.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        app.companyName.toLowerCase().includes(search.toLowerCase());

      const matchTab =
        tab === 'all' ||
        (tab === 'active' && ACTIVE_STATUSES.has(app.status)) ||
        (tab === 'archived' && ARCHIVED_STATUSES.has(app.status));

      return matchSearch && matchTab;
    });
  }, [data, search, tab]);
}
