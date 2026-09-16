// src/components/Dashboard/DestinationEdit.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { X, Save, CheckCircle, Loader2, AlertCircle, CheckCircle2, Clock, Edit3, Image as ImageIcon, Info, Star } from 'lucide-react';
import { Article } from '@/services/Dashboard/articleservice';
import { useDestinationEditForm, TabId } from './destinationedit/useDestinationEditForm';
import TabGeneral from './destinationedit/TabGeneral';
import TabMedia from './destinationedit/TabMedia';
import TabPratique from './destinationedit/TabPratique';
import { fetchCategories, Category } from '@/services/Dashboard/articleservice';

interface DestinationEditProps {
  isOpen: boolean;
  destination: Article | null;
  onClose: () => void;
  onSubmit?: (article: Article) => void;
}

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'general', label: 'Général & Description', icon: <Edit3 size={14} /> },
  { id: 'media', label: 'Médias & SEO', icon: <ImageIcon size={14} /> },
  { id: 'pratique', label: 'Infos Pratiques', icon: <Info size={14} /> },
];

function DestinationEditorContent({ destination, onClose, onSubmit }: { destination: Article; onClose: () => void; onSubmit?: (a: Article) => void }) {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [categorie, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories().then((data) => setCategories(data?.data)).catch((err) => console.error('Erreur catégories ❌', err));
  }, []);

  const {
    dest, form, patch, coverImage, gallery,
    handleCoverFileChange, handleCoverUrlChange, addGalleryImage, removeGalleryImage,
    saving, publishing, saveError, saveSuccess, save,
  } = useDestinationEditForm(destination, onSubmit);

  return (
    <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/20">

      <div className="flex items-start justify-between border-b border-gray-100 px-6 pt-5 pb-4 shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Édition : <span className="text-orange-500">{form.title || destination.title}</span>
            {form.featured && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                <Star size={10} className="fill-amber-500 text-amber-500" /> Coup de cœur
              </span>
            )}
          </h2>
          <p className="mt-0.5 text-xs text-gray-400 flex items-center gap-1.5">
            {saveError && <><AlertCircle size={11} className="text-red-500" /><span className="text-red-500">{saveError}</span></>}
            {saveSuccess && <><CheckCircle2 size={11} className="text-green-500" /><span className="text-green-500">Sauvegardé !</span></>}
            {!saveError && !saveSuccess && (
              <><Clock size={11} /> Destination #{destination.id} · {new Date(destination.updatedAt).toLocaleDateString('fr-FR')}</>
            )}
          </p>
        </div>
        <button onClick={onClose} className="rounded-xl p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      <div className="flex border-b border-gray-100 px-6 shrink-0 bg-white">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 border-b-2 px-1 py-3 text-sm font-medium transition mr-6 ${
              activeTab === id ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6" style={{ maxHeight: '58vh' }}>
        {activeTab === 'general' && <TabGeneral form={form} onChange={patch} categorie={categorie} />}
        {activeTab === 'media' && (
          <TabMedia
            coverImage={coverImage}
            gallery={gallery}
            onCoverFileChange={handleCoverFileChange}
            onCoverUrlChange={handleCoverUrlChange}
            onGalleryAdd={addGalleryImage}
            onGalleryRemove={removeGalleryImage}
            form={form}
            onChange={patch}
          />
        )}
        {activeTab === 'pratique' && <TabPratique form={form} onChange={patch} />}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 shrink-0 bg-white">
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <Clock size={11} />
          Destination #{destination.id}
          {dest?.id ? ` · Fiche #${dest.id}` : ' · Fiche non liée'}
        </p>

        <div className="flex items-center gap-2">
          <button onClick={onClose} className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100">
            <X size={14} /> Fermer
          </button>
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-slate-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <button
            onClick={() => save(true)}
            disabled={publishing}
            className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:bg-orange-600 active:scale-[0.98] transition disabled:opacity-60"
          >
            {publishing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            {publishing ? 'Publication…' : 'Enregistrer et Publier'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DestinationEdit({ isOpen, destination, onClose, onSubmit }: DestinationEditProps) {
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

  if (!mounted || !destination) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundColor: visible ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0)',
        backdropFilter: visible ? 'blur(6px)' : 'blur(0px)',
        transition: 'background-color 300ms ease, backdrop-filter 300ms ease',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          transition: 'opacity 300ms ease, transform 300ms ease',
          width: '100%', display: 'flex', justifyContent: 'center',
        }}
      >
        <DestinationEditorContent destination={destination} onClose={onClose} onSubmit={onSubmit} />
      </div>
    </div>
  );
}