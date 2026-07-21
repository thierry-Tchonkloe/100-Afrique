// src/services/emploi-public.service.ts
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

const api = axios.create({ baseURL: `${BASE_URL}/emploi` });

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PublicOffre {
  id: string;
  title: string;
  companyName: string;
  sector: string;
  contractType: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  remote?: string;
  isPremium: boolean;
  publishedAt: string;
}

/** Détail complet d'une offre (retourné par GET /jobs/:id) */
export interface PublicOffreDetail extends PublicOffre {
  missions?: string;
  profileDesc?: string;
  advantages?: string;
  requiredSkills?: string[];
  requiredLangs?: string[];
  requiredSoftwares?: string[];
  expiresAt?: string;
  company?: {
    id: string;
    name: string;
    sector: string;
    city: string;
    logo?: string;
    slogan?: string;
  };
}

export interface PublicOffresResponse {
  total: number;
  page: number;
  limit: number;
  offres: PublicOffre[];
}

export interface PublicVitrine {
  id: string;
  etablissementId: string;
  logoUrl?: string;
  bannerUrl?: string;
  slogan?: string;
  sector?: string;
  location?: string;
  completionScore: number;
  views: number;
  /** Première image de la galerie média — utilisée en repli de bannière */
  galleryImage?: string | null;
}

export interface PublicEtablissement {
  id: string;
  name: string;
  logo?: string;
  sector: string;
  city: string;
  offresCount: number;
  vitrine?: PublicVitrine | null;
}

/** Moment de vie d'équipe (soirées, séminaires, activités...) */
export interface PublicVitrineMoment {
  id: string;
  title: string;
  description: string;
  photoUrl: string;
}

/** Détail complet entreprise (page /emploi/entreprises/:id) */
export interface PublicCompanyDetail extends PublicEtablissement {
  aboutUs: string;
  kpis: { id: string; icon: string; value: string; label: string }[];
  values: { id: string; title: string; description: string }[];
  perks: string[];
  photos: { id: string; url: string; alt?: string }[];
  videos: { id: string; url: string; thumbnailUrl?: string; title?: string }[];
  socials: { linkedin?: string; instagram?: string; facebook?: string; website?: string };
  offres: PublicOffre[];
  // NOUVEAU : infos pratiques + certifications + moments de vie d'équipe.
  // Désormais renseignées par le recruteur depuis son dashboard vitrine
  // (onglet "Infos & Certifications"), plus jamais codées en dur.
  phone: string;
  email: string;
  certifications: string[];
  moments: PublicVitrineMoment[];
}

export interface SearchParams {
  search?: string;
  location?: string;
  contractType?: string;
  /** Plusieurs valeurs séparées par virgule, ex "full,partial" */
  remote?: string;
  /** Slug secteur : hotel | restaurant | transport | travel | tech | events */
  sector?: string;
  page?: number;
  limit?: number;
}

// ── API calls ─────────────────────────────────────────────────────────────────

/**
 * Liste publique des offres avec filtres optionnels.
 * Tous les paramètres sont transmis tels quels à GET /emploi/jobs.
 */
export async function fetchPublicJobs(params: SearchParams = {}): Promise<PublicOffresResponse> {
  const { data } = await api.get<{ success: boolean; data: PublicOffresResponse }>('/jobs', {
    params: {
      ...params,
      limit: params.limit ?? 8,
    },
  });
  return data.data;
}

/**
 * Détail d'une offre par son ID.
 */
export async function fetchPublicJob(id: string): Promise<PublicOffreDetail> {
  const { data } = await api.get<{ success: boolean; data: PublicOffreDetail }>(`/jobs/${id}`);
  return data.data;
}

/**
 * Liste publique des entreprises — basée sur Etablissement + Vitrine.
 * Contient logo, bannière et première image de galerie, contrairement à
 * l'ancienne dérivation depuis les offres publiques.
 */
export async function fetchPublicCompanies(): Promise<PublicEtablissement[]> {
  const { data } = await api.get<{ success: boolean; data: PublicEtablissement[] }>('/entreprises');
  return data.data ?? [];
}

/**
 * Détail complet d'une entreprise (page vitrine publique).
 * FIX : erreurs loguées explicitement (réseau/CORS vs 404 vs 500), pour ne
 * plus afficher "Entreprise introuvable" à tort sur un problème réseau/CORS.
 */
