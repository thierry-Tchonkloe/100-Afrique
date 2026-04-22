// src/components/alertes/AlerteModal.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Plus, Zap, Calendar, CalendarDays } from 'lucide-react';
import type {
  AlerteFormData,
  AlertFrequency,
  ContractType,
} from '@/types/alertes.types';
import {
  EMPTY_FORM,
  CONTRACT_TYPES,
  SECTORS,
  FREQUENCY_LABELS,
} from '@/types/alertes.types';
import clsx from 'clsx';

// ── Frequency option ──────────────────────────────────────────────────────────

const FREQ_OPTIONS: { key: AlertFrequency; label: string; icon: typeof Zap; desc: string }[] = [
  { key: 'realtime', label: 'Temps réel', icon: Zap,         desc: "Dès qu'une offre est publiée" },
  { key: 'daily',    label: 'Quotidien',  icon: Calendar,    desc: 'Un récapitulatif chaque matin' },
  { key: 'weekly',   label: 'Hebdo',      icon: CalendarDays, desc: 'Un condensé par semaine' },
];

// ── Tag input ─────────────────────────────────────────────────────────────────

function TagInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[];
  onChange: (t: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState('');

  function add() {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) onChange([...tags, trimmed]);
    setInput('');
  }

  return (
    <div className="flex flex-wrap gap-2 p-2.5 border border-gray-200 rounded-xl min-h-[42px]
                    focus-within:ring-2 focus-within:ring-[#E8622A]/30 focus-within:border-[#E8622A] transition">
      {tags.map((t) => (
        <span key={t}
          className="flex items-center gap-1 bg-[#FFF3EC] text-[#E8622A] text-xs font-semibold
                     px-2.5 py-1 rounded-full border border-[#FDDCC8]">
          {t}
          <button onClick={() => onChange(tags.filter((x) => x !== t))} className="hover:text-[#D45520]">
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
        onBlur={add}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-24 text-sm outline-none bg-transparent placeholder:text-gray-400"
      />
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

interface AlerteModalProps {
  initial?: AlerteFormData;
  onSave: (data: AlerteFormData) => void;
  onClose: () => void;
  saving?: boolean;
}

export default function AlerteModal({ initial, onSave, onClose, saving = false }: AlerteModalProps) {
  const [form, setForm] = useState<AlerteFormData>(initial ?? EMPTY_FORM);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function setField<K extends keyof AlerteFormData>(k: K, v: AlerteFormData[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function toggleContract(c: ContractType) {
    setField('contractTypes', form.contractTypes.includes(c)
      ? form.contractTypes.filter((x) => x !== c)
      : [...form.contractTypes, c]);
  }

  const isValid = form.name.trim().length > 0 && form.keywords.length > 0;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-gray-900 text-base">
            {initial ? 'Modifier l\'alerte' : 'Créer une nouvelle alerte'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Nom de l'alerte <span className="text-red-400">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="ex: Direction Hôtel Côte d'Azur"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Mots-clés <span className="text-red-400">*</span>
            </label>
            <TagInput
              tags={form.keywords}
              onChange={(t) => setField('keywords', t)}
              placeholder="Tapez un mot-clé et appuyez sur Entrée…"
            />
            <p className="text-xs text-gray-400 mt-1">Appuyez sur Entrée ou virgule pour ajouter.</p>
          </div>

          {/* Location + Radius */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Localisation</label>
              <input
                value={form.location}
                onChange={(e) => setField('location', e.target.value)}
                placeholder="ex: Nice, 06"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                           focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rayon (km)</label>
              <input
                type="number"
                min={0}
                max={200}
                value={form.radius ?? ''}
                onChange={(e) => setField('radius', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Optionnel"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                           focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition"
              />
            </div>
          </div>

          {/* Sector */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Secteur d'activité</label>
            <select
              value={form.sector}
              onChange={(e) => setField('sector', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition bg-white"
            >
              <option value="">Tous les secteurs</option>
              {SECTORS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Contract types */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Types de contrat</label>
            <div className="flex flex-wrap gap-2">
              {CONTRACT_TYPES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleContract(c)}
                  className={clsx(
                    'text-xs font-semibold px-3 py-1.5 rounded-full border transition',
                    form.contractTypes.includes(c)
                      ? 'bg-[#E8622A] text-white border-[#E8622A]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Fréquence d'envoi</label>
            <div className="grid grid-cols-3 gap-2">
              {FREQ_OPTIONS.map(({ key, label, icon: Icon, desc }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setField('frequency', key)}
                  className={clsx(
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition',
                    form.frequency === key
                      ? 'border-[#E8622A] bg-[#FFF3EC]'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  )}
                >
                  <Icon
                    size={18}
                    className={form.frequency === key ? 'text-[#E8622A]' : 'text-gray-400'}
                  />
                  <span className={clsx(
                    'text-xs font-semibold',
                    form.frequency === key ? 'text-[#E8622A]' : 'text-gray-600'
                  )}>
                    {label}
                  </span>
                  <span className="text-[10px] text-gray-400 leading-tight">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition">
            Annuler
          </button>
          <button
            onClick={() => isValid && onSave(form)}
            disabled={!isValid || saving}
            className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#D45520] text-white text-sm
                       font-semibold px-5 py-2.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={15} />
            {saving ? 'Enregistrement…' : initial ? 'Mettre à jour' : 'Créer l\'alerte'}
          </button>
        </div>
      </div>
    </div>
  );
}