// src/hooks/useOffresActions.ts
// Regroupe les actions CRUD de la page "Mes Offres" (création, pause,
// archivage, duplication) pour garder la page uniquement responsable
// de l'affichage.

import { useState } from 'react';
import {
  createOffre, updateOffreStatus, duplicateOffre, archiveOffre,
} from '@/services/offres.service';
import type { Offre, OffreFormData, OffreTab } from '@/types/offres.types';

export function useOffresActions(
  offres: Offre[],
  setOffres: (offres: Offre[]) => void,
  setTab: (tab: OffreTab) => void,
) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(form: OffreFormData, onDone: () => void) {
    setSaving(true);
    setError(null);
    try {
      const created = await createOffre(form);
      setOffres([created, ...offres]);
      setTab('online');
      onDone();
    } catch (err) {
      console.error('[handleCreate]', err);
      setError("La publication a échoué. Vérifiez votre connexion et réessayez.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePause(id: string) {
    const offre = offres.find((o) => o.id === id);
    if (!offre) return;
    const nextStatus = offre.status === 'paused' ? 'active' : 'paused';

    setOffres(offres.map((o) => o.id === id ? { ...o, status: nextStatus } : o));

    try {
      await updateOffreStatus(id, nextStatus);
    } catch {
      setOffres(offres.map((o) => o.id === id ? { ...o, status: offre.status } : o));
      setError("Impossible de modifier le statut. Réessayez.");
    }
  }

  async function handleArchive(id: string) {
    if (!confirm('Archiver cette offre ? Elle ne sera plus visible sur le site.')) return;

    const offre = offres.find((o) => o.id === id);
    setOffres(offres.map((o) => o.id === id ? { ...o, status: 'archived' } : o));

    try {
      await archiveOffre(id);
    } catch {
      if (offre) setOffres(offres.map((o) => o.id === id ? offre : o));
      setError("Impossible d'archiver l'offre. Réessayez.");
    }
  }

  async function handleDuplicate(id: string) {
    try {
      const dup = await duplicateOffre(id);
      setOffres([dup, ...offres]);
      setTab('drafts');
    } catch {
      setError("Impossible de dupliquer l'offre. Réessayez.");
    }
  }

  return { saving, error, setError, handleCreate, handlePause, handleArchive, handleDuplicate };
}
