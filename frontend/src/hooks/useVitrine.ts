// src/hooks/useVitrine.ts
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchVitrine } from '@/services/vitrine.service';
import { useRecruteurContext } from '@/context/RecruteurContext';
import type { VitrineData } from '@/types/vitrine.types';

function makeEmptyVitrine(etablissementId = ''): VitrineData {
  return {
    id:              '',
    etablissementId,
    companyName:     '',
    logoUrl:         undefined,
    bannerUrl:       undefined,
    slogan:          '',
    kpis:            [],
    location:        '',
    sector:          '',
    aboutUs:         '',
    values:          [],
    perks:           [],
    photos:          [],
    videos:          [],
    socials:         { linkedin: '', instagram: '', facebook: '', website: '' },
    // NOUVEAU
    phone:           '',
    email:           '',
    certifications:  [],
    moments:         [],
  };
}

interface UseVitrineReturn {
  vitrine: VitrineData | null;
  loading: boolean;
  setVitrine: React.Dispatch<React.SetStateAction<VitrineData | null>>;
  refetch: () => void;
}

export function useVitrine(): UseVitrineReturn {
  const { profile } = useRecruteurContext();

  const [vitrine, setVitrine] = useState<VitrineData | null>(null);
  const [loading, setLoading] = useState(true);

  const activeEtabRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (profile?.activeEtablissementId) {
      activeEtabRef.current = profile.activeEtablissementId;
    }
  }, [profile?.activeEtablissementId]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchVitrine(activeEtabRef.current);
      setVitrine(data);
    } catch {
      setVitrine(makeEmptyVitrine(activeEtabRef.current));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profile !== null) {
      if (profile.activeEtablissementId) {
        activeEtabRef.current = profile.activeEtablissementId;
      }
      load();
    }
  }, [profile?.activeEtablissementId, load]);

  return { vitrine, loading, setVitrine, refetch: load };
}
