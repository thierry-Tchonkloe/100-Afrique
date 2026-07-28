// src/types/candidatures.types.ts
//
// Source UNIQUE de vérité pour tout ce qui touche aux candidatures et
// notifications. AVANT : emploi.types.ts redéfinissait sa propre version
// plus étroite d'ApplicationStatus (5 valeurs : pending/in_progress/
// accepted/refused/interview) alors que celle-ci en a 9 (elle correspond
// exactement aux valeurs renvoyées par le backend — voir
// candidatures.service.ts côté API, fonction toFrontStatus). Deux unions
// différentes pour le même concept forçaient des `as any` disséminés
// dans les composants pour faire taire TypeScript — ce n'est jamais un
// vrai fix, juste un silence. emploi.types.ts importe désormais ce type.

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

export interface TimelineEvent {
  id: string;
  status: ApplicationStatus;
  date: string; // ISO
  note?: string;
}

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
  cvSent?: string;
  coverLetterSent?: boolean;
  hasChat?: boolean;
}

export interface CandidaturesStats {
  total: number;
  inProgress: number;
  interviews: number;
}

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

export type FilterTab = 'all' | 'active' | 'archived';

export const FILTER_LABELS: Record<FilterTab, string> = {
  all: 'Toutes',
  active: 'Actives',
  archived: 'Archives',
};
