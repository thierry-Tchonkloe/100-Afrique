// src/components/Dashboard/videoedit/useVideoEditForm.ts
"use client";
import { useCallback, useEffect, useState } from 'react';
import { updateVideo } from '@/services/Dashboard/video.service';
import { Article, Tag, fetchCategories, Category, STATUS_API_TO_UI, STATUS_UI_TO_API } from '@/services/Dashboard/articleservice';
import { fetchDestinationsForSelect, DestinationOption } from '@/services/Dashboard/destinationservice';

export interface VideoForm {
  title: string;
  excerpt: string;
  sourceUrl: string;
  duration: string;
  status: string;
  videoType: string;
  publishDate: string;
  selectedTagIds: number[];
  metaTitle: string;
  metaDescription: string;
  coverImage: string;
  categoryId: number | undefined;
  destinationId: string;
}

export const VIDEO_TYPES = ['Interview', 'Tutoriel', 'Présentation', 'Reportage', 'Autre'];

function extractVideoUrl(content: Article['content']): string {
  if (!Array.isArray(content)) return '';
  const block = content.find((b: { type: string; url?: string }) => b.type === 'video' && b.url);
  return (block as { url?: string })?.url ?? '';
}

export function useVideoEditForm(video: Article, onSubmit?: (article: Article) => void) {
  const initialVideoUrl = extractVideoUrl(video.content) || video.sourceUrl || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);

  useEffect(() => {
    fetchCategories().then((data) => setCategories(data?.data)).catch((err) => console.error('Erreur catégories ❌', err));
  }, []);

  useEffect(() => {
    setLoadingDestinations(true);
    fetchDestinationsForSelect().then(setDestinations).catch(() => setDestinations([])).finally(() => setLoadingDestinations(false));
  }, []);

  const [form, setForm] = useState<VideoForm>({
    title: video.title ?? '',
    excerpt: video.excerpt ?? '',
    sourceUrl: initialVideoUrl,
    duration: video.duration ?? '',
    status: STATUS_API_TO_UI[video.status] ?? 'DRAFT',
    videoType: video.videoType ?? 'Interview',
    publishDate: video.createdAt ? video.createdAt.slice(0, 16) : '',
    selectedTagIds: (video.tags ?? []).map((t: Tag) => t.id),
    metaTitle: video.metaTitle ?? '',
    metaDescription: video.metaDescription ?? '',
    coverImage: video.coverImage ?? '',
    categoryId: video.category?.id ?? undefined,
    destinationId: video.destinationId ? String(video.destinationId) : '',
  });

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const update = useCallback(<K extends keyof VideoForm>(key: K, value: VideoForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value })), []);

  const save = async (targetStatusUI?: string) => {
    const isSaving = !targetStatusUI;
    if (isSaving) setSaving(true); else setPublishing(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const apiStatus = STATUS_UI_TO_API[targetStatusUI ?? form.status] as 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

      const payload: Parameters<typeof updateVideo>[1] = {
        title: form.title.trim() || undefined,
        status: apiStatus,
        content: [
          { type: 'video', url: form.sourceUrl.trim(), value: form.sourceUrl.trim() },
          { type: 'text', value: form.excerpt.trim() || 'Contenu vide' },
        ],
        coverImage: form.coverImage.trim() || undefined,
        tags: form.selectedTagIds,
        sourceUrl: form.sourceUrl.trim() || undefined,
        duration: form.duration.trim() || undefined,
        videoType: form.videoType || undefined,
        metaTitle: form.metaTitle.trim() || undefined,
        metaDescription: form.metaDescription.trim() || undefined,
        excerpt: form.excerpt.trim() || undefined,
        categoryId: form.categoryId,
        destinationId: form.destinationId ? Number(form.destinationId) : null,
      };

      const res = await updateVideo(video.id, payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (targetStatusUI) onSubmit?.(res.data);
    } catch (err: unknown) {
      setSaveError((err as Error).message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  };

  return { form, update, categories, destinations, loadingDestinations, saving, publishing, saveError, saveSuccess, save };
}