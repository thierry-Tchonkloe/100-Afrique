// src/services/emploi/candidatures.service.ts
import { applicationRepository } from '../../repositories/emploi/application.repository';
import { notificationRepository } from '../../repositories/emploi/notification.repository';
import { offreRepository } from '../../repositories/emploi/offre.repository';
import { resolveActiveEtablissementId } from './etablissement-access.service';
import { NotFoundError } from '../../errors/http-errors';
import type {
  FrontApplicationStatus, SaveNotesInput, SendMessageInput,
  ToggleFavoriteInput, ToggleStarInput, UpdateCandidatureStatusInput,
} from '../../types/emploi/candidature.types';

const STATUS_MAP: Record<FrontApplicationStatus, string> = {
  new: 'SENT', in_progress: 'IN_PROGRESS', interview: 'INTERVIEW',
  accepted: 'ACCEPTED', refused: 'REFUSED', archived: 'ARCHIVED',
};

const STATUS_REV: Record<string, FrontApplicationStatus> = {
  IN_PROGRESS: 'in_progress', SELECTED: 'in_progress', VIEWED: 'in_progress', ACCEPTED: 'in_progress',
  INTERVIEW: 'interview', REFUSED: 'refused', ARCHIVED: 'refused', PENDING: 'new',
};

function toFrontStatus(a: { status: string; isRead: boolean }): FrontApplicationStatus {
  if (a.status === 'SENT') return a.isRead ? 'in_progress' : 'new';
  return STATUS_REV[a.status] ?? 'in_progress';
}

function calcMatchScore(app: any): number {
  const expCount = app.user.candidatProfil?.experiences?.length ?? 0;
  const seed = Number(app.id) % 20; // seedé par l'id pour rester déterministe (pas de Math.random)
  return Math.min(50 + expCount * 10 + seed, 99);
}

function toCandidatureOutput(a: any) {
  const profil = a.user.candidatProfil;
  return {
    id: String(a.id),
    candidatName: `${a.user.firstName} ${a.user.lastName}`,
    candidatAvatar: a.user.avatar ?? undefined,
    candidatTitle: profil?.headline ?? 'Candidat',
    matchScore: a.matchScore || calcMatchScore(a),
    offerId: String(a.offreId),
    offerTitle: a.offre.title,
    receivedAt: a.appliedAt.toISOString(),
    status: toFrontStatus(a),
    isRead: a.isRead,
    isFavorite: a.isFavorite,
    cvUrl: profil?.cvFileUrl ?? undefined,
    experiences: (profil?.experiences ?? []).map((e: any) => ({
      jobTitle: e.jobTitle,
      company: e.companyName,
      period: `${e.startDate}${e.endDate ? ` - ${e.endDate}` : ' - En poste'}`,
      description: (e.missions as string[])[0] ?? '',
    })),
    formations: (profil?.formations ?? []).map((f: any) => ({ diploma: f.diploma, school: f.school, year: f.year })),
    skills: (profil?.hardSkills as string[]) ?? [],
    location: profil?.city ?? '',
    mobility: profil?.mobility ?? '',
    availability: profil?.availability ?? 'immediate',
    salarySought: undefined,
    recruiterNotes: a.recruiterNotes ?? '',
  };
}

export const candidaturesService = {
  async list(userId: number, requestedEtabId?: number, offerId?: number) {
    const etabId = await resolveActiveEtablissementId(userId, requestedEtabId);

    const [apps, offres] = await Promise.all([
      applicationRepository.findManyForEtablissement(etabId, offerId),
      offreRepository.findTitlesForEtablissement(etabId),
    ]);

    const stats = {
      new: apps.filter((a) => a.status === 'SENT' && !a.isRead).length,
      in_progress: apps.filter(
        (a) => (a.status === 'SENT' && a.isRead) || ['IN_PROGRESS', 'SELECTED', 'VIEWED', 'ACCEPTED'].includes(a.status),
      ).length,
      interview: apps.filter((a) => a.status === 'INTERVIEW').length,
      favorite: apps.filter((a) => a.isFavorite).length,
      refused: apps.filter((a) => ['REFUSED', 'ARCHIVED'].includes(a.status)).length,
    };

    return {
      stats,
      offers: offres.map((o) => ({ id: String(o.id), title: o.title })),
      candidatures: apps.map(toCandidatureOutput),
    };
  },

  async updateStatus(applicationId: number, input: UpdateCandidatureStatusInput) {
    const app = await applicationRepository.findById(applicationId);
    if (!app) throw new NotFoundError('Candidature introuvable');

    const dbStatus = STATUS_MAP[input.status] ?? 'IN_PROGRESS';
    const timeline = [...((app.timeline as any[]) ?? []), { status: input.status, date: new Date().toISOString() }];
    const updated = await applicationRepository.updateStatusWithTimeline(applicationId, dbStatus, timeline);

    await notifyCandidateOfStatusChange(updated, input.status);

    return { status: toFrontStatus(updated) };
  },

  async markRead(applicationId: number): Promise<void> {
    const app = await applicationRepository.markRead(applicationId);
    await notificationRepository
      .create({ userId: app.userId, type: 'PROFILE_VIEWED', title: 'Profil consulté', description: 'Un recruteur a consulté votre candidature', relatedId: String(app.id) })
      .catch(() => {});
  },

  async toggleFavorite(applicationId: number, input: ToggleFavoriteInput): Promise<void> {
    await applicationRepository.toggleFavorite(applicationId, input.isFavorite);
  },

  async toggleStar(applicationId: number, input: ToggleStarInput): Promise<void> {
    await applicationRepository.toggleFavorite(applicationId, input.starred);
  },

  async saveNotes(applicationId: number, input: SaveNotesInput): Promise<void> {
    await applicationRepository.saveNotes(applicationId, input.notes);
  },

  async sendMessage(applicationId: number, input: SendMessageInput): Promise<void> {
    const app = await applicationRepository.findByIdWithMessageContext(applicationId);
    if (!app) throw new NotFoundError('Candidature introuvable');

    await notificationRepository.create({
      userId: app.userId,
      type: 'APPLICATION_ACCEPTED',
      title: input.subject,
      description: input.body.slice(0, 200),
      relatedId: String(app.id),
    });
  },
};

async function notifyCandidateOfStatusChange(app: any, status: FrontApplicationStatus): Promise<void> {
  const notifType =
    status === 'refused' ? 'APPLICATION_REFUSED' : status === 'accepted' || status === 'interview' ? 'APPLICATION_ACCEPTED' : null;
  if (!notifType) return;

  const offre = await offreRepository.findWithEtablissementNameById(app.offreId);

  await notificationRepository.create({
    userId: app.userId,
    type: notifType,
    title: status === 'refused' ? 'Candidature non retenue' : 'Votre candidature progresse',
    description:
      status === 'interview'
        ? `${offre?.etablissement.name} vous invite à un entretien pour ${offre?.title}`
        : status === 'refused'
        ? `Votre candidature pour ${offre?.title} n'a pas été retenue`
        : `Votre candidature pour ${offre?.title} est en cours d'examen`,
    relatedId: String(app.id),
  });
}