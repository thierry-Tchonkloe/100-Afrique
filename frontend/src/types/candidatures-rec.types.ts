// src/types/candidatures-rec.types.ts

// Le backend renvoie 'sent' pour les nouvelles candidatures non lues (STATUS_REV['SENT'] = 'sent').
// On garde 'new' comme alias UI-only pour le filtre "Nouveaux" (= sent + !isRead).
// Les vrais statuts API sont : sent | viewed | in_progress | selected | interview | accepted | refused | archived
export type CandidatureRecStatus =
  | 'new'          // alias UI : sent && !isRead (jamais reçu tel quel de l'API)
  | 'sent'         // reçu de l'API (SENT lu ou non lu)
  | 'viewed'       // profil consulté
  | 'in_progress'  // en cours / sélectionné
  | 'interview'    // entretien programmé
  | 'favorite'     // favori (cross-statut)
  | 'refused'      // refusé
  | 'accepted';    // accepté

export const STATUS_LABELS: Record<CandidatureRecStatus, string> = {
  new:         'Nouveau',
  sent:        'Envoyée',
  viewed:      'Consultée',
  in_progress: 'En cours',
  interview:   'Entretien',
  favorite:    'Favori',
  refused:     'Refusé',
  accepted:    'Accepté',
};

export const STATUS_COLORS: Record<CandidatureRecStatus, string> = {
  new:         'bg-blue-50 text-blue-600',
  sent:        'bg-blue-50 text-blue-600',
  viewed:      'bg-amber-50 text-amber-600',
  in_progress: 'bg-orange-50 text-orange-600',
  interview:   'bg-green-50 text-green-600',
  favorite:    'bg-yellow-50 text-yellow-600',
  refused:     'bg-red-50 text-red-400',
  accepted:    'bg-emerald-50 text-emerald-600',
};

// ── Expérience / Formation ────────────────────────────────────────────────────

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

// ── Candidature ───────────────────────────────────────────────────────────────

export interface CandidatureRec {
  id: string;
  candidatName: string;
  candidatAvatar?: string;
  candidatTitle: string;
  matchScore: number;
  offerId: string;
  offerTitle: string;
  receivedAt: string;       // ISO
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

// ── Offer option ──────────────────────────────────────────────────────────────

export interface OfferOption {
  id: string;
  title: string;
}

// ── Stats — index signature pour compatibilité Record<string, number> ─────────

export interface CandidaturesRecStats {
  new:         number;  // sent && !isRead (calculé côté front ou fourni par l'API)
  in_progress: number;
  interview:   number;
  favorite:    number;
  refused:     number;
  [key: string]: number;
}

// ── API Response ──────────────────────────────────────────────────────────────

export interface CandidaturesRecResponse {
  stats: CandidaturesRecStats;
  offers: OfferOption[];
  candidatures: CandidatureRec[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Normalise un statut reçu de l'API vers nos types UI.
 * Le backend renvoie 'sent' pour une nouvelle candidature ;
 * on le laisse tel quel — c'est le filtre de l'onglet "Nouveaux" qui gère
 * la logique (sent && !isRead).
 */
export function normalizeStatus(raw: string): CandidatureRecStatus {
  const MAP: Record<string, CandidatureRecStatus> = {
    sent:        'sent',
    new:         'sent',
    viewed:      'viewed',
    in_progress: 'in_progress',
    selected:    'in_progress',  // 'selected' → 'in_progress' côté UI
    interview:   'interview',
    accepted:    'accepted',
    refused:     'refused',
    archived:    'refused',      // on range dans refusé pour simplifier
  };
  return MAP[raw] ?? 'sent';
}

/**
 * Recalcule les stats à partir de la liste locale (utilisé après un patch optimiste).
 */
export function computeStats(candidatures: CandidatureRec[]): CandidaturesRecStats {
  return {
    new:         candidatures.filter((c) => isNew(c)).length,
    in_progress: candidatures.filter((c) => c.status === 'in_progress' || c.status === 'viewed').length,
    interview:   candidatures.filter((c) => c.status === 'interview').length,
    favorite:    candidatures.filter((c) => c.isFavorite).length,
    refused:     candidatures.filter((c) => c.status === 'refused').length,
  };
}

/**
 * Une candidature est "nouvelle" (onglet Nouveaux) si elle n'est pas encore lue
 * ET que son statut est 'sent' (ou l'alias 'new' qui peut venir du mock).
 */
export function isNew(c: CandidatureRec): boolean {
  return !c.isRead && (c.status === 'sent' || c.status === 'new');
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
