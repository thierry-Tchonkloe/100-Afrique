// src/controllers/emploi/recruteur.controller.ts
// FIX TS6133 : suppression de la variable 'defaultLink' déclarée mais jamais lue (ligne ~248)
// Le reste du fichier est identique à la version corrigée précédemment.
//
// Remplacer uniquement le bloc getDashboard à partir de la ligne qui déclarait :
//
//   const defaultLink = links.find((l) => l.isDefault) ?? links[0];
//
// par :
//
//   (rien — la variable n'est plus nécessaire car activeEtablissementId = String(etabId))
//
// ─────────────────────────────────────────────────────────────────────────────
// Voici le fichier complet corrigé :

import { type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

const prisma = new PrismaClient();

async function getActiveEtab(userId: number, requestedId?: string): Promise<number | null> {
  if (requestedId) {
    const link = await prisma.recruteurEtablissement.findUnique({
      where: { userId_etablissementId: { userId, etablissementId: Number(requestedId) } },
      select: { etablissementId: true },
    });
    return link?.etablissementId ?? null;
  }
  const def = await prisma.recruteurEtablissement.findFirst({
    where: { userId, isDefault: true },
    select: { etablissementId: true },
  });
  if (def) return def.etablissementId;
  const first = await prisma.recruteurEtablissement.findFirst({
    where: { userId },
    select: { etablissementId: true },
  });
  return first?.etablissementId ?? null;
}

// ── GET /api/emploi/recruteur/profile ─────────────────────────────────────────
export async function getProfile(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const [user, links] = await Promise.all([
      prisma.emploiUser.findUnique({
        where: { id: uid },
        select: { id: true, email: true, firstName: true, lastName: true, avatar: true, role: true },
      }),
      prisma.recruteurEtablissement.findMany({
        where: { userId: uid },
        include: { etablissement: true },
      }),
    ]);

    if (!user) {
      res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
      return;
    }

    // FIX : on utilise etabId depuis getActiveEtab plutôt que defaultLink
    const etabId = await getActiveEtab(uid);

    res.json({
      success: true,
      data: {
        id:        String(uid),
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        avatar:    user.avatar,
        role:      'RECRUITER',
        etablissements: links.map((l) => ({
          id:     String(l.etablissementId),
          name:   l.etablissement.name,
          sector: l.etablissement.sector,
          city:   l.etablissement.city,
          logo:   l.etablissement.logo,
        })),
        // FIX TS6133 : utilise directement etabId, pas defaultLink
        activeEtablissementId: etabId ? String(etabId) : null,
      },
    });
  } catch (e) {
    console.error('[getProfile]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── PATCH /api/emploi/recruteur/profile/etablissement ─────────────────────────
export async function switchEtablissement(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const { etablissementId } = req.body;

    const link = await prisma.recruteurEtablissement.findUnique({
      where: { userId_etablissementId: { userId: uid, etablissementId: Number(etablissementId) } },
    });
    if (!link) {
      res.status(403).json({ success: false, message: 'Accès refusé à cet établissement' });
      return;
    }

    await prisma.recruteurEtablissement.updateMany({ where: { userId: uid }, data: { isDefault: false } });
    await prisma.recruteurEtablissement.update({
      where: { userId_etablissementId: { userId: uid, etablissementId: Number(etablissementId) } },
      data: { isDefault: true },
    });

    res.json({ success: true });
  } catch (e) {
    console.error('[switchEtablissement]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── GET /api/emploi/recruteur/dashboard ───────────────────────────────────────
export async function getDashboard(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid    = req.emploiUser!.id;
    const period = (req.query.period as string) ?? '7d';

    const etabId = await getActiveEtab(uid, req.query.etablissementId as string);
    if (!etabId) {
      res.status(404).json({ success: false, message: 'Aucun établissement lié à ce compte' });
      return;
    }

    const days  = period === '30d' ? 30 : period === '90d' ? 90 : period === '1y' ? 365 : 7;
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const [user, links, offres, allApps, periodApps, vitrine] = await Promise.all([
      prisma.emploiUser.findUnique({
        where: { id: uid },
        select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
      }),
      prisma.recruteurEtablissement.findMany({
        where: { userId: uid },
        include: { etablissement: { select: { id: true, name: true, sector: true, city: true, logo: true } } },
      }),
      prisma.offre.findMany({
        where: { etablissementId: etabId },
        select: { id: true, status: true, views: true, sector: true },
      }),
      prisma.application.findMany({
        where: { etablissementId: etabId },
        include: {
          user: { select: { firstName: true, lastName: true, avatar: true } },
          offre: { select: { title: true } },
        },
        orderBy: { appliedAt: 'desc' },
      }),
      prisma.application.findMany({
        where: { etablissementId: etabId, appliedAt: { gte: start } },
        select: { appliedAt: true, offre: { select: { sector: true } } },
      }),
      prisma.vitrine.findUnique({ where: { etablissementId: etabId } }),
    ]);

    if (!user) {
      res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
      return;
    }

    const activeOffres   = offres.filter((o) => o.status === 'ACTIVE');
    const totalViews     = offres.reduce((s, o) => s + (o.views ?? 0), 0);
    const totalCandidats = allApps.length;
    const newCandidatures = allApps.filter((a) => !a.isRead).length;
    const tauxConversion  = totalViews > 0
      ? parseFloat(((totalCandidats / totalViews) * 100).toFixed(2))
      : 0;

    // Chart : candidatures par jour sur la période
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
    const chartData = dateLabels.map((date) => ({ date, value: countByDate[date] ?? 0 }));

    // MetierParts : répartition des offres par secteur
    const sectorCount: Record<string, number> = {};
    for (const o of offres) {
      const s = o.sector ?? 'Autres';
      sectorCount[s] = (sectorCount[s] ?? 0) + 1;
    }
    const SECTOR_COLORS: Record<string, string> = {
      'Hôtellerie': '#E8622A', 'Restauration': '#1E2A3A',
      'MICE': '#3B5BDB', 'Tech Tourisme': '#4CAF50',
    };
    const totalOffres = offres.length || 1;
    const metierParts = Object.entries(sectorCount).map(([name, count], i) => ({
      name,
      value: Math.round((count / totalOffres) * 100),
      color: SECTOR_COLORS[name] ?? ['#E8622A', '#1E2A3A', '#3B5BDB', '#4CAF50', '#9E9E9E'][i % 5],
    }));

    const recentCandidatures = allApps.slice(0, 5).map((a) => ({
      id:             String(a.id),
      candidatName:   `${a.user.firstName} ${a.user.lastName}`,
      candidatAvatar: a.user.avatar ?? undefined,
      jobTitle:       a.offre.title,
      receivedAt:     a.appliedAt.toISOString(),
      starred:        a.isFavorite,
    }));

    // FIX TS6133 : pas de 'defaultLink' — on utilise directement etabId
    const profile = {
      id:        String(uid),
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email,
      avatar:    user.avatar,
      role:      'RECRUITER' as const,
      etablissements: links.map((l) => ({
        id:     String(l.etablissementId),
        name:   l.etablissement.name,
        sector: l.etablissement.sector,
        city:   l.etablissement.city,
        logo:   l.etablissement.logo,
      })),
      activeEtablissementId: String(etabId), // ← directement depuis etabId
    };

    res.json({
      success: true,
      data: {
        profile,
        stats: {
          porteeGlobale:      totalViews,
          porteeEvolution:    0,
          candidatures:       totalCandidats,
          candidaturesEvol:   0,
          offresActives:      activeOffres.length,
          tauxConversion,
          tauxConversionEvol: 0,
        },
        chartData,
        metierParts,
        recentCandidatures,
        vitrineHealth: {
          completionScore: vitrine?.completionScore ?? 0,
          views:           vitrine?.views           ?? 0,
          engagementRate:  8,
        },
        newCandidaturesCount: newCandidatures,
      },
    });
  } catch (e) {
    console.error('[getDashboard]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}
