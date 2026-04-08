import NodeCache from 'node-cache';
import { config } from '../config/env';

/**
 * Cache en mémoire pour optimiser les requêtes fréquentes
 * Utilisé principalement pour les catégories qui changent rarement
 */
class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: config.cache.ttl,
      checkperiod: 600, // Vérification toutes les 10 minutes
      useClones: false, // Meilleures performances
    });
  }

  /**
   * Récupère une valeur du cache
   */
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Stocke une valeur dans le cache
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || config.cache.ttl);
  }

  /**
   * Supprime une clé du cache
   */
  del(key: string): number {
    return this.cache.del(key);
  }

  /**
   * Supprime toutes les clés correspondant à un pattern
   */
  delPattern(pattern: string): void {
    const keys = this.cache.keys();
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        this.cache.del(key);
      }
    });
  }

  /**
   * Vide complètement le cache
   */
  flush(): void {
    this.cache.flushAll();
  }

  /**
   * Récupère les statistiques du cache
   */
  getStats() {
    return this.cache.getStats();
  }
}

export const cacheService = new CacheService();