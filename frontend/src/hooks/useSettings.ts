// src/hooks/useSettings.ts
'use client';

import { useApiResource } from './useApiResource';
import { fetchSettings } from '@/services/parametres.service';
import type { CandidatSettings } from '@/types/parametres.types';

const DEV_MOCK: CandidatSettings = {
  account: { email: 'marie.dubois@email.com', twoFactorEnabled: false },
  privacy: { profileVisible: true, hideLastName: false, hidePhoto: false, hideContactInfo: false },
  recentAccess: [
    { id: 'r1', companyName: 'Hôtel Le Grand Paris', accessedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 'r2', companyName: 'Restaurant Le Gourmet', accessedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  ],
  notifications: { newsletter: true, serviceAlerts: true },
  socials: { linkedinConnected: false },
};

export function useSettings() {
  const { data, loading, error, setData, refetch } = useApiResource<CandidatSettings>({
    fetcher: fetchSettings,
    devFallback: DEV_MOCK,
  });

  return { settings: data, loading, error, setSettings: setData, refetch };
}
