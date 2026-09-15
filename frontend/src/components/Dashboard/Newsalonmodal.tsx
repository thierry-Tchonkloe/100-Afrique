// src/components/Dashboard/Newsalonmodal.tsx
"use client";

import { X, Calendar, ChevronDown, Plus, Loader2, AlertCircle } from 'lucide-react';
import { Article } from '@/services/Dashboard/articleservice';
import { useNewSalonForm, STATUTS } from './newsalon/useNewSalonForm';
import AuthorNativeSelect from '@/components/shared/backoffice/AuthorNativeSelect';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (article: Article) => void;
}

function inputCls(hasError: boolean) {
  return `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-800 placeholder:text-gray-300 outline-none transition-all ${
    hasError
      ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
      : 'border-gray-200 bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
  }`;
}

export default function CreateEventModal({ isOpen, onClose, onSuccess }: CreateEventModalProps) {
  const { form, handleChange, errors, submitting, apiError, users, loadingUsers, handleSubmit } =
    useNewSalonForm(isOpen, onSuccess, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10">

        <div className="px-7 pt-7 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[1.35rem] font-bold text-gray-900 leading-tight">
                Démarrer la Création d&apos;une Fiche Salon/<wbr />Événement
              </h2>
              <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
                Saisissez les informations d&apos;identification et la période de l&apos;événement pour planifier la couverture.
              </p>
            </div>
            <button onClick={onClose} className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="h-px bg-gray-100 mx-7" />

        <div className="px-7 py-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">

          {apiError && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-800">
              Nom Officiel du Salon / Événement <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={form.nomOfficiel}
              onChange={(e) => handleChange('nomOfficiel', e.target.value)}
              placeholder="Ex: World Travel Market (WTM) London 2026"
              className={inputCls(!!errors.nomOfficiel)}
            />
            {errors.nomOfficiel && <p className="text-xs text-red-500">{errors.nomOfficiel}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-800">
              Ville et Pays de l&apos;Événement <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={form.villePayss}
              onChange={(e) => handleChange('villePayss', e.target.value)}
              placeholder="Ex: Londres, Royaume-Uni"
              className={inputCls(!!errors.villePayss)}
            />
            {errors.villePayss && <p className="text-xs text-red-500">{errors.villePayss}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-800">
                Date de Début <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={form.dateDebut}
                  onChange={(e) => handleChange('dateDebut', e.target.value)}
                  className={`${inputCls(!!errors.dateDebut)} pr-10 appearance-none`}
                />
                <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.dateDebut && <p className="text-xs text-red-500">{errors.dateDebut}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-800">
                Date de Fin <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={form.dateFin}
                  onChange={(e) => handleChange('dateFin', e.target.value)}
                  min={form.dateDebut || undefined}
                  className={`${inputCls(!!errors.dateFin)} pr-10 appearance-none`}
                />
                <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.dateFin && <p className="text-xs text-red-500">{errors.dateFin}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-800">
              Statut Interne <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <select
                value={form.statutInterne}
                onChange={(e) => handleChange('statutInterne', e.target.value)}
                className={`${inputCls(!!errors.statutInterne)} pr-10 appearance-none cursor-pointer ${!form.statutInterne ? 'text-gray-400' : 'text-gray-800'}`}
              >
                <option value="" disabled>Sélectionnez un statut</option>
                {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.statutInterne && <p className="text-xs text-red-500">{errors.statutInterne}</p>}
          </div>

          <AuthorNativeSelect
            authors={users}
            loading={loadingUsers}
            value={form.responsableCouvertureId ? String(form.responsableCouvertureId) : ''}
            onChange={(v) => handleChange('responsableCouvertureId', v ? parseInt(v, 10) : null)}
            error={errors.responsableCouvertureId}
            label="Responsable de la Couverture Éditoriale"
          />
        </div>

        <div className="px-7 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || loadingUsers || users.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-bold tracking-wide transition-all shadow-md shadow-orange-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <><Loader2 size={15} className="animate-spin" /> Création en cours…</>
            ) : (
              <><Plus size={16} strokeWidth={2.5} /> Créer et Détailler la Couverture</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}