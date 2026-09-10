// src/components/shared/header/navItems.ts
import React from 'react';
import { Star, TrendingUp } from 'lucide-react';
import { LocaleMark } from '@/components/icons/CustomIcons';

export interface MegaMenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

export interface NavItem {
  href: string;
  label: string;
  megaMenu?: MegaMenuItem[];
}

/**
 * ✅ Construit un lien qui filtre RÉELLEMENT la page /destinations par région
 * précise (champ Destination.regionAssociee). La valeur correspond
 * exactement à celle stockée en base (voir REGIONS["Afrique"] dans
 * DestinationEdit.tsx).
 */
export function destinationRegionHref(region: string): string {
  return `/destinations?region=${encodeURIComponent(region)}`;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: '/actualites',
    label: 'Actualites',
    megaMenu: [
      { label: 'Hôtellerie',   href: '/secteurs/hotellerie',   icon: React.createElement(Star, { size: 16 }),      description: 'Tendances hôtels & resorts' },
      { label: 'Transport',    href: '/secteurs/transport',    icon: React.createElement(TrendingUp, { size: 16 }), description: 'Aviation, train, maritime'  },
      { label: 'Restauration', href: '/secteurs/restauration', icon: React.createElement(Star, { size: 16 }),      description: 'Gastronomie africaine'       },
    ],
  },
  { href: '/evenements',  label: 'Evenements'  },
  { href: '/partenaires', label: 'Partenaires' },
  {
    href: '/destinations',
    label: 'Destinations',
    megaMenu: [
      { label: "Afrique de l'Ouest", href: destinationRegionHref("Afrique de l'Ouest"), icon: React.createElement(LocaleMark, { size: 20 }), description: "Sénégal, Côte d'Ivoire…" },
      { label: "Afrique de l'Est",   href: destinationRegionHref("Afrique de l'Est"),   icon: React.createElement(LocaleMark, { size: 20 }), description: 'Kenya, Tanzanie…'        },
      { label: "Afrique du Nord",    href: destinationRegionHref("Afrique du Nord"),    icon: React.createElement(LocaleMark, { size: 20 }), description: 'Maroc, Tunisie…'         },
    ],
  },
  { href: '/videos',    label: 'Videos'    },
  { href: '/offres',    label: 'Nos offres' },
  { href: '/a-propos',  label: 'A propos'  },
  { href: '/contact',   label: 'Contact'   },
];