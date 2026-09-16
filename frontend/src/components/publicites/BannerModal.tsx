// src/components/publicites/BannerModal.tsx
"use client";
import React, { useRef, useState } from 'react';
import { apiFetch } from '@/lib/backoffice/apiFetch';
import { ModalOverlay, ModalActions, Field, inputCls } from './ui';
import type { Banner, BannerType } from './types';
import { toInputDate } from './types';

interface BannerFormData {
  officialWebSite: string;
  description: string;
  advertiser: string;
  campaign: string;
  type: BannerType;
  htmlCode?: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
}

interface BannerModalProps {
  banner?: Banner | null;
  zoneId: number;
  onClose: () => void;
  onSaved: () => void;
  onToast: (msg: string, type: 'success' | 'error') => void;
}

const BannerModal = ({ banner, zoneId, onClose, onSaved, onToast }: BannerModalProps) => {
  const isEdit = !!banner;
  const [form, setForm] = useState<BannerFormData>({
    officialWebSite: banner?.officialWebSite ?? '',
    description: banner?.description ?? '',
    advertiser: banner?.advertiser ?? '',
    campaign: banner?.campaign ?? '',
    type: banner?.type ?? 'IMAGE_JPG',
    htmlCode: banner?.htmlCode ?? '',
    startDate: banner ? toInputDate(banner.startDate) : '',
    endDate: banner ? toInputDate(banner.endDate) : '',
    imageUrl: banner?.imageUrl ?? '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleChange(k: keyof BannerFormData, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit() {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('advertiser', form.advertiser);
      fd.append('campaign', form.campaign);
      fd.append('officialWebSite', form.officialWebSite);
      fd.append('description', form.description);
      fd.append('type', form.type);
      fd.append('startDate', new Date(form.startDate).toISOString());
      fd.append('endDate', new Date(form.endDate).toISOString());

      if (!isEdit) fd.append('advertisingId', String(zoneId));

      if (form.type === 'HTML_JS') {
        if (!form.htmlCode?.trim()) throw new Error('Le code HTML est requis');
        fd.append('htmlCode', form.htmlCode);
      }

      if (form.type === 'IMAGE_JPG') {
        if (!imageFile && !isEdit) throw new Error('Veuillez sélectionner une image');
        if (imageFile) fd.append('image', imageFile);
      }

      if (isEdit) {
        await apiFetch(`/admin/advertising/banners/${banner.id}`, { method: 'PATCH', body: fd });
      } else {
        await apiFetch('/admin/advertising/banners', { method: 'POST', body: fd });
      }

      onToast('Succès', 'success');
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
      <h2 className="text-lg font-bold text-gray-900 mb-6">{isEdit ? 'Modifier la Bannière' : 'Nouvelle Bannière'}</h2>
      <div className="space-y-4">
        <Field label="Annonceur">
          <input type="text" value={form.advertiser} onChange={(e) => handleChange('advertiser', e.target.value)} placeholder="Agence Voyage Plus" className={inputCls} />
        </Field>
        <Field label="Site Web Officiel">
          <input type="url" value={form.officialWebSite} onChange={(e) => handleChange('officialWebSite', e.target.value)} placeholder="https://www.voyageplus.com" className={inputCls} />
        </Field>
        <Field label="Description">
          <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} placeholder="Description de la bannière" className={inputCls} />
        </Field>
        <Field label="Campagne">
          <input type="text" value={form.campaign} onChange={(e) => handleChange('campaign', e.target.value)} placeholder="Campagne Été 2025" className={inputCls} />
        </Field>
        <Field label="Type de bannière">
          <select value={form.type} onChange={(e) => handleChange('type', e.target.value as BannerType)} className={inputCls}>
            <option value="IMAGE_JPG">Image JPG</option>
            <option value="HTML_JS">Code HTML/JS</option>
          </select>
        </Field>

        {form.type === 'IMAGE_JPG' ? (
          <Field label="Image (JPG/PNG/WebP, max 5 MB)">
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors"
            >
              {imageFile ? (
                <p className="text-sm text-gray-700 font-medium">{imageFile.name}</p>
              ) : banner?.imageUrl ? (
                <p className="text-xs text-gray-500">Image actuelle — cliquez pour remplacer</p>
              ) : (
                <p className="text-xs text-gray-400">Cliquez pour sélectionner une image</p>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
          </Field>
        ) : (
          <Field label="Code HTML/JS">
            <textarea
              value={form.htmlCode}
              onChange={(e) => handleChange('htmlCode', e.target.value)}
              rows={5}
              placeholder="<script>...</script>"
              className={`${inputCls} font-mono text-xs resize-none`}
            />
          </Field>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Date de début">
            <input type="date" value={form.startDate} onChange={(e) => handleChange('startDate', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Date de fin">
            <input type="date" value={form.endDate} onChange={(e) => handleChange('endDate', e.target.value)} className={inputCls} />
          </Field>
        </div>
      </div>
      <ModalActions onClose={onClose} onSave={handleSubmit} saving={saving} label={isEdit ? 'Enregistrer' : 'Créer'} />
    </ModalOverlay>
  );
};

export default BannerModal;