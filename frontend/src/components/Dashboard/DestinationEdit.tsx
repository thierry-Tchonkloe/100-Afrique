"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    X, Save, Upload, Plus, Image as ImageIcon,
    Globe, Info, FileText, Trash2, GripVertical,
    Edit3, Bold, Italic, Underline, List, ListOrdered, Link,
    CheckCircle, Loader2, AlertCircle, CheckCircle2, Clock,
    Tag as TagIcon, Search, ChevronDown,
} from "lucide-react";
import { updateDestination, } from "@/services/Dashboard/destinationservice";
import {
    Article, Tag, fetchTags, Category, fetchCategories,
    STATUS_API_TO_UI, STATUS_UI_TO_API,
} from "@/services/Dashboard/articleservice";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = "general" | "media" | "pratique";

interface GalleryImage { id: string; url: string; file?: File }

interface DestinationForm {
    // Article fields
    title: string;
    status: string;
    categoryId: number | undefined;
    selectedTagIds: number[];
    metaTitle: string;
    metaDescription: string;
    // Destination fields
    slogan: string;
    typeZone: string;
    niveauGeographique: string;
    description: string;
    continent: string;
    regionAssociee: string;
    langue: string;
    monnaie: string;
    fuseauHoraire: string;
    officeTourisme: string;
    climatDominant: string;
    population: string;
    codeTel: string;
    meillerePeriode: string;
    }

interface DestinationEditProps {
    isOpen: boolean;
    destination: Article | null;
    onClose: () => void;
    onSubmit?: (article: Article) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "general",  label: "Général & Description", icon: <Edit3 size={14} /> },
    { id: "media",    label: "Médias & SEO",           icon: <ImageIcon size={14} /> },
    { id: "pratique", label: "Infos Pratiques",        icon: <Info size={14} /> },
];

const TYPES_ZONE  = ["Pays", "Région", "Ville", "Site", "Île"];
const NIVEAUX_GEO = ["National", "Régional", "Local"];
const CONTINENTS  = ["Afrique", "Amérique du Nord", "Amérique du Sud", "Asie", "Europe", "Océanie"];
const REGIONS: Record<string, string[]> = {
    "Afrique":          ["Afrique de l'Ouest", "Afrique de l'Est", "Afrique du Nord", "Afrique Centrale", "Afrique Australe"],
    "Amérique du Nord": ["Caraïbes", "Amérique Centrale", "Amérique du Nord"],
    "Amérique du Sud":  ["Cône Sud", "Amazonie", "Andes"],
    "Asie":             ["Asie du Sud-Est", "Asie du Sud", "Asie de l'Est", "Moyen-Orient"],
    "Europe":           ["Europe de l'Ouest", "Europe de l'Est", "Europe du Sud", "Europe du Nord"],
    "Océanie":          ["Australasie", "Mélanésie", "Polynésie", "Micronésie"],
};
const CLIMATS = ["Tropical", "Subtropical", "Tempéré", "Méditerranéen", "Continental", "Aride", "Polaire"];
const FUSEAUX = Array.from({ length: 25 }, (_, i) => `UTC${i < 12 ? `-${12 - i}` : i === 12 ? "+0" : `+${i - 12}`}`);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractBodyText(article: Article): string {
    if (!article.content || !Array.isArray(article.content)) return "";
    return (article.content as { type: string; value: string }[])
        .filter((b) => b.type === "text" || b.type === "heading")
        .map((b) => (b.type === "heading" ? `## ${b.value}` : b.value))
        .join("\n\n");
}

/** Upload an image file and return the remote URL */
async function uploadImage(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res  = await fetch("/admin/articles", { method: "POST", body: fd });
    const data = await res.json();
    const url  = data.url ?? data.data?.coverImage ?? null;
    if (!url) throw new Error("URL d'upload introuvable.");
    return url;
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function FieldLabel({ children, extra }: { children: React.ReactNode; extra?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700">{children}</label>
        {extra}
        </div>
    );
}

function SelectField({ label, value, onChange, options, className = "" }: {
    label: string; value: string; onChange: (v: string) => void; options: string[]; className?: string;
}) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="relative">
            <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-gray-800 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer"
            >
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        </div>
    );
}

function InputField({ label, value, onChange, placeholder, type = "text", hint }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; type?: string; hint?: string;
}) {
    return (
        <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
        />
        {hint && <p className="text-xs text-gray-400">{hint}</p>}
        </div>
    );
}

function RichTextToolbar() {
    return (
        <div className="flex items-center gap-0.5 border-b border-gray-100 bg-gray-50 px-2 py-1.5 rounded-t-xl">
        {[Bold, Italic, Underline].map((Icon, i) => (
            <button key={i} type="button" className="rounded p-1.5 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800">
            <Icon size={13} />
            </button>
        ))}
        <div className="mx-1.5 h-4 w-px bg-gray-200" />
        {[List, ListOrdered].map((Icon, i) => (
            <button key={i} type="button" className="rounded p-1.5 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800">
            <Icon size={13} />
            </button>
        ))}
        <div className="mx-1.5 h-4 w-px bg-gray-200" />
        <button type="button" className="rounded p-1.5 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800">
            <Link size={13} />
        </button>
        </div>
    );
}

// ─── Tag Selector (same as VideoEdit / SalonEdit) ─────────────────────────────

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
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <TagIcon size={14} className="text-amber-500" /> Tags / Mots-clés
        </label>

        <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un tag…"
            className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-3 py-2 text-xs placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition"
            />
        </div>

        <div className="max-h-32 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 space-y-0.5">
            {loading && <div className="flex justify-center py-3"><Loader2 size={14} className="animate-spin text-orange-400" /></div>}
            {!loading && filtered.length === 0 && <p className="text-xs text-gray-400 text-center py-2">Aucun tag</p>}
            {!loading && filtered.map((tag) => {
            const active = selectedIds.includes(tag.id);
            return (
                <button
                key={tag.id}
                onClick={() => toggle(tag.id)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                    active ? "bg-orange-50 text-orange-600 border border-orange-200" : "text-gray-600 hover:bg-gray-50 border border-transparent"
                }`}
                >
                <span className={`w-3 h-3 rounded-full border-2 shrink-0 transition ${active ? "bg-orange-500 border-orange-500" : "border-gray-300"}`} />
                {tag.name}
                </button>
            );
            })}
        </div>

        {selectedIds.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
            {tagIs.filter((t) => selectedIds.includes(t.id)).map((t) => (
                <span key={t.id} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                {t.name}
                <button onClick={() => toggle(t.id)} className="hover:opacity-70 transition-opacity"><X size={9} /></button>
                </span>
            ))}
            </div>
        )}
        </div>
    );
}

// ─── Tab: Général ─────────────────────────────────────────────────────────────

function TabGeneral({ form, onChange, categorie }: {
    form: DestinationForm;
    onChange: (patch: Partial<DestinationForm>) => void;
    categorie: Category[];
}) {
    const regions = REGIONS[form.continent] ?? [];

    return (
        <div className="space-y-8 py-6">

        {/* Identification */}
        <section>
            <div className="mb-4 flex items-center gap-2">
            <Edit3 size={15} className="text-orange-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Identification et Description</h3>
            </div>
            <div className="space-y-4">
            <InputField
                label="Nom de la Destination (H1)"
                value={form.title}
                onChange={(v) => onChange({ title: v })}
            />
            <InputField
                label="Slogan / Phrase d'Accroche"
                value={form.slogan}
                onChange={(v) => onChange({ slogan: v })}
                placeholder="Ex: Terre de Téranga, destination d'exception"
            />
            <div className="grid grid-cols-2 gap-4">
                <SelectField label="Type de Zone"        value={form.typeZone}           onChange={(v) => onChange({ typeZone: v })}           options={TYPES_ZONE} />
                <SelectField label="Niveau Géographique" value={form.niveauGeographique} onChange={(v) => onChange({ niveauGeographique: v })} options={NIVEAUX_GEO} />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                Description Détaillée <span className="text-gray-400 font-normal">(Atouts B2B)</span>
                </label>
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                <RichTextToolbar />
                <textarea
                    value={form.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    placeholder="Rédigez une présentation complète de la destination…"
                    rows={7}
                    className="w-full resize-none px-3.5 py-3 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none"
                />
                </div>
            </div>
            </div>
        </section>

        {/* Relations géographiques */}
        <section>
            <div className="mb-4 flex items-center gap-2">
            <Globe size={15} className="text-orange-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Relations Géographiques</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
            <SelectField
                label="Continent"
                value={form.continent}
                onChange={(v) => onChange({ continent: v, regionAssociee: REGIONS[v]?.[0] ?? "" })}
                options={CONTINENTS}
            />
            <SelectField
                label="Région Associée"
                value={form.regionAssociee}
                onChange={(v) => onChange({ regionAssociee: v })}
                options={regions.length ? regions : [form.regionAssociee].filter(Boolean)}
            />
            </div>
        </section>

        {/* Classification Article */}
        <section>
            <div className="mb-4 flex items-center gap-2">
            <FileText size={15} className="text-orange-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Classification</h3>
            </div>
            <div className="space-y-4">
            {/* Statut */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Statut</label>
                <div className="relative">
                <select
                    value={form.status}
                    onChange={(e) => onChange({ status: e.target.value })}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-gray-800 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer"
                >
                    {Object.values(STATUS_API_TO_UI).map((s) => (
                    <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Catégorie */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Catégorie</label>
                <div className="relative">
                <select
                    value={form.categoryId ?? ""}
                    onChange={(e) => onChange({ categoryId: Number(e.target.value) })}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-gray-800 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer"
                >
                    <option value="">Aucune catégorie</option>
                    {categorie.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Tags */}
            <TagSelector
                selectedIds={form.selectedTagIds}
                onChange={(ids) => onChange({ selectedTagIds: ids })}
            />
            </div>
        </section>
        </div>
    );
}

// ─── Tab: Médias & SEO ────────────────────────────────────────────────────────

function TabMedia({
    coverImage, gallery, onCoverFileChange, onCoverUrlChange,
    onGalleryAdd, onGalleryRemove, form, onChange,
}: {
    coverImage: string | null;
    gallery: GalleryImage[];
    onCoverFileChange: (file: File) => void;
    onCoverUrlChange: (url: string) => void;
    onGalleryAdd: (file: File) => void;
    onGalleryRemove: (id: string) => void;
    form: DestinationForm;
    onChange: (patch: Partial<DestinationForm>) => void;
}) {
    const coverRef      = useRef<HTMLInputElement>(null);
    const galleryRef    = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [urlMode,    setUrlMode]    = useState(false);
    const [urlInput,   setUrlInput]   = useState("");

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file?.type.startsWith("image/")) onCoverFileChange(file);
    }, [onCoverFileChange]);

    const applyUrl = () => {
        if (urlInput.trim()) { onCoverUrlChange(urlInput.trim()); setUrlMode(false); }
    };

    return (
        <div className="space-y-8 py-6">

        {/* Image principale */}
        <section>
            <div className="mb-4 flex items-center gap-2">
            <ImageIcon size={15} className="text-orange-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Média à la Une</h3>
            </div>

            <div
            className={`relative rounded-2xl border-2 border-dashed overflow-hidden transition-all duration-200 ${
                isDragging ? "border-orange-400 bg-orange-50 scale-[1.01]" : "border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/40"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            >
            <div className="w-full h-52 relative group">
                {coverImage ? (
                <>
                    <img src={coverImage} alt="Couverture" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                        onClick={() => coverRef.current?.click()}
                        className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-md hover:bg-gray-50 transition"
                    >
                        <Upload size={12} /> Changer
                    </button>
                    <button
                        onClick={() => { setUrlInput(coverImage ?? ""); setUrlMode(true); }}
                        className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-md hover:bg-gray-50 transition"
                    >
                        <Link size={12} /> URL
                    </button>
                    <button
                        onClick={() => onCoverUrlChange("")}
                        className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-red-600 transition"
                    >
                        <Trash2 size={12} /> Supprimer
                    </button>
                    </div>
                </>
                ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                    <ImageIcon size={40} strokeWidth={1.2} />
                    <p className="text-sm font-medium">Glissez une image ici</p>
                    <p className="text-xs text-gray-300">ou cliquez pour parcourir</p>
                </div>
                )}
            </div>

            <div className="flex flex-col items-center gap-1.5 py-3 bg-white/80 backdrop-blur-sm border-t border-gray-100">
                <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => coverRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-orange-200 transition"
                >
                    <Upload size={13} /> Ajouter / Remplacer
                </button>
                <button
                    type="button"
                    onClick={() => { setUrlInput(coverImage ?? ""); setUrlMode(true); }}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                    URL
                </button>
                </div>
                <p className="text-xs text-gray-400">Format recommandé : 1920×800px, JPG ou PNG</p>
            </div>
            </div>

            {/* URL mode */}
            {urlMode && (
            <div className="flex gap-2 mt-2">
                <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyUrl()}
                placeholder="https://…"
                autoFocus
                className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition"
                />
                <button onClick={applyUrl} className="px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition">OK</button>
                <button onClick={() => setUrlMode(false)} className="px-3 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 transition">Annuler</button>
            </div>
            )}

            <input ref={coverRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onCoverFileChange(f); }} />
        </section>

        <div className="border-t border-gray-100" />

        {/* Galerie */}
        <section>
            <div className="mb-4 flex items-center gap-2">
            <ImageIcon size={15} className="text-orange-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Galerie d&apos;Images</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {gallery.map((img) => (
                <div key={img.id} className="group relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm hover:shadow-md transition-all">
                <img src={img.url} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <button type="button" onClick={() => onGalleryRemove(img.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all">
                    <Trash2 size={13} />
                    </button>
                </div>
                <div className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-60 text-white cursor-grab">
                    <GripVertical size={13} />
                </div>
                </div>
            ))}
            <button type="button" onClick={() => galleryRef.current?.click()}
                className="aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-orange-400 hover:bg-orange-50 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-orange-500 transition-all group">
                <div className="w-8 h-8 rounded-full bg-gray-200 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                <Plus size={16} />
                </div>
                <span className="text-xs font-medium">Ajouter</span>
            </button>
            </div>
            <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => { Array.from(e.target.files ?? []).forEach((f) => onGalleryAdd(f)); e.target.value = ""; }} />
        </section>

        <div className="border-t border-gray-100" />

        {/* SEO */}
        <section>
            <div className="mb-4 flex items-center gap-2">
            <FileText size={15} className="text-orange-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Optimisation SEO</h3>
            </div>
            <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
                <FieldLabel extra={
                <span className={`text-xs ${form.metaTitle.length > 60 ? "text-red-500" : "text-gray-400"}`}>
                    {form.metaTitle.length}/60
                </span>
                }>Titre Méta</FieldLabel>
                <input
                value={form.metaTitle}
                onChange={(e) => onChange({ metaTitle: e.target.value })}
                maxLength={70}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-gray-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
                />
                <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all ${form.metaTitle.length > 60 ? "bg-red-400" : "bg-orange-400"}`}
                    style={{ width: `${Math.min((form.metaTitle.length / 60) * 100, 100)}%` }}
                />
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <FieldLabel extra={
                <span className={`text-xs ${form.metaDescription.length > 160 ? "text-red-500" : "text-gray-400"}`}>
                    {form.metaDescription.length}/160
                </span>
                }>Description Méta</FieldLabel>
                <textarea
                value={form.metaDescription}
                onChange={(e) => onChange({ metaDescription: e.target.value })}
                maxLength={180}
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-gray-300 resize-none focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
                />
                <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all ${form.metaDescription.length > 160 ? "bg-red-400" : "bg-orange-400"}`}
                    style={{ width: `${Math.min((form.metaDescription.length / 160) * 100, 100)}%` }}
                />
                </div>
            </div>
            </div>
        </section>
        </div>
    );
}

