"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Save, Globe, BookOpen, Image as ImageIcon, ChevronDown, Search, Bold, Italic, Underline, List, ListOrdered, Link, Clock, FileText, Video, Plus, Loader2, AlertCircle, CheckCircle2, MapPin, Calendar, Tag as TagIcon, Trash2,} from "lucide-react";
import { updateSalon } from "@/services/Dashboard/salonservice";
import { Article, Tag, fetchTags, Category, fetchCategories, STATUS_API_TO_UI, STATUS_UI_TO_API,} from "@/services/Dashboard/articleservice";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RelatedContent {
    id: number;
    title: string;
    type: "ARTICLE" | "VIDEO";
    slug: string;
    coverImage?: string;
    category?: { name: string; color: string };
}

interface SalonForm {
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    website: string;
    description: string;
    status: string;
    slug: string;
    categoryId: number | undefined;
    selectedTagIds: number[];
    relatedContentIds: number[];
    metaTitle: string;
    metaDescription: string;
    coverImage: string;
    tags: number[];
}

interface SalonEditProps {
    isOpen: boolean;
    salon: Article | null;
    onClose: () => void;
    onSubmit?: (article: Article) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractBodyText(article: Article): string {
    if (!article.content || !Array.isArray(article.content)) return "";
    return (article.content as { type: string; value: string }[])
        .filter((b) => b.type === "text" || b.type === "heading")
        .map((b) => (b.type === "heading" ? `## ${b.value}` : b.value))
        .join("\n\n");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {children}
        </label>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
        {children}
        </h2>
    );
}

function SelectField({ label, value, options, onChange }: {
    label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
    return (
        <div className="space-y-1.5">
        <FieldLabel>{label}</FieldLabel>
        <div className="relative">
            <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition cursor-pointer"
            >
            {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        </div>
    );
}

function RichTextToolbar() {
    return (
        <div className="flex items-center gap-0.5 border-b border-slate-100 bg-slate-50/80 px-3 py-2 rounded-t-xl">
        {[Bold, Italic, Underline].map((Icon, i) => (
            <button key={i} className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-800 hover:shadow-sm">
            <Icon size={13} />
            </button>
        ))}
        <div className="mx-1.5 h-4 w-px bg-slate-200" />
        {[List, ListOrdered].map((Icon, i) => (
            <button key={i} className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-800 hover:shadow-sm">
            <Icon size={13} />
            </button>
        ))}
        <div className="mx-1.5 h-4 w-px bg-slate-200" />
        <button className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-800 hover:shadow-sm">
            <Link size={13} />
        </button>
        </div>
    );
}

// ─── Cover Image Picker (same as VideoEdit final) ─────────────────────────────

function CoverImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const [mode, setMode] = useState<"preview" | "url">("preview");

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/admin/articles", { method: "POST", body: fd });
        const data = await res.json();
        onChange(data.url ?? data.data?.coverImage ?? "");
        } catch (err) {
        console.error(err);
        } finally {
        setUploading(false);
        }
    };

    const applyUrl = () => {
        if (urlInput.trim()) { onChange(urlInput.trim()); setMode("preview"); }
    };

    return (
        <section className="space-y-3">
        <SectionTitle>Média à la Une</SectionTitle>

        <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-800 shadow-lg group">
            {value ? (
            <>
                <img src={value} alt="Miniature" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                    onClick={() => inputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-md hover:bg-slate-50 transition"
                >
                    <ImageIcon size={12} /> Changer
                </button>
                <button
                    onClick={() => { setUrlInput(value); setMode("url"); }}
                    className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-md hover:bg-slate-50 transition"
                >
                    <Link size={12} /> URL
                </button>
                <button
                    onClick={() => onChange("")}
                    className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-red-600 transition"
                >
                    <Trash2 size={12} /> Supprimer
                </button>
                </div>
            </>
            ) : (
            <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-slate-600" />
            </div>
            )}
        </div>

        {mode === "url" ? (
            <div className="flex gap-2">
            <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyUrl()}
                placeholder="https://…"
                autoFocus
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
            <button onClick={applyUrl} className="px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition">OK</button>
            <button onClick={() => setMode("preview")} className="px-3 py-2 rounded-xl border border-slate-200 text-slate-500 text-xs hover:bg-slate-50 transition">Annuler</button>
            </div>
        ) : (
            <div className="flex gap-2">
            <button
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition shadow-md shadow-orange-200 disabled:opacity-60"
            >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                {uploading ? "Envoi…" : "Choisir un fichier"}
            </button>
            <button
                onClick={() => { setUrlInput(value); setMode("url"); }}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition"
                title="Saisir une URL"
            >
                URL
            </button>
            </div>
        )}

        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </section>
    );
}

