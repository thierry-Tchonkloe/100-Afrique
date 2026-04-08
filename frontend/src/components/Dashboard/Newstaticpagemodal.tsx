// "use client";

// import { useState, useEffect } from "react";
// import { Loader2, AlertCircle } from "lucide-react";
// import { getToken } from "@/lib/auth";

// // ─── Auth ─────────────────────────────────────────────────────────────────────

// function getAuthHeaders(): HeadersInit {
//     const token = getToken();
//     return {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     };
// }

// // ─── Types ───────────────────────────────────────────────────────────────────

// type Visibility = "public" | "private";
// type Status = "PUBLISHED" | "ARCHIVED" | "DRAFT";

// interface FormData {
//     title: string;
//     slug: string;
//     status: Status;
//     visibility: Visibility;
// }

// interface FormErrors {
//     title?: string;
//     slug?: string;
//     status?: string;
// }

// function slugify(value: string): string {
//     return value
//         .toLowerCase()
//         .normalize("NFD")
//         .replace(/[\u0300-\u036f]/g, "")
//         .replace(/\s+/g, "-")
//         .replace(/[^a-z0-9-]/g, "");
// }

// interface NewStaticPageModalProps {
//     isOpen?: boolean;
//     onClose?: () => void;
//     onSuccess?: () => void;
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function NewStaticPageModal({
//     isOpen = true,
//     onClose,
//     onSuccess,
// }: NewStaticPageModalProps) {
//     const [form, setForm] = useState<FormData>({
//         title: "",
//         slug: "",
//         status: "PUBLISHED",
//         visibility: "public",
//     });
//     const [errors, setErrors] = useState<FormErrors>({});
//     const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [apiError, setApiError] = useState<string | null>(null);

//     const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

//     // ── Reset à la fermeture ──────────────────────────────────────────────────
//     useEffect(() => {
//         if (!isOpen) {
//             setForm({ title: "", slug: "", status: "", visibility: "public" });
//             setErrors({});
//             setApiError(null);
//             setSlugManuallyEdited(false);
//         }
//     }, [isOpen]);

//     // ── Échap pour fermer ─────────────────────────────────────────────────────
//     useEffect(() => {
//         const handler = (e: KeyboardEvent) => {
//             if (e.key === "Escape" && isOpen) onClose?.();
//         };
//         document.addEventListener("keydown", handler);
//         return () => document.removeEventListener("keydown", handler);
//     }, [isOpen, onClose]);

//     if (!isOpen) return null;

//     const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const title = e.target.value;
//         setForm((prev) => ({
//             ...prev,
//             title,
//             slug: slugManuallyEdited ? prev.slug : slugify(title),
//         }));
//         if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
//     };

//     const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const raw = e.target.value;
//         const slug = slugify(raw);
//         setSlugManuallyEdited(true);
//         setForm((prev) => ({ ...prev, slug }));
//         if (errors.slug) setErrors((prev) => ({ ...prev, slug: undefined }));
//     };

//     const validate = (): boolean => {
//         const newErrors: FormErrors = {};
//         if (!form.title.trim()) newErrors.title = "Le titre est requis.";
//         if (!form.slug.trim()) newErrors.slug = "Le slug est requis.";
//         else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug))
//             newErrors.slug = "Format invalide : lettres minuscules, chiffres et tirets uniquement.";
//         if (!form.status) newErrors.status = "Veuillez sélectionner un statut.";
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async () => {
//         if (!validate()) return;
//         setSubmitting(true);
//         setApiError(null);

//         try {
//             const res = await fetch(`${API}/admin/articles/quick`, {
//                 method: "POST",
//                 headers: getAuthHeaders(),
//                 credentials: "include",
//                 body: JSON.stringify({
//                     title: form.title.trim(),
//                     slug: form.slug.trim(),
//                     status: form.status,
//                     visibility: form.visibility,
//                 }),
//             });

//             if (!res.ok) {
//                 const json = await res.json();
//                 const msg =
//                     json?.errors?.[0]?.message ??
//                     json?.message ??
//                     "Erreur lors de la création.";
//                 setApiError(msg);
//                 return;
//             }

//             const json = await res.json();
//             const id = json?.data?.id ?? json?.data?.page?.id ?? json?.id;

//             if (!id) {
//                 setApiError("ID de la page introuvable.");
//                 return;
//             }

//             onSuccess?.();
//             onClose?.();
//         } catch {
//             setApiError("Erreur réseau. Vérifiez votre connexion et réessayez.");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     return (
//         <div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
//             onClick={(e) => e.target === e.currentTarget && onClose?.()}
//         >
//             {/* Modal */}
//             <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
//                 {/* Top accent line */}
//                 <div className="h-1 w-full bg-lineair-to-r from-orange-500 via-orange-400 to-amber-400" />

//                 {/* Header */}
//                 <div className="px-8 pt-7 pb-5 border-b border-gray-100">
//                     <h2 className="text-[1.35rem] font-bold text-gray-900 leading-tight tracking-tight">
//                         Démarrer la Création d&apos;une{" "}
//                         <span className="text-orange-500">Nouvelle Page Statique</span>
//                     </h2>
//                     <p className="mt-2 text-sm text-gray-500 leading-relaxed">
//                         Veuillez définir le titre principal et le chemin d&apos;accès (Slug) de cette page
//                         institutionnelle.
//                     </p>

//                     <button
//                         onClick={onClose}
//                         disabled={submitting}
//                         className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
//                         aria-label="Fermer"
//                     >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                     </button>
//                 </div>

//                 {/* Body */}
//                 <div className="px-8 py-6 space-y-5">

//                     {/* Bannière erreur API */}
//                     {apiError && (
//                         <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
//                             <AlertCircle size={16} className="shrink-0 mt-0.5" />
//                             <span>{apiError}</span>
//                         </div>
//                     )}

//                     {/* Title */}
//                     <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                             Titre de la Page
//                             <span className="text-orange-500 ml-0.5">*</span>
//                             <span className="font-normal text-gray-400 ml-1.5">(Utilisé en H1 et dans le menu)</span>
//                         </label>
//                         <input
//                             type="text"
//                             value={form.title}
//                             onChange={handleTitleChange}
//                             placeholder="Ex: Politique de Confidentialité"
//                             className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-orange-400 focus:border-orange-400 ${
//                                 errors.title ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
//                             }`}
//                         />
//                         {errors.title && (
//                             <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
//                                 <AlertCircle size={13} className="shrink-0" />{errors.title}
//                             </p>
//                         )}
//                     </div>

//                     {/* Slug */}
//                     <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                             URL de la Page (Slug)
//                             <span className="text-orange-500 ml-0.5">*</span>
//                         </label>
//                         <div className="relative">
//                             <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">/</span>
//                             <input
//                                 type="text"
//                                 value={form.slug}
//                                 onChange={handleSlugChange}
//                                 placeholder="Ex: politique-confidentialite"
//                                 className={`w-full rounded-lg border pl-6 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-orange-400 focus:border-orange-400 font-mono ${
//                                     errors.slug ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
//                                 }`}
//                             />
//                         </div>
//                         <p className="mt-1.5 text-xs text-gray-400">
//                             Utilisez uniquement des lettres minuscules, chiffres et tirets
//                         </p>
//                         {errors.slug && (
//                             <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
//                                 <AlertCircle size={13} className="shrink-0" />{errors.slug}
//                             </p>
//                         )}
//                     </div>

//                     {/* Status */}
//                     <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-1.5">
//                             Statut de Démarrage
//                             <span className="text-orange-500 ml-0.5">*</span>
//                         </label>
//                         <div className="relative">
//                             <select
//                                 value={form.status}
//                                 onChange={(e) => {
//                                     setForm((prev) => ({ ...prev, status: e.target.value as Status }));
//                                     if (errors.status) setErrors((prev) => ({ ...prev, status: undefined }));
//                                 }}
//                                 className={`w-full appearance-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-orange-400 focus:border-orange-400 cursor-pointer ${
//                                     form.status ? "text-gray-800" : "text-gray-400"
//                                 } ${
//                                     errors.status ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
//                                 }`}
//                             >
//                                 <option value="" disabled>Sélectionner un statut</option>
//                                 <option value="draft">Brouillon</option>
//                                 <option value="published">Publié</option>
//                                 <option value="archived">Archivé</option>
//                             </select>
//                             <svg
//                                 className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
//                                 fill="none" stroke="currentColor" viewBox="0 0 24 24"
//                             >
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                             </svg>
//                         </div>
//                         {errors.status && (
//                             <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
//                                 <AlertCircle size={13} className="shrink-0" />{errors.status}
//                             </p>
//                         )}
//                     </div>

//                     {/* Visibility */}
//                     <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2.5">
//                             Visibilité et Navigation
//                             <span className="text-orange-500 ml-0.5">*</span>
//                         </label>
//                         <div className="space-y-2.5">
//                             {(
//                                 [
//                                     {
//                                         value: "public",
//                                         label: "Publique",
//                                         desc: "Visible dans le sitemap et les moteurs de recherche",
//                                     },
//                                     {
//                                         value: "private",
//                                         label: "Privée",
//                                         desc: "Accessible par URL directe uniquement (Ex: Page de remerciement)",
//                                     },
//                                 ] as const
//                             ).map(({ value, label, desc }) => (
//                                 <label
//                                     key={value}
//                                     className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
//                                         form.visibility === value
//                                             ? "border-orange-400 bg-orange-50"
//                                             : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//                                     }`}
//                                 >
//                                     <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors">
//                                         <div
//                                             className={`w-2 h-2 rounded-full transition-all ${
//                                                 form.visibility === value ? "bg-orange-500 scale-100" : "scale-0"
//                                             }`}
//                                         />
//                                         <input
//                                             type="radio"
//                                             name="visibility"
//                                             value={value}
//                                             checked={form.visibility === value}
//                                             onChange={() => setForm((prev) => ({ ...prev, visibility: value }))}
//                                             className="sr-only"
//                                         />
//                                     </div>
//                                     <div>
//                                         <p className="text-sm font-medium text-gray-800">{label}</p>
//                                         <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
//                                     </div>
//                                 </label>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
//                     <button
//                         onClick={onClose}
//                         disabled={submitting}
//                         className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-800 transition-colors disabled:opacity-50"
//                     >
//                         Annuler
//                     </button>
//                     <button
//                         onClick={handleSubmit}
//                         disabled={submitting}
//                         className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-colors shadow-sm shadow-orange-200 disabled:opacity-60 disabled:cursor-not-allowed"
//                     >
//                         {submitting ? (
//                             <><Loader2 size={15} className="animate-spin" /> Création en cours…</>
//                         ) : (
//                             <>
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                                 </svg>
//                                 COMMENCER L&apos;ÉDITION DE LA PAGE
//                             </>
//                         )}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }








"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2, AlertCircle, FileText } from "lucide-react";
import { quickCreatePage } from "@/services/Dashboard/pageservice";
import { Article } from "@/services/Dashboard/articleservice";
import { getToken } from "@/lib/auth";

// ─── Auth ─────────────────────────────────────────────────────────────────────

function authHeaders(): HeadersInit {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

// ─── Types ────────────────────────────────────────────────────────────────────

type PageStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
type Visibility = "public" | "private";

interface Author {
    id: number;
    name: string;
    role?: string;
}

interface FormData {
    title: string;
    slug: string;
    status: PageStatus;
    visibility: Visibility;
    authorId: string;
}

interface FormErrors {
    title?: string;
    slug?: string;
    status?: string;
    authorId?: string;
}

interface NewStaticPageModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Reçoit l'article créé pour ouvrir l'éditeur directement */
    onSuccess?: (article: Article) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
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

function initials(name: string) {
    return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function NewStaticPageModal({isOpen, onClose, onSuccess,}: NewStaticPageModalProps) {
    const [form, setForm] = useState<FormData>({
        title: "",
        slug: "",
        status: "DRAFT",
        visibility: "public",
        authorId: "",
    });
    const [errors, setErrors]           = useState<FormErrors>({});
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [submitting, setSubmitting]   = useState(false);
    const [apiError, setApiError]       = useState<string | null>(null);

    const [authors, setAuthors]               = useState<Author[]>([]);
    const [loadingAuthors, setLoadingAuthors] = useState(false);

    const titleRef = useRef<HTMLInputElement>(null);
    const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

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

    // ── Reset / focus ──────────────────────────────────────────────────────────

    useEffect(() => {
        if (isOpen) {
        setTimeout(() => titleRef.current?.focus(), 100);
        } else {
        setForm({ title: "", slug: "", status: "DRAFT", visibility: "public", authorId: "" });
        setErrors({});
        setApiError(null);
        setSlugManuallyEdited(false);
        }
    }, [isOpen]);

    // ── Échap ──────────────────────────────────────────────────────────────────

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) onClose(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    // ── Handlers ───────────────────────────────────────────────────────────────

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setForm((prev) => ({
        ...prev,
        title,
        slug: slugManuallyEdited ? prev.slug : slugify(title),
        }));
        if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlugManuallyEdited(true);
        const slug = slugify(e.target.value);
        setForm((prev) => ({ ...prev, slug }));
        if (errors.slug) setErrors((prev) => ({ ...prev, slug: undefined }));
    };

    // ── Validation ─────────────────────────────────────────────────────────────

    const validate = (): boolean => {
        const errs: FormErrors = {};
        if (!form.title.trim())   errs.title    = "Le titre est requis.";
        if (!form.slug.trim())    errs.slug     = "Le slug est requis.";
        else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug))
        errs.slug = "Format invalide : lettres minuscules, chiffres et tirets uniquement.";
        if (!form.status)         errs.status   = "Veuillez sélectionner un statut.";
        if (!form.authorId)       errs.authorId = "Veuillez sélectionner un auteur.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // ── Soumission ─────────────────────────────────────────────────────────────

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        setApiError(null);

        try {
        const article = await quickCreatePage({
            title:    form.title,
            status:   form.status,
            slug:     form.slug || undefined,
            authorId: Number(form.authorId),
            type:     "PAGE",
        });

        onSuccess?.(article);
        onClose();
        } catch (err: unknown) {
        setApiError((err as Error).message || "Erreur lors de la création.");
        } finally {
        setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
        {/* Backdrop */}
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-page-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

            {/* Accent top */}
            <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 shrink-0" />

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-slate-100">
                <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-orange-100 rounded-lg">
                    <FileText size={16} className="text-orange-500" />
                    </div>
                    <h2 id="new-page-title" className="text-xl font-bold text-slate-900 leading-tight">
                    Créer une{" "}
                    <span className="text-orange-600">Nouvelle Page Statique</span>
                    </h2>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                    Définissez le titre, le chemin d&apos;accès et la visibilité de cette page.
                </p>
                </div>
                <button
                onClick={onClose}
                className="shrink-0 ml-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Fermer"
                >
                <X className="w-5 h-5" />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                {/* Erreur API */}
                {apiError && (
                <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{apiError}</span>
                </div>
                )}

                {/* Titre */}
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Titre de la Page
                    <span className="text-orange-500 ml-0.5">*</span>
                    <span className="font-normal text-slate-400 ml-1.5 text-xs">(utilisé en H1 et dans le menu)</span>
                </label>
                <input
                    ref={titleRef}
                    type="text"
                    value={form.title}
                    onChange={handleTitleChange}
                    placeholder="Ex : Politique de Confidentialité"
                    className={`w-full px-4 py-3 rounded-xl border-2 text-slate-800 placeholder-slate-400 text-sm outline-none transition-all duration-200
                    ${errors.title
                        ? "border-rose-400 ring-2 ring-rose-100"
                        : "border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 hover:border-slate-300"
                    }`}
                />
                {errors.title && (
                    <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle size={13} className="shrink-0" /> {errors.title}
                    </p>
                )}
                </div>

                {/* Slug */}
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    URL de la Page (Slug)
                    <span className="text-orange-500 ml-0.5">*</span>
                </label>
                <div className={`flex rounded-xl border-2 overflow-hidden transition-all duration-200
                    ${errors.slug
                    ? "border-rose-400 ring-2 ring-rose-100"
                    : "border-slate-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 hover:border-slate-300"
                    }`}
                >
                    <span className="flex items-center px-3 bg-slate-50 text-slate-400 text-sm border-r border-slate-200 select-none font-mono">
                    /
                    </span>
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

                {/* Statut */}
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Statut de Démarrage <span className="text-orange-500 ml-0.5">*</span>
                </label>
                <div className={`relative rounded-xl border-2 transition-all duration-200
                    ${errors.status
                    ? "border-rose-400 ring-2 ring-rose-100"
                    : "border-slate-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100"
                    }`}
                >
                    <select
                    value={form.status}
                    onChange={(e) => {
                        setForm((prev) => ({ ...prev, status: e.target.value as PageStatus }));
                        if (errors.status) setErrors((prev) => ({ ...prev, status: undefined }));
                    }}
                    className="w-full appearance-none bg-white px-4 py-3 text-sm text-slate-800 outline-none rounded-xl cursor-pointer"
                    >
                    <option value="DRAFT">Brouillon</option>
                    <option value="PUBLISHED">Publié</option>
                    <option value="ARCHIVED">Archivé</option>
                    </select>
                    <svg
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                {errors.status && (
                    <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle size={13} className="shrink-0" /> {errors.status}
                    </p>
                )}
                </div>

                {/* Auteur */}
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Auteur / Responsable <span className="text-orange-500 ml-0.5">*</span>
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
                    <div className={`relative rounded-xl border-2 transition-all duration-200
                    ${errors.authorId
                        ? "border-rose-400 ring-2 ring-rose-100"
                        : "border-slate-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100"
                    }`}
                    >
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
                            {initials(a.name)} — {a.name}{a.role ? ` (${a.role})` : ""}
                        </option>
                        ))}
                    </select>
                    <svg
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    </div>
                )}
                {errors.authorId && (
                    <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle size={13} className="shrink-0" /> {errors.authorId}
                    </p>
                )}
                </div>

                {/* Visibilité */}
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2.5">
                    Visibilité et Navigation <span className="text-orange-500 ml-0.5">*</span>
                </label>
                <div className="space-y-2.5">
                    {(
                    [
                        {
                        value: "public" as const,
                        label: "Publique",
                        desc: "Visible dans le sitemap et les moteurs de recherche",
                        },
                        {
                        value: "private" as const,
                        label: "Privée",
                        desc: "Accessible par URL directe uniquement (ex : page de remerciement)",
                        },
                    ]
                    ).map(({ value, label, desc }) => (
                    <label
                        key={value}
                        className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        form.visibility === value
                            ? "border-orange-400 bg-orange-50"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                    >
                        <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 border-current flex items-center justify-center transition-colors">
                        <div
                            className={`w-2 h-2 rounded-full transition-all ${
                            form.visibility === value ? "bg-orange-500 scale-100" : "scale-0"
                            }`}
                        />
                        </div>
                        <input
                        type="radio"
                        name="visibility"
                        value={value}
                        checked={form.visibility === value}
                        onChange={() => setForm((prev) => ({ ...prev, visibility: value }))}
                        className="sr-only"
                        />
                        <div>
                        <p className="text-sm font-medium text-slate-800">{label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                        </div>
                    </label>
                    ))}
                </div>
                </div>
            </div>

            {/* Footer */}
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