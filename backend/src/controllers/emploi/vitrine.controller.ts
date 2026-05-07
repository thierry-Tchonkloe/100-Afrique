// src/controllers/emploi/vitrine.controller.ts
import { type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

const prisma = new PrismaClient();

async function getEtabId(userId: number, requested?: string): Promise<number | null> {
  if (requested) return Number(requested);
  const link = await prisma.recruteurEtablissement.findFirst({
    where: { userId, isDefault: true }, select: { etablissementId: true },
  });
  if (link) return link.etablissementId;
  const first = await prisma.recruteurEtablissement.findFirst({ where: { userId }, select: { etablissementId: true } });
  return first?.etablissementId ?? null;
}

function calcCompletion(v: any): number {
  let s = 0;
  if (v.logoUrl)   s += 15; if (v.bannerUrl)  s += 10;
  if (v.slogan)    s += 10; if (v.aboutUs)    s += 15;
  if ((v.kpis   as any[]).length > 0) s += 10;
  if ((v.values as any[]).length > 0) s += 10;
  if ((v.perks  as any[]).length > 0) s += 10;
  if ((v.photos as any[]).length > 0) s += 10;
  if (v.location)  s += 5;  if (v.sector) s += 5;
  return Math.min(s, 100);
}

function fmtVitrine(v: any) {
  return {
    id: String(v.id),
    etablissementId: String(v.etablissementId),
    logoUrl:  v.logoUrl,
    bannerUrl: v.bannerUrl,
    slogan:   v.slogan ?? '',
    location: v.location ?? '',
    sector:   v.sector  ?? '',
    aboutUs:  v.aboutUs ?? '',
    kpis:     v.kpis    as object[],
    values:   v.values  as object[],
    perks:    v.perks   as string[],
    photos:   v.photos  as object[],
    videos:   v.videos  as object[],
    socials:  v.socials as object,
    completionScore: v.completionScore,
    views: v.views,
  };
}

// GET /api/emploi/recruteur/vitrine
export async function getVitrine(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const etabId = await getEtabId(uid, req.query.etablissementId as string);
    if (!etabId) { res.status(404).json({ success: false, message: 'Aucun établissement' }); return; }

    let vitrine = await prisma.vitrine.findUnique({ where: { etablissementId: etabId } });
    if (!vitrine) {
      vitrine = await prisma.vitrine.create({ data: { etablissementId: etabId } });
    }
    res.json({ success: true, data: fmtVitrine(vitrine) });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// PATCH /api/emploi/recruteur/vitrine
export async function updateVitrine(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const etabId = await getEtabId(uid);
    if (!etabId) { res.status(404).json({ success: false, message: 'Aucun établissement' }); return; }

    const { slogan, location, sector, aboutUs, kpis, values, perks, photos, videos, socials } = req.body;

    const updated = await prisma.vitrine.upsert({
      where: { etablissementId: etabId },
      update: {
        ...(slogan   !== undefined && { slogan   }),
        ...(location !== undefined && { location }),
        ...(sector   !== undefined && { sector   }),
        ...(aboutUs  !== undefined && { aboutUs  }),
        ...(kpis     !== undefined && { kpis     }),
        ...(values   !== undefined && { values   }),
        ...(perks    !== undefined && { perks    }),
        ...(photos   !== undefined && { photos   }),
        ...(videos   !== undefined && { videos   }),
        ...(socials  !== undefined && { socials  }),
      },
      create: {
        etablissementId: etabId,
        slogan, location, sector, aboutUs,
        kpis:    kpis    ?? [],
        values:  values  ?? [],
        perks:   perks   ?? [],
        photos:  photos  ?? [],
        videos:  videos  ?? [],
        socials: socials ?? {},
      },
    });

    // Recalculate completion
    const score = calcCompletion(updated);
    const final = await prisma.vitrine.update({
      where: { etablissementId: etabId }, data: { completionScore: score },
    });
    res.json({ success: true, data: fmtVitrine(final) });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// POST /api/emploi/recruteur/vitrine/logo
export async function uploadLogo(req: EmploiRequest & { file?: any }, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    if (!req.file) { res.status(400).json({ success: false, message: 'Fichier manquant' }); return; }
    const etabId = await getEtabId(uid);
    if (!etabId) { res.status(404).json({ success: false, message: 'Aucun établissement' }); return; }

    const url: string = req.file.path ?? req.file.url;
    await prisma.vitrine.upsert({
      where: { etablissementId: etabId },
      update: { logoUrl: url },
      create: { etablissementId: etabId, logoUrl: url },
    });
    await prisma.etablissement.update({ where: { id: etabId }, data: { logo: url } });
    res.json({ success: true, data: { url } });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// POST /api/emploi/recruteur/vitrine/banner
export async function uploadBanner(req: EmploiRequest & { file?: any }, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    if (!req.file) { res.status(400).json({ success: false, message: 'Fichier manquant' }); return; }
    const etabId = await getEtabId(uid);
    if (!etabId) { res.status(404).json({ success: false, message: 'Aucun établissement' }); return; }

    const url: string = req.file.path ?? req.file.url;
    await prisma.vitrine.upsert({
      where: { etablissementId: etabId },
      update: { bannerUrl: url },
      create: { etablissementId: etabId, bannerUrl: url },
    });
    res.json({ success: true, data: { url } });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// POST /api/emploi/recruteur/vitrine/photos
export async function uploadPhoto(req: EmploiRequest & { file?: any }, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    if (!req.file) { res.status(400).json({ success: false, message: 'Fichier manquant' }); return; }
    const etabId = await getEtabId(uid);
    if (!etabId) { res.status(404).json({ success: false, message: 'Aucun établissement' }); return; }

    const url: string     = req.file.path ?? req.file.url;
    const photoId: string = req.file.filename ?? req.file.public_id ?? `photo-${Date.now()}`;

    const vitrine  = await prisma.vitrine.findUnique({ where: { etablissementId: etabId } });
    const existing = (vitrine?.photos as any[]) ?? [];
    if (existing.length >= 12) { res.status(400).json({ success: false, message: 'Maximum 12 photos' }); return; }

    const newPhoto = { id: photoId, url };
    const upserted = await prisma.vitrine.upsert({
      where:  { etablissementId: etabId },
      update: { photos: [...existing, newPhoto] },
      create: { etablissementId: etabId, photos: [newPhoto] },
    });

    // Recalculate and persist completion score
    await prisma.vitrine.update({
      where: { etablissementId: etabId },
      data:  { completionScore: calcCompletion(upserted) },
    });

    res.json({ success: true, data: newPhoto });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// DELETE /api/emploi/recruteur/vitrine/photos/:id
export async function deletePhoto(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const etabId = await getEtabId(uid);
    if (!etabId) { res.status(404).json({ success: false, message: 'Aucun établissement' }); return; }

    const vitrine = await prisma.vitrine.findUnique({ where: { etablissementId: etabId } });
    const photos = ((vitrine?.photos as any[]) ?? []).filter((p) => p.id !== req.params.id);

    await prisma.vitrine.update({ where: { etablissementId: etabId }, data: { photos } });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// POST /api/emploi/recruteur/vitrine/videos
export async function addVideo(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const { url, title } = req.body;
    if (!url) { res.status(400).json({ success: false, message: 'URL manquante' }); return; }

    const etabId = await getEtabId(uid);
    if (!etabId) { res.status(404).json({ success: false, message: 'Aucun établissement' }); return; }

    // Generate YouTube thumbnail
    const ytMatch = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    const thumbnailUrl = ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg` : '';

    const vitrine = await prisma.vitrine.findUnique({ where: { etablissementId: etabId } });
    const existing = (vitrine?.videos as any[]) ?? [];
    const newVideo = { id: `vid-${Date.now()}`, url, title: title ?? 'Vidéo de présentation', thumbnailUrl };

    await prisma.vitrine.upsert({
      where: { etablissementId: etabId },
      update: { videos: [...existing, newVideo] },
      create: { etablissementId: etabId, videos: [newVideo] },
    });
    res.json({ success: true, data: newVideo });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// DELETE /api/emploi/recruteur/vitrine/videos/:id
export async function deleteVideo(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const etabId = await getEtabId(uid);
    if (!etabId) { res.status(404).json({ success: false, message: 'Aucun établissement' }); return; }

    const vitrine = await prisma.vitrine.findUnique({ where: { etablissementId: etabId } });
    const videos  = ((vitrine?.videos as any[]) ?? []).filter((v) => v.id !== req.params.id);

    await prisma.vitrine.update({ where: { etablissementId: etabId }, data: { videos } });
    res.json({ success: true });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}

// Public: GET /api/emploi/vitrines/:etablissementId
export async function getPublicVitrine(req: any, res: Response): Promise<void> {
  try {
    const etabId = Number(req.params.etablissementId);
    const [etab, vitrine] = await Promise.all([
      prisma.etablissement.findUnique({ where: { id: etabId } }),
      prisma.vitrine.findUnique({ where: { etablissementId: etabId } }),
    ]);
    if (!etab) { res.status(404).json({ success: false, message: 'Établissement introuvable' }); return; }
    // Increment views
    if (vitrine) {
      await prisma.vitrine.update({ where: { id: vitrine.id }, data: { views: { increment: 1 } } });
    }
    res.json({ success: true, data: vitrine ? fmtVitrine(vitrine) : null });
  } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
}