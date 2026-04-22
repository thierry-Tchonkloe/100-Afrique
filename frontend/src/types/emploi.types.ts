// src/types/emploi.types.ts
// ─── Candidat ────────────────────────────────────────────────────────────────

export interface CandidatProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  title?: string;        // ex: "Réceptionniste Hôtellerie"
  sector?: string;       // ex: "Hôtellerie"
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

// ─── Candidature ─────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | 'pending'
  | 'in_progress'
  | 'accepted'
  | 'refused'
  | 'interview';

export interface Application {
  id: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  sector: string;        // 'hotel' | 'restaurant' | 'transport' …
  appliedAt: string;     // ISO date string
  status: ApplicationStatus;
}

// ─── Job Suggestion ──────────────────────────────────────────────────────────

export interface JobSuggestion {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  contractType: string; // CDI, CDD, Stage …
  publishedAt: string;  // ISO date string
  sector: string;
}

// ─── Notification ────────────────────────────────────────────────────────────

export type NotificationType = 'new_offer' | 'profile_viewed' | 'application_accepted' | 'application_refused';

export interface CandidatNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
}

// ─── Dashboard Response ───────────────────────────────────────────────────────

export interface DashboardData {
  profile: CandidatProfile;
  stats: CandidatStats;
  recentApplications: Application[];
  suggestions: JobSuggestion[];
  notifications: CandidatNotification[];
}