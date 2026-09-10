// src/components/videos/detail/useVideoDetail.ts
"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { ContentBlock } from '@/components/shared/ContentBlockRenderer';

export interface VideoArticle {
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
  sourceUrl?: string | null;
  category: { id: number; name: string; slug: string; color?: string };
  author: { id: number; name: string };
  tags?: { id: number; name: string; slug: string }[];
  destination?: { id: number; name: string; slug: string } | null;
}

export interface RelatedVideo {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  sourceUrl: string | null;
  createdAt: string;
  excerpt: string;
  category: { name: string };
  author: { name: string };
  content: ContentBlock[];
}

// ─── Helpers URL ──────────────────────────────────────────────────────────────

export const toEmbedUrl = (raw: string): string => {
  if (!raw) return '';
  if (raw.includes('/embed/') || raw.includes('player.vimeo')) return raw;
  const ytShort = raw.match(/youtu\.be\/([^?&]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
  const ytWatch = raw.match(/[?&]v=([^?&]+)/);
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;
  const vimeo = raw.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return raw;
};

export const getVideoUrl = (blocks: ContentBlock[]): string | null => {
  const block = blocks.find((b) => b.type === 'video');
  return block?.url ?? block?.value ?? null;
};

export const getVideoType = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  if (name.includes('interview')) return 'INTERVIEW';
  if (name.includes('reportage') || name.includes('salon')) return 'REPORTAGE SALON';
  if (name.includes('destination')) return 'DESTINATION';
  if (name.includes('émission') || name.includes('replay')) return 'ÉMISSION';
  if (name.includes('tutoriel')) return 'TUTORIEL PRO';
  return 'VIDÉO';
};

export function useVideoDetail(slug: string | undefined) {
  const [video, setVideo] = useState<VideoArticle | null>(null);
  const [related, setRelated] = useState<RelatedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await api.get(`/mag/articles/${slug}`);
        const data: VideoArticle = res.data.data ?? res.data;
        if (cancelled) return;
        setVideo(data);

        try {
          const relRes = await api.get('/mag/articles', {
            params: { categoryId: data.category.id, type: 'VIDEO', pageSize: 4, status: 'PUBLISHED' },
          });
          const relData: RelatedVideo[] = relRes.data.data ?? [];
          if (!cancelled) setRelated(relData.filter((v) => v.slug !== slug).slice(0, 3));
        } catch {
          /* section optionnelle */
        }
      } catch (error) {
        if (cancelled) return;
        const axiosError = error as { response?: { status?: number } };
        if (axiosError?.response?.status === 404) setNotFound(true);
        else { console.error('Erreur chargement vidéo:', error); setNotFound(true); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [slug]);

  const parsedContent: ContentBlock[] = video && Array.isArray(video.content) ? video.content : [];
  const videoType = video ? getVideoType(video.category.name) : '';
  const rawUrl = video ? (video.sourceUrl || getVideoUrl(parsedContent) || null) : null;
  const sourceUrl = rawUrl ? toEmbedUrl(rawUrl) : null;

  return { video, related, loading, notFound, parsedContent, videoType, rawUrl, sourceUrl };
}