// src/services/emploi/entreprises.service.ts
import { etablissementRepository } from '../repositories/etablissement.repository';
import { vitrineRepository } from '../vitrine/vitrine.repository';
import { NotFoundError } from '../../../errors/http-errors';

function firstPhotoUrl(photos: unknown): string | null {
  const arr = (photos as any[]) ?? [];
  return arr[0]?.url ?? null;
}

function toCompanyOutput(e: any) {
  const vitrine = e.vitrine;
  return {
    id: String(e.id),
    name: e.name,
    sector: e.sector || vitrine?.sector || '',
    city: e.city || vitrine?.location || '',
    logo: e.logo ?? vitrine?.logoUrl ?? null,
    offresCount: e.offres.length,
    vitrine: vitrine
      ? {
          id: String(vitrine.id),
          etablissementId: String(vitrine.etablissementId),
          logoUrl: vitrine.logoUrl ?? null,
          bannerUrl: vitrine.bannerUrl ?? null,
          slogan: vitrine.slogan ?? '',
          sector: vitrine.sector ?? '',
          location: vitrine.location ?? '',
          completionScore: vitrine.completionScore ?? 0,
          views: vitrine.views ?? 0,
          galleryImage: firstPhotoUrl(vitrine.photos),
        }
      : null,
  };
}

export const entreprisesService = {
  async listPublic() {
    const etablissements = await etablissementRepository.findManyWithOffresAndVitrine();
    return etablissements
      .filter((e) => e.offres.length > 0 || (e.vitrine && e.vitrine.completionScore > 0))
      .map(toCompanyOutput);
  },

  async getPublicDetail(id: number) {
    const e = await etablissementRepository.findByIdWithVitrineAndOffres(id);
    if (!e) throw new NotFoundError('Entreprise introuvable');

    if (e.vitrine) vitrineRepository.incrementViewsById(e.vitrine.id).catch(() => {});

    return {
      ...toCompanyOutput(e),
      aboutUs: e.vitrine?.aboutUs ?? '',
      kpis: (e.vitrine?.kpis as any[]) ?? [],
      values: (e.vitrine?.values as any[]) ?? [],
      perks: (e.vitrine?.perks as any[]) ?? [],
      photos: (e.vitrine?.photos as any[]) ?? [],
      videos: (e.vitrine?.videos as any[]) ?? [],
      socials: (e.vitrine?.socials as object) ?? {},
      phone: e.vitrine?.phone ?? '',
      email: e.vitrine?.email ?? '',
      certifications: (e.vitrine?.certifications as string[]) ?? [],
      moments: (e.vitrine?.moments as any[]) ?? [],
      offres: e.offres.map((o) => ({
        id: String(o.id), title: o.title, sector: o.sector,
        contractType: o.contractType, location: o.location,
        salaryMin: o.salaryMin, salaryMax: o.salaryMax, remote: o.remote,
        isPremium: o.isPremium,
        publishedAt: o.publishedAt ? o.publishedAt.toISOString() : null,
      })),
    };
  },
};