// src/components/videos/explorer/useVideoExplorer.ts
"use client";
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import { PAGE_SIZE, type SortOption } from './videoExplorerConstants';

export interface VideoItem {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  createdAt: string;
  excerpt: string;
  category: { id: number; name: string; slug: string };
  content: Array<{ type: string; url?: string }>;
}

export function useVideoExplorer() {
  const [videos, setVideos]                 = useState<VideoItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy]                 = useState<SortOption>('createdAt:desc');
  const [currentPage, setCurrentPage]       = useState(1);
  const [totalPages, setTotalPages]         = useState(1);
  const [totalItems, setTotalItems]         = useState(0);
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchVideos = async () => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = {
          type: 'VIDEO', page: currentPage, pageSize: PAGE_SIZE, status: 'PUBLISHED', sortBy,
        };
        if (activeCategory !== 'all') params.categorySlug = activeCategory;
        const response = await api.get('/mag/articles', { params });
        if (cancelled) return;
        setVideos(response.data.data ?? []);
        const pagination = response.data.pagination ?? response.data.meta;
        if (pagination) {
          setTotalPages(pagination.totalPages ?? 1);
          setTotalItems(pagination.total ?? 0);
        }
      } catch (error) {
        if (cancelled) return;
        if (error instanceof AxiosError) console.error('Erreur chargement vidéos:', error.message);
        setVideos([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchVideos();
    return () => { cancelled = true; };
  }, [activeCategory, sortBy, currentPage]);

  const handleCategoryChange = (id: string) => { setActiveCategory(id); setCurrentPage(1); };
  const handleSortChange = (value: string) => { setSortBy(value as SortOption); setCurrentPage(1); };
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, start + 3);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return {
    videos, activeCategory, sortBy, currentPage, totalPages, totalItems, loading,
    handleCategoryChange, handleSortChange, handlePageChange, getPageNumbers,
  };
}