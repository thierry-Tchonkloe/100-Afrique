// src/types/emploi/offre.types.ts

export interface OffreStep1 {
  title: string;
  sector: string;
  contractType: string;
  location: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  remote?: string;
}

export interface OffreStep2 {
  missions?: string | null;
  profile?: string | null;
  advantages?: string | null;
}

export interface OffreStep3 {
  requiredSkills?: string[];
  languages?: string[];
  softwares?: string[];
}

export interface CreateOffreInput {
  step1?: OffreStep1;
  step2?: OffreStep2;
  step3?: OffreStep3;
  // Support du mode "flat" (payload à plat, sans wizard step1/2/3)
  [key: string]: unknown;
}

export type UpdateOffreInput = CreateOffreInput;

export interface UpdateOffreStatusInput {
  status: 'active' | 'paused' | 'draft' | 'archived';
}

export interface PublicJobsQuery {
  sector?: string;
  location?: string;
  contractType?: string;
  remote?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface OffreOutput {
  id: string;
  title: string;
  sector: string;
  contractType: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  remote: string;
  missions: string | null;
  profileDesc: string | null;
  advantages: string | null;
  requiredSkills: string[];
  requiredLangs: string[];
  requiredSoftwares: string[];
  status: string;
  isPremium: boolean;
  views: number;
  candidatesCount: number;
  newCandidatesCount: number;
  publishedAt: string | null;
  expiresAt: string | null;
}