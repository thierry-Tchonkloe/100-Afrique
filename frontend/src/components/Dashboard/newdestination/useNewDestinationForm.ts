// src/components/Dashboard/newdestination/useNewDestinationForm.ts
"use client";
import { useCallback, useEffect, useState } from 'react';
import { quickCreateDestination, GeographicLevel, DestinationStatus } from '@/services/Dashboard/destinationservice';
import { Article } from '@/services/Dashboard/articleservice';
import { useAuthors } from '@/components/shared/backoffice/useAuthorsAndDestinations';

export const GEO_OPTIONS: { value: GeographicLevel; label: string }[] = [
  { value: 'pays', label: '🌍 Pays' },
  { value: 'region', label: '🗺️ Région' },
  { value: 'province', label: '📍 Province' },
  { value: 'ville', label: '🏙️ Ville' },
];

export const STATUS_OPTIONS: { value: DestinationStatus; label: string }[] = [
  { value: 'DRAFT', label: '✏️ Brouillon' },
  { value: 'PUBLISHED', label: '✅ Publié' },
  { value: 'ARCHIVED', label: '🗄️ Archivé' },
];

function toSlug(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

interface FormData {
  nom: string;
  slug: string;
  niveauGeographique: GeographicLevel | '';
  statut: DestinationStatus | '';
  authorId: string;
}

interface FormErrors {
  nom?: string;
  slug?: string;
  niveauGeographique?: string;
  statut?: string;
  authorId?: string;
}

const EMPTY_FORM: FormData = { nom: '', slug: '', niveauGeographique: '', statut: '', authorId: '' };

export function useNewDestinationForm(isOpen: boolean, onSuccess?: (article: Article) => void, onClose?: () => void) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { authors, loadingAuthors } = useAuthors(isOpen);

  useEffect(() => {
    if (isOpen) setTimeout(() => setVisible(true), 10);
    else setVisible(false);
  }, [isOpen]);

  useEffect(() => {
    if (!slugManuallyEdited && form.nom) {
      setForm((prev) => ({ ...prev, slug: toSlug(form.nom) }));
    }
  }, [form.nom, slugManuallyEdited]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      onClose?.();
      setForm(EMPTY_FORM);
      setErrors({});
      setApiError(null);
      setSlugManuallyEdited(false);
    }, 200);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handleClose]);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSlugChange = (v: string) => {
    setSlugManuallyEdited(true);
    updateField('slug', v);
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.nom.trim()) errs.nom = 'Le nom officiel est requis.';
    if (!form.slug.trim()) errs.slug = 'Le slug est requis.';
    else if (!/^[a-z0-9-]+$/.test(form.slug)) errs.slug = 'Minuscules, chiffres et tirets uniquement.';
    if (!form.niveauGeographique) errs.niveauGeographique = 'Sélectionnez un niveau.';
    if (!form.statut) errs.statut = 'Sélectionnez un statut.';
    if (!form.authorId) errs.authorId = 'Sélectionnez un auteur.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setApiError(null);

    try {
      const article = await quickCreateDestination({
        title: form.nom,
        slug: form.slug || undefined,
        status: form.statut as DestinationStatus,
        authorId: Number(form.authorId),
        niveauGeographique: form.niveauGeographique as GeographicLevel,
        type: 'DESTINATION',
      });

      onSuccess?.(article);
      handleClose();
    } catch (err: unknown) {
      setApiError((err as Error).message || 'Erreur lors de la création.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form, updateField, onSlugChange, errors, visible, submitting, apiError,
    authors, loadingAuthors, handleClose, handleSubmit,
  };
}