// ─── Tab: Informations Pratiques ──────────────────────────────────────────────

function TabPratique({ form, onChange }: { form: DestinationForm; onChange: (patch: Partial<DestinationForm>) => void }) {
    return (
        <div className="space-y-6 py-6">

        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
            <Globe size={15} className="text-orange-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Informations Pratiques Clés</h3>
            </div>
            <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Langue(s) Officielle(s)</label>
                <input
                    value={form.langue}
                    onChange={(e) => onChange({ langue: e.target.value })}
                    placeholder="Arabe, Français, Berbère"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-gray-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
                />
                <p className="text-xs text-gray-400">Séparez par des virgules</p>
                </div>
                <InputField label="Monnaie" value={form.monnaie} onChange={(v) => onChange({ monnaie: v })} placeholder="Franc CFA - XOF" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <SelectField
                label="Fuseau Horaire"
                value={form.fuseauHoraire || "UTC+0"}
                onChange={(v) => onChange({ fuseauHoraire: v })}
                options={["— Fuseau horaire —", ...FUSEAUX]}
                />
                <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Office de Tourisme Officiel</label>
                <div className="relative">
                    <input
                    type="url"
                    value={form.officeTourisme}
                    onChange={(e) => onChange({ officeTourisme: e.target.value })}
                    placeholder="https://…"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm placeholder:text-gray-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
                    />
                    <Globe size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
                </div>
                </div>
            </div>
            </div>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
            <Info size={15} className="text-orange-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">Informations Complémentaires</h3>
            </div>
            <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <SelectField
                label="Climat Dominant"
                value={form.climatDominant || "— Climat —"}
                onChange={(v) => onChange({ climatDominant: v })}
                options={["— Climat —", ...CLIMATS]}
                />
                <InputField label="Population" value={form.population} onChange={(v) => onChange({ population: v })} placeholder="1 200 000 hab." />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <InputField label="Code Téléphonique" value={form.codeTel} onChange={(v) => onChange({ codeTel: v })} placeholder="+221" />
                <InputField label="Meilleure Période" value={form.meillerePeriode} onChange={(v) => onChange({ meillerePeriode: v })} placeholder="Novembre à Avril" />
            </div>
            </div>
        </section>
        </div>
    );
}

