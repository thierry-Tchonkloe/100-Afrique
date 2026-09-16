// src/components/utilisateurs/useRolePermissions.ts
"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Permission, Role, RoleDefinition, RolePermissions, getApiErrorMessage } from './types';

export function useRolePermissions() {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<Role, string[]>>({
    SUPER_ADMIN: [],
    EDITOR: [],
  });
  const [roleDefinitions, setRoleDefinitions] = useState<RoleDefinition[]>([]);
  const [saving, setSaving] = useState(false);

  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/admin/permissions');
      if (response.data.data) setAllPermissions(response.data.data);
    } catch (err) {
      console.error('Erreur chargement permissions:', err);
    }
  };

  const fetchRoleDefinitions = async () => {
    try {
      const response = await api.get('/admin/roles');
      if (response.data.data) {
        const roles: RoleDefinition[] = response.data.data;
        setRoleDefinitions(roles);

        const permissions: Record<Role, string[]> = { SUPER_ADMIN: [], EDITOR: [] };

        const allPerms = await api.get('/admin/permissions');
        const allPermissionsData: Permission[] = allPerms.data.data || [];

        roles.forEach((role) => {
          const allowedPermissionIds = allPermissionsData
            .filter((perm) => {
              const rolePermission = role.permissions.find((p) => p.label === perm.label);
              return rolePermission?.allowed === true;
            })
            .map((perm) => perm.id);
          permissions[role.name] = allowedPermissionIds;
        });

        setRolePermissions(permissions);
      }
    } catch (err) {
      console.error('Erreur chargement rôles:', err);
    }
  };

  useEffect(() => {
    fetchPermissions();
    fetchRoleDefinitions();
  }, []);

  const openPermissionsModal = (role: RoleDefinition) => { setEditingRole(role); setIsPermissionsModalOpen(true); };
  const closePermissionsModal = () => { setIsPermissionsModalOpen(false); setEditingRole(null); };

  const handleSaveRolePermissions = async (data: RolePermissions) => {
    try {
      setSaving(true);
      const response = await api.put(`/admin/roles/${data.role}/permissions`, { permissions: data.permissions });

      if (response.data.success) {
        setRolePermissions((prev) => ({ ...prev, [data.role]: data.permissions }));
        await fetchRoleDefinitions();
        closePermissionsModal();
      }
    } catch (err) {
      alert(getApiErrorMessage(err, 'Erreur lors de la sauvegarde'));
    } finally {
      setSaving(false);
    }
  };

  return {
    allPermissions, rolePermissions, roleDefinitions, saving,
    isPermissionsModalOpen, editingRole, openPermissionsModal, closePermissionsModal,
    handleSaveRolePermissions,
  };
}