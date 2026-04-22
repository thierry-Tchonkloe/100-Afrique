// src/components/profil/FormationsSection.tsx
'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';
import { createFormation, updateFormation, deleteFormation } from '@/services/profil.service';
import type { Formation } from '@/types/profil.types';

const EMPTY: Omit<Formation, 'id'> = { diploma: '', school: '', year: '' };

interface FormProps {
  initial: Omit<Formation, 'id'>;
  onSave: (data: Omit<Formation, 'id'>) => void;
  onCancel: () => void;
}

function FormationForm({ initial, onSave, onCancel }: FormProps) {
  const [form, setForm] = useState(initial);
  return (
    <div className="border border-[#E8622A]/30 rounded-2xl p-5 bg-[#FFFAF8] space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Diplôme / Formation</label>
          <input value={form.diploma} onChange={(e) => setForm((f) => ({ ...f, diploma: e.target.value }))}
            className="input-field" placeholder="BTS Tourisme" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">École / Organisme</label>
          <input value={form.school} onChange={(e) => setForm((f) => ({ ...f, school: e.target.value }))}
            className="input-field" placeholder="Lycée Technique Paul Augier" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Année d'obtention</label>
          <input type="number" min="1990" max="2030" value={form.year}
            onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
            className="input-field" placeholder="2018" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition">
          Annuler
        </button>
        <button onClick={() => onSave(form)}
          className="px-5 py-2 bg-[#E8622A] hover:bg-[#D45520] text-white text-sm font-semibold rounded-xl transition flex items-center gap-1.5">
          <Check size={14} /> Enregistrer
        </button>
      </div>
    </div>
  );
}

interface Props {
  formations: Formation[];
  onChange: (f: Formation[]) => void;
}

export default function FormationsSection({ formations, onChange }: Props) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleAdd(data: Omit<Formation, 'id'>) {
    try {
      const created = await createFormation(data);
      onChange([...formations, created]);
    } catch {
      onChange([...formations, { ...data, id: `form-${Date.now()}` }]);
    }
    setAdding(false);
  }

  async function handleUpdate(id: string, data: Omit<Formation, 'id'>) {
    try {
      const updated = await updateFormation(id, data);
      onChange(formations.map((f) => (f.id === id ? updated : f)));
    } catch {
      onChange(formations.map((f) => (f.id === id ? { ...data, id } : f)));
    }
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette formation ?')) return;
    try { await deleteFormation(id); } catch {}
    onChange(formations.filter((f) => f.id !== id));
  }

  return (
    <section id="formations" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-gray-900">Formations &amp; Diplômes</h2>
        <button onClick={() => { setAdding(true); setEditingId(null); }}
          className="flex items-center gap-1.5 bg-[#E8622A] hover:bg-[#D45520] text-white text-xs font-semibold px-4 py-2 rounded-xl transition">
          <Plus size={13} /> Ajouter une formation
        </button>
      </div>

      <div className="space-y-4">
        {adding && <FormationForm initial={EMPTY} onSave={handleAdd} onCancel={() => setAdding(false)} />}

        {formations.map((f) => (
          <div key={f.id}>
            {editingId === f.id ? (
              <FormationForm initial={f} onSave={(d) => handleUpdate(f.id, d)} onCancel={() => setEditingId(null)} />
            ) : (
              <div className="border border-gray-100 rounded-2xl p-4 group hover:border-gray-200 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{f.diploma}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{f.school} • {f.year && f.year.split('-')[0]}</p>
                    {f.year && !f.year.includes('-') && (
                      <p className="text-xs text-gray-400 mt-0.5">{f.year}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => setEditingId(f.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(f.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {formations.length === 0 && !adding && (
          <p className="text-sm text-gray-400 text-center py-4">Aucune formation ajoutée.</p>
        )}
      </div>
    </section>
  );
}