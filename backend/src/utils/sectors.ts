// src/utils/sectors.ts
//
// Copie miroir de src/lib/sectors.ts (frontend Next.js) — nécessaire car
// le backend Express est un projet TypeScript séparé qui ne peut pas
// importer directement les fichiers du frontend (sauf configuration
// monorepo/workspace, absente ici).
//
// ⚠️ IMPORTANT : si un secteur est ajouté/retiré, cette liste ET
// src/lib/sectors.ts (frontend) DOIVENT être mises à jour ensemble.
// Les deux fichiers doivent rester des copies identiques du même tableau
// SECTOR_DEFS pour que la normalisation reste cohérente de bout en bout
// (création d'offre → DB → filtre public → page métier).

export type SectorKey =
  | 'hotel'
  | 'restaurant'
  | 'events'
  | 'travel'
  | 'transport'
  | 'spa'
  | 'tech'
  | 'entertainment';

export interface SectorDef {
  key: SectorKey;
  /** Libellé FR EXACT — c'est ce texte qui est stocké dans Offre.sector en DB */
  label: string;
}

export const SECTOR_DEFS: SectorDef[] = [
  { key: 'hotel',         label: 'Hôtellerie' },
  { key: 'restaurant',    label: 'Restauration' },
  { key: 'events',        label: 'MICE & Événementiel' },
  { key: 'travel',        label: 'Agence de voyage' },
  { key: 'transport',     label: 'Transport' },
  { key: 'spa',           label: 'Spa & Bien-être' },
  { key: 'tech',          label: 'Tech Tourisme' },
  { key: 'entertainment', label: 'Divertissement' },
];

export const SECTOR_LABEL_BY_KEY: Record<SectorKey, string> =
  Object.fromEntries(SECTOR_DEFS.map((s) => [s.key, s.label])) as Record<SectorKey, string>;

const LABEL_TO_KEY: Record<string, SectorKey> =
  Object.fromEntries(SECTOR_DEFS.map((s) => [s.label, s.key]));

const FALLBACK_KEYWORDS: [SectorKey, string[]][] = [
  ['hotel',         ['hotel', 'hôtel']],
  ['restaurant',    ['restaur', 'gastro']],
  ['events',        ['mice', 'evenement', 'événement', 'congres', 'congrès', 'seminaire', 'séminaire']],
  ['travel',        ['voyage', 'tour-operateur', 'tour operateur']],
  ['transport',     ['transport', 'aerien', 'aérien', 'croisiere', 'croisière']],
  ['spa',           ['spa', 'bien-etre', 'bien-être', 'wellness']],
  ['tech',          ['tech', 'digital', 'saas']],
  ['entertainment', ['divertissement', 'loisir', 'entertainment']],
];

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normalise n'importe quelle valeur reçue en paramètre de requête (clé
 * canonique OU libellé FR exact OU ancienne variante) vers la clé canonique.
 * Retourne null si aucune correspondance.
 */
export function normalizeSector(raw?: string | null): SectorKey | null {
  if (!raw) return null;
  const trimmed = raw.trim();

  if (SECTOR_DEFS.some((s) => s.key === trimmed)) return trimmed as SectorKey;
  if (LABEL_TO_KEY[trimmed]) return LABEL_TO_KEY[trimmed];

  const normalized = stripAccents(trimmed.toLowerCase());
  for (const [key, keywords] of FALLBACK_KEYWORDS) {
    if (keywords.some((kw) => normalized.includes(stripAccents(kw)))) return key;
  }

  return null;
}

/**
 * Construit la clause Prisma `where.sector` correcte à partir d'un
 * paramètre de requête brut (clé canonique OU libellé) :
 * - si reconnu → égalité exacte sur le libellé canonique (rapide, utilise l'index)
 * - sinon → repli "contains" insensible à la casse (compat. anciennes données)
 */
export function buildSectorWhere(raw?: string | null): { sector: any } | {} {
  if (!raw) return {};
  const key = normalizeSector(raw);
  if (key) {
    return { sector: SECTOR_LABEL_BY_KEY[key] };
  }
  return { sector: { contains: raw, mode: 'insensitive' } };
}