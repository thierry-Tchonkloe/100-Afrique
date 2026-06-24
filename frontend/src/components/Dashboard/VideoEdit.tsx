"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Save, Globe, Calendar, Clock, Image as ImageIcon, ChevronDown, Play, Loader2, AlertCircle, CheckCircle2, Tag as TagIcon, Search, Filter,} from "lucide-react";
import { updateVideo } from "@/services/Dashboard/video.service";
import { Article, Tag, fetchTags,Category, fetchCategories, STATUS_API_TO_UI, STATUS_UI_TO_API } from "@/services/Dashboard/articleservice";
import { fetchDestinationsForSelect, DestinationOption } from "@/services/Dashboard/destinationservice";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoForm {
    title: string;
    excerpt: string;
    sourceUrl: string;
    duration: string;
    status: string;
    videoType: string;
    publishDate: string;
    selectedTagIds: number[];
    metaTitle: string;
    metaDescription: string;
    coverImage: string;
    tags: number[];
    tagIs: Tag[];
    categoryId: number;
    destinationId: string; // "" = aucune
}

interface VideoEditProps {
    isOpen: boolean;
    video: Article | null;
    onClose: () => void;
    onSubmit?: (article: Article) => void;
}

export interface VideoFilterBarProps {
    categories: Category[];
    authors: { id: number; name: string }[];
    onFilter: (params: {
        categoryId?: number;
        authorId?: number;
        dateFrom?: string;
        dateTo?: string;
    }) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VIDEO_TYPES = ["Interview", "Tutoriel", "Présentation", "Reportage", "Autre"];

function extractVideoUrl(content: Article["content"]): string {
    if (!Array.isArray(content)) return "";
    const block = content.find((b: { type: string; url?: string }) => b.type === "video" && b.url);
    return (block as { url?: string })?.url ?? "";
}

function toEmbedUrl(raw: string): string {
    if (!raw) return "";
    if (raw.includes("/embed/") || raw.includes("player.vimeo")) return raw;
    const ytShort = raw.match(/youtu\.be\/([^?&]+)/);
    if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
    const ytWatch = raw.match(/[?&]v=([^?&]+)/);
    if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;
    const vimeo = raw.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
    return raw;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SelectField({ label, value, options, onChange }: {label: string; value: string; options: string[]; onChange: (v: string) => void;}) {
    return (
        <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
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

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {children}
        </label>
    );
}

// ─── Filter Bar ────────────────────────────────────────────────────────────────

export function VideoFilterBar({ categories, authors, onFilter }: VideoFilterBarProps) {
    const [categoryId, setCategoryId] = useState<number | undefined>(categories[0]?.id);
    const [authorId,   setAuthorId]   = useState<number | undefined>();
    const [dateFrom,   setDateFrom]   = useState("");
    const [dateTo,     setDateTo]     = useState("");
    const [categorie, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        if (categories[0]?.id) {
            setCategoryId(categories[0].id);
        }
    }, [categories]);

    useEffect(() => {
    async function loadCategories() {
        try {
        const data = await fetchCategories();
        setCategories(data?.data);
        } catch (err) {
        console.error("Erreur catégories ❌", err);
        } finally {
        setLoadingCategories(false);
        }
    }
    loadCategories();
    }, []);

    const apply = () => onFilter({ categoryId, authorId, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined });
    const reset = () => {
        setCategoryId(undefined); setAuthorId(undefined); setDateFrom(""); setDateTo("");
        onFilter({});
    };

    return (
        <div className="flex flex-wrap items-end gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <Filter className="w-4 h-4 text-slate-400 mt-auto mb-2.5 shrink-0" />

        <div className="space-y-1 min-w-40">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Catégorie</label>
            <div className="relative">
            <select value={categoryId ?? ""}
                onChange={(e) =>
                    setCategoryId(e.target.value ? Number(e.target.value) : undefined)
                }
                disabled={loadingCategories}
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition cursor-pointer"
            >
                <option value="">Toutes</option>
                {categorie.map((c) => (
                    <option key={c.id} value={c.id}>
                    {c.name}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
        </div>

        <div className="space-y-1 min-w-40">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Auteur</label>
            <div className="relative">
            <select
                value={authorId ?? ""}
                onChange={(e) => setAuthorId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition cursor-pointer"
            >
                <option value="">Tous</option>
                {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
        </div>

        <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Du</label>
            <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
        </div>

        <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Au</label>
            <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
        </div>

        <div className="flex gap-2 mt-auto">
            <button
            onClick={apply}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition shadow-md shadow-orange-100"
            >
            <Search className="w-3.5 h-3.5" /> Filtrer
            </button>
            <button
            onClick={reset}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
            >
            Réinitialiser
            </button>
        </div>
        </div>
    );
}

// ─── Tag Selector ─────────────────────────────────────────────────────────────

function TagSelector({ selectedIds, onChange,}: { selectedIds: number[]; onChange: (ids: number[]) => void;}) {
    const [tagIs,    setTagIs]    = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [search,  setSearch]  = useState("");

    useEffect(() => {
        fetchTags()
        .then((data) => {
            setTagIs(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, []);

    const toggle = (id: number) => {
        onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
    };

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
                <span
                key={t.id}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold"
                >
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

// ─── Cover Image Preview ──────────────────────────────────────────────────────

function CoverImagePicker({ value, onChange,}: { value: string; onChange: (url: string) => void;}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [urlInput,  setUrlInput]  = useState("");
    const [mode,      setMode]      = useState<"preview" | "url">("preview");

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
        const fd = new FormData();
        fd.append("file", file);
        const res  = await fetch("/admin/articles", { method: "POST", body: fd });
        const data = await res.json();
        onChange(data.url ?? data.data?.coverImage ?? "");
        } catch (err) {
        console.error(err);
        } finally {
        setUploading(false);
        }
    };

    const applyUrl = () => { if (urlInput.trim()) { onChange(urlInput.trim()); setMode("preview"); } };

    return (
        <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Miniature</h2>

        <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-800 shadow-lg">
            {value ? (
            <img src={value} alt="Miniature" className="w-full h-full object-cover" />
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
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
            <button
                onClick={applyUrl}
                className="px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition"
            >
                OK
            </button>
            <button
                onClick={() => setMode("preview")}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-500 text-xs hover:bg-slate-50 transition"
            >
                Annuler
            </button>
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

// ─── Video Preview with iframe ────────────────────────────────────────────────

function VideoPreview({ rawUrl, duration, onUrlChange, onDurationChange }: {rawUrl: string;duration: string;onUrlChange: (v: string) => void;onDurationChange: (v: string) => void;}) {
    const [inputVal, setInputVal] = useState(rawUrl);
    const embedUrl = toEmbedUrl(rawUrl);

    const apply = () => onUrlChange(inputVal.trim());

    return (
        <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Aperçu de la Vidéo</h2>

        <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video shadow-xl shadow-slate-300/40">
            {embedUrl ? (
            <iframe
                key={embedUrl}
                src={embedUrl}
                title="Aperçu vidéo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
            />
            ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm">
                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                </div>
                <p className="text-white/50 text-xs font-medium">Saisissez une URL YouTube / Vimeo</p>
            </div>
            )}
            {duration && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm font-mono">
                {duration}
            </div>
            )}
        </div>

        <div className="space-y-1.5">
            <FieldLabel>URL Source <span className="text-slate-400 normal-case font-normal">(YouTube / Vimeo)</span></FieldLabel>
            <div className="flex gap-2">
            <input
                type="url"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && apply()}
                placeholder="https://www.youtube.com/watch?v=… ou embed"
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
            <button
                onClick={apply}
                className="px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition shadow-sm"
            >
                ▶ Lire
            </button>
            </div>
        </div>

        <div className="space-y-1.5">
            <FieldLabel>Durée</FieldLabel>
            <div className="flex items-center gap-3">
            <input
                value={duration}
                onChange={(e) => onDurationChange(e.target.value)}
                placeholder="12:35"
                className="w-28 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Format : MM:SS
            </span>
            </div>
        </div>
        </section>
    );
}

// ─── Editor Content ───────────────────────────────────────────────────────────

function VideoEditorContent({video, onClose, onSubmit }: { video: Article; onClose: () => void; onSubmit?: (article: Article) => void;}) {
    const initialVideoUrl = extractVideoUrl(video.content) || video.sourceUrl || "";

    const [categorie, setCategories] = useState<Category[]>([]);
    const [destinations, setDestinations] = useState<DestinationOption[]>([]);
    const [loadingDestinations, setLoadingDestinations] = useState(false);

    useEffect(() => {
    async function loadCategories() {
        try {
        const data = await fetchCategories();
        setCategories(data?.data);
        } catch (err) {
        console.error("Erreur catégories ❌", err);
        }
    }
    loadCategories();
    }, []);

    useEffect(() => {
        setLoadingDestinations(true);
        fetchDestinationsForSelect()
            .then(setDestinations)
            .catch(() => setDestinations([]))
            .finally(() => setLoadingDestinations(false));
    }, []);

    const [form, setForm] = useState<VideoForm>({
        title:          video.title ?? "",
        excerpt:    video.excerpt ?? "",
        sourceUrl:      initialVideoUrl,
        duration:       video.duration ?? "",
        status:         STATUS_API_TO_UI[video.status] ?? "DRAFT",
        videoType:      video.videoType ?? "Interview",
        publishDate:    video.createdAt ? video.createdAt.slice(0, 16) : "",
        selectedTagIds: (video.tags ?? []).map((t: Tag) => t.id),
        metaTitle:      video.metaTitle ?? "",
        metaDescription: video.metaDescription ?? "",
        coverImage:     video.coverImage ?? "",
        tags:            (video.tags ?? []).map((t: Tag) => t.id),
        tagIs:           video.tags ?? [],
        categoryId:      video.category?.id ?? undefined,
        destinationId:   video.destinationId ? String(video.destinationId) : "",
    });

    const [saving,      setSaving]      = useState(false);
    const [publishing,  setPublishing]  = useState(false);
    const [saveError,   setSaveError]   = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const update = useCallback(<K extends keyof VideoForm>(key: K, value: VideoForm[K]) =>
        setForm((prev) => ({ ...prev, [key]: value })), []);

    const save = async (targetStatusUI?: string) => {
        const isSaving = !targetStatusUI;
        if (isSaving) setSaving(true); else setPublishing(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
        const apiStatus = STATUS_UI_TO_API[targetStatusUI ?? form.status] as
            "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";

        const payload: Parameters<typeof updateVideo>[1] = {
            title:   form.title.trim() || undefined,
            status:  apiStatus,
            content: [
            { type: "video", url: form.sourceUrl.trim(), value: form.sourceUrl.trim() },
            { type: "text",  value: form.excerpt.trim() || "Contenu vide" },
            ],
            coverImage:      form.coverImage.trim() || undefined,
            tags:            form.selectedTagIds,
            sourceUrl:       form.sourceUrl.trim()       || undefined,
            duration:        form.duration.trim()         || undefined,
            videoType:       form.videoType               || undefined,
            metaTitle:       form.metaTitle.trim()        || undefined,
            metaDescription: form.metaDescription.trim()  || undefined,
            excerpt:         form.excerpt.trim()          || undefined,
            categoryId:       form.categoryId,
            // ✅ Association optionnelle. "" → null (dissocie).
            destinationId:    form.destinationId ? Number(form.destinationId) : null,
        };

        const res = await updateVideo(video.id, payload);
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
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Édition :{" "}
                <span className="text-orange-500">{form.title || video.title}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Vidéo #{video.id} · Créée le {new Date(video.createdAt).toLocaleDateString("fr-FR")}
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

                <VideoPreview
                rawUrl={form.sourceUrl}
                duration={form.duration}
                onUrlChange={(v) => update("sourceUrl", v)}
                onDurationChange={(v) => update("duration", v)}
                />

                <section className="space-y-5">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Détails et Métadonnées</h2>

                <div className="space-y-1.5">
                    <FieldLabel>Titre de la Vidéo</FieldLabel>
                    <input
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                    />
                </div>

                <div className="space-y-1.5">
                    <FieldLabel>Description <span className="text-slate-400 normal-case font-normal">(résumé SEO)</span></FieldLabel>
                    <textarea
                    value={form.excerpt}
                    onChange={(e) => update("excerpt", e.target.value)}
                    rows={6}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none"
                    />
                </div>
                </section>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-2 p-8 space-y-7 bg-slate-50/60">

                <CoverImagePicker
                value={form.coverImage}
                onChange={(url) => update("coverImage", url)}
                />

                <section className="space-y-4">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Statut et Classification</h2>

                <SelectField
                    label="Statut"
                    value={form.status}
                    options={Object.values(STATUS_API_TO_UI)}
                    onChange={(v) => update("status", v)}
                />
                <SelectField
                    label="Type de Vidéo"
                    value={form.videoType}
                    options={VIDEO_TYPES}
                    onChange={(v) => update("videoType", v)}
                />

                <div className="space-y-1.5">
                    <FieldLabel>Catégorie</FieldLabel>
                    <div className="relative">
                        <select
                        value={form.categoryId ?? ""}
                        onChange={(e) =>
                            update("categoryId", Number(e.target.value))
                        }
                        className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition cursor-pointer"
                        >
                        <option value="">Aucune catégorie</option>
                        {categorie.map((c) => (
                            <option key={c.id} value={c.id}>
                            {c.name}
                            </option>
                        ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Destination associée — optionnelle */}
                <div className="space-y-1.5">
                    <FieldLabel>Destination Associée <span className="text-slate-400 normal-case font-normal">(optionnel)</span></FieldLabel>
                    {loadingDestinations ? (
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-400 bg-white">
                            <Loader2 className="w-4 h-4 animate-spin" /> Chargement…
                        </div>
                    ) : (
                        <div className="relative">
                            <select
                            value={form.destinationId}
                            onChange={(e) => update("destinationId", e.target.value)}
                            className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition cursor-pointer"
                            >
                            <option value="">Aucune destination</option>
                            {destinations.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    )}
                </div>

                <div className="space-y-1.5">
                    <FieldLabel>Auteur</FieldLabel>
                    <p className="text-sm text-slate-600 border border-slate-200 rounded-xl px-4 py-2.5 bg-white">
                    {video.author.name}
                    </p>
                </div>

                <div className="space-y-1.5">
                    <FieldLabel>Date de publication</FieldLabel>
                    <div className="relative">
                    <input
                        type="datetime-local"
                        value={form.publishDate}
                        onChange={(e) => update("publishDate", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <TagSelector
                    selectedIds={form.selectedTagIds}
                    onChange={(ids) => update("selectedTagIds", ids)}
                />
                </section>

                <section className="space-y-4">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Optimisation SEO</h2>

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

export default function VideoEdit({ isOpen, video, onClose, onSubmit }: VideoEditProps) {
    const overlayRef             = useRef<HTMLDivElement>(null);
    const [visible, setVisible]  = useState(false);
    const [mounted, setMounted]  = useState(false);

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

    if (!mounted || !video) return null;

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
            <VideoEditorContent video={video} onClose={onClose} onSubmit={onSubmit} />
        </div>
        </div>
    );
}












// // src/components/Dashboard/VideoEdit.tsx
// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import { X, Save, Globe, Calendar, Clock, Image as ImageIcon, ChevronDown, Play, Loader2, AlertCircle, CheckCircle2, Tag as TagIcon, Search, Filter,} from "lucide-react";
// import { updateVideo } from "@/services/Dashboard/video.service";
// import { Article, Tag, fetchTags,Category, fetchCategories, STATUS_API_TO_UI, STATUS_UI_TO_API } from "@/services/Dashboard/articleservice";

// //const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// // ─── Types ────────────────────────────────────────────────────────────────────

// // interface ApiTag {
// //     id: number;
// //     name: string;
// //     slug: string;
// // }

// interface VideoForm {
//     title: string;
//     excerpt: string;
//     sourceUrl: string;
//     duration: string;
//     status: string;
//     videoType: string;
//     publishDate: string;
//     selectedTagIds: number[];
//     metaTitle: string;
//     metaDescription: string;
//     coverImage: string;
//     tags: number[];
//     tagIs: Tag[];
//     categoryId: number;
// }

// interface VideoEditProps {
//     isOpen: boolean;
//     video: Article | null;
//     onClose: () => void;
//     onSubmit?: (article: Article) => void;
// }

// /** Props for the standalone filter bar — wire to your list page */
// export interface VideoFilterBarProps {
//     categories: Category[];
//     authors: { id: number; name: string }[];
//     onFilter: (params: {
//         categoryId?: number;
//         authorId?: number;
//         dateFrom?: string;
//         dateTo?: string;
//     }) => void;
// }

// // ─── Constants ────────────────────────────────────────────────────────────────

// const VIDEO_TYPES = ["Interview", "Tutoriel", "Présentation", "Reportage", "Autre"];

// /** Extract the first video URL from the article content array */
// function extractVideoUrl(content: Article["content"]): string {
//     if (!Array.isArray(content)) return "";
//     const block = content.find((b: { type: string; url?: string }) => b.type === "video" && b.url);
//     return (block as { url?: string })?.url ?? "";
// }

// /** Normalise a YouTube / Vimeo URL to an embeddable URL */
// function toEmbedUrl(raw: string): string {
//     if (!raw) return "";
//     // Already an embed URL
//     if (raw.includes("/embed/") || raw.includes("player.vimeo")) return raw;
//     // YouTube short
//     const ytShort = raw.match(/youtu\.be\/([^?&]+)/);
//     if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
//     // YouTube watch
//     const ytWatch = raw.match(/[?&]v=([^?&]+)/);
//     if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;
//     // Vimeo
//     const vimeo = raw.match(/vimeo\.com\/(\d+)/);
//     if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
//     return raw;
// }

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function SelectField({ label, value, options, onChange }: {label: string; value: string; options: string[]; onChange: (v: string) => void;}) {
//     return (
//         <div className="space-y-1.5">
//         <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
//         <div className="relative">
//             <select
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition cursor-pointer"
//             >
//             {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
//             </select>
//             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//         </div>
//         </div>
//     );
// }

// function FieldLabel({ children }: { children: React.ReactNode }) {
//     return (
//         <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
//         {children}
//         </label>
//     );
// }

// // ─── Filter Bar (export for use in list page) ─────────────────────────────────

// export function VideoFilterBar({ categories, authors, onFilter }: VideoFilterBarProps) {
//     const [categoryId, setCategoryId] = useState<number | undefined>(categories[0]?.id);
//     const [authorId,   setAuthorId]   = useState<number | undefined>();
//     const [dateFrom,   setDateFrom]   = useState("");
//     const [dateTo,     setDateTo]     = useState("");
//     const [categorie, setCategories] = useState<Category[]>([]);
//     const [loadingCategories, setLoadingCategories] = useState(true);


//     useEffect(() => {
//         if (categories[0]?.id) {
//             setCategoryId(categories[0].id);
//         }
//     }, [categories]);

//     useEffect(() => {
//     async function loadCategories() {
//         try {
//         const data = await fetchCategories();
//         console.log("CATEGORIES 👉", data);
//         setCategories(data?.data);
//         } catch (err) {
//         console.error("Erreur catégories ❌", err);
//         } finally {
//         setLoadingCategories(false);
//         }
//     }


//     loadCategories();
//     }, []);

//     const apply = () => onFilter({ categoryId, authorId, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined });
//     const reset = () => {
//         setCategoryId(undefined); setAuthorId(undefined); setDateFrom(""); setDateTo("");
//         onFilter({});
//     };

//     return (
//         <div className="flex flex-wrap items-end gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
//         <Filter className="w-4 h-4 text-slate-400 mt-auto mb-2.5 shrink-0" />

//         {/* Catégorie */}
//         <div className="space-y-1 min-w-40">
//             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Catégorie</label>
//             <div className="relative">
//             {/* <select
//                 value={categoryId ?? ""}
//                 onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
//                 className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition cursor-pointer"
//             >
//                 <option value="">Toutes</option>
//                 {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
//             </select> */}
//             <select value={categoryId ?? ""}
//                 onChange={(e) =>
//                     setCategoryId(e.target.value ? Number(e.target.value) : undefined)
//                 }
//                 disabled={loadingCategories}
//                 className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition cursor-pointer"
//             >
//                 <option value="">Toutes</option>

//                 {categorie.map((c) => (
//                     <option key={c.id} value={c.id}>
//                     {c.name}
//                     </option>
//                 ))}
//             </select>
//             <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
//             </div>
//         </div>

//         {/* Auteur */}
//         <div className="space-y-1 min-w-40">
//             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Auteur</label>
//             <div className="relative">
//             <select
//                 value={authorId ?? ""}
//                 onChange={(e) => setAuthorId(e.target.value ? Number(e.target.value) : undefined)}
//                 className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition cursor-pointer"
//             >
//                 <option value="">Tous</option>
//                 {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
//             </select>
//             <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
//             </div>
//         </div>

//         {/* Date de création — de */}
//         <div className="space-y-1">
//             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Du</label>
//             <input
//             type="date"
//             value={dateFrom}
//             onChange={(e) => setDateFrom(e.target.value)}
//             className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
//             />
//         </div>

//         {/* Date de création — au */}
//         <div className="space-y-1">
//             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Au</label>
//             <input
//             type="date"
//             value={dateTo}
//             onChange={(e) => setDateTo(e.target.value)}
//             className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
//             />
//         </div>

//         <div className="flex gap-2 mt-auto">
//             <button
//             onClick={apply}
//             className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition shadow-md shadow-orange-100"
//             >
//             <Search className="w-3.5 h-3.5" /> Filtrer
//             </button>
//             <button
//             onClick={reset}
//             className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
//             >
//             Réinitialiser
//             </button>
//         </div>
//         </div>
//     );
// }

// // ─── Tag Selector ─────────────────────────────────────────────────────────────

// function TagSelector({ selectedIds, onChange,}: { selectedIds: number[]; onChange: (ids: number[]) => void;}) {
//     const [tagIs,    setTagIs]    = useState<Tag[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [search,  setSearch]  = useState("");

//     useEffect(() => {
//         fetchTags()
//         .then((data) => {
//             setTagIs(data); // ✅ direct
//         })
//         .catch(console.error)
//         .finally(() => setLoading(false));
//     }, []);

//     console.log("Available tags:", tagIs);


//     const toggle = (id: number) => {
//         onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
//     };

//     const filtered = tagIs.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

//     return (
//         <div className="space-y-2">
//         <FieldLabel>
//             <span className="flex items-center gap-1.5">
//             <TagIcon className="w-3.5 h-3.5" /> Tags / Mots-clés
//             </span>
//         </FieldLabel>

//         {/* Search */}
//         <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
//             <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Rechercher un tag…"
//             className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
//             />
//         </div>

//         {/* Tags list */}
//         <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 space-y-0.5">
//             {loading && (
//             <div className="flex items-center justify-center py-4">
//                 <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
//             </div>
//             )}
//             {!loading && filtered.length === 0 && (
//             <p className="text-xs text-slate-400 text-center py-3">Aucun tag trouvé</p>
//             )}
//             {!loading && filtered.map((tag) => {
//             const active = selectedIds.includes(tag.id);
//             return (
//                 <button
//                 key={tag.id}
//                 onClick={() => toggle(tag.id)}
//                 className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
//                     active
//                     ? "bg-orange-50 text-orange-600 border border-orange-200"
//                     : "text-slate-600 hover:bg-slate-50 border border-transparent"
//                 }`}
//                 >
//                 <span className={`w-3 h-3 rounded-full border-2 shrink-0 transition ${
//                     active ? "bg-orange-500 border-orange-500" : "border-slate-300"
//                 }`} />
//                 {tag.name}
//                 </button>
//             );
//             })}
//         </div>

//         {/* Selected chips */}
//         {selectedIds.length > 0 && (
//             <div className="flex flex-wrap gap-1.5 pt-1">
//             {tagIs.filter((t) => selectedIds.includes(t.id)).map((t) => (
//                 <span
//                 key={t.id}
//                 className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold"
//                 >
//                 {t.name}
//                 <button onClick={() => toggle(t.id)} className="hover:opacity-70 transition-opacity">
//                     <X className="w-2.5 h-2.5" />
//                 </button>
//                 </span>
//             ))}
//             </div>
//         )}
//         </div>
//     );
// }

// // ─── Cover Image Preview ──────────────────────────────────────────────────────

// function CoverImagePicker({ value, onChange,}: { value: string; onChange: (url: string) => void;}) {
//     const inputRef = useRef<HTMLInputElement>(null);
//     const [uploading, setUploading] = useState(false);
//     const [urlInput,  setUrlInput]  = useState("");
//     const [mode,      setMode]      = useState<"preview" | "url">("preview");

//     const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;
//         setUploading(true);
//         try {
//         const fd = new FormData();
//         fd.append("file", file);
//         const res  = await fetch("/admin/articles", { method: "POST", body: fd });
//         const data = await res.json();
//         onChange(data.url ?? data.data?.coverImage ?? "");
//         } catch (err) {
//         console.error(err);
//         } finally {
//         setUploading(false);
//         }
//     };

//     const applyUrl = () => { if (urlInput.trim()) { onChange(urlInput.trim()); setMode("preview"); } };

//     return (
//         <section className="space-y-3">
//         <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Miniature</h2>

//         {/* Preview */}
//         <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-800 shadow-lg">
//             {value ? (
//             <img src={value} alt="Miniature" className="w-full h-full object-cover" />
//             ) : (
//             <div className="absolute inset-0 flex items-center justify-center">
//                 <ImageIcon className="w-10 h-10 text-slate-600" />
//             </div>
//             )}
//         </div>

//         {/* URL input toggle */}
//         {mode === "url" ? (
//             <div className="flex gap-2">
//             <input
//                 value={urlInput}
//                 onChange={(e) => setUrlInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && applyUrl()}
//                 placeholder="https://…"
//                 className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
//             />
//             <button
//                 onClick={applyUrl}
//                 className="px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition"
//             >
//                 OK
//             </button>
//             <button
//                 onClick={() => setMode("preview")}
//                 className="px-3 py-2 rounded-xl border border-slate-200 text-slate-500 text-xs hover:bg-slate-50 transition"
//             >
//                 Annuler
//             </button>
//             </div>
//         ) : (
//             <div className="flex gap-2">
//             <button
//                 onClick={() => inputRef.current?.click()}
//                 disabled={uploading}
//                 className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition shadow-md shadow-orange-200 disabled:opacity-60"
//             >
//                 {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
//                 {uploading ? "Envoi…" : "Choisir un fichier"}
//             </button>
//             <button
//                 onClick={() => { setUrlInput(value); setMode("url"); }}
//                 className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition"
//                 title="Saisir une URL"
//             >
//                 URL
//             </button>
//             </div>
//         )}

//         <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
//         </section>
//     );
// }

// // ─── Video Preview with iframe ────────────────────────────────────────────────

// function VideoPreview({ rawUrl, duration, onUrlChange, onDurationChange }: {rawUrl: string;duration: string;onUrlChange: (v: string) => void;onDurationChange: (v: string) => void;}) {
//     const [inputVal, setInputVal] = useState(rawUrl);
//     const embedUrl = toEmbedUrl(rawUrl);

//     const apply = () => onUrlChange(inputVal.trim());

//     return (
//         <section className="space-y-3">
//         <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Aperçu de la Vidéo</h2>

//         <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video shadow-xl shadow-slate-300/40">
//             {embedUrl ? (
//             <iframe
//                 key={embedUrl}
//                 src={embedUrl}
//                 title="Aperçu vidéo"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//                 className="w-full h-full border-0"
//             />
//             ) : (
//             <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
//                 <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm">
//                 <Play className="w-6 h-6 text-white fill-white ml-0.5" />
//                 </div>
//                 <p className="text-white/50 text-xs font-medium">Saisissez une URL YouTube / Vimeo</p>
//             </div>
//             )}
//             {duration && (
//             <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm font-mono">
//                 {duration}
//             </div>
//             )}
//         </div>

//         {/* URL field */}
//         <div className="space-y-1.5">
//             <FieldLabel>URL Source <span className="text-slate-400 normal-case font-normal">(YouTube / Vimeo)</span></FieldLabel>
//             <div className="flex gap-2">
//             <input
//                 type="url"
//                 value={inputVal}
//                 onChange={(e) => setInputVal(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && apply()}
//                 placeholder="https://www.youtube.com/watch?v=… ou embed"
//                 className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
//             />
//             <button
//                 onClick={apply}
//                 className="px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition shadow-sm"
//             >
//                 ▶ Lire
//             </button>
//             </div>
//         </div>

//         {/* Duration */}
//         <div className="space-y-1.5">
//             <FieldLabel>Durée</FieldLabel>
//             <div className="flex items-center gap-3">
//             <input
//                 value={duration}
//                 onChange={(e) => onDurationChange(e.target.value)}
//                 placeholder="12:35"
//                 className="w-28 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
//             />
//             <span className="text-xs text-slate-400 flex items-center gap-1.5">
//                 <Clock className="w-3.5 h-3.5" /> Format : MM:SS
//             </span>
//             </div>
//         </div>
//         </section>
//     );
// }

// // ─── Editor Content ───────────────────────────────────────────────────────────

// function VideoEditorContent({video, onClose, onSubmit }: { video: Article; onClose: () => void; onSubmit?: (article: Article) => void;}) {
//     const initialVideoUrl = extractVideoUrl(video.content) || video.sourceUrl || "";

//     const [categorie, setCategories] = useState<Category[]>([]);

//     useEffect(() => {
//     async function loadCategories() {
//         try {
//         const data = await fetchCategories();
//         console.log("CATEGORIES 👉", data);
//         setCategories(data?.data);
//         } catch (err) {
//         console.error("Erreur catégories ❌", err);
//         } finally {
//         //setLoadingCategories(false);
//         }
//     }
//     loadCategories();
//     }, []);


//     const [form, setForm] = useState<VideoForm>({
//         title:          video.title ?? "",
//         excerpt:    video.excerpt ?? "",
//         sourceUrl:      initialVideoUrl,
//         duration:       video.duration ?? "",
//         status:         STATUS_API_TO_UI[video.status] ?? "DRAFT",
//         videoType:      video.videoType ?? "Interview",
//         publishDate:    video.createdAt ? video.createdAt.slice(0, 16) : "",
//         selectedTagIds: (video.tags ?? []).map((t: Tag) => t.id),
//         metaTitle:      video.metaTitle ?? "",
//         metaDescription: video.metaDescription ?? "",
//         coverImage:     video.coverImage ?? "",
//         tags:            (video.tags ?? []).map((t: Tag) => t.id),
//         tagIs:           video.tags ?? [],
//         categoryId:      video.category?.id ?? undefined,
//     });

//     const [saving,      setSaving]      = useState(false);
//     const [publishing,  setPublishing]  = useState(false);
//     const [saveError,   setSaveError]   = useState<string | null>(null);
//     const [saveSuccess, setSaveSuccess] = useState(false);

//     const update = useCallback(<K extends keyof VideoForm>(key: K, value: VideoForm[K]) =>
//         setForm((prev) => ({ ...prev, [key]: value })), []);

//     const save = async (targetStatusUI?: string) => {
//         const isSaving = !targetStatusUI;
//         if (isSaving) setSaving(true); else setPublishing(true);
//         setSaveError(null);
//         setSaveSuccess(false);

//         try {
//         const apiStatus = STATUS_UI_TO_API[targetStatusUI ?? form.status] as
//             "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";

//         const payload: Parameters<typeof updateVideo>[1] = {
//             title:   form.title.trim() || undefined,
//             status:  apiStatus,
//             content: [
//             { type: "video", url: form.sourceUrl.trim(), value: form.sourceUrl.trim() },
//             { type: "text",  value: form.excerpt.trim() || "Contenu vide" },
//             ],
//             coverImage:      form.coverImage.trim() || undefined,
//             tags:            form.selectedTagIds,
//             sourceUrl:       form.sourceUrl.trim()       || undefined,
//             duration:        form.duration.trim()         || undefined,
//             videoType:       form.videoType               || undefined,
//             metaTitle:       form.metaTitle.trim()        || undefined,
//             metaDescription: form.metaDescription.trim()  || undefined,
//             excerpt:         form.excerpt.trim()          || undefined,
//             //selectedTagIds:    form.selectedTagIds,
//             categoryId:       form.categoryId,
//         };


//         console.log("Payload to save:", payload);

//         const res = await updateVideo(video.id, payload);
//         setSaveSuccess(true);
//         setTimeout(() => setSaveSuccess(false), 3000);
//         if (targetStatusUI) onSubmit?.(res.data);
//         } catch (err: unknown) {
//         setSaveError((err as Error).message || "Erreur lors de la sauvegarde.");
//         } finally {
//         setSaving(false);
//         setPublishing(false);
//         }
//     };
//     //const selectedCategory = video.category && video.category.id === form.categoryId ? video.category : null;
//     const metaTitleLen = form.metaTitle.length;
//     const metaDescLen  = form.metaDescription.length;

//     return (
//         <div className="flex flex-col h-full max-h-[90vh]">

//         {/* ── Sticky Header ── */}
//         <div className="flex items-start justify-between px-8 py-5 border-b border-slate-100 bg-white shrink-0 rounded-t-3xl">
//             <div>
//             <h1 className="text-lg font-bold text-slate-900 leading-tight">
//                 Édition :{" "}
//                 <span className="text-orange-500">{form.title || video.title}</span>
//             </h1>
//             <p className="text-xs text-slate-400 mt-0.5 font-medium">
//                 Vidéo #{video.id} · Créée le {new Date(video.createdAt).toLocaleDateString("fr-FR")}
//             </p>
//             </div>
//             <div className="flex items-center gap-2 ml-4 shrink-0">
//             {saveError && (
//                 <span className="flex items-center gap-1 text-xs text-red-500">
//                 <AlertCircle size={13} /> {saveError}
//                 </span>
//             )}
//             {saveSuccess && (
//                 <span className="flex items-center gap-1 text-xs text-green-600">
//                 <CheckCircle2 size={13} /> Sauvegardé !
//                 </span>
//             )}
//             <button
//                 onClick={() => save()}
//                 disabled={saving}
//                 className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:border-slate-300 hover:bg-slate-50 transition disabled:opacity-60"
//             >
//                 {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//                 {saving ? "Enregistrement…" : "Enregistrer"}
//             </button>
//             <button
//                 onClick={() => save("Publié")}
//                 disabled={publishing}
//                 className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 active:scale-95 transition disabled:opacity-60 shadow-lg shadow-orange-200"
//             >
//                 {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
//                 {publishing ? "Publication…" : "Publier"}
//             </button>
//             <button
//                 onClick={onClose}
//                 className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
//                 aria-label="Fermer"
//             >
//                 <X className="w-5 h-5" />
//             </button>
//             </div>
//         </div>

//         {/* ── Scrollable Body ── */}
//         <div className="flex-1 overflow-y-auto overscroll-contain">
//             <div className="grid grid-cols-1 lg:grid-cols-5">

//             {/* LEFT */}
//             <div className="lg:col-span-3 p-8 space-y-8 border-r border-slate-100">

//                 {/* 1. Video player */}
//                 <VideoPreview
//                 rawUrl={form.sourceUrl}
//                 duration={form.duration}
//                 onUrlChange={(v) => update("sourceUrl", v)}
//                 onDurationChange={(v) => update("duration", v)}
//                 />

//                 {/* 2. Title + description */}
//                 <section className="space-y-5">
//                 <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Détails et Métadonnées</h2>

//                 <div className="space-y-1.5">
//                     <FieldLabel>Titre de la Vidéo</FieldLabel>
//                     <input
//                     value={form.title}
//                     onChange={(e) => update("title", e.target.value)}
//                     className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
//                     />
//                 </div>

//                 <div className="space-y-1.5">
//                     <FieldLabel>Description <span className="text-slate-400 normal-case font-normal">(résumé SEO)</span></FieldLabel>
//                     <textarea
//                     value={form.excerpt}
//                     onChange={(e) => update("excerpt", e.target.value)}
//                     rows={6}
//                     className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none"
//                     />
//                 </div>
//                 </section>
//             </div>

//             {/* RIGHT */}
//             <div className="lg:col-span-2 p-8 space-y-7 bg-slate-50/60">

//                 {/* 3. Cover image */}
//                 <CoverImagePicker
//                 value={form.coverImage}
//                 onChange={(url) => update("coverImage", url)}
//                 />

//                 {/* 4. Status + type + meta */}
//                 <section className="space-y-4">
//                 <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Statut et Classification</h2>

//                 <SelectField
//                     label="Statut"
//                     value={form.status}
//                     options={Object.values(STATUS_API_TO_UI)}
//                     onChange={(v) => update("status", v)}
//                 />
//                 <SelectField
//                     label="Type de Vidéo"
//                     value={form.videoType}
//                     options={VIDEO_TYPES}
//                     onChange={(v) => update("videoType", v)}
//                 />

//                 <div className="space-y-1.5">
//                     <FieldLabel>Catégorie</FieldLabel>

//                     <div className="relative">
//                         <select
//                         value={form.categoryId ?? ""}
//                         onChange={(e) =>
//                             update("categoryId", Number(e.target.value))
//                         }
//                         className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition cursor-pointer"
//                         >
//                         <option value="">Aucune catégorie</option>

//                         {categorie.map((c) => (
//                             <option key={c.id} value={c.id}>
//                             {c.name}
//                             </option>
//                         ))}
//                         </select>

//                         {/* Icône */}
//                         <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                     </div>
//                 </div>

//                 <div className="space-y-1.5">
//                     <FieldLabel>Auteur</FieldLabel>
//                     <p className="text-sm text-slate-600 border border-slate-200 rounded-xl px-4 py-2.5 bg-white">
//                     {video.author.name}
//                     </p>
//                 </div>

//                 {/* Date de publication — préremplie depuis createdAt */}
//                 <div className="space-y-1.5">
//                     <FieldLabel>Date de publication</FieldLabel>
//                     <div className="relative">
//                     <input
//                         type="datetime-local"
//                         value={form.publishDate}
//                         onChange={(e) => update("publishDate", e.target.value)}
//                         className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
//                     />
//                     <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                     </div>
//                 </div>

//                 {/* 5. Tags — depuis l'API, multi-select */}
//                 <TagSelector
//                     selectedIds={form.selectedTagIds}
//                     onChange={(ids) => update("selectedTagIds", ids)}
//                 />
//                 </section>

//                 {/* 6. SEO */}
//                 <section className="space-y-4">
//                 <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Optimisation SEO</h2>

//                 <div className="space-y-1.5">
//                     <div className="flex justify-between items-center">
//                     <FieldLabel>Titre Méta</FieldLabel>
//                     <span className={`text-xs font-medium tabular-nums ${metaTitleLen > 60 ? "text-red-500" : "text-slate-400"}`}>
//                         {metaTitleLen}/60
//                     </span>
//                     </div>
//                     <input
//                     value={form.metaTitle}
//                     onChange={(e) => update("metaTitle", e.target.value)}
//                     className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
//                     />
//                     <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
//                     <div
//                         className={`h-full rounded-full transition-all ${metaTitleLen > 60 ? "bg-red-400" : "bg-orange-400"}`}
//                         style={{ width: `${Math.min((metaTitleLen / 60) * 100, 100)}%` }}
//                     />
//                     </div>
//                     <p className="text-xs text-slate-400">60 caractères recommandés</p>
//                 </div>

//                 <div className="space-y-1.5">
//                     <div className="flex justify-between items-center">
//                     <FieldLabel>Description Méta</FieldLabel>
//                     <span className={`text-xs font-medium tabular-nums ${metaDescLen > 160 ? "text-red-500" : "text-slate-400"}`}>
//                         {metaDescLen}/160
//                     </span>
//                     </div>
//                     <textarea
//                     value={form.metaDescription}
//                     onChange={(e) => update("metaDescription", e.target.value)}
//                     rows={4}
//                     className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none"
//                     />
//                     <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
//                     <div
//                         className={`h-full rounded-full transition-all ${metaDescLen > 160 ? "bg-red-400" : "bg-orange-400"}`}
//                         style={{ width: `${Math.min((metaDescLen / 160) * 100, 100)}%` }}
//                     />
//                     </div>
//                     <p className="text-xs text-slate-400">160 caractères recommandés</p>
//                 </div>
//                 </section>
//             </div>
//             </div>
//         </div>
//         </div>
//     );
// }

// // ─── Modal Wrapper ────────────────────────────────────────────────────────────

// export default function VideoEdit({ isOpen, video, onClose, onSubmit }: VideoEditProps) {
//     const overlayRef             = useRef<HTMLDivElement>(null);
//     const [visible, setVisible]  = useState(false);
//     const [mounted, setMounted]  = useState(false);

//     useEffect(() => {
//         if (isOpen) {
//         setMounted(true);
//         requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
//         } else {
//         setVisible(false);
//         const t = setTimeout(() => setMounted(false), 300);
//         return () => clearTimeout(t);
//         }
//     }, [isOpen]);

//     useEffect(() => {
//         document.body.style.overflow = isOpen ? "hidden" : "";
//         return () => { document.body.style.overflow = ""; };
//     }, [isOpen]);

//     useEffect(() => {
//         const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
//         if (isOpen) window.addEventListener("keydown", handler);
//         return () => window.removeEventListener("keydown", handler);
//     }, [isOpen, onClose]);

//     if (!mounted || !video) return null;

//     return (
//         <div
//         ref={overlayRef}
//         onClick={(e) => e.target === overlayRef.current && onClose()}
//         className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
//         style={{
//             backgroundColor: visible ? "rgba(15, 23, 42, 0.6)" : "rgba(15, 23, 42, 0)",
//             backdropFilter:  visible ? "blur(6px)" : "blur(0px)",
//             transition:      "background-color 300ms ease, backdrop-filter 300ms ease",
//         }}
//         role="dialog"
//         aria-modal="true"
//         >
//         <div
//             className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
//             style={{
//             opacity:       visible ? 1 : 0,
//             transform:     visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
//             transition:    "opacity 300ms ease, transform 300ms ease",
//             maxHeight:     "90vh",
//             display:       "flex",
//             flexDirection: "column",
//             }}
//         >
//             <VideoEditorContent video={video} onClose={onClose} onSubmit={onSubmit} />
//         </div>
//         </div>
//     );
// }