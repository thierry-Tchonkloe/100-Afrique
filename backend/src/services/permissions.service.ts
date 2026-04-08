// src/services/permissions.service.ts
import { cacheService } from '../utils/cache';

const CACHE_KEY_ALL_PERMISSIONS = 'permissions:all';

// ✅ EXPORTER l'interface Permission
export interface Permission {
  id: string;
  label: string;
  description: string;
  category: string;
}

/**
 * Service de gestion des permissions
 * 
 * Note: Les permissions sont définies en dur pour simplifier.
 * Dans une application réelle, elles pourraient être stockées en BDD.
 */
export class PermissionsService {
  /**
   * Liste de toutes les permissions disponibles
   */
  private readonly PERMISSIONS: Permission[] = [
    // ── Articles ──
    {
      id: 'articles.view',
      label: 'Voir tous les articles',
      description: 'Permet de visualiser tous les articles du système',
      category: 'Articles',
    },
    {
      id: 'articles.create',
      label: 'Créer des articles',
      description: 'Permet de créer de nouveaux articles',
      category: 'Articles',
    },
    {
      id: 'articles.edit',
      label: 'Modifier les articles',
      description: 'Permet de modifier tous les articles',
      category: 'Articles',
    },
    {
      id: 'articles.delete',
      label: 'Supprimer les articles',
      description: 'Permet de supprimer des articles',
      category: 'Articles',
    },
    {
      id: 'articles.publish',
      label: 'Publier les articles',
      description: 'Permet de publier/dépublier des articles',
      category: 'Articles',
    },

    // ── Catégories ──
    {
      id: 'categories.view',
      label: 'Voir les catégories',
      description: 'Permet de visualiser les catégories',
      category: 'Catégories',
    },
    {
      id: 'categories.manage',
      label: 'Gérer les catégories',
      description: 'Permet de créer, modifier et supprimer des catégories',
      category: 'Catégories',
    },

    // ── Tags ──
    {
      id: 'tags.view',
      label: 'Voir les tags',
      description: 'Permet de visualiser les tags',
      category: 'Tags',
    },
    {
      id: 'tags.manage',
      label: 'Gérer les tags',
      description: 'Permet de créer, modifier et supprimer des tags',
      category: 'Tags',
    },

    // ── Médias ──
    {
      id: 'media.view',
      label: 'Voir les médias',
      description: 'Permet de visualiser la bibliothèque média',
      category: 'Médias',
    },
    {
      id: 'media.upload',
      label: 'Uploader des médias',
      description: 'Permet d\'uploader de nouveaux fichiers',
      category: 'Médias',
    },
    {
      id: 'media.delete',
      label: 'Supprimer des médias',
      description: 'Permet de supprimer des fichiers média',
      category: 'Médias',
    },

    // ── Utilisateurs ──
    {
      id: 'users.view',
      label: 'Voir les utilisateurs',
      description: 'Permet de visualiser la liste des utilisateurs',
      category: 'Utilisateurs',
    },
    {
      id: 'users.manage',
      label: 'Gérer les utilisateurs',
      description: 'Permet de créer, modifier et supprimer des utilisateurs',
      category: 'Utilisateurs',
    },

    // ── Paramètres ──
    {
      id: 'settings.view',
      label: 'Voir les paramètres',
      description: 'Permet de visualiser les paramètres du site',
      category: 'Paramètres',
    },
    {
      id: 'settings.manage',
      label: 'Gérer les paramètres',
      description: 'Permet de modifier les paramètres du site',
      category: 'Paramètres',
    },

    // ── Chatbot ──
    {
      id: 'chatbot.view',
      label: 'Voir le chatbot',
      description: 'Permet de visualiser les paramètres du chatbot',
      category: 'Chatbot',
    },
    {
      id: 'chatbot.manage',
      label: 'Gérer le chatbot',
      description: 'Permet de configurer le chatbot et les FAQs',
      category: 'Chatbot',
    },

    // ── Statistiques ──
    {
      id: 'stats.view',
      label: 'Voir les statistiques',
      description: 'Permet de visualiser les statistiques du site',
      category: 'Statistiques',
    },
  ];

  /**
   * Récupère toutes les permissions (avec cache)
   * ✅ CORRECTION: Typer explicitement le retour
   */
  async getAllPermissions(): Promise<Permission[]> {
    // Vérifier le cache
    const cached = cacheService.get(CACHE_KEY_ALL_PERMISSIONS);
    if (cached) {
      return cached as Permission[];
    }

    // Mettre en cache
    cacheService.set(CACHE_KEY_ALL_PERMISSIONS, this.PERMISSIONS);

    return this.PERMISSIONS;
  }

  /**
   * Récupère une permission par son ID
   */
  async getPermissionById(id: string): Promise<Permission | null> {
    const permission = this.PERMISSIONS.find((p) => p.id === id);
    return permission || null;
  }
}

export const permissionsService = new PermissionsService();