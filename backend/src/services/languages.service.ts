// src/services/languages.service.ts
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { cacheService } from '../utils/cache';

const CACHE_KEY_ALL_LANGUAGES = 'languages:all';
const CACHE_KEY_LANGUAGE_SETTINGS = 'languages:settings';

interface CreateLanguageInput {
  code: string;
  name: string;
  nativeName: string;
  enabled?: boolean;
}

interface UpdateLanguageInput {
  name?: string;
  nativeName?: string;
  enabled?: boolean;
  order?: number;
}

interface LanguageSettings {
  defaultLanguage: string;
  translationStrategy: 'manual' | 'api';
  syncMetadata: boolean;
  autoPublish: boolean;
  untranslatedRedirect: 'default' | 'home' | '404';
}

const DEFAULT_SETTINGS: LanguageSettings = {
  defaultLanguage: 'FR',
  translationStrategy: 'manual',
  syncMetadata: true,
  autoPublish: false,
  untranslatedRedirect: 'default',
};

/**
 * Service de gestion des langues
 */
export class LanguagesService {
  /**
   * Récupère toutes les langues avec statistiques
   */
  async getAllLanguages() {
    // Vérifier le cache
    const cached = cacheService.get(CACHE_KEY_ALL_LANGUAGES);
    if (cached) {
      return cached;
    }

    // Récupérer depuis la BDD
    const languages = await prisma.language.findMany({
      orderBy: [{ isDefault: 'desc' }, { order: 'asc' }, { createdAt: 'asc' }],
    });

    // Récupérer les statistiques de traduction
    const [totalArticles, totalDestinations] = await Promise.all([
      prisma.article.count(),
      prisma.destination.count(),
    ]);

    // Enrichir avec les statistiques (simulées pour l'instant)
    const enrichedLanguages = languages.map((lang) => ({
      ...lang,
      articles: {
        done: lang.isDefault ? totalArticles : Math.floor(totalArticles * 0.75),
        total: totalArticles,
      },
      destinations: {
        done: lang.isDefault ? totalDestinations : Math.floor(totalDestinations * 0.75),
        total: totalDestinations,
      },
      videos: {
        done: 0,
        total: 0,
      },
    }));

    // Mettre en cache
    cacheService.set(CACHE_KEY_ALL_LANGUAGES, enrichedLanguages);

    return enrichedLanguages;
  }

  /**
   * Récupère une langue par son ID
   */
  async getLanguageById(id: number) {
    const language = await prisma.language.findUnique({
      where: { id },
    });

    if (!language) {
      throw new AppError('Langue non trouvée', 404);
    }

    return language;
  }

  /**
   * Crée une nouvelle langue
   */
  async createLanguage(data: CreateLanguageInput) {
    // Vérifier l'unicité du code
    const existing = await prisma.language.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      throw new AppError('Une langue avec ce code existe déjà', 409);
    }

    // Créer la langue
    const language = await prisma.language.create({
      data: {
        code: data.code,
        name: data.name,
        nativeName: data.nativeName,
        flag: data.code,
        enabled: data.enabled ?? false,
        isDefault: false,
        order: await this.getNextOrder(),
      },
    });

    // Invalider le cache
    this.clearCache();

    return language;
  }

  /**
   * Met à jour une langue
   */
  async updateLanguage(id: number, data: UpdateLanguageInput) {
    // Vérifier que la langue existe
    await this.getLanguageById(id);

    // Mettre à jour
    const language = await prisma.language.update({
      where: { id },
      data,
    });

    // Invalider le cache
    this.clearCache();

    return language;
  }

  /**
   * Active/désactive une langue
   */
  async toggleLanguage(id: number, enabled: boolean) {
    const language = await this.getLanguageById(id);

    // Empêcher la désactivation de la langue par défaut
    if (language.isDefault && !enabled) {
      throw new AppError('Impossible de désactiver la langue par défaut', 400);
    }

    // Mettre à jour
    const updated = await prisma.language.update({
      where: { id },
      data: { enabled },
    });

    // Invalider le cache
    this.clearCache();

    return updated;
  }

  /**
   * Supprime une langue
   */
  async deleteLanguage(id: number) {
    const language = await this.getLanguageById(id);

    // Empêcher la suppression de la langue par défaut
    if (language.isDefault) {
      throw new AppError('Impossible de supprimer la langue par défaut', 400);
    }

    // Supprimer
    await prisma.language.delete({
      where: { id },
    });

    // Invalider le cache
    this.clearCache();

    return { message: 'Langue supprimée avec succès' };
  }

  /**
   * Définit la langue par défaut
   */
  async setDefaultLanguage(code: string) {
    // Vérifier que la langue existe
    const language = await prisma.language.findUnique({
      where: { code },
    });

    if (!language) {
      throw new AppError('Langue non trouvée', 404);
    }

    // Transaction pour changer la langue par défaut
    await prisma.$transaction([
      // Retirer le statut par défaut de toutes les langues
      prisma.language.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      }),
      // Définir la nouvelle langue par défaut
      prisma.language.update({
        where: { code },
        data: {
          isDefault: true,
          enabled: true, // Activer automatiquement
        },
      }),
    ]);

    // Mettre à jour les paramètres
    const settings = await this.getSettings();
    await this.updateSettings({ ...settings, defaultLanguage: code });

    // Invalider le cache
    this.clearCache();

    return { message: 'Langue par défaut mise à jour avec succès' };
  }

  /**
   * Récupère les paramètres de langue
   */
  async getSettings(): Promise<LanguageSettings> {
    // Vérifier le cache
    const cached = cacheService.get(CACHE_KEY_LANGUAGE_SETTINGS);
    if (cached) {
      return cached as LanguageSettings;
    }

    // Récupérer depuis la BDD
    const setting = await prisma.setting.findUnique({
      where: { key: 'language_settings' },
    });

    // ✅ CORRECTION: Cast explicite via unknown
    const settings = setting?.value
      ? (setting.value as unknown as LanguageSettings)
      : DEFAULT_SETTINGS;

    // Mettre en cache
    cacheService.set(CACHE_KEY_LANGUAGE_SETTINGS, settings);

    return settings;
  }

  /**
   * Met à jour les paramètres de langue
   */
  async updateSettings(data: Partial<LanguageSettings>) {
    // Récupérer les paramètres actuels
    const currentSettings = await this.getSettings();

    // Fusionner avec les nouvelles données
    const updatedSettings = {
      ...currentSettings,
      ...data,
    };

    // Sauvegarder dans la BDD
    await prisma.setting.upsert({
      where: { key: 'language_settings' },
      update: {
        value: updatedSettings as any, // ✅ CORRECTION: Cast to any pour Prisma Json
      },
      create: {
        key: 'language_settings',
        value: updatedSettings as any, // ✅ CORRECTION: Cast to any pour Prisma Json
      },
    });

    // Invalider le cache
    cacheService.del(CACHE_KEY_LANGUAGE_SETTINGS);

    return updatedSettings;
  }

  /**
   * Récupère le prochain numéro d'ordre
   */
  private async getNextOrder(): Promise<number> {
    const lastLanguage = await prisma.language.findFirst({
      orderBy: { order: 'desc' },
    });

    return (lastLanguage?.order ?? -1) + 1;
  }

  /**
   * Invalide le cache des langues
   */
  private clearCache() {
    cacheService.del(CACHE_KEY_ALL_LANGUAGES);
    cacheService.del(CACHE_KEY_LANGUAGE_SETTINGS);
  }
}

export const languagesService = new LanguagesService();