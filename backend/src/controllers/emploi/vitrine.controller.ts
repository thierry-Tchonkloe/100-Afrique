// src/controllers/emploi/vitrine.controller.ts
import { type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

const prisma = new PrismaClient();

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

function calcCompletion(v: any): number {
  let s = 0;
  if (v.logoUrl)                             s += 10;
  if (v.bannerUrl)                           s += 8;
  if (v.slogan)                              s += 8;
  if (v.aboutUs)                             s += 12;
  if ((v.kpis   as any[])?.length > 0)       s += 8;
  if ((v.values as any[])?.length > 0)       s += 8;
  if ((v.perks  as any[])?.length > 0)       s += 8;
  if ((v.photos as any[])?.length > 0)       s += 8;
  if (v.location)                            s += 5;
  if (v.sector)                              s += 5;
  // NOUVEAU : les nouveaux champs comptent aussi dans le score de complétion,
  // pour inciter le recruteur à les remplir.
  if (v.phone)                               s += 4;
  if (v.email)                               s += 4;
  if ((v.certifications as any[])?.length > 0) s += 6;
  if ((v.moments as any[])?.length > 0)      s += 6;
  return Math.min(s, 100);
}

function fmtVitrine(v: any, companyName?: string) {
  return {
    id:              String(v.id),
    etablissementId: String(v.etablissementId),
    companyName:     companyName ?? '',
    logoUrl:         v.logoUrl   ?? null,
    bannerUrl:       v.bannerUrl ?? null,
    slogan:          v.slogan    ?? '',
    location:        v.location  ?? '',
    sector:          v.sector    ?? '',
    aboutUs:         v.aboutUs   ?? '',
    kpis:            (v.kpis    as object[]) ?? [],
    values:          (v.values  as object[]) ?? [],
    perks:           (v.perks   as string[]) ?? [],
    photos:          (v.photos  as object[]) ?? [],
    videos:          (v.videos  as object[]) ?? [],
    socials:         (v.socials as object)   ?? {},
    // NOUVEAU : infos pratiques + certifications + moments de vie d'équipe.
    // Sans ces champs, la page publique n'avait aucun moyen de recevoir des
    // données réelles pour ces blocs — ils étaient donc en dur (mock) pour
    // toutes les entreprises, y compris les vraies.
    phone:           v.phone ?? '',
    email:           v.email ?? '',
    certifications:  (v.certifications as string[]) ?? [],
    moments:         (v.moments as object[]) ?? [],
    completionScore: v.completionScore ?? 0,
    views:           v.views           ?? 0,
  };
}

// ── GET /api/emploi/recruteur/vitrine ─────────────────────────────────────────
export async function getVitrine(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid    = req.emploiUser!.id;
    const etabId = await getEtabId(uid, req.query.etablissementId as string);

    if (!etabId) {
      console.error(`[getVitrine] userId=${uid} → aucun établissement trouvé`);
      res.status(404).json({ success: false, message: 'Aucun établissement lié à ce compte.' });
      return;
    }

    const [etab, vitrine] = await Promise.all([
      prisma.etablissement.findUnique({
        where:  { id: etabId },
        select: { name: true, sector: true, city: true },
      }),
      prisma.vitrine.upsert({
        where:  { etablissementId: etabId },
        update: {},
        create: {
          etablissementId: etabId,
          kpis: [], values: [], perks: [], photos: [], videos: [], socials: {},
          certifications: [], moments: [],
          completionScore: 0, views: 0,
        },
      }),
    ]);

    const merged = {
      ...vitrine,
      sector:   vitrine.sector   || etab?.sector || '',
      location: vitrine.location || etab?.city   || '',
    };

    res.json({ success: true, data: fmtVitrine(merged, etab?.name) });
  } catch (e) {
    console.error('[getVitrine]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── PATCH /api/emploi/recruteur/vitrine ───────────────────────────────────────
export async function updateVitrine(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid    = req.emploiUser!.id;
    const etabId = await getEtabId(uid);

    if (!etabId) {
      console.error(`[updateVitrine] userId=${uid} → aucun établissement trouvé`);
      res.status(404).json({ success: false, message: 'Aucun établissement lié à ce compte.' });
      return;
    }

    const {
      slogan, location, sector, aboutUs,
      kpis, values, perks, photos, videos, socials,
      logoUrl, bannerUrl,
      companyName,
      // NOUVEAU
      phone, email, certifications, moments,
    } = req.body;

    const updateData: Record<string, unknown> = {};

    if (slogan    !== undefined) updateData.slogan    = slogan;
    if (location  !== undefined) updateData.location  = location;
    if (sector    !== undefined) updateData.sector    = sector;
    if (aboutUs   !== undefined) updateData.aboutUs   = aboutUs;

    if (kpis      !== undefined) updateData.kpis      = kpis;
    if (values    !== undefined) updateData.values    = values;
    if (perks     !== undefined) updateData.perks     = perks;
    if (photos    !== undefined) updateData.photos    = photos;
    if (videos    !== undefined) updateData.videos    = videos;
    if (socials   !== undefined) updateData.socials   = socials;

    // NOUVEAU
    if (phone          !== undefined) updateData.phone          = phone;
    if (email           !== undefined) updateData.email          = email;
    if (certifications !== undefined) updateData.certifications = certifications;
    if (moments        !== undefined) updateData.moments        = moments;

    if (logoUrl   !== undefined && !String(logoUrl).startsWith('blob:'))   updateData.logoUrl   = logoUrl;
    if (bannerUrl !== undefined && !String(bannerUrl).startsWith('blob:')) updateData.bannerUrl = bannerUrl;

    const updated = await prisma.vitrine.upsert({
      where:  { etablissementId: etabId },
      update: updateData,
      create: {
        etablissementId: etabId,
        slogan:   slogan    ?? '',
        location: location  ?? '',
        sector:   sector    ?? '',
        aboutUs:  aboutUs   ?? '',
        logoUrl:  (logoUrl && !String(logoUrl).startsWith('blob:'))     ? logoUrl   : null,
        bannerUrl:(bannerUrl && !String(bannerUrl).startsWith('blob:')) ? bannerUrl : null,
        kpis:     kpis     ?? [],
        values:   values   ?? [],
        perks:    perks    ?? [],
        photos:   photos   ?? [],
        videos:   videos   ?? [],
        socials:  socials  ?? {},
        // NOUVEAU
        phone:          phone          ?? '',
        email:          email          ?? '',
        certifications: certifications ?? [],
        moments:        moments        ?? [],
        completionScore: 0, views: 0,
      },
    });

    const score = calcCompletion(updated);
    const final = await prisma.vitrine.update({
      where: { etablissementId: etabId },
      data:  { completionScore: score },
    });

    const etabSync: Record<string, unknown> = {};
    if (typeof sector      === 'string' && sector.trim()      !== '') etabSync.sector = sector.trim();
    if (typeof location    === 'string' && location.trim()    !== '') etabSync.city   = location.trim();
    if (typeof companyName === 'string' && companyName.trim() !== '') etabSync.name   = companyName.trim();

    let etabName: string | undefined;
    if (Object.keys(etabSync).length > 0) {
      const syncedEtab = await prisma.etablissement.update({
        where:  { id: etabId },
        data:   etabSync,
        select: { name: true },
      }).catch((err) => {
        console.error('[updateVitrine] échec sync Etablissement', err);
        return null;
      });
      etabName = syncedEtab?.name;
    }
    if (!etabName) {
      const etab = await prisma.etablissement.findUnique({
        where: { id: etabId }, select: { name: true },
      });
      etabName = etab?.name;
    }

    res.json({ success: true, data: fmtVitrine(final, etabName) });
  } catch (e) {
    console.error('[updateVitrine]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── POST /api/emploi/recruteur/vitrine/logo ───────────────────────────────────
export async function uploadLogo(req: EmploiRequest & { file?: any }, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    if (!req.file) { res.status(400).json({ success: false, message: 'Fichier manquant' }); return; }

    const etabId = await getEtabId(uid);
    if (!etabId) {
      console.error(`[uploadLogo] userId=${uid} → aucun établissement trouvé`);
      res.status(404).json({ success: false, message: 'Aucun établissement lié à ce compte.' });
      return;
    }

    const url: string = req.file.path ?? req.file.url ?? req.file.secure_url;

    await Promise.all([
      prisma.vitrine.upsert({
        where:  { etablissementId: etabId },
        update: { logoUrl: url },
        create: { etablissementId: etabId, logoUrl: url, kpis: [], values: [], perks: [], photos: [], videos: [], socials: {}, certifications: [], moments: [] },
      }),
      prisma.etablissement.update({ where: { id: etabId }, data: { logo: url } }),
    ]);

    res.json({ success: true, data: { url } });
  } catch (e) {
    console.error('[uploadLogo]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── POST /api/emploi/recruteur/vitrine/banner ─────────────────────────────────
export async function uploadBanner(req: EmploiRequest & { file?: any }, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    if (!req.file) { res.status(400).json({ success: false, message: 'Fichier manquant' }); return; }

    const etabId = await getEtabId(uid);
    if (!etabId) {
      console.error(`[uploadBanner] userId=${uid} → aucun établissement trouvé`);
      res.status(404).json({ success: false, message: 'Aucun établissement lié à ce compte.' });
      return;
    }

    const url: string = req.file.path ?? req.file.url ?? req.file.secure_url;

    await prisma.vitrine.upsert({
      where:  { etablissementId: etabId },
      update: { bannerUrl: url },
      create: { etablissementId: etabId, bannerUrl: url, kpis: [], values: [], perks: [], photos: [], videos: [], socials: {}, certifications: [], moments: [] },
    });

    res.json({ success: true, data: { url } });
  } catch (e) {
    console.error('[uploadBanner]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── POST /api/emploi/recruteur/vitrine/photos ─────────────────────────────────
export async function uploadPhoto(req: EmploiRequest & { file?: any }, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    if (!req.file) { res.status(400).json({ success: false, message: 'Fichier manquant' }); return; }

    const etabId = await getEtabId(uid);
    if (!etabId) {
      res.status(404).json({ success: false, message: 'Aucun établissement lié à ce compte.' });
      return;
    }

    const url: string     = req.file.path ?? req.file.url ?? req.file.secure_url;
    const photoId: string = req.file.filename ?? req.file.public_id ?? `photo-${Date.now()}`;

    const vitrine  = await prisma.vitrine.findUnique({ where: { etablissementId: etabId } });
    const existing = (vitrine?.photos as any[]) ?? [];

    if (existing.length >= 12) {
      res.status(400).json({ success: false, message: 'Maximum 12 photos atteint.' });
      return;
    }

    const newPhoto = { id: photoId, url, alt: req.file.originalname ?? '' };

    const upserted = await prisma.vitrine.upsert({
      where:  { etablissementId: etabId },
      update: { photos: [...existing, newPhoto] },
      create: { etablissementId: etabId, photos: [newPhoto], kpis: [], values: [], perks: [], videos: [], socials: {}, certifications: [], moments: [] },
    });

    await prisma.vitrine.update({
      where: { etablissementId: etabId },
      data:  { completionScore: calcCompletion(upserted) },
    });

    res.json({ success: true, data: newPhoto });
  } catch (e) {
    console.error('[uploadPhoto]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── DELETE /api/emploi/recruteur/vitrine/photos/:id ───────────────────────────
export async function deletePhoto(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid    = req.emploiUser!.id;
    const etabId = await getEtabId(uid);
    if (!etabId) { res.status(404).json({ success: false, message: 'Aucun établissement lié à ce compte.' }); return; }

    const vitrine = await prisma.vitrine.findUnique({ where: { etablissementId: etabId } });
    const photos  = ((vitrine?.photos as any[]) ?? []).filter((p) => p.id !== req.params.id);
    await prisma.vitrine.update({ where: { etablissementId: etabId }, data: { photos } });
    res.json({ success: true });
  } catch (e) {
    console.error('[deletePhoto]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── POST /api/emploi/recruteur/vitrine/videos ─────────────────────────────────
export async function addVideo(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid = req.emploiUser!.id;
    const { url, title } = req.body;
    if (!url) { res.status(400).json({ success: false, message: 'URL manquante' }); return; }

    const etabId = await getEtabId(uid);
    if (!etabId) { res.status(404).json({ success: false, message: 'Aucun établissement lié à ce compte.' }); return; }

    const ytMatch      = (url as string).match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    const thumbnailUrl = ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg` : '';

    const vitrine  = await prisma.vitrine.findUnique({ where: { etablissementId: etabId } });
    const existing = (vitrine?.videos as any[]) ?? [];
    const newVideo = { id: `vid-${Date.now()}`, url, title: title ?? 'Vidéo de présentation', thumbnailUrl };

    await prisma.vitrine.upsert({
      where:  { etablissementId: etabId },
      update: { videos: [...existing, newVideo] },
      create: { etablissementId: etabId, videos: [newVideo], kpis: [], values: [], perks: [], photos: [], socials: {}, certifications: [], moments: [] },
    });

    res.json({ success: true, data: newVideo });
  } catch (e) {
    console.error('[addVideo]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── DELETE /api/emploi/recruteur/vitrine/videos/:id ───────────────────────────
export async function deleteVideo(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const uid    = req.emploiUser!.id;
    const etabId = await getEtabId(uid);
    if (!etabId) { res.status(404).json({ success: false, message: 'Aucun établissement lié à ce compte.' }); return; }

    const vitrine = await prisma.vitrine.findUnique({ where: { etablissementId: etabId } });
    const videos  = ((vitrine?.videos as any[]) ?? []).filter((v) => v.id !== req.params.id);
    await prisma.vitrine.update({ where: { etablissementId: etabId }, data: { videos } });
    res.json({ success: true });
  } catch (e) {
    console.error('[deleteVideo]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── GET public : /api/emploi/vitrines/:etablissementId ───────────────────────
export async function getPublicVitrine(req: any, res: Response): Promise<void> {
  try {
    const etabId = Number(req.params.etablissementId);
    const [etab, vitrine] = await Promise.all([
      prisma.etablissement.findUnique({ where: { id: etabId } }),
      prisma.vitrine.findUnique({ where: { etablissementId: etabId } }),
    ]);

    if (!etab) { res.status(404).json({ success: false, message: 'Établissement introuvable' }); return; }

    if (vitrine) {
      prisma.vitrine.update({ where: { id: vitrine.id }, data: { views: { increment: 1 } } }).catch(() => {});
    }

    res.json({ success: true, data: vitrine ? fmtVitrine(vitrine, etab.name) : null });
  } catch (e) {
    console.error('[getPublicVitrine]', e);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}
