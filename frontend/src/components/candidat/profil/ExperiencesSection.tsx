// src/components/profil/ExperiencesSection.tsx
'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical, X, Check } from 'lucide-react';
import {
  createExperience,
  updateExperience,
  deleteExperience,
} from '../../../services/profil.service';
import type { Experience, ContractType } from '@/types/profil.types';
import { CONTRACT_TYPES } from '@/types/profil.types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPeriod(exp: Experience): string {
  const fmt = (d: string) => {
    const [y, m] = d.split('-');
    const months = ['Jan','Fév','Mars','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];
    return `${months[parseInt(m) - 1]} ${y}`;
  };
  return `${fmt(exp.startDate)} • ${exp.endDate ? fmt(exp.endDate) : 'En poste'} • ${exp.contractType}`;
}

const EMPTY_EXP: Omit<Experience, 'id'> = {
  jobTitle: '',
  companyName: '',
  location: '',
  startDate: '',
  endDate: undefined,
  contractType: 'CDI',
  missions: [''],
};

// ── Experience Form ────────────────────────────────────────────────────────────

interface ExpFormProps {
  initial: Omit<Experience, 'id'>;
  onSave: (data: Omit<Experience, 'id'>) => void;
  onCancel: () => void;
}

function ExperienceForm({ initial, onSave, onCancel }: ExpFormProps) {
  const [form, setForm] = useState(initial);
  const [currentJob, setCurrentJob] = useState(!initial.endDate);

  function setField<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function addMission() { setField('missions', [...form.missions, '']); }
  function removeMission(i: number) {
    setField('missions', form.missions.filter((_, idx) => idx !== i));
  }
  function updateMission(i: number, v: string) {
    const m = [...form.missions]; m[i] = v; setField('missions', m);
  }

  function handleSave() {
    onSave({ ...form, endDate: currentJob ? undefined : form.endDate });
  }

  return (
    <div className="border border-[#E8622A]/30 rounded-2xl p-5 bg-[#FFFAF8] space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Poste occupé</label>
          <input value={form.jobTitle} onChange={(e) => setField('jobTitle', e.target.value)}
            className="input-field" placeholder="Réceptionniste Senior" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Établissement</label>
          <input value={form.companyName} onChange={(e) => setField('companyName', e.target.value)}
            className="input-field" placeholder="Hôtel Negresco" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Ville</label>
          <input value={form.location} onChange={(e) => setField('location', e.target.value)}
            className="input-field" placeholder="Nice" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Type de contrat</label>
          <select value={form.contractType}
            onChange={(e) => setField('contractType', e.target.value as ContractType)}
            className="input-field bg-white">
            {CONTRACT_TYPES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Date de début</label>
          <input type="month" value={form.startDate}
            onChange={(e) => setField('startDate', e.target.value)}
            className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Date de fin</label>
          <input type="month" value={form.endDate ?? ''}
            disabled={currentJob}
            onChange={(e) => setField('endDate', e.target.value || undefined)}
            className="input-field disabled:opacity-40" />
          <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
            <input type="checkbox" checked={currentJob}
              onChange={(e) => setCurrentJob(e.target.checked)}
              className="accent-[#E8622A]" />
            <span className="text-xs text-gray-500">En poste actuellement</span>
          </label>
        </div>
      </div>

      {/* Missions */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">Missions (points clés)</label>
        <div className="space-y-2">
          {form.missions.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-gray-300 text-sm">•</span>
              <input value={m} onChange={(e) => updateMission(i, e.target.value)}
                className="input-field flex-1" placeholder="Décrivez une mission…" />
              {form.missions.length > 1 && (
                <button onClick={() => removeMission(i)} className="text-gray-300 hover:text-red-400 transition">
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addMission}
          className="mt-2 text-xs text-[#E8622A] font-medium hover:underline flex items-center gap-1">
          <Plus size={12} /> Ajouter un point
        </button>
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition">
          Annuler
        </button>
        <button onClick={handleSave}
          className="px-5 py-2 bg-[#E8622A] hover:bg-[#D45520] text-white text-sm font-semibold rounded-xl transition">
          <span className="flex items-center gap-1.5"><Check size={14} /> Enregistrer</span>
        </button>
      </div>
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────

interface ExpSectionProps {
  experiences: Experience[];
  onChange: (exps: Experience[]) => void;
}

export default function ExperiencesSection({ experiences, onChange }: ExpSectionProps) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleAdd(data: Omit<Experience, 'id'>) {
    try {
      const created = await createExperience(data);
      onChange([created, ...experiences]);
    } catch {
      const mock = { ...data, id: `exp-${Date.now()}` };
      onChange([mock, ...experiences]);
    }
    setAdding(false);
  }

  async function handleUpdate(id: string, data: Omit<Experience, 'id'>) {
    try {
      const updated = await updateExperience(id, data);
      onChange(experiences.map((e) => (e.id === id ? updated : e)));
    } catch {
      onChange(experiences.map((e) => (e.id === id ? { ...data, id } : e)));
    }
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette expérience ?')) return;
    try {
      await deleteExperience(id);
    } catch {}
    onChange(experiences.filter((e) => e.id !== id));
  }

  return (
    <section id="experiences" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-gray-900">Expériences Professionnelles</h2>
        <button
          onClick={() => { setAdding(true); setEditingId(null); }}
          className="flex items-center gap-1.5 bg-[#E8622A] hover:bg-[#D45520] text-white
                     text-xs font-semibold px-4 py-2 rounded-xl transition"
        >
          <Plus size={13} /> Ajouter une expérience
        </button>
      </div>

      <div className="space-y-4">
        {adding && (
          <ExperienceForm
            initial={EMPTY_EXP}
            onSave={handleAdd}
            onCancel={() => setAdding(false)}
          />
        )}

        {experiences.map((exp) => (
          <div key={exp.id}>
            {editingId === exp.id ? (
              <ExperienceForm
                initial={exp}
                onSave={(data) => handleUpdate(exp.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="border border-gray-100 rounded-2xl p-4 group hover:border-gray-200 transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <GripVertical size={16} className="text-gray-300 mt-0.5 flex-shrink-0 cursor-grab" />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm">{exp.jobTitle}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {exp.companyName} • {exp.location}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatPeriod(exp)}</p>
                      {exp.missions.length > 0 && (
                        <ul className="mt-2 space-y-0.5">
                          {exp.missions.map((m, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                              <span className="text-gray-400 mt-0.5">•</span>
                              {m}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => setEditingId(exp.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(exp.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {experiences.length === 0 && !adding && (
          <p className="text-sm text-gray-400 text-center py-6">
            Aucune expérience ajoutée — commencez par la plus récente.
          </p>
        )}
      </div>
    </section>
  );
}