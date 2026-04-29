// src/app/(emploi)/candidat/alertes/page.tsx
'use client';

import { useState } from 'react';
import { Plus, Bell } from 'lucide-react';
import { useAlertes } from '@/hooks/useAlertes';
import {
  createAlerte,
  updateAlerte,
  toggleAlerte,
  deleteAlerte,
} from '@/services/alertes.service';
import AlerteCard from '@/components/candidat/alertes/AlerteCard';
import AlerteModal from '@/components/candidat/alertes/AlerteModal';
import AlertesSkeleton from '@/components/candidat/alertes/AlertesSkeleton';
import type { AlerteJob, AlerteFormData } from '@/types/alertes.types';

export default function MesAlertesPage() {
  const { alertes, loading, setAlertes } = useAlertes();
  const [showModal, setShowModal] = useState(false);
  const [editingAlerte, setEditingAlerte] = useState<AlerteJob | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Create ──────────────────────────────────────────────────────────────────
  async function handleCreate(data: AlerteFormData) {
    setSaving(true);
    try {
      const created = await createAlerte(data);
      setAlertes((prev) => [created, ...prev]);
    } catch {
      // Optimistic fallback
      const mock: AlerteJob = {
        ...data,
        id: `alert-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setAlertes((prev) => [mock, ...prev]);
    } finally {
      setSaving(false);
      setShowModal(false);
    }
  }

  // ── Update ──────────────────────────────────────────────────────────────────
  async function handleUpdate(data: AlerteFormData) {
    if (!editingAlerte) return;
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
      setEditingAlerte(null);
    }
  }

  // ── Toggle ──────────────────────────────────────────────────────────────────
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

  // ── Delete ──────────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette alerte définitivement ?')) return;
    setAlertes((prev) => prev.filter((a) => a.id !== id));
    try {
      await deleteAlerte(id);
    } catch {
      // If API fails, silently keep deleted (UX stays clean)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mes Alertes Job</h1>
          <p className="text-sm text-gray-400 mt-1">
            Configurez vos veilles pour recevoir les nouvelles offres en priorité par email.
          </p>
        </div>
        <button
          onClick={() => { setEditingAlerte(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#D45520] text-white
                     text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm flex-shrink-0"
        >
          <Plus size={16} />
          Créer une nouvelle alerte
        </button>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      {loading ? (
        <AlertesSkeleton />
      ) : alertes.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-[#FFF3EC] rounded-2xl flex items-center justify-center mb-4">
            <Bell size={28} className="text-[#E8622A]" />
          </div>
          <p className="font-semibold text-gray-700 text-base">Aucune alerte configurée</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            Créez votre première alerte pour être notifié dès qu'une offre correspond à vos critères.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-5 flex items-center gap-2 bg-[#E8622A] text-white text-sm font-semibold
                       px-5 py-2.5 rounded-xl hover:bg-[#D45520] transition"
          >
            <Plus size={15} /> Créer ma première alerte
          </button>
        </div>
      ) : (
        /* Alerte cards */
        <div className="space-y-4">
          {alertes.map((alerte) => (
            <AlerteCard
              key={alerte.id}
              alerte={alerte}
              onToggle={handleToggle}
              onEdit={(a) => { setEditingAlerte(a); setShowModal(true); }}
              onDelete={handleDelete}
            />
          ))}
          <p className="text-xs text-gray-400 text-right pt-1">
            {alertes.length} alerte{alertes.length > 1 ? 's' : ''} configurée{alertes.length > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {showModal && !editingAlerte && (
        <AlerteModal
          onSave={handleCreate}
          onClose={() => setShowModal(false)}
          saving={saving}
        />
      )}
      {showModal && editingAlerte && (
        <AlerteModal
          initial={editingAlerte}
          onSave={handleUpdate}
          onClose={() => { setShowModal(false); setEditingAlerte(null); }}
          saving={saving}
        />
      )}
    </div>
  );
}