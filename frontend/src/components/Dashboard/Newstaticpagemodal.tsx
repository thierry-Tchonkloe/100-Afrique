// src/components/Dashboard/Newstaticpagemodal.tsx
"use client";

import { X, Loader2, AlertCircle, FileText } from 'lucide-react';
import { Article } from '@/services/Dashboard/articleservice';
import { useNewStaticPageForm } from './newstaticpage/useNewStaticPageForm';
import VisibilityRadioGroup from './newstaticpage/VisibilityRadioGroup';
import AuthorNativeSelect from '@/components/shared/backoffice/AuthorNativeSelect';

interface NewStaticPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (article: Article) => void;
}

export default function NewStaticPageModal({ isOpen, onClose, onSuccess }: NewStaticPageModalProps) {
  const {
    form, updateField, handleTitleChange, handleSlugChange, errors, submitting, apiError,
    authors, loadingAuthors, titleRef, handleSubmit,
  } = useNewStaticPageForm(isOpen, onSuccess, onClose);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div role="dialog" aria-modal="true" aria-labelledby="new-page-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

          <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 shrink-0" />

          <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-orange-100 rounded-lg"><FileText size={16} className="text-orange-500" /></div>
                <h2 id="new-page-title" className="text-xl font-bold text-slate-900 leading-tight">
                  Créer une <span className="text-orange-600">Nouvelle Page Statique</span>
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Définissez le titre, le chemin d&apos;accès et la visibilité de cette page.
              </p>
            </div>
            <button onClick={onClose} className="shrink-0 ml-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" aria-label="Fermer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {apiError && (
              <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{apiError}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Titre de la Page<span className="text-orange-500 ml-0.5">*</span>
                <span className="font-normal text-slate-400 ml-1.5 text-xs">(utilisé en H1 et dans le menu)</span>
              </label>
              <input
                ref={titleRef}
                type="text"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="Ex : Politique de Confidentialité"
                className={`w-full px-4 py-3 rounded-xl border-2 text-slate-800 placeholder-slate-400 text-sm outline-none transition-all duration-200
                  ${errors.title ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 hover:border-slate-300'}`}
              />
              {errors.title && (
                <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle size={13} className="shrink-0" /> {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                URL de la Page (Slug)<span className="text-orange-500 ml-0.5">*</span>
              </label>
              <div className={`flex rounded-xl border-2 overflow-hidden transition-all duration-200
                ${errors.slug ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 hover:border-slate-300'}`}
              >
                <span className="flex items-center px-3 bg-slate-50 text-slate-400 text-sm border-r border-slate-200 select-none font-mono">/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="politique-confidentialite"
                  className="flex-1 px-3 py-3 text-sm text-slate-800 font-mono bg-white outline-none"
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                Lettres minuscules, chiffres et tirets uniquement — généré automatiquement depuis le titre
              </p>
              {errors.slug && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle size={13} className="shrink-0" /> {errors.slug}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Statut de Démarrage <span className="text-orange-500 ml-0.5">*</span>
              </label>
              <div className={`relative rounded-xl border-2 transition-all duration-200
                ${errors.status ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100'}`}
              >
                <select
                  value={form.status}
                  onChange={(e) => updateField('status', e.target.value as any)}
                  className="w-full appearance-none bg-white px-4 py-3 text-sm text-slate-800 outline-none rounded-xl cursor-pointer"
                >
                  <option value="DRAFT">Brouillon</option>
                  <option value="PUBLISHED">Publié</option>
                  <option value="ARCHIVED">Archivé</option>
                </select>
                <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.status && (
                <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle size={13} className="shrink-0" /> {errors.status}
                </p>
              )}
            </div>

            <AuthorNativeSelect
              authors={authors}
              loading={loadingAuthors}
              value={form.authorId}
              onChange={(v) => updateField('authorId', v)}
              error={errors.authorId}
              showInitials
            />

            <VisibilityRadioGroup value={form.visibility} onChange={(v) => updateField('visibility', v)} />
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-150 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || loadingAuthors || authors.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-orange-200"
            >
              {submitting ? (
                <><Loader2 size={15} className="animate-spin" /> Création en cours…</>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Commencer l&apos;édition
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}