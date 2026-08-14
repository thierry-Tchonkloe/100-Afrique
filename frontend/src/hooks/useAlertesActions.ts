// src/hooks/useAlertesActions.ts
// Regroupe les actions CRUD de la page "Mes Alertes" (créer, éditer,
// activer/désactiver, supprimer), avec repli optimiste identique à
// l'original en cas d'échec API.

import { useState } from 'react';
import {
  createAlerte, updateAlerte, toggleAlerte, deleteAlerte,
} from '@/services/alertes.service';
import type { AlerteJob, AlerteFormData } from '@/types/alertes.types';

export function useAlertesActions(
  setAlertes: React.Dispatch<React.SetStateAction<AlerteJob[]>>,
) {
  const [saving, setSaving] = useState(false);

  async function handleCreate(data: AlerteFormData, onDone: () => void) {
    setSaving(true);
    try {
      const raw = await createAlerte(data);
      // Garantir que l'objet retourné est complet même si l'API fail partiellement
      const created: AlerteJob = {
        id: raw.id ?? `alert-${Date.now()}`,
        name: raw.name ?? data.name,
        keywords: raw.keywords ?? data.keywords ?? [],
        location: raw.location ?? data.location ?? '',
        contractTypes: raw.contractTypes ?? data.contractTypes ?? [],
        sector: raw.sector ?? data.sector ?? '',
        frequency: raw.frequency ?? data.frequency ?? 'daily',
        isActive: raw.isActive ?? data.isActive ?? true,
        createdAt: raw.createdAt ?? new Date().toISOString(),
        lastSentAt: raw.lastSentAt,
      };
      setAlertes((prev) => [created, ...prev]);
    } catch {
      const mock: AlerteJob = {
        ...data,
        id: `alert-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setAlertes((prev) => [mock, ...prev]);
    } finally {
      setSaving(false);
      onDone();
    }
  }

  async function handleUpdate(editingAlerte: AlerteJob, data: AlerteFormData, onDone: () => void) {
    setSaving(true);
    try {
      const updated = await updateAlerte(editingAlerte.id, data);
      setAlertes((prev) => prev.map((a) => (a.id === editingAlerte.id ? updated : a)));
    } catch {
      setAlertes((prev) =>
        prev.map((a) => (a.id === editingAlerte.id ? { ...editingAlerte, ...data } : a))
      );
    } finally {
      setSaving(false);
      onDone();
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    // Optimistic update
    setAlertes((prev) => prev.map((a) => (a.id === id ? { ...a, isActive } : a)));
    try {
      await toggleAlerte(id, isActive);
    } catch {
      // Revert on error
      setAlertes((prev) => prev.map((a) => (a.id === id ? { ...a, isActive: !isActive } : a)));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette alerte définitivement ?')) return;
    setAlertes((prev) => prev.filter((a) => a.id !== id));
    try {
      await deleteAlerte(id);
    } catch {
      // If API fails, silently keep deleted (UX stays clean)
    }
  }

  return { saving, handleCreate, handleUpdate, handleToggle, handleDelete };
}
