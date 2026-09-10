// src/components/secteurs/secteurMeta.ts
export interface SecteurMeta {
  label: string;
  description: string;
  accentFrom: string;
  accentTo: string;
  emoji: string;
}

export const SECTEUR_META: Record<string, SecteurMeta> = {
  hotellerie: {
    label: 'Hôtellerie',
    description: 'Actualités, tendances et analyses du secteur hôtelier en Afrique et dans le monde.',
    accentFrom: '#1A5C43', accentTo: '#2A7F5F', emoji: '🏨',
  },
  transport: {
    label: 'Transport',
    description: 'Tout sur le transport aérien, ferroviaire et routier dédié au tourisme.',
    accentFrom: '#0D2B1A', accentTo: '#1A5C43', emoji: '✈️',
  },
  restauration: {
    label: 'Restauration',
    description: 'Gastronomie africaine et mondiale, actualités culinaires et chefs.',
    accentFrom: '#B85C38', accentTo: '#C8A84B', emoji: '🍽️',
  },
  'voyages-affaires': {
    label: "Voyages d'Affaires",
    description: 'MICE, voyages corporate, réunions internationales et tendances business travel.',
    accentFrom: '#1A2B5C', accentTo: '#2A3F8A', emoji: '💼',
  },
  'mice-evenements': {
    label: 'MICE & Événements',
    description: 'Congrès, salons, incentives et événements professionnels à travers le monde.',
    accentFrom: '#5C1A4A', accentTo: '#8A2A6E', emoji: '🎪',
  },
  divertissement: {
    label: 'Divertissement',
    description: 'Parcs, attractions, culture, festivals et loisirs liés au tourisme.',
    accentFrom: '#5C1A1A', accentTo: '#8A2A2A', emoji: '🎭',
  },
  'tourisme-durable': {
    label: 'Tourisme Durable',
    description: 'Éco-tourisme, développement responsable et tourisme vert en Afrique.',
    accentFrom: '#1A4D2B', accentTo: '#2A7A45', emoji: '🌿',
  },
};

export function getSecteurMeta(slug: string): SecteurMeta {
  return SECTEUR_META[slug] ?? {
    label: slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Secteur',
    description: `Actualités du secteur ${slug}.`,
    accentFrom: '#1A5C43', accentTo: '#2A7F5F', emoji: '📰',
  };
}