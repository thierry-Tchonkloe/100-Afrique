// src/components/Dashboard/Newdestinationmodal.tsx
"use client";

import { X, Plus, MapPin, Globe, Tag, Loader2, AlertCircle } from 'lucide-react';
import { Article } from '@/services/Dashboard/articleservice';
import { useNewDestinationForm, GEO_OPTIONS, STATUS_OPTIONS } from './newdestination/useNewDestinationForm';
import DropdownSelectField from '@/components/shared/backoffice/DropdownSelectField';
import AuthorNativeSelect from '@/components/shared/backoffice/AuthorNativeSelect';

interface CreateDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (article: Article) => void;
}

export default function CreateDestinationModal({ isOpen, onClose, onSuccess }: CreateDestinationModalProps) {
  const {
    form, updateField, onSlugChange, errors, visible, submitting, apiError,
    authors, loadingAuthors, handleClose, handleSubmit,
  } = useNewDestinationForm(isOpen, onSuccess, onClose);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={handleClose} />

      <div className={`relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400" />

        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-orange-100 rounded-lg"><MapPin size={16} className="text-orange-500" /></div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  Créer une Nouvelle <span className="text-orange-600">Fiche Destination</span>
                </h2>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Saisissez le nom officiel de la destination et son identification unique.
              </p>
            </div>
            <button onClick={handleClose} className="ml-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {apiError && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <span className="inline-flex mr-1.5 align-middle text-orange-500"><Globe size={14} /></span>
              Nom Officiel de la Destination <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={form.nom}
              onChange={(e) => updateField('nom', e.target.value)}
              placeholder="Ex: Sénégal ou Province du Cap Occidental"
              className={`w-full px-4 py-3 rounded-xl border-2 text-slate-800 placeholder-slate-400 bg-white transition-all duration-150 outline-none text-sm
                focus:border-orange-400 focus:ring-2 focus:ring-orange-100
                ${errors.nom ? 'border-rose-400' : 'border-slate-200 hover:border-slate-300'}`}
            />
            {errors.nom && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle size={13} /> {errors.nom}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <span className="inline-flex mr-1.5 align-middle text-orange-500"><Tag size={14} /></span>
              URL de la Fiche (Slug) <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none pointer-events-none">/destination/</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => onSlugChange(e.target.value)}
                placeholder="ex: senegal"
                className={`w-full pl-28 pr-4 py-3 rounded-xl border-2 text-slate-800 placeholder-slate-400 bg-white transition-all duration-150 outline-none text-sm font-mono
                  focus:border-orange-400 focus:ring-2 focus:ring-orange-100
                  ${errors.slug ? 'border-rose-400' : 'border-slate-200 hover:border-slate-300'}`}
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-400">Généré automatiquement — minuscules, chiffres et tirets uniquement</p>
            {errors.slug && (
              <p className="mt-0.5 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle size={13} /> {errors.slug}
              </p>
            )}
          </div>

          <DropdownSelectField
            label="Niveau Géographique"
            value={form.niveauGeographique}
            placeholder="Sélectionnez un niveau géographique"
            error={errors.niveauGeographique}
            options={GEO_OPTIONS}
            onChange={(v) => updateField('niveauGeographique', v)}
          />

          <DropdownSelectField
            label="Statut de la Fiche"
            value={form.statut}
            placeholder="Sélectionnez un statut"
            error={errors.statut}
            options={STATUS_OPTIONS}
            onChange={(v) => updateField('statut', v)}
          />

          <AuthorNativeSelect
            authors={authors}
            loading={loadingAuthors}
            value={form.authorId}
            onChange={(v) => updateField('authorId', v)}
            error={errors.authorId}
            label="Auteur / Responsable"
          />
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border-2 border-slate-200 hover:border-slate-300 hover:text-slate-800 transition-all duration-150 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || loadingAuthors || authors.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <><Loader2 size={15} className="animate-spin" /> Création en cours…</>
            ) : (
              <><Plus size={16} /> Créer et Détailler la Fiche</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}