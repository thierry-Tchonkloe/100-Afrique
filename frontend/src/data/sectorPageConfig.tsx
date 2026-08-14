// src/data/sectorPageConfig.tsx
// Config détaillée pour /emploi/metiers/[sector]. Les 8 clés correspondent
// exactement aux SectorKey de src/lib/sectors.ts.
import {
  Hotel, Utensils, Plane, Briefcase, Monitor, Calendar, Sparkles, PartyPopper,
} from 'lucide-react';
import type { SectorKey } from '@/lib/sectors';

export interface SectorConfig {
  label: string;
  labelPlural: string;
  icon: React.ReactNode;
  iconLg: React.ReactNode;
  color: string;
  colorHex: string;
  bgHex: string;
  banner: string;
  description: string;
  roles: string[];
}

export const SECTORS: Record<SectorKey, SectorConfig> = {
  hotel: {
    label: 'Hôtellerie',
    labelPlural: 'dans l\'Hôtellerie',
    icon: <Hotel size={18} />,
    iconLg: <Hotel size={36} />,
    color: 'text-blue-600 bg-blue-50',
    colorHex: '#2563EB',
    bgHex: '#EFF6FF',
    banner: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80',
    description: 'Réception, direction hôtelière, gouvernance, housekeeping, conciergerie... Découvrez les meilleures opportunités dans l\'univers de l\'hôtellerie.',
    roles: ['Réceptionniste', 'Directeur d\'hôtel', 'Chef de réception', 'Gouvernante', 'Night Auditor', 'Concierge'],
  },
  restaurant: {
    label: 'Restauration',
    labelPlural: 'dans la Restauration',
    icon: <Utensils size={18} />,
    iconLg: <Utensils size={36} />,
    color: 'text-orange-600 bg-orange-50',
    colorHex: '#EA580C',
    bgHex: '#FFF7ED',
    banner: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80',
    description: 'Chef de cuisine, pâtissier, sommelier, maître d\'hôtel, directeur de salle... Rejoignez les meilleures tables et brasseries du secteur.',
    roles: ['Chef de cuisine', 'Chef de partie', 'Pâtissier', 'Sommelier', 'Maître d\'hôtel', 'Barman'],
  },
  transport: {
    label: 'Transport',
    labelPlural: 'dans le Transport',
    icon: <Plane size={18} />,
    iconLg: <Plane size={36} />,
    color: 'text-sky-600 bg-sky-50',
    colorHex: '#0284C7',
    bgHex: '#F0F9FF',
    banner: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80',
    description: 'Pilote, agent d\'escale, hôtesse de l\'air, steward, agent de voyage aérien... Décollez vers une nouvelle carrière dans le transport.',
    roles: ['Agent d\'escale', 'Hôtesse de l\'air / Steward', 'Pilote de ligne', 'Agent de comptoir', 'Chauffeur touristique'],
  },
  travel: {
    label: 'Agence de Voyage',
    labelPlural: 'en Agence de Voyage',
    icon: <Briefcase size={18} />,
    iconLg: <Briefcase size={36} />,
    color: 'text-amber-600 bg-amber-50',
    colorHex: '#D97706',
    bgHex: '#FFFBEB',
    banner: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80',
    description: 'Conseiller voyages, tour-opérateur, guide touristique, chef de produit destination... Faites voyager vos clients et évoluez dans le tourisme.',
    roles: ['Conseiller voyages', 'Chef de produit', 'Guide touristique', 'Billettiste', 'Responsable groupes'],
  },
  tech: {
    label: 'Tech Tourisme',
    labelPlural: 'en Tech Tourisme',
    icon: <Monitor size={18} />,
    iconLg: <Monitor size={36} />,
    color: 'text-green-600 bg-green-50',
    colorHex: '#16A34A',
    bgHex: '#F0FDF4',
    banner: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80',
    description: 'Revenue Manager, Yield Manager, développeur SaaS tourisme, digital marketing, data analyst... La tech au service de l\'hospitality.',
    roles: ['Revenue Manager', 'Yield Manager', 'Digital Marketing Manager', 'Data Analyst', 'Développeur SaaS'],
  },
  events: {
    label: 'MICE & Événementiel',
    labelPlural: 'en MICE & Événementiel',
    icon: <Calendar size={18} />,
    iconLg: <Calendar size={36} />,
    color: 'text-purple-600 bg-purple-50',
    colorHex: '#9333EA',
    bgHex: '#FAF5FF',
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80',
    description: 'Event Manager, chargé de congrès, incentive planner, wedding planner, coordinateur séminaires... L\'événementiel professionnel n\'a plus de secrets pour vous.',
    roles: ['Event Manager', 'Chargé de congrès', 'Incentive Planner', 'Wedding Planner', 'Coordinateur MICE'],
  },
  spa: {
    label: 'Spa & Bien-être',
    labelPlural: 'en Spa & Bien-être',
    icon: <Sparkles size={18} />,
    iconLg: <Sparkles size={36} />,
    color: 'text-pink-600 bg-pink-50',
    colorHex: '#DB2777',
    bgHex: '#FDF2F8',
    banner: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1600&q=80',
    description: 'Praticien(ne) spa, esthéticienne, coach bien-être, réceptionniste spa... Prenez soin des autres dans un cadre apaisant.',
    roles: ['Praticien(ne) spa', 'Esthéticienne', 'Réceptionniste spa', 'Masseur / Masseuse', 'Coach bien-être'],
  },
  entertainment: {
    label: 'Divertissement',
    labelPlural: 'en Divertissement',
    icon: <PartyPopper size={18} />,
    iconLg: <PartyPopper size={36} />,
    color: 'text-indigo-600 bg-indigo-50',
    colorHex: '#4F46E5',
    bgHex: '#EEF2FF',
    banner: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&q=80',
    description: 'Animateur culturel, régisseur de spectacle, coordinateur de loisirs... Faites vivre des expériences mémorables.',
    roles: ['Animateur(trice)', 'Régisseur(se) de spectacle', 'Coordinateur loisirs', 'Guide d\'animation'],
  },
};

export const SECTOR_CONTRACT_COLOR: Record<string, string> = {
  CDI: 'bg-blue-50   text-blue-700   border-blue-100',
  CDD: 'bg-purple-50 text-purple-700 border-purple-100',
  'CDD Saisonnier': 'bg-orange-50 text-orange-700 border-orange-100',
  Alternance: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  Stage: 'bg-teal-50   text-teal-700   border-teal-100',
  Freelance: 'bg-pink-50   text-pink-700   border-pink-100',
};

export const OTHER_SECTORS = (Object.entries(SECTORS) as [SectorKey, SectorConfig][]).map(
  ([key, cfg]) => ({ key, ...cfg }),
);
