// src/types/emploi/vitrine.types.ts

export interface UpdateVitrineInput {
  slogan?: string;
  location?: string;
  sector?: string;
  aboutUs?: string;
  kpis?: object[];
  values?: object[];
  perks?: string[];
  photos?: object[];
  videos?: object[];
  socials?: Record<string, string>;
  logoUrl?: string;
  bannerUrl?: string;
  companyName?: string;
  phone?: string;
  email?: string;
  certifications?: string[];
  moments?: object[];
}

export interface AddVideoInput {
  url: string;
  title?: string;
}

export interface VitrineOutput {
  id: string;
  etablissementId: string;
  companyName: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  slogan: string;
  location: string;
  sector: string;
  aboutUs: string;
  kpis: object[];
  values: object[];
  perks: string[];
  photos: object[];
  videos: object[];
  socials: object;
  phone: string;
  email: string;
  certifications: string[];
  moments: object[];
  completionScore: number;
  views: number;
}