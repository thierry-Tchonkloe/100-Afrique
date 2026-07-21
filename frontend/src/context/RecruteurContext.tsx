// src/context/RecruteurContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { fetchRecruteurProfile, switchEtablissement } from '@/services/recruteur.service';
import { clearAuth, getAuthToken, getAuthUser } from '@/services/emploi-auth.service';
import type { RecruteurProfile } from '@/types/recruteur.types';

// ── Le MOCK ne sert QUE si l'API est totalement inaccessible en dev, ET
// qu'un token RECRUITER existe déjà (donc pas un simple visiteur). En
// production, si l'API échoue, `profile` reste null et on redirige.
const IS_DEV = process.env.NODE_ENV === 'development';

const DEV_MOCK_PROFILE: RecruteurProfile = {
  id: 'rec-dev',
  firstName: '[Dev]',
  lastName: 'Mode',
  email: 'dev@localhost',
  role: 'RECRUITER',
  etablissements: [
    { id: 'etab-dev', name: 'Établissement dev', sector: 'Hôtellerie', city: 'Local' },
  ],
  activeEtablissementId: 'etab-dev',
};

// ── Context type ──────────────────────────────────────────────────────────────
interface RecruteurContextValue {
  profile: RecruteurProfile | null;
  newCandidaturesCount: number;
  setNewCandidaturesCount: (n: number) => void;
  switchEtab: (id: string) => void;
  loading: boolean;
}

const RecruteurContext = createContext<RecruteurContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function RecruteurContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [profile,               setProfile]               = useState<RecruteurProfile | null>(null);
  const [newCandidaturesCount,  setNewCandidaturesCount]  = useState(0);
  const [loading,               setLoading]               = useState(true);

  useEffect(() => {
    let cancelled = false;

    function redirectToAuth() {
      clearAuth();
      const current = typeof window !== 'undefined' ? window.location.pathname : '/recruteur/dashboard';
      router.replace(`/auth?redirect=${encodeURIComponent(current)}`);
    }

    async function load() {
      // ── FIX SÉCURITÉ : double vérification côté client, en complément du
      // middleware serveur (src/middleware.ts). Le middleware protège déjà
      // la navigation initiale, mais ce garde-fou couvre les cas où il
      // serait contourné (cookies désactivés, certaines navigations client)
      // et évite un appel API inutile si l'on sait déjà qu'il n'y a pas de
      // session recruteur valide.
      const token = getAuthToken();
      const user  = getAuthUser();
      if (!token || !user || user.role !== 'RECRUITER') {
        redirectToAuth();
        return;
      }

      setLoading(true);
      try {
        // Charge le vrai profil du recruteur connecté depuis /api/emploi/recruteur/profile
        const data = await fetchRecruteurProfile();
        if (!cancelled) setProfile(data);
      } catch (err: any) {
        if (cancelled) return;

        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          // Token invalide, expiré, ou rôle refusé côté backend → déconnexion
          // forcée et retour à l'écran de connexion.
          redirectToAuth();
          return;
        }

        if (IS_DEV) {
          // En dev uniquement, et seulement si un token RECRUITER existe
          // déjà (donc pas un simple visiteur non connecté) : fallback
          // visible "[Dev] Mode" pour ne pas bloquer le travail en local si
          // l'API backend n'est pas démarrée.
          console.warn('[RecruteurContext] API inaccessible — mode dev actif', err);
          setProfile(DEV_MOCK_PROFILE);
        }
        // En production, pour une erreur réseau (pas 401/403) : on laisse
        // profile = null → le layout affiche un loader, jamais de fausses
        // données ni le contenu recruteur.
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // charge une seule fois au montage

  const switchEtab = useCallback(async (id: string) => {
    // Mise à jour optimiste locale
    setProfile((prev) => prev ? { ...prev, activeEtablissementId: id } : prev);
    try {
      await switchEtablissement(id);
    } catch {
      // Rollback si l'API échoue (optionnel : recharger le profil)
      console.error('[RecruteurContext] switchEtab failed');
    }
  }, []);

  return (
    <RecruteurContext.Provider
      value={{
        profile,
        newCandidaturesCount,
        setNewCandidaturesCount,
        switchEtab,
        loading,
      }}
    >
      {children}
    </RecruteurContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useRecruteurContext(): RecruteurContextValue {
  const ctx = useContext(RecruteurContext);
  if (!ctx) throw new Error('useRecruteurContext must be used within RecruteurContextProvider');
  return ctx;
}
