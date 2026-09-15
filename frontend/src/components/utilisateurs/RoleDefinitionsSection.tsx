// src/components/utilisateurs/RoleDefinitionsSection.tsx
"use client";
import React from 'react';
import { CheckIcon, CrossIcon, GearIcon } from './icons';
import { RoleDefinition, ROLE_LABELS } from './types';

interface RoleDefinitionsSectionProps {
  roleDefinitions: RoleDefinition[];
  onEditPermissions: (role: RoleDefinition) => void;
}

const RoleDefinitionsSection = ({ roleDefinitions, onEditPermissions }: RoleDefinitionsSectionProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="mb-5">
      <h2 className="text-base font-bold text-gray-900">Définition des Rôles</h2>
      <p className="text-sm text-gray-500 mt-0.5">Configurez les permissions pour chaque niveau d&apos;accès</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {roleDefinitions.map((role) => (
        <div key={role.name} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-gray-800 text-sm">{ROLE_LABELS[role.name]}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${role.color}`}>Niveau {role.level}</span>
          </div>
          <p className="text-xs text-gray-500 mb-3">{role.description}</p>

          <ul className="space-y-1.5 mb-4">
            {role.permissions.map((perm, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                {perm.allowed ? <CheckIcon /> : <CrossIcon />}
                <span>{perm.label}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => onEditPermissions(role)}
            className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            <GearIcon />
            Modifier les permissions
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default RoleDefinitionsSection;