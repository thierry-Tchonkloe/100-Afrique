// src/components/Dashboard/destinationedit/TabMedia.tsx
"use client";
import React, { useCallback, useRef, useState } from 'react';
import { Image as ImageIcon, Upload, Plus, Trash2, GripVertical, Link, FileText } from 'lucide-react';
import { DestinationForm, GalleryImage } from './useDestinationEditForm';

interface TabMediaProps {
  coverImage: string | null;
  gallery: GalleryImage[];
  onCoverFileChange: (file: File) => void;
  onCoverUrlChange: (url: string) => void;
  onGalleryAdd: (file: File) => void;
  onGalleryRemove: (id: string) => void;
  form: DestinationForm;
  onChange: (patch: Partial<DestinationForm>) => void;
}

function FieldLabel({ children, extra }: { children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-sm font-medium text-gray-700">{children}</label>
      {extra}
    </div>
  );
}

const TabMedia = ({ coverImage, gallery, onCoverFileChange, onCoverUrlChange, onGalleryAdd, onGalleryRemove, form, onChange }: TabMediaProps) => {
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) onCoverFileChange(file);
  }, [onCoverFileChange]);

  const applyUrl = () => {
    if (urlInput.trim()) { onCoverUrlChange(urlInput.trim()); setUrlMode(false); }
  };

  return (
    <div className="space-y-8 py-6">
      <section>
        <div className="mb-4 flex items-center gap-2">
          <ImageIcon size={15} className="text-orange-500" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Média à la Une</h3>
        </div>

        <div
          className={`relative rounded-2xl border-2 border-dashed overflow-hidden transition-all duration-200 ${
            isDragging ? 'border-orange-400 bg-orange-50 scale-[1.01]' : 'border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/40'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="w-full h-52 relative group">
            {coverImage ? (
              <>
                <img src={coverImage} alt="Couverture" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => coverRef.current?.click()} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-md hover:bg-gray-50 transition">
                    <Upload size={12} /> Changer
                  </button>
                  <button onClick={() => { setUrlInput(coverImage ?? ''); setUrlMode(true); }} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-md hover:bg-gray-50 transition">
                    <Link size={12} /> URL
                  </button>
                  <button onClick={() => onCoverUrlChange('')} className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-red-600 transition">
                    <Trash2 size={12} /> Supprimer
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                <ImageIcon size={40} strokeWidth={1.2} />
                <p className="text-sm font-medium">Glissez une image ici</p>
                <p className="text-xs text-gray-300">ou cliquez pour parcourir</p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-1.5 py-3 bg-white/80 backdrop-blur-sm border-t border-gray-100">
            <div className="flex gap-2">
              <button type="button" onClick={() => coverRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-orange-200 transition">
                <Upload size={13} /> Ajouter / Remplacer
              </button>
              <button type="button" onClick={() => { setUrlInput(coverImage ?? ''); setUrlMode(true); }} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-50 transition">
                URL
              </button>
            </div>
            <p className="text-xs text-gray-400">Format recommandé : 1920×800px, JPG ou PNG</p>
          </div>
        </div>

        {urlMode && (
          <div className="flex gap-2 mt-2">
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyUrl()}
              placeholder="https://…"
              autoFocus
              className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition"
            />
            <button onClick={applyUrl} className="px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition">OK</button>
            <button onClick={() => setUrlMode(false)} className="px-3 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 transition">Annuler</button>
          </div>
        )}

        <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onCoverFileChange(f); }} />
      </section>

      <div className="border-t border-gray-100" />

      <section>
        <div className="mb-4 flex items-center gap-2">
          <ImageIcon size={15} className="text-orange-500" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Galerie d&apos;Images</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {gallery.map((img) => (
            <div key={img.id} className="group relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm hover:shadow-md transition-all">
              <img src={img.url} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <button type="button" onClick={() => onGalleryRemove(img.id)} className="opacity-0 group-hover:opacity-100 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-60 text-white cursor-grab">
                <GripVertical size={13} />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => galleryRef.current?.click()} className="aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-orange-400 hover:bg-orange-50 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-orange-500 transition-all group">
            <div className="w-8 h-8 rounded-full bg-gray-200 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
              <Plus size={16} />
            </div>
            <span className="text-xs font-medium">Ajouter</span>
          </button>
        </div>
        <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { Array.from(e.target.files ?? []).forEach((f) => onGalleryAdd(f)); e.target.value = ''; }} />
      </section>

      <div className="border-t border-gray-100" />

      <section>
        <div className="mb-4 flex items-center gap-2">
          <FileText size={15} className="text-orange-500" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Optimisation SEO</h3>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <FieldLabel extra={<span className={`text-xs ${form.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>{form.metaTitle.length}/60</span>}>Titre Méta</FieldLabel>
            <input
              value={form.metaTitle}
              onChange={(e) => onChange({ metaTitle: e.target.value.slice(0, 70) })}
              maxLength={70}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-gray-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
            />
            <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${form.metaTitle.length > 60 ? 'bg-red-400' : 'bg-orange-400'}`} style={{ width: `${Math.min((form.metaTitle.length / 60) * 100, 100)}%` }} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel extra={<span className={`text-xs ${form.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>{form.metaDescription.length}/160</span>}>Description Méta</FieldLabel>
            <textarea
              value={form.metaDescription}
              onChange={(e) => onChange({ metaDescription: e.target.value.slice(0, 180) })}
              maxLength={180}
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-gray-300 resize-none focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
            />
            <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${form.metaDescription.length > 160 ? 'bg-red-400' : 'bg-orange-400'}`} style={{ width: `${Math.min((form.metaDescription.length / 160) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TabMedia;