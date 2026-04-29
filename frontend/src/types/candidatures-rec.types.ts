// src/types/candidatures-rec.types.ts
// FIX: CandidaturesRecStats now has an index signature so it's assignable
// to Record<string, number> — fixes the TS2345 error.

export type CandidatureRecStatus =
  | 'new'
  | 'in_progress'
  | 'interview'
  | 'favorite'
  | 'refused';

export const STATUS_LABELS: Record<CandidatureRecStatus, string> = {
  new:         'Nouveau',
  in_progress: 'En cours',
  interview:   'Entretien',
  favorite:    'Favori',
  refused:     'Refusé',
};

export const STATUS_COLORS: Record<CandidatureRecStatus, string> = {
  new:         'bg-blue-50 text-blue-600',
  in_progress: 'bg-orange-50 text-orange-600',
  interview:   'bg-green-50 text-green-600',
  favorite:    'bg-yellow-50 text-yellow-600',
  refused:     'bg-red-50 text-red-400',
};

// ── Experience ────────────────────────────────────────────────────────────────

export interface CandidatExperience {
  jobTitle: string;
  company: string;
  period: string;
  description?: string;
}

export interface CandidatFormation {
  diploma: string;
  school: string;
  year: string;
}

// ── Full candidature card ─────────────────────────────────────────────────────

export interface CandidatureRec {
  id: string;
  candidatName: string;
  candidatAvatar?: string;
  candidatTitle: string;
  matchScore: number;
  offerId: string;
  offerTitle: string;
  receivedAt: string;
  status: CandidatureRecStatus;
  isRead: boolean;
  isFavorite: boolean;
  cvUrl?: string;
  experiences: CandidatExperience[];
  formations: CandidatFormation[];
  skills: string[];
  location: string;
  mobility: string;
  availability: string;
  salarySought?: string;
  recruiterNotes: string;
}

// ── Offers for filter ─────────────────────────────────────────────────────────

export interface OfferOption {
  id: string;
  title: string;
}

// ── Stats — FIX: index signature added ───────────────────────────────────────
// Without [key: string]: number, TypeScript refuses to assign this to
// Record<string, number> even though all fields are numbers. The index
// signature tells TS that any string key also maps to a number.

export interface CandidaturesRecStats {
  new:         number;
  in_progress: number;
  interview:   number;
  favorite:    number;
  refused:     number;
  [key: string]: number; // ← the fix
}

// ── API Response ──────────────────────────────────────────────────────────────

export interface CandidaturesRecResponse {
  stats: CandidaturesRecStats;
  offers: OfferOption[];
  candidatures: CandidatureRec[];
}

// ── Message templates ─────────────────────────────────────────────────────────

export interface MessageTemplate {
  id: string;
  label: string;
  subject: string;
  body: string;
}

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'interview_request',
    label: "Demande d'entretien",
    subject: 'Invitation à un entretien',
    body: "Bonjour,\n\nNous avons bien étudié votre candidature et nous souhaiterions vous rencontrer pour un entretien.\n\nPouvez-vous nous indiquer vos disponibilités ?\n\nCordialement,",
  },
  {
    id: 'negative_response',
    label: 'Réponse négative polie',
    subject: 'Suite donnée à votre candidature',
    body: "Bonjour,\n\nNous vous remercions de l'intérêt que vous portez à notre établissement.\n\nAprès examen attentif de votre candidature, nous avons retenu d'autres profils correspondant davantage à nos besoins actuels.\n\nNous espérons avoir l'occasion de collaborer ultérieurement.\n\nCordialement,",
  },
  {
    id: 'documents_request',
    label: 'Demande de documents',
    subject: 'Documents complémentaires',
    body: "Bonjour,\n\nVotre candidature a retenu notre attention. Pourriez-vous nous faire parvenir les documents suivants :\n\n- Lettre de motivation\n- Références\n\nCordialement,",
  },
];


















// // src/types/candidatures-rec.types.ts

