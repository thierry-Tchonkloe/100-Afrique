// src/types/parametres.types.ts
// ─── Account Settings ─────────────────────────────────────────────────────────

export interface AccountSettings {
  email: string;
  twoFactorEnabled: boolean;
}

// ─── Privacy Settings ─────────────────────────────────────────────────────────

export interface PrivacySettings {
  profileVisible: boolean;
  hideLastName: boolean;
  hidePhoto: boolean;
  hideContactInfo: boolean;
}

// ─── Recent Access ────────────────────────────────────────────────────────────

export interface RecentAccess {
  id: string;
  companyName: string;
  accessedAt: string; // ISO
}

// ─── Notification Preferences ────────────────────────────────────────────────

export interface NotificationPrefs {
  newsletter: boolean;
  serviceAlerts: boolean; // required — non-togglable
}

// ─── Social Integrations ─────────────────────────────────────────────────────

export interface SocialIntegrations {
  linkedinConnected: boolean;
  linkedinEmail?: string;
}

// ─── Full Settings Response ───────────────────────────────────────────────────

export interface CandidatSettings {
  account: AccountSettings;
  privacy: PrivacySettings;
  recentAccess: RecentAccess[];
  notifications: NotificationPrefs;
  socials: SocialIntegrations;
}

// ─── Password form ────────────────────────────────────────────────────────────

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ─── Password strength ───────────────────────────────────────────────────────

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export const STRENGTH_LABELS: Record<PasswordStrength, string> = {
  0: '',
  1: 'Très faible',
  2: 'Faible',
  3: 'Moyen',
  4: 'Fort',
};

export const STRENGTH_COLORS: Record<PasswordStrength, string> = {
  0: '',
  1: 'bg-red-400',
  2: 'bg-orange-400',
  3: 'bg-yellow-400',
  4: 'bg-green-500',
};