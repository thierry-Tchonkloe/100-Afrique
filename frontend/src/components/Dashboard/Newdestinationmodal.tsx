"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Plus, MapPin, Globe, Tag, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { getToken } from "@/lib/auth";
import { quickCreateDestination, GeographicLevel, DestinationStatus } from "@/services/Dashboard/destinationservice";
import { Article } from "@/services/Dashboard/articleservice";

// ─── Auth ─────────────────────────────────────────────────────────────────────

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function extractArray<T>(json: unknown, keys: string[]): T[] {
  for (const key of keys) {
    const val =
      key === ""
        ? json
        : key.split(".").reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], json);
    if (Array.isArray(val)) return val as T[];
  }
  return [];
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Author {
  id: number;
  name: string;
  role?: string;
}

interface FormData {
  nom: string;
  slug: string;
  niveauGeographique: GeographicLevel | "";
  statut: DestinationStatus | "";
  authorId: string;
}

interface FormErrors {
  nom?: string;
  slug?: string;
  niveauGeographique?: string;
  statut?: string;
  authorId?: string;
}

interface CreateDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Reçoit l'article créé pour ouvrir l'éditeur directement */
  onSuccess?: (article: Article) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const GEO_OPTIONS: { value: GeographicLevel; label: string }[] = [
  { value: "pays",     label: "🌍 Pays" },
  { value: "region",   label: "🗺️ Région" },
  { value: "province", label: "📍 Province" },
  { value: "ville",    label: "🏙️ Ville" },
];

const STATUS_OPTIONS: { value: DestinationStatus; label: string }[] = [
  { value: "DRAFT",     label: "✏️ Brouillon" },
  { value: "PUBLISHED", label: "✅ Publié" },
  { value: "ARCHIVED",  label: "🗄️ Archivé" },
];

// ─── Custom dropdown (conserve le style original) ─────────────────────────────

