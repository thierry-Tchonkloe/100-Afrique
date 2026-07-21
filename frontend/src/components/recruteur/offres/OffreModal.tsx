'use client';
// src/components/recruteur/OffreModal.tsx
// FIX: Suppression du bloc <style jsx> qui causait le SyntaxError / ChunkLoadError
// dans Next.js App Router. Remplacement par des classes Tailwind pures.

import { useState, useRef, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import type { OffreFormData, OffreFormStep1, ContractType, RemotePolicy } from '@/types/offres.types';
import { SECTORS, CONTRACT_TYPES, REMOTE_OPTIONS, REQUIRED_SKILLS_SUGGESTIONS } from '@/types/offres.types';
import clsx from 'clsx';

const STEPS = ["L'Essentiel", 'Le Descriptif', 'Critères', 'Validation'];

const EMPTY_FORM: OffreFormData = {
  step1: { title: '', sector: '', contractType: 'CDI', location: '', remote: 'none' },
  step2: { missions: '', profile: '', advantages: '' },
  step3: { requiredSkills: [], languages: [], softwares: [] },
};

// ── Shared input class (Tailwind only — no styled-jsx) ────────────────────────
const INPUT_CLS =
  'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white ' +
  'focus:outline-none focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition';

const LABEL_CLS = 'block text-xs font-medium text-gray-500 mb-1.5';

// ── Tag input ─────────────────────────────────────────────────────────────────
function TagInput({ tags, onChange, suggestions, placeholder }: {
  tags: string[]; onChange: (t: string[]) => void;
  suggestions?: string[]; placeholder: string;
}) {
  const [input, setInput] = useState('');
  const [showSug, setShowSug] = useState(false);

  const filtered = suggestions?.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  ).slice(0, 5) ?? [];

  function add(val: string) {
    const v = val.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput(''); setShowSug(false);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((t) => (
          <span key={t}
            className="flex items-center gap-1 bg-[#FFF3EC] text-[#E8622A] text-xs font-semibold
                       px-2.5 py-1 rounded-full border border-[#FDDCC8]">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))}>
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowSug(true); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(input); } }}
          onBlur={() => setTimeout(() => setShowSug(false), 150)}
          placeholder={placeholder}
          className={INPUT_CLS}
        />
        {showSug && filtered.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200
                          rounded-xl shadow-lg z-10 py-1 overflow-hidden">
            {filtered.map((s) => (
              <button key={s} type="button" onMouseDown={() => add(s)}
                className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition">
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────────────────────
function StyledTextarea({ value, onChange, placeholder, rows = 5 }: {
  value: string; onChange: (v: string) => void; placeholder: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={INPUT_CLS + ' resize-none'}
    />
  );
}

// ── Stepper dot ───────────────────────────────────────────────────────────────
function StepDot({ index, current, label }: { index: number; current: number; label: string }) {
  const done    = index < current;
  const active  = index === current;
  return (
    <div className="flex items-center gap-2 flex-1 last:flex-none">
      <div className={clsx(
        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition',
        done   ? 'bg-green-500 text-white'
        : active ? 'bg-[#E8622A] text-white'
        :          'bg-gray-100 text-gray-400'
      )}>
        {done ? <Check size={12} /> : index + 1}
      </div>
      <span className={clsx(
        'text-xs font-medium hidden sm:block',
        active ? 'text-[#E8622A]' : done ? 'text-green-500' : 'text-gray-400'
      )}>
        {label}
      </span>
      {index < STEPS.length - 1 && (
        <div className="flex-1 h-px bg-gray-100 mx-1" />
      )}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
interface Props {
  initial?: OffreFormData;
  onSave: (data: OffreFormData) => void;
  onClose: () => void;
  saving?: boolean;
  mode?: 'create' | 'edit';
}

export default function OffreModal({ initial, onSave, onClose, saving = false, mode = 'create' }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OffreFormData>(initial ?? EMPTY_FORM);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function k(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  function setS1<K extends keyof OffreFormStep1>(k: K, v: OffreFormStep1[K]) {
    setForm((f) => ({ ...f, step1: { ...f.step1, [k]: v } }));
  }
  function setS2(k: keyof typeof form.step2, v: string) {
    setForm((f) => ({ ...f, step2: { ...f.step2, [k]: v } }));
  }
  function setS3(k: keyof typeof form.step3, v: string[]) {
    setForm((f) => ({ ...f, step3: { ...f.step3, [k]: v } }));
  }

  const canNext = Boolean([
    form.step1.title && form.step1.sector && form.step1.contractType && form.step1.location,
    form.step2.missions && form.step2.profile,
    true,
    true,
  ][step]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-gray-900">
            {mode === 'edit' ? "Modifier l'offre" : 'Publier une nouvelle offre'}
          </h2>
          <button onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition">
            <X size={18} />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-50 flex-shrink-0">
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => <StepDot key={i} index={i} current={step} label={s} />)}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ── Step 1: L'Essentiel ── */}
          {step === 0 && (
            <>
              <div>
                <label className={LABEL_CLS}>Titre du poste *</label>
                <input value={form.step1.title}
                  onChange={(e) => setS1('title', e.target.value)}
                  placeholder="ex: Chef de Réception H/F"
                  className={INPUT_CLS} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLS}>Secteur *</label>
                  <select value={form.step1.sector}
                    onChange={(e) => setS1('sector', e.target.value)}
                    className={INPUT_CLS}>
                    <option value="">Choisir…</option>
                    {SECTORS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Type de contrat *</label>
                  <select value={form.step1.contractType}
                    onChange={(e) => setS1('contractType', e.target.value as ContractType)}
                    className={INPUT_CLS}>
                    {CONTRACT_TYPES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Localisation *</label>
                  <input value={form.step1.location}
                    onChange={(e) => setS1('location', e.target.value)}
                    placeholder="ex: Paris 8ème" className={INPUT_CLS} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Télétravail</label>
                  <select value={form.step1.remote}
                    onChange={(e) => setS1('remote', e.target.value as RemotePolicy)}
                    className={INPUT_CLS}>
                    {(Object.entries(REMOTE_OPTIONS) as [RemotePolicy, string][]).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLS}>Salaire min (€/an)</label>
                  <input type="number" value={form.step1.salaryMin ?? ''}
                    onChange={(e) => setS1('salaryMin', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="28 000" className={INPUT_CLS} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Salaire max (€/an)</label>
                  <input type="number" value={form.step1.salaryMax ?? ''}
                    onChange={(e) => setS1('salaryMax', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="35 000" className={INPUT_CLS} />
                </div>
              </div>
            </>
          )}

          {/* ── Step 2: Le Descriptif ── */}
          {step === 1 && (
            <>
              <div>
                <label className={LABEL_CLS}>Description des missions *</label>
                <StyledTextarea value={form.step2.missions}
                  onChange={(v) => setS2('missions', v)}
                  placeholder="Décrivez les missions du poste…" />
              </div>
              <div>
                <label className={LABEL_CLS}>Profil recherché *</label>
                <StyledTextarea value={form.step2.profile}
                  onChange={(v) => setS2('profile', v)}
                  placeholder="Décrivez le profil idéal…" rows={4} />
              </div>
              <div>
                <label className={LABEL_CLS}>Avantages &amp; conditions</label>
                <StyledTextarea value={form.step2.advantages}
                  onChange={(v) => setS2('advantages', v)}
                  placeholder="Avantages, mutuelle, tickets-restaurant…" rows={3} />
              </div>
            </>
          )}

          {/* ── Step 3: Critères ── */}
          {step === 2 && (
            <>
              <div>
                <label className={LABEL_CLS}>Compétences requises</label>
                <TagInput tags={form.step3.requiredSkills}
                  onChange={(t) => setS3('requiredSkills', t)}
                  suggestions={REQUIRED_SKILLS_SUGGESTIONS}
                  placeholder="Tapez ou choisissez une compétence…" />
              </div>
              <div>
                <label className={LABEL_CLS}>Langues</label>
                <TagInput tags={form.step3.languages}
                  onChange={(t) => setS3('languages', t)}
                  placeholder="ex: Anglais courant, Espagnol…" />
              </div>
              <div>
                <label className={LABEL_CLS}>Logiciels / Outils</label>
                <TagInput tags={form.step3.softwares}
                  onChange={(t) => setS3('softwares', t)}
                  placeholder="ex: PMS Opera, Excel…" />
              </div>
            </>
          )}

          {/* ── Step 4: Validation preview ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2 border border-gray-100">
                <p className="font-bold text-gray-900 text-base">{form.step1.title || '—'}</p>
                <div className="flex flex-wrap gap-2">
                  {[form.step1.sector, form.step1.contractType, form.step1.location]
                    .filter(Boolean)
                    .map((t, i) => (
                      <span key={i} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {t}
                      </span>
                    ))}
                  {form.step1.salaryMin && form.step1.salaryMax && (
                    <span className="text-xs bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded-full font-semibold">
                      {form.step1.salaryMin.toLocaleString()} – {form.step1.salaryMax.toLocaleString()} €/an
                    </span>
                  )}
                </div>
              </div>
              {form.step2.missions && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Missions</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {form.step2.missions.slice(0, 300)}{form.step2.missions.length > 300 ? '…' : ''}
                  </p>
                </div>
              )}
              {form.step3.requiredSkills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Compétences</p>
                  <div className="flex flex-wrap gap-2">
                    {form.step3.requiredSkills.map((s) => (
                      <span key={s} className="text-xs bg-[#FFF3EC] text-[#E8622A] border border-[#FDDCC8] px-2.5 py-1 rounded-full font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-[#FFF3EC] border border-[#FDDCC8] rounded-xl p-3">
                <p className="text-xs font-semibold text-[#E8622A]">
                  ✓ Votre offre sera publiée immédiatement après validation.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={step === 0 ? onClose : () => setStep((s) => s - 1)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition"
          >
            <ChevronLeft size={15} />
            {step === 0 ? 'Annuler' : 'Retour'}
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="flex items-center gap-1.5 bg-[#E8622A] hover:bg-[#D45520] text-white
                         text-sm font-semibold px-5 py-2 rounded-xl transition disabled:opacity-50
                         disabled:cursor-not-allowed"
            >
              Suivant <ChevronRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSave(form)}
              disabled={saving}
              className="flex items-center gap-1.5 bg-[#E8622A] hover:bg-[#D45520] text-white
                         text-sm font-semibold px-5 py-2 rounded-xl transition disabled:opacity-60"
            >
              <Check size={15} />
              {saving ? 'Publication…' : "Publier l'offre"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
