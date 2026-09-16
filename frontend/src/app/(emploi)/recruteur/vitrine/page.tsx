'use client';
// src/app/(emploi)/recruteur/vitrine/page.tsx

import { useState } from 'react';
import { useVitrine } from '@/hooks/useVitrine';
import { useVitrineTabSync } from '@/hooks/useVitrineTabSync';
import { updateVitrine } from '@/services/vitrine.service';
import {
  IdentiteSection, ChiffresSection, CultureSection, MediaSection, InfosSection,
} from '@/components/recruteur/vitrine/VitrineSections';
import ReseauxSection from '@/components/recruteur/vitrine/ReseauxSection';
import VitrineToast from '@/components/recruteur/vitrine/VitrineToast';
import VitrineTopBar from '@/components/recruteur/vitrine/VitrineTopBar';
import VitrineTabNav from '@/components/recruteur/vitrine/VitrineTabNav';
import type { VitrineData } from '@/types/vitrine.types';

export default function MaVitrineEntreprisePage() {
  const { vitrine, loading, setVitrine } = useVitrine();
  const { activeTab, scrollTo } = useVitrineTabSync(!loading && !!vitrine);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  function patch(update: Partial<VitrineData>) {
    setVitrine((prev) => (prev ? { ...prev, ...update } : prev));
  }

  async function handleSave() {
    if (!vitrine) return;
    setSaving(true);
    setToast(null);
    try {
      const saved = await updateVitrine(vitrine);
      setVitrine(saved);
      setToast({ message: 'Vitrine enregistrée avec succès !', type: 'success' });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "L'enregistrement a échoué. Vérifiez votre connexion.";
      setToast({ message: msg, type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  if (loading || !vitrine) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-[3px] border-[#E8622A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <VitrineTopBar saving={saving} onSave={handleSave} />
      <VitrineTabNav activeTab={activeTab} onNavigate={scrollTo} />

      <div className="flex-1 overflow-y-auto p-6 space-y-5 pb-16">
        <IdentiteSection vitrine={vitrine} onChange={patch} />
        <ChiffresSection vitrine={vitrine} onChange={patch} />
        <CultureSection vitrine={vitrine} onChange={patch} />
        <MediaSection vitrine={vitrine} onChange={patch} />
        <InfosSection vitrine={vitrine} onChange={patch} />
        <ReseauxSection vitrine={vitrine} onChange={patch} />
      </div>

      {toast && <VitrineToast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
