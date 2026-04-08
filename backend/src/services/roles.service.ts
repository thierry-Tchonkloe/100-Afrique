// src/services/roles.service.ts
import { prisma } from '../config/database';
import { cacheService } from '../utils/cache';
import { permissionsService } from './permissions.service';

const CACHE_KEY_ROLE_PERMISSIONS = 'roles:permissions';

type Role = 'SUPER_ADMIN' | 'EDITOR';

interface RoleDefinition {
  name: Role;
  level: number;
  description: string;
  permissions: { label: string; allowed: boolean }[];
  color: string;
}

/**
 * Service de gestion des rôles
 * 
 * Note: Les permissions des rôles sont stockées dans la table Setting
 */
export class RolesService {
  /**
   * Permissions par défaut pour chaque rôle
   */
  private readonly DEFAULT_PERMISSIONS: Record<Role, string[]> = {
    SUPER_ADMIN: [
      'articles.view',
      'articles.create',
      'articles.edit',
      'articles.delete',
      'articles.publish',
      'categories.view',
      'categories.manage',
      'tags.view',
      'tags.manage',
      'media.view',
      'media.upload',
      'media.delete',
      'users.view',
      'users.manage',
      'settings.view',
      'settings.manage',
      'chatbot.view',
      'chatbot.manage',
      'stats.view',
    ],
    EDITOR: [
      'articles.view',
      'articles.create',
      'articles.edit',
      'articles.publish',
      'categories.view',
      'tags.view',
      'tags.manage',
      'media.view',
      'media.upload',
      'stats.view',
    ],
  };

  /**
   * Définitions des rôles
   */
  private readonly ROLE_DEFINITIONS: Record<Role, Omit<RoleDefinition, 'permissions'>> = {
    SUPER_ADMIN: {
      name: 'SUPER_ADMIN',
      level: 1,
      description: 'Accès total au système',
      color: 'bg-red-100 text-red-600',
    },
    EDITOR: {
      name: 'EDITOR',
      level: 2,
      description: 'Gestion des contenus',
      color: 'bg-blue-100 text-blue-600',
    },
  };

  /**
   * Récupère tous les rôles avec leurs permissions
   */
  async getAllRoles(): Promise<RoleDefinition[]> {
    const allPermissions = await permissionsService.getAllPermissions();
    const rolePermissions = await this.getRolePermissions();

    return Object.values(this.ROLE_DEFINITIONS).map((roleDef) => {
      const permissions = rolePermissions[roleDef.name] || this.DEFAULT_PERMISSIONS[roleDef.name];

      return {
        ...roleDef,
        permissions: allPermissions.map((perm) => ({
          label: perm.label,
          allowed: permissions.includes(perm.id),
        })),
      };
    });
  }

  /**
   * Récupère un rôle avec ses permissions
   */
  async getRoleByName(role: Role): Promise<RoleDefinition> {
    const allPermissions = await permissionsService.getAllPermissions();
    const rolePermissions = await this.getRolePermissions();
    const roleDef = this.ROLE_DEFINITIONS[role];
    const permissions = rolePermissions[role] || this.DEFAULT_PERMISSIONS[role];

    return {
      ...roleDef,
      permissions: allPermissions.map((perm) => ({
        label: perm.label,
        allowed: permissions.includes(perm.id),
      })),
    };
  }

  /**
   * Met à jour les permissions d'un rôle
   */
  async updateRolePermissions(role: Role, permissions: string[]) {
    // Vérifier que toutes les permissions existent
    const allPermissions = await permissionsService.getAllPermissions();
    const validPermissionIds = allPermissions.map((p) => p.id);
    
    const invalidPermissions = permissions.filter((p) => !validPermissionIds.includes(p));
    if (invalidPermissions.length > 0) {
      throw new Error(`Permissions invalides: ${invalidPermissions.join(', ')}`);
    }

    // Récupérer les permissions actuelles
    const currentPermissions = await this.getRolePermissions();

    // Mettre à jour
    const updatedPermissions = {
      ...currentPermissions,
      [role]: permissions,
    };

    // Sauvegarder dans la BDD
    await prisma.setting.upsert({
      where: { key: 'role_permissions' },
      update: {
        value: updatedPermissions,
      },
      create: {
        key: 'role_permissions',
        value: updatedPermissions,
      },
    });

    // Invalider le cache
    this.clearCache();

    return { success: true, message: 'Permissions mises à jour avec succès' };
  }

  /**
   * Récupère les permissions des rôles depuis la BDD
   */
  private async getRolePermissions(): Promise<Record<Role, string[]>> {
    // Vérifier le cache
    const cached = cacheService.get(CACHE_KEY_ROLE_PERMISSIONS);
    if (cached) {
      return cached as Record<Role, string[]>;
    }

    // Récupérer depuis la BDD
    const setting = await prisma.setting.findUnique({
      where: { key: 'role_permissions' },
    });

    const permissions = setting?.value
      ? (setting.value as Record<Role, string[]>)
      : this.DEFAULT_PERMISSIONS;

    // Mettre en cache
    cacheService.set(CACHE_KEY_ROLE_PERMISSIONS, permissions);

    return permissions;
  }

  /**
   * Invalide le cache des permissions de rôles
   */
  private clearCache() {
    cacheService.del(CACHE_KEY_ROLE_PERMISSIONS);
  }
}

export const rolesService = new RolesService();