// src/components/articles/detail/useArticleDetail.ts
"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { ContentBlock } from '@/components/shared/ContentBlockRenderer';

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: ContentBlock[];
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  category: { id: number; name: string; slug: string; color?: string };
  author: { id: number; name: string };
  tags?: { id: number; name: string; slug: string }[];
  destination?: { id: number; name: string; slug: string } | null;
}

export interface RelatedArticle {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  createdAt: string;
  excerpt: string;
  category: { name: string };
  author: { name: string };
}

function calculateReadingTime(blocks: ContentBlock[]): number {
  const totalWords = blocks
    .filter((b) => b.type === 'text' || b.type === 'heading')
    .map((b) => (b.value || '').split(' ').length)
    .reduce((a, b) => a + b, 0);
  return Math.max(1, Math.ceil(totalWords / 200));
}

/**
 * Récupère les contenus "similaires" selon une règle stricte :
 * 1. Si l'article est lié à une destination → autres ARTICLES de cette même destination.
 * 2. Sinon → autres articles de la même catégorie.
 * `type: 'ARTICLE'` est explicite pour ne jamais remonter VIDEO/SALON/PAGE/DESTINATION.
 */
async function fetchRelatedArticles(article: Article): Promise<RelatedArticle[]> {
  try {
    const baseParams = { type: 'ARTICLE' as const, pageSize: 50, status: 'PUBLISHED' as const };
    const params = article.destination
      ? { ...baseParams, destinationId: article.destination.id }
      : { ...baseParams, categoryId: article.category.id };

    const res = await api.get('/mag/articles', { params });
    const data: RelatedArticle[] = res.data.data ?? [];
    return data.filter((a) => a.slug !== article.slug);
  } catch {
    return [];
  }
}

export function useArticleDetail(slug: string | undefined) {
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await api.get(`/mag/articles/${slug}`);
        const data: Article = res.data.data ?? res.data;
        if (cancelled) return;
        setArticle(data);
        const relatedData = await fetchRelatedArticles(data);
        if (!cancelled) setRelated(relatedData);
      } catch (error) {
        if (cancelled) return;
        const axiosError = error as { response?: { status?: number } };
        if (axiosError?.response?.status === 404) setNotFound(true);
        else { console.error('Erreur chargement article:', error); setNotFound(true); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [slug]);

  const readingTime = article ? calculateReadingTime(article.content) : 0;
  const parsedContent = article && Array.isArray(article.content) ? article.content : [];

  return { article, related, loading, notFound, readingTime, parsedContent };
}