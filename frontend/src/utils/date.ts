// src/utils/date.ts
//
// AVANT : `timeAgo` existait en 3 versions légèrement différentes
// (dashboard/page.tsx avec libellés complets, CandidatHeader.tsx avec
// libellés courts "1h/3j"). Deux implémentations pour la même notion =
// un jour elles divergent (déjà le cas : l'une gère les semaines,
// l'autre s'arrête aux jours). Une seule version, complète, utilisée
// partout ; on choisit le format long (le plus informatif) par défaut.

export function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'hier';
  if (days < 7) return `il y a ${days} jours`;
  const weeks = Math.floor(days / 7);
  return `il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
}

export function todayLabel(): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

/**
 * Format court (h/j), utilisé dans l'espace recruteur. AVANT : cette
 * fonction existait à l'identique dans 3 fichiers (dashboard/page.tsx,
 * CandidateCard.tsx, CandidateDetailPanel.tsx) — une seule version ici.
 */
export function timeAgoShort(iso: string): string {
  const hours = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
  if (hours < 1) return 'il y a < 1h';
  if (hours < 24) return `il y a ${hours}h`;
  return `il y a ${Math.floor(hours / 24)}j`;
}

/**
 * Format utilisé sur les pages publiques ("À l'instant", "Il y a Xh",
 * "Il y a X jours"). AVANT : copié à l'identique dans 5 fichiers
 * (emploi/page.tsx, jobs/page.tsx, jobs/[id]/page.tsx,
 * metiers/[sector]/page.tsx, entreprises/[id]/page.tsx).
 */
export function timeAgoPublic(iso: string | null | undefined): string {
  if (!iso) return '';
  const hours = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (hours < 1) return "À l'instant";
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? 'Il y a 1 jour' : `Il y a ${days} jours`;
}