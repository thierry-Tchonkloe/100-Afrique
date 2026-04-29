// src/types/recruteur.types.ts

// ─── Entreprise / Établissement ───────────────────────────────────────────────

export interface Etablissement {
  id: string;
  name: string;
  logo?: string;
  sector: string;
  city: string;
}

// ─── Recruteur Profile ────────────────────────────────────────────────────────

export interface RecruteurProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: 'RECRUITER';
  etablissements: Etablissement[];
  activeEtablissementId: string;
}

// ─── KPI Stats ────────────────────────────────────────────────────────────────

export interface RecruteurStats {
  porteeGlobale:       number;
  porteeEvolution:     number;   // % vs période précédente
  candidatures:        number;
  candidaturesEvol:    number;
  offresActives:       number;
  tauxConversion:      number;   // e.g. 1.65
  tauxConversionEvol:  number;
}

// ─── Chart data ───────────────────────────────────────────────────────────────

export interface ChartPoint {
  date: string;   // "1 Jan"
  value: number;
}

export interface MetierPart {
  name: string;
  value: number;   // percentage 0-100
  color: string;
}

// ─── Recent Candidature ───────────────────────────────────────────────────────

export interface RecentCandidature {
  id: string;
  candidatName: string;
  candidatAvatar?: string;
  jobTitle: string;
  receivedAt: string; // ISO
  starred: boolean;
}

// ─── Vitrine Health ───────────────────────────────────────────────────────────

export interface VitrineHealth {
  completionScore: number;   // 0-100
  views: number;
  engagementRate: number;    // % positive
}

// ─── Dashboard Response ───────────────────────────────────────────────────────

export interface RecruteurDashboardData {
  profile: RecruteurProfile;
  stats: RecruteurStats;
  chartData: ChartPoint[];
  metierParts: MetierPart[];
  recentCandidatures: RecentCandidature[];
  vitrineHealth: VitrineHealth;
  newCandidaturesCount: number; // badge on sidebar
}

// ─── Period filter ────────────────────────────────────────────────────────────

export type DashboardPeriod = '7d' | '30d' | '90d' | '1y';

export const PERIOD_LABELS: Record<DashboardPeriod, string> = {
  '7d':  '7 derniers jours',
  '30d': '30 derniers jours',
  '90d': '3 derniers mois',
  '1y':  'Cette année',
};