// src/types/candidatures.types.ts
// ─── Application Status ───────────────────────────────────────────────────────

export type ApplicationStatus =
  | 'pending'
  | 'sent'
  | 'viewed'
  | 'in_progress'
  | 'selected'
  | 'interview'
  | 'accepted'
  | 'refused'
  | 'archived';

// ─── Timeline Event ───────────────────────────────────────────────────────────

export interface TimelineEvent {
  id: string;
  status: ApplicationStatus;
  date: string; // ISO
  note?: string;
}

// ─── Application ─────────────────────────────────────────────────────────────

export interface Application {
  id: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  sector: string;
  location: string;
  contractType: string;
  postedAt: string;   // ISO - date de l'offre
  appliedAt: string;  // ISO - date d'envoi
  status: ApplicationStatus;
  timeline: TimelineEvent[];
  cvSent?: string;    // nom du fichier CV
  coverLetterSent?: boolean;
  hasChat?: boolean;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface CandidaturesStats {
  total: number;
  inProgress: number;
  interviews: number;
}

// ─── Notification (shared type) ───────────────────────────────────────────────

export type NotificationType =
  | 'new_offer'
  | 'profile_viewed'
  | 'application_accepted'
  | 'application_refused';

export interface CandidatNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
}

// ─── Filter ───────────────────────────────────────────────────────────────────

export type FilterTab = 'all' | 'active' | 'archived';

export const FILTER_LABELS: Record<FilterTab, string> = {
  all:      'Toutes',
  active:   'Actives',
  archived: 'Archives',
};