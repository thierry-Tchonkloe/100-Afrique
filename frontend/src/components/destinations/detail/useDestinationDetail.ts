// src/components/destinations/detail/useDestinationDetail.ts
"use client";
import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import type { ContentBlock } from '@/components/shared/ContentBlockRenderer';

export interface ArticleCard {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  createdAt: string;
  type?: 'ARTICLE' | 'VIDEO';
  views?: number;
  category: { name: string; color?: string };
  author: { name: string };
}

export interface Destination {
  id: number;
  name: string;
  slug: string;
  description?: string;
  coverImage: string;
  continent?: string;
  articleCount?: number;
  capital?: string;
  currency?: string;
  language?: string;
  timezone?: string;
  climate?: string;
  bestPeriod?: string;
  visaRequired?: boolean;
  content?: ContentBlock[];
  articles?: ArticleCard[];
  tags?: { id: number; name: string; slug: string }[];
}

interface ApiResponse {
  success: boolean;
  data: Destination;
}

interface ArticlesApiResponse {
  success: boolean;
  data: ArticleCard[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function getContentHref(article: ArticleCard): string {
  return article.type === 'VIDEO' ? `/videos/${article.slug}` : `/actualites/${article.slug}`;
}

export function useDestinationDetail(slug: string | undefined) {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [articles, setArticles] = useState<ArticleCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [articlesPage, setArticlesPage] = useState(1);
  const [hasMoreArticles, setHasMoreArticles] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchArticles = useCallback(async (destId: number, page: number, append = false) => {
    try {
      if (append) setLoadingMore(true);
      const res = await api.get<ArticlesApiResponse>('/mag/articles', {
        params: { destinationId: destId, page, pageSize: 6, status: 'PUBLISHED' },
      });
      const newArticles = res.data.data ?? [];
      const pagination = res.data.pagination;
      setArticles((prev) => (append ? [...prev, ...newArticles] : newArticles));
      setHasMoreArticles(pagination?.hasNextPage ?? false);
      setArticlesPage(page + 1);
    } catch {
      /* fail silently */
    } finally {
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await api.get<ApiResponse>(`/destinations/${slug}`);
        const data = res.data.data ?? res.data;
        if (cancelled) return;
        setDestination(data);
        await fetchArticles(data.id, 1, false);
      } catch (error) {
        if (cancelled) return;
        const axiosError = error as { response?: { status?: number } };
        if (axiosError?.response?.status === 404) setNotFound(true);
        else { console.error('Erreur chargement destination:', error); setNotFound(true); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const parsedContent = destination && Array.isArray(destination.content) ? destination.content : [];
  const hasPracticalInfo = !!(
    destination?.capital || destination?.currency || destination?.language ||
    destination?.timezone || destination?.climate || destination?.bestPeriod
  );

  const loadMore = () => {
    if (destination) fetchArticles(destination.id, articlesPage, true);
  };

  return {
    destination, articles, loading, notFound,
    hasMoreArticles, loadingMore, parsedContent, hasPracticalInfo,
    loadMore,
  };
}