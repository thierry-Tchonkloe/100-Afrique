"use client";

import { useState, useEffect, useRef } from "react";
import { X, PenSquare, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import { Article,} from "@/services/Dashboard/articleservice";


function getAuthHeaders(): HeadersInit {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}
// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
    id: number;
    name: string;
    slug: string;
    color?: string;
}

interface Author {
    id: number;
    name: string;
    role?: string;
    avatar?: string;
}

interface FormData {
    title: string;
    statusUI: string;
    categoryId: string;
    authorId: string;
}

interface FormErrors {
    title?: string;
    statusUI?: string;
    categoryId?: string;
    authorId?: string;
}

interface NewArticleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (article: Article) => void; // callback optionnel après création
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const STATUSES = [
    { value: "DRAFT",     label: "Brouillon",   color: "text-slate-600",  dot: "bg-slate-400"  },
    { value: "REVIEW",    label: "En révision", color: "text-amber-600",  dot: "bg-amber-400"  },
    { value: "PUBLISHED", label: "Publié",      color: "text-emerald-600", dot: "bg-emerald-400" },
    { value: "ARCHIVED",  label: "Archivé",     color: "text-rose-600",   dot: "bg-rose-400"   },
];

// ─── Custom Select ────────────────────────────────────────────────────────────

interface SelectOption {
    value: string;
    label: string;
    sublabel?: string;
    color?: string;
    dot?: string;
    badgeColor?: string; // couleur hex pour les catégories
    avatar?: string;
}

function CustomSelect({
    placeholder,
    options,
    value,
    onChange,
    error,
    disabled,
    renderOption,
    renderSelected,
}: {
    placeholder: string;
    options: SelectOption[];
    value: string;
    onChange: (v: string) => void;
    error?: string;
    disabled?: boolean;
    renderOption?: (opt: SelectOption) => React.ReactNode;
    renderSelected?: (opt: SelectOption) => React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
        <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setOpen((p) => !p)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 bg-white text-left transition-all duration-200 outline-none
            ${disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}
            ${error
                ? "border-rose-400 ring-2 ring-rose-100"
                : open
                ? "border-orange-400 ring-2 ring-orange-100"
                : "border-slate-200 hover:border-slate-300"
            }`}
        >
            <span className={selected ? "text-slate-800" : "text-slate-400"}>
            {selected
                ? renderSelected
                ? renderSelected(selected)
                : selected.label
                : placeholder}
            </span>
            <svg
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        {open && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in">
            {options.map((opt) => (
                <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 transition-colors duration-150
                    ${value === opt.value ? "bg-orange-50 text-orange-700" : "text-slate-700"}`}
                >
                {renderOption ? renderOption(opt) : <span>{opt.label}</span>}
                {value === opt.value && (
                    <svg className="w-4 h-4 text-orange-500 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                )}
                </button>
            ))}
            </div>
        )}

        {error && (
            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle size={13} className="shrink-0" /> {error}
            </p>
        )}
        </div>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Initiales depuis un nom complet */
function initials(name: string) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

// ────────────────────────────── Main Modal ────────────────────────────────────