export async function fetchPublicCompanyDetail(id: string): Promise<PublicCompanyDetail> {
  try {
    const { data } = await api.get<{ success: boolean; data: PublicCompanyDetail }>(`/entreprises/${id}`);
    return data.data;
  } catch (err: any) {
    if (err.response) {
      console.error(`[fetchPublicCompanyDetail] HTTP ${err.response.status}`, err.response.data);
    } else if (err.request) {
      console.error(
        '[fetchPublicCompanyDetail] Aucune réponse reçue — vérifier que le backend '
        + 'tourne bien et autorise CORS pour cette origine (voir app.use(cors(...))).',
        err.message,
      );
    } else {
      console.error('[fetchPublicCompanyDetail] Erreur inattendue', err.message);
    }
    throw err;
  }
}

/**
 * Utilise le vrai endpoint /entreprises (logo, bannière, photo) au lieu de
 * dériver les entreprises depuis les offres publiques.
 */
export async function fetchFeaturedCompanies(): Promise<PublicEtablissement[]> {
  try {
    const all = await fetchPublicCompanies();
    return all.slice(0, 6);
  } catch {
    return MOCK_COMPANIES;
  }
}

// ── Mocks (fallback si API non disponible) ────────────────────────────────────

export const MOCK_OFFRES: PublicOffre[] = [
  {
    id: '1', title: 'Réceptionniste de Nuit',
    companyName: 'Luxury Hotels Group', sector: 'hotel',
    contractType: 'CDI', location: 'Paris 8ème',
    isPremium: true, salaryMin: 28000, salaryMax: 32000,
    publishedAt: new Date(Date.now() - 2  * 3_600_000).toISOString(),
  },
  {
    id: '2', title: 'Revenue Manager',
    companyName: 'TravelTech Solutions', sector: 'tech',
    contractType: 'CDI', location: 'Lyon',
    isPremium: false, salaryMin: 45000, salaryMax: 55000,
    publishedAt: new Date(Date.now() - 5  * 3_600_000).toISOString(),
  },
  {
    id: '3', title: 'Chef de Partie',
    companyName: 'Gastronomie & Co', sector: 'restaurant',
    contractType: 'CDD Saisonnier', location: 'Cannes',
    isPremium: false, remote: 'none',
    publishedAt: new Date(Date.now() - 24 * 3_600_000).toISOString(),
  },
  {
    id: '4', title: "Agent d'Escale",
    companyName: 'Sky Airlines', sector: 'transport',
    contractType: 'CDI', location: 'Roissy CDG',
    isPremium: false,
    publishedAt: new Date(Date.now() - 24 * 3_600_000).toISOString(),
  },
  {
    id: '5', title: 'Event Manager',
    companyName: 'Events International', sector: 'events',
    contractType: 'CDI', location: 'Bordeaux',
    isPremium: false, salaryMin: 38000,
    publishedAt: new Date(Date.now() - 48 * 3_600_000).toISOString(),
  },
  {
    id: '6', title: 'Conseiller Voyage Luxe',
    companyName: 'Voyages Prestige', sector: 'travel',
    contractType: 'CDI', location: 'Marseille',
    isPremium: false, salaryMin: 35000, salaryMax: 42000,
    publishedAt: new Date(Date.now() - 72 * 3_600_000).toISOString(),
  },
];

export const MOCK_COMPANIES: PublicEtablissement[] = [
  { id: '1', name: 'Luxury Hotels Group',   sector: 'hotel',      city: 'Paris',    offresCount: 12 },
  { id: '2', name: 'Voyages Prestige',       sector: 'travel',     city: 'Paris',    offresCount: 8  },
  { id: '3', name: 'Gastronomie & Co',       sector: 'restaurant', city: 'Cannes',   offresCount: 15 },
  { id: '4', name: 'Events International',   sector: 'events',     city: 'Bordeaux', offresCount: 6  },
  { id: '5', name: 'TravelTech Solutions',   sector: 'tech',       city: 'Lyon',     offresCount: 10 },
  { id: '6', name: 'Sky Airlines',           sector: 'transport',  city: 'Roissy',   offresCount: 9  },
];
