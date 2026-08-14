// src/components/emploi/entreprises/types.ts
import type { PublicEtablissement } from '@/services/emploi-public.service';

export interface Company extends PublicEtablissement {
  description?: string;
  tags?: string[];
  employeeCount?: string;
  isFeatured?: boolean;
  isPremium?: boolean;
  rating?: number;
  growth?: string;
  coverUrl?: string;
  logoColor?: string;
}

export interface CompanyFilterState {
  sectors: string[];
  sizes: string[];
  hasOffres: boolean;
  isPremium: boolean;
  isRecruiting: boolean;
  minRating: number | null;
}

export const EMPTY_COMPANY_FILTERS: CompanyFilterState = {
  sectors: [], sizes: [],
  hasOffres: false, isPremium: false, isRecruiting: false, minRating: null,
};
