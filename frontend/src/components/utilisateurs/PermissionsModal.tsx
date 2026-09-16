// src/components/utilisateurs/PermissionsModal.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { XIcon, SaveIcon } from './icons';
import { Permission, RoleDefinition, RolePermissions, ROLE_LABELS } from './types';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rolePermissions: RolePermissions) => void;
  role: RoleDefinition;
  allPermissions: Permission[];
  currentPermissions: string[];
}

const PermissionsModal = ({ isOpen, onClose, onSave, role, allPermissions, currentPermissions }: PermissionsModalProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(currentPermissions);

  useEffect(() => {
    if (isOpen) setSelectedPermissions(currentPermissions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentPermissions.join(',')]);

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
    );
  };

  const handleSave = () => {
    onSave({ role: role.name, permissions: selectedPermissions });
    onClose();
  };

  if (!isOpen) return null;

  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Permissions - {ROLE_LABELS[role.name]}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{role.description}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {Object.entries(groupedPermissions).map(([category, permissions]) => (
            <div key={category}>
              <h4 className="text-sm font-bold text-gray-800 mb-3">{category}</h4>
              <div className="space-y-2">
                {permissions.map((perm) => (
                  <label
                    key={perm.id}
                    className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                      className="mt-0.5 accent-orange-500 w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{perm.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{perm.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">{selectedPermissions.length} permission(s) sélectionnée(s)</p>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
              Annuler
            </button>
            <button onClick={handleSave} className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors flex items-center gap-2">
              <SaveIcon />
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal;