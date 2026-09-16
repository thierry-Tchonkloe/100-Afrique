// src/components/Dashboard/newarticle/useNewArticleForm.ts
"use client";
import { useEffect, useRef, useState } from 'react';
import { getToken } from '@/lib/auth';
import { Article } from '@/services/Dashboard/articleservice';
import { useAuthors, useCategoriesFetch, useDestinationsFetch } from '@/components/shared/backoffice/useAuthorsAndDestinations';

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

interface FormData {
  title: string;
  statusUI: string;
  categoryId: string;
  authorId: string;
  destinationId: string;
}

interface FormErrors {
  title?: string;
  statusUI?: string;
  categoryId?: string;
  authorId?: string;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

/**
 * Extrait un Article complet d'une réponse API dont la forme peut varier
 * ({data: Article}, {data: {article: Article}}, ou Article brut).
 */
function extractArticle(json: any): Article | null {
  if (!json) return null;
  if (json.data?.article) return json.data.article;
  if (json.data) return json.data;
  return json;
}

export function useNewArticleForm(isOpen: boolean, onSuccess?: (article: Article) => void, onClose?: () => void) {
  const [form, setForm] = useState<FormData>({ title: '', statusUI: 'DRAFT', categoryId: '', authorId: '', destinationId: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { authors, loadingAuthors } = useAuthors(isOpen);
  const { categories, loadingCategories } = useCategoriesFetch(isOpen);
  const { destinations, loadingDestinations } = useDestinationsFetch(isOpen);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => titleRef.current?.focus(), 100);
    } else {
      setForm({ title: '', statusUI: 'DRAFT', categoryId: '', authorId: '', destinationId: '' });
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
    if (!form.categoryId) errs.categoryId = 'Veuillez sélectionner une catégorie.';
    if (!form.authorId) errs.authorId = 'Veuillez sélectionner un auteur.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setApiError(null);

    try {
      const res = await fetch(`${API}/admin/articles/quick`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          title: form.title.trim(),
          status: form.statusUI,
          categoryId: parseInt(form.categoryId, 10),
          authorId: parseInt(form.authorId, 10),
          destinationId: form.destinationId ? parseInt(form.destinationId, 10) : undefined,
        }),
      });

      if (!form.categoryId || !form.authorId) {
        setApiError('Catégorie ou auteur invalide.');
        return;
      }

      if (!res.ok) {
        const json = await res.json();
        const msg = json?.errors?.[0]?.message ?? json?.message ?? 'Erreur lors de la création.';
        setApiError(msg);
        return;
      }

      const json = await res.json();
      const id = json?.data?.id ?? json?.data?.article?.id ?? json?.id;

      if (!id) {
        setApiError("ID de l'article introuvable.");
        return;
      }

      // Re-fetch l'article complet (avec destinationId, category, author, etc.)
      // après la création rapide, qui ne renvoie qu'un sous-ensemble de champs.
      const fullArticleJson = await fetch(`${API}/admin/articles/${id}`, { headers: getAuthHeaders() }).then((r) => r.json());
      const fullArticle = extractArticle(fullArticleJson);

      if (!fullArticle) {
        setApiError("Impossible de récupérer l'article créé.");
        return;
      }

      onSuccess?.(fullArticle);
      onClose?.();
    } catch {
      setApiError('Erreur réseau. Vérifiez votre connexion et réessayez.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form, updateField, errors, submitting, apiError,
    authors, loadingAuthors, categories, loadingCategories, destinations, loadingDestinations,
    titleRef, handleSubmit,
  };
}