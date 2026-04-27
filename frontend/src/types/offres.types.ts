// src/types/offres.types.ts

export type OffreStatus = 'active' | 'draft' | 'paused' | 'archived';
export type ContractType = 'CDI' | 'CDD' | 'Saisonnier' | 'Stage' | 'Alternance' | 'CDD Saisonnier';
export type OffreTab = 'online' | 'drafts' | 'archives';

export interface Offre {
  id: string;
  title: string;
  sector: string;
  contractType: ContractType;
  location: string;
  publishedAt: string;   // ISO
  expiresAt: string;     // ISO
  status: OffreStatus;
  isPremium: boolean;
  views: number;
  candidatesCount: number;
  newCandidatesCount: number; // unseen
}

export interface OffresStats {
  online: number;
  drafts: number;
  archives: number;
}

export interface OffresResponse {
  stats: OffresStats;
  offres: Offre[];
}

// ── Form (stepper) ────────────────────────────────────────────────────────────

export type RemotePolicy = 'none' | 'partial' | 'full';

export interface OffreFormStep1 {
  title: string;
  sector: string;
  contractType: ContractType;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  remote: RemotePolicy;
}

export interface OffreFormStep2 {
  missions: string;
  profile: string;
  advantages: string;
}

export interface OffreFormStep3 {
  requiredSkills: string[];
  languages: string[];
  softwares: string[];
}

export interface OffreFormData {
  step1: OffreFormStep1;
  step2: OffreFormStep2;
  step3: OffreFormStep3;
}

export const SECTORS = [
  'Hôtellerie', 'Restauration', 'MICE & Événementiel', 'Agence de voyage',
  'Transport', 'Spa & Bien-être', 'Tech Tourisme', 'Divertissement',
];

export const CONTRACT_TYPES: ContractType[] = [
  'CDI', 'CDD', 'Saisonnier', 'Stage', 'Alternance', 'CDD Saisonnier',
];

export const REMOTE_OPTIONS: Record<RemotePolicy, string> = {
  none:    'Présentiel uniquement',
  partial: 'Télétravail partiel',
  full:    'Full remote',
};

export const REQUIRED_SKILLS_SUGGESTIONS = [
  'PMS Opera', 'GDS Amadeus', 'Yield Management', 'HACCP', 'Maîtrise du français',
  'Anglais courant', 'Excel', 'Leadership', 'Sens du service', 'Flexibilité',
  'Gestion des conflits', 'Esprit d\'équipe',
];