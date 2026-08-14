'use client';
// src/app/(emploi)/candidat/alertes/page.tsx

import { useState } from 'react';
import { useAlertes } from '@/hooks/useAlertes';
import { useAlertesActions } from '@/hooks/useAlertesActions';
import AlerteModal from '@/components/candidat/alertes/AlerteModal';
import AlertesSkeleton from '@/components/candidat/alertes/AlertesSkeleton';
import AlertesPageHeader from '@/components/candidat/alertes/AlertesPageHeader';
import AlertesEmptyState from '@/components/candidat/alertes/AlertesEmptyState';
import AlertesList from '@/components/candidat/alertes/AlertesList';
import type { AlerteJob } from '@/types/alertes.types';

export default function MesAlertesPage() {
  const { alertes, loading, setAlertes } = useAlertes();
  const { saving, handleCreate, handleUpdate, handleToggle, handleDelete } = useAlertesActions(setAlertes);

  const [showModal, setShowModal] = useState(false);
  const [editingAlerte, setEditingAlerte] = useState<AlerteJob | null>(null);

  function openCreate() { setEditingAlerte(null); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditingAlerte(null); }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <AlertesPageHeader onCreate={openCreate} />

      {loading ? (
        <AlertesSkeleton />
      ) : alertes.length === 0 ? (
        <AlertesEmptyState onCreate={openCreate} />
      ) : (
        <AlertesList
          alertes={alertes}
          onToggle={handleToggle}
          onEdit={(a) => { setEditingAlerte(a); setShowModal(true); }}
          onDelete={handleDelete}
        />
      )}

      {showModal && !editingAlerte && (
        <AlerteModal
          onSave={(data) => handleCreate(data, closeModal)}
          onClose={closeModal}
          saving={saving}
        />
      )}
      {showModal && editingAlerte && (
        <AlerteModal
          initial={editingAlerte}
          onSave={(data) => handleUpdate(editingAlerte, data, closeModal)}
          onClose={closeModal}
          saving={saving}
        />
      )}
    </div>
  );
}
