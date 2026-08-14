// src/types/emploi/settings.types.ts

export interface UpdateEmailInput {
  email: string;
  currentPassword: string;
}

export interface UpdatePrivacyInput {
  profileVisible?: boolean;
  hideLastName?: boolean;
  hidePhoto?: boolean;
  hideContactInfo?: boolean;
}

export interface UpdateNotificationsInput {
  newsletter?: boolean;
}

export interface UpdateTwoFactorInput {
  enabled: boolean;
}

export interface DeleteAccountInput {
  password: string;
}

export interface SettingsOutput {
  account: { email: string; twoFactorEnabled: boolean };
  privacy: {
    profileVisible: boolean;
    hideLastName: boolean;
    hidePhoto: boolean;
    hideContactInfo: boolean;
  };
  recentAccess: { id: string; companyName: string; accessedAt: string }[];
  notifications: { newsletter: boolean; serviceAlerts: boolean };
  socials: { linkedinConnected: boolean; linkedinEmail?: string };
}
