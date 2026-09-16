// src/app/(back-office)/utilisateurs/page.tsx
"use client";

import { ProtectedRoute } from '@/components/Dashboard/ProtectedRoute';
import { useUsersManager } from '@/components/utilisateurs/useUsersManager';
import { useRolePermissions } from '@/components/utilisateurs/useRolePermissions';
import { PlusIcon, XIcon } from '@/components/utilisateurs/icons';
import UsersFilterBar from '@/components/utilisateurs/UsersFilterBar';
import UsersTable from '@/components/utilisateurs/UsersTable';
import RoleDefinitionsSection from '@/components/utilisateurs/RoleDefinitionsSection';
import UserModal from '@/components/utilisateurs/UserModal';
import PermissionsModal from '@/components/utilisateurs/PermissionsModal';

export default function UserRolesManagement() {
  const users = useUsersManager();
  const roles = useRolePermissions();

  if (users.loading) {
    return (
      <ProtectedRoute requiredRole="SUPER_ADMIN">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      <div className="min-h-screen bg-gray-50 p-6 font-sans">
        <div className="max-w-6xl mx-auto space-y-6">

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Gestion des Utilisateurs et des Rôles</h1>
              <p className="text-sm text-gray-500 mt-0.5">Administrez les comptes et définissez les niveaux de permission</p>
            </div>
            <button
              onClick={users.openCreateModal}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150 shadow-sm"
            >
              <PlusIcon />
              Ajouter un Utilisateur
            </button>
          </div>

          {users.error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <div className="text-red-600">⚠️</div>
              <p className="text-sm text-red-700">{users.error}</p>
              <button onClick={() => users.setError('')} className="ml-auto text-red-400 hover:text-red-600">
                <XIcon />
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <UsersFilterBar
              search={users.search} setSearch={users.setSearch}
              roleFilter={users.roleFilter} setRoleFilter={users.setRoleFilter}
              statusFilter={users.statusFilter} setStatusFilter={users.setStatusFilter}
            />
            <UsersTable
              users={users.filtered}
              saving={users.saving}
              onEdit={users.openEditModal}
              onDelete={users.handleDeleteUser}
              onToggleStatus={users.handleToggleStatus}
            />
          </div>

          <RoleDefinitionsSection
            roleDefinitions={roles.roleDefinitions}
            onEditPermissions={roles.openPermissionsModal}
          />
        </div>
      </div>

      <UserModal
        isOpen={users.isUserModalOpen}
        onClose={users.closeUserModal}
        onSave={users.handleSaveUser}
        editingUser={users.editingUser}
      />

      {roles.editingRole && (
        <PermissionsModal
          isOpen={roles.isPermissionsModalOpen}
          onClose={roles.closePermissionsModal}
          onSave={roles.handleSaveRolePermissions}
          role={roles.editingRole}
          allPermissions={roles.allPermissions}
          currentPermissions={roles.rolePermissions[roles.editingRole.name] || []}
        />
      )}
    </ProtectedRoute>
  );
}