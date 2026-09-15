// src/components/publicites/ZoneModal.tsx
"use client";
import React, { useState } from 'react';
import { apiFetch } from '@/lib/backoffice/apiFetch';
import { ModalOverlay, ModalActions, Field, Toggle, inputCls } from './ui';
import type { AdZone } from './types';

interface ZoneFormData {
  name: string; slug: string; width: string; height: string; path: string; isEnabled: boolean;
}

interface ZoneModalProps {
  zone?: AdZone | null;
  onClose: () => void;
  onSaved: () => void;
  onToast: (msg: string, type: 'success' | 'error') => void;
}

function autoSlug(name: string) {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const ZoneModal = ({ zone, onClose, onSaved, onToast }: ZoneModalProps) => {
  const isEdit = !!zone;
  const [form, setForm] = useState<ZoneFormData>({
    name: zone?.name ?? '',
    slug: zone?.slug ?? '',
    width: zone?.width?.toString() ?? '',
    height: zone?.height?.toString() ?? '',
    path: zone?.path ?? '',
    isEnabled: zone?.isEnabled ?? true,
  });
  const [saving, setSaving] = useState(false);

  function handleChange(k: keyof ZoneFormData, v: string | boolean) {
    setForm((p) => {
      const next = { ...p, [k]: v };
      if (k === 'name' && !isEdit) next.slug = autoSlug(v as string);
      return next;
    });
  }

  async function handleSubmit() {
    setSaving(true);
    try {
      const body = {
        name: form.name, slug: form.slug,
        width: parseInt(form.width), height: parseInt(form.height),
        path: form.path, isEnabled: form.isEnabled,
      };
      if (isEdit) {
        await apiFetch(`/admin/advertising/zones/${zone.id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
        onToast('Zone mise à jour avec succès', 'success');
      } else {
        await apiFetch('/admin/advertising/zones', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
        onToast('Zone créée avec succès', 'success');
      }
      onSaved();
      onClose();
    } catch (e) {
      onToast((e as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <h2 className="text-lg font-bold text-gray-900 mb-6">{isEdit ? 'Modifier la Zone' : 'Nouvelle Zone Publicitaire'}</h2>
      <div className="space-y-4">
        <Field label="Nom de la zone">
          <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Ex: Top Banner Accueil" className={inputCls} />
        </Field>
        <Field label="Slug">
          <input type="text" value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} placeholder="top-banner-accueil" className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Largeur (px)">
            <input type="number" value={form.width} onChange={(e) => handleChange('width', e.target.value)} placeholder="728" className={inputCls} />
          </Field>
          <Field label="Hauteur (px)">
            <input type="number" value={form.height} onChange={(e) => handleChange('height', e.target.value)} placeholder="90" className={inputCls} />
          </Field>
        </div>
        <Field label="Chemin URL">
          <input type="text" value={form.path} onChange={(e) => handleChange('path', e.target.value)} placeholder="/accueil, /articles/*, /" className={inputCls} />
        </Field>
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-medium text-gray-700">Zone activée</span>
          <Toggle enabled={form.isEnabled} onChange={() => handleChange('isEnabled', !form.isEnabled)} />
        </div>
      </div>
      <ModalActions onClose={onClose} onSave={handleSubmit} saving={saving} label={isEdit ? 'Enregistrer' : 'Créer'} />
    </ModalOverlay>
  );
};

export default ZoneModal;