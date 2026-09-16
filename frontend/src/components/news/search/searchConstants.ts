// src/components/news/search/searchConstants.ts
export interface SearchFilters {
  query: string;
  region: string;
  country: string;
  topic: string;
}

export const EMPTY_FILTERS: SearchFilters = { query: '', region: '', country: '', topic: '' };

export const REGIONS = [
  "Afrique de l'Ouest", "Afrique de l'Est", "Afrique Centrale",
  "Afrique Australe", "Afrique du Nord", "Europe", "Asie", "Amériques", "Monde",
];

export const COUNTRIES = [
  'Sénégal', "Côte d'Ivoire", 'Mali', 'Burkina Faso', 'Niger', 'Bénin', 'Togo', 'Guinée',
  'Sierra Leone', 'Libéria', 'Gambie', 'Guinée-Bissau', 'Cap Vert', 'Nigeria', 'Ghana',
  'Cameroun', 'Tchad', 'Congo', 'RDC', 'Gabon', 'Kenya', 'Tanzanie', 'Ouganda', 'Rwanda',
  'Burundi', 'Afrique du Sud', 'Namibie', 'Botswana', 'Zimbabwe', 'Zambie', 'Malawi',
  'Maroc', 'Algérie', 'Tunisie', 'Libye', 'Égypte', 'Mauritanie', 'France', 'Belgique',
  'Suisse', 'Canada', 'USA',
];

export const TOPICS = [
  'Tourisme durable', 'Éco-tourisme', "Tourisme d'affaires", 'Tourisme religieux',
  'Tourisme culturel', 'Tourisme sportif', 'Tourisme gastronomique', 'Tourisme médical',
  'Hôtellerie', 'Transport aérien', 'Croisières', 'Tourisme technologique',
  'Événements', 'Festivals', 'Salons professionnels', 'Sécurité touristique',
  'Investissements', 'Développement', 'Emploi', 'Formation',
];