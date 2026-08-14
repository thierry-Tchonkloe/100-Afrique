// src/components/emploi/job-detail/jobDetailVisuals.ts
// Ces maps sont indexées par CLÉ CANONIQUE ('hotel', 'restaurant', ...), pas par
// le libellé brut stocké en base. Toujours passer par normalizeSector() avant lookup.
import { Hotel, Utensils, Plane, Briefcase, Monitor, Calendar } from 'lucide-react';
import { createElement } from 'react';

export const SECTOR_ICON: Record<string, React.ReactNode> = {
  hotel: createElement(Hotel, { size: 22 }),
  restaurant: createElement(Utensils, { size: 22 }),
  transport: createElement(Plane, { size: 22 }),
  travel: createElement(Briefcase, { size: 22 }),
  tech: createElement(Monitor, { size: 22 }),
  events: createElement(Calendar, { size: 22 }),
};

export const SECTOR_COLOR: Record<string, string> = {
  hotel: 'bg-blue-50 text-blue-600',
  restaurant: 'bg-orange-50 text-orange-600',
  transport: 'bg-sky-50 text-sky-600',
  travel: 'bg-amber-50 text-amber-600',
  tech: 'bg-green-50 text-green-600',
  events: 'bg-purple-50 text-purple-600',
};

export const CONTRACT_COLOR: Record<string, string> = {
  CDI: 'bg-blue-50 text-blue-700 border-blue-100',
  CDD: 'bg-purple-50 text-purple-700 border-purple-100',
  'CDD Saisonnier': 'bg-orange-50 text-orange-700 border-orange-100',
  Alternance: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  Stage: 'bg-teal-50 text-teal-700 border-teal-100',
  Freelance: 'bg-pink-50 text-pink-700 border-pink-100',
};

export function timeAgo(iso: string): string {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return "Publié à l'instant";
  if (h < 24) return `Publié il y a ${h}h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'Publié hier' : `Publié il y a ${d} jours`;
}

export function daysLeft(iso?: string): string | null {
  if (!iso) return null;
  const d = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (d <= 0) return 'Expirée';
  if (d === 1) return 'Expire demain';
  return `Expire dans ${d} jours`;
}
