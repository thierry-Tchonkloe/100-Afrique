// src/services/settings.service.ts
import { prisma } from '../config/database';
import { cacheService } from '../utils/cache';

const CACHE_KEY_TAXONOMY_SETTINGS = 'settings:taxonomy';

/**
 * Service de gestion des paramètres
 */
export class SettingsService {
  /**
   * Récupère les paramètres de taxonomie (avec cache)
   */
  async getTaxonomySettings() {
    // Vérifier le cache
    const cached = cacheService.get(CACHE_KEY_TAXONOMY_SETTINGS);
    if (cached) {
      return cached;
    }

    // Récupérer depuis la BDD
    const settings = await prisma.setting.findFirst({
      where: { key: 'taxonomy' },
    });

    const defaultSettings = {
      maxTags: 5,
      tagsEnabled: true,
    };

    const data = settings?.value
      ? { ...defaultSettings, ...(typeof settings.value === 'object' ? settings.value : {}) }
      : defaultSettings;

    // Mettre en cache
    cacheService.set(CACHE_KEY_TAXONOMY_SETTINGS, data);

    return data;
  }

  /**
   * Sauvegarde les paramètres de taxonomie
   */
  async updateTaxonomySettings(data: { maxTags?: number; tagsEnabled?: boolean }) {
    // Créer ou mettre à jour
    const settings = await prisma.setting.upsert({
      where: { key: 'taxonomy' },
      update: {
        value: data,
      },
      create: {
        key: 'taxonomy',
        value: data,
      },
    });

    // Invalider le cache
    this.clearCache();

    return settings.value;
  }

  /**
   * Invalide le cache des paramètres
   */
  private clearCache() {
    cacheService.del(CACHE_KEY_TAXONOMY_SETTINGS);
  }
}

export const settingsService = new SettingsService();