// src/hooks/useVitrine.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchVitrine } from '@/services/vitrine.service';
import type { VitrineData } from '@/types/vitrine.types';

const MOCK_VITRINE: VitrineData = {
  id: 'vit-001',
  etablissementId: 'etab-001',
  logoUrl: undefined,
  bannerUrl: undefined,
  slogan: '',
  kpis: [
    { id: 'k1', icon: 'users',    value: '150',   label: 'Collaborateurs'    },
    { id: 'k2', icon: 'calendar', value: '25',    label: "Années d'expérience" },
    { id: 'k3', icon: 'star',     value: '4.8/5', label: 'Satisfaction clients' },
  ],
  location: 'Paris, France',
  sector: 'Hôtellerie de luxe',
  aboutUs: '',
  values: [
    { id: 'v1', title: 'Excellence',  description: "Nous visons l'excellence dans chaque détail de nos services pour offrir une expérience inoubliable à nos clients." },
    { id: 'v2', title: 'Durabilité',  description: "Engagés pour l'environnement, nous adoptons des pratiques responsables et durables." },
    { id: 'v3', title: 'Innovation',  description: 'Nous encourageons la créativité et l\'innovation pour rester à la pointe du secteur.' },
  ],
  perks: ['Télétravail', 'Mutuelle', 'Tickets Restaurant', 'Formation continue', 'Horaires flexibles'],
  photos: [
    { id: 'p1', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80', alt: 'Lobby hôtel' },
    { id: 'p2', url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80', alt: 'Restaurant' },
    { id: 'p3', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80', alt: 'Cuisine' },
  ],
  videos: [
    { id: 'vid1', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Visite de notre établissement' },
  ],
  socials: {
    linkedin: '',
    instagram: '',
    facebook: '',
    website: '',
  },
};

interface UseVitrineReturn {
  vitrine: VitrineData | null;
  loading: boolean;
  setVitrine: React.Dispatch<React.SetStateAction<VitrineData | null>>;
  refetch: () => void;
}

export function useVitrine(): UseVitrineReturn {
  const [vitrine, setVitrine] = useState<VitrineData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchVitrine();
      setVitrine(data);
    } catch {
      setVitrine(MOCK_VITRINE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { vitrine, loading, setVitrine, refetch: load };
}