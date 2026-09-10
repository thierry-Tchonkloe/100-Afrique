// src/components/evenements/detail/useEvenementDetail.ts
"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { ContentBlock } from '@/components/shared/ContentBlockRenderer';

export interface Evenement {
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
  startDate?: string;
  endDate?: string;
  location?: string;
  city?: string;
  country?: string;
  website?: string;
  exhibitorCount?: number;
  visitorCount?: number;
  edition?: string;
  category: { id: number; name: string; slug: string; color?: string };
  author: { id: number; name: string };
  tags?: { id: number; name: string; slug: string }[];
  destination?: { id: number; name: string; slug: string } | null;
}

export interface RelatedEvenement {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  createdAt: string;
  excerpt: string;
  location?: string;
  startDate?: string;
  category: { name: string };
  author: { name: string };
}

function calcReadingTime(blocks: ContentBlock[]): number {
  return Math.max(
    1,
    Math.ceil(
      blocks
        .filter((b) => b.type === 'text' || b.type === 'heading')
        .reduce((acc, b) => acc + (b.value || '').split(' ').length, 0) / 200
    )
  );
}

export function useEvenementDetail(slug: string | undefined) {
  const [evenement, setEvenement] = useState<Evenement | null>(null);
  const [related, setRelated] = useState<RelatedEvenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    api.get(`/mag/articles/${slug}`)
      .then(async (res) => {
        const data: Evenement = res.data.data ?? res.data;
        if (cancelled) return;
        setEvenement(data);
        try {
          const rel = await api.get('/mag/articles', {
            params: { categoryId: data.category.id, pageSize: 4, status: 'PUBLISHED' },
          });
          if (!cancelled) {
            setRelated(
              (rel.data.data ?? []).filter((a: RelatedEvenement) => a.slug !== slug).slice(0, 3)
            );
          }
        } catch {
          /* section optionnelle */
        }
      })
      .catch(() => { if (!cancelled) setNotFound(true); })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
        setTimeout(() => setHeroVisible(true), 80);
      });

    return () => { cancelled = true; };
  }, [slug]);

  const readingTime = evenement ? calcReadingTime(evenement.content) : 0;
  const parsedBlocks = evenement && Array.isArray(evenement.content) ? evenement.content : [];
  const durationDays =
    evenement?.startDate && evenement?.endDate
      ? Math.ceil(
          (new Date(evenement.endDate).getTime() - new Date(evenement.startDate).getTime()) / 86400000
        ) + 1
      : null;

  return { evenement, related, loading, notFound, heroVisible, readingTime, parsedBlocks, durationDays };
}