// export type CandidatureRecStatus =
//   | 'new'
//   | 'in_progress'
//   | 'interview'
//   | 'favorite'
//   | 'refused';

// export const STATUS_LABELS: Record<CandidatureRecStatus, string> = {
//   new:         'Nouveau',
//   in_progress: 'En cours',
//   interview:   'Entretien',
//   favorite:    'Favori',
//   refused:     'Refusé',
// };

// export const STATUS_COLORS: Record<CandidatureRecStatus, string> = {
//   new:         'bg-blue-50 text-blue-600',
//   in_progress: 'bg-orange-50 text-orange-600',
//   interview:   'bg-green-50 text-green-600',
//   favorite:    'bg-yellow-50 text-yellow-600',
//   refused:     'bg-red-50 text-red-400',
// };

// // ─── Experience ───────────────────────────────────────────────────────────────

// export interface CandidatExperience {
//   jobTitle: string;
//   company: string;
//   period: string;
//   description?: string;
// }

// export interface CandidatFormation {
//   diploma: string;
//   school: string;
//   year: string;
// }

// // ─── Full candidature card ────────────────────────────────────────────────────

// export interface CandidatureRec {
//   id: string;
//   // Candidat info
//   candidatName: string;
//   candidatAvatar?: string;
//   candidatTitle: string;     // ex: "Réceptionniste Expérimentée"
//   // Matching
//   matchScore: number;        // 0–100
//   // Application meta
//   offerId: string;
//   offerTitle: string;        // ex: "Réceptionniste H/F"
//   receivedAt: string;        // ISO
//   status: CandidatureRecStatus;
//   isRead: boolean;
//   isFavorite: boolean;
//   // CV
//   cvUrl?: string;
//   // Profile summary
//   experiences: CandidatExperience[];
//   formations: CandidatFormation[];
//   skills: string[];
//   location: string;
//   mobility: string;
//   availability: string;
//   salarySought?: string;
//   // Notes (private)
//   recruiterNotes: string;
// }

// // ─── Offers for filter ────────────────────────────────────────────────────────

// export interface OfferOption {
//   id: string;
//   title: string;
// }

// // ─── Stats ────────────────────────────────────────────────────────────────────

// export interface CandidaturesRecStats {
//   new:         number;
//   in_progress: number;
//   interview:   number;
//   favorite:    number;
//   refused:     number;
// }

// // ─── API Response ─────────────────────────────────────────────────────────────

// export interface CandidaturesRecResponse {
//   stats: CandidaturesRecStats;
//   offers: OfferOption[];
//   candidatures: CandidatureRec[];
// }

// // ─── Message templates ────────────────────────────────────────────────────────

// export interface MessageTemplate {
//   id: string;
//   label: string;
//   subject: string;
//   body: string;
// }

// export const MESSAGE_TEMPLATES: MessageTemplate[] = [
//   {
//     id: 'interview_request',
//     label: 'Demande d\'entretien',
//     subject: 'Invitation à un entretien',
//     body: 'Bonjour,\n\nNous avons bien étudié votre candidature et nous souhaiterions vous rencontrer pour un entretien.\n\nPouvez-vous nous indiquer vos disponibilités ?\n\nCordialement,',
//   },
//   {
//     id: 'negative_response',
//     label: 'Réponse négative polie',
//     subject: 'Suite donnée à votre candidature',
//     body: 'Bonjour,\n\nNous vous remercions de l\'intérêt que vous portez à notre établissement.\n\nAprès examen attentif de votre candidature, nous avons retenu d\'autres profils correspondant davantage à nos besoins actuels.\n\nNous espérons avoir l\'occasion de collaborer ultérieurement.\n\nCordialement,',
//   },
//   {
//     id: 'documents_request',
//     label: 'Demande de documents',
//     subject: 'Documents complémentaires',
//     body: 'Bonjour,\n\nVotre candidature a retenu notre attention. Pourriez-vous nous faire parvenir les documents suivants :\n\n- Lettre de motivation\n- Références\n\nCordialement,',
//   },
// ];