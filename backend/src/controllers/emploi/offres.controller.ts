// src/controllers/emploi/offres.controller.ts
import { type Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';
// FIX : normalisation de secteur — voir src/utils/sectors.ts
import { buildSectorWhere } from '../../utils/sectors';

const prisma = new PrismaClient();

// ── Helper : établissement actif du recruteur connecté ────────────────────────
async function getEtabId(userId: number, requested?: string): Promise<number | null> {
  if (requested) {
    const link = await prisma.recruteurEtablissement.findUnique({
      where: { userId_etablissementId: { userId, etablissementId: Number(requested) } },
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

// ── Contrôle d'accès : ce recruteur peut-il toucher cette offre ? ─────────────
async function canAccessOffre(
  userId: number,
  offreId: number,
): Promise<{ ok: boolean; etablissementId: number | null }> {
  const offre = await prisma.offre.findUnique({
    where:  { id: offreId },
    select: { etablissementId: true },
  });
  if (!offre) return { ok: false, etablissementId: null };

  const link = await prisma.recruteurEtablissement.findUnique({
    where: {
      userId_etablissementId: { userId, etablissementId: offre.etablissementId },
    },
  });
  return { ok: !!link, etablissementId: offre.etablissementId };
}

// ── Mapping statut front → enum Prisma ────────────────────────────────────────
const STATUS_TO_PRISMA: Record<string, Prisma.OffreUpdateInput['status']> = {
  active:   'ACTIVE'   as Prisma.OffreUpdateInput['status'],
  paused:   'PAUSED'   as Prisma.OffreUpdateInput['status'],
  draft:    'DRAFT'    as Prisma.OffreUpdateInput['status'],
  archived: 'ARCHIVED' as Prisma.OffreUpdateInput['status'],
  ACTIVE:   'ACTIVE'   as Prisma.OffreUpdateInput['status'],
  PAUSED:   'PAUSED'   as Prisma.OffreUpdateInput['status'],
  DRAFT:    'DRAFT'    as Prisma.OffreUpdateInput['status'],
  ARCHIVED: 'ARCHIVED' as Prisma.OffreUpdateInput['status'],
};

function toDbStatus(s: string): any {
  return STATUS_TO_PRISMA[s] ?? 'PAUSED';
}

function fmtOffre(o: any): object {
  return {
    id:           String(o.id),
    title:        o.title,
    sector:       o.sector,
    contractType: o.contractType,
    location:     o.location,
    salaryMin:    o.salaryMin  ?? null,
    salaryMax:    o.salaryMax  ?? null,
    remote:       o.remote     ?? 'none',
    missions:     o.missions   ?? null,
    profileDesc:  o.profileDesc ?? null,
    advantages:   o.advantages  ?? null,
    requiredSkills:    (o.requiredSkills    ?? []) as string[],
    requiredLangs:     (o.requiredLangs     ?? []) as string[],
    requiredSoftwares: (o.requiredSoftwares ?? []) as string[],
    status:            (o.status as string).toLowerCase(),
    isPremium:         o.isPremium  ?? false,
    views:             o.views      ?? 0,
    candidatesCount:   o._count?.applications       ?? 0,
    newCandidatesCount: o._count?.unreadApplications ?? 0,
    publishedAt: o.publishedAt?.toISOString() ?? null,
    expiresAt:   o.expiresAt?.toISOString()   ?? null,
  };
}

// ── GET /api/emploi/recruteur/offres ──────────────────────────────────────────
export async function getOffres(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid    = req.emploiUser!.id;
    const etabId = await getEtabId(uid, req.query.etablissementId as string);

    if (!etabId) {
      res.status(404).json({ success: false, message: 'Aucun établissement lié à ce compte.' });
      return;
    }

    const [offres, unreadByOffre] = await Promise.all([
      prisma.offre.findMany({
        where:   { etablissementId: etabId },
        include: { _count: { select: { applications: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.application.groupBy({
        by:    ['offreId'],
        where: { etablissementId: etabId, isRead: false },
        _count: { id: true },
      }),
    ]);

    const unreadMap = Object.fromEntries(
      unreadByOffre.map((r) => [r.offreId, r._count.id]),
    );

    const enriched = offres.map((o) => ({
      ...o,
      _count: {
        applications:       o._count.applications,
        unreadApplications: unreadMap[o.id] ?? 0,
      },
    }));

    res.json({
      success: true,
      data: {
        stats: {
          online:   offres.filter((o) => ['ACTIVE', 'PAUSED'].includes(o.status)).length,
          drafts:   offres.filter((o) => o.status === 'DRAFT').length,
          archives: offres.filter((o) => o.status === 'ARCHIVED').length,
        },
        offres: enriched.map(fmtOffre),
      },
    });
  } catch (e) {
    console.error('[getOffres]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── POST /api/emploi/recruteur/offres ─────────────────────────────────────────
export async function createOffre(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid    = req.emploiUser!.id;
    const etabId = await getEtabId(uid);

    if (!etabId) {
      res.status(404).json({ success: false, message: 'Aucun établissement lié à ce compte.' });
      return;
    }

    const { step1, step2, step3, ...flat } = req.body;

    const offreData = step1
      ? {
          title:        step1.title,
          sector:       step1.sector,
          contractType: step1.contractType,
          location:     step1.location,
          salaryMin:    step1.salaryMin   ?? null,
          salaryMax:    step1.salaryMax   ?? null,
          remote:       step1.remote      ?? 'none',
          missions:     step2?.missions   ?? null,
          profileDesc:  step2?.profile    ?? null,
          advantages:   step2?.advantages ?? null,
          requiredSkills:    step3?.requiredSkills ?? [],
          requiredLangs:     step3?.languages      ?? [],
          requiredSoftwares: step3?.softwares      ?? [],
        }
      : flat;

    const offre = await prisma.offre.create({
      data: {
        ...offreData,
        etablissementId: etabId,
        status:          'ACTIVE',
        publishedAt:     new Date(),
        expiresAt:       new Date(Date.now() + 30 * 86400000),
        views:           0,
        isPremium:       false,
      },
      include: { _count: { select: { applications: true } } },
    });

    res.status(201).json({ success: true, data: fmtOffre(offre) });
  } catch (e) {
    console.error('[createOffre]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── PATCH /api/emploi/recruteur/offres/:id ────────────────────────────────────
export async function updateOffre(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid     = req.emploiUser!.id;
    const offreId = Number(req.params.id);
    const { ok }  = await canAccessOffre(uid, offreId);

    if (!ok) {
      res.status(403).json({ success: false, message: 'Accès refusé ou offre introuvable' });
      return;
    }

    const { step1, step2, step3, ...flat } = req.body;
    const updateData = step1
      ? {
          title:        step1.title,
          sector:       step1.sector,
          contractType: step1.contractType,
          location:     step1.location,
          salaryMin:    step1.salaryMin   ?? null,
          salaryMax:    step1.salaryMax   ?? null,
          remote:       step1.remote,
          missions:     step2?.missions   ?? null,
          profileDesc:  step2?.profile    ?? null,
          advantages:   step2?.advantages ?? null,
          requiredSkills:    step3?.requiredSkills ?? [],
          requiredLangs:     step3?.languages      ?? [],
          requiredSoftwares: step3?.softwares      ?? [],
        }
      : flat;

    const offre = await prisma.offre.update({
      where:   { id: offreId },
      data:    updateData,
      include: { _count: { select: { applications: true } } },
    });

    res.json({ success: true, data: fmtOffre(offre) });
  } catch (e) {
    console.error('[updateOffre]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── PATCH /api/emploi/recruteur/offres/:id/status ─────────────────────────────
export async function updateOffreStatus(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid     = req.emploiUser!.id;
    const offreId = Number(req.params.id);
    const { status } = req.body as { status: string };

    const { ok } = await canAccessOffre(uid, offreId);
    if (!ok) {
      res.status(403).json({ success: false, message: 'Accès refusé ou offre introuvable' });
      return;
    }

    const offre = await prisma.offre.update({
      where: { id: offreId },
      data:  {
        status: toDbStatus(status) as any,
        ...(status === 'active' ? { publishedAt: new Date() } : {}),
      },
      include: { _count: { select: { applications: true } } },
    });

    res.json({ success: true, data: fmtOffre(offre) });
  } catch (e) {
    console.error('[updateOffreStatus]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── POST /api/emploi/recruteur/offres/:id/duplicate ───────────────────────────
export async function duplicateOffre(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid     = req.emploiUser!.id;
    const offreId = Number(req.params.id);

    const { ok, etablissementId } = await canAccessOffre(uid, offreId);
    if (!ok || !etablissementId) {
      res.status(403).json({ success: false, message: 'Accès refusé ou offre introuvable' });
      return;
    }

    const original = await prisma.offre.findUnique({ where: { id: offreId } });
    if (!original) {
      res.status(404).json({ success: false, message: 'Offre introuvable' });
      return;
    }

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
        requiredSkills:    (original.requiredSkills    ?? []) as string[],
        requiredLangs:     (original.requiredLangs     ?? []) as string[],
        requiredSoftwares: (original.requiredSoftwares ?? []) as string[],
        isPremium:         original.isPremium,
        status:            'DRAFT',
        views:             0,
        expiresAt:         new Date(Date.now() + 30 * 86400000),
      },
      include: { _count: { select: { applications: true } } },
    });

    res.status(201).json({ success: true, data: fmtOffre(copy) });
  } catch (e) {
    console.error('[duplicateOffre]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── DELETE /api/emploi/recruteur/offres/:id → archive ────────────────────────
export async function archiveOffre(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid     = req.emploiUser!.id;
    const offreId = Number(req.params.id);

    const { ok } = await canAccessOffre(uid, offreId);
    if (!ok) {
      res.status(403).json({ success: false, message: 'Accès refusé ou offre introuvable' });
      return;
    }

    await prisma.offre.update({
      where: { id: offreId },
      data:  { status: 'ARCHIVED' as any },
    });

    res.json({ success: true });
  } catch (e) {
    console.error('[archiveOffre]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── GET /api/emploi/jobs ──────────────────────────────────────────────────────
// FIX (système de secteur) : le paramètre `sector` envoyé par le frontend est
// désormais une CLÉ canonique (ex: "hotel"), plus jamais un libellé brut.
// buildSectorWhere() la traduit vers le libellé FR exact stocké en DB
// ("Hôtellerie") pour une égalité stricte — avant, `contains: "hotel"` ne
// pouvait jamais matcher "Hôtellerie" (aucune sous-chaîne commune).
export async function getPublicJobs(req: any, res: Response): Promise<void> {
  try {
    const {
      sector, location, contractType, remote, search,
      page = '1', limit = '10',
    } = req.query as Record<string, string>;

    const where: any = { status: 'ACTIVE' };

    // FIX : remplace l'ancien `where.sector = { contains: sector, mode: 'insensitive' }`
    Object.assign(where, buildSectorWhere(sector));

    if (location) where.location = { contains: location, mode: 'insensitive' };

    if (contractType) {
      const types = contractType.split(',').map((t) => t.trim()).filter(Boolean);
      where.contractType = types.length > 1 ? { in: types } : types[0];
    }

    if (remote) {
      const values = remote.split(',').map((r) => r.trim()).filter(Boolean);
      where.remote = values.length > 1 ? { in: values } : values[0];
    }

    if (search) where.title = { contains: search, mode: 'insensitive' };

    const skip = (Number(page) - 1) * Number(limit);

    const [total, offres] = await Promise.all([
      prisma.offre.count({ where }),
      prisma.offre.findMany({
        where,
        include: { etablissement: { select: { name: true, city: true, logo: true } } },
        orderBy: [{ isPremium: 'desc' }, { publishedAt: 'desc' }],
        skip,
        take: Number(limit),
      }),
    ]);

    const ids = offres.map((o) => o.id);
    if (ids.length > 0) {
      prisma.offre
        .updateMany({ where: { id: { in: ids } }, data: { views: { increment: 1 } } })
        .catch(() => {});
    }

    res.json({
      success: true,
      data: {
        total, page: Number(page), limit: Number(limit),
        offres: offres.map((o) => ({
          id:           String(o.id),
          title:        o.title,
          companyName:  o.etablissement.name,
          sector:       o.sector,
          contractType: o.contractType,
          location:     o.location,
          salaryMin:    o.salaryMin,
          salaryMax:    o.salaryMax,
          remote:       o.remote,
          isPremium:    o.isPremium,
          publishedAt:  o.publishedAt?.toISOString(),
        })),
      },
    });
  } catch (e) {
    console.error('[getPublicJobs]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── GET /api/emploi/jobs/:id ──────────────────────────────────────────────────
export async function getPublicJob(req: any, res: Response): Promise<void> {
  try {
    const offre = await prisma.offre.findUnique({
      where:   { id: Number(req.params.id) },
      include: { etablissement: { include: { vitrine: true } } },
    });

    if (!offre || offre.status !== 'ACTIVE') {
      res.status(404).json({ success: false, message: 'Offre introuvable' });
      return;
    }

    res.json({
      success: true,
      data: {
        id:           String(offre.id),
        title:        offre.title,
        sector:       offre.sector,
        contractType: offre.contractType,
        location:     offre.location,
        salaryMin:    offre.salaryMin,
        salaryMax:    offre.salaryMax,
        remote:       offre.remote,
        missions:     offre.missions,
        profileDesc:  offre.profileDesc,
        advantages:   offre.advantages,
        requiredSkills: (offre.requiredSkills ?? []) as string[],
        requiredLangs:  (offre.requiredLangs  ?? []) as string[],
        publishedAt: offre.publishedAt?.toISOString(),
        expiresAt:   offre.expiresAt?.toISOString(),
        company: {
          id:     String(offre.etablissementId),
          name:   offre.etablissement.name,
          sector: offre.etablissement.sector,
          city:   offre.etablissement.city,
          logo:   offre.etablissement.logo,
          slogan: offre.etablissement.vitrine?.slogan,
        },
      },
    });
  } catch (e) {
    console.error('[getPublicJob]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}