export default function NewArticleModal({
    isOpen,
    onClose,
    onSuccess,
}: NewArticleModalProps) {
    const router = useRouter();

    const [form, setForm] = useState<FormData>({
        title: "",
        statusUI: "DRAFT",
        categoryId: "",
        authorId: "",
    });
    const [errors, setErrors]       = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError]   = useState<string | null>(null);

    // Données distantes
    const [categories, setCategories]           = useState<Category[]>([]);
    const [authors, setAuthors]                 = useState<Author[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingAuthors, setLoadingAuthors]   = useState(false);

    const titleRef = useRef<HTMLInputElement>(null);
    const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";


    function extractArray<T>(json: any, keys: string[]): T[] {
        for (const key of keys) {
            const value = key.split(".").reduce((acc, k) => acc?.[k], json);
            if (Array.isArray(value)) return value;
        }
        return [];
    }
    // ── Chargement des données au premier open ──────────────────────────────────
    // useEffect(() => {
    //     if (!isOpen) return;

    useEffect(() => {
        if (!isOpen) return;
        if (categories.length && authors.length) return;

        // Catégories
        setLoadingCategories(true);
        fetch(`${API}/admin/categories`, { headers: getAuthHeaders() })
        .then((r) => r.json())
        // 
        .then((json) => {
            console.log("Categories API response:", json);

            //let list: Category[] = [];

            // if (Array.isArray(json)) {
            //     list = json;
            // } else if (Array.isArray(json?.data)) {
            //     list = json.data;
            // } else if (Array.isArray(json?.data?.categories)) {
            //     list = json.data.categories;
            // }
            const list = extractArray<Category>(json, [
                "",
                "data",
                "data.categories"
            ]);

            setCategories(list);
        })
        //.catch(() => setCategories([]))
        .catch((err) => {
            console.error("Categories error:", err);
            setCategories([]);
        })
        .finally(() => setLoadingCategories(false));

        // Auteurs / utilisateurs admin
        setLoadingAuthors(true);
        fetch(`${API}/admin/users`, { headers: getAuthHeaders() })
        .then((r) => r.json())
        // .then((json) => {
        //     const list: Author[] = json?.data ?? json ?? [];
        //     setAuthors(list);
        // })
        .then((json) => {
            console.log("Authors API response:", json);

            //let list: Author[] = [];

            // if (Array.isArray(json)) {
            //     list = json;
            // } else if (Array.isArray(json?.data)) {
            //     list = json.data;
            // } else if (Array.isArray(json?.data?.users)) {
            //     list = json.data.users;
            // }
            const list = extractArray<Author>(json, [
                "",
                "data",
                "data.users"
            ]);

            setAuthors(list);
            console.log("Extracted authors:", list);
        })
        .catch(() => setAuthors([]))
        .finally(() => setLoadingAuthors(false));
    }, [isOpen]);

    // ── Focus + reset ───────────────────────────────────────────────────────────
    useEffect(() => {
        if (isOpen) {
        setTimeout(() => titleRef.current?.focus(), 100);
        } else {
        setForm({ title: "", statusUI: "DRAFT", categoryId: "", authorId: "" });
        setErrors({});
        setApiError(null);
        }
    }, [isOpen]);

    // ── Échap pour fermer ───────────────────────────────────────────────────────
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    // ── Validation ──────────────────────────────────────────────────────────────
    const validate = (): boolean => {
        const errs: FormErrors = {};
        if (!form.title.trim())
        errs.title = "Le titre est requis.";
        else if (form.title.trim().length < 5)
        errs.title = "Minimum 5 caractères.";
        if (!form.statusUI)
        errs.statusUI = "Veuillez sélectionner un statut.";
        if (!form.categoryId)
        errs.categoryId = "Veuillez sélectionner une catégorie.";
        if (!form.authorId)
        errs.authorId = "Veuillez sélectionner un auteur.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // ── Soumission ──────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        setApiError(null);

        try {
        const res = await fetch(`${API}/admin/articles/quick`, {
            method: "POST",
            headers: getAuthHeaders(), //{ "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
            title:      form.title.trim(),
            status:     form.statusUI,
            //categoryId: Number(form.categoryId),
            //authorId:   Number(form.authorId),
            categoryId: parseInt(form.categoryId, 10),
            authorId: parseInt(form.authorId, 10),
            }),
        });

        if (!form.categoryId || !form.authorId) {
            setApiError("Catégorie ou auteur invalide.");
            return;
        }

        if (!res.ok) {
            const json = await res.json();
            // Gère les erreurs de validation Zod renvoyées par Express
            const msg =
            json?.errors?.[0]?.message ??
            json?.message ??
            "Erreur lors de la création.";
            setApiError(msg);
            return;
        }

        const json = await res.json();
        //const id: number = json?.data?.id ?? json?.id;

        const id =
            json?.data?.id ??
            json?.data?.article?.id ??
            json?.id;

        if (!id) {
            setApiError("ID de l'article introuvable.");
            return;
        }

        const fullArticle = await fetch(`${API}/admin/articles/${id}`, {
            headers: getAuthHeaders(),
        }).then(r => r.json());

        onSuccess?.(fullArticle.data ?? fullArticle.data.article ?? fullArticle);

        //onSuccess?.(createdArticle);
        onClose();

        // ✅ Redirection vers l'éditeur
        //router.push(`/admin/articles/${id}/edit`);

        } catch {
        setApiError("Erreur réseau. Vérifiez votre connexion et réessayez.");
        } finally {
        setSubmitting(false);
        }
    };

    // ── Options des selects ─────────────────────────────────────────────────────
    const statusOptions: SelectOption[] = STATUSES.map((s) => ({
        value: s.value,
        label: s.label,
        color: s.color,
        dot: s.dot,
    }));

    const categoryOptions: SelectOption[] = categories.map((c) => ({
        value:      String(c.id),
        label:      c.name,
        badgeColor: c.color,
    }));

    const authorOptions: SelectOption[] = authors.map((a) => ({
        value:    String(a.id),
        label:    a.name,
        sublabel: a.role,
        //avatar:   a.avatar ?? initials(a.name),
        avatar: a.avatar ?? (a.name ? initials(a.name) : "?"),
    }));

    const selectedStatus = STATUSES.find((s) => s.value === form.statusUI);
    const isLoading = loadingCategories || loadingAuthors;

    if (!isOpen) return null;

    return (
        <>
        {/* Backdrop */}
        <div
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
        />

        {/* Modal */}
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-slate-100">
                <div>
                <h2 id="modal-title" className="text-xl font-bold text-slate-900 leading-tight">
                    Démarrer la Création{" "}
                    <span className="text-orange-600">d&apos;un Nouvel Article</span>
                </h2>
                <p className="mt-1.5 text-sm text-slate-500 leading-snug">
                    Renseignez les informations de base. Vous pourrez compléter le contenu ensuite.
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

                {/* Bannière erreur API */}
                {apiError && (
                <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{apiError}</span>
                </div>
                )}

                {/* Titre */}
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Titre Provisoire de l&apos;Article
                    <span className="text-orange-500 ml-0.5">*</span>
                </label>
                <input
                    ref={titleRef}
                    type="text"
                    value={form.title}
                    onChange={(e) => {
                    setForm((p) => ({ ...p, title: e.target.value }));
                    if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
                    }}
                    placeholder="Ex : Le MICE africain à l'heure du numérique"
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

                {/* Statut */}
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Statut Initial
                    <span className="text-orange-500 ml-0.5">*</span>
                </label>
                <CustomSelect
                    placeholder="Sélectionner un statut"
                    options={statusOptions}
                    value={form.statusUI}
                    onChange={(v) => {
                    setForm((p) => ({ ...p, statusUI: v }));
                    if (errors.statusUI) setErrors((p) => ({ ...p, statusUI: undefined }));
                    }}
                    error={errors.statusUI}
                    renderOption={(opt) => (
                    <>
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${opt.dot}`} />
                        <span className={`text-sm font-medium ${opt.color}`}>{opt.label}</span>
                    </>
                    )}
                    renderSelected={(opt) => (
                    <span className="flex items-center gap-2 text-sm">
                        <span className={`w-2.5 h-2.5 rounded-full ${opt.dot}`} />
                        <span className={`font-medium ${opt.color}`}>{opt.label}</span>
                    </span>
                    )}
                />
                </div>

                {/* Catégorie */}
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Catégorie Sectorielle
                    <span className="text-orange-500 ml-0.5">*</span>
                </label>
                {loadingCategories ? (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 text-sm text-slate-400">
                    <Loader2 size={15} className="animate-spin" />
                    Chargement des catégories…
                    </div>
                ) : categories.length === 0 ? (
                    <p className="text-sm text-slate-400 px-4 py-3 rounded-xl border-2 border-slate-200">
                    Aucune catégorie disponible.
                    </p>
                ) : (
                    <CustomSelect
                    placeholder="Sélectionner une catégorie"
                    options={categoryOptions}
                    value={form.categoryId}
                    onChange={(v) => {
                        setForm((p) => ({ ...p, categoryId: v }));
                        if (errors.categoryId) setErrors((p) => ({ ...p, categoryId: undefined }));
                    }}
                    error={errors.categoryId}
                    renderOption={(opt) => (
                        <>
                        <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: opt.badgeColor ?? "#cbd5e1" }}
                        />
                        <span className="text-sm text-slate-700">{opt.label}</span>
                        </>
                    )}
                    renderSelected={(opt) => (
                        <span className="flex items-center gap-2 text-sm">
                        <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: opt.badgeColor ?? "#cbd5e1" }}
                        />
                        <span className="font-medium text-slate-800">{opt.label}</span>
                        </span>
                    )}
                    />
                )}
                </div>

                {/* Auteur */}
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Auteur / Responsable de la Rédaction
                    <span className="text-orange-500 ml-0.5">*</span>
                </label>
                {loadingAuthors ? (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 text-sm text-slate-400">
                    <Loader2 size={15} className="animate-spin" />
                    Chargement des auteurs…
                    </div>
                ) : authors.length === 0 ? (
                    <p className="text-sm text-slate-400 px-4 py-3 rounded-xl border-2 border-slate-200">
                    Aucun auteur disponible.
                    </p>
                ) : (
                    <CustomSelect
                    placeholder="Sélectionner un auteur"
                    options={authorOptions}
                    value={form.authorId}
                    onChange={(v) => {
                        setForm((p) => ({ ...p, authorId: v }));
                        if (errors.authorId) setErrors((p) => ({ ...p, authorId: undefined }));
                    }}
                    error={errors.authorId}
                    renderOption={(opt) => (
                        <>
                        <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {opt.avatar}
                        </span>
                        <span>
                            <span className="block text-sm font-medium text-slate-800">{opt.label}</span>
                            {opt.sublabel && (
                            <span className="block text-xs text-slate-400">{opt.sublabel}</span>
                            )}
                        </span>
                        </>
                    )}
                    renderSelected={(opt) => (
                        <span className="flex items-center gap-2 text-sm">
                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">
                            {opt.avatar}
                        </span>
                        <span className="font-medium text-slate-800">{opt.label}</span>
                        </span>
                    )}
                    />
                )}
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
                //disabled={submitting || isLoading}
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

        <style>{`
            @keyframes animate-in {
            from { opacity: 0; transform: translateY(-6px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0)   scale(1); }
            }
            .animate-in { animation: animate-in 0.15s ease-out; }
        `}</style>
        </>
    );
}