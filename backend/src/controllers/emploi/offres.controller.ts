// src/controllers/emploi/offres.controller.ts
import { type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

const prisma = new PrismaClient();

async function getEtabId(userId: number, requested?: string): Promise<number | null> {
  if (requested) return Number(requested);
  const link = await prisma.recruteurEtablissement.findFirst({ where: { userId, isDefault: true } });
  if (link) return link.etablissementId;
  const first = await prisma.recruteurEtablissement.findFirst({ where: { userId } });
  return first?.etablissementId ?? null;
}

function fmtOffre(o: any) {
  return {
    id: String(o.id),
    title: o.title, sector: o.sector,
    contractType: o.contractType, location: o.location,
    salaryMin: o.salaryMin, salaryMax: o.salaryMax, remote: o.remote,
    missions: o.missions, profileDesc: o.profileDesc, advantages: o.advantages,
    requiredSkills:    o.requiredSkills    as string[],
    requiredLangs:     o.requiredLangs     as string[],
    requiredSoftwares: o.requiredSoftwares as string[],
    status: o.status.toLowerCase(),
    isPremium: o.isPremium,
    views: o.views,
    candidatesCount: o._count?.applications ?? 0,
    newCandidatesCount: 0, // computed separately if needed
    publishedAt: o.publishedAt?.toISOString(),
    expiresAt: o.expiresAt?.toISOString(),
  };
}

// GET /api/emploi/recruteur/offres
export async function getOffres(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid   = req.emploiUser!.id;
    const etabId = await getEtabId(uid, req.query.etablissementId as string);
    if (!etabId) { res.status(404).json({ success: false, message: 'Aucun établissement' }); return; }

    const offres = await prisma.offre.findMany({
      where: { etablissementId: etabId },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const online   = offres.filter((o) => ['ACTIVE', 'PAUSED'].includes(o.status)).length;
    const drafts   = offres.filter((o) => o.status === 'DRAFT').length;
    const archives = offres.filter((o) => o.status === 'ARCHIVED').length;

    res.json({
      success: true,
      data: {
        stats: { online, drafts, archives },
        offres: offres.map(fmtOffre),
      },
    });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// POST /api/emploi/recruteur/offres
export async function createOffre(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const etabId = await getEtabId(uid);
    if (!etabId) { res.status(404).json({ success: false, message: 'Aucun établissement' }); return; }

    const { step1, step2, step3 } = req.body;
    // Support both flat and stepper format
    const data = step1 ? {
      title: step1.title, sector: step1.sector, contractType: step1.contractType,
      location: step1.location, salaryMin: step1.salaryMin, salaryMax: step1.salaryMax,
      remote: step1.remote ?? 'none',
      missions: step2?.missions, profileDesc: step2?.profile, advantages: step2?.advantages,
      requiredSkills: step3?.requiredSkills ?? [], requiredLangs: step3?.languages ?? [],
      requiredSoftwares: step3?.softwares ?? [],
    } : req.body;

    const offre = await prisma.offre.create({
      data: {
        etablissementId: etabId, ...data,
        status: 'ACTIVE',
        publishedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 86400000),
      },
      include: { _count: { select: { applications: true } } },
    });
    res.status(201).json({ success: true, data: fmtOffre(offre) });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// PATCH /api/emploi/recruteur/offres/:id
export async function updateOffre(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const { step1, step2, step3, ...flat } = req.body;
    const data = step1 ? {
      title: step1.title, sector: step1.sector, contractType: step1.contractType,
      location: step1.location, salaryMin: step1.salaryMin, salaryMax: step1.salaryMax,
      remote: step1.remote, missions: step2?.missions, profileDesc: step2?.profile,
      advantages: step2?.advantages,
      requiredSkills: step3?.requiredSkills ?? [], requiredLangs: step3?.languages ?? [],
      requiredSoftwares: step3?.softwares ?? [],
    } : flat;

    const offre = await prisma.offre.update({
      where: { id: Number(req.params.id) },
      data,
      include: { _count: { select: { applications: true } } },
    });
    res.json({ success: true, data: fmtOffre(offre) });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// PATCH /api/emploi/recruteur/offres/:id/status
export async function updateOffreStatus(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const { status } = req.body;
    const STATUS_MAP: Record<string, any> = {
      active: 'ACTIVE', paused: 'PAUSED', draft: 'DRAFT', archived: 'ARCHIVED',
      ACTIVE: 'ACTIVE', PAUSED: 'PAUSED', DRAFT: 'DRAFT', ARCHIVED: 'ARCHIVED',
    };
    const offre = await prisma.offre.update({
      where: { id: Number(req.params.id) },
      data: {
        status: STATUS_MAP[status] ?? 'PAUSED',
        ...(status === 'active' && { publishedAt: new Date() }),
      },
      include: { _count: { select: { applications: true } } },
    });
    res.json({ success: true, data: fmtOffre(offre) });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// POST /api/emploi/recruteur/offres/:id/duplicate
export async function duplicateOffre(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const original = await prisma.offre.findUnique({ where: { id: Number(req.params.id) } });
    if (!original) { res.status(404).json({ success: false, message: 'Offre introuvable' }); return; }

    const copy = await prisma.offre.create({
      data: {
        etablissementId:   original.etablissementId,
        title:             `${original.title} (copie)`,
        sector:            original.sector,
        contractType:      original.contractType,
        location:          original.location,
        salaryMin:         original.salaryMin,
        salaryMax:         original.salaryMax,
        remote:            original.remote,
        missions:          original.missions,
        profileDesc:       original.profileDesc,
        advantages:        original.advantages,
        requiredSkills:    original.requiredSkills    ?? [],
        requiredLangs:     original.requiredLangs     ?? [],
        requiredSoftwares: original.requiredSoftwares ?? [],
        isPremium:         original.isPremium,
        status:            'DRAFT',
        views:             0,
      },
      include: { _count: { select: { applications: true } } },
    });
    res.status(201).json({ success: true, data: fmtOffre(copy) });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// DELETE /api/emploi/recruteur/offres/:id  → archive
export async function archiveOffre(req: EmploiRequest, res: Response): Promise<void> {
  try {
    await prisma.offre.update({ where: { id: Number(req.params.id) }, data: { status: 'ARCHIVED' } });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// Public: GET /api/emploi/jobs  (job board)
export async function getPublicJobs(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const { sector, location, contractType, search, page = '1', limit = '10' } = req.query as Record<string, string>;
    const where: any = { status: 'ACTIVE' };
    if (sector)       where.sector       = { contains: sector,       mode: 'insensitive' };
    if (location)     where.location     = { contains: location,     mode: 'insensitive' };
    if (contractType) where.contractType = contractType;
    if (search)       where.title        = { contains: search,       mode: 'insensitive' };

    const skip = (Number(page) - 1) * Number(limit);
    const [total, offres] = await Promise.all([
      prisma.offre.count({ where }),
      prisma.offre.findMany({
        where,
        include: { etablissement: { select: { name: true, city: true, logo: true } } },
        orderBy: [{ isPremium: 'desc' }, { publishedAt: 'desc' }],
        skip, take: Number(limit),
      }),
    ]);

    // Increment views
    const ids = offres.map((o) => o.id);
    await prisma.offre.updateMany({ where: { id: { in: ids } }, data: { views: { increment: 1 } } });

    res.json({
      success: true,
      data: {
        total, page: Number(page), limit: Number(limit),
        offres: offres.map((o) => ({
          id: String(o.id), title: o.title,
          companyName: o.etablissement.name,
          sector: o.sector, contractType: o.contractType,
          location: o.location, salaryMin: o.salaryMin, salaryMax: o.salaryMax,
          remote: o.remote, isPremium: o.isPremium,
          publishedAt: o.publishedAt?.toISOString(),
        })),
      },
    });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// Public: GET /api/emploi/jobs/:id
export async function getPublicJob(req: any, res: Response): Promise<void> {
  try {
    const offre = await prisma.offre.findUnique({
      where: { id: Number(req.params.id) },
      include: { etablissement: { include: { vitrine: true } } },
    });
    if (!offre || offre.status !== 'ACTIVE') { res.status(404).json({ success: false, message: 'Offre introuvable' }); return; }
    res.json({
      success: true,
      data: {
        id: String(offre.id), title: offre.title, sector: offre.sector,
        contractType: offre.contractType, location: offre.location,
        salaryMin: offre.salaryMin, salaryMax: offre.salaryMax, remote: offre.remote,
        missions: offre.missions, profileDesc: offre.profileDesc, advantages: offre.advantages,
        requiredSkills: offre.requiredSkills as string[],
        requiredLangs: offre.requiredLangs as string[],
        publishedAt: offre.publishedAt?.toISOString(),
        expiresAt: offre.expiresAt?.toISOString(),
        company: {
          id: String(offre.etablissementId), name: offre.etablissement.name,
          sector: offre.etablissement.sector, city: offre.etablissement.city,
          logo: offre.etablissement.logo,
          slogan: offre.etablissement.vitrine?.slogan,
        },
      },
    });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}