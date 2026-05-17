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
import { fetchRecruteurProfile, switchEtablissement } from '@/services/recruteur.service';
import type { RecruteurProfile } from '@/types/recruteur.types';

// ── Le MOCK ne sert QUE si l'API est totalement inaccessible en dev.
// En production, si l'API échoue, `profile` reste null et le loading spinner
// est maintenu — on n'affiche jamais un faux nom.
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
  const [profile,               setProfile]               = useState<RecruteurProfile | null>(null);
  const [newCandidaturesCount,  setNewCandidaturesCount]  = useState(0);
  const [loading,               setLoading]               = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        // Charge le vrai profil du recruteur connecté depuis /api/emploi/recruteur/profile
        const data = await fetchRecruteurProfile();
        if (!cancelled) setProfile(data);
      } catch (err) {
        if (!cancelled) {
          if (IS_DEV) {
            // En dev uniquement : fallback visible "[Dev] Mode" pour ne pas bloquer l'UI
            console.warn('[RecruteurContext] API inaccessible — mode dev actif', err);
            setProfile(DEV_MOCK_PROFILE);
          }
          // En production : on laisse profile = null → les pages affichent un loader
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
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

















// // src/context/RecruteurContext.tsx
// 'use client';
// // src/context/RecruteurContext.tsx

// import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
// import axios from 'axios';
// import type { RecruteurProfile } from '@/types/recruteur.types';
// import { switchEtablissement } from '@/services/recruteur.service';

// // ── Mock profile (used when API not available) ────────────────────────────────
// const MOCK_PROFILE: RecruteurProfile = {
//   id: 'rec-001',
//   firstName: 'Marie',
//   lastName: 'Dubois',
//   email: 'marie.dubois@grandhotel.fr',
//   role: 'RECRUITER',
//   etablissements: [
//     { id: 'etab-001', name: 'Grand Hôtel de Paris',   sector: 'Hôtellerie',  city: 'Paris' },
//     { id: 'etab-002', name: "Spa Resort Côte d'Azur", sector: 'Bien-être',   city: 'Nice'  },
//   ],
//   activeEtablissementId: 'etab-001',
// };

// // ── Context type ──────────────────────────────────────────────────────────────
// interface RecruteurContextValue {
//   profile: RecruteurProfile | null;
//   newCandidaturesCount: number;
//   setNewCandidaturesCount: (n: number) => void;
//   switchEtab: (id: string) => void;
//   loading: boolean;
// }

// const RecruteurContext = createContext<RecruteurContextValue | null>(null);

// // ── Provider ──────────────────────────────────────────────────────────────────
// export function RecruteurContextProvider({ children }: { children: ReactNode }) {
//   const [profile, setProfile] = useState<RecruteurProfile | null>(null);
//   const [newCandidaturesCount, setNewCandidaturesCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       try {
//         const base  = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
//         const token = typeof window !== 'undefined' ? localStorage.getItem('emploi_token') : null;
//         const { data } = await axios.get<RecruteurProfile>(
//           `${base}/emploi/recruteur/profile`,
//           { headers: token ? { Authorization: `Bearer ${token}` } : {} }
//         );
//         setProfile(data);
//       } catch {
//         setProfile(MOCK_PROFILE);
//         setNewCandidaturesCount(5);
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, []);

//   const switchEtab = useCallback(async (id: string) => {
//     setProfile((prev) => prev ? { ...prev, activeEtablissementId: id } : prev);
//     try { await switchEtablissement(id); } catch {}
//   }, []);

//   return (
//     <RecruteurContext.Provider value={{
//       profile,
//       newCandidaturesCount,
//       setNewCandidaturesCount,
//       switchEtab,
//       loading,
//     }}>
//       {children}
//     </RecruteurContext.Provider>
//   );
// }

// // ── Hook ──────────────────────────────────────────────────────────────────────
// export function useRecruteurContext(): RecruteurContextValue {
//   const ctx = useContext(RecruteurContext);
//   if (!ctx) throw new Error('useRecruteurContext must be used within RecruteurContextProvider');
//   return ctx;
// }