// ─── Tag Selector (same pattern as VideoEdit final) ───────────────────────────

function TagSelector({ selectedIds, onChange }: { selectedIds: number[]; onChange: (ids: number[]) => void }) {
    const [tagIs, setTagIs] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchTags()
        .then((data) => setTagIs(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, []);

    const toggle = (id: number) =>
        onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);

    const filtered = tagIs.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-2">
        <FieldLabel>
            <span className="flex items-center gap-1.5">
            <TagIcon className="w-3.5 h-3.5" /> Tags / Mots-clés
            </span>
        </FieldLabel>

        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un tag…"
            className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
        </div>

        <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 space-y-0.5">
            {loading && (
            <div className="flex items-center justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
            </div>
            )}
            {!loading && filtered.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-3">Aucun tag trouvé</p>
            )}
            {!loading && filtered.map((tag) => {
            const active = selectedIds.includes(tag.id);
            return (
                <button
                key={tag.id}
                onClick={() => toggle(tag.id)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                    active
                    ? "bg-orange-50 text-orange-600 border border-orange-200"
                    : "text-slate-600 hover:bg-slate-50 border border-transparent"
                }`}
                >
                <span className={`w-3 h-3 rounded-full border-2 shrink-0 transition ${
                    active ? "bg-orange-500 border-orange-500" : "border-slate-300"
                }`} />
                {tag.name}
                </button>
            );
            })}
        </div>

        {selectedIds.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
            {tagIs.filter((t) => selectedIds.includes(t.id)).map((t) => (
                <span key={t.id} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                {t.name}
                <button onClick={() => toggle(t.id)} className="hover:opacity-70 transition-opacity">
                    <X className="w-2.5 h-2.5" />
                </button>
                </span>
            ))}
            </div>
        )}
        </div>
    );
}

// ─── Related Content Selector ─────────────────────────────────────────────────

function RelatedContentSelector({ selectedIds, onChange }: {
    selectedIds: number[];
    onChange: (ids: number[]) => void;
}) {
    const [allContent, setAllContent] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<"ALL" | "ARTICLE" | "VIDEO">("ALL");
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Lazy load on first open
    useEffect(() => {
        if (!open || allContent.length > 0) return;
        setLoading(true);
        Promise.all([
        fetch("/api/articles?type=ARTICLE&limit=100").then((r) => r.json()),
        fetch("/api/articles?type=VIDEO&limit=100").then((r) => r.json()),
        ])
        .then(([artRes, vidRes]) => {
            const arts: Article[] = (artRes.data ?? artRes ?? []).map((a: Article) => ({
            id: a.id, title: a.title, type: "ARTICLE" as const,
            slug: a.slug, coverImage: a.coverImage, category: a.category,
            }));
            const vids: Article[] = (vidRes.data ?? vidRes ?? []).map((v: Article) => ({
            id: v.id, title: v.title, type: "VIDEO" as const,
            slug: v.slug, coverImage: v.coverImage, category: v.category,
            }));
            setAllContent([...arts, ...vids]);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, [open, allContent.length]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const toggle = (id: number) =>
        onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);

    const filtered = allContent.filter((c) => {
        const matchType = typeFilter === "ALL" || c.type === typeFilter;
        const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
    });

    const selectedItems = allContent.filter((c) => selectedIds.includes(c.id));

    return (
        <div className="space-y-2">
        <FieldLabel>Contenus Associés</FieldLabel>

        {/* Selected items */}
        {selectedItems.length > 0 && (
            <div className="space-y-1.5">
            {selectedItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                {item.coverImage ? (
                    <img src={item.coverImage} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                ) : (
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${item.type === "VIDEO" ? "bg-purple-100" : "bg-blue-100"}`}>
                    {item.type === "VIDEO"
                        ? <Video size={12} className="text-purple-600" />
                        : <FileText size={12} className="text-blue-600" />}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{item.title}</p>
                    <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-0.5 ${
                    item.type === "VIDEO" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                    }`}>
                    {item.type === "VIDEO" ? "Vidéo" : "Article"}
                    </span>
                </div>
                <button
                    onClick={() => toggle(item.id)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition shrink-0"
                >
                    <X size={13} />
                </button>
                </div>
            ))}
            </div>
        )}

        {/* Dropdown trigger */}
        <div ref={dropdownRef} className="relative">
            <button
            onClick={() => setOpen((o) => !o)}
            className="w-full flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-500 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition"
            >
            <Plus size={13} />
            <span>Ajouter du contenu associé…</span>
            <ChevronDown size={12} className={`ml-auto transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
            <div className="absolute top-full left-0 right-0 mt-1.5 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 z-50 overflow-hidden">
                {/* Search + type filter */}
                <div className="p-3 space-y-2 border-b border-slate-100">
                <div className="relative">
                    <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher par titre…"
                    autoFocus
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition"
                    />
                </div>
                <div className="flex gap-1.5">
                    {(["ALL", "ARTICLE", "VIDEO"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                        typeFilter === t ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                    >
                        {t === "VIDEO" && <Video size={10} />}
                        {t === "ARTICLE" && <FileText size={10} />}
                        {t === "ALL" ? "Tout" : t === "VIDEO" ? "Vidéos" : "Articles"}
                    </button>
                    ))}
                </div>
                </div>

                {/* Results */}
                <div className="max-h-56 overflow-y-auto p-2 space-y-0.5">
                {loading && (
                    <div className="flex justify-center py-6">
                    <Loader2 size={16} className="animate-spin text-orange-400" />
                    </div>
                )}
                {!loading && filtered.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">Aucun contenu trouvé</p>
                )}
                {!loading && filtered.map((item) => {
                    const selected = selectedIds.includes(item.id);
                    return (
                    <button
                        key={item.id}
                        onClick={() => toggle(item.id)}
                        className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${
                        selected ? "bg-orange-50 border border-orange-200" : "hover:bg-slate-50 border border-transparent"
                        }`}
                    >
                        {item.coverImage ? (
                        <img src={item.coverImage} alt="" className="w-7 h-7 rounded-lg object-cover shrink-0" />
                        ) : (
                        <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center ${item.type === "VIDEO" ? "bg-purple-100" : "bg-blue-100"}`}>
                            {item.type === "VIDEO"
                            ? <Video size={11} className="text-purple-600" />
                            : <FileText size={11} className="text-blue-600" />}
                        </div>
                        )}
                        <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium truncate ${selected ? "text-orange-700" : "text-slate-700"}`}>{item.title}</p>
                        {item.category && (
                            <p className="text-[10px] text-slate-400 truncate">{item.category.name}</p>
                        )}
                        </div>
                        <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${
                        item.type === "VIDEO" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                        }`}>
                        {item.type === "VIDEO" ? <Video size={8} /> : <FileText size={8} />}
                        {item.type === "VIDEO" ? "Vidéo" : "Article"}
                        </span>
                        <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition ${
                        selected ? "bg-orange-500 border-orange-500" : "border-slate-300"
                        }`}>
                        {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                    </button>
                    );
                })}
                </div>

                {selectedIds.length > 0 && (
                <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                    <strong className="text-orange-600">{selectedIds.length}</strong> sélectionné{selectedIds.length > 1 ? "s" : ""}
                    </span>
                    <button
                    onClick={() => setOpen(false)}
                    className="px-3 py-1 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition"
                    >
                    Confirmer
                    </button>
                </div>
                )}
            </div>
            )}
        </div>
        </div>
    );
}

// ─── Editor Content ───────────────────────────────────────────────────────────

function SalonEditorContent({ salon, onClose, onSubmit }: {
    salon: Article; onClose: () => void; onSubmit?: (a: Article) => void;
}) {
    const [categorie, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        async function loadCategories() {
        try {
            const data = await fetchCategories();
            console.log("CATEGORIES 👉", data);
            setCategories(data?.data);
        } catch (err) {
            console.error("Erreur catégories ❌", err);
        }
        }
        loadCategories();
    }, []);

    const [form, setForm] = useState<SalonForm>({
        title:             salon.title ?? "",
        location:          salon.location ?? "",
        startDate:         salon.startDate ? salon.startDate.slice(0, 10) : "",
        endDate:           salon.endDate   ? salon.endDate.slice(0, 10)   : "",
        website:           salon.website   ?? "",
        description:       extractBodyText(salon),
        status:            STATUS_API_TO_UI[salon.status] ?? "DRAFT",
        slug:              salon.slug ?? "",
        categoryId:        salon.category?.id ?? undefined,
        selectedTagIds:    (salon.tags ?? []).map((t: Tag) => t.id),
        relatedContentIds: (salon.relatedContent ?? []).map((r: Article) => r.id),
        metaTitle:         salon.metaTitle ?? "",
        metaDescription:   salon.metaDescription ?? "",
        coverImage:        salon.coverImage ?? "",
        tags:              (salon.tags ?? []).map((t: Tag) => t.id),
    });

    const [saving,      setSaving]      = useState(false);
    const [publishing,  setPublishing]  = useState(false);
    const [saveError,   setSaveError]   = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const update = useCallback(<K extends keyof SalonForm>(key: K, value: SalonForm[K]) =>
        setForm((prev) => ({ ...prev, [key]: value })), []);

    const save = async (targetStatusUI?: string) => {
        const isSaving = !targetStatusUI;
        if (isSaving) setSaving(true); else setPublishing(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
        const apiStatus = STATUS_UI_TO_API[targetStatusUI ?? form.status] as
            "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";

        const contentBlocks = form.description.trim()
            ? form.description.split(/\n{2,}/).map((line) => {
                const t = line.trim();
                if (!t) return null;
                if (t.startsWith("## ")) return { type: "heading", value: t.slice(3) };
                return { type: "text", value: t };
            }).filter(Boolean) as { type: string; value: string }[]
            : [{ type: "text", value: "Contenu vide" }];

        const payload: Parameters<typeof updateSalon>[1] = {
            title:             form.title.trim()           || undefined,
            status:            apiStatus,
            content:           contentBlocks,
            coverImage:        form.coverImage             || undefined,
            location:          form.location.trim()        || undefined,
            startDate:         new Date(form.startDate)              || undefined,
            endDate:           new Date(form.endDate)                || undefined,
            website:           form.website.trim()         || undefined,
            tags:              form.selectedTagIds,
            categoryId:        form.categoryId,
            relatedContentIds: form.relatedContentIds,
            metaTitle:         form.metaTitle.trim()       || undefined,
            metaDescription:   form.metaDescription.trim() || undefined,
        };

        console.log("Payload to save:", payload);

        const res = await updateSalon(salon.id, payload);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        if (targetStatusUI) onSubmit?.(res.data);
        } catch (err: unknown) {
        setSaveError((err as Error).message || "Erreur lors de la sauvegarde.");
        } finally {
        setSaving(false);
        setPublishing(false);
        }
    };

    const metaTitleLen = form.metaTitle.length;
    const metaDescLen  = form.metaDescription.length;

    return (
        <div className="flex flex-col h-full max-h-[90vh]">

        {/* ── Sticky Header ── */}
        <div className="flex items-start justify-between px-8 py-5 border-b border-slate-100 bg-white shrink-0 rounded-t-3xl">
            <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
                <BookOpen size={18} className="text-orange-500" />
                Édition :{" "}
                <span className="text-orange-500">{form.title || salon.title}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium flex items-center gap-1">
                <Clock size={11} />
                Salon #{salon.id} · Créé le {new Date(salon.createdAt).toLocaleDateString("fr-FR")}
            </p>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
            {saveError && (
                <span className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle size={13} /> {saveError}
                </span>
            )}
            {saveSuccess && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle2 size={13} /> Sauvegardé !
                </span>
            )}
            <button
                onClick={() => save()}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:border-slate-300 hover:bg-slate-50 transition disabled:opacity-60"
            >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button
                onClick={() => save("Publié")}
                disabled={publishing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 active:scale-95 transition disabled:opacity-60 shadow-lg shadow-orange-200"
            >
                {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                {publishing ? "Publication…" : "Publier"}
            </button>
            <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                aria-label="Fermer"
            >
                <X className="w-5 h-5" />
            </button>
            </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="grid grid-cols-1 lg:grid-cols-5">

            {/* LEFT */}
            <div className="lg:col-span-3 p-8 space-y-8 border-r border-slate-100">

                {/* Infos de base */}
                <section className="space-y-5">
                <SectionTitle>Informations de Base</SectionTitle>

                <div className="space-y-1.5">
                    <FieldLabel>Titre du Salon / Événement</FieldLabel>
                    <input
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    placeholder="Ex: Salon International du Tourisme"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                    <FieldLabel>Lieu</FieldLabel>
                    <div className="relative">
                        <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                        value={form.location}
                        onChange={(e) => update("location", e.target.value)}
                        placeholder="Paris Expo…"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                        />
                    </div>
                    </div>
                    <div className="space-y-1.5">
                    <FieldLabel>Date de Début</FieldLabel>
                    <div className="relative">
                        <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                        type="date"
                        value={form.startDate}
                        onChange={(e) => update("startDate", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                        />
                    </div>
                    </div>
                    <div className="space-y-1.5">
                    <FieldLabel>Date de Fin</FieldLabel>
                    <div className="relative">
                        <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                        type="date"
                        value={form.endDate}
                        onChange={(e) => update("endDate", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                        />
                    </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <FieldLabel>Site Web Officiel</FieldLabel>
                    <div className="relative">
                    <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                        type="url"
                        value={form.website}
                        onChange={(e) => update("website", e.target.value)}
                        placeholder="https://…"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-700 font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                    />
                    </div>
                    <p className="text-xs text-slate-400">URL complète du site officiel de l&apos;événement</p>
                </div>
                </section>

                {/* Description */}
                <section className="space-y-3">
                <SectionTitle>Description Détaillée</SectionTitle>
                <div className="flex flex-col gap-1.5">
                    <FieldLabel>
                    Description <span className="text-slate-400 normal-case font-normal">(Historique, Objectifs, Thème)</span>
                    </FieldLabel>
                    <div className="rounded-xl border border-slate-200 overflow-hidden transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                    <RichTextToolbar />
                    <textarea
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        rows={8}
                        placeholder="Décrivez le salon en détail…"
                        className="w-full px-4 py-3 text-sm text-slate-700 leading-relaxed placeholder-slate-400 outline-none resize-none bg-white"
                    />
                    </div>
                </div>
                </section>

                {/* Cover image */}
                <CoverImagePicker
                value={form.coverImage}
                onChange={(url) => update("coverImage", url)}
                />
            </div>

            {/* RIGHT sidebar */}
            <div className="lg:col-span-2 p-8 space-y-7 bg-slate-50/60">

                {/* Statut & classification */}
                <section className="space-y-4">
                <SectionTitle>Statut et Classification</SectionTitle>

                <SelectField
                    label="Statut"
                    value={form.status}
                    options={Object.values(STATUS_API_TO_UI)}
                    onChange={(v) => update("status", v)}
                />

                {/* Catégorie — éditable via fetchCategories (même pattern que VideoEdit) */}
                <div className="space-y-1.5">
                    <FieldLabel>Catégorie</FieldLabel>
                    <div className="relative">
                    <select
                        value={form.categoryId ?? ""}
                        onChange={(e) => update("categoryId", Number(e.target.value))}
                        className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition cursor-pointer shadow-sm"
                    >
                        <option value="">Aucune catégorie</option>
                        {categorie.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Auteur (lecture seule) */}
                <div className="space-y-1.5">
                    <FieldLabel>Responsable</FieldLabel>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600 shrink-0">
                        {salon.author.name.charAt(0)}
                    </div>
                    <span className="text-sm text-slate-700 truncate">{salon.author.name}</span>
                    </div>
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                    <FieldLabel>URL (Slug)</FieldLabel>
                    <input
                    value={form.slug}
                    onChange={(e) => update("slug", e.target.value)}
                    placeholder="/salons/mon-salon-2025"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                    />
                </div>
                </section>

                {/* Tags */}
                <TagSelector
                selectedIds={form.selectedTagIds}
                onChange={(ids) => update("selectedTagIds", ids)}
                />

                {/* Contenus associés */}
                <RelatedContentSelector
                selectedIds={form.relatedContentIds}
                onChange={(ids) => update("relatedContentIds", ids)}
                />

                {/* SEO */}
                <section className="space-y-4">
                <SectionTitle>Optimisation SEO</SectionTitle>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                    <FieldLabel>Titre Méta</FieldLabel>
                    <span className={`text-xs font-medium tabular-nums ${metaTitleLen > 60 ? "text-red-500" : "text-slate-400"}`}>
                        {metaTitleLen}/60
                    </span>
                    </div>
                    <input
                    value={form.metaTitle}
                    onChange={(e) => update("metaTitle", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    />
                    <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${metaTitleLen > 60 ? "bg-red-400" : "bg-orange-400"}`}
                        style={{ width: `${Math.min((metaTitleLen / 60) * 100, 100)}%` }}
                    />
                    </div>
                    <p className="text-xs text-slate-400">60 caractères recommandés</p>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                    <FieldLabel>Description Méta</FieldLabel>
                    <span className={`text-xs font-medium tabular-nums ${metaDescLen > 160 ? "text-red-500" : "text-slate-400"}`}>
                        {metaDescLen}/160
                    </span>
                    </div>
                    <textarea
                    value={form.metaDescription}
                    onChange={(e) => update("metaDescription", e.target.value)}
                    rows={4}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none"
                    />
                    <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${metaDescLen > 160 ? "bg-red-400" : "bg-orange-400"}`}
                        style={{ width: `${Math.min((metaDescLen / 160) * 100, 100)}%` }}
                    />
                    </div>
                    <p className="text-xs text-slate-400">160 caractères recommandés</p>
                </div>
                </section>
            </div>
            </div>
        </div>
        </div>
    );
}

// ─── Modal Wrapper ────────────────────────────────────────────────────────────

export default function SalonEdit({ isOpen, salon, onClose, onSubmit }: SalonEditProps) {
    const overlayRef            = useRef<HTMLDivElement>(null);
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
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        if (isOpen) window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    if (!mounted || !salon) return null;

    return (
        <div
        ref={overlayRef}
        onClick={(e) => e.target === overlayRef.current && onClose()}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        style={{
            backgroundColor: visible ? "rgba(15, 23, 42, 0.6)" : "rgba(15, 23, 42, 0)",
            backdropFilter:  visible ? "blur(6px)" : "blur(0px)",
            transition:      "background-color 300ms ease, backdrop-filter 300ms ease",
        }}
        role="dialog"
        aria-modal="true"
        >
        <div
            className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            style={{
            opacity:       visible ? 1 : 0,
            transform:     visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
            transition:    "opacity 300ms ease, transform 300ms ease",
            maxHeight:     "90vh",
            display:       "flex",
            flexDirection: "column",
            }}
        >
            <SalonEditorContent salon={salon} onClose={onClose} onSubmit={onSubmit} />
        </div>
        </div>
    );
}