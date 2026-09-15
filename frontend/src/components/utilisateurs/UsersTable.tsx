// src/components/utilisateurs/UsersTable.tsx
"use client";
import React from 'react';
import { EditIcon, TrashIcon } from './icons';
import Toggle from './Toggle';
import { User, Status, ROLE_LABELS, ROLE_BADGE, getInitials, getAvatarColor, formatRelativeDate } from './types';

interface UsersTableProps {
  users: User[];
  saving: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, currentStatus: Status) => void;
}

const UsersTable = ({ users, saving, onEdit, onDelete, onToggleStatus }: UsersTableProps) => (
  <table className="w-full text-sm">
    <thead>
      <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
        <th className="text-left px-5 py-3 font-medium">Utilisateur</th>
        <th className="text-left px-4 py-3 font-medium">Email</th>
        <th className="text-left px-4 py-3 font-medium">Rôle</th>
        <th className="text-left px-4 py-3 font-medium">Créé le</th>
        <th className="text-left px-4 py-3 font-medium">Statut</th>
        <th className="text-right px-5 py-3 font-medium">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-50">
      {users.map((user, index) => (
        <tr key={user.id} className="hover:bg-gray-50/60 transition-colors duration-100">
          <td className="px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                {getInitials(user.name)}
              </div>
              <span className="font-medium text-gray-800">{user.name}</span>
            </div>
          </td>

          <td className="px-4 py-3.5 text-gray-500">{user.email}</td>

          <td className="px-4 py-3.5">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_BADGE[user.role]}`}>
              {ROLE_LABELS[user.role]}
            </span>
          </td>

          <td className="px-4 py-3.5 text-gray-500">{formatRelativeDate(user.createdAt)}</td>

          <td className="px-4 py-3.5">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {user.status === 'ACTIVE' ? 'Actif' : 'Suspendu'}
            </span>
          </td>

          <td className="px-5 py-3.5">
            <div className="flex items-center justify-end gap-2.5">
              <button onClick={() => onEdit(user)} className="text-blue-500 hover:text-blue-700 transition-colors" title="Modifier">
                <EditIcon />
              </button>
              <button
                onClick={() => onDelete(user.id)}
                disabled={saving}
                className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                title="Supprimer"
              >
                <TrashIcon />
              </button>
              <Toggle enabled={user.status === 'ACTIVE'} onChange={() => onToggleStatus(user.id, user.status)} disabled={saving} />
            </div>
          </td>
        </tr>
      ))}

      {users.length === 0 && (
        <tr>
          <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">
            Aucun utilisateur trouvé.
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default UsersTable;