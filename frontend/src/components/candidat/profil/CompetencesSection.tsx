// src/components/profil/CompetencesSection.tsx
'use client';

import { useState, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { updateSkills } from '@/services/profil.service';
import type { Language, LanguageLevel } from '@/types/profil.types';
import {
  HARD_SKILLS_SUGGESTIONS,
  SOFT_SKILLS_OPTIONS,
  LANGUAGE_LEVELS,
} from '../../../types/profil.types';

interface Props {
  hardSkills: string[];
  softSkills: string[];
  languages: Language[];
  onChange: (data: { hardSkills?: string[]; softSkills?: string[]; languages?: Language[] }) => void;
}

// ── Hard Skills Tag Input ──────────────────────────────────────────────────────

function HardSkillsInput({ skills, onChange }: { skills: string[]; onChange: (s: string[]) => void }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleInput(v: string) {
    setInput(v);
    if (v.length > 0) {
      setSuggestions(
        HARD_SKILLS_SUGGESTIONS.filter(
          (s) => s.toLowerCase().includes(v.toLowerCase()) && !skills.includes(s)
        ).slice(0, 6)
      );
    } else {
      setSuggestions([]);
    }
  }

  function addSkill(skill: string) {
    if (!skills.includes(skill) && skill.trim()) {
      onChange([...skills, skill.trim()]);
    }
    setInput('');
    setSuggestions([]);
    inputRef.current?.focus();
  }

  function removeSkill(skill: string) { onChange(skills.filter((s) => s !== skill)); }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map((s) => (
          <span key={s}
            className="flex items-center gap-1.5 bg-[#FFF3EC] text-[#E8622A] text-xs font-semibold
                       px-3 py-1.5 rounded-full border border-[#FDDCC8]">
            {s}
            <button onClick={() => removeSkill(s)} className="hover:text-[#D45520] transition">
              <X size={11} />
            </button>
          </span>
        ))}
        <div className="relative">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && input) addSkill(input); }}
            placeholder="+ Ajouter"
            className="text-xs font-semibold text-[#E8622A] bg-transparent border border-dashed border-[#E8622A]/50
                       rounded-full px-3 py-1.5 outline-none placeholder:text-[#E8622A]/60 w-28"
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 min-w-48">
              {suggestions.map((s) => (
                <button key={s} onClick={() => addSkill(s)}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Languages ──────────────────────────────────────────────────────────────────

const LEVEL_COLORS: Record<LanguageLevel, string> = {
  'Natif': 'text-green-600',
  'C2':    'text-green-500',
  'C1':    'text-blue-600',
  'B2':    'text-blue-500',
  'B1':    'text-purple-500',
  'A2':    'text-gray-500',
  'A1':    'text-gray-400',
};

const COMMON_LANGUAGES = [
  'Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien',
  'Arabe', 'Mandarin', 'Portugais', 'Russe', 'Japonais',
];

function LanguageRow({
  lang,
  onUpdate,
  onDelete,
}: {
  lang: Language;
  onUpdate: (l: Language) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 group">
      <span className="text-sm text-gray-800">{lang.name}</span>
      <div className="flex items-center gap-3">
        <select
          value={lang.level}
          onChange={(e) => onUpdate({ ...lang, level: e.target.value as LanguageLevel })}
          className={`text-xs font-semibold bg-transparent border-none outline-none cursor-pointer ${LEVEL_COLORS[lang.level]}`}
        >
          {LANGUAGE_LEVELS.map((l) => <option key={l}>{l}</option>)}
        </select>
        <button onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition">
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function CompetencesSection({ hardSkills, softSkills, languages, onChange }: Props) {
  const [addingLang, setAddingLang] = useState(false);
  const [newLang, setNewLang] = useState({ name: '', level: 'B1' as LanguageLevel });
  const [saving, setSaving] = useState(false);

  async function save(update: { hardSkills?: string[]; softSkills?: string[]; languages?: Language[] }) {
    onChange(update);
    setSaving(true);
    try {
      await updateSkills({
        hardSkills: update.hardSkills ?? hardSkills,
        softSkills: update.softSkills ?? softSkills,
        languages: update.languages ?? languages,
      });
    } catch {} finally {
      setSaving(false);
    }
  }

  function handleSoftToggle(skill: string) {
    const updated = softSkills.includes(skill)
      ? softSkills.filter((s) => s !== skill)
      : [...softSkills, skill];
    save({ softSkills: updated });
  }

  function addLanguage() {
    if (!newLang.name) return;
    const updated = [...languages, { id: `lang-${Date.now()}`, ...newLang }];
    save({ languages: updated });
    setAddingLang(false);
    setNewLang({ name: '', level: 'B1' });
  }

  function updateLanguage(id: string, lang: Language) {
    save({ languages: languages.map((l) => (l.id === id ? lang : l)) });
  }

  function deleteLanguage(id: string) {
    save({ languages: languages.filter((l) => l.id !== id) });
  }

  return (
    <section id="competences" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
      <h2 className="font-bold text-gray-900">Compétences &amp; Langues</h2>

      {/* Hard Skills */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Compétences Techniques</p>
        <HardSkillsInput skills={hardSkills} onChange={(hs) => save({ hardSkills: hs })} />
      </div>

      {/* Languages */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Langues</p>
        <div className="border border-gray-100 rounded-2xl px-4 py-1">
          {languages.map((l) => (
            <LanguageRow
              key={l.id}
              lang={l}
              onUpdate={(updated) => updateLanguage(l.id, updated)}
              onDelete={() => deleteLanguage(l.id)}
            />
          ))}
        </div>

        {addingLang ? (
          <div className="flex items-center gap-2 mt-3">
            <select value={newLang.name}
              onChange={(e) => setNewLang((n) => ({ ...n, name: e.target.value }))}
              className="input-field flex-1 text-sm">
              <option value="">Choisir une langue…</option>
              {COMMON_LANGUAGES.filter((l) => !languages.find((x) => x.name === l)).map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
            <select value={newLang.level}
              onChange={(e) => setNewLang((n) => ({ ...n, level: e.target.value as LanguageLevel }))}
              className="input-field text-sm">
              {LANGUAGE_LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
            <button onClick={addLanguage}
              className="bg-[#E8622A] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#D45520] transition">
              OK
            </button>
            <button onClick={() => setAddingLang(false)} className="text-gray-400 hover:text-gray-600 transition">
              <X size={16} />
            </button>
          </div>
        ) : (
          <button onClick={() => setAddingLang(true)}
            className="mt-2 text-xs text-[#E8622A] font-medium hover:underline flex items-center gap-1">
            <Plus size={12} /> Ajouter une langue
          </button>
        )}
      </div>

      {/* Soft Skills */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Soft Skills</p>
        <div className="flex flex-wrap gap-2">
          {SOFT_SKILLS_OPTIONS.map((skill) => {
            const active = softSkills.includes(skill);
            return (
              <button key={skill} onClick={() => handleSoftToggle(skill)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${
                  active
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}>
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {saving && <p className="text-xs text-gray-400">Sauvegarde…</p>}
    </section>
  );
}