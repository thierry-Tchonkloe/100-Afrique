import slugify from 'slugify';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import type { Prisma } from '@prisma/client';

export class DestinationService {

  /**
   * Génère un slug unique à partir du nom
   */
  private async generateUniqueSlug(name: string, excludeId?: number): Promise<string> {
    const baseSlug = slugify(name, { lower: true, strict: true, locale: 'fr' });

    const existing = await prisma.destination.findMany({
      where: {
        slug: { startsWith: baseSlug },
        ...(excludeId && { NOT: { id: excludeId } }),
      },
      select: { slug: true },
    });

    let slug = baseSlug;
    let counter = 1;
    while (existing.some((d) => d.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  /**
   * Crée une destination
   */
  async createDestination(data: {
    name: string;
    description?: string;
    coverImage: string;
    continent?: string;
    featured?: boolean;
    status?: string;
    slogan?: string;
    typeZone?: string;
    niveauGeographique?: string;
    regionAssociee?: string;
    langue?: string;
    monnaie?: string;
    fuseauHoraire?: string;
    officeTourisme?: string;
    climatDominant?: string;
    population?: string;
    codeTel?: string;
    meillerePeriode?: string;
  }) {
    const slug = await this.generateUniqueSlug(data.name);

    const destination = await prisma.destination.create({
      data: {
        name: data.name.trim(),
        slug,
        description: data.description,
        coverImage: data.coverImage,
        continent: data.continent,
        featured: data.featured ?? false,
        status: data.status ?? 'PUBLISHED',
        slogan: data.slogan,
        typeZone: data.typeZone,
        niveauGeographique: data.niveauGeographique,
        regionAssociee: data.regionAssociee,
        langue: data.langue,
        monnaie: data.monnaie,
        fuseauHoraire: data.fuseauHoraire,
        officeTourisme: data.officeTourisme,
        climatDominant: data.climatDominant,
        population: data.population,
        codeTel: data.codeTel,
        meillerePeriode: data.meillerePeriode,
      },
    });

    return destination;
  }

  /**
   * Met à jour une destination
   */
  async updateDestination(
    id: number,
    data: {
      name?: string;
      description?: string | null;
      coverImage?: string;
      continent?: string | null;
      featured?: boolean;
      status?: string;
      slogan?: string | null;
      typeZone?: string | null;
      niveauGeographique?: string | null;
      regionAssociee?: string | null;
      langue?: string | null;
      monnaie?: string | null;
      fuseauHoraire?: string | null;
      officeTourisme?: string | null;
      climatDominant?: string | null;
      population?: string | null;
      codeTel?: string | null;
      meillerePeriode?: string | null;
    }
  ) {
    // Vérifier l'existence
    const existing = await this.getDestinationById(id);

    const updateData: Prisma.DestinationUpdateInput = {};

    // Régénérer le slug si le nom change
    if (data.name && data.name !== existing.name) {
      updateData.slug = await this.generateUniqueSlug(data.name, id);
      updateData.name = data.name.trim();
    }

    if (data.description !== undefined) updateData.description = data.description;
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
    if (data.continent !== undefined) updateData.continent = data.continent;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.slogan !== undefined) updateData.slogan = data.slogan;
    if (data.typeZone !== undefined) updateData.typeZone = data.typeZone;
    if (data.niveauGeographique !== undefined) updateData.niveauGeographique = data.niveauGeographique;
    if (data.regionAssociee !== undefined) updateData.regionAssociee = data.regionAssociee;
    if (data.langue !== undefined) updateData.langue = data.langue;
    if (data.monnaie !== undefined) updateData.monnaie = data.monnaie;
    if (data.fuseauHoraire !== undefined) updateData.fuseauHoraire = data.fuseauHoraire;
    if (data.officeTourisme !== undefined) updateData.officeTourisme = data.officeTourisme;
    if (data.climatDominant !== undefined) updateData.climatDominant = data.climatDominant;
    if (data.population !== undefined) updateData.population = data.population;
    if (data.codeTel !== undefined) updateData.codeTel = data.codeTel;
    if (data.meillerePeriode !== undefined) updateData.meillerePeriode = data.meillerePeriode;

    return prisma.destination.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Supprime une destination
   */
  async deleteDestination(id: number) {
    await this.getDestinationById(id);
    await prisma.destination.delete({ where: { id } });
    return { message: 'Destination supprimée avec succès' };
  }

  /**
   * Récupère une destination par ID
   */
  async getDestinationById(id: number) {
    const destination = await prisma.destination.findUnique({
      where: { id },
    });

    if (!destination) throw new AppError('Destination non trouvée', 404);
    return destination;
  }

  /**
   * Toggle featured
   */
  async toggleFeatured(id: number) {
    const destination = await this.getDestinationById(id);

    return prisma.destination.update({
      where: { id },
      data: { featured: !destination.featured },
      select: { id: true, name: true, featured: true },
    });
  }
}

export const destinationService = new DestinationService();