// src/components/Dashboard/Newarticlemodal.tsx
"use client";

import { X, PenSquare, Loader2, AlertCircle } from 'lucide-react';
import { Article } from '@/services/Dashboard/articleservice';
import { useNewArticleForm } from './newarticle/useNewArticleForm';
import CustomSelect, { type SelectOption } from '@/components/shared/backoffice/CustomSelect';
import StatusSelect from '@/components/shared/backoffice/StatusSelectOption';
import AuthorSelect from '@/components/shared/backoffice/AuthorSelectOption';
import DestinationSelect from '@/components/shared/backoffice/DestinationSelectOption';

interface NewArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (article: Article) => void;
}

export default function NewArticleModal({ isOpen, onClose, onSuccess }: NewArticleModalProps) {
  const {
    form, updateField, errors, submitting, apiError,
    authors, loadingAuthors, categories, loadingCategories, destinations, loadingDestinations,
    titleRef, handleSubmit,
  } = useNewArticleForm(isOpen, onSuccess, onClose);

  const categoryOptions: SelectOption[] = categories.map((c) => ({ value: String(c.id), label: c.name, badgeColor: c.color }));
  const isLoading = loadingCategories || loadingAuthors;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

          <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-slate-100">
            <div>
              <h2 id="modal-title" className="text-xl font-bold text-slate-900 leading-tight">
                Démarrer la Création <span className="text-orange-600">d&apos;un Nouvel Article</span>
              </h2>
              <p className="mt-1.5 text-sm text-slate-500 leading-snug">
                Renseignez les informations de base. Vous pourrez compléter le contenu ensuite.
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
                Titre Provisoire de l&apos;Article<span className="text-orange-500 ml-0.5">*</span>
              </label>
              <input
                ref={titleRef}
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Ex : Le MICE africain à l'heure du numérique"
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
                Statut Initial<span className="text-orange-500 ml-0.5">*</span>
              </label>
              <StatusSelect value={form.statusUI} onChange={(v) => updateField('statusUI', v)} error={errors.statusUI} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Catégorie Sectorielle<span className="text-orange-500 ml-0.5">*</span>
              </label>
              {loadingCategories ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 text-sm text-slate-400">
                  <Loader2 size={15} className="animate-spin" /> Chargement des catégories…
                </div>
              ) : categories.length === 0 ? (
                <p className="text-sm text-slate-400 px-4 py-3 rounded-xl border-2 border-slate-200">Aucune catégorie disponible.</p>
              ) : (
                <CustomSelect
                  placeholder="Sélectionner une catégorie"
                  options={categoryOptions}
                  value={form.categoryId}
                  onChange={(v) => updateField('categoryId', v)}
                  error={errors.categoryId}
                  renderOption={(opt) => (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: opt.badgeColor ?? '#cbd5e1' }} />
                      <span className="text-sm text-slate-700">{opt.label}</span>
                    </>
                  )}
                  renderSelected={(opt) => (
                    <span className="flex items-center gap-2 text-sm">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.badgeColor ?? '#cbd5e1' }} />
                      <span className="font-medium text-slate-800">{opt.label}</span>
                    </span>
                  )}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Auteur / Responsable de la Rédaction<span className="text-orange-500 ml-0.5">*</span>
              </label>
              {loadingAuthors ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 text-sm text-slate-400">
                  <Loader2 size={15} className="animate-spin" /> Chargement des auteurs…
                </div>
              ) : authors.length === 0 ? (
                <p className="text-sm text-slate-400 px-4 py-3 rounded-xl border-2 border-slate-200">Aucun auteur disponible.</p>
              ) : (
                <AuthorSelect authors={authors} value={form.authorId} onChange={(v) => updateField('authorId', v)} error={errors.authorId} />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Destination Associée <span className="text-slate-400 font-normal">(optionnel)</span>
              </label>
              {loadingDestinations ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 text-sm text-slate-400">
                  <Loader2 size={15} className="animate-spin" /> Chargement des destinations…
                </div>
              ) : (
                <DestinationSelect destinations={destinations} value={form.destinationId} onChange={(v) => updateField('destinationId', v)} />
              )}
              <p className="mt-1.5 text-xs text-slate-400">
                Relie cet article à une fiche destination existante (ex : "Sénégal", "Maroc"…).
              </p>
            </div>
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
              disabled={submitting || isLoading || !categories.length || !authors.length}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-orange-200"
            >
              {submitting ? (
                <><Loader2 size={15} className="animate-spin" /> Création en cours…</>
              ) : (
                <><PenSquare className="w-4 h-4" /> Commencer l&apos;édition</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}