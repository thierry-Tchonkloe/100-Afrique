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





















// // src/hooks/useProfil.ts
// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import type { CandidatProfil, LanguageLevel, AvailabilityOption } from '@/types/profil.types';

// const MOCK_PROFIL: CandidatProfil = {
//   id: 'cand-001', firstName: 'Marie', lastName: 'Dubois', avatar: undefined,
//   headline: "Réceptionniste bilingue - 5 ans d'expérience",
//   city: 'Nice', mobility: "Côte d'Azur",
//   bio: "Passionnée par l'accueil et le service client.",
//   experiences: [], formations: [],
//   hardSkills: ['PMS Opera', 'Booking.com'],
//   softSkills: ["Sens du service", "Esprit d'équipe"],
//   languages: [
//     { id: 'l1', name: 'Français', level: 'Natif' as LanguageLevel },
//     { id: 'l2', name: 'Anglais',  level: 'B2'    as LanguageLevel },
//   ],
//   cvFile: { name: 'CV_Marie_Dubois.pdf', updatedAt: '15 janvier 2024' },
//   isVisible: true, availability: 'immediate' as AvailabilityOption, profileStrength: 65,
// };

// // ← Retourne CandidatProfil (jamais null) grâce à l'initialisation avec MOCK_PROFIL
// export function useProfil() {
//   const [profil, setProfil] = useState<CandidatProfil>(MOCK_PROFIL); // ← pas null
//   const [loading, setLoading] = useState(true);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const base  = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
//       const token = typeof window !== 'undefined' ? localStorage.getItem('emploi_token') : null;
//       const { data } = await axios.get<CandidatProfil>(
//         `${base}/emploi/candidat/profil`,
//         { headers: token ? { Authorization: `Bearer ${token}` } : {} }
//       );
//       setProfil({
//         ...data,
//         availability: (data.availability ?? 'immediate') as AvailabilityOption,
//         languages:    (data.languages  ?? []).map((l) => ({ ...l, level: l.level as LanguageLevel })),
//         experiences:  data.experiences ?? [],
//         formations:   data.formations  ?? [],
//         hardSkills:   data.hardSkills  ?? [],
//         softSkills:   data.softSkills  ?? [],
//       });
//     } catch { setProfil(MOCK_PROFIL); }
//     finally  { setLoading(false); }
//   }, []);

//   useEffect(() => { load(); }, [load]);
//   return { profil, loading, setProfil, refetch: load };
// }















// // src/hooks/useProfil.ts
// 'use client';
// // ─────────────────────────────────────────────────────────────────────────────
// // Ce hook remplace toutes les versions précédentes.
// // Il utilise désormais CandidatProfil (type complet) au lieu de
// // CandidatProfilBasic — ce qui corrige les erreurs :
// //   • "CandidatProfilBasic is missing experiences, formations"
// //   • "string not assignable to LanguageLevel"
// //   • "string not assignable to AvailabilityOption"
// // ─────────────────────────────────────────────────────────────────────────────

// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import type { CandidatProfil, LanguageLevel, AvailabilityOption } from '@/types/profil.types';

// // ── Mock complet (même type que CandidatProfil) ───────────────────────────────

// const MOCK_PROFIL: CandidatProfil = {
//   id: 'cand-001',
//   firstName: 'Marie',
//   lastName: 'Dubois',
//   avatar: undefined,
//   headline: "Réceptionniste bilingue - 5 ans d'expérience",
//   city: 'Nice',
//   mobility: "Côte d'Azur",
//   bio: "Passionnée par l'accueil et le service client, je mets mon expertise au service des établissements hôteliers pour garantir une expérience mémorable aux clients.",
//   // ↓ propriétés manquantes dans l'ancien CandidatProfilBasic
//   experiences: [
//     {
//       id: 'exp-001',
//       jobTitle: 'Réceptionniste Senior',
//       companyName: 'Hôtel Negresco',
//       location: 'Nice',
//       startDate: '2020-03',
//       endDate: undefined,
//       contractType: 'CDI',
//       missions: [
//         'Accueil et enregistrement des clients VIP',
//         'Gestion des réservations et du planning',
//         'Coordination avec les services de conciergerie',
//       ],
//     },
//     {
//       id: 'exp-002',
//       jobTitle: 'Réceptionniste',
//       companyName: 'Best Western Villa Victoria',
//       location: 'Nice',
//       startDate: '2018-06',
//       endDate: '2020-02',
//       contractType: 'CDI',
//       missions: [
//         'Accueil multilingue de la clientèle internationale',
//         'Gestion des check-in/check-out',
//         'Traitement des réclamations clients',
//       ],
//     },
//   ],
//   formations: [
//     {
//       id: 'form-001',
//       diploma: 'BTS Tourisme',
//       school: 'Lycée Technique Paul Augier',
//       year: '2018',
//     },
//   ],
//   hardSkills: ['PMS Opera', 'Booking.com', 'Expedia Partner Central'],
//   softSkills: ["Sens du service", "Esprit d'équipe", 'Rigueur', 'Adaptabilité'],
//   // ↓ level est typé LanguageLevel (pas string) — corrige l'erreur 3
//   languages: [
//     { id: 'lang-001', name: 'Français', level: 'Natif' as LanguageLevel },
//     { id: 'lang-002', name: 'Anglais',  level: 'B2'    as LanguageLevel },
//     { id: 'lang-003', name: 'Italien',  level: 'A2'    as LanguageLevel },
//   ],
//   cvFile: { name: 'CV_Marie_Dubois.pdf', updatedAt: '15 janvier 2024' },
//   isVisible: true,
//   // ↓ typé AvailabilityOption (pas string) — corrige l'erreur 4
//   availability: 'immediate' as AvailabilityOption,
//   profileStrength: 65,
// };

