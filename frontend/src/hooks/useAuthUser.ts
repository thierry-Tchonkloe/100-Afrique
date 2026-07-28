// src/hooks/useAuthUser.ts
//
// AVANT : `getAuthUser()` / `getAuthToken()` (lecture localStorage) étaient
// redéfinies à l'IDENTIQUE dans emploi/page.tsx, emploi/jobs/page.tsx,
// emploi/jobs/[id]/page.tsx, emploi/metiers/[sector]/page.tsx,
// emploi/conseils/page.tsx et EmploiHeader.tsx — 6 copies. Elles existent
// déjà, correctement, dans services/emploi-auth.service.ts : ce hook les
// réutilise et ajoute la seule vraie logique manquante commune à tous ces
// fichiers — le pattern "hydrated" pour éviter un mismatch SSR/client
// (localStorage n'existe pas côté serveur, donc le premier rendu doit
// rester neutre tant qu'on n'a pas confirmé côté client).

'use client';

import { useState, useEffect } from 'react';
import { getAuthUser, getAuthToken, type AuthUser } from '@/services/emploi-auth.service';

interface UseAuthUserReturn {
  user: AuthUser | null;
  token: string | null;
  /** true une fois que la lecture côté client a eu lieu (évite le flash SSR). */
  hydrated: boolean;
  isCandidat: boolean;
  isRecruiter: boolean;
}

export function useAuthUser(): UseAuthUserReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(getAuthUser());
    setToken(getAuthToken());
    setHydrated(true);
  }, []);

  return {
    user,
    token,
    hydrated,
    isCandidat: hydrated && !!user && !!token && user.role === 'CANDIDAT',
    isRecruiter: hydrated && !!user && !!token && user.role === 'RECRUITER',
  };
}