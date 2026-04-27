// src/types/vitrine.types.ts

// ─── Chiffre clé (tuile éditable) ────────────────────────────────────────────

export type KpiIcon =
  | 'users' | 'star' | 'calendar' | 'trophy' | 'heart' | 'globe'
  | 'building' | 'briefcase' | 'chart' | 'check';

export interface VitrineKpi {
  id: string;
  icon: KpiIcon;
  value: string;    // ex: "150" ou "4.8/5"
  label: string;    // ex: "Collaborateurs"
}

// ─── Valeur d'entreprise ──────────────────────────────────────────────────────

export interface CompanyValue {
  id: string;
  title: string;
  description: string;
}

// ─── Media ───────────────────────────────────────────────────────────────────

export interface VitrinePhoto {
  id: string;
  url: string;
  alt?: string;
}

export interface VitrineVideo {
  id: string;
  url: string;        // YouTube or Vimeo URL
  thumbnailUrl?: string;
  title?: string;
}

// ─── Avantages ────────────────────────────────────────────────────────────────

export const ALL_PERKS = [
  'Télétravail', 'Mutuelle', 'Tickets Restaurant', 'Salle de sport',
  'Formation continue', 'Prime annuelle', 'Horaires flexibles', 'RTT',
  'Crèche entreprise', 'Véhicule de fonction', 'Stock options', 'Intéressement',
] as const;

export type Perk = typeof ALL_PERKS[number];

// ─── Réseaux sociaux ──────────────────────────────────────────────────────────

export interface SocialLinks {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
}

// ─── Vitrine complète ─────────────────────────────────────────────────────────

export interface VitrineData {
  id: string;
  etablissementId: string;

  // Identité visuelle
  logoUrl?: string;
  bannerUrl?: string;
  slogan: string;

  // Chiffres clés
  kpis: VitrineKpi[];
  location: string;
  sector: string;

  // Culture
  aboutUs: string;
  values: CompanyValue[];
  perks: Perk[];

  // Médias
  photos: VitrinePhoto[];
  videos: VitrineVideo[];

  // Social
  socials: SocialLinks;
}

// ─── Nav tabs ─────────────────────────────────────────────────────────────────

export type VitrineTab =
  | 'identite'
  | 'chiffres'
  | 'culture'
  | 'medias'
  | 'reseaux';

export const VITRINE_TABS: { key: VitrineTab; label: string }[] = [
  { key: 'identite', label: 'Identité visuelle'    },
  { key: 'chiffres', label: 'Chiffres clés'         },
  { key: 'culture',  label: 'Culture & Valeurs'     },
  { key: 'medias',   label: 'Médias/Réseaux Sociaux' },
];

// ─── KPI icon options ─────────────────────────────────────────────────────────

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

export const SECTORS_LIST = [
  'Hôtellerie de luxe', 'Hôtellerie budget', 'Restauration gastronomique',
  'Restauration rapide', 'MICE & Événementiel', 'Agence de voyage',
  'Spa & Bien-être', 'Transport touristique', 'Tech Tourisme',
];