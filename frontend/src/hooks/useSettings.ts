// src/hooks/useSettings.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { fetchSettings } from '@/services/parametres.service';
import type { CandidatSettings } from '@/types/parametres.types';

const MOCK: CandidatSettings = {
  account:      { email: 'marie.dubois@email.com', twoFactorEnabled: false },
  privacy:      { profileVisible: true, hideLastName: false, hidePhoto: false, hideContactInfo: false },
  recentAccess: [
    { id: 'r1', companyName: 'Hôtel Le Grand Paris',  accessedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 'r2', companyName: 'Restaurant Le Gourmet', accessedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  ],
  notifications: { newsletter: true, serviceAlerts: true },
  socials:       { linkedinConnected: false },
};

export function useSettings() {
  const [settings, setSettings] = useState<CandidatSettings>(MOCK); // ← pas null
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try   { setSettings(await fetchSettings()); }
    catch { setSettings(MOCK); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { settings, loading, setSettings, refetch: load };
}




















// // src/hooks/useSettings.ts
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { fetchSettings } from '../services/parametres.service';
// import type { CandidatSettings } from '../types/parametres.types';

// const MOCK_SETTINGS: CandidatSettings = {
//   account: {
//     email: 'sophie.martin@email.com',
//     twoFactorEnabled: false,
//   },
//   privacy: {
//     profileVisible: true,
//     hideLastName: false,
//     hidePhoto: false,
//     hideContactInfo: false,
//   },
//   recentAccess: [
//     { id: 'ra-001', companyName: 'Hôtel Le Grand Paris',   accessedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
//     { id: 'ra-002', companyName: 'Restaurant Le Gourmet',  accessedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
//     { id: 'ra-003', companyName: 'Agence TravelPro',       accessedAt: new Date(Date.now() - 7 * 86400000).toISOString() },
//   ],
//   notifications: {
//     newsletter: true,
//     serviceAlerts: true,
//   },
//   socials: {
//     linkedinConnected: false,
//   },
// };

// interface UseSettingsReturn {
//   settings: CandidatSettings | null;
//   loading: boolean;
//   setSettings: React.Dispatch<React.SetStateAction<CandidatSettings | null>>;
//   refetch: () => void;
// }

// export function useSettings(): UseSettingsReturn {
//   const [settings, setSettings] = useState<CandidatSettings | null>(null);
//   const [loading, setLoading] = useState(true);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const data = await fetchSettings();
//       setSettings(data);
//     } catch {
//       setSettings(MOCK_SETTINGS);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { load(); }, [load]);
//   return { settings, loading, setSettings, refetch: load };
// }