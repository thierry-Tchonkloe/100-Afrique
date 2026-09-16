// src/modules/emploi/candidatures/candidature.types.ts

export type FrontApplicationStatus =
  | 'new'
  | 'in_progress'
  | 'interview'
  | 'accepted'
  | 'refused'
  | 'archived';

export interface UpdateCandidatureStatusInput {
  status: FrontApplicationStatus;
}

export interface ToggleFavoriteInput {
  isFavorite: boolean;
}

export interface ToggleStarInput {
  starred: boolean;
}

export interface SaveNotesInput {
  notes: string;
}

export interface SendMessageInput {
  subject: string;
  body: string;
}

export interface CandidatureOutput {
  id: string;
  candidatName: string;
  candidatAvatar?: string;
  candidatTitle: string;
  matchScore: number;
  offerId: string;
  offerTitle: string;
  receivedAt: string;
  status: FrontApplicationStatus;
  isRead: boolean;
  isFavorite: boolean;
  cvUrl?: string;
  experiences: { jobTitle: string; company: string; period: string; description: string }[];
  formations: { diploma: string; school: string; year: string }[];
  skills: string[];
  location: string;
  mobility: string;
  availability: string;
  salarySought?: number;
  recruiterNotes: string;
}