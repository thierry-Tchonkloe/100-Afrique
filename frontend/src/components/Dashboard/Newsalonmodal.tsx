"use client";

import { useState, useEffect } from "react";
import { X, Calendar, ChevronDown, Plus, Loader2, AlertCircle } from "lucide-react";
import { getToken } from "@/lib/auth";
import { quickCreateSalon } from "@/services/Dashboard/salonservice";
import { Article } from "@/services/Dashboard/articleservice";

// ─── Auth ─────────────────────────────────────────────────────────────────────
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

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

interface User {
    id: number;
    name: string;
    role?: string;
}

interface FormData {
    nomOfficiel: string;
    villePayss: string;
    dateDebut: string;
    dateFin: string;
    statutInterne: string;
    responsableCouvertureId: number | null;
}

interface FormErrors {
    nomOfficiel?: string;
    villePayss?: string;
    dateDebut?: string;
    dateFin?: string;
    statutInterne?: string;
    responsableCouvertureId?: string;
}

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Reçoit l'article créé pour ouvrir l'éditeur directement */
    onSuccess?: (article: Article) => void;
}

const STATUTS = ["Brouillon", "En Révision", "Publié", "Archivé"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Mappe le statut métier salon → statut API article */
function toApiStatus(statutInterne: string): "DRAFT" | "PUBLISHED" | "REVIEW" | "ARCHIVED" {
    const map: Record<string, "DRAFT" | "PUBLISHED" | "REVIEW" | "ARCHIVED"> = {
        "Brouillon":    "DRAFT",
        "En Révision":  "REVIEW",
        "Publié":       "PUBLISHED",
        "Archivé":      "ARCHIVED",
    };
    return map[statutInterne] ?? "DRAFT";
}

// ─── Field helpers ─────────────────────────────────────────────────────────────

function inputCls(hasError: boolean) {
    return `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-800 placeholder:text-gray-300 outline-none transition-all ${
        hasError
        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
        : "border-gray-200 bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
    }`;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function CreateEventModal({ isOpen, onClose, onSuccess }: CreateEventModalProps) {
    const [form, setForm] = useState<FormData>({
        nomOfficiel:             "",
        villePayss:              "",
        dateDebut:               "",
        dateFin:                 "",
        statutInterne:           "",
        responsableCouvertureId: null,
    });
    const [errors, setErrors]     = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const [users, setUsers]               = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);



    // ── Chargement des utilisateurs ─────────────────────────────────────────────

    useEffect(() => {
        if (!isOpen || users.length) return;
        setLoadingUsers(true);
        fetch(`${API}/admin/users`, { headers: authHeaders() })
        .then((r) => r.json())
        .then((json) => setUsers(extractArray<User>(json, ["", "data", "data.users"])))
        .catch(() => setUsers([]))
        .finally(() => setLoadingUsers(false));
    }, [isOpen]);

    // ── Reset ───────────────────────────────────────────────────────────────────

    useEffect(() => {
        if (!isOpen) {
        setForm({
            nomOfficiel: "", villePayss: "", dateDebut: "",
            dateFin: "", statutInterne: "", responsableCouvertureId: null,
        });
        setErrors({});
        setApiError(null);
        }
    }, [isOpen]);

    // ── Échap ───────────────────────────────────────────────────────────────────

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) onClose(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    // ── Validation ──────────────────────────────────────────────────────────────

    const validate = (): boolean => {
        const errs: FormErrors = {};
        if (!form.nomOfficiel.trim())          errs.nomOfficiel             = "Ce champ est requis.";
        if (!form.villePayss.trim())           errs.villePayss              = "Ce champ est requis.";
        if (!form.dateDebut)                   errs.dateDebut               = "Ce champ est requis.";
        if (!form.dateFin)                     errs.dateFin                 = "Ce champ est requis.";
        if (!form.statutInterne)              errs.statutInterne           = "Veuillez sélectionner un statut.";
        if (!form.responsableCouvertureId)    errs.responsableCouvertureId = "Veuillez sélectionner un responsable.";
        if (form.dateDebut && form.dateFin && form.dateFin < form.dateDebut)
        errs.dateFin = "La date de fin doit être après la date de début.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // ── Soumission ──────────────────────────────────────────────────────────────

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        setApiError(null);

        try {
        const article = await quickCreateSalon({
            title:    form.nomOfficiel,
            status:   toApiStatus(form.statutInterne),
            authorId: form.responsableCouvertureId!,
            location: form.villePayss,
            startDate: (new Date(form.dateDebut)).toISOString(),
            endDate:   (new Date(form.dateFin)).toISOString(),
            planningStatus: form.statutInterne,
            type: "SALON",
        });

        console.log("Salon à envoyer :", form, "→ Article créé :", article);


        onSuccess?.(article);
        onClose();
        } catch (err: unknown) {
        setApiError((err as Error).message || "Erreur lors de la création.");
        } finally {
        setSubmitting(false);
        }
    };

    const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors])
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10">

            {/* Header */}
            <div className="px-7 pt-7 pb-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                <h2 className="text-[1.35rem] font-bold text-gray-900 leading-tight">
                    Démarrer la Création d&apos;une Fiche Salon/<wbr />Événement
                </h2>
                <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
                    Saisissez les informations d&apos;identification et la période de
                    l&apos;événement pour planifier la couverture.
                </p>
                </div>
                <button
                onClick={onClose}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                <X size={18} />
                </button>
            </div>
            </div>

            <div className="h-px bg-gray-100 mx-7" />

            {/* Form */}
            <div className="px-7 py-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">

            {/* Erreur API */}
            {apiError && (
                <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{apiError}</span>
                </div>
            )}

            {/* Nom Officiel */}
            <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-800">
                Nom Officiel du Salon / Événement <span className="text-orange-500">*</span>
                </label>
                <input
                type="text"
                value={form.nomOfficiel}
                onChange={(e) => handleChange("nomOfficiel", e.target.value)}
                placeholder="Ex: World Travel Market (WTM) London 2026"
                className={inputCls(!!errors.nomOfficiel)}
                />
                {errors.nomOfficiel && <p className="text-xs text-red-500">{errors.nomOfficiel}</p>}
            </div>

            {/* Ville et Pays */}
            <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-800">
                Ville et Pays de l&apos;Événement <span className="text-orange-500">*</span>
                </label>
                <input
                type="text"
                value={form.villePayss}
                onChange={(e) => handleChange("villePayss", e.target.value)}
                placeholder="Ex: Londres, Royaume-Uni"
                className={inputCls(!!errors.villePayss)}
                />
                {errors.villePayss && <p className="text-xs text-red-500">{errors.villePayss}</p>}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-800">
                    Date de Début <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                    <input
                    type="date"
                    value={form.dateDebut}
                    onChange={(e) => handleChange("dateDebut", e.target.value)}
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
                    onChange={(e) => handleChange("dateFin", e.target.value)}
                    min={form.dateDebut || undefined}
                    className={`${inputCls(!!errors.dateFin)} pr-10 appearance-none`}
                    />
                    <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.dateFin && <p className="text-xs text-red-500">{errors.dateFin}</p>}
                </div>
            </div>

            {/* Statut Interne */}
            <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-800">
                Statut Interne <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                <select
                    value={form.statutInterne}
                    onChange={(e) => handleChange("statutInterne", e.target.value)}
                    className={`${inputCls(!!errors.statutInterne)} pr-10 appearance-none cursor-pointer ${
                    !form.statutInterne ? "text-gray-400" : "text-gray-800"
                    }`}
                >
                    <option value="" disabled>Sélectionnez un statut</option>
                    {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.statutInterne && <p className="text-xs text-red-500">{errors.statutInterne}</p>}
            </div>

            {/* Responsable — dynamique depuis l'API */}
            <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-800">
                Responsable de la Couverture Éditoriale <span className="text-orange-500">*</span>
                </label>
                {loadingUsers ? (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-400">
                    <Loader2 size={15} className="animate-spin" /> Chargement des responsables…
                </div>
                ) : users.length === 0 ? (
                <p className="text-sm text-gray-400 px-4 py-2.5 rounded-xl border border-gray-200">
                    Aucun responsable disponible.
                </p>
                ) : (
                <div className="relative">
                    <select
                    value={form.responsableCouvertureId ?? ""}
                    onChange={(e) =>
                        handleChange(
                        "responsableCouvertureId",
                        e.target.value ? parseInt(e.target.value, 10) : null
                        )
                    }
                    className={`${inputCls(!!errors.responsableCouvertureId)} pr-10 appearance-none cursor-pointer ${
                        !form.responsableCouvertureId ? "text-gray-400" : "text-gray-800"
                    }`}
                    >
                    <option value="" disabled>Sélectionnez un responsable</option>
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>
                        {u.name}{u.role ? ` — ${u.role}` : ""}
                        </option>
                    ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                )}
                {errors.responsableCouvertureId && (
                <p className="text-xs text-red-500">{errors.responsableCouvertureId}</p>
                )}
            </div>
            </div>

            {/* Footer */}
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