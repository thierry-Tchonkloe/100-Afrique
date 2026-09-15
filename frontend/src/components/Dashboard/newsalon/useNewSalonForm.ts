// src/components/Dashboard/newsalon/useNewSalonForm.ts
"use client";
import { useEffect, useState } from 'react';
import { quickCreateSalon } from '@/services/Dashboard/salonservice';
import { Article } from '@/services/Dashboard/articleservice';
import { useAuthors } from '@/components/shared/backoffice/useAuthorsAndDestinations';

export const STATUTS = ['Brouillon', 'En Révision', 'Publié', 'Archivé'];

function toApiStatus(statutInterne: string): 'DRAFT' | 'PUBLISHED' | 'REVIEW' | 'ARCHIVED' {
  const map: Record<string, 'DRAFT' | 'PUBLISHED' | 'REVIEW' | 'ARCHIVED'> = {
    Brouillon: 'DRAFT', 'En Révision': 'REVIEW', Publié: 'PUBLISHED', Archivé: 'ARCHIVED',
  };
  return map[statutInterne] ?? 'DRAFT';
}

interface FormData {
  nomOfficiel: string;
  villePayss: string;
  dateDebut: string;
  dateFin: string;
  statutInterne: string;
  responsableCouvertureId: number | null;
}

interface FormErrors {
  nomOfficiel?: string;
  villePayss?: string;
  dateDebut?: string;
  dateFin?: string;
  statutInterne?: string;
  responsableCouvertureId?: string;
}

const EMPTY_FORM: FormData = {
  nomOfficiel: '', villePayss: '', dateDebut: '', dateFin: '', statutInterne: '', responsableCouvertureId: null,
};

export function useNewSalonForm(isOpen: boolean, onSuccess?: (article: Article) => void, onClose?: () => void) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { authors: users, loadingAuthors: loadingUsers } = useAuthors(isOpen);

  useEffect(() => {
    if (!isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
      setApiError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.nomOfficiel.trim()) errs.nomOfficiel = 'Ce champ est requis.';
    if (!form.villePayss.trim()) errs.villePayss = 'Ce champ est requis.';
    if (!form.dateDebut) errs.dateDebut = 'Ce champ est requis.';
    if (!form.dateFin) errs.dateFin = 'Ce champ est requis.';
    if (!form.statutInterne) errs.statutInterne = 'Veuillez sélectionner un statut.';
    if (!form.responsableCouvertureId) errs.responsableCouvertureId = 'Veuillez sélectionner un responsable.';
    if (form.dateDebut && form.dateFin && form.dateFin < form.dateDebut)
      errs.dateFin = 'La date de fin doit être après la date de début.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setApiError(null);

    try {
      const article = await quickCreateSalon({
        title: form.nomOfficiel,
        status: toApiStatus(form.statutInterne),
        authorId: form.responsableCouvertureId!,
        location: form.villePayss,
        startDate: new Date(form.dateDebut).toISOString(),
        endDate: new Date(form.dateFin).toISOString(),
        planningStatus: form.statutInterne,
        type: 'SALON',
      });

      onSuccess?.(article);
      onClose?.();
    } catch (err: unknown) {
      setApiError((err as Error).message || 'Erreur lors de la création.');
    } finally {
      setSubmitting(false);
    }
  };

  return { form, handleChange, errors, submitting, apiError, users, loadingUsers, handleSubmit };
}