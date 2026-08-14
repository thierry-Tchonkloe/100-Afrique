// src/data/entreprisesPageConfig.ts
import { Hotel, Utensils, Plane, Briefcase, Monitor, Calendar, Star, Building2 } from 'lucide-react';
import { createElement } from 'react';
import { SECTOR_DEFS, type SectorKey } from '@/lib/sectors';

export const COMPANY_SIZES = [
  'Toutes tailles',
  'Startup (< 50)',
  'PME (50–250)',
  'ETI (250–1 000)',
  'Grand groupe (> 1 000)',
];

export type SortKey = 'pertinence' | 'offres' | 'alphabetique' | 'recent';
export type ViewMode = 'grid' | 'list';

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'pertinence', label: 'Pertinence' },
  { key: 'offres', label: 'Offres actives' },
  { key: 'alphabetique', label: 'A → Z' },
  { key: 'recent', label: 'Récemment actif' },
];

export const SECTOR_ICONS: Record<SectorKey, React.ReactNode> = {
  hotel: createElement(Hotel, { size: 16 }),
  restaurant: createElement(Utensils, { size: 16 }),
  transport: createElement(Plane, { size: 16 }),
  travel: createElement(Briefcase, { size: 16 }),
  tech: createElement(Monitor, { size: 16 }),
  events: createElement(Calendar, { size: 16 }),
  spa: createElement(Star, { size: 16 }),
  entertainment: createElement(Building2, { size: 16 }),
};

export const SECTOR_COLORS: Record<SectorKey, { bg: string; text: string; light: string }> = {
  hotel: { bg: 'bg-blue-100', text: 'text-blue-700', light: 'bg-blue-50' },
  restaurant: { bg: 'bg-orange-100', text: 'text-orange-700', light: 'bg-orange-50' },
  transport: { bg: 'bg-sky-100', text: 'text-sky-700', light: 'bg-sky-50' },
  travel: { bg: 'bg-amber-100', text: 'text-amber-700', light: 'bg-amber-50' },
  tech: { bg: 'bg-green-100', text: 'text-green-700', light: 'bg-green-50' },
  events: { bg: 'bg-purple-100', text: 'text-purple-700', light: 'bg-purple-50' },
  spa: { bg: 'bg-pink-100', text: 'text-pink-700', light: 'bg-pink-50' },
  entertainment: { bg: 'bg-indigo-100', text: 'text-indigo-700', light: 'bg-indigo-50' },
};

export const FEATURED_SECTORS = SECTOR_DEFS.map((s) => ({
  key: s.key,
  label: s.label,
  icon: SECTOR_ICONS[s.key],
  color: `${SECTOR_COLORS[s.key].text} ${SECTOR_COLORS[s.key].light} border-gray-100`,
}));
