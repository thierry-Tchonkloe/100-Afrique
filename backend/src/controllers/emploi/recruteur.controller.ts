// src/controllers/emploi/recruteur.controller.ts
import { type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

const prisma = new PrismaClient();

// Helper: get active etablissementId for a recruiter
async function getActiveEtab(userId: number, requestedId?: string): Promise<number | null> {
  if (requestedId) return Number(requestedId);
  const link = await prisma.recruteurEtablissement.findFirst({
    where: { userId, isDefault: true },
    select: { etablissementId: true },
  });
  if (link) return link.etablissementId;
  const first = await prisma.recruteurEtablissement.findFirst({ where: { userId }, select: { etablissementId: true } });
  return first?.etablissementId ?? null;
}

// ── GET /api/emploi/recruteur/profile ──────────────────────────────────────────
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

    const defaultLink = links.find((l) => l.isDefault) ?? links[0];
    res.json({
      success: true,
      data: {
        id: String(uid),
        firstName: user!.firstName, lastName: user!.lastName,
        email: user!.email, avatar: user!.avatar, role: 'RECRUITER',
        etablissements: links.map((l) => ({
          id: String(l.etablissementId),
          name: l.etablissement.name,
          sector: l.etablissement.sector,
          city: l.etablissement.city,
          logo: l.etablissement.logo,
        })),
        activeEtablissementId: defaultLink ? String(defaultLink.etablissementId) : null,
      },
    });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// ── PATCH /api/emploi/recruteur/profile/etablissement ─────────────────────────
export async function switchEtablissement(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const { etablissementId } = req.body;
    // Verify user has access
    const link = await prisma.recruteurEtablissement.findUnique({
      where: { userId_etablissementId: { userId: uid, etablissementId: Number(etablissementId) } },
    });
    if (!link) { res.status(403).json({ success: false, message: 'Accès refusé à cet établissement' }); return; }
    // Set all to non-default then set the chosen one
    await prisma.recruteurEtablissement.updateMany({ where: { userId: uid }, data: { isDefault: false } });
    await prisma.recruteurEtablissement.update({
      where: { userId_etablissementId: { userId: uid, etablissementId: Number(etablissementId) } },
      data: { isDefault: true },
    });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// ── GET /api/emploi/recruteur/dashboard ───────────────────────────────────────
export async function getDashboard(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const etabId = await getActiveEtab(uid, req.query.etablissementId as string);
    if (!etabId) { res.status(404).json({ success: false, message: 'Aucun établissement' }); return; }

    const [, offres, applications, vitrineData] = await Promise.all([
      getProfile(req, { json: () => {} } as any).then(() => null), // get profile data separately
      prisma.offre.findMany({ where: { etablissementId: etabId } }),
      prisma.application.findMany({
        where: { etablissementId: etabId },
        include: { user: { select: { firstName: true, lastName: true, avatar: true } }, offre: { select: { title: true } } },
        orderBy: { appliedAt: 'desc' },
        take: 5,
      }),
      prisma.vitrine.findUnique({ where: { etablissementId: etabId } }),
    ]);

    const activeOffres   = offres.filter((o) => o.status === 'ACTIVE');
    const totalViews     = offres.reduce((s, o) => s + o.views, 0);
    const totalCandidats = await prisma.application.count({ where: { etablissementId: etabId } });
    const newCandidates  = await prisma.application.count({ where: { etablissementId: etabId, isRead: false } });

    // Chart data: applications per day for last 7 days
    const chartData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      const label = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      return { date: label, value: Math.floor(Math.random() * 12) + 2 }; // TODO: real query
    });

    const userProfile = await prisma.emploiUser.findUnique({
      where: { id: uid },
      select: { firstName: true, lastName: true, avatar: true },
    });
    const links = await prisma.recruteurEtablissement.findMany({
      where: { userId: uid }, include: { etablissement: true },
    });

    res.json({
      success: true,
      data: {
        profile: {
          id: String(uid),
          firstName: userProfile!.firstName, lastName: userProfile!.lastName,
          email: req.emploiUser!.email, avatar: userProfile!.avatar, role: 'RECRUITER',
          etablissements: links.map((l) => ({
            id: String(l.etablissementId), name: l.etablissement.name,
            sector: l.etablissement.sector, city: l.etablissement.city,
          })),
          activeEtablissementId: String(etabId),
        },
        stats: {
          porteeGlobale:      totalViews,
          porteeEvolution:    15,
          candidatures:       totalCandidats,
          candidaturesEvol:   12,
          offresActives:      activeOffres.length,
          tauxConversion:     totalViews > 0 ? parseFloat(((totalCandidats / totalViews) * 100).toFixed(2)) : 0,
          tauxConversionEvol: 3,
        },
        chartData,
        metierParts: [
          { name: 'Hôtellerie',    value: 45, color: '#E8622A' },
          { name: 'Restauration',  value: 25, color: '#1E2A3A' },
          { name: 'MICE',          value: 15, color: '#3B5BDB' },
          { name: 'Tech Tourisme', value: 10, color: '#4CAF50' },
          { name: 'Autres',        value: 5,  color: '#9E9E9E' },
        ],
        recentCandidatures: applications.map((a) => ({
          id: String(a.id),
          candidatName: `${a.user.firstName} ${a.user.lastName}`,
          candidatAvatar: a.user.avatar,
          jobTitle: a.offre.title,
          receivedAt: a.appliedAt.toISOString(),
          starred: a.isFavorite,
        })),
        vitrineHealth: {
          completionScore: vitrineData?.completionScore ?? 0,
          views:           vitrineData?.views           ?? 0,
          engagementRate:  8,
        },
        newCandidaturesCount: newCandidates,
      },
    });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}