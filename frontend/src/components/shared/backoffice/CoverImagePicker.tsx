// src/components/shared/backoffice/CoverImagePicker.tsx
"use client";
import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Link, Trash2, Loader2 } from 'lucide-react';

interface CoverImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  /** Titre de la section, ex: "Miniature" (vidéo) ou "Média à la Une" (salon) */
  title?: string;
  /** Affiche les boutons Changer/URL/Supprimer au survol de l'image (variante "salon") */
  hoverActions?: boolean;
}

const CoverImagePicker = ({ value, onChange, title = 'Miniature', hoverActions = false }: CoverImagePickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [mode, setMode] = useState<'preview' | 'url'>('preview');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/admin/articles', { method: 'POST', body: fd });
      const data = await res.json();
      onChange(data.url ?? data.data?.coverImage ?? '');
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const applyUrl = () => {
    if (urlInput.trim()) { onChange(urlInput.trim()); setMode('preview'); }
  };

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</h2>

      <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-800 shadow-lg group">
        {value ? (
          <>
            <img src={value} alt="Miniature" className="w-full h-full object-cover" />
            {hoverActions && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => inputRef.current?.click()} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-md hover:bg-slate-50 transition">
                  <ImageIcon size={12} /> Changer
                </button>
                <button onClick={() => { setUrlInput(value); setMode('url'); }} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-md hover:bg-slate-50 transition">
                  <Link size={12} /> URL
                </button>
                <button onClick={() => onChange('')} className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-red-600 transition">
                  <Trash2 size={12} /> Supprimer
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-slate-600" />
          </div>
        )}
      </div>

      {mode === 'url' ? (
        <div className="flex gap-2">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyUrl()}
            placeholder="https://…"
            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
          <button onClick={applyUrl} className="px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition">OK</button>
          <button onClick={() => setMode('preview')} className="px-3 py-2 rounded-xl border border-slate-200 text-slate-500 text-xs hover:bg-slate-50 transition">Annuler</button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition shadow-md shadow-orange-200 disabled:opacity-60"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            {uploading ? 'Envoi…' : 'Choisir un fichier'}
          </button>
          <button
            onClick={() => { setUrlInput(value); setMode('url'); }}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition"
            title="Saisir une URL"
          >
            URL
          </button>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </section>
  );
};

export default CoverImagePicker;