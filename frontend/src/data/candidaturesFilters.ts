// src/data/candidaturesFilters.ts
import type { FilterTab } from '@/types/candidatures.types';

export const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'active', label: 'Actives' },
  { key: 'archived', label: 'Archives' },
];

export const ACTIVE_STATUSES = new Set(['sent', 'viewed', 'in_progress', 'selected', 'interview', 'accepted']);
export const ARCHIVED_STATUSES = new Set(['refused', 'archived']);
