// src/lib/adZoneSlugs.ts

/**
 * Slugs des zones publicitaires, centralisés pour éviter tout décalage
 * entre le slug réellement créé dans l'admin (/publicites) et celui
 * utilisé en dur dans le code des pages.
 *
 * ⚠️ Ces valeurs doivent correspondre EXACTEMENT au slug affiché sur la
 * carte de la zone dans /publicites (généré automatiquement depuis le nom
 * via slugify, ex: "Top Banner Accueil" → "top-banner-accueil").
 *
 * Si vous créez une nouvelle zone en admin, ajoutez-la ici avant de
 * l'utiliser dans un composant.
 */
export const AD_ZONES = {
  TOP_BANNER_HOME: "top-banner-accueil",
  SKYSCRAPER_SIDEBAR: "skyscraper-sidebar",
  LEADERBOARD_SALONS_TOP: "leaderboard-salons-top",
} as const;

export type AdZoneSlug = (typeof AD_ZONES)[keyof typeof AD_ZONES];