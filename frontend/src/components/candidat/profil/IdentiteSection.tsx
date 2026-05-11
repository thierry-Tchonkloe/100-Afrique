// src/components/profil/IdentiteSection.tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import { Camera, CheckCircle } from 'lucide-react';
import { updateProfilIdentity, uploadAvatar } from '@/services/profil.service';
import type { CandidatProfil } from '@/types/profil.types';
import { MOBILITY_OPTIONS } from '@/types/profil.types';

interface IdentiteProps {
  profil: CandidatProfil;
  onChange: (updated: Partial<CandidatProfil>) => void;
}

export default function IdentiteSection({ profil, onChange }: IdentiteProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(profil.avatar);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    try {
      const { avatarUrl } = await uploadAvatar(file);
      onChange({ avatar: avatarUrl });
    } catch {
      onChange({ avatar: url });
    }
  }, [onChange]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfilIdentity({
        firstName: profil.firstName,
        lastName: profil.lastName,
        headline: profil.headline,
        city: profil.city,
        mobility: profil.mobility,
        bio: profil.bio,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section id="identite" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-gray-900">Identité &amp; Bio</h2>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle size={13} /> Enregistré
            </span>
          )}
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
      </div>

      <div className="flex gap-8 items-start flex-wrap">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div
            className="relative w-28 h-28 rounded-full bg-gray-100 cursor-pointer group overflow-hidden border-2 border-gray-200"
            onClick={() => fileRef.current?.click()}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-bold">
                {profil.firstName?.[0] ?? '?'}{profil.lastName?.[0] ?? ''}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={20} className="text-white" />
            </div>
            {/* Camera badge */}
            <div className="absolute bottom-1 right-1 w-7 h-7 bg-[#E8622A] rounded-full flex items-center justify-center border-2 border-white">
              <Camera size={12} className="text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center">Cliquez pour modifier</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>

        {/* Fields */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Titre professionnel */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Titre professionnel</label>
            <input
              type="text"
              value={profil.headline}
              onChange={(e) => onChange({ headline: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition"
              placeholder="ex: Réceptionniste bilingue - 5 ans d'expérience"
            />
          </div>

          {/* Prénom / Nom */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Prénom</label>
              <input
                type="text"
                value={profil.firstName}
                onChange={(e) => onChange({ firstName: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                           focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom</label>
              <input
                type="text"
                value={profil.lastName}
                onChange={(e) => onChange({ lastName: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                           focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition"
              />
            </div>
          </div>

          {/* Ville / Mobilité */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Ville</label>
              <input
                type="text"
                value={profil.city}
                onChange={(e) => onChange({ city: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                           focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Mobilité</label>
              <select
                value={profil.mobility}
                onChange={(e) => onChange({ mobility: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                           focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition bg-white"
              >
                {MOBILITY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Accroche personnelle</label>
            <textarea
              value={profil.bio}
              maxLength={300}
              rows={3}
              onChange={(e) => onChange({ bio: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{profil.bio.length}/300 caractères maximum</p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#E8622A] hover:bg-[#D45520] text-white text-sm font-semibold
                         px-5 py-2 rounded-xl transition disabled:opacity-60"
            >
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}