// src/types/vitrine.types.ts
import { SECTOR_LABELS } from '@/lib/sectors';

export type KpiIcon =
  | 'users' | 'star' | 'calendar' | 'trophy' | 'heart' | 'globe'
  | 'building' | 'briefcase' | 'chart' | 'check';

export interface VitrineKpi {
  id: string;
  icon: KpiIcon;
  value: string;
  label: string;
}

export interface CompanyValue {
  id: string;
  title: string;
  description: string;
}

export interface VitrinePhoto {
  id: string;
  url: string;
  alt?: string;
}

export interface VitrineVideo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title?: string;
}

export const ALL_PERKS = [
  'Télétravail', 'Mutuelle', 'Tickets Restaurant', 'Salle de sport',
  'Formation continue', 'Prime annuelle', 'Horaires flexibles', 'RTT',
  'Crèche entreprise', 'Véhicule de fonction', 'Stock options', 'Intéressement',
] as const;

export type Perk = typeof ALL_PERKS[number];

export interface SocialLinks {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
}

// ── NOUVEAU : "moment de vie d'équipe" — remplace le TEAM_MOMENTS codé en
// dur sur la page publique (soirées d'équipe, activités saisonnières...).
export interface VitrineMoment {
  id: string;
  title: string;
  description: string;
  photoUrl: string;
}

export interface VitrineData {
  id: string;
  etablissementId: string;
  companyName: string;

  logoUrl?: string;
  bannerUrl?: string;
  slogan: string;

  kpis: VitrineKpi[];
  location: string;
  sector: string;

  aboutUs: string;
  values: CompanyValue[];
  perks: Perk[];

  photos: VitrinePhoto[];
  videos: VitrineVideo[];

  socials: SocialLinks;

  // ── NOUVEAU : infos pratiques + certifications + moments de vie d'équipe.
  // Ces champs alimentent la sidebar "Informations" et le bloc
  // "Certifications" de la page publique, auparavant en dur pour toutes
  // les entreprises quel que soit leur contenu réel.
  phone: string;
  email: string;
  certifications: string[];
  moments: VitrineMoment[];
}

export type VitrineTab =
  | 'identite'
  | 'chiffres'
  | 'culture'
  | 'medias'
  | 'infos'
  | 'reseaux';

export const VITRINE_TABS: { key: VitrineTab; label: string }[] = [
  { key: 'identite', label: 'Identité visuelle'    },
  { key: 'chiffres', label: 'Chiffres clés'         },
  { key: 'culture',  label: 'Culture & Valeurs'     },
  { key: 'medias',   label: 'Médias/Réseaux Sociaux' },
  { key: 'infos',    label: 'Infos & Certifications' }, // NOUVEAU
];

export const KPI_ICONS: { key: KpiIcon; emoji: string; label: string }[] = [
  { key: 'users',     emoji: '👥', label: 'Équipe'       },
  { key: 'star',      emoji: '⭐', label: 'Note'         },
  { key: 'calendar',  emoji: '📅', label: 'Années'       },
  { key: 'trophy',    emoji: '🏆', label: 'Récompenses'  },
  { key: 'heart',     emoji: '❤️', label: 'Satisfaction' },
  { key: 'globe',     emoji: '🌍', label: 'Pays'         },
  { key: 'building',  emoji: '🏢', label: 'Sites'        },
  { key: 'briefcase', emoji: '💼', label: 'Offres'       },
  { key: 'chart',     emoji: '📈', label: 'Croissance'   },
  { key: 'check',     emoji: '✅', label: 'Certifications'},
];

// ── NOUVEAU : suggestions de certifications courantes — l'input reste libre
// (tag input), mais on propose des exemples fréquents dans le secteur.
export const CERTIFICATION_SUGGESTIONS = [
  'Great Place to Work', 'Green Key Eco-Label', 'Label Diversité',
  'ISO 9001', 'ISO 14001', 'ISO 20121', 'Clef Verte',
  'Ecolabel Européen', 'Label Employeur Handi-Accueillant',
];

export const SECTORS_LIST = SECTOR_LABELS;















// // src/types/vitrine.types.ts
// import { SECTOR_LABELS } from '@/lib/sectors';

// // ─── Chiffre clé (tuile éditable) ────────────────────────────────────────────

// export type KpiIcon =
//   | 'users' | 'star' | 'calendar' | 'trophy' | 'heart' | 'globe'
//   | 'building' | 'briefcase' | 'chart' | 'check';

// export interface VitrineKpi {
//   id: string;
//   icon: KpiIcon;
//   value: string;    // ex: "150" ou "4.8/5"
//   label: string;    // ex: "Collaborateurs"
// }

// // ─── Valeur d'entreprise ──────────────────────────────────────────────────────

// export interface CompanyValue {
//   id: string;
//   title: string;
//   description: string;
// }

// // ─── Media ───────────────────────────────────────────────────────────────────

// export interface VitrinePhoto {
//   id: string;
//   url: string;
//   alt?: string;
// }

// export interface VitrineVideo {
//   id: string;
//   url: string;        // YouTube or Vimeo URL
//   thumbnailUrl?: string;
//   title?: string;
// }

// // ─── Avantages ────────────────────────────────────────────────────────────────

// export const ALL_PERKS = [
//   'Télétravail', 'Mutuelle', 'Tickets Restaurant', 'Salle de sport',
//   'Formation continue', 'Prime annuelle', 'Horaires flexibles', 'RTT',
//   'Crèche entreprise', 'Véhicule de fonction', 'Stock options', 'Intéressement',
// ] as const;

// export type Perk = typeof ALL_PERKS[number];

// // ─── Réseaux sociaux ──────────────────────────────────────────────────────────

// export interface SocialLinks {
//   linkedin?: string;
//   instagram?: string;
//   facebook?: string;
//   twitter?: string;
//   website?: string;
// }

// // ─── Vitrine complète ─────────────────────────────────────────────────────────

// export interface VitrineData {
//   id: string;
//   etablissementId: string;

//   // NOUVEAU : nom officiel de l'entreprise, éditable depuis la vitrine.
//   // Synchronisé côté backend vers Etablissement.name — c'est ce nom qui
//   // s'affiche sur toutes les pages publiques (liste, filtres, fiche détail).
//   companyName: string;

//   // Identité visuelle
//   logoUrl?: string;
//   bannerUrl?: string;
//   slogan: string;

//   // Chiffres clés
//   kpis: VitrineKpi[];
//   location: string;
//   sector: string;

//   // Culture
//   aboutUs: string;
//   values: CompanyValue[];
//   perks: Perk[];

//   // Médias
//   photos: VitrinePhoto[];
//   videos: VitrineVideo[];

//   // Social
//   socials: SocialLinks;
// }

// // ─── Nav tabs ─────────────────────────────────────────────────────────────────

// export type VitrineTab =
//   | 'identite'
//   | 'chiffres'
//   | 'culture'
//   | 'medias'
//   | 'reseaux';

// export const VITRINE_TABS: { key: VitrineTab; label: string }[] = [
//   { key: 'identite', label: 'Identité visuelle'    },
//   { key: 'chiffres', label: 'Chiffres clés'         },
//   { key: 'culture',  label: 'Culture & Valeurs'     },
//   { key: 'medias',   label: 'Médias/Réseaux Sociaux' },
// ];

// // ─── KPI icon options ─────────────────────────────────────────────────────────

// export const KPI_ICONS: { key: KpiIcon; emoji: string; label: string }[] = [
//   { key: 'users',     emoji: '👥', label: 'Équipe'       },
//   { key: 'star',      emoji: '⭐', label: 'Note'         },
//   { key: 'calendar',  emoji: '📅', label: 'Années'       },
//   { key: 'trophy',    emoji: '🏆', label: 'Récompenses'  },
//   { key: 'heart',     emoji: '❤️', label: 'Satisfaction' },
//   { key: 'globe',     emoji: '🌍', label: 'Pays'         },
//   { key: 'building',  emoji: '🏢', label: 'Sites'        },
//   { key: 'briefcase', emoji: '💼', label: 'Offres'       },
//   { key: 'chart',     emoji: '📈', label: 'Croissance'   },
//   { key: 'check',     emoji: '✅', label: 'Certifications'},
// ];

// // SECTORS_LIST dérive de la source unique src/lib/sectors.ts, partagée avec
// // offres.types.ts et le mapping backend src/utils/sectors.ts.
// export const SECTORS_LIST = SECTOR_LABELS;












// // src/types/vitrine.types.ts
// import { SECTOR_LABELS } from '@/lib/sectors';

// // ─── Chiffre clé (tuile éditable) ────────────────────────────────────────────

// export type KpiIcon =
//   | 'users' | 'star' | 'calendar' | 'trophy' | 'heart' | 'globe'
//   | 'building' | 'briefcase' | 'chart' | 'check';

// export interface VitrineKpi {
//   id: string;
//   icon: KpiIcon;
//   value: string;    // ex: "150" ou "4.8/5"
//   label: string;    // ex: "Collaborateurs"
// }

// // ─── Valeur d'entreprise ──────────────────────────────────────────────────────

// export interface CompanyValue {
//   id: string;
//   title: string;
//   description: string;
// }

// // ─── Media ───────────────────────────────────────────────────────────────────

// export interface VitrinePhoto {
//   id: string;
//   url: string;
//   alt?: string;
// }

// export interface VitrineVideo {
//   id: string;
//   url: string;        // YouTube or Vimeo URL
//   thumbnailUrl?: string;
//   title?: string;
// }

// // ─── Avantages ────────────────────────────────────────────────────────────────

// export const ALL_PERKS = [
//   'Télétravail', 'Mutuelle', 'Tickets Restaurant', 'Salle de sport',
//   'Formation continue', 'Prime annuelle', 'Horaires flexibles', 'RTT',
//   'Crèche entreprise', 'Véhicule de fonction', 'Stock options', 'Intéressement',
// ] as const;

// export type Perk = typeof ALL_PERKS[number];

// // ─── Réseaux sociaux ──────────────────────────────────────────────────────────

// export interface SocialLinks {
//   linkedin?: string;
//   instagram?: string;
//   facebook?: string;
//   twitter?: string;
//   website?: string;
// }

// // ─── Vitrine complète ─────────────────────────────────────────────────────────

// export interface VitrineData {
//   id: string;
//   etablissementId: string;

//   // Identité visuelle
//   logoUrl?: string;
//   bannerUrl?: string;
//   slogan: string;

//   // Chiffres clés
//   kpis: VitrineKpi[];
//   location: string;
//   sector: string;

//   // Culture
//   aboutUs: string;
//   values: CompanyValue[];
//   perks: Perk[];

//   // Médias
//   photos: VitrinePhoto[];
//   videos: VitrineVideo[];

//   // Social
//   socials: SocialLinks;
// }

// // ─── Nav tabs ─────────────────────────────────────────────────────────────────

// export type VitrineTab =
//   | 'identite'
//   | 'chiffres'
//   | 'culture'
//   | 'medias'
//   | 'reseaux';

// export const VITRINE_TABS: { key: VitrineTab; label: string }[] = [
//   { key: 'identite', label: 'Identité visuelle'    },
//   { key: 'chiffres', label: 'Chiffres clés'         },
//   { key: 'culture',  label: 'Culture & Valeurs'     },
//   { key: 'medias',   label: 'Médias/Réseaux Sociaux' },
// ];

// // ─── KPI icon options ─────────────────────────────────────────────────────────

// export const KPI_ICONS: { key: KpiIcon; emoji: string; label: string }[] = [
//   { key: 'users',     emoji: '👥', label: 'Équipe'       },
//   { key: 'star',      emoji: '⭐', label: 'Note'         },
//   { key: 'calendar',  emoji: '📅', label: 'Années'       },
//   { key: 'trophy',    emoji: '🏆', label: 'Récompenses'  },
//   { key: 'heart',     emoji: '❤️', label: 'Satisfaction' },
//   { key: 'globe',     emoji: '🌍', label: 'Pays'         },
//   { key: 'building',  emoji: '🏢', label: 'Sites'        },
//   { key: 'briefcase', emoji: '💼', label: 'Offres'       },
//   { key: 'chart',     emoji: '📈', label: 'Croissance'   },
//   { key: 'check',     emoji: '✅', label: 'Certifications'},
// ];

// // FIX : SECTORS_LIST utilisait des libellés totalement différents
// // ("Hôtellerie de luxe", "Restauration gastronomique"...) de ceux
// // utilisés à la création d'offre ("Hôtellerie", "Restauration"...).
// // Un recruteur pouvait donc sélectionner "Hôtellerie de luxe" dans sa
// // vitrine alors que ses offres utilisaient "Hôtellerie" — aucun filtre
// // ne pouvait plus faire correspondre les deux. Désormais alignée sur
// // la même source unique que offres.types.ts.
// export const SECTORS_LIST = SECTOR_LABELS;














