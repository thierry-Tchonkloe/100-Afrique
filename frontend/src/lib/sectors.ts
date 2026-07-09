// src/lib/sectors.ts
// Normalise la valeur `sector` stockée en base (libellés FR exacts venant de
// offres.types.ts / SECTORS) vers l'une des clés canoniques utilisées par les
// pages metiers/[sector] et jobs/[id] : hotel, restaurant, transport, travel, tech, events.
//
// Certains secteurs de offres.types.ts n'ont pas de page métier dédiée
// ('Spa & Bien-être', 'Tech Tourisme' partiellement, 'Divertissement').
// normalizeSector() retourne '' dans ce cas — à l'appelant de gérer le repli.

export type SectorKey = 'hotel' | 'restaurant' | 'transport' | 'travel' | 'tech' | 'events';

// Alias en clé minuscule/trim → clé canonique.
// On couvre : les clés déjà canoniques, les libellés exacts de offres.types.ts (SECTORS),
// et quelques variantes usuelles (accents, casse, singulier/pluriel).
const SECTOR_ALIASES: Record<string, SectorKey> = {
  // clés déjà canoniques (ex: valeurs mock / MOCK_OFFRES)
  hotel: 'hotel',
  restaurant: 'restaurant',
  transport: 'transport',
  travel: 'travel',
  tech: 'tech',
  events: 'events',

  // ── Libellés EXACTS de offres.types.ts > SECTORS (utilisés à la création d'offre) ──
  'hôtellerie': 'hotel',
  'restauration': 'restaurant',
  'mice & événementiel': 'events',
  'agence de voyage': 'travel',
  'tech tourisme': 'tech',
  // 'spa & bien-être'   → PAS de page métier correspondante (voir fallback)
  // 'divertissement'    → PAS de page métier correspondante (voir fallback)

  // ── Variantes / alias supplémentaires rencontrés ailleurs dans l'app ──
  'hotellerie': 'hotel',
  'aérien & transport': 'transport',
  'aerien & transport': 'transport',
  'aérien': 'transport',
  'aerien': 'transport',
  'agences de voyage': 'travel',
  'agence de voyages': 'travel',
  'agences de voyages': 'travel',
  'tech & digital': 'tech',
  'digital': 'tech',
  'mice & evenementiel': 'events',
  'événementiel': 'events',
  'evenementiel': 'events',
  'mice': 'events',
};

/**
 * Retourne la clé canonique correspondant à `raw`, ou '' si aucune page
 * métier n'existe pour ce secteur (ex: 'Spa & Bien-être', 'Divertissement').
 */
export function normalizeSector(raw?: string | null): SectorKey | '' {
  if (!raw) return '';
  const key = raw.trim().toLowerCase();
  return SECTOR_ALIASES[key] ?? '';
}

/**
 * Construit l'URL de destination pour "voir toutes les offres de ce secteur" :
 * - si une page métier dédiée existe → /emploi/metiers/{clé}
 * - sinon → repli vers le board général filtré par secteur (toujours valide)
 */
export function sectorBrowseUrl(raw?: string | null): string {
  const key = normalizeSector(raw);
  if (key) return `/emploi/metiers/${key}`;
  return `/emploi/jobs?sector=${encodeURIComponent(raw ?? '')}`;
}