// // ── Hook ──────────────────────────────────────────────────────────────────────

// interface UseProfilReturn {
//   profil: CandidatProfil | null;
//   loading: boolean;
//   setProfil: React.Dispatch<React.SetStateAction<CandidatProfil | null>>;
//   refetch: () => void;
// }

// export function useProfil(): UseProfilReturn {
//   const [profil, setProfil] = useState<CandidatProfil | null>(null);
//   const [loading, setLoading] = useState(true);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const base  = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
//       const token = typeof window !== 'undefined'
//         ? localStorage.getItem('emploi_token')
//         : null;

//       const { data } = await axios.get<CandidatProfil>(
//         `${base}/emploi/candidat/profil`,
//         { headers: token ? { Authorization: `Bearer ${token}` } : {} }
//       );

//       // Normalise les champs enum renvoyés par l'API (parfois en string brut)
//       const normalized: CandidatProfil = {
//         ...data,
//         availability: (data.availability ?? 'immediate') as AvailabilityOption,
//         languages: (data.languages ?? []).map((l) => ({
//           ...l,
//           level: l.level as LanguageLevel,
//         })),
//         experiences: data.experiences ?? [],
//         formations:  data.formations  ?? [],
//         hardSkills:  data.hardSkills  ?? [],
//         softSkills:  data.softSkills  ?? [],
//       };
//       setProfil(normalized);
//     } catch {
//       // API indisponible → données mock (même shape que CandidatProfil)
//       setProfil(MOCK_PROFIL);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   return { profil, loading, setProfil, refetch: load };
// }




















// // src/hooks/useProfil.ts
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';

// // ── Inline types (avoids cross-module dep issues if types file differs) ────────

// export interface CandidatProfilBasic {
//   id: string;
//   firstName: string;
//   lastName: string;
//   avatar?: string;
//   headline: string;
//   city: string;
//   mobility: string;
//   bio: string;
//   hardSkills: string[];
//   softSkills: string[];
//   languages: { id: string; name: string; level: string }[];
//   cvFile?: { name: string; updatedAt: string };
//   isVisible: boolean;
//   availability: string;
//   profileStrength: number;
// }

// const MOCK: CandidatProfilBasic = {
//   id: 'cand-001',
//   firstName: 'Marie',
//   lastName: 'Dubois',
//   headline: "Réceptionniste bilingue - 5 ans d'expérience",
//   city: 'Nice',
//   mobility: "Côte d'Azur",
//   bio: "Passionnée par l'accueil et le service client.",
//   hardSkills: ['PMS Opera', 'Booking.com', 'Expedia Partner Central'],
//   softSkills: ["Sens du service", "Esprit d'équipe", 'Rigueur', 'Adaptabilité'],
//   languages: [
//     { id: 'lang-001', name: 'Français', level: 'Natif' },
//     { id: 'lang-002', name: 'Anglais', level: 'B2' },
//     { id: 'lang-003', name: 'Italien', level: 'A2' },
//   ],
//   cvFile: { name: 'CV_Marie_Dubois.pdf', updatedAt: '15 janvier 2024' },
//   isVisible: true,
//   availability: 'immediate',
//   profileStrength: 65,
// };

// interface UseProfilReturn {
//   profil: CandidatProfilBasic | null;
//   loading: boolean;
//   setProfil: React.Dispatch<React.SetStateAction<CandidatProfilBasic | null>>;
//   refetch: () => void;
// }

// export function useProfil(): UseProfilReturn {
//   const [profil, setProfil] = useState<CandidatProfilBasic | null>(null);
//   const [loading, setLoading] = useState(true);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
//       const token = typeof window !== 'undefined' ? localStorage.getItem('emploi_token') : null;
//       const { data } = await axios.get(`${base}/emploi/candidat/profil`, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       setProfil(data);
//     } catch {
//       setProfil(MOCK);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   return { profil, loading, setProfil, refetch: load };
// }