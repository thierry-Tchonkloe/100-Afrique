// src/hooks/useCandidatAuthGuard.ts
// Vérification client de session CANDIDAT (en complément du middleware
// serveur), utilisée par le layout /candidat/*.

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth, getAuthToken, getAuthUser } from '@/services/emploi-auth.service';

export function useCandidatAuthGuard() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    const user = getAuthUser();

    if (!token || !user || user.role !== 'CANDIDAT') {
      clearAuth();
      const current = typeof window !== 'undefined' ? window.location.pathname : '/candidat/dashboard';
      router.replace(`/auth?redirect=${encodeURIComponent(current)}`);
      return;
    }

    setAuthorized(true);
    setAuthChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { authChecked, authorized };
}
