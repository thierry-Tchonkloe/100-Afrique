// src/components/emploi/jobs/JobsFilterTypes.ts
export interface JobsFilters {
  search: string;
  location: string;
  radius: string;
  contractTypes: string[];
  remote: string[];
  sectors: string[];
  experience: string[];
  advantages: string[];
}

export const EMPTY_JOBS_FILTERS: JobsFilters = {
  search: '', location: '', radius: '20',
  contractTypes: [], remote: [], sectors: [], experience: [], advantages: [],
};

export const CONTRACT_OPTIONS = ['CDI', 'CDD', 'Alternance', 'Stage', 'Freelance', 'CDD Saisonnier'];

// Valeurs alignées sur le schéma réel de l'offre (remote: 'none' | 'partial' | 'full'),
// transmises telles quelles au backend.
export const REMOTE_OPTIONS: { value: string; label: string }[] = [
  { value: 'full', label: 'Full remote' },
  { value: 'partial', label: 'Hybride' },
  { value: 'none', label: 'Présentiel uniquement' },
];

export const EXPERIENCE_OPTIONS = ['Débutant', '2-5 ans', '5-10 ans', 'Senior'];
export const ADVANTAGE_OPTIONS = ['Logement fourni', 'Mutuelle', 'Primes', 'Véhicule'];
export const SORT_OPTIONS = ['Plus récentes', 'Salaire (croissant)', 'Pertinence'];

export const CONTRACT_COLOR: Record<string, string> = {
  CDI: 'bg-blue-50 text-blue-700',
  CDD: 'bg-purple-50 text-purple-700',
  'CDD Saisonnier': 'bg-orange-50 text-orange-700',
  Alternance: 'bg-indigo-50 text-indigo-700',
  Stage: 'bg-teal-50 text-teal-700',
  Freelance: 'bg-pink-50 text-pink-700',
};
