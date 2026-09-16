// src/modules/emploi/candidatures/candidat-application.service.ts
import { applicationRepository } from './application.repository';
import { offreRepository } from '../offres/offre.repository';
import { etablissementRepository } from '../repositories/etablissement.repository';
import { notificationRepository } from '../notifications/notification.repository';
import { NotFoundError, ConflictError } from '../../../errors/http-errors';

const IN_PROGRESS_STATUSES = ['SENT', 'VIEWED', 'IN_PROGRESS', 'SELECTED', 'INTERVIEW'];

function toApplicationOutput(a: any) {
  return {
    id: String(a.id),
    jobTitle: a.offre.title,
    companyName: a.offre.etablissement.name,
    sector: a.offre.sector,
    location: a.offre.location,
    contractType: a.offre.contractType,
    postedAt: a.offre.publishedAt?.toISOString() ?? a.offre.createdAt.toISOString(),
    appliedAt: a.appliedAt.toISOString(),
    status: a.status.toLowerCase(),
    timeline: a.timeline,
  };
}

export const candidatApplicationService = {
  async getApplications(userId: number) {
    const apps = await applicationRepository.findManyForUser(userId);
    return {
      stats: {
        total: apps.length,
        inProgress: apps.filter((a) => IN_PROGRESS_STATUSES.includes(a.status)).length,
        interviews: apps.filter((a) => a.status === 'INTERVIEW').length,
      },
      applications: apps.map(toApplicationOutput),
    };
  },

  async applyToJob(candidat: { id: number; firstName: string; lastName: string }, jobId: number) {
    const offre = await offreRepository.findById(jobId);
    if (!offre) throw new NotFoundError('Offre introuvable');

    const existing = await applicationRepository.findByUserAndOffre(candidat.id, offre.id);
    if (existing) throw new ConflictError('Vous avez déjà postulé à cette offre');

    const app = await applicationRepository.create({
      userId: candidat.id,
      offreId: offre.id,
      etablissementId: offre.etablissementId,
      timeline: [{ status: 'sent', date: new Date().toISOString(), note: 'Candidature envoyée' }],
    });

    // `etablissementRepository.findLinksForUser` prend un userId, pas un
    // etablissementId : on utilise ici son pendant inverse, dédié à ce cas
    // (voir etablissement.repository.ts).
    const recruiterLinks = await etablissementRepository.findRecruiterUserIdsForEtablissement(offre.etablissementId);

    if (recruiterLinks.length) {
      await notificationRepository.createMany(
        recruiterLinks.map((r) => ({
          userId: r.userId,
          type: 'NEW_APPLICATION',
          title: 'Nouvelle candidature',
          description: `${candidat.firstName} ${candidat.lastName} a postulé pour ${offre.title}`,
          relatedId: String(app.id),
        })),
      );
    }

    return { message: 'Candidature envoyée', id: String(app.id) };
  },

  async withdraw(applicationId: number): Promise<void> {
    await applicationRepository.delete(applicationId);
  },
};