// src/components/Dashboard/Newvideomodal.tsx
"use client";

import { X, PenSquare, Loader2, AlertCircle, Video } from 'lucide-react';
import { Article } from '@/services/Dashboard/articleservice';
import { useNewVideoForm } from './newvideo/useNewVideoForm';
import StatusSelect from '@/components/shared/backoffice/StatusSelectOption';
import AuthorSelect from '@/components/shared/backoffice/AuthorSelectOption';
import DestinationSelect from '@/components/shared/backoffice/DestinationSelectOption';

interface NewVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (article: Article) => void;
}

export default function NewVideoModal({ isOpen, onClose, onSuccess }: NewVideoModalProps) {
  const {
    form, updateField, errors, submitting, apiError,
    authors, loadingAuthors, destinations, loadingDestinations,
    titleRef, handleSubmit,
  } = useNewVideoForm(isOpen, onSuccess, onClose);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div role="dialog" aria-modal="true" aria-labelledby="new-video-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

          <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-orange-100 rounded-lg"><Video size={16} className="text-orange-500" /></div>
                <h2 id="new-video-title" className="text-xl font-bold text-slate-900 leading-tight">
                  Démarrer la Création <span className="text-orange-600">d&apos;une Nouvelle Vidéo</span>
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Renseignez les informations de base. Vous pourrez compléter les détails ensuite.
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
                Titre de la Vidéo<span className="text-orange-500 ml-0.5">*</span>
              </label>
              <input
                ref={titleRef}
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Ex : Interview du PDG d'Air Afrique sur le marché B2B"
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
                Auteur / Réalisateur<span className="text-orange-500 ml-0.5">*</span>
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
              <p className="mt-1.5 text-xs text-slate-400">Relie cette vidéo à une fiche destination existante.</p>
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
              disabled={submitting || loadingAuthors || authors.length === 0}
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