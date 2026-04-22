// src/types/profil.types.ts
// ─────────────────────────────────────────────────────────────────────────────
// UNIQUE source de vérité pour tous les types du profil candidat.
// Ce fichier remplace à la fois l'ancien profil.types.ts et le type
// CandidatProfilBasic de useProfil.ts (qui causait les conflits).
// ─────────────────────────────────────────────────────────────────────────────

// ─── Expérience ───────────────────────────────────────────────────────────────

export type ContractType =
  | 'CDI'
  | 'CDD'
  | 'Saisonnier'
  | 'Stage'
  | 'Alternance'
  | 'Freelance'
  | 'Interim';

export interface Experience {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string;       // "YYYY-MM"
  endDate?: string;        // undefined = "En poste"
  contractType: ContractType;
  missions: string[];
}

// ─── Formation ────────────────────────────────────────────────────────────────

export interface Formation {
  id: string;
  school: string;
  diploma: string;
  year: string;
}

// ─── Langue ───────────────────────────────────────────────────────────────────

// Valeurs exhaustives — toute valeur string doit être castée via cette union
export type LanguageLevel =
  | 'A1'
  | 'A2'
  | 'B1'
  | 'B2'
  | 'C1'
  | 'C2'
  | 'Natif';

export interface Language {
  id: string;
  name: string;
  level: LanguageLevel;   // ← typage strict (corrige l'erreur "string not assignable")
}

// ─── Disponibilité ────────────────────────────────────────────────────────────

export type AvailabilityOption =
  | 'immediate'
  | '1_month'
  | '3_months'
  | '6_months'
  | 'not_searching';

export const AVAILABILITY_LABELS: Record<AvailabilityOption, string> = {
  immediate:    'Immédiate',
  '1_month':    '1 mois de préavis',
  '3_months':   '3 mois de préavis',
  '6_months':   '6 mois de préavis',
  not_searching: 'Ne recherche pas',
};

// ─── Profil complet ───────────────────────────────────────────────────────────
// Ce type est utilisé partout : page profil, hook useProfil, tous les composants.
// Il n'existe PLUS de "CandidatProfilBasic" — ce type unique couvre les deux usages.

export interface CandidatProfil {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  headline: string;
  city: string;
  mobility: string;
  bio: string;
  // ↓ propriétés qui manquaient dans CandidatProfilBasic (causait les 2 premières erreurs)
  experiences: Experience[];
  formations: Formation[];
  hardSkills: string[];
  softSkills: string[];
  languages: Language[];          // ← Language[] avec LanguageLevel strict (corrige erreur 3)
  cvFile?: { name: string; updatedAt: string };
  isVisible: boolean;
  availability: AvailabilityOption;  // ← type strict (corrige erreur 4)
  profileStrength: number;
}

// ─── Constantes métier ────────────────────────────────────────────────────────

export const CONTRACT_TYPES: ContractType[] = [
  'CDI', 'CDD', 'Saisonnier', 'Stage', 'Alternance', 'Freelance', 'Interim',
];

export const LANGUAGE_LEVELS: LanguageLevel[] = [
  'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Natif',
];

export const HARD_SKILLS_SUGGESTIONS: string[] = [
  'PMS Opera', 'Booking.com', 'Expedia Partner Central', 'GDS Amadeus',
  'Yield Management', 'HACCP', 'Maestro PMS', 'Fidelio', 'OnQ',
  'Revenue Management', 'Travelclick', 'Hotsoft', 'Micros Fidelio',
  'Salesforce', 'Excel avancé', 'Pack Office',
];

export const SOFT_SKILLS_OPTIONS: string[] = [
  "Sens du service", "Esprit d'équipe", 'Rigueur', 'Adaptabilité',
  'Leadership', 'Communication', 'Gestion du stress', 'Polyvalence',
  'Autonomie', 'Créativité', 'Empathie', 'Organisation',
];

export const MOBILITY_OPTIONS: string[] = [
  "Île-de-France", "Côte d'Azur", 'PACA', 'Auvergne-Rhône-Alpes',
  'Occitanie', 'Bretagne', 'Normandie', 'Grand Est', 'Toute la France',
  'International',
];



















// // src/types/profil.types.ts
// // ─── Profil Candidat ─────────────────────────────────────────────────────────

// export interface Experience {
//   id: string;
//   jobTitle: string;
//   companyName: string;
//   location: string;
//   startDate: string;      // "YYYY-MM"
//   endDate?: string;       // undefined = "En poste"
//   contractType: ContractType;
//   missions: string[];     // bullet points
// }

// export type ContractType = 'CDI' | 'CDD' | 'Saisonnier' | 'Stage' | 'Alternance' | 'Freelance' | 'Interim';

// export interface Formation {
//   id: string;
//   school: string;
//   diploma: string;
//   year: string;
// }

// export interface Language {
//   id: string;
//   name: string;
//   level: LanguageLevel;
// }

// export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Natif';

// export interface CandidatProfil {
//   id: string;
//   firstName: string;
//   lastName: string;
//   avatar?: string;
//   headline: string;         // Titre professionnel
//   city: string;
//   mobility: string;         // ex: "Côte d'Azur"
//   bio: string;              // 300 chars max
//   experiences: Experience[];
//   formations: Formation[];
//   hardSkills: string[];     // tags
//   softSkills: string[];
//   languages: Language[];
//   cvFile?: { name: string; updatedAt: string };
//   isVisible: boolean;
//   availability: AvailabilityOption;
//   profileStrength: number;
// }

// export type AvailabilityOption =
//   | 'immediate'
//   | '1_month'
//   | '3_months'
//   | '6_months'
//   | 'not_searching';

// export const AVAILABILITY_LABELS: Record<AvailabilityOption, string> = {
//   immediate: 'Immédiate',
//   '1_month': '1 mois de préavis',
//   '3_months': '3 mois de préavis',
//   '6_months': '6 mois de préavis',
//   not_searching: 'Ne recherche pas',
// };

// export const CONTRACT_TYPES: ContractType[] = [
//   'CDI', 'CDD', 'Saisonnier', 'Stage', 'Alternance', 'Freelance', 'Interim',
// ];

// export const LANGUAGE_LEVELS: LanguageLevel[] = [
//   'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Natif',
// ];

// export const HARD_SKILLS_SUGGESTIONS = [
//   'PMS Opera', 'Booking.com', 'Expedia Partner Central', 'GDS Amadeus',
//   'Yield Management', 'HACCP', 'Maestro PMS', 'Fidelio', 'OnQ',
//   'Revenue Management', 'Travelclick', 'Hotsoft', 'Micros Fidelio',
//   'Salesforce', 'Excel avancé', 'Pack Office',
// ];

// export const SOFT_SKILLS_OPTIONS = [
//   'Sens du service', 'Esprit d\'équipe', 'Rigueur', 'Adaptabilité',
//   'Leadership', 'Communication', 'Gestion du stress', 'Polyvalence',
//   'Autonomie', 'Créativité', 'Empathie', 'Organisation',
// ];

// export const MOBILITY_OPTIONS = [
//   'Île-de-France', 'Côte d\'Azur', 'PACA', 'Auvergne-Rhône-Alpes',
//   'Occitanie', 'Bretagne', 'Normandie', 'Grand Est', 'Toute la France',
//   'International',
// ];