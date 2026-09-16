// src/services/emploi/recruteur.service.ts
import { etablissementRepository } from '../repositories/etablissement.repository';
import { offreRepository } from '../offres/offre.repository';
import { applicationRepository } from '../candidatures/application.repository';
import { vitrineRepository } from '../vitrine/vitrine.repository';
import { resolveActiveEtablissementId } from '../services/etablissement-access.service';

function toEtablissementSummary(l: any) {
  return {
    id: String(l.etablissementId),
    name: l.etablissement.name,
    sector: l.etablissement.sector,
    city: l.etablissement.city,
    logo: l.etablissement.logo,
  };
}

export const recruteurService = {
  async getProfile(user: { id: number; email: string; firstName: string; lastName: string; avatar: string | null }) {
    const links = await etablissementRepository.findLinksForUser(user.id);
    const etabId = await resolveActiveEtablissementId(user.id).catch(() => null);

    return {
      id: String(user.id),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      role: 'RECRUITER' as const,
      etablissements: links.map(toEtablissementSummary),
      activeEtablissementId: etabId ? String(etabId) : null,
    };
  },

  async switchEtablissement(userId: number, etablissementId: number): Promise<void> {
    // resolveActiveEtablissementId lève déjà un ForbiddenError si le lien
    // n'existe pas — on s'en sert comme garde d'accès avant de basculer.
    await resolveActiveEtablissementId(userId, etablissementId);
    await etablissementRepository.clearDefaultForUser(userId);
    await etablissementRepository.setDefault(userId, etablissementId);
  },

  async getDashboard(
    user: { id: number; email: string; firstName: string; lastName: string; avatar: string | null },
    requestedEtabId: number | undefined,
    period: string,
  ) {
    const etabId = await resolveActiveEtablissementId(user.id, requestedEtabId);

    const days = period === '30d' ? 30 : period === '90d' ? 90 : period === '1y' ? 365 : 7;
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const [links, offres, allApps, periodApps, vitrine] = await Promise.all([
      etablissementRepository.findLinksForUser(user.id),
      offreRepository.findSummaryForEtablissement(etabId),
      applicationRepository.findAllForEtablissement(etabId),
      applicationRepository.findForEtablissementSince(etabId, start),
      vitrineRepository.findByEtablissementId(etabId),
    ]);

    const activeOffres = offres.filter((o) => o.status === 'ACTIVE');
    const totalViews = offres.reduce((s, o) => s + (o.views ?? 0), 0);
    const totalCandidats = allApps.length;
    const newCandidatures = allApps.filter((a) => !a.isRead).length;
    const tauxConversion = totalViews > 0 ? parseFloat(((totalCandidats / totalViews) * 100).toFixed(2)) : 0;

    const chartData = buildChartData(start, days, periodApps);
    const metierParts = buildMetierParts(offres);

    const recentCandidatures = allApps.slice(0, 5).map((a) => ({
      id: String(a.id),
      candidatName: `${a.user.firstName} ${a.user.lastName}`,
      candidatAvatar: a.user.avatar ?? undefined,
      jobTitle: a.offre.title,
      receivedAt: a.appliedAt.toISOString(),
      starred: a.isFavorite,
    }));

    return {
      profile: {
        id: String(user.id),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        role: 'RECRUITER' as const,
        etablissements: links.map(toEtablissementSummary),
        activeEtablissementId: String(etabId),
      },
      stats: {
        porteeGlobale: totalViews,
        porteeEvolution: 0,
        candidatures: totalCandidats,
        candidaturesEvol: 0,
        offresActives: activeOffres.length,
        tauxConversion,
        tauxConversionEvol: 0,
      },
      chartData,
      metierParts,
      recentCandidatures,
      vitrineHealth: {
        completionScore: vitrine?.completionScore ?? 0,
        views: vitrine?.views ?? 0,
        engagementRate: 8,
      },
      newCandidaturesCount: newCandidatures,
    };
  },
};

function buildChartData(start: Date, days: number, periodApps: { appliedAt: Date }[]) {
  const dateLabels = Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  });
  const countByDate: Record<string, number> = {};
  for (const app of periodApps) {
    const label = new Date(app.appliedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    countByDate[label] = (countByDate[label] ?? 0) + 1;
  }
  return dateLabels.map((date) => ({ date, value: countByDate[date] ?? 0 }));
}

const SECTOR_COLORS: Record<string, string> = {
  'Hôtellerie': '#E8622A', 'Restauration': '#1E2A3A', 'MICE': '#3B5BDB', 'Tech Tourisme': '#4CAF50',
};

function buildMetierParts(offres: { sector: string }[]) {
  const sectorCount: Record<string, number> = {};
  for (const o of offres) {
    const s = o.sector ?? 'Autres';
    sectorCount[s] = (sectorCount[s] ?? 0) + 1;
  }
  const totalOffres = offres.length || 1;
  return Object.entries(sectorCount).map(([name, count], i) => ({
    name,
    value: Math.round((count / totalOffres) * 100),
    color: SECTOR_COLORS[name] ?? ['#E8622A', '#1E2A3A', '#3B5BDB', '#4CAF50', '#9E9E9E'][i % 5],
  }));
}