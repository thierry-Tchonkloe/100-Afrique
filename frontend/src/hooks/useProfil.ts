// src/hooks/useProfil.ts
'use client';

import { useState, useEffect } from 'react';
import { useApiResource } from './useApiResource';
import { fetchProfil } from '@/services/profil.service';
import type { CandidatProfil, LanguageLevel, AvailabilityOption } from '@/types/profil.types';

const DEV_MOCK: CandidatProfil = {
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
  formations: [{ id: 'form-001', diploma: 'BTS Tourisme', school: 'Lycée Paul Augier', year: '2018' }],
  hardSkills: ['PMS Opera', 'Booking.com'],
  softSkills: ["Sens du service", "Esprit d'équipe"],
  languages: [
    { id: 'l1', name: 'Français', level: 'Natif' as LanguageLevel },
    { id: 'l2', name: 'Anglais', level: 'B2' as LanguageLevel },
  ],
  cvFile: { name: 'CV_Marie_Dubois.pdf', updatedAt: '15 janvier 2024' },
  isVisible: true,
  availability: 'immediate' as AvailabilityOption,
  profileStrength: 65,
};

export function useProfil() {
  const resource = useApiResource<CandidatProfil>({ fetcher: fetchProfil, devFallback: DEV_MOCK });

  // La page profil édite localement (Identité, Expériences, ...) avant
  // sauvegarde section par section — elle a besoin d'un objet TOUJOURS
  // défini. On sépare donc "donnée réseau" (peut être null pendant le
  // chargement ou en cas d'erreur) et "état éditable local", synchronisé
  // uniquement quand le chargement réussit réellement.
  const [localProfil, setLocalProfil] = useState<CandidatProfil>(DEV_MOCK);

  useEffect(() => {
    if (resource.data) setLocalProfil(resource.data);
  }, [resource.data]);

  return {
    profil: localProfil,
    loading: resource.loading,
    error: resource.error,
    setProfil: setLocalProfil,
    refetch: resource.refetch,
  };
}