// ─── Editor Content ───────────────────────────────────────────────────────────

function DestinationEditorContent({ destination, onClose, onSubmit }: {
    destination: Article; onClose: () => void; onSubmit?: (a: Article) => void;
}) {
    console.log("DESTINATION 👉", destination);
    // Shorthand: the nested destination object (may be null for older records)
    const dest = destination?.destination ?? null;

    const [activeTab, setActiveTab] = useState<TabId>("general");
    const [categorie, setCategories] = useState<Category[]>([]);

    // ── Load categories (same pattern as VideoEdit) ────────────────────────────
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

    // ── Préremplissage depuis Article + Destination ───────────────────────────
    const [form, setForm] = useState<DestinationForm>({
        // Article fields
        title:             destination.title ?? "",
        status:            STATUS_API_TO_UI[destination.status] ?? "DRAFT",
        categoryId:        destination.category?.id ?? undefined,
        selectedTagIds:    (destination.tags ?? []).map((t: Tag) => t.id),
        metaTitle:         destination.metaTitle ?? "",
        metaDescription:   destination.metaDescription ?? "",
        // Destination fields — hydrated from article.destination if available
        slogan:            dest?.slogan            ?? "",
        typeZone:          dest?.typeZone          ?? TYPES_ZONE[0],
        niveauGeographique: dest?.niveauGeographique ?? NIVEAUX_GEO[0],
        description:       dest?.description       ?? extractBodyText(destination),
        continent:         dest?.continent         ?? CONTINENTS[0],
        regionAssociee:    dest?.regionAssociee    ?? REGIONS[CONTINENTS[0]]?.[0] ?? "",
        langue:            dest?.langue            ?? "",
        monnaie:           dest?.monnaie           ?? "",
        fuseauHoraire:     dest?.fuseauHoraire     ?? "",
        officeTourisme:    dest?.officeTourisme    ?? "",
        climatDominant:    dest?.climatDominant    ?? "",
        population:        dest?.population        ?? "",
        codeTel:           dest?.codeTel           ?? "",
        meillerePeriode:   dest?.meillerePeriode   ?? "",
    });

    // ── Cover image: prefer destination.coverImage then article.coverImage ─────
    const [coverImage, setCoverImage] = useState<string | null>(
        dest?.coverImage ?? destination.coverImage ?? null
    );
    const [coverPendingFile, setCoverPendingFile] = useState<File | null>(null);
    const [gallery, setGallery] = useState<GalleryImage[]>([]);

    const [saving,      setSaving]      = useState(false);
    const [publishing,  setPublishing]  = useState(false);
    const [saveError,   setSaveError]   = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const patch = useCallback((p: Partial<DestinationForm>) =>
        setForm((prev) => ({ ...prev, ...p })), []);

    const handleCoverFileChange = (file: File) => {
        setCoverImage(URL.createObjectURL(file));
        setCoverPendingFile(file);
    };

    const handleCoverUrlChange = (url: string) => {
        setCoverImage(url || null);
        setCoverPendingFile(null);
    };

    // ── Sauvegarde ─────────────────────────────────────────────────────────────
    const save = async (publish = false) => {
        if (publish) setPublishing(true); else setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
        // 1. Upload cover image if a new file was selected
        let finalCoverImage = coverImage && !coverImage.startsWith("blob:") ? coverImage : null;
        if (coverPendingFile) {
            finalCoverImage = await uploadImage(coverPendingFile);
            setCoverImage(finalCoverImage);
            setCoverPendingFile(null);
        }

        const apiStatus = STATUS_UI_TO_API[form.status] as "DRAFT" | "PUBLISHED" | "REVIEW" | "ARCHIVED";
        const targetStatus = publish ? "PUBLISHED" : apiStatus;

        // 2. Build content blocks from description
        const contentBlocks = form.description.trim()
            ? form.description.split(/\n{2,}/).map((line) => {
                const t = line.trim();
                if (!t) return null;
                if (t.startsWith("## ")) return { type: "heading", value: t.slice(3) };
                return { type: "text", value: t };
            }).filter(Boolean) as { type: string; value: string }[]
            : [{ type: "text", value: "Contenu vide" }];

        // 3. Payload — updateDestination wraps updateArticle and passes
        //    both Article fields and Destination-specific fields
        const payload: Parameters<typeof updateDestination>[1] = {
            // Article fields
            title:             form.title.trim()           || undefined,
            status:            targetStatus,
            content:           contentBlocks,
            categoryId:        form.categoryId,
            tags:              form.selectedTagIds,        // tagIds sent as "tags" array
            metaTitle:         form.metaTitle.trim()       || undefined,
            metaDescription:   form.metaDescription.trim() || undefined,
            ...(finalCoverImage ? { coverImage: finalCoverImage } : {}),
            // Destination-specific fields
            slogan:             form.slogan.trim()            || undefined,
            typeZone:           form.typeZone,
            niveauGeographique: form.niveauGeographique,
            continent:          form.continent,
            regionAssociee:     form.regionAssociee,
            langue:             form.langue.trim()            || undefined,
            monnaie:            form.monnaie.trim()           || undefined,
            fuseauHoraire:      form.fuseauHoraire            || undefined,
            officeTourisme:     form.officeTourisme.trim()    || undefined,
            climatDominant:     form.climatDominant           || undefined,
            population:         form.population.trim()        || undefined,
            codeTel:            form.codeTel.trim()           || undefined,
            meillerePeriode:    form.meillerePeriode.trim()   || undefined,
        };

        console.log("Payload destination:", payload);

        const res = await updateDestination(destination.id, payload);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        if (publish) onSubmit?.(res.data);
        } catch (err: unknown) {
        setSaveError((err as Error).message || "Erreur lors de la sauvegarde.");
        } finally {
        setSaving(false);
        setPublishing(false);
        }
    };

    return (
        <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/20">

        {/* ── Header ── */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 pt-5 pb-4 shrink-0">
            <div>
            <h2 className="text-lg font-semibold text-gray-900">
                Édition :{" "}
                <span className="text-orange-500">{form.title || destination.title}</span>
            </h2>
            <p className="mt-0.5 text-xs text-gray-400 flex items-center gap-1.5">
                {saveError   && <><AlertCircle size={11} className="text-red-500" /><span className="text-red-500">{saveError}</span></>}
                {saveSuccess && <><CheckCircle2 size={11} className="text-green-500" /><span className="text-green-500">Sauvegardé !</span></>}
                {!saveError && !saveSuccess && (
                <><Clock size={11} /> Destination #{destination.id} · {new Date(destination.updatedAt).toLocaleDateString("fr-FR")}</>
                )}
            </p>
            </div>
            <button onClick={onClose} className="rounded-xl p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
            <X size={18} />
            </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-gray-100 px-6 shrink-0 bg-white">
            {TABS.map(({ id, label, icon }) => (
            <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 border-b-2 px-1 py-3 text-sm font-medium transition mr-6 ${
                activeTab === id
                    ? "border-orange-500 text-orange-500"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
                {icon} {label}
            </button>
            ))}
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6" style={{ maxHeight: "58vh" }}>
            {activeTab === "general" && (
            <TabGeneral form={form} onChange={patch} categorie={categorie} />
            )}
            {activeTab === "media" && (
            <TabMedia
                coverImage={coverImage}
                gallery={gallery}
                onCoverFileChange={handleCoverFileChange}
                onCoverUrlChange={handleCoverUrlChange}
                onGalleryAdd={(file) => {
                const url = URL.createObjectURL(file);
                setGallery((prev) => [...prev, { id: crypto.randomUUID(), url, file }]);
                }}
                onGalleryRemove={(id) => setGallery((prev) => prev.filter((img) => img.id !== id))}
                form={form}
                onChange={patch}
            />
            )}
            {activeTab === "pratique" && <TabPratique form={form} onChange={patch} />}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 shrink-0 bg-white">
            <p className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={11} />
            Destination #{destination.id}
            {dest?.id ? ` · Fiche #${dest.id}` : " · Fiche non liée"}
            </p>

            <div className="flex items-center gap-2">
            <button
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100"
            >
                <X size={14} /> Fermer
            </button>
            <button
                onClick={() => save(false)}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-slate-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
            >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button
                onClick={() => save(true)}
                disabled={publishing}
                className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:bg-orange-600 active:scale-[0.98] transition disabled:opacity-60"
            >
                {publishing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                {publishing ? "Publication…" : "Enregistrer et Publier"}
            </button>
            </div>
        </div>
        </div>
    );
}

// ─── Modal Wrapper ────────────────────────────────────────────────────────────

export default function DestinationEdit({ isOpen, destination, onClose, onSubmit }: DestinationEditProps) {
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

    if (!mounted || !destination) return null;

    return (
        <div
        ref={overlayRef}
        onClick={(e) => e.target === overlayRef.current && onClose()}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        style={{
            backgroundColor: visible ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
            backdropFilter:  visible ? "blur(6px)" : "blur(0px)",
            transition:      "background-color 300ms ease, backdrop-filter 300ms ease",
        }}
        role="dialog"
        aria-modal="true"
        >
        <div
            style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
            transition: "opacity 300ms ease, transform 300ms ease",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            }}
        >
            <DestinationEditorContent destination={destination} onClose={onClose} onSubmit={onSubmit} />
        </div>
        </div>
    );
}