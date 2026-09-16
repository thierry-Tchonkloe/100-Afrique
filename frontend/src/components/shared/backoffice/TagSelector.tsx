// src/components/shared/backoffice/TagSelector.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { Tag as TagIcon, Search, Loader2, X } from 'lucide-react';
import { fetchTags, Tag } from '@/services/Dashboard/articleservice';

interface TagSelectorProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

const TagSelector = ({ selectedIds, onChange }: TagSelectorProps) => {
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTags()
      .then((data) => setTagList(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: number) =>
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);

  const filtered = tagList.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        <span className="flex items-center gap-1.5">
          <TagIcon className="w-3.5 h-3.5" /> Tags / Mots-clés
        </span>
      </label>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un tag…"
          className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
      </div>

      <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 space-y-0.5">
        {loading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-3">Aucun tag trouvé</p>
        )}
        {!loading && filtered.map((tag) => {
          const active = selectedIds.includes(tag.id);
          return (
            <button
              key={tag.id}
              onClick={() => toggle(tag.id)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                active
                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <span className={`w-3 h-3 rounded-full border-2 shrink-0 transition ${active ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`} />
              {tag.name}
            </button>
          );
        })}
      </div>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tagList.filter((t) => selectedIds.includes(t.id)).map((t) => (
            <span key={t.id} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
              {t.name}
              <button onClick={() => toggle(t.id)} className="hover:opacity-70 transition-opacity">
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagSelector;