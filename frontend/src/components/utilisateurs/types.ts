// src/components/utilisateurs/types.ts
export type Role = 'SUPER_ADMIN' | 'EDITOR';
export type Status = 'ACTIVE' | 'SUSPENDED';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  status: Status;
}

export interface RoleDefinition {
  name: Role;
  level: number;
  description: string;
  permissions: { label: string; allowed: boolean }[];
  color: string;
}

export interface Permission {
  id: string;
  label: string;
  description: string;
  category: string;
}

export interface RolePermissions {
  role: Role;
  permissions: string[];
}

export interface ApiError {
  response?: {
    data?: {
      success?: boolean;
      message?: string;
      error?: string;
      errors?: { field: string; message: string }[];
    };
    status?: number;
  };
  message?: string;
}

export function getApiErrorMessage(err: unknown, fallback: string): string {
  const e = err as ApiError;
  if (e.response?.data?.errors) {
    return e.response.data.errors.map((x) => `${x.field}: ${x.message}`).join('\n');
  }
  return e.response?.data?.message || e.message || fallback;
}

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Administrateur',
  EDITOR: 'Éditeur',
};

export const ROLE_BADGE: Record<Role, string> = {
  SUPER_ADMIN: 'bg-red-100 text-red-600',
  EDITOR: 'bg-blue-100 text-blue-600',
};

export const AVATAR_COLORS = [
  'bg-orange-400', 'bg-pink-400', 'bg-blue-400', 'bg-teal-400', 'bg-purple-400', 'bg-indigo-400',
];

export function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString('fr-FR');
}