// src/data/companyEnrichments.ts
// Données de démo enrichissant les entreprises réelles quand elles existent
// (tags, avis, etc.) — pas encore couvert par le backend.
export const COMPANY_ENRICHMENTS: Record<string, {
  description?: string;
  tags?: string[];
  employeeCount?: string;
  isFeatured?: boolean;
  isPremium?: boolean;
  rating?: number;
  growth?: string;
  coverUrl?: string;
  logoColor?: string;
}> = {
  'Luxury Hotels Group': {
    description: 'Chaîne hôtelière de prestige avec 45 établissements en Europe. Excellence, innovation et art de vivre à la française.',
    tags: ['Great Place to Work', 'Éco-responsable'],
    employeeCount: '2 000+', isPremium: true, isFeatured: true, rating: 4.8, growth: '+18%',
    coverUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
    logoColor: 'bg-blue-600',
  },
  'Voyages Prestige': {
    description: 'Agence de voyages sur-mesure spécialisée dans le luxe et l\'aventure. Destinations exclusives, service 5 étoiles.',
    tags: ['Label Diversité', 'Formation certifiante'],
    employeeCount: '150–300', isPremium: false, isFeatured: true, rating: 4.6, growth: '+12%',
    coverUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    logoColor: 'bg-amber-500',
  },
  'Gastronomie & Co': {
    description: 'Groupe de restauration gastronomique regroupant 30 restaurants étoilés. La passion du goût et de l\'excellence culinaire.',
    tags: ['Étoilé Michelin', 'Engagement durable'],
    employeeCount: '500–1 000', isPremium: true, isFeatured: false, rating: 4.7, growth: '+25%',
    coverUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    logoColor: 'bg-orange-600',
  },
  'Events International': {
    description: 'Leader européen de l\'organisation d\'événements MICE. Congrès, incentives, séminaires et gala dans le monde entier.',
    tags: ['ISO 20121', 'Parité exemplaire'],
    employeeCount: '100–250', isPremium: false, isFeatured: false, rating: 4.4, growth: '+8%',
    coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    logoColor: 'bg-purple-600',
  },
  'TravelTech Solutions': {
    description: 'Scale-up tech du tourisme. Nous développons les plateformes numériques qui révolutionnent l\'industrie des voyages.',
    tags: ['Remote friendly', 'Stock options'],
    employeeCount: '50–150', isPremium: false, isFeatured: true, rating: 4.9, growth: '+45%',
    coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    logoColor: 'bg-green-600',
  },
  'Sky Airlines': {
    description: 'Compagnie aérienne régionale en forte croissance. Flotte moderne, culture bienveillante et opportunités d\'évolution.',
    tags: ['Mobilité internationale', 'Avantages vol'],
    employeeCount: '1 000–3 000', isPremium: false, isFeatured: false, rating: 4.3, growth: '+10%',
    coverUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    logoColor: 'bg-sky-600',
  },
};

export function enrichCompany<T extends { name: string }>(c: T): T & typeof COMPANY_ENRICHMENTS[string] {
  const e = COMPANY_ENRICHMENTS[c.name] ?? {};
  return { ...c, ...e };
}
