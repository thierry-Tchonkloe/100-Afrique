// src/components/Dashboard/newstaticpage/useNewStaticPageForm.ts
"use client";
import { useEffect, useRef, useState } from 'react';
import { quickCreatePage } from '@/services/Dashboard/pageservice';
import { Article } from '@/services/Dashboard/articleservice';
import { useAuthors } from '@/components/shared/backoffice/useAuthorsAndDestinations';

export type PageStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type Visibility = 'public' | 'private';

interface FormData {
  title: string;
  slug: string;
  status: PageStatus;
  visibility: Visibility;
  authorId: string;
}

interface FormErrors {
  title?: string;
  slug?: string;
  status?: string;
  authorId?: string;
}

function slugify(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const EMPTY_FORM: FormData = { title: '', slug: '', status: 'DRAFT', visibility: 'public', authorId: '' };

export function useNewStaticPageForm(isOpen: boolean, onSuccess?: (article: Article) => void, onClose?: () => void) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { authors, loadingAuthors } = useAuthors(isOpen);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => titleRef.current?.focus(), 100);
    } else {
      setForm(EMPTY_FORM);
      setErrors({});
      setApiError(null);
      setSlugManuallyEdited(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm((prev) => ({ ...prev, title, slug: slugManuallyEdited ? prev.slug : slugify(title) }));
    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    const slug = slugify(e.target.value);
    setForm((prev) => ({ ...prev, slug }));
    if (errors.slug) setErrors((prev) => ({ ...prev, slug: undefined }));
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field in errors) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = 'Le titre est requis.';
    if (!form.slug.trim()) errs.slug = 'Le slug est requis.';
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) errs.slug = 'Format invalide : lettres minuscules, chiffres et tirets uniquement.';
    if (!form.status) errs.status = 'Veuillez sélectionner un statut.';
    if (!form.authorId) errs.authorId = 'Veuillez sélectionner un auteur.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setApiError(null);

    try {
      const article = await quickCreatePage({
        title: form.title,
        status: form.status,
        slug: form.slug || undefined,
        authorId: Number(form.authorId),
        type: 'PAGE',
      });

      onSuccess?.(article);
      onClose?.();
    } catch (err: unknown) {
      setApiError((err as Error).message || 'Erreur lors de la création.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form, updateField, handleTitleChange, handleSlugChange, errors, submitting, apiError,
    authors, loadingAuthors, titleRef, handleSubmit,
  };
}