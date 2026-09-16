// src/components/Dashboard/SalonEdit.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import { X, Save, Globe, BookOpen, ChevronDown, Loader2, AlertCircle, CheckCircle2, Clock, MapPin, Calendar, Link } from 'lucide-react';
import { Article, fetchCategories, Category, STATUS_API_TO_UI } from '@/services/Dashboard/articleservice';
import { useSalonEditForm } from './salonedit/useSalonEditForm';
import RelatedContentSelector from './salonedit/RelatedContentSelector';
import TagSelector from '@/components/shared/backoffice/TagSelector';
import CoverImagePicker from '@/components/shared/backoffice/CoverImagePicker';
import RichTextToolbar from '@/components/shared/backoffice/RichTextToolbar';
import FieldLabel from '@/components/shared/backoffice/FieldLabel';
import SectionTitle from '@/components/shared/backoffice/SectionTitle';

interface SalonEditProps {
  isOpen: boolean;
  salon: Article | null;
  onClose: () => void;
  onSubmit?: (article: Article) => void;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
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

function SalonEditorContent({ salon, onClose, onSubmit }: { salon: Article; onClose: () => void; onSubmit?: (a: Article) => void }) {
  const [categorie, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories().then((data) => setCategories(data?.data)).catch((err) => console.error('Erreur catégories ❌', err));
  }, []);

  const { form, update, saving, publishing, saveError, saveSuccess, save } = useSalonEditForm(salon, onSubmit);

  const metaTitleLen = form.metaTitle.length;
  const metaDescLen = form.metaDescription.length;
  const excerptLen = form.excerpt.length;

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      <div className="flex items-start justify-between px-8 py-5 border-b border-slate-100 bg-white shrink-0 rounded-t-3xl">
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
            <BookOpen size={18} className="text-orange-500" />
            Édition : <span className="text-orange-500">{form.title || salon.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium flex items-center gap-1">
            <Clock size={11} /> Salon #{salon.id} · Créé le {new Date(salon.createdAt).toLocaleDateString('fr-FR')}
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
            <section className="space-y-5">
              <SectionTitle>Informations de Base</SectionTitle>

              <div className="space-y-1.5">
                <FieldLabel>Titre du Salon / Événement</FieldLabel>
                <input
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="Ex: Salon International du Tourisme"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FieldLabel>
                    Résumé pour l&apos;Agenda{' '}
                    <span className="text-slate-400 normal-case font-normal">(affiché sur la page d&apos;accueil et l&apos;agenda)</span>
                  </FieldLabel>
                  <span className={`text-xs font-medium tabular-nums ${excerptLen > 220 ? 'text-red-500' : 'text-slate-400'}`}>{excerptLen}/220</span>
                </div>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => update('excerpt', e.target.value.slice(0, 240))}
                  maxLength={240}
                  rows={2}
                  placeholder="Ex: Le rendez-vous incontournable des professionnels du tourisme africain…"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 leading-relaxed resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                />
                <p className="text-xs text-slate-400">
                  Ce court résumé est distinct de la description détaillée ci-dessous : c&apos;est lui qui apparaît sur les cartes d&apos;agenda.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel>Lieu</FieldLabel>
                  <div className="relative">
                    <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      value={form.location}
                      onChange={(e) => update('location', e.target.value)}
                      placeholder="Paris Expo…"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Date de Début</FieldLabel>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => update('startDate', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Date de Fin</FieldLabel>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => update('endDate', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>Site Web Officiel</FieldLabel>
                <div className="relative">
                  <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => update('website', e.target.value)}
                    placeholder="https://…"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-700 font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                </div>
                <p className="text-xs text-slate-400">URL complète du site officiel de l&apos;événement</p>
              </div>
            </section>

            <section className="space-y-3">
              <SectionTitle>Description Détaillée</SectionTitle>
              <div className="flex flex-col gap-1.5">
                <FieldLabel>Description <span className="text-slate-400 normal-case font-normal">(Historique, Objectifs, Thème)</span></FieldLabel>
                <div className="rounded-xl border border-slate-200 overflow-hidden transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                  <RichTextToolbar />
                  <textarea
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    rows={8}
                    placeholder="Décrivez le salon en détail…"
                    className="w-full px-4 py-3 text-sm text-slate-700 leading-relaxed placeholder-slate-400 outline-none resize-none bg-white"
                  />
                </div>
              </div>
            </section>

            <CoverImagePicker value={form.coverImage} onChange={(url) => update('coverImage', url)} title="Média à la Une" hoverActions />
          </div>

          <div className="lg:col-span-2 p-8 space-y-7 bg-slate-50/60">
            <section className="space-y-4">
              <SectionTitle>Statut et Classification</SectionTitle>

              <SelectField label="Statut" value={form.status} options={Object.values(STATUS_API_TO_UI)} onChange={(v) => update('status', v)} />

              <div className="space-y-1.5">
                <FieldLabel>Catégorie</FieldLabel>
                <div className="relative">
                  <select
                    value={form.categoryId ?? ''}
                    onChange={(e) => update('categoryId', Number(e.target.value))}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition cursor-pointer shadow-sm"
                  >
                    <option value="">Aucune catégorie</option>
                    {categorie.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>Responsable</FieldLabel>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600 shrink-0">
                    {salon.author.name.charAt(0)}
                  </div>
                  <span className="text-sm text-slate-700 truncate">{salon.author.name}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>URL (Slug)</FieldLabel>
                <input
                  value={form.slug}
                  onChange={(e) => update('slug', e.target.value)}
                  placeholder="/salons/mon-salon-2025"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                />
              </div>
            </section>

            <TagSelector selectedIds={form.selectedTagIds} onChange={(ids) => update('selectedTagIds', ids)} />
            <RelatedContentSelector selectedIds={form.relatedContentIds} onChange={(ids) => update('relatedContentIds', ids)} />

            <section className="space-y-4">
              <SectionTitle>Optimisation SEO</SectionTitle>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <FieldLabel>Titre Méta</FieldLabel>
                  <span className={`text-xs font-medium tabular-nums ${metaTitleLen > 60 ? 'text-red-500' : 'text-slate-400'}`}>{metaTitleLen}/60</span>
                </div>
                <input
                  value={form.metaTitle}
                  onChange={(e) => update('metaTitle', e.target.value.slice(0, 70))}
                  maxLength={70}
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
                  onChange={(e) => update('metaDescription', e.target.value.slice(0, 180))}
                  maxLength={180}
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

export default function SalonEdit({ isOpen, salon, onClose, onSubmit }: SalonEditProps) {
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

  if (!mounted || !salon) return null;

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
        <SalonEditorContent salon={salon} onClose={onClose} onSubmit={onSubmit} />
      </div>
    </div>
  );
}