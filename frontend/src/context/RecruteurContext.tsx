// src/context/RecruteurContext.tsx
'use client';
// src/context/RecruteurContext.tsx

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import axios from 'axios';
import type { RecruteurProfile } from '@/types/recruteur.types';
import { switchEtablissement } from '@/services/recruteur.service';

// ── Mock profile (used when API not available) ────────────────────────────────
const MOCK_PROFILE: RecruteurProfile = {
  id: 'rec-001',
  firstName: 'Marie',
  lastName: 'Dubois',
  email: 'marie.dubois@grandhotel.fr',
  role: 'RECRUITER',
  etablissements: [
    { id: 'etab-001', name: 'Grand Hôtel de Paris',   sector: 'Hôtellerie',  city: 'Paris' },
    { id: 'etab-002', name: "Spa Resort Côte d'Azur", sector: 'Bien-être',   city: 'Nice'  },
  ],
  activeEtablissementId: 'etab-001',
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
  const [profile, setProfile] = useState<RecruteurProfile | null>(null);
  const [newCandidaturesCount, setNewCandidaturesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const base  = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
        const token = typeof window !== 'undefined' ? localStorage.getItem('emploi_token') : null;
        const { data } = await axios.get<RecruteurProfile>(
          `${base}/emploi/recruteur/profile`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        setProfile(data);
      } catch {
        setProfile(MOCK_PROFILE);
        setNewCandidaturesCount(5);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const switchEtab = useCallback(async (id: string) => {
    setProfile((prev) => prev ? { ...prev, activeEtablissementId: id } : prev);
    try { await switchEtablissement(id); } catch {}
  }, []);

  return (
    <RecruteurContext.Provider value={{
      profile,
      newCandidaturesCount,
      setNewCandidaturesCount,
      switchEtab,
      loading,
    }}>
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