// // src/types/vitrine.types.ts

// // ─── Chiffre clé (tuile éditable) ────────────────────────────────────────────

// export type KpiIcon =
//   | 'users' | 'star' | 'calendar' | 'trophy' | 'heart' | 'globe'
//   | 'building' | 'briefcase' | 'chart' | 'check';

// export interface VitrineKpi {
//   id: string;
//   icon: KpiIcon;
//   value: string;    // ex: "150" ou "4.8/5"
//   label: string;    // ex: "Collaborateurs"
// }

// // ─── Valeur d'entreprise ──────────────────────────────────────────────────────

// export interface CompanyValue {
//   id: string;
//   title: string;
//   description: string;
// }

// // ─── Media ───────────────────────────────────────────────────────────────────

// export interface VitrinePhoto {
//   id: string;
//   url: string;
//   alt?: string;
// }

// export interface VitrineVideo {
//   id: string;
//   url: string;        // YouTube or Vimeo URL
//   thumbnailUrl?: string;
//   title?: string;
// }

// // ─── Avantages ────────────────────────────────────────────────────────────────

// export const ALL_PERKS = [
//   'Télétravail', 'Mutuelle', 'Tickets Restaurant', 'Salle de sport',
//   'Formation continue', 'Prime annuelle', 'Horaires flexibles', 'RTT',
//   'Crèche entreprise', 'Véhicule de fonction', 'Stock options', 'Intéressement',
// ] as const;

// export type Perk = typeof ALL_PERKS[number];

// // ─── Réseaux sociaux ──────────────────────────────────────────────────────────

// export interface SocialLinks {
//   linkedin?: string;
//   instagram?: string;
//   facebook?: string;
//   twitter?: string;
//   website?: string;
// }

// // ─── Vitrine complète ─────────────────────────────────────────────────────────

// export interface VitrineData {
//   id: string;
//   etablissementId: string;

//   // Identité visuelle
//   logoUrl?: string;
//   bannerUrl?: string;
//   slogan: string;

//   // Chiffres clés
//   kpis: VitrineKpi[];
//   location: string;
//   sector: string;

//   // Culture
//   aboutUs: string;
//   values: CompanyValue[];
//   perks: Perk[];

//   // Médias
//   photos: VitrinePhoto[];
//   videos: VitrineVideo[];

//   // Social
//   socials: SocialLinks;
// }

// // ─── Nav tabs ─────────────────────────────────────────────────────────────────

// export type VitrineTab =
//   | 'identite'
//   | 'chiffres'
//   | 'culture'
//   | 'medias'
//   | 'reseaux';

// export const VITRINE_TABS: { key: VitrineTab; label: string }[] = [
//   { key: 'identite', label: 'Identité visuelle'    },
//   { key: 'chiffres', label: 'Chiffres clés'         },
//   { key: 'culture',  label: 'Culture & Valeurs'     },
//   { key: 'medias',   label: 'Médias/Réseaux Sociaux' },
// ];

// // ─── KPI icon options ─────────────────────────────────────────────────────────

// export const KPI_ICONS: { key: KpiIcon; emoji: string; label: string }[] = [
//   { key: 'users',     emoji: '👥', label: 'Équipe'       },
//   { key: 'star',      emoji: '⭐', label: 'Note'         },
//   { key: 'calendar',  emoji: '📅', label: 'Années'       },
//   { key: 'trophy',    emoji: '🏆', label: 'Récompenses'  },
//   { key: 'heart',     emoji: '❤️', label: 'Satisfaction' },
//   { key: 'globe',     emoji: '🌍', label: 'Pays'         },
//   { key: 'building',  emoji: '🏢', label: 'Sites'        },
//   { key: 'briefcase', emoji: '💼', label: 'Offres'       },
//   { key: 'chart',     emoji: '📈', label: 'Croissance'   },
//   { key: 'check',     emoji: '✅', label: 'Certifications'},
// ];

// export const SECTORS_LIST = [
//   'Hôtellerie de luxe', 'Hôtellerie budget', 'Restauration gastronomique',
//   'Restauration rapide', 'MICE & Événementiel', 'Agence de voyage',
//   'Spa & Bien-être', 'Transport touristique', 'Tech Tourisme',
// ];