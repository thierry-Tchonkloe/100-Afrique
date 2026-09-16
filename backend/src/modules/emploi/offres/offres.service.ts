// src/services/emploi/offres.service.ts
import { offreRepository } from './offre.repository';
import { resolveActiveEtablissementId, assertOffreAccess } from '../services/etablissement-access.service';
import { NotFoundError } from '../../../errors/http-errors';
import { buildSectorWhere } from '../../../utils/sectors';
import type { CreateOffreInput, PublicJobsQuery, UpdateOffreStatusInput } from './offre.types';

const STATUS_TO_PRISMA: Record<string, string> = {
  active: 'ACTIVE', paused: 'PAUSED', draft: 'DRAFT', archived: 'ARCHIVED',
};

function toOffreOutput(o: any) {
  return {
    id: String(o.id),
    title: o.title,
    sector: o.sector,
    contractType: o.contractType,
    location: o.location,
    salaryMin: o.salaryMin ?? null,
    salaryMax: o.salaryMax ?? null,
    remote: o.remote ?? 'none',
    missions: o.missions ?? null,
    profileDesc: o.profileDesc ?? null,
    advantages: o.advantages ?? null,
    requiredSkills: (o.requiredSkills ?? []) as string[],
    requiredLangs: (o.requiredLangs ?? []) as string[],
    requiredSoftwares: (o.requiredSoftwares ?? []) as string[],
    status: (o.status as string).toLowerCase(),
    isPremium: o.isPremium ?? false,
    views: o.views ?? 0,
    candidatesCount: o._count?.applications ?? 0,
    newCandidatesCount: o._count?.unreadApplications ?? 0,
    publishedAt: o.publishedAt?.toISOString() ?? null,
    expiresAt: o.expiresAt?.toISOString() ?? null,
  };
}

/** Aplati le payload "wizard" (step1/step2/step3) vers les colonnes Offre. */
function flattenOffrePayload(input: CreateOffreInput): Record<string, unknown> {
  const { step1, step2, step3, ...flat } = input;
  if (!step1) return flat;
  return {
    title: step1.title,
    sector: step1.sector,
    contractType: step1.contractType,
    location: step1.location,
    salaryMin: step1.salaryMin ?? null,
    salaryMax: step1.salaryMax ?? null,
    remote: step1.remote ?? 'none',
    missions: step2?.missions ?? null,
    profileDesc: step2?.profile ?? null,
    advantages: step2?.advantages ?? null,
    requiredSkills: step3?.requiredSkills ?? [],
    requiredLangs: step3?.languages ?? [],
    requiredSoftwares: step3?.softwares ?? [],
  };
}

/**
 * FIX : parse sûr d'une valeur de pagination provenant de req.query.
 * Express (et donc PublicJobsQuery en pratique, quoi qu'en dise son typage
 * TS "number") ne fournit QUE des chaînes de caractères pour les paramètres
 * de query string. Passer une string non convertie comme `take`/`skip` à
 * Prisma provoque une exception de validation d'argument ("Expected Int,
 * provided String"), qui remontait jusqu'à errorHandler et transformait
 * TOUTE requête publique paginée (accueil, liste d'offres, page secteur,
 * "offres similaires" sur la page détail) en erreur 500 — masquée côté
 * frontend par un repli silencieux sur des données mock.
 */
function parsePaginationInt(raw: unknown, fallback: number, { min = 1, max }: { min?: number; max?: number } = {}): number {
  const parsed = parseInt(String(raw ?? fallback), 10);
  let value = Number.isFinite(parsed) && !Number.isNaN(parsed) ? parsed : fallback;
  if (value < min) value = min;
  if (typeof max === 'number' && value > max) value = max;
  return value;
}

export const offresService = {
  async listForRecruiter(userId: number, requestedEtabId?: number) {
    const etabId = await resolveActiveEtablissementId(userId, requestedEtabId);

    const [offres, unreadByOffre] = await Promise.all([
      offreRepository.findManyForEtablissement(etabId),
      offreRepository.countUnreadByOffre(etabId),
    ]);

    const unreadMap = Object.fromEntries(unreadByOffre.map((r) => [r.offreId, r._count.id]));
    const enriched = offres.map((o) => ({
      ...o,
      _count: { applications: o._count.applications, unreadApplications: unreadMap[o.id] ?? 0 },
    }));

    return {
      stats: {
        online: offres.filter((o) => ['ACTIVE', 'PAUSED'].includes(o.status)).length,
        drafts: offres.filter((o) => o.status === 'DRAFT').length,
        archives: offres.filter((o) => o.status === 'ARCHIVED').length,
      },
      offres: enriched.map(toOffreOutput),
    };
  },

  async create(userId: number, input: CreateOffreInput) {
    const etabId = await resolveActiveEtablissementId(userId);
    const offre = await offreRepository.create(etabId, flattenOffrePayload(input));
    return toOffreOutput(offre);
  },

  async update(userId: number, offreId: number, input: CreateOffreInput) {
    const existing = await offreRepository.findById(offreId);
    if (!existing) throw new NotFoundError('Offre introuvable');
    await assertOffreAccess(userId, existing.etablissementId);

    const offre = await offreRepository.update(offreId, flattenOffrePayload(input));
    return toOffreOutput(offre);
  },

  async updateStatus(userId: number, offreId: number, input: UpdateOffreStatusInput) {
    const existing = await offreRepository.findById(offreId);
    if (!existing) throw new NotFoundError('Offre introuvable');
    await assertOffreAccess(userId, existing.etablissementId);

    const offre = await offreRepository.updateStatus(
      offreId,
      STATUS_TO_PRISMA[input.status] ?? 'PAUSED',
      input.status === 'active',
    );
    return toOffreOutput(offre);
  },

  async duplicate(userId: number, offreId: number) {
    const original = await offreRepository.findById(offreId);
    if (!original) throw new NotFoundError('Offre introuvable');
    await assertOffreAccess(userId, original.etablissementId);

    const copy = await offreRepository.duplicate(original);
    return toOffreOutput(copy);
  },

  async archive(userId: number, offreId: number): Promise<void> {
    const existing = await offreRepository.findById(offreId);
    if (!existing) throw new NotFoundError('Offre introuvable');
    await assertOffreAccess(userId, existing.etablissementId);

    await offreRepository.archive(offreId);
  },

  async listPublic(query: PublicJobsQuery) {
    const where: Record<string, unknown> = { status: 'ACTIVE' };
    Object.assign(where, buildSectorWhere(query.sector));

    if (query.location) where.location = { contains: query.location, mode: 'insensitive' };

    if (query.contractType) {
      const types = query.contractType.split(',').map((t) => t.trim()).filter(Boolean);
      where.contractType = types.length > 1 ? { in: types } : types[0];
    }
    if (query.remote) {
      const values = query.remote.split(',').map((r) => r.trim()).filter(Boolean);
      where.remote = values.length > 1 ? { in: values } : values[0];
    }
    if (query.search) where.title = { contains: query.search, mode: 'insensitive' };

    // FIX : conversion explicite en entiers (voir parsePaginationInt ci-dessus).
    // AVANT : `const page = query.page ?? 1; const limit = query.limit ?? 10;`
    // laissait passer des chaînes ("6", "1") telles quelles jusqu'à Prisma,
    // qui les rejetait (`take` doit être un Int) → 500 sur toute requête
    // publique paginée. C'est ce qui faisait "disparaître" les offres de
    // l'accueil et de la liste publique (repli silencieux sur des données
    // mock côté frontend), et faisait échouer la page détail d'une offre
    // (l'appel "offres similaires" plantait dans la même chaîne de promesses
    // que le fetch de l'offre elle-même, déclenchant le catch() global qui
    // affichait "Offre introuvable").
    const page = parsePaginationInt(query.page, 1, { min: 1 });
    const limit = parsePaginationInt(query.limit, 10, { min: 1, max: 50 });
    const skip = (page - 1) * limit;

    const [total, offres] = await Promise.all([
      offreRepository.countPublic(where as any),
      offreRepository.findManyPublic(where as any, skip, limit),
    ]);

    const ids = offres.map((o) => o.id);
    if (ids.length > 0) {
      // Non-bloquant : le compteur de vues ne doit pas retarder la réponse.
      offreRepository.incrementViews(ids).catch(() => {});
    }

    return {
      total,
      page,
      limit,
      offres: offres.map((o) => ({
        id: String(o.id),
        title: o.title,
        companyName: o.etablissement.name,
        sector: o.sector,
        contractType: o.contractType,
        location: o.location,
        salaryMin: o.salaryMin,
        salaryMax: o.salaryMax,
        remote: o.remote,
        isPremium: o.isPremium,
        publishedAt: o.publishedAt?.toISOString(),
      })),
    };
  },

  async getPublicDetail(offreId: number) {
    const offre = await offreRepository.findByIdWithEtablissementAndVitrine(offreId);
    if (!offre || offre.status !== 'ACTIVE') throw new NotFoundError('Offre introuvable');

    return {
      id: String(offre.id),
      title: offre.title,
      sector: offre.sector,
      contractType: offre.contractType,
      location: offre.location,
      salaryMin: offre.salaryMin,
      salaryMax: offre.salaryMax,
      remote: offre.remote,
      missions: offre.missions,
      profileDesc: offre.profileDesc,
      advantages: offre.advantages,
      requiredSkills: (offre.requiredSkills ?? []) as string[],
      requiredLangs: (offre.requiredLangs ?? []) as string[],
      publishedAt: offre.publishedAt?.toISOString(),
      expiresAt: offre.expiresAt?.toISOString(),
      company: {
        id: String(offre.etablissementId),
        name: offre.etablissement.name,
        sector: offre.etablissement.sector,
        city: offre.etablissement.city,
        logo: offre.etablissement.logo,
        slogan: offre.etablissement.vitrine?.slogan,
      },
    };
  },
};