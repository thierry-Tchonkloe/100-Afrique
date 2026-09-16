// src/components/Dashboard/newvideo/useNewVideoForm.ts
"use client";
import { useEffect, useRef, useState } from 'react';
import { quickCreateVideo } from '@/services/Dashboard/video.service';
import { Article } from '@/services/Dashboard/articleservice';
import { useAuthors, useDestinationsFetch } from '@/components/shared/backoffice/useAuthorsAndDestinations';

interface FormData {
  title: string;
  statusUI: string;
  authorId: string;
  destinationId: string;
}

interface FormErrors {
  title?: string;
  statusUI?: string;
  authorId?: string;
}

export function useNewVideoForm(isOpen: boolean, onSuccess?: (article: Article) => void, onClose?: () => void) {
  const [form, setForm] = useState<FormData>({ title: '', statusUI: 'DRAFT', authorId: '', destinationId: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { authors, loadingAuthors } = useAuthors(isOpen);
  const { destinations, loadingDestinations } = useDestinationsFetch(isOpen);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => titleRef.current?.focus(), 100);
    } else {
      setForm({ title: '', statusUI: 'DRAFT', authorId: '', destinationId: '' });
      setErrors({});
      setApiError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (field in errors) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = 'Le titre est requis.';
    else if (form.title.trim().length < 5) errs.title = 'Minimum 5 caractères.';
    if (!form.statusUI) errs.statusUI = 'Veuillez sélectionner un statut.';
    if (!form.authorId) errs.authorId = 'Veuillez sélectionner un auteur.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setApiError(null);

    try {
      const article = await quickCreateVideo({
        title: form.title,
        statusUI: form.statusUI,
        authorId: Number(form.authorId),
        destinationId: form.destinationId ? Number(form.destinationId) : undefined,
        type: 'VIDEO',
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
    form, updateField, errors, submitting, apiError,
    authors, loadingAuthors, destinations, loadingDestinations,
    titleRef, handleSubmit,
  };
}