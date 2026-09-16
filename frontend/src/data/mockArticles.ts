// src/data/mockArticles.ts
import { createElement } from 'react';
import { LayoutGrid, Search, Target, BookOpen, Heart, TrendingUp } from 'lucide-react';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  date: string;
  coverUrl: string;
  author: { name: string; role: string; avatar: string };
  featured?: boolean;
}

export const CATEGORIES = [
  { key: '', label: 'Tous les articles', icon: createElement(LayoutGrid, { size: 14 }) },
  { key: 'Recherche d\'Emploi', label: 'Recherche d\'Emploi', icon: createElement(Search, { size: 14 }) },
  { key: 'Entretien & Coaching', label: 'Entretien & Coaching', icon: createElement(Target, { size: 14 }) },
  { key: 'Métiers & Formations', label: 'Métiers & Formations', icon: createElement(BookOpen, { size: 14 }) },
  { key: 'Vie au Travail', label: 'Vie au Travail', icon: createElement(Heart, { size: 14 }) },
  { key: 'Tendances du Marché', label: 'Tendances du Marché', icon: createElement(TrendingUp, { size: 14 }) },
];

export const CATEGORY_BADGE: Record<string, string> = {
  'Coaching': 'bg-orange-500',
  "Recherche d'Emploi": 'bg-blue-600',
  'Entretien & Coaching': 'bg-orange-500',
  'Métiers & Formations': 'bg-[#1E2A3A]',
  'Vie au Travail': 'bg-green-600',
  'Tendances du Marché': 'bg-teal-600',
  'Tendances': 'bg-teal-600',
};

// MOCK — fallback tant que le backend /emploi/conseils n'est pas branché.
export const MOCK_ARTICLES: Article[] = [
  {
    id: '1', featured: true,
    title: 'Les 10 questions pièges en entretien et comment y répondre',
    excerpt: 'Les questions les plus fréquentes posées par les recruteurs et comment préparer des réponses qui marquent.',
    category: 'Coaching', readTime: 5, date: '12 Jan 2026',
    coverUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    author: { name: 'Sophie Martin', role: 'Coach RH', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80' },
  },
  {
    id: '2', featured: true,
    title: 'Comment créer un CV qui se démarque dans le tourisme',
    excerpt: 'Les spécificités du secteur touristique nécessitent une approche unique. Voici nos conseils d\'experts.',
    category: "Recherche d'Emploi", readTime: 8, date: '10 Jan 2026',
    coverUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
    author: { name: 'Thomas Dubois', role: 'Consultant Carrière', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
  },
  {
    id: '3', featured: true,
    title: 'Négocier son salaire : le guide complet 2026',
    excerpt: 'Techniques éprouvées et fourchettes de salaires pour négocier efficacement votre rémunération.',
    category: 'Coaching', readTime: 6, date: '8 Jan 2026',
    coverUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&q=80',
    author: { name: 'Marie Laurent', role: 'Experte RH', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&q=80' },
  },
  {
    id: '4',
    title: "Revenue Manager : le métier qui monte dans l'hôtellerie",
    excerpt: 'Missions, compétences requises et perspectives de carrière de ce poste stratégique.',
    category: 'Métiers & Formations', readTime: 10, date: '6 Jan 2026',
    coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    author: { name: 'Antoine Mercier', role: 'Expert Hôtellerie', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
  },
  {
    id: '5',
    title: 'Optimiser son profil LinkedIn pour être repéré',
    excerpt: 'Les recruteurs utilisent LinkedIn pour sourcer. Voici comment rendre votre profil irrésistible.',
    category: "Recherche d'Emploi", readTime: 7, date: '4 Jan 2026',
    coverUrl: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&q=80',
    author: { name: 'Camille Rousseau', role: 'Consultante Digital', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&q=80' },
  },
  {
    id: '6',
    title: 'Équilibre vie pro / vie perso dans le tourisme',
    excerpt: 'Le secteur du tourisme est exigeant. Découvrez comment préserver votre bien-être au quotidien.',
    category: 'Vie au Travail', readTime: 5, date: '2 Jan 2026',
    coverUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
    author: { name: 'Léa Fontaine', role: 'Psychologue du Travail', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80' },
  },
  {
    id: '7',
    title: 'Tourisme durable : les nouveaux métiers qui émergent',
    excerpt: "L'éco-tourisme crée de nouvelles opportunités professionnelles. Découvrez les métiers de demain.",
    category: 'Tendances du Marché', readTime: 9, date: '30 Déc 2025',
    coverUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    author: { name: 'Lucas Bernard', role: 'Analyste Tendances', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80' },
  },
  {
    id: '8',
    title: "S'expatrier dans le tourisme : guide pratique complet",
    excerpt: 'Visa, fiscalité, logement, assurance : tout ce qu\'il faut savoir avant de partir travailler à l\'étranger.',
    category: 'Vie au Travail', readTime: 12, date: '28 Déc 2025',
    coverUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    author: { name: 'Julie Chen', role: 'Experte Mobilité Internationale', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80' },
  },
];
