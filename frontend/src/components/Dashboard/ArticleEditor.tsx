// src/components/Dashboard/ArticleEditor.tsx
"use client";

import { useState, useEffect } from "react";
import {
    Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered,
    Link, Image, Code, Eye, Save, Send, Clock, X, ChevronDown, ChevronUp,
    Search, Upload, Plus, Loader2, AlertCircle, CheckCircle2,
} from "lucide-react";

import { updateArticle, fetchCategories, Category, Article, ContentBlock, STATUS_API_TO_UI, STATUS_UI_TO_API, fetchTags } from "@/services/Dashboard/articleservice";
import { fetchDestinationsForSelect, DestinationOption } from "@/services/Dashboard/destinationservice";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Tag {
    id: string;
    name: string;
}

interface ArticleEditorProps {
    isOpen: boolean;
    article: Article | null;
    onClose?: () => void;
    onSubmit: (data: Article) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const ToolbarBtn = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
    <button
        type="button"
        title={title}
        className="p-1.5 rounded transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-700"
    >
        <Icon size={16} strokeWidth={2} />
    </button>
);

const TagPill = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium">
        {label}
        <button type="button" onClick={onRemove} className="hover:text-orange-900 transition-colors">
        <X size={11} strokeWidth={2.5} />
        </button>
    </span>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{children}</p>
);

const SectionCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 ${className}`}>{children}</div>
);

// ── Main Component ─────────────────────────────────────────────────────────────

export default function ArticleEditor({ isOpen, article, onClose, onSubmit }: ArticleEditorProps) {

    if (!isOpen || !article) return null;

    // ── Local state hydrated from article prop ──
    const [title, setTitle] = useState(article?.title ?? "");
    const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
    const [content, setContent] = useState<ContentBlock[]>(article?.content ?? []);
    const [bodyText, setBodyText] = useState(() =>
        (article?.content ?? [])
        .filter((b) => b.type === "text" || b.type === "heading")
        .map((b) => (b.type === "heading" ? `## ${(b as { value: string }).value}` : (b as { value: string }).value))
        .join("\n\n")
    );
    const [status, setStatus] = useState(STATUS_API_TO_UI[article.status] ?? "Brouillon");
    const [featured, setFeatured] = useState(article?.featured);
    const [categoryId, setCategoryId] = useState(String(article?.categoryId));
    const [metaTitle, setMetaTitle] = useState(article?.metaTitle ?? article?.title ?? "");
    const [metaDescription, setMetaDescription] = useState(article?.metaDescription ?? article?.excerpt ?? "");
    const [coverImage, setCoverImage] = useState(article?.coverImage ?? "");
    const [tags, setTags] = useState<Tag[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [seoOpen, setSeoOpen] = useState(false);

    // ── Destination associée — optionnelle ──
    const [destinationId, setDestinationId] = useState(
        article?.destinationId ? String(article.destinationId) : ""
    );
    const [destinations, setDestinations] = useState<DestinationOption[]>([]);
    const [loadingDestinations, setLoadingDestinations] = useState(false);

    useEffect(() => {
        setLoadingDestinations(true);
        fetchDestinationsForSelect()
            .then(setDestinations)
            .catch(() => setDestinations([]))
            .finally(() => setLoadingDestinations(false));
    }, []);

    // ── Categories from API ──
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetchCategories()
        .then((res) => setCategories(res.data))
        .catch(() => {/* silent - we still have the current category */});
    }, []);

    // ── API state ──
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // ── Helpers ──
    const slug = title
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

    const addTag = () => {
        const trimmed = tagInput.trim().toLowerCase();
        if (trimmed && !tags.find((t) => t.name === trimmed)) {
        setTags((prev) => [...prev, { id: Date.now().toString(), name: trimmed }]);
        }
        setTagInput("");
    };

    const buildContentPayload = (): ContentBlock[] => {
        const lines = (bodyText ?? "").split(/\n{2,}/);

        const parsed: ContentBlock[] = lines
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line): ContentBlock => {
                if (line.startsWith("## ")) {
                    return { type: "heading", value: line.slice(3) };
                }
                return { type: "text", value: line };
            });

        const mediaBlocks = (content ?? []).filter(
            (b) => b.type !== "text" && b.type !== "heading"
        );

        const finalContent = [...parsed, ...mediaBlocks];

        if (finalContent.length === 0) {
            return [{ type: "text", value: "Contenu vide" }];
        }

        return finalContent;
    };

    // ── Save / Publish ──
    const save = async (targetStatus?: string) => {
        const isSaving = !targetStatus;
        if (isSaving) setSaving(true);
        else setPublishing(true);

        setSaveError(null);
        setSaveSuccess(false);

        try {
            const apiStatus = STATUS_UI_TO_API[targetStatus ?? status ?? "DRAFT"];

            const payload: any = {
                title: (title ?? "").trim(),
                content: buildContentPayload(),
                categoryId: Number(categoryId),
                status: apiStatus,
                featured,
                // ✅ Association optionnelle à une destination existante.
                // "" → null (dissocie explicitement), sinon l'id choisi.
                destinationId: destinationId ? Number(destinationId) : null,
            };

            if ((excerpt ?? "").trim()) {
                payload.excerpt = excerpt.trim();
            }

            if ((coverImage ?? "").trim()) {
                payload.coverImage = coverImage.trim();
            }

            if ((metaTitle ?? "").trim()) {
                payload.metaTitle = metaTitle.trim();
            }

            if ((metaDescription ?? "").trim()) {
                payload.metaDescription = metaDescription.trim();
            }

            console.log("Payload FINAL:", JSON.stringify(payload, null, 2));

            const res = await updateArticle(article.id, payload);

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);

            if (targetStatus) onSubmit(res.data);

        } catch (err: any) {
            console.error("Erreur API:", err?.response?.data || err);
            setSaveError(err.message || "Erreur lors de la sauvegarde");
        } finally {
            setSaving(false);
            setPublishing(false);
        }
    };

    const categoryOptions = categories.length > 0
        ? categories.map((c) => ({ value: String(c.id), label: c.name }))
        : [{ value: String(article.categoryId), label: article.category.name }];

    const statusOptions = Object.entries(STATUS_API_TO_UI).map(([, ui]) => ({ value: ui, label: ui }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="w-full max-w-5xl max-h-[95vh] bg-slate-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
            <h1 className="text-base font-semibold text-slate-800 truncate pr-4">
                Édition :{" "}
                <span className="text-slate-500 font-normal">{article.title}</span>
            </h1>
            <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0"
            >
                <X size={18} />
            </button>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 px-6 py-3 bg-white border-b border-slate-100 shrink-0">
            <button
                type="button"
                disabled={publishing}
                onClick={() => save("Publié")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold shadow-sm transition-colors"
            >
                {publishing ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                Publier l&apos;Article
            </button>
            <button
                type="button"
                disabled={saving}
                onClick={() => save()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-700 text-sm font-medium transition-colors"
            >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Enregistrer
            </button>
            <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium transition-colors"
            >
                <Eye size={15} />
                Prévisualiser
            </button>

            <div className="ml-auto flex items-center gap-2 text-xs">
                {saveError && (
                <span className="flex items-center gap-1 text-red-500">
                    <AlertCircle size={13} /> {saveError}
                </span>
                )}
                {saveSuccess && (
                <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 size={13} /> Sauvegardé !
                </span>
                )}
                {!saveError && !saveSuccess && (
                <span className="flex items-center gap-1.5 text-slate-400">
                    <Clock size={13} />
                    Article #{article.id} · {new Date(article.updatedAt).toLocaleDateString("fr-FR")}
                </span>
                )}
            </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 p-5">

                {/* LEFT */}
                <div className="flex flex-col gap-4">

                {/* Title */}
                <SectionCard>
                    <FieldLabel>Titre Principal</FieldLabel>
                    <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-lg font-semibold text-slate-800 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
                    placeholder="Titre de l'article..."
                    />
                    <p className="mt-1.5 text-xs text-slate-400">
                    Slug :{" "}
                    <span className="text-orange-500 font-mono">{slug}</span>
                    </p>
                </SectionCard>

                {/* Excerpt */}
                <SectionCard>
                    <div className="flex items-center justify-between mb-1.5">
                    <FieldLabel>Extrait / Accroche</FieldLabel>
                    <span className="text-xs text-slate-400">Max 300 caractères</span>
                    </div>
                    <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    maxLength={300}
                    rows={3}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
                    />
                    <div className="flex justify-end mt-1">
                    <span className={`text-xs ${excerpt.length > 270 ? "text-orange-500" : "text-slate-400"}`}>
                        {excerpt.length} / 300
                    </span>
                    </div>
                </SectionCard>

                {/* Body */}
                <SectionCard>
                    <FieldLabel>Corps de l&apos;Article</FieldLabel>
                    <div className="flex flex-wrap items-center gap-0.5 border border-slate-200 rounded-t-lg px-2 py-1.5 bg-slate-50">
                    <ToolbarBtn icon={Bold} title="Gras" />
                    <ToolbarBtn icon={Italic} title="Italique" />
                    <ToolbarBtn icon={Underline} title="Souligné" />
                    <div className="w-px h-5 bg-slate-200 mx-1" />
                    <ToolbarBtn icon={Heading2} title="H2 (##)" />
                    <ToolbarBtn icon={Heading3} title="H3" />
                    <div className="w-px h-5 bg-slate-200 mx-1" />
                    <ToolbarBtn icon={List} title="Liste" />
                    <ToolbarBtn icon={ListOrdered} title="Liste ordonnée" />
                    <div className="w-px h-5 bg-slate-200 mx-1" />
                    <ToolbarBtn icon={Link} title="Lien" />
                    <ToolbarBtn icon={Image} title="Image" />
                    <ToolbarBtn icon={Code} title="Code" />
                    </div>
                    <textarea
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    rows={12}
                    className="w-full border border-slate-200 border-t-0 rounded-b-lg px-3 py-3 text-sm text-slate-700 resize-y focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow font-mono leading-relaxed"
                    placeholder="Rédigez le contenu. Utilisez ## pour les titres de section, séparés par une ligne vide..."
                    />
                    <p className="mt-1.5 text-xs text-slate-400">
                    Utilisez <code className="bg-slate-100 px-1 rounded">## Titre</code> pour les sous-titres. Séparez les paragraphes par une ligne vide.
                    </p>
                </SectionCard>

                {/* Cover Image URL */}
                <SectionCard>
                    <FieldLabel>URL Image de Couverture</FieldLabel>
                    <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
                    />
                    {coverImage && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                        <img src={coverImage} alt="Aperçu couverture" className="w-full h-full object-cover" />
                    </div>
                    )}
                    <button
                    type="button"
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-sm"
                    >
                    <Upload size={15} />
                    Depuis la médiathèque
                    </button>
                </SectionCard>

                {/* SEO */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <button
                    type="button"
                    onClick={() => setSeoOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                    >
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Search size={16} className="text-orange-500" />
                        Optimisation SEO
                    </span>
                    {seoOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </button>
                    {seoOpen && (
                    <div className="px-5 pb-5 border-t border-slate-100 pt-4 grid gap-4">
                        <div>
                        <FieldLabel>Titre SEO</FieldLabel>
                        <input
                            type="text"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
                        />
                        </div>
                        <div>
                        <FieldLabel>Méta Description</FieldLabel>
                        <textarea
                            rows={2}
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
                        />
                        </div>
                    </div>
                    )}
                </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col gap-4">

                {/* Status */}
                <SectionCard>
                    <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <h2 className="text-sm font-semibold text-slate-700">Statut &amp; Visibilité</h2>
                    </div>
                    <div className="grid gap-3">
                    <div>
                        <FieldLabel>Statut</FieldLabel>
                        <div className="relative">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent cursor-pointer pr-9"
                        >
                            {statusOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <FieldLabel>Auteur</FieldLabel>
                        <p className="text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50">
                        {article.author.name}
                        </p>
                    </div>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
                        />
                        <span className="text-sm text-slate-700">Article mis en avant</span>
                    </label>
                    </div>
                </SectionCard>

                {/* Category */}
                <SectionCard>
                    <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                    <h2 className="text-sm font-semibold text-slate-700">Catégorie</h2>
                    </div>
                    <div className="relative">
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent cursor-pointer pr-9"
                    >
                        {categoryOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                    <ChevronDown size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    {categories.find((c) => String(c.id) === categoryId) && (
                    <div className="mt-2 flex items-center gap-2">
                        <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: categories.find((c) => String(c.id) === categoryId)?.color }}
                        />
                        <span className="text-xs text-slate-400">
                        {categories.find((c) => String(c.id) === categoryId)?.type}
                        </span>
                    </div>
                    )}
                </SectionCard>

                {/* Destination Associée — optionnelle */}
                <SectionCard>
                    <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <h2 className="text-sm font-semibold text-slate-700">Destination Associée</h2>
                    </div>
                    {loadingDestinations ? (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-400">
                        <Loader2 size={15} className="animate-spin" /> Chargement…
                    </div>
                    ) : (
                    <div className="relative">
                        <select
                        value={destinationId}
                        onChange={(e) => setDestinationId(e.target.value)}
                        className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent cursor-pointer pr-9"
                        >
                        <option value="">Aucune destination</option>
                        {destinations.map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                        </select>
                        <ChevronDown size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    )}
                    <p className="mt-2 text-xs text-slate-400">
                    Optionnel — relie cet article à une fiche destination existante.
                    </p>
                </SectionCard>

                {/* Tags */}
                <SectionCard>
                    <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-sky-400" />
                    <h2 className="text-sm font-semibold text-slate-700">Tags</h2>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                    {tags.map((tag) => (
                        <TagPill key={tag.id} label={tag.name} onRemove={() => setTags((p) => p.filter((t) => t.id !== tag.id))} />
                    ))}
                    {tags.length === 0 && <span className="text-xs text-slate-400">Aucun tag</span>}
                    </div>
                    <div className="flex gap-1.5">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTag()}
                        placeholder="Ajouter un tag..."
                        className="flex-1 min-w-0 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
                    />
                    <button
                        type="button"
                        onClick={addTag}
                        className="px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                    >
                        <Plus size={14} />
                    </button>
                    </div>
                </SectionCard>

                {/* Article metadata */}
                <SectionCard>
                    <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <h2 className="text-sm font-semibold text-slate-700">Métadonnées</h2>
                    </div>
                    <dl className="grid gap-2 text-xs">
                    {[
                        ["ID", `#${article.id}`],
                        ["Slug", article.slug],
                        ["Vues", String(article.views)],
                        ["Créé le", new Date(article.createdAt).toLocaleDateString("fr-FR")],
                        ["Modifié le", new Date(article.updatedAt).toLocaleDateString("fr-FR")],
                    ].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-2">
                        <dt className="text-slate-400">{k}</dt>
                        <dd className="text-slate-600 font-mono truncate max-w-40" title={v}>{v}</dd>
                        </div>
                    ))}
                    </dl>
                </SectionCard>

                </div>
            </div>
            </div>
        </div>
        </div>
    );
}












// // src/components/Dashboard/ArticleEditor.tsx
// "use client";

// import { useState, useEffect } from "react";
// import {
//     Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered,
//     Link, Image, Code, Eye, Save, Send, Clock, X, ChevronDown, ChevronUp,
//     Search, Upload, Plus, Loader2, AlertCircle, CheckCircle2,
// } from "lucide-react";

// import { updateArticle, fetchCategories, Category, Article, ContentBlock, STATUS_API_TO_UI, STATUS_UI_TO_API, fetchTags } from "@/services/Dashboard/articleservice";

// // ── Types ──────────────────────────────────────────────────────────────────────

// interface Tag {
//     id: string;
//     name: string;
// }

// interface ArticleEditorProps {
//     isOpen: boolean;
//     article: Article | null;
//     onClose?: () => void;
//     onSubmit: (data: Article) => void;
// }

// // ── Helpers ────────────────────────────────────────────────────────────────────

// const ToolbarBtn = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
//     <button
//         type="button"
//         title={title}
//         className="p-1.5 rounded transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-700"
//     >
//         <Icon size={16} strokeWidth={2} />
//     </button>
// );

// const TagPill = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
//     <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium">
//         {label}
//         <button type="button" onClick={onRemove} className="hover:text-orange-900 transition-colors">
//         <X size={11} strokeWidth={2.5} />
//         </button>
//     </span>
// );

// const FieldLabel = ({ children }: { children: React.ReactNode }) => (
//     <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{children}</p>
// );

// const SectionCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
//     <div className={`bg-white rounded-xl border border-slate-200 p-5 ${className}`}>{children}</div>
// );

// // ── Main Component ─────────────────────────────────────────────────────────────

// export default function ArticleEditor({ isOpen, article, onClose, onSubmit }: ArticleEditorProps) {

//     if (!isOpen || !article) return null;

//     // ── Local state hydrated from article prop ──
//     const [title, setTitle] = useState(article?.title ?? "");
//     const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
//     const [content, setContent] = useState<ContentBlock[]>(article?.content ?? []);
//     // Body text: stringify text+heading blocks for the textarea editor
//     const [bodyText, setBodyText] = useState(() =>
//         (article?.content ?? [])
//         .filter((b) => b.type === "text" || b.type === "heading")
//         .map((b) => (b.type === "heading" ? `## ${(b as { value: string }).value}` : (b as { value: string }).value))
//         .join("\n\n")
//     );
//     const [status, setStatus] = useState(STATUS_API_TO_UI[article.status] ?? "Brouillon");
//     const [featured, setFeatured] = useState(article?.featured);
//     const [categoryId, setCategoryId] = useState(String(article?.categoryId));
//     const [metaTitle, setMetaTitle] = useState(article?.metaTitle ?? article?.title ?? "");
//     const [metaDescription, setMetaDescription] = useState(article?.metaDescription ?? article?.excerpt ?? "");
//     const [coverImage, setCoverImage] = useState(article?.coverImage ?? "");
//     const [tags, setTags] = useState<Tag[]>([]);
//     const [tagInput, setTagInput] = useState("");
//     const [seoOpen, setSeoOpen] = useState(false);

//     // ── Categories from API ──
//     const [categories, setCategories] = useState<Category[]>([]);

//     useEffect(() => {
//         fetchCategories()
//         .then((res) => setCategories(res.data))
//         .catch(() => {/* silent - we still have the current category */});
//     }, []);

//     // useEffect(() => {
//     //     fetchTags()
//     //     .then((res) => setTags(res.data))
//     //     .catch(() => {/* silent - we still have the current category */});
//     // }, []);


//     // ── API state ──
//     const [saving, setSaving] = useState(false);
//     const [publishing, setPublishing] = useState(false);
//     const [saveError, setSaveError] = useState<string | null>(null);
//     const [saveSuccess, setSaveSuccess] = useState(false);


//     // ── Helpers ──
//     const slug = title
//         .toLowerCase()
//         .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
//         .replace(/[^a-z0-9\s-]/g, "")
//         .replace(/\s+/g, "-");

//     const addTag = () => {
//         const trimmed = tagInput.trim().toLowerCase();
//         if (trimmed && !tags.find((t) => t.name === trimmed)) {
//         setTags((prev) => [...prev, { id: Date.now().toString(), name: trimmed }]);
//         }
//         setTagInput("");
//     };

//     // ── Build content payload from bodyText (simple line parser) ──
//     // const buildContentPayload = (): ContentBlock[] => {
//     //     const lines = bodyText.split(/\n{2,}/);
//     //     const parsed: ContentBlock[] = lines
//     //     .map((line) => line.trim())
//     //     .filter(Boolean)
//     //     .map((line): ContentBlock => {
//     //         if (line.startsWith("## ")) return { type: "heading", value: line.slice(3) };
//     //         return { type: "text", value: line };
//     //     });

//     //     // Preserve non-text blocks (images, videos, quotes) from the original content
//     //     const mediaBlocks = content.filter(
//     //     (b) => b.type !== "text" && b.type !== "heading"
//     //     );
//     //     return [...parsed, ...mediaBlocks];
//     // };

//     const buildContentPayload = (): ContentBlock[] => {
//         const lines = (bodyText ?? "").split(/\n{2,}/);

//         const parsed: ContentBlock[] = lines
//             .map((line) => line.trim())
//             .filter(Boolean)
//             .map((line): ContentBlock => {
//                 if (line.startsWith("## ")) {
//                     return { type: "heading", value: line.slice(3) };
//                 }
//                 return { type: "text", value: line };
//             });

//         const mediaBlocks = (content ?? []).filter(
//             (b) => b.type !== "text" && b.type !== "heading"
//         );

//         const finalContent = [...parsed, ...mediaBlocks];

//         // 🚨 CRITIQUE : empêcher content vide
//         if (finalContent.length === 0) {
//             return [{ type: "text", value: "Contenu vide" }];
//         }

//         return finalContent;
//     };

//     // ── Save / Publish ──
//     // const save = async (targetStatus?: string) => {
//     //     const isSaving = !targetStatus;
//     //     if (isSaving) setSaving(true);
//     //     else setPublishing(true);
//     //     setSaveError(null);
//     //     setSaveSuccess(false);

//     //     try {
//     //     const apiStatus = STATUS_UI_TO_API[targetStatus ?? status ?? "Brouillon"];
//     //     const payload = {
//     //         title: (title ?? "").trim(),
//     //         excerpt: (excerpt ?? "").trim(),
//     //         content: buildContentPayload(),
//     //         coverImage: (coverImage ?? "").trim() || "",
//     //         categoryId: Number(categoryId),
//     //         status: apiStatus,
//     //         featured,
//     //         metaTitle: (metaTitle ?? "").trim() || undefined,
//     //         metaDescription: (metaDescription ?? "").trim() || undefined,
//     //     };

//     //     console.log("Payload envoyé:", payload);

//     //     const res = await updateArticle(article.id, payload);
//     //     setSaveSuccess(true);
//     //     setTimeout(() => setSaveSuccess(false), 3000);
//     //     if (targetStatus) onSubmit(res.data);
//     //     } catch (err: any) {
//     //     setSaveError(err.message || "Erreur lors de la sauvegarde");
//     //     } finally {
//     //     setSaving(false);
//     //     setPublishing(false);
//     //     }
//     // };


//     const save = async (targetStatus?: string) => {
//         const isSaving = !targetStatus;
//         if (isSaving) setSaving(true);
//         else setPublishing(true);

//         setSaveError(null);
//         setSaveSuccess(false);

//         try {
//             const apiStatus = STATUS_UI_TO_API[targetStatus ?? status ?? "DRAFT"];

//             const payload: any = {
//                 title: (title ?? "").trim(),
//                 content: buildContentPayload(),
//                 categoryId: Number(categoryId),
//                 status: apiStatus,
//                 featured,
//             };

//             // ✅ Ajouter seulement si non vide
//             if ((excerpt ?? "").trim()) {
//                 payload.excerpt = excerpt.trim();
//             }

//             if ((coverImage ?? "").trim()) {
//                 payload.coverImage = coverImage.trim();
//             }

//             if ((metaTitle ?? "").trim()) {
//                 payload.metaTitle = metaTitle.trim();
//             }

//             if ((metaDescription ?? "").trim()) {
//                 payload.metaDescription = metaDescription.trim();
//             }

//             // 🔍 DEBUG SAFE
//             console.log("Payload FINAL:", JSON.stringify(payload, null, 2));

//             const res = await updateArticle(article.id, payload);

//             setSaveSuccess(true);
//             setTimeout(() => setSaveSuccess(false), 3000);

//             if (targetStatus) onSubmit(res.data);

//         } catch (err: any) {
//             console.error("Erreur API:", err?.response?.data || err);
//             setSaveError(err.message || "Erreur lors de la sauvegarde");
//         } finally {
//             setSaving(false);
//             setPublishing(false);
//         }
//     };

//     const categoryOptions = categories.length > 0
//         ? categories.map((c) => ({ value: String(c.id), label: c.name }))
//         : [{ value: String(article.categoryId), label: article.category.name }];

//     const statusOptions = Object.entries(STATUS_API_TO_UI).map(([, ui]) => ({ value: ui, label: ui }));

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
//         <div className="w-full max-w-5xl max-h-[95vh] bg-slate-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

//             {/* Header */}
//             <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
//             <h1 className="text-base font-semibold text-slate-800 truncate pr-4">
//                 Édition :{" "}
//                 <span className="text-slate-500 font-normal">{article.title}</span>
//             </h1>
//             <button
//                 type="button"
//                 onClick={onClose}
//                 className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0"
//             >
//                 <X size={18} />
//             </button>
//             </div>

//             {/* Action Bar */}
//             <div className="flex flex-wrap items-center gap-3 px-6 py-3 bg-white border-b border-slate-100 shrink-0">
//             <button
//                 type="button"
//                 disabled={publishing}
//                 onClick={() => save("Publié")}
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold shadow-sm transition-colors"
//             >
//                 {publishing ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
//                 Publier l&apos;Article
//             </button>
//             <button
//                 type="button"
//                 disabled={saving}
//                 onClick={() => save()}
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-700 text-sm font-medium transition-colors"
//             >
//                 {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
//                 Enregistrer
//             </button>
//             <button
//                 type="button"
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium transition-colors"
//             >
//                 <Eye size={15} />
//                 Prévisualiser
//             </button>

//             <div className="ml-auto flex items-center gap-2 text-xs">
//                 {saveError && (
//                 <span className="flex items-center gap-1 text-red-500">
//                     <AlertCircle size={13} /> {saveError}
//                 </span>
//                 )}
//                 {saveSuccess && (
//                 <span className="flex items-center gap-1 text-green-600">
//                     <CheckCircle2 size={13} /> Sauvegardé !
//                 </span>
//                 )}
//                 {!saveError && !saveSuccess && (
//                 <span className="flex items-center gap-1.5 text-slate-400">
//                     <Clock size={13} />
//                     Article #{article.id} · {new Date(article.updatedAt).toLocaleDateString("fr-FR")}
//                 </span>
//                 )}
//             </div>
//             </div>

//             {/* Body */}
//             <div className="flex-1 overflow-y-auto">
//             <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 p-5">

//                 {/* LEFT */}
//                 <div className="flex flex-col gap-4">

//                 {/* Title */}
//                 <SectionCard>
//                     <FieldLabel>Titre Principal</FieldLabel>
//                     <input
//                     type="text"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     className="w-full text-lg font-semibold text-slate-800 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
//                     placeholder="Titre de l'article..."
//                     />
//                     <p className="mt-1.5 text-xs text-slate-400">
//                     Slug :{" "}
//                     <span className="text-orange-500 font-mono">{slug}</span>
//                     </p>
//                 </SectionCard>

//                 {/* Excerpt */}
//                 <SectionCard>
//                     <div className="flex items-center justify-between mb-1.5">
//                     <FieldLabel>Extrait / Accroche</FieldLabel>
//                     <span className="text-xs text-slate-400">Max 300 caractères</span>
//                     </div>
//                     <textarea
//                     value={excerpt}
//                     onChange={(e) => setExcerpt(e.target.value)}
//                     maxLength={300}
//                     rows={3}
//                     className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
//                     />
//                     <div className="flex justify-end mt-1">
//                     <span className={`text-xs ${excerpt.length > 270 ? "text-orange-500" : "text-slate-400"}`}>
//                         {excerpt.length} / 300
//                     </span>
//                     </div>
//                 </SectionCard>

//                 {/* Body */}
//                 <SectionCard>
//                     <FieldLabel>Corps de l&apos;Article</FieldLabel>
//                     <div className="flex flex-wrap items-center gap-0.5 border border-slate-200 rounded-t-lg px-2 py-1.5 bg-slate-50">
//                     <ToolbarBtn icon={Bold} title="Gras" />
//                     <ToolbarBtn icon={Italic} title="Italique" />
//                     <ToolbarBtn icon={Underline} title="Souligné" />
//                     <div className="w-px h-5 bg-slate-200 mx-1" />
//                     <ToolbarBtn icon={Heading2} title="H2 (##)" />
//                     <ToolbarBtn icon={Heading3} title="H3" />
//                     <div className="w-px h-5 bg-slate-200 mx-1" />
//                     <ToolbarBtn icon={List} title="Liste" />
//                     <ToolbarBtn icon={ListOrdered} title="Liste ordonnée" />
//                     <div className="w-px h-5 bg-slate-200 mx-1" />
//                     <ToolbarBtn icon={Link} title="Lien" />
//                     <ToolbarBtn icon={Image} title="Image" />
//                     <ToolbarBtn icon={Code} title="Code" />
//                     </div>
//                     <textarea
//                     value={bodyText}
//                     onChange={(e) => setBodyText(e.target.value)}
//                     rows={12}
//                     className="w-full border border-slate-200 border-t-0 rounded-b-lg px-3 py-3 text-sm text-slate-700 resize-y focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow font-mono leading-relaxed"
//                     placeholder="Rédigez le contenu. Utilisez ## pour les titres de section, séparés par une ligne vide..."
//                     />
//                     <p className="mt-1.5 text-xs text-slate-400">
//                     Utilisez <code className="bg-slate-100 px-1 rounded">## Titre</code> pour les sous-titres. Séparez les paragraphes par une ligne vide.
//                     </p>
//                 </SectionCard>

//                 {/* Cover Image URL */}
//                 <SectionCard>
//                     <FieldLabel>URL Image de Couverture</FieldLabel>
//                     <input
//                     type="url"
//                     value={coverImage}
//                     onChange={(e) => setCoverImage(e.target.value)}
//                     placeholder="https://res.cloudinary.com/..."
//                     className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
//                     />
//                     {coverImage && (
//                     <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-100">
//                         <img src={coverImage} alt="Aperçu couverture" className="w-full h-full object-cover" />
//                     </div>
//                     )}
//                     <button
//                     type="button"
//                     className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-sm"
//                     >
//                     <Upload size={15} />
//                     Depuis la médiathèque
//                     </button>
//                 </SectionCard>

//                 {/* SEO */}
//                 <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
//                     <button
//                     type="button"
//                     onClick={() => setSeoOpen((v) => !v)}
//                     className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
//                     >
//                     <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
//                         <Search size={16} className="text-orange-500" />
//                         Optimisation SEO
//                     </span>
//                     {seoOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
//                     </button>
//                     {seoOpen && (
//                     <div className="px-5 pb-5 border-t border-slate-100 pt-4 grid gap-4">
//                         <div>
//                         <FieldLabel>Titre SEO</FieldLabel>
//                         <input
//                             type="text"
//                             value={metaTitle}
//                             onChange={(e) => setMetaTitle(e.target.value)}
//                             className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
//                         />
//                         </div>
//                         <div>
//                         <FieldLabel>Méta Description</FieldLabel>
//                         <textarea
//                             rows={2}
//                             value={metaDescription}
//                             onChange={(e) => setMetaDescription(e.target.value)}
//                             className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
//                         />
//                         </div>
//                     </div>
//                     )}
//                 </div>
//                 </div>

//                 {/* RIGHT */}
//                 <div className="flex flex-col gap-4">

//                 {/* Status */}
//                 <SectionCard>
//                     <div className="flex items-center gap-2 mb-4">
//                     <div className="w-2 h-2 rounded-full bg-orange-400" />
//                     <h2 className="text-sm font-semibold text-slate-700">Statut &amp; Visibilité</h2>
//                     </div>
//                     <div className="grid gap-3">
//                     <div>
//                         <FieldLabel>Statut</FieldLabel>
//                         <div className="relative">
//                         <select
//                             value={status}
//                             onChange={(e) => setStatus(e.target.value)}
//                             className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent cursor-pointer pr-9"
//                         >
//                             {statusOptions.map((o) => (
//                             <option key={o.value} value={o.value}>{o.label}</option>
//                             ))}
//                         </select>
//                         <ChevronDown size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                         </div>
//                     </div>
//                     <div>
//                         <FieldLabel>Auteur</FieldLabel>
//                         <p className="text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50">
//                         {article.author.name}
//                         </p>
//                     </div>
//                     <label className="flex items-center gap-2.5 cursor-pointer">
//                         <input
//                         type="checkbox"
//                         checked={featured}
//                         onChange={(e) => setFeatured(e.target.checked)}
//                         className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
//                         />
//                         <span className="text-sm text-slate-700">Article mis en avant</span>
//                     </label>
//                     </div>
//                 </SectionCard>

//                 {/* Category */}
//                 <SectionCard>
//                     <div className="flex items-center gap-2 mb-4">
//                     <div className="w-2 h-2 rounded-full bg-violet-400" />
//                     <h2 className="text-sm font-semibold text-slate-700">Catégorie</h2>
//                     </div>
//                     <div className="relative">
//                     <select
//                         value={categoryId}
//                         onChange={(e) => setCategoryId(e.target.value)}
//                         className="w-full appearance-none border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent cursor-pointer pr-9"
//                     >
//                         {categoryOptions.map((o) => (
//                         <option key={o.value} value={o.value}>{o.label}</option>
//                         ))}
//                     </select>
//                     <ChevronDown size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     </div>
//                     {/* Color preview */}
//                     {categories.find((c) => String(c.id) === categoryId) && (
//                     <div className="mt-2 flex items-center gap-2">
//                         <div
//                         className="w-3 h-3 rounded-full"
//                         style={{ backgroundColor: categories.find((c) => String(c.id) === categoryId)?.color }}
//                         />
//                         <span className="text-xs text-slate-400">
//                         {categories.find((c) => String(c.id) === categoryId)?.type}
//                         </span>
//                     </div>
//                     )}
//                 </SectionCard>

//                 {/* Tags */}
//                 <SectionCard>
//                     <div className="flex items-center gap-2 mb-4">
//                     <div className="w-2 h-2 rounded-full bg-sky-400" />
//                     <h2 className="text-sm font-semibold text-slate-700">Tags</h2>
//                     </div>
//                     <div className="flex flex-wrap gap-1.5 mb-2">
//                     {tags.map((tag) => (
//                         <TagPill key={tag.id} label={tag.name} onRemove={() => setTags((p) => p.filter((t) => t.id !== tag.id))} />
//                     ))}
//                     {tags.length === 0 && <span className="text-xs text-slate-400">Aucun tag</span>}
//                     </div>
//                     <div className="flex gap-1.5">
//                     <input
//                         type="text"
//                         value={tagInput}
//                         onChange={(e) => setTagInput(e.target.value)}
//                         onKeyDown={(e) => e.key === "Enter" && addTag()}
//                         placeholder="Ajouter un tag..."
//                         className="flex-1 min-w-0 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
//                     />
//                     <button
//                         type="button"
//                         onClick={addTag}
//                         className="px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
//                     >
//                         <Plus size={14} />
//                     </button>
//                     </div>
//                 </SectionCard>

//                 {/* Article metadata */}
//                 <SectionCard>
//                     <div className="flex items-center gap-2 mb-3">
//                     <div className="w-2 h-2 rounded-full bg-slate-300" />
//                     <h2 className="text-sm font-semibold text-slate-700">Métadonnées</h2>
//                     </div>
//                     <dl className="grid gap-2 text-xs">
//                     {[
//                         ["ID", `#${article.id}`],
//                         ["Slug", article.slug],
//                         ["Vues", String(article.views)],
//                         ["Créé le", new Date(article.createdAt).toLocaleDateString("fr-FR")],
//                         ["Modifié le", new Date(article.updatedAt).toLocaleDateString("fr-FR")],
//                     ].map(([k, v]) => (
//                         <div key={k} className="flex justify-between gap-2">
//                         <dt className="text-slate-400">{k}</dt>
//                         <dd className="text-slate-600 font-mono truncate max-w-40" title={v}>{v}</dd>
//                         </div>
//                     ))}
//                     </dl>
//                 </SectionCard>

//                 </div>
//             </div>
//             </div>
//         </div>
//         </div>
//     );
// }