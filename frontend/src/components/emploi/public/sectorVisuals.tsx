// src/components/emploi/public/sectorVisuals.tsx
//
// AVANT : chaque page publique redéfinissait sa propre map SECTOR_ICON /
// SECTOR_COLOR — parfois indexée par clé canonique ('hotel'), parfois par
// libellé FR brut ('Hôtellerie'), parfois les deux mélangés (voir
// jobs/page.tsx). Certaines couvraient seulement 6 des 8 secteurs de
// lib/sectors.ts, oubliant 'spa' et 'entertainment' — un secteur non
// couvert tombait silencieusement sur une icône générique sans qu'on s'en
// rende compte. Une seule source ici, TOUJOURS indexée par SectorKey
// (jamais par libellé brut) : tout appelant doit passer par
// normalizeSector() avant de lire ces maps.

import { Hotel, Utensils, Plane, Briefcase, Monitor, Calendar, Star, Building2 } from 'lucide-react';
import { normalizeSector, type SectorKey } from '@/lib/sectors';

export const SECTOR_ICONS: Record<SectorKey, React.ReactNode> = {
  hotel:         <Hotel size={18} />,
  restaurant:    <Utensils size={18} />,
  transport:     <Plane size={18} />,
  travel:        <Briefcase size={18} />,
  tech:          <Monitor size={18} />,
  events:        <Calendar size={18} />,
  spa:           <Star size={18} />,
  entertainment: <Building2 size={18} />,
};

export const SECTOR_COLORS: Record<SectorKey, string> = {
  hotel:         'bg-blue-50 text-blue-600',
  restaurant:    'bg-orange-50 text-orange-600',
  transport:     'bg-sky-50 text-sky-600',
  travel:        'bg-amber-50 text-amber-600',
  tech:          'bg-green-50 text-green-600',
  events:        'bg-purple-50 text-purple-600',
  spa:           'bg-pink-50 text-pink-600',
  entertainment: 'bg-indigo-50 text-indigo-600',
};

export const SECTOR_HOVER_COLORS: Record<SectorKey, string> = {
  hotel:         'text-blue-600   bg-blue-50   hover:bg-blue-100',
  restaurant:    'text-orange-600 bg-orange-50 hover:bg-orange-100',
  transport:     'text-sky-600    bg-sky-50    hover:bg-sky-100',
  travel:        'text-amber-600  bg-amber-50  hover:bg-amber-100',
  tech:          'text-green-600  bg-green-50  hover:bg-green-100',
  events:        'text-purple-600 bg-purple-50 hover:bg-purple-100',
  spa:           'text-pink-600   bg-pink-50   hover:bg-pink-100',
  entertainment: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100',
};

export const SECTOR_BG_IMAGE: Record<SectorKey, string> = {
  hotel:         'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  restaurant:    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  transport:     'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
  travel:        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
  tech:          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  events:        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  spa:           'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
  entertainment: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80',
};

/**
 * Icône à afficher pour un secteur — accepte n'importe quelle valeur brute
 * (libellé FR, clé déjà canonique, ou variante) et normalise en interne.
 * Retourne une icône neutre si le secteur est vide ou non reconnu — jamais
 * de secteur "hotel" imposé par défaut (bug corrigé sur CompanyCard).
 */
export function sectorIcon(raw: string | null | undefined): React.ReactNode {
  const key = normalizeSector(raw);
  return key ? SECTOR_ICONS[key] : <Building2 size={18} />;
}

/** Classes de couleur pour un secteur, avec repli neutre si non reconnu. */
export function sectorColorClasses(raw: string | null | undefined): string {
  const key = normalizeSector(raw);
  return key ? SECTOR_COLORS[key] : 'bg-gray-100 text-gray-500';
}