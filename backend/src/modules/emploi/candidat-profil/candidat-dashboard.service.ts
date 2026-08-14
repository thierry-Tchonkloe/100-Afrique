// src/services/emploi/candidat-dashboard.service.ts
import { candidatProfilRepository } from './candidatProfil.repository';
import { applicationRepository } from '../candidatures/application.repository';
import { alerteJobRepository } from '../alertes/alerteJob.repository';
import { notificationRepository } from '../notifications/notification.repository';
import { offreRepository } from '../offres/offre.repository';
import { calcProfileStrength } from './candidat-profil.service';

function toSuggestionOutput(o: any) {
  return {
    id: String(o.id),
    title: o.title,
    companyName: o.etablissement.name,
    location: o.location,
    contractType: o.contractType,
    publishedAt: o.publishedAt?.toISOString() ?? o.createdAt.toISOString(),
    sector: o.sector,
  };
}

export const candidatDashboardService = {
  async getDashboard(userId: number, user: { firstName: string; lastName: string }) {
    const [profil, apps, alertsCount, notifs] = await Promise.all([
      candidatProfilRepository.findByUserIdWithDashboardRelations(userId),
      applicationRepository.findRecentForUser(userId, 5),
      alerteJobRepository.countActiveForUser(userId),
      notificationRepository.findManyForUser(userId, 5),
    ]);

    const suggestions = await offreRepository.findManyPublic({ status: 'ACTIVE' } as any, 0, 3);

    return {
      profile: {
        id: String(userId),
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: profil?.avatar,
        headline: profil?.headline ?? '',
        sector: 'Hôtellerie',
        profileStrength: profil ? calcProfileStrength(profil) : 0,
        profileStrengthMessage: 'Ajoutez vos expériences pour attirer 3x plus de recruteurs',
      },
      stats: {
        applicationsCount: apps.length,
        profileViews: 47,
        savedJobsCount: 8,
        activeAlertsCount: alertsCount,
      },
      recentApplications: apps.map((a) => ({
        id: String(a.id),
        jobTitle: a.offre.title,
        companyName: a.offre.etablissement.name,
        sector: a.offre.sector,
        appliedAt: a.appliedAt.toISOString(),
        status: mapStatusToFront(a.status),
      })),
      suggestions: suggestions.map(toSuggestionOutput),
      notifications: notifs.map((n) => ({
        id: String(n.id), type: n.type.toLowerCase(), title: n.title,
        description: n.description, createdAt: n.createdAt.toISOString(), read: n.isRead,
      })),
    };
  },

  async getSuggestions(userId: number, requestedSector?: string) {
    const profil = await candidatProfilRepository.findByUserId(userId);
    const sector = requestedSector ?? profil?.mobility ?? '';
    const offres = await offreRepository.findManyPublic(
      { status: 'ACTIVE', ...(sector && { sector: { contains: sector.split(' ')[0], mode: 'insensitive' } }) } as any,
      0,
      3,
    );
    return offres.map(toSuggestionOutput);
  },
};

function mapStatusToFront(s: string): string {
  return s.toLowerCase();
}