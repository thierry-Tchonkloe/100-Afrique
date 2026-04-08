// src/types/article.ts
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor?: string; // ex: '#F19300' ou 'blue-600'
  image: string;
  author: string;
  date: string;
  readingTime?: string;
  isHero?: boolean;
}