function SelectField<T extends string>({
  label, value, placeholder, options, error, icon, onChange,
}: {
  label: string;
  value: T | "";
  placeholder: string;
  options: { value: T; label: string }[];
  error?: string;
  icon?: React.ReactNode;
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref             = useRef<HTMLDivElement>(null);
  const selected        = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {icon && <span className="inline-flex mr-1.5 align-middle text-orange-500">{icon}</span>}
        {label} <span className="text-orange-500">*</span>
      </label>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 bg-white text-left transition-all duration-150
          ${error
            ? "border-rose-400 ring-2 ring-rose-100"
            : open
            ? "border-orange-400 ring-2 ring-orange-100"
            : "border-slate-200 hover:border-slate-300"
          }`}
      >
        <span className={selected ? "text-slate-800 font-medium" : "text-slate-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180 text-orange-400" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                value === opt.value
                  ? "bg-orange-50 text-orange-600 font-semibold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function CreateDestinationModal({
  isOpen, onClose, onSuccess,
}: CreateDestinationModalProps) {
  const [form, setForm] = useState<FormData>({
    nom: "", slug: "", niveauGeographique: "", statut: "", authorId: "",
  });
  const [errors, setErrors]                       = useState<FormErrors>({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [visible, setVisible]                     = useState(false);
  const [submitting, setSubmitting]               = useState(false);
  const [apiError, setApiError]                   = useState<string | null>(null);

  const [authors, setAuthors]               = useState<Author[]>([]);
  const [loadingAuthors, setLoadingAuthors] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

  // ── Animation d'entrée ─────────────────────────────────────────────────────

  useEffect(() => {
    if (isOpen) setTimeout(() => setVisible(true), 10);
    else setVisible(false);
  }, [isOpen]);

  // ── Auto-slug depuis le nom ─────────────────────────────────────────────────

  useEffect(() => {
    if (!slugManuallyEdited && form.nom) {
      setForm((prev) => ({ ...prev, slug: toSlug(form.nom) }));
    }
  }, [form.nom, slugManuallyEdited]);

  // ── Chargement des auteurs ──────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen || authors.length) return;
    setLoadingAuthors(true);
    fetch(`${API}/admin/users`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((json) => setAuthors(extractArray<Author>(json, ["", "data", "data.users"])))
      .catch(() => setAuthors([]))
      .finally(() => setLoadingAuthors(false));
  }, [isOpen]);

  // ── Fermeture ──────────────────────────────────────────────────────────────

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      onClose();
      setForm({ nom: "", slug: "", niveauGeographique: "", statut: "", authorId: "" });
      setErrors({});
      setApiError(null);
      setSlugManuallyEdited(false);
    }, 200);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleClose]);

  // ── Validation ─────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.nom.trim())              errs.nom               = "Le nom officiel est requis.";
    if (!form.slug.trim())             errs.slug              = "Le slug est requis.";
    else if (!/^[a-z0-9-]+$/.test(form.slug))
      errs.slug = "Minuscules, chiffres et tirets uniquement.";
    if (!form.niveauGeographique)     errs.niveauGeographique = "Sélectionnez un niveau.";
    if (!form.statut)                 errs.statut             = "Sélectionnez un statut.";
    if (!form.authorId)               errs.authorId           = "Sélectionnez un auteur.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Soumission ─────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setApiError(null);

    try {
      const article = await quickCreateDestination({
        title:              form.nom,
        slug:               form.slug || undefined,
        status:             form.statut as DestinationStatus,
        authorId:           Number(form.authorId),
        niveauGeographique: form.niveauGeographique as GeographicLevel,
        type:               "DESTINATION",
      });

      onSuccess?.(article);
      handleClose();
    } catch (err: unknown) {
      setApiError((err as Error).message || "Erreur lors de la création.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 ${
          visible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Accent top */}
        <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400" />

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                  <MapPin size={16} className="text-orange-500" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  Créer une Nouvelle{" "}
                  <span className="text-orange-600">Fiche Destination</span>
                </h2>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Saisissez le nom officiel de la destination et son identification unique.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="ml-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-5">

          {/* Erreur API */}
          {apiError && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Nom */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <span className="inline-flex mr-1.5 align-middle text-orange-500"><Globe size={14} /></span>
              Nom Officiel de la Destination <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={form.nom}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, nom: e.target.value }));
                if (errors.nom) setErrors((prev) => ({ ...prev, nom: undefined }));
              }}
              placeholder="Ex: Sénégal ou Province du Cap Occidental"
              className={`w-full px-4 py-3 rounded-xl border-2 text-slate-800 placeholder-slate-400
                bg-white transition-all duration-150 outline-none text-sm
                focus:border-orange-400 focus:ring-2 focus:ring-orange-100
                ${errors.nom ? "border-rose-400" : "border-slate-200 hover:border-slate-300"}`}
            />
            {errors.nom && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle size={13} /> {errors.nom}
              </p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <span className="inline-flex mr-1.5 align-middle text-orange-500"><Tag size={14} /></span>
              URL de la Fiche (Slug) <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none pointer-events-none">
                /destination/
              </span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  setForm((prev) => ({ ...prev, slug: e.target.value }));
                  if (errors.slug) setErrors((prev) => ({ ...prev, slug: undefined }));
                }}
                placeholder="ex: senegal"
                className={`w-full pl-28 pr-4 py-3 rounded-xl border-2 text-slate-800 placeholder-slate-400
                  bg-white transition-all duration-150 outline-none text-sm font-mono
                  focus:border-orange-400 focus:ring-2 focus:ring-orange-100
                  ${errors.slug ? "border-rose-400" : "border-slate-200 hover:border-slate-300"}`}
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              Généré automatiquement — minuscules, chiffres et tirets uniquement
            </p>
            {errors.slug && (
              <p className="mt-0.5 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle size={13} /> {errors.slug}
              </p>
            )}
          </div>

          {/* Niveau Géographique */}
          <SelectField<GeographicLevel>
            label="Niveau Géographique"
            value={form.niveauGeographique}
            placeholder="Sélectionnez un niveau géographique"
            error={errors.niveauGeographique}
            options={GEO_OPTIONS}
            onChange={(v) => {
              setForm((prev) => ({ ...prev, niveauGeographique: v }));
              if (errors.niveauGeographique)
                setErrors((prev) => ({ ...prev, niveauGeographique: undefined }));
            }}
          />

          {/* Statut */}
          <SelectField<DestinationStatus>
            label="Statut de la Fiche"
            value={form.statut}
            placeholder="Sélectionnez un statut"
            error={errors.statut}
            options={STATUS_OPTIONS}
            onChange={(v) => {
              setForm((prev) => ({ ...prev, statut: v }));
              if (errors.statut) setErrors((prev) => ({ ...prev, statut: undefined }));
            }}
          />

          {/* Auteur */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Auteur / Responsable <span className="text-orange-500">*</span>
            </label>
            {loadingAuthors ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 text-sm text-slate-400">
                <Loader2 size={15} className="animate-spin" /> Chargement des auteurs…
              </div>
            ) : authors.length === 0 ? (
              <p className="text-sm text-slate-400 px-4 py-3 rounded-xl border-2 border-slate-200">
                Aucun auteur disponible.
              </p>
            ) : (
              <div className={`relative rounded-xl border-2 transition-all duration-150 ${
                errors.authorId
                  ? "border-rose-400 ring-2 ring-rose-100"
                  : "border-slate-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100"
              }`}>
                <select
                  value={form.authorId}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, authorId: e.target.value }));
                    if (errors.authorId) setErrors((prev) => ({ ...prev, authorId: undefined }));
                  }}
                  className="w-full appearance-none bg-white px-4 py-3 text-sm text-slate-800 outline-none rounded-xl cursor-pointer"
                >
                  <option value="">Sélectionner un auteur</option>
                  {authors.map((a) => (
                    <option key={a.id} value={String(a.id)}>
                      {a.name}{a.role ? ` — ${a.role}` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            )}
            {errors.authorId && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle size={13} /> {errors.authorId}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
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