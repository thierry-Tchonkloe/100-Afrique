// src/lib/sectors.ts
//
// SOURCE UNIQUE DE VÉRITÉ pour les secteurs d'activité côté frontend.
// offres.types.ts et vitrine.types.ts importent leur liste de secteurs
// DEPUIS ICI — plus aucune liste de secteurs ne doit être redéfinie ailleurs.
// Le backend a une copie miroir dans src/utils/sectors.ts (voir plus bas) :
// impossible de partager un seul fichier entre le projet Next.js et Express
// sauf en monorepo, donc les deux fichiers doivent rester synchronisés
// manuellement si un secteur est ajouté/retiré.

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
  /** Libellé FR EXACT — c'est ce texte qui est stocké dans Offre.sector en DB (via le select de création d'offre) */
  label: string;
}

// ── Les 8 secteurs réels de la plateforme — NE PAS dupliquer cette liste ailleurs ──
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

/** Liste des libellés FR — à utiliser dans tous les <select> (OffreModal, Vitrine IdentiteSection) */
export const SECTOR_LABELS: string[] = SECTOR_DEFS.map((s) => s.label);

/** Map clé canonique → libellé FR */
export const SECTOR_LABEL_BY_KEY: Record<SectorKey, string> =
  Object.fromEntries(SECTOR_DEFS.map((s) => [s.key, s.label])) as Record<SectorKey, string>;

/** Map libellé FR exact → clé canonique */
const LABEL_TO_KEY: Record<string, SectorKey> =
  Object.fromEntries(SECTOR_DEFS.map((s) => [s.label, s.key]));

/**
 * Mots-clés de repli pour rattraper d'anciennes valeurs en base (avant
 * l'unification, ex: l'ancien SECTORS_LIST de vitrine.types.ts) ou des
 * variantes saisies manuellement. Recherche "contains" insensible
 * accents/casse sur la chaîne brute.
 */
const FALLBACK_KEYWORDS: [SectorKey, string[]][] = [
  ['hotel',         ['hotel', 'hôtel']],
  ['restaurant',    ['restaur', 'gastro']],
  ['events',        ['mice', 'evenement', 'événement', 'congres', 'congrès', 'seminaire', 'séminaire']],
  ['travel',        ['voyage', 'tour-operateur', 'tour operateur']],
  ['transport',     ['transport', 'aerien', 'aérien', 'compagnie aerienne', 'compagnie aérienne', 'croisiere', 'croisière']],
  ['spa',           ['spa', 'bien-etre', 'bien-être', 'wellness']],
  ['tech',          ['tech', 'digital', 'saas']],
  ['entertainment', ['divertissement', 'loisir', 'entertainment']],
];

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normalise n'importe quelle valeur de secteur (libellé exact, ancienne
 * variante, ou déjà une clé canonique) vers la clé canonique SectorKey.
 * Retourne '' si aucune correspondance n'est trouvée.
 */
export function normalizeSector(raw: string | null | undefined): SectorKey | '' {
  if (!raw) return '';
  const trimmed = raw.trim();

  if (SECTOR_DEFS.some((s) => s.key === trimmed)) return trimmed as SectorKey;
  if (LABEL_TO_KEY[trimmed]) return LABEL_TO_KEY[trimmed];

  const normalized = stripAccents(trimmed.toLowerCase());
  for (const [key, keywords] of FALLBACK_KEYWORDS) {
    if (keywords.some((kw) => normalized.includes(stripAccents(kw)))) return key;
  }

  return '';
}

/** Libellé FR canonique à afficher pour n'importe quelle valeur de secteur brute */
export function sectorLabel(raw: string | null | undefined): string {
  const key = normalizeSector(raw);
  return key ? SECTOR_LABEL_BY_KEY[key] : (raw ?? '');
}

/**
 * URL de navigation pour "voir toutes les offres de ce secteur".
 * Si le secteur est reconnu → page dédiée /emploi/metiers/{key}.
 * Sinon → repli sûr sur la liste générale filtrée par le texte brut.
 */
export function sectorBrowseUrl(raw: string | null | undefined): string {
  const key = normalizeSector(raw);
  return key ? `/emploi/metiers/${key}` : `/emploi/jobs?sector=${encodeURIComponent(raw ?? '')}`;
}
