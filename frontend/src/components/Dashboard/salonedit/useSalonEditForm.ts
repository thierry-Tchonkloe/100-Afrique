// src/components/Dashboard/salonedit/useSalonEditForm.ts
"use client";
import { useCallback, useState } from 'react';
import { updateSalon } from '@/services/Dashboard/salonservice';
import { Article, Tag, STATUS_API_TO_UI, STATUS_UI_TO_API } from '@/services/Dashboard/articleservice';

export interface SalonForm {
  title: string;
  excerpt: string;
  location: string;
  startDate: string;
  endDate: string;
  website: string;
  description: string;
  status: string;
  slug: string;
  categoryId: number | undefined;
  selectedTagIds: number[];
  relatedContentIds: number[];
  metaTitle: string;
  metaDescription: string;
  coverImage: string;
}

function extractBodyText(article: Article): string {
  if (!article.content || !Array.isArray(article.content)) return '';
  return (article.content as { type: string; value: string }[])
    .filter((b) => b.type === 'text' || b.type === 'heading')
    .map((b) => (b.type === 'heading' ? `## ${b.value}` : b.value))
    .join('\n\n');
}

export function useSalonEditForm(salon: Article, onSubmit?: (article: Article) => void) {
  const [form, setForm] = useState<SalonForm>({
    title: salon.title ?? '',
    excerpt: salon.excerpt ?? '',
    location: salon.location ?? '',
    startDate: salon.startDate ? salon.startDate.slice(0, 10) : '',
    endDate: salon.endDate ? salon.endDate.slice(0, 10) : '',
    website: salon.website ?? '',
    description: extractBodyText(salon),
    status: STATUS_API_TO_UI[salon.status] ?? 'DRAFT',
    slug: salon.slug ?? '',
    categoryId: salon.category?.id ?? undefined,
    selectedTagIds: (salon.tags ?? []).map((t: Tag) => t.id),
    relatedContentIds: (salon.relatedContent ?? []).map((r: Article) => r.id),
    metaTitle: salon.metaTitle ?? '',
    metaDescription: salon.metaDescription ?? '',
    coverImage: salon.coverImage ?? '',
  });

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const update = useCallback(<K extends keyof SalonForm>(key: K, value: SalonForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value })), []);

  const save = async (targetStatusUI?: string) => {
    const isSaving = !targetStatusUI;
    if (isSaving) setSaving(true); else setPublishing(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const apiStatus = STATUS_UI_TO_API[targetStatusUI ?? form.status] as 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

      const contentBlocks = form.description.trim()
        ? form.description.split(/\n{2,}/).map((line) => {
            const t = line.trim();
            if (!t) return null;
            if (t.startsWith('## ')) return { type: 'heading', value: t.slice(3) };
            return { type: 'text', value: t };
          }).filter(Boolean) as { type: string; value: string }[]
        : [{ type: 'text', value: 'Contenu vide' }];

      const payload: Parameters<typeof updateSalon>[1] = {
        title: form.title.trim() || undefined,
        status: apiStatus,
        content: contentBlocks,
        coverImage: form.coverImage || undefined,
        excerpt: form.excerpt.trim() || undefined,
        location: form.location.trim() || undefined,
        startDate: new Date(form.startDate) || undefined,
        endDate: new Date(form.endDate) || undefined,
        website: form.website.trim() || undefined,
        tags: form.selectedTagIds,
        categoryId: form.categoryId,
        relatedContentIds: form.relatedContentIds,
        metaTitle: form.metaTitle.trim() || undefined,
        metaDescription: form.metaDescription.trim() || undefined,
      };

      const res = await updateSalon(salon.id, payload);
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

  return { form, update, saving, publishing, saveError, saveSuccess, save };
}