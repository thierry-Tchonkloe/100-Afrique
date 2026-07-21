// src/controllers/emploi/entreprises.controller.ts
import { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function firstPhotoUrl(photos: unknown): string | null {
  const arr = (photos as any[]) ?? [];
  return arr[0]?.url ?? null;
}

function fmtCompany(e: any) {
  const vitrine = e.vitrine;

  return {
    id:          String(e.id),
    name:        e.name,
    sector:      e.sector || vitrine?.sector   || '',
    city:        e.city   || vitrine?.location || '',
    logo:        e.logo ?? vitrine?.logoUrl ?? null,
    offresCount: e.offres.length,
    vitrine: vitrine
      ? {
          id:              String(vitrine.id),
          etablissementId: String(vitrine.etablissementId),
          logoUrl:         vitrine.logoUrl   ?? null,
          bannerUrl:       vitrine.bannerUrl ?? null,
          slogan:          vitrine.slogan    ?? '',
          sector:          vitrine.sector    ?? '',
          location:        vitrine.location  ?? '',
          completionScore: vitrine.completionScore ?? 0,
          views:           vitrine.views           ?? 0,
          galleryImage:    firstPhotoUrl(vitrine.photos),
        }
      : null,
  };
}

export async function getPublicCompanies(_req: Request, res: Response): Promise<void> {
  try {
    const etablissements = await prisma.etablissement.findMany({
      include: {
        vitrine: true,
        offres: { where: { status: 'ACTIVE' }, select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = etablissements
      .filter((e) => e.offres.length > 0 || (e.vitrine && e.vitrine.completionScore > 0))
      .map(fmtCompany);

    res.json({ success: true, data });
  } catch (e) {
    console.error('[getPublicCompanies]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── GET /api/emploi/entreprises/:id ───────────────────────────────────────────
export async function getPublicCompanyDetail(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const e = await prisma.etablissement.findUnique({
      where: { id },
      include: {
        vitrine: true,
        offres: {
          where: { status: 'ACTIVE' },
          select: {
            id: true, title: true, sector: true, contractType: true,
            location: true, salaryMin: true, salaryMax: true, remote: true,
            isPremium: true, publishedAt: true,
          },
          orderBy: { publishedAt: 'desc' },
        },
      },
    });

    if (!e) {
      res.status(404).json({ success: false, message: 'Entreprise introuvable' });
      return;
    }

    if (e.vitrine) {
      prisma.vitrine.update({
        where: { id: e.vitrine.id },
        data:  { views: { increment: 1 } },
      }).catch(() => {});
    }

    res.json({
      success: true,
      data: {
        ...fmtCompany(e),
        aboutUs: e.vitrine?.aboutUs ?? '',
        kpis:    (e.vitrine?.kpis   as any[]) ?? [],
        values:  (e.vitrine?.values as any[]) ?? [],
        perks:   (e.vitrine?.perks  as any[]) ?? [],
        photos:  (e.vitrine?.photos as any[]) ?? [],
        videos:  (e.vitrine?.videos as any[]) ?? [],
        socials: (e.vitrine?.socials as object) ?? {},
        // NOUVEAU : infos pratiques + certifications + moments — désormais
        // renseignées par le recruteur depuis son dashboard, plus jamais en dur.
        phone:          e.vitrine?.phone          ?? '',
        email:          e.vitrine?.email          ?? '',
        certifications: (e.vitrine?.certifications as string[]) ?? [],
        moments:        (e.vitrine?.moments as any[]) ?? [],
        offres: e.offres.map((o) => ({
          id: String(o.id), title: o.title, sector: o.sector,
          contractType: o.contractType, location: o.location,
          salaryMin: o.salaryMin, salaryMax: o.salaryMax, remote: o.remote,
          isPremium: o.isPremium,
          publishedAt: o.publishedAt ? o.publishedAt.toISOString() : null,
        })),
      },
    });
  } catch (e) {
    console.error('[getPublicCompanyDetail]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}
