// src/data/metiersHomeConfig.ts
// Config statique dérivée de src/lib/sectors.ts, utilisée sur la home Emploi
// et réutilisable ailleurs si besoin.
import { SECTOR_DEFS, type SectorKey } from '@/lib/sectors';
import { SECTOR_ICONS, SECTOR_HOVER_COLORS, SECTOR_BG_IMAGE } from '@/components/emploi/public/sectorVisuals';

const METIER_DESCRIPTIONS: Record<SectorKey, string> = {
  hotel: 'Réception, direction, housekeeping...',
  restaurant: 'Chef, cuisine, salle, bar...',
  transport: "Pilote, agent d'escale, hôtesse...",
  travel: 'Conseiller voyage, TO, tourisme...',
  tech: 'Revenue, yield, digital, dev...',
  events: 'Congrès, séminaires, incentives...',
  spa: 'Praticien(ne) spa, bien-être...',
  entertainment: 'Animation, régie, loisirs...',
};

export const METIERS = SECTOR_DEFS.map((s) => ({
  label: s.label,
  icon: SECTOR_ICONS[s.key],
  color: SECTOR_HOVER_COLORS[s.key],
  sector: s.key,
  description: METIER_DESCRIPTIONS[s.key],
  bg: SECTOR_BG_IMAGE[s.key],
}));

export const CONTRACT_COLOR: Record<string, string> = {
  CDI: 'bg-blue-50 text-blue-700 border-blue-100',
  CDD: 'bg-purple-50 text-purple-700 border-purple-100',
  'CDD Saisonnier': 'bg-orange-50 text-orange-700 border-orange-100',
  Alternance: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  Stage: 'bg-teal-50 text-teal-700 border-teal-100',
  Freelance: 'bg-pink-50 text-pink-700 border-pink-100',
};

export const POPULAR_SEARCHES = ['Réceptionniste', 'Revenue Manager', 'Chef de cuisine', 'Yield Manager'];
