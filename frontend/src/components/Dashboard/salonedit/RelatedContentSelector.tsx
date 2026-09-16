// src/components/Dashboard/salonedit/RelatedContentSelector.tsx
"use client";
import React, { useEffect, useRef, useState } from 'react';
import { X, Plus, ChevronDown, Search, Video, FileText, Loader2 } from 'lucide-react';
import { Article } from '@/services/Dashboard/articleservice';
import FieldLabel from '@/components/shared/backoffice/FieldLabel';

interface RelatedContentSelectorProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

const RelatedContentSelector = ({ selectedIds, onChange }: RelatedContentSelectorProps) => {
  const [allContent, setAllContent] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'ARTICLE' | 'VIDEO'>('ALL');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || allContent.length > 0) return;
    setLoading(true);
    Promise.all([
      fetch('/api/articles?type=ARTICLE&limit=100').then((r) => r.json()),
      fetch('/api/articles?type=VIDEO&limit=100').then((r) => r.json()),
    ])
      .then(([artRes, vidRes]) => {
        const arts: Article[] = (artRes.data ?? artRes ?? []).map((a: Article) => ({
          id: a.id, title: a.title, type: 'ARTICLE' as const, slug: a.slug, coverImage: a.coverImage, category: a.category,
        }));
        const vids: Article[] = (vidRes.data ?? vidRes ?? []).map((v: Article) => ({
          id: v.id, title: v.title, type: 'VIDEO' as const, slug: v.slug, coverImage: v.coverImage, category: v.category,
        }));
        setAllContent([...arts, ...vids]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open, allContent.length]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const toggle = (id: number) => onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);

  const filtered = allContent.filter((c) => {
    const matchType = typeFilter === 'ALL' || c.type === typeFilter;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const selectedItems = allContent.filter((c) => selectedIds.includes(c.id));

  return (
    <div className="space-y-2">
      <FieldLabel>Contenus Associés</FieldLabel>

      {selectedItems.length > 0 && (
        <div className="space-y-1.5">
          {selectedItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              {item.coverImage ? (
                <img src={item.coverImage} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
              ) : (
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${item.type === 'VIDEO' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                  {item.type === 'VIDEO' ? <Video size={12} className="text-purple-600" /> : <FileText size={12} className="text-blue-600" />}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate">{item.title}</p>
                <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-0.5 ${item.type === 'VIDEO' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                  {item.type === 'VIDEO' ? 'Vidéo' : 'Article'}
                </span>
              </div>
              <button onClick={() => toggle(item.id)} className="p-1 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition shrink-0">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-500 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition"
        >
          <Plus size={13} />
          <span>Ajouter du contenu associé…</span>
          <ChevronDown size={12} className={`ml-auto transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1.5 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 z-50 overflow-hidden">
            <div className="p-3 space-y-2 border-b border-slate-100">
              <div className="relative">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher par titre…"
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition"
                />
              </div>
              <div className="flex gap-1.5">
                {(['ALL', 'ARTICLE', 'VIDEO'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${typeFilter === t ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {t === 'VIDEO' && <Video size={10} />}
                    {t === 'ARTICLE' && <FileText size={10} />}
                    {t === 'ALL' ? 'Tout' : t === 'VIDEO' ? 'Vidéos' : 'Articles'}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto p-2 space-y-0.5">
              {loading && <div className="flex justify-center py-6"><Loader2 size={16} className="animate-spin text-orange-400" /></div>}
              {!loading && filtered.length === 0 && <p className="text-xs text-slate-400 text-center py-4">Aucun contenu trouvé</p>}
              {!loading && filtered.map((item) => {
                const selected = selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${selected ? 'bg-orange-50 border border-orange-200' : 'hover:bg-slate-50 border border-transparent'}`}
                  >
                    {item.coverImage ? (
                      <img src={item.coverImage} alt="" className="w-7 h-7 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center ${item.type === 'VIDEO' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                        {item.type === 'VIDEO' ? <Video size={11} className="text-purple-600" /> : <FileText size={11} className="text-blue-600" />}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${selected ? 'text-orange-700' : 'text-slate-700'}`}>{item.title}</p>
                      {item.category && <p className="text-[10px] text-slate-400 truncate">{item.category.name}</p>}
                    </div>
                    <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${item.type === 'VIDEO' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                      {item.type === 'VIDEO' ? <Video size={8} /> : <FileText size={8} />}
                      {item.type === 'VIDEO' ? 'Vidéo' : 'Article'}
                    </span>
                    <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition ${selected ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}>
                      {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedIds.length > 0 && (
              <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  <strong className="text-orange-600">{selectedIds.length}</strong> sélectionné{selectedIds.length > 1 ? 's' : ''}
                </span>
                <button onClick={() => setOpen(false)} className="px-3 py-1 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition">
                  Confirmer
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedContentSelector;