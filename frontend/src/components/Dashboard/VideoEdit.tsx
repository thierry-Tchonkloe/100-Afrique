// src/components/Dashboard/VideoEdit.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import { X, Save, Globe, Calendar, ChevronDown, Loader2, AlertCircle, CheckCircle2, Search, Filter } from 'lucide-react';
import { Article, Category, fetchCategories } from '@/services/Dashboard/articleservice';
import { STATUS_API_TO_UI } from '@/services/Dashboard/video.service';
import { useVideoEditForm, VIDEO_TYPES } from './videoedit/useVideoEditForm';
import VideoPreview from './videoedit/VideoPreview';
import TagSelector from '@/components/shared/backoffice/TagSelector';
import CoverImagePicker from '@/components/shared/backoffice/CoverImagePicker';
import FieldLabel from '@/components/shared/backoffice/FieldLabel';

interface VideoEditProps {
  isOpen: boolean;
  video: Article | null;
  onClose: () => void;
  onSubmit?: (article: Article) => void;
}

export interface VideoFilterBarProps {
  categories: Category[];
  authors: { id: number; name: string }[];
  onFilter: (params: { categoryId?: number; authorId?: number; dateFrom?: string; dateTo?: string }) => void;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition cursor-pointer"
        >
          {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

// ─── Filter Bar (inchangée, exportée pour usage ailleurs) ─────────────────────

export function VideoFilterBar({ categories, authors, onFilter }: VideoFilterBarProps) {
  const [categoryId, setCategoryId] = useState<number | undefined>(categories[0]?.id);
  const [authorId, setAuthorId] = useState<number | undefined>();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [categorie, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    if (categories[0]?.id) setCategoryId(categories[0].id);
  }, [categories]);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data?.data))
      .catch((err) => console.error('Erreur catégories ❌', err))
      .finally(() => setLoadingCategories(false));
  }, []);

  const apply = () => onFilter({ categoryId, authorId, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined });
  const reset = () => {
    setCategoryId(undefined); setAuthorId(undefined); setDateFrom(''); setDateTo('');
    onFilter({});
  };

  return (
    <div className="flex flex-wrap items-end gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <Filter className="w-4 h-4 text-slate-400 mt-auto mb-2.5 shrink-0" />

      <div className="space-y-1 min-w-40">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Catégorie</label>
        <div className="relative">
          <select
            value={categoryId ?? ''}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
            disabled={loadingCategories}
            className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition cursor-pointer"
          >
            <option value="">Toutes</option>
            {categorie.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-1 min-w-40">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Auteur</label>
        <div className="relative">
          <select
            value={authorId ?? ''}
            onChange={(e) => setAuthorId(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition cursor-pointer"
          >
            <option value="">Tous</option>
            {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Du</label>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition" />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Au</label>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition" />
      </div>

      <div className="flex gap-2 mt-auto">
        <button onClick={apply} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition shadow-md shadow-orange-100">
          <Search className="w-3.5 h-3.5" /> Filtrer
        </button>
        <button onClick={reset} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">
          Réinitialiser
        </button>
      </div>
    </div>
  );
}

// ─── Editor Content ───────────────────────────────────────────────────────────

function VideoEditorContent({ video, onClose, onSubmit }: { video: Article; onClose: () => void; onSubmit?: (article: Article) => void }) {
  const { form, update, categories, destinations, loadingDestinations, saving, publishing, saveError, saveSuccess, save } =
    useVideoEditForm(video, onSubmit);

  const metaTitleLen = form.metaTitle.length;
  const metaDescLen = form.metaDescription.length;

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      <div className="flex items-start justify-between px-8 py-5 border-b border-slate-100 bg-white shrink-0 rounded-t-3xl">
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">
            Édition : <span className="text-orange-500">{form.title || video.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Vidéo #{video.id} · Créée le {new Date(video.createdAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4 shrink-0">
          {saveError && <span className="flex items-center gap-1 text-xs text-red-500"><AlertCircle size={13} /> {saveError}</span>}
          {saveSuccess && <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle2 size={13} /> Sauvegardé !</span>}
          <button
            onClick={() => save()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:border-slate-300 hover:bg-slate-50 transition disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <button
            onClick={() => save('Publié')}
            disabled={publishing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 active:scale-95 transition disabled:opacity-60 shadow-lg shadow-orange-200"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            {publishing ? 'Publication…' : 'Publier'}
          </button>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition" aria-label="Fermer">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="grid grid-cols-1 lg:grid-cols-5">

          <div className="lg:col-span-3 p-8 space-y-8 border-r border-slate-100">
            <VideoPreview
              rawUrl={form.sourceUrl}
              duration={form.duration}
              onUrlChange={(v) => update('sourceUrl', v)}
              onDurationChange={(v) => update('duration', v)}
            />

            <section className="space-y-5">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Détails et Métadonnées</h2>
              <div className="space-y-1.5">
                <FieldLabel>Titre de la Vidéo</FieldLabel>
                <input
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Description <span className="text-slate-400 normal-case font-normal">(résumé SEO)</span></FieldLabel>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => update('excerpt', e.target.value)}
                  rows={6}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none"
                />
              </div>
            </section>
          </div>

          <div className="lg:col-span-2 p-8 space-y-7 bg-slate-50/60">
            <CoverImagePicker value={form.coverImage} onChange={(url) => update('coverImage', url)} hoverActions={false} />

            <section className="space-y-4">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Statut et Classification</h2>

              <SelectField label="Statut" value={form.status} options={Object.values(STATUS_API_TO_UI)} onChange={(v) => update('status', v)} />
              <SelectField label="Type de Vidéo" value={form.videoType} options={VIDEO_TYPES} onChange={(v) => update('videoType', v)} />

              <div className="space-y-1.5">
                <FieldLabel>Catégorie</FieldLabel>
                <div className="relative">
                  <select
                    value={form.categoryId ?? ''}
                    onChange={(e) => update('categoryId', Number(e.target.value))}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition cursor-pointer"
                  >
                    <option value="">Aucune catégorie</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>Destination Associée <span className="text-slate-400 normal-case font-normal">(optionnel)</span></FieldLabel>
                {loadingDestinations ? (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-400 bg-white">
                    <Loader2 className="w-4 h-4 animate-spin" /> Chargement…
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={form.destinationId}
                      onChange={(e) => update('destinationId', e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition cursor-pointer"
                    >
                      <option value="">Aucune destination</option>
                      {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <FieldLabel>Auteur</FieldLabel>
                <p className="text-sm text-slate-600 border border-slate-200 rounded-xl px-4 py-2.5 bg-white">{video.author.name}</p>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>Date de publication</FieldLabel>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={form.publishDate}
                    onChange={(e) => update('publishDate', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <TagSelector selectedIds={form.selectedTagIds} onChange={(ids) => update('selectedTagIds', ids)} />
            </section>

            <section className="space-y-4">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Optimisation SEO</h2>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <FieldLabel>Titre Méta</FieldLabel>
                  <span className={`text-xs font-medium tabular-nums ${metaTitleLen > 60 ? 'text-red-500' : 'text-slate-400'}`}>{metaTitleLen}/60</span>
                </div>
                <input
                  value={form.metaTitle}
                  onChange={(e) => update('metaTitle', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                />
                <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${metaTitleLen > 60 ? 'bg-red-400' : 'bg-orange-400'}`} style={{ width: `${Math.min((metaTitleLen / 60) * 100, 100)}%` }} />
                </div>
                <p className="text-xs text-slate-400">60 caractères recommandés</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <FieldLabel>Description Méta</FieldLabel>
                  <span className={`text-xs font-medium tabular-nums ${metaDescLen > 160 ? 'text-red-500' : 'text-slate-400'}`}>{metaDescLen}/160</span>
                </div>
                <textarea
                  value={form.metaDescription}
                  onChange={(e) => update('metaDescription', e.target.value)}
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none"
                />
                <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${metaDescLen > 160 ? 'bg-red-400' : 'bg-orange-400'}`} style={{ width: `${Math.min((metaDescLen / 160) * 100, 100)}%` }} />
                </div>
                <p className="text-xs text-slate-400">160 caractères recommandés</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Wrapper ────────────────────────────────────────────────────────────

export default function VideoEdit({ isOpen, video, onClose, onSubmit }: VideoEditProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!mounted || !video) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundColor: visible ? 'rgba(15, 23, 42, 0.6)' : 'rgba(15, 23, 42, 0)',
        backdropFilter: visible ? 'blur(6px)' : 'blur(0px)',
        transition: 'background-color 300ms ease, backdrop-filter 300ms ease',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          transition: 'opacity 300ms ease, transform 300ms ease',
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        }}
      >
        <VideoEditorContent video={video} onClose={onClose} onSubmit={onSubmit} />
      </div>
    </div>
  );
}