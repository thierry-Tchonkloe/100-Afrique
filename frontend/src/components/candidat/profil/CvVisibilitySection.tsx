// src/components/profil/CvVisibilitySection.tsx
'use client';

import { useRef, useState } from 'react';
import { FileText, Upload, Trash2, RefreshCw, Save } from 'lucide-react';
import { uploadCv, deleteCv, updateVisibility } from '@/services/profil.service';
import type { CandidatProfil, AvailabilityOption } from '@/types/profil.types';
import { AVAILABILITY_LABELS } from '@/types/profil.types';

// ── CV Section ─────────────────────────────────────────────────────────────────

interface CvProps {
  cvFile?: { name: string; updatedAt: string };
  onChange: (cv: { name: string; updatedAt: string } | undefined) => void;
}

export function CvSection({ cvFile, onChange }: CvProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (file.type !== 'application/pdf') {
      setError('Format PDF uniquement'); return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Taille maximale : 2 Mo'); return;
    }
    setError(null);
    setUploading(true);
    try {
      const result = await uploadCv(file);
      onChange({ name: result.fileName, updatedAt: result.updatedAt });
    } catch {
      onChange({ name: file.name, updatedAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) });
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Supprimer le CV ?')) return;
    try { await deleteCv(); } catch {}
    onChange(undefined);
  }

  return (
    <section id="documents" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-bold text-gray-900 mb-5">CV &amp; Documents</h2>

      {cvFile ? (
        <div className="border border-gray-100 rounded-2xl p-6 flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
            <FileText size={28} className="text-red-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-800">{cvFile.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">Dernière modification : {cvFile.updatedAt}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 border border-gray-200 text-gray-700 text-xs font-medium
                         px-4 py-2 rounded-xl hover:bg-gray-50 transition disabled:opacity-60"
            >
              <RefreshCw size={13} /> Remplacer
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 border border-red-100 text-red-500 text-xs font-medium
                         px-4 py-2 rounded-xl hover:bg-red-50 transition"
            >
              <Trash2 size={13} /> Supprimer
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center
                     gap-3 cursor-pointer hover:border-[#E8622A]/50 hover:bg-[#FFFAF8] transition group"
        >
          <Upload size={28} className="text-gray-300 group-hover:text-[#E8622A] transition" />
          <p className="text-sm text-gray-500 font-medium">Déposez votre CV ici</p>
          <p className="text-xs text-gray-400">PDF uniquement · 2 Mo max</p>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      {uploading && <p className="text-xs text-gray-400 mt-2">Téléchargement en cours…</p>}

      <input
        ref={fileRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </section>
  );
}

// ── Visibility Section ────────────────────────────────────────────────────────

interface VisibilityProps {
  isVisible: boolean;
  availability: AvailabilityOption;
  onChange: (update: Pick<CandidatProfil, 'isVisible' | 'availability'>) => void;
}

export function VisibilitySection({ isVisible, availability, onChange }: VisibilityProps) {
  const [saving, setSaving] = useState(false);
  const [localVisible, setLocalVisible] = useState(isVisible);
  const [localAvail, setLocalAvail] = useState<AvailabilityOption>(availability);

  async function handleSave() {
    setSaving(true);
    try {
      await updateVisibility({ isVisible: localVisible, availability: localAvail });
      onChange({ isVisible: localVisible, availability: localAvail });
    } catch {
      onChange({ isVisible: localVisible, availability: localAvail });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section id="visibilite" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-bold text-gray-900 mb-5">Visibilité &amp; Paramètres</h2>

      {/* Toggle */}
      <div className="flex items-start justify-between gap-4 pb-5 border-b border-gray-50">
        <div>
          <p className="text-sm font-semibold text-gray-800">Activer mon profil</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {localVisible
              ? 'Votre profil est visible par les recruteurs'
              : 'Votre profil est masqué des résultats de recherche'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setLocalVisible((v) => !v)}
          className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${
            localVisible ? 'bg-[#E8622A]' : 'bg-gray-200'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
              localVisible ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Availability */}
      <div className="pt-5">
        <label className="block text-sm font-semibold text-gray-800 mb-2">Disponibilité</label>
        <select
          value={localAvail}
          onChange={(e) => setLocalAvail(e.target.value as AvailabilityOption)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                     focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition bg-white"
        >
          {(Object.entries(AVAILABILITY_LABELS) as [AvailabilityOption, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end mt-5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#D45520] text-white text-sm
                     font-semibold px-5 py-2.5 rounded-xl transition disabled:opacity-60"
        >
          <Save size={14} />
          {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
        </button>
      </div>
    </section>
  );
}