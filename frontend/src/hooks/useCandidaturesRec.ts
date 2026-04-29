'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchCandidaturesRec } from '@/services/candidatures-rec.service';
import type { CandidaturesRecResponse } from '@/types/candidatures-rec.types';

const MOCK: CandidaturesRecResponse = {
  stats: { new: 12, in_progress: 8, interview: 5, favorite: 3, refused: 15 },
  offers: [
    { id: 'o1', title: 'Réceptionniste H/F' },
    { id: 'o2', title: 'Chef de Cuisine' },
    { id: 'o3', title: 'Concierge de Luxe H/F' },
    { id: 'o4', title: 'Barman/Barmaid' },
  ],
  candidatures: [
    {
      id: 'c-001',
      candidatName: 'Sophie Martin',
      candidatTitle: 'Réceptionniste Expérimentée',
      matchScore: 95,
      offerId: 'o1',
      offerTitle: 'Réceptionniste H/F',
      receivedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      status: 'new',
      isRead: false,
      isFavorite: false,
      experiences: [
        { jobTitle: 'Réceptionniste Senior', company: 'Hôtel Le Bristol', period: '2021-2024', description: 'Gestion de la réception, accueil VIP, Opera PMS' },
        { jobTitle: 'Réceptionniste', company: 'Ibis Styles', period: '2019-2021', description: 'Check-in/out, réservations, service client' },
      ],
      formations: [{ diploma: 'BTS Tourisme', school: 'Lycée Jean Monnet', year: '2019' }],
      skills: ['Opera PMS', 'Anglais fluent', 'Espagnol', 'Accueil VIP', 'Amadeus'],
      location: 'Paris 8ème',
      mobility: 'Île-de-France',
      availability: 'Immédiate',
      salarySought: '2800€ brut/mois',
      recruiterNotes: '',
    },
    {
      id: 'c-002',
      candidatName: 'Thomas Dupont',
      candidatTitle: 'Chef de Cuisine',
      matchScore: 88,
      offerId: 'o2',
      offerTitle: 'Chef de cuisine',
      receivedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      status: 'in_progress',
      isRead: true,
      isFavorite: false,
      experiences: [
        { jobTitle: 'Chef de Partie', company: 'Restaurant La Tour', period: '2020-2024', description: 'Cuisine gastronomique française' },
      ],
      formations: [{ diploma: 'CAP Cuisine', school: 'CFA Paul Bocuse', year: '2018' }],
      skills: ['HACCP', 'Cuisine française', 'Pâtisserie', 'Gestion des stocks'],
      location: 'Lyon',
      mobility: 'Auvergne-Rhône-Alpes',
      availability: '1 mois',
      salarySought: '2500€ brut/mois',
      recruiterNotes: '',
    },
    {
      id: 'c-003',
      candidatName: 'Emma Leroy',
      candidatTitle: 'Serveuse Polyglotte',
      matchScore: 82,
      offerId: 'o2',
      offerTitle: 'Chef de cuisine',
      receivedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
      status: 'in_progress',
      isRead: true,
      isFavorite: true,
      experiences: [
        { jobTitle: 'Serveuse', company: 'Brasserie du Palais', period: '2021-2024', description: 'Service en salle, gestion des tables' },
      ],
      formations: [{ diploma: 'Bac Pro Restauration', school: 'Lycée Hôtelier', year: '2020' }],
      skills: ['Anglais C1', 'Italien', 'Service VIP', 'Caisse'],
      location: 'Paris',
      mobility: 'Paris + 30km',
      availability: 'Immédiate',
      recruiterNotes: '',
    },
    {
      id: 'c-004',
      candidatName: 'Lucas Bernard',
      candidatTitle: 'Concierge Bilingue',
      matchScore: 76,
      offerId: 'o3',
      offerTitle: 'Concierge de Luxe H/F',
      receivedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      status: 'interview',
      isRead: true,
      isFavorite: false,
      experiences: [
        { jobTitle: 'Concierge', company: 'Hôtel George V', period: '2019-2024', description: 'Accueil clientèle internationale, réservations' },
      ],
      formations: [{ diploma: 'Licence Tourisme', school: 'Paris 1', year: '2019' }],
      skills: ['Anglais', 'Mandarin', 'Opera', 'Concierge clefs d\'or'],
      location: 'Paris',
      mobility: 'Paris',
      availability: '3 mois',
      recruiterNotes: '',
    },
  ],
};

interface UseCandidaturesRecReturn {
  data: CandidaturesRecResponse | null;
  loading: boolean;
  setData: React.Dispatch<React.SetStateAction<CandidaturesRecResponse | null>>;
  refetch: () => void;
}

export function useCandidaturesRec(): UseCandidaturesRecReturn {
  const [data, setData]       = useState<CandidaturesRecResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchCandidaturesRec();
      setData(result);
    } catch {
      setData(MOCK);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { data, loading, setData, refetch: load };
}