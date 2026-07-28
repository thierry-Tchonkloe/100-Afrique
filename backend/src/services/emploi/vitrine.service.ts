// src/services/emploi/vitrine.service.ts
import { vitrineRepository } from '../../repositories/emploi/vitrine.repository';
import { etablissementRepository } from '../../repositories/emploi/etablissement.repository';
import { resolveActiveEtablissementId } from './etablissement-access.service';
import { BadRequestError, NotFoundError } from '../../errors/http-errors';
import type { AddVideoInput, UpdateVitrineInput } from '../../types/emploi/vitrine.types';

const MAX_PHOTOS = 12;

/** Score de complétion sur 100 — petite fonction pure, testable isolément. */
export function calcCompletion(v: any): number {
  let s = 0;
  if (v.logoUrl) s += 10;
  if (v.bannerUrl) s += 8;
  if (v.slogan) s += 8;
  if (v.aboutUs) s += 12;
  if ((v.kpis as any[])?.length > 0) s += 8;
  if ((v.values as any[])?.length > 0) s += 8;
  if ((v.perks as any[])?.length > 0) s += 8;
  if ((v.photos as any[])?.length > 0) s += 8;
  if (v.location) s += 5;
  if (v.sector) s += 5;
  if (v.phone) s += 4;
  if (v.email) s += 4;
  if ((v.certifications as any[])?.length > 0) s += 6;
  if ((v.moments as any[])?.length > 0) s += 6;
  return Math.min(s, 100);
}

function toOutput(v: any, companyName?: string) {
  return {
    id: String(v.id),
    etablissementId: String(v.etablissementId),
    companyName: companyName ?? '',
    logoUrl: v.logoUrl ?? null,
    bannerUrl: v.bannerUrl ?? null,
    slogan: v.slogan ?? '',
    location: v.location ?? '',
    sector: v.sector ?? '',
    aboutUs: v.aboutUs ?? '',
    kpis: (v.kpis as object[]) ?? [],
    values: (v.values as object[]) ?? [],
    perks: (v.perks as string[]) ?? [],
    photos: (v.photos as object[]) ?? [],
    videos: (v.videos as object[]) ?? [],
    socials: (v.socials as object) ?? {},
    phone: v.phone ?? '',
    email: v.email ?? '',
    certifications: (v.certifications as string[]) ?? [],
    moments: (v.moments as object[]) ?? [],
    completionScore: v.completionScore ?? 0,
    views: v.views ?? 0,
  };
}

export const vitrineService = {
  async get(userId: number, requestedEtabId?: number) {
    const etabId = await resolveActiveEtablissementId(userId, requestedEtabId);
    const [etab, vitrine] = await Promise.all([
      etablissementRepository.findById(etabId),
      vitrineRepository.upsertEmpty(etabId),
    ]);

    const merged = { ...vitrine, sector: vitrine.sector || etab?.sector || '', location: vitrine.location || etab?.city || '' };
    return toOutput(merged, etab?.name);
  },

  async update(userId: number, input: UpdateVitrineInput) {
    const etabId = await resolveActiveEtablissementId(userId);

    const { companyName, logoUrl, bannerUrl, ...rest } = input;
    const updateData: Record<string, unknown> = { ...rest };
    if (logoUrl !== undefined && !logoUrl.startsWith('blob:')) updateData.logoUrl = logoUrl;
    if (bannerUrl !== undefined && !bannerUrl.startsWith('blob:')) updateData.bannerUrl = bannerUrl;

    const upserted = await vitrineRepository.upsertWithData(etabId, updateData, {
      ...rest,
      logoUrl: logoUrl && !logoUrl.startsWith('blob:') ? logoUrl : null,
      bannerUrl: bannerUrl && !bannerUrl.startsWith('blob:') ? bannerUrl : null,
      completionScore: 0,
      views: 0,
    });

    const score = calcCompletion(upserted);
    const final = await vitrineRepository.updateCompletionScore(etabId, score);

    const etabName = await syncEtablissement(etabId, { sector: rest.sector, location: rest.location, companyName });
    return toOutput(final, etabName);
  },

  async uploadLogo(userId: number, url: string) {
    if (!url) throw new BadRequestError('Fichier manquant');
    const etabId = await resolveActiveEtablissementId(userId);
    await Promise.all([
      vitrineRepository.upsertWithData(etabId, { logoUrl: url }, { logoUrl: url }),
      etablissementRepository.update(etabId, { logo: url }),
    ]);
    return { url };
  },

  async uploadBanner(userId: number, url: string) {
    if (!url) throw new BadRequestError('Fichier manquant');
    const etabId = await resolveActiveEtablissementId(userId);
    await vitrineRepository.upsertWithData(etabId, { bannerUrl: url }, { bannerUrl: url });
    return { url };
  },

  async uploadPhoto(userId: number, url: string, photoId: string, alt: string) {
    if (!url) throw new BadRequestError('Fichier manquant');
    const etabId = await resolveActiveEtablissementId(userId);

    const vitrine = await vitrineRepository.findByEtablissementId(etabId);
    const existing = (vitrine?.photos as any[]) ?? [];
    if (existing.length >= MAX_PHOTOS) {
      throw new BadRequestError(`Maximum ${MAX_PHOTOS} photos atteint`);
    }

    const newPhoto = { id: photoId, url, alt };
    const upserted = await vitrineRepository.upsertWithData(etabId, { photos: [...existing, newPhoto] }, { photos: [newPhoto] });
    await vitrineRepository.updateCompletionScore(etabId, calcCompletion(upserted));
    return newPhoto;
  },

  async deletePhoto(userId: number, photoId: string): Promise<void> {
    const etabId = await resolveActiveEtablissementId(userId);
    const vitrine = await vitrineRepository.findByEtablissementId(etabId);
    const photos = ((vitrine?.photos as any[]) ?? []).filter((p) => p.id !== photoId);
    await vitrineRepository.update(etabId, { photos });
  },

  async addVideo(userId: number, input: AddVideoInput) {
    const etabId = await resolveActiveEtablissementId(userId);
    const ytMatch = input.url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    const thumbnailUrl = ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg` : '';

    const vitrine = await vitrineRepository.findByEtablissementId(etabId);
    const existing = (vitrine?.videos as any[]) ?? [];
    const newVideo = { id: `vid-${Date.now()}`, url: input.url, title: input.title ?? 'Vidéo de présentation', thumbnailUrl };

    await vitrineRepository.upsertWithData(etabId, { videos: [...existing, newVideo] }, { videos: [newVideo] });
    return newVideo;
  },

  async deleteVideo(userId: number, videoId: string): Promise<void> {
    const etabId = await resolveActiveEtablissementId(userId);
    const vitrine = await vitrineRepository.findByEtablissementId(etabId);
    const videos = ((vitrine?.videos as any[]) ?? []).filter((v) => v.id !== videoId);
    await vitrineRepository.update(etabId, { videos });
  },

  async getPublic(etablissementId: number) {
    const [etab, vitrine] = await Promise.all([
      etablissementRepository.findById(etablissementId),
      vitrineRepository.findByEtablissementId(etablissementId),
    ]);
    if (!etab) throw new NotFoundError('Établissement introuvable');

    if (vitrine) vitrineRepository.incrementViewsById(vitrine.id).catch(() => {});

    return vitrine ? toOutput(vitrine, etab.name) : null;
  },
};

async function syncEtablissement(
  etabId: number,
  data: { sector?: string; location?: string; companyName?: string },
): Promise<string | undefined> {
  const sync: Record<string, unknown> = {};
  if (data.sector?.trim()) sync.sector = data.sector.trim();
  if (data.location?.trim()) sync.city = data.location.trim();
  if (data.companyName?.trim()) sync.name = data.companyName.trim();

  if (Object.keys(sync).length > 0) {
    const updated = await etablissementRepository.update(etabId, sync as any).catch(() => null);
    if (updated) return updated.name;
  }
  const etab = await etablissementRepository.findById(etabId);
  return etab?.name;
}