// src/types/emploi.types.ts
import type { ApplicationStatus, CandidatNotification } from './candidatures.types';

export type { CandidatNotification, NotificationType } from './candidatures.types';

// ─── Candidat ────────────────────────────────────────────────────────────────

export interface CandidatProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  title?: string;
  sector?: string;
  profileStrength: number; // 0–100
  profileStrengthMessage?: string;
}

// ─── KPI Stats ───────────────────────────────────────────────────────────────

export interface CandidatStats {
  applicationsCount: number;
  profileViews: number;
  savedJobsCount: number;
  activeAlertsCount: number;
}

// ─── Résumé de candidature (tableau de bord uniquement) ──────────────────────
// NOTE : le endpoint /candidat/dashboard renvoie un résumé allégé (pas de
// location/contractType/timeline...), contrairement à /candidat/applications
// qui renvoie l'objet `Application` complet (voir candidatures.types.ts).
// Ce sont légitimement deux formes différentes — mais elles PARTAGENT le
// même statut, d'où l'import de `ApplicationStatus` plutôt qu'une union
// redéfinie (c'était la source des `as any` disséminés dans les composants).
export interface RecentApplicationSummary {
  id: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  sector: string;
  appliedAt: string; // ISO
  status: ApplicationStatus;
}

// ─── Job Suggestion ──────────────────────────────────────────────────────────

export interface JobSuggestion {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  contractType: string;
  publishedAt: string;
  sector: string;
}

// ─── Dashboard Response ───────────────────────────────────────────────────────

export interface DashboardData {
  profile: CandidatProfile;
  stats: CandidatStats;
  recentApplications: RecentApplicationSummary[];
  suggestions: JobSuggestion[];
  notifications: CandidatNotification[];
}
