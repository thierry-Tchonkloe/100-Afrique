// src/hooks/useProfil.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { CandidatProfil, LanguageLevel, AvailabilityOption } from '@/types/profil.types';

const MOCK_PROFIL: CandidatProfil = {
  id: 'cand-001',
  firstName: 'Marie',
  lastName: 'Dubois',
  avatar: undefined,
  headline: "Réceptionniste bilingue - 5 ans d'expérience",
  city: 'Nice',
  mobility: "Côte d'Azur",
  bio: "Passionnée par l'accueil et le service client.",
  experiences: [
    {
      id: 'exp-001',
      jobTitle: 'Réceptionniste Senior',
      companyName: 'Hôtel Negresco',
      location: 'Nice',
      startDate: '2020-03',
      endDate: undefined,
      contractType: 'CDI',
      missions: ['Accueil et enregistrement des clients VIP', 'Gestion des réservations'],
    },
  ],
  formations: [
    { id: 'form-001', diploma: 'BTS Tourisme', school: 'Lycée Paul Augier', year: '2018' },
  ],
  hardSkills: ['PMS Opera', 'Booking.com'],
  softSkills: ["Sens du service", "Esprit d'équipe"],
  languages: [
    { id: 'l1', name: 'Français', level: 'Natif' as LanguageLevel },
    { id: 'l2', name: 'Anglais',  level: 'B2'    as LanguageLevel },
  ],
  cvFile: { name: 'CV_Marie_Dubois.pdf', updatedAt: '15 janvier 2024' },
  isVisible: true,
  availability: 'immediate' as AvailabilityOption,
  profileStrength: 65,
};

export function useProfil() {
  // ← Initialisé avec MOCK_PROFIL, jamais null
  const [profil, setProfil]   = useState<CandidatProfil>(MOCK_PROFIL);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const base  = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
      const token = typeof window !== 'undefined' ? localStorage.getItem('emploi_token') : null;

      const { data } = await axios.get<{ success: boolean; data: CandidatProfil }>(
        `${base}/emploi/candidat/profil`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      // L'API retourne { success, data } — unwrap
      const p = data.data ?? data as unknown as CandidatProfil;

      setProfil({
        ...MOCK_PROFIL, // base de sécurité si l'API renvoie des champs manquants
        ...p,
        firstName:    p.firstName    || MOCK_PROFIL.firstName,
        lastName:     p.lastName     || MOCK_PROFIL.lastName,
        availability: (p.availability ?? 'immediate') as AvailabilityOption,
        languages:    (p.languages   ?? []).map((l) => ({ ...l, level: l.level as LanguageLevel })),
        experiences:  p.experiences  ?? [],
        formations:   p.formations   ?? [],
        hardSkills:   p.hardSkills   ?? [],
        softSkills:   p.softSkills   ?? [],
      });
    } catch {
      setProfil(MOCK_PROFIL);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { profil, loading, setProfil, refetch: load };
}
