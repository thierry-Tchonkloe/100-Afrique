// src/modules/emploi/services/etablissement-access.service.ts
import { etablissementRepository } from '../repositories/etablissement.repository';
import { ForbiddenError, NotFoundError } from '../../../errors/http-errors';

/**
 * Point UNIQUE de résolution "quel établissement ce recruteur gère-t-il
 * en ce moment" — utilisé par offres, vitrine, candidatures et le
 * dashboard recruteur. Avant, chaque contrôleur avait sa propre copie de
 * cette logique (parfois sans vérification d'accès, voir le commentaire
 * dans etablissement.repository.ts). Une seule version = un seul endroit
 * à corriger si la règle change.
 */
export async function resolveActiveEtablissementId(userId: number, requestedId?: number): Promise<number> {
  if (requestedId) {
    const link = await etablissementRepository.findVerifiedLink(userId, requestedId);
    if (!link) {
      throw new ForbiddenError("Vous n'avez pas accès à cet établissement");
    }
    return link.etablissementId;
  }

  const defaultLink = await etablissementRepository.findDefaultLink(userId);
  if (defaultLink) return defaultLink.etablissementId;

  const firstLink = await etablissementRepository.findFirstLink(userId);
  if (firstLink) return firstLink.etablissementId;

  throw new NotFoundError('Aucun établissement lié à ce compte');
}

/**
 * Vérifie que ce recruteur peut agir sur une offre donnée, et retourne
 * l'établissement propriétaire. Utilisé avant toute modification d'offre.
 */
export async function assertOffreAccess(userId: number, etablissementId: number): Promise<void> {
  const link = await etablissementRepository.findVerifiedLink(userId, etablissementId);
  if (!link) {
    throw new ForbiddenError("Vous n'avez pas accès à cette offre");
  }
}