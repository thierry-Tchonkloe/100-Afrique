// "use client";

// import React, { useState, useRef } from "react";
// import {X, Save, Eye, BookOpen, MapPin, Calendar, Globe, AlignLeft, Image as ImageIcon, Tag, Search, Settings, Bold, Italic, Underline, List, ListOrdered, Link, ChevronDown, Upload, Clock, User, FileText, Video, Plus, } from "lucide-react";
// import { Article } from "@/services/Dashboard/videoservice";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface SalonFormData {
//     title: string;
//     location: string;
//     startDate: string;
//     endDate: string;
//     website: string;
//     description: string;
//     planningStatus: string;
//     responsible: string;
//     slug: string;
//     tags: string[];
//     metaTitle: string;
//     metaDescription: string;
//     image: File | null;
// }

// interface SalonModalProps {
//     isOpen?: boolean;
//     salon?: Article | null; // ✅ AJOUT ICI
//     onClose?: () => void;
//     onSave?: (data: SalonFormData) => void;
//     onPublish?: (data: SalonFormData) => void;
// }

// // ─── Sub-components ───────────────────────────────────────────────────────────

// const SectionHeader = ({ icon: Icon, title, color = "text-orange-500", }: { icon: React.ElementType; title: string; color?: string; }) => (
//     <div className="flex items-center gap-2 mb-5">
//         <Icon size={16} className={color} />
//         <h3 className="font-semibold text-slate-800 text-sm tracking-wide uppercase">
//             {title}
//         </h3>
//     </div>
// );

// const InputField = ({ label, placeholder, value, onChange, type = "text", hint, }: { label: string; placeholder?: string; value: string; onChange: (v: string) => void; type?: string; hint?: string; }) => (
//     <div className="flex flex-col gap-1.5">
//         <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
//         {label}
//         </label>
//         <input
//             type={type}
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             placeholder={placeholder}
//             className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
//         />
//         {hint && <p className="text-xs text-slate-400">{hint}</p>}
//     </div>
// );

// const SelectField = ({ label, value, onChange, options, }: { label: string; value: string; onChange: (v: string) => void; options: string[]; }) => (
//     <div className="flex flex-col gap-1.5">
//         <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
//         {label}
//         </label>
//         <div className="relative">
//         <select
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
//         >
//             {options.map((opt) => (
//             <option key={opt} value={opt}>
//                 {opt}
//             </option>
//             ))}
//         </select>
//         <ChevronDown
//             size={14}
//             className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
//         />
//         </div>
//     </div>
// );

// const RichTextToolbar = () => (
//     <div className="flex items-center gap-0.5 border-b border-slate-100 bg-slate-50 px-3 py-2 rounded-t-lg">
//         {[
//         { icon: Bold, label: "Gras" },
//         { icon: Italic, label: "Italique" },
//         { icon: Underline, label: "Souligné" },
//         ].map(({ icon: Icon, label }) => (
//         <button
//             key={label}
//             title={label}
//             className="rounded p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-800 hover:shadow-sm"
//         >
//             <Icon size={14} />
//         </button>
//         ))}
//         <div className="mx-1.5 h-4 w-px bg-slate-200" />
//         {[
//         { icon: List, label: "Liste" },
//         { icon: ListOrdered, label: "Liste numérotée" },
//         ].map(({ icon: Icon, label }) => (
//         <button
//             key={label}
//             title={label}
//             className="rounded p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-800 hover:shadow-sm"
//         >
//             <Icon size={14} />
//         </button>
//         ))}
//         <div className="mx-1.5 h-4 w-px bg-slate-200" />
//         <button
//         title="Lien"
//         className="rounded p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-800 hover:shadow-sm"
//         >
//         <Link size={14} />
//         </button>
//     </div>
// );

// // ─── Tag component ─────────────────────────────────────────────────────────

// const TAG_COLORS: Record<string, string> = {
//     Tourisme: "bg-orange-100 text-orange-700 border-orange-200",
//     MICE: "bg-blue-100 text-blue-700 border-blue-200",
//     International: "bg-emerald-100 text-emerald-700 border-emerald-200",
// };

// const TagBadge = ({ tag, onRemove, }: { tag: string; onRemove: () => void; }) => (
//     <span
//         className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
//         TAG_COLORS[tag] ?? "bg-slate-100 text-slate-600 border-slate-200"
//         }`}
//     >
//         {tag}
//         <button
//         onClick={onRemove}
//         className="ml-0.5 rounded-full opacity-60 hover:opacity-100 transition"
//         >
//         <X size={10} />
//         </button>
//     </span>
// );

// // ─── Main Modal ───────────────────────────────────────────────────────────────

// export default function SalonModal({ salon, isOpen = true, onClose, onSave, onPublish, }: SalonModalProps) {
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     const [form, setForm] = useState<SalonFormData>({
//         title: "Salon International du Tourisme",
//         location: "Paris Expo Porte de Versailles",
//         startDate: "2024-03-15",
//         endDate: "2024-03-18",
//         website: "",
//         description:
//         'Le Salon International du Tourisme est un événement majeur qui rassemble chaque année les professionnels du secteur touristique. Créé en 1985, il constitue une plateforme d\'échange privilégiée entre les destinations, les tour-opérateurs et les acteurs de l\'industrie du voyage.\nCette année, le thème principal porte sur "Le Tourisme Durable et Responsable", mettant l\'accent sur les nouvelles pratiques écoresponsables et l\'impact positif du tourisme sur les communautés locales.',
//         planningStatus: "À Planifier",
//         responsible: "Marie Dubois",
//         slug: "/salons/salon-international-tourisme-2024",
//         tags: ["Tourisme", "MICE", "International"],
//         metaTitle: "",
//         metaDescription: "",
//         image: null,
//     });

//     const [tagInput, setTagInput] = useState("");
//     const [lastSaved] = useState("Il y a 2 minutes");
//     const [imagePreview, setImagePreview] = useState<string | null>(null);

//     const set = <K extends keyof SalonFormData>(key: K, value: SalonFormData[K]) =>
//         setForm((prev) => ({ ...prev, [key]: value }));

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0] ?? null;
//         set("image", file);
//         if (file) {
//         const reader = new FileReader();
//         reader.onload = (ev) => setImagePreview(ev.target?.result as string);
//         reader.readAsDataURL(file);
//         }
//     };

//     const addTag = (tag: string) => {
//         const trimmed = tag.trim();
//         if (trimmed && !form.tags.includes(trimmed)) {
//         set("tags", [...form.tags, trimmed]);
//         }
//         setTagInput("");
//     };

//     const removeTag = (tag: string) =>
//         set("tags", form.tags.filter((t) => t !== tag));

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//         {/* Modal container */}
//         <div className="relative w-full max-w-4xl max-h-[95vh] flex flex-col bg-white rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden">

//             {/* ── Header ── */}
//             <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-100 bg-white z-10 shrink-0">
//             <div className="flex items-center gap-3">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 shadow-md shadow-orange-200">
//                 <BookOpen size={15} className="text-white" />
//                 </div>
//                 <h2 className="font-semibold text-slate-800 text-base">
//                 Édition de la Fiche Salon :{" "}
//                 <span className="text-orange-600">{form.title || "Nouveau Salon"}</span>
//                 </h2>
//             </div>

//             <div className="flex items-center gap-2">
//                 {/* Last saved */}
//                 <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
//                 <Clock size={11} />
//                 Dernière sauvegarde : {lastSaved}
//                 </span>

//                 {/* Actions */}
//                 <button
//                 onClick={() => onSave?.(form)}
//                 className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
//                 >
//                 <FileText size={13} />
//                 Enregistrer le Brouillon
//                 </button>
//                 <button
//                 onClick={() => onPublish?.(form)}
//                 className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 active:scale-95"
//                 >
//                 <Save size={13} />
//                 Enregistrer et Publier
//                 </button>
//                 <button
//                 className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
//                 >
//                 <Eye size={13} />
//                 Prévisualiser
//                 </button>

//                 {/* Close */}
//                 <button
//                 onClick={onClose}
//                 className="ml-1 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
//                 >
//                 <X size={16} />
//                 </button>
//             </div>
//             </header>

//             {/* ── Body ── */}
//             <div className="flex flex-1 overflow-hidden">
//             {/* Left column */}
//             <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

//                 {/* Informations de Base */}
//                 <section>
//                 <SectionHeader icon={Settings} title="Informations de Base" />
//                 <div className="space-y-4">
//                     <InputField
//                     label="Titre du Salon / Événement"
//                     value={form.title}
//                     onChange={(v) => set("title", v)}
//                     placeholder="Ex: Salon International du Tourisme"
//                     />
//                     <div className="grid grid-cols-3 gap-3">
//                     <InputField
//                         label="Lieu"
//                         value={form.location}
//                         onChange={(v) => set("location", v)}
//                         placeholder="Paris Expo..."
//                     />
//                     <InputField
//                         label="Date de Début"
//                         type="date"
//                         value={form.startDate}
//                         onChange={(v) => set("startDate", v)}
//                     />
//                     <InputField
//                         label="Date de Fin"
//                         type="date"
//                         value={form.endDate}
//                         onChange={(v) => set("endDate", v)}
//                     />
//                     </div>
//                     <InputField
//                     label="Site Web Officiel de l'Événement"
//                     type="url"
//                     value={form.website}
//                     onChange={(v) => set("website", v)}
//                     placeholder="https://..."
//                     hint="Saisissez l'URL complète du site officiel"
//                     />
//                 </div>
//                 </section>

//                 {/* Description Détaillée */}
//                 <section>
//                 <SectionHeader icon={AlignLeft} title="Description Détaillée" color="text-blue-500" />
//                 <div className="flex flex-col gap-1.5">
//                     <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Description du Salon (Historique, Objectifs, Thème de l`année)
//                     </label>
//                     <div className="rounded-lg border border-slate-200 overflow-hidden transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
//                     <RichTextToolbar />
//                     <textarea
//                         value={form.description}
//                         onChange={(e) => set("description", e.target.value)}
//                         rows={7}
//                         className="w-full px-4 py-3 text-sm text-slate-700 leading-relaxed placeholder-slate-400 outline-none resize-none bg-white"
//                         placeholder="Décrivez le salon en détail..."
//                     />
//                     </div>
//                 </div>
//                 </section>

//                 {/* Média à la Une */}
//                 <section>
//                 <SectionHeader icon={ImageIcon} title="Média à la Une" color="text-purple-500" />
//                 <div className="flex flex-col gap-1.5">
//                     <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Image Principale / Logo
//                     </label>
//                     <div
//                     onClick={() => fileInputRef.current?.click()}
//                     className="group flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 cursor-pointer transition hover:border-orange-300 hover:bg-orange-50"
//                     >
//                     {imagePreview ? (
//                         <img
//                         src={imagePreview}
//                         alt="Aperçu"
//                         className="max-h-32 rounded-lg object-contain shadow"
//                         />
//                     ) : (
//                         <>
//                         <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 group-hover:border-orange-200 transition">
//                             <Upload size={20} className="text-slate-400 group-hover:text-orange-400 transition" />
//                         </div>
//                         <div className="text-center">
//                             <p className="text-sm font-medium text-slate-600">
//                             Ajouter l`image à la Une / Logo du Salon
//                             </p>
//                             <p className="text-xs text-slate-400 mt-0.5">PNG, JPG jusqu`à 5MB</p>
//                         </div>
//                         <button className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-600">
//                             Choisir un fichier
//                         </button>
//                         </>
//                     )}
//                     <input
//                         ref={fileInputRef}
//                         type="file"
//                         accept="image/png,image/jpeg"
//                         className="hidden"
//                         onChange={handleImageChange}
//                     />
//                     </div>
//                 </div>
//                 </section>
//             </div>

//             {/* Right column */}
//             <aside className="w-72 shrink-0 overflow-y-auto border-l border-slate-100 bg-slate-50/60 px-5 py-6 space-y-8">

//                 {/* Statut et Planification */}
//                 <section>
//                 <SectionHeader icon={Settings} title="Statut et Planification" color="text-orange-500" />
//                 <div className="space-y-4">
//                     <SelectField
//                     label="Statut de Planification"
//                     value={form.planningStatus}
//                     onChange={(v) => set("planningStatus", v)}
//                     options={["À Planifier", "En Cours", "Confirmé", "Annulé", "Terminé"]}
//                     />
//                     <SelectField
//                     label="Responsable"
//                     value={form.responsible}
//                     onChange={(v) => set("responsible", v)}
//                     options={["Marie Dubois", "Jean Martin", "Sophie Leclerc", "Paul Bernard"]}
//                     />
//                     <InputField
//                     label="URL de la Fiche (Slug)"
//                     value={form.slug}
//                     onChange={(v) => set("slug", v)}
//                     placeholder="/salons/mon-salon-2024"
//                     />
//                 </div>
//                 </section>

//                 {/* Taxonomie et Contenu */}
//                 <section>
//                 <SectionHeader icon={Tag} title="Taxonomie et Contenu" color="text-amber-500" />
//                 <div className="space-y-4">
//                     {/* Tags */}
//                     <div className="flex flex-col gap-1.5">
//                     <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
//                         Tags / Mots-clés
//                     </label>
//                     <div className="flex gap-1.5">
//                         <input
//                         type="text"
//                         value={tagInput}
//                         onChange={(e) => setTagInput(e.target.value)}
//                         onKeyDown={(e) => {
//                             if (e.key === "Enter" || e.key === ",") {
//                             e.preventDefault();
//                             addTag(tagInput);
//                             }
//                         }}
//                         placeholder="Ex: MICE, Hôtellerie..."
//                         className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs placeholder-slate-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
//                         />
//                         <button
//                         onClick={() => addTag(tagInput)}
//                         className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-orange-50 hover:border-orange-300 hover:text-orange-500"
//                         >
//                         <Plus size={14} />
//                         </button>
//                     </div>
//                     {form.tags.length > 0 && (
//                         <div className="flex flex-wrap gap-1.5 mt-1">
//                         {form.tags.map((tag) => (
//                             <TagBadge key={tag} tag={tag} onRemove={() => removeTag(tag)} />
//                         ))}
//                         </div>
//                     )}
//                     </div>

//                     {/* Contenu Associé */}
//                     <div className="flex flex-col gap-2">
//                     <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
//                         Contenu Associé
//                     </label>
//                     <div className="space-y-1.5">
//                         {[
//                         { icon: FileText, label: 'Article: "Tendances du Tourisme 2024"', color: "text-blue-500" },
//                         { icon: Video, label: 'Vidéo: "Interview Directeur Salon"', color: "text-purple-500" },
//                         ].map(({ icon: Icon, label, color }) => (
//                         <div
//                             key={label}
//                             className="flex items-center gap-2 rounded-lg bg-white border border-slate-100 px-3 py-2 text-xs text-slate-600 shadow-sm"
//                         >
//                             <Icon size={12} className={color} />
//                             <span className="truncate">{label}</span>
//                         </div>
//                         ))}
//                         <button className="flex w-full items-center gap-1.5 rounded-lg border border-dashed border-slate-200 px-3 py-2 text-xs text-slate-400 transition hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50">
//                         <Plus size={12} />
//                         Ajouter du contenu
//                         </button>
//                     </div>
//                     </div>
//                 </div>
//                 </section>

//                 {/* Optimisation SEO */}
//                 <section>
//                 <SectionHeader icon={Search} title="Optimisation SEO" color="text-emerald-500" />
//                 <div className="space-y-3">
//                     <div className="flex flex-col gap-1.5">
//                     <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
//                         Titre Méta
//                     </label>
//                     <input
//                         type="text"
//                         value={form.metaTitle}
//                         onChange={(e) => set("metaTitle", e.target.value)}
//                         placeholder="Titre pour le référencement..."
//                         maxLength={60}
//                         className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs placeholder-slate-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
//                     />
//                     <div className="flex justify-between">
//                         <p className="text-xs text-slate-400">60 caractères max recommandés</p>
//                         <p className={`text-xs font-medium ${form.metaTitle.length > 60 ? "text-red-500" : "text-slate-400"}`}>
//                         {form.metaTitle.length}/60
//                         </p>
//                     </div>
//                     </div>
//                     <div className="flex flex-col gap-1.5">
//                     <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
//                         Description Méta
//                     </label>
//                     <textarea
//                         value={form.metaDescription}
//                         onChange={(e) => set("metaDescription", e.target.value)}
//                         placeholder="Description pour les moteurs de recherche..."
//                         rows={3}
//                         maxLength={160}
//                         className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs placeholder-slate-400 outline-none resize-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
//                     />
//                     <div className="flex justify-between">
//                         <p className="text-xs text-slate-400">160 caractères max recommandés</p>
//                         <p className={`text-xs font-medium ${form.metaDescription.length > 160 ? "text-red-500" : "text-slate-400"}`}>
//                         {form.metaDescription.length}/160
//                         </p>
//                     </div>
//                     </div>
//                 </div>
//                 </section>
//             </aside>
//             </div>
//         </div>
//         </div>
//     );
// }







"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Save, Eye, BookOpen, AlignLeft, Image as ImageIcon, Tag, Search, Settings, Bold, Italic, Underline, List, ListOrdered, Link, ChevronDown, Upload, Clock, FileText, Video, Plus, Loader2, AlertCircle, CheckCircle2,} from "lucide-react";
import { updateSalon } from "@/services/Dashboard/salonservice";
import { Article, STATUS_API_TO_UI } from "@/services/Dashboard/articleservice";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SalonForm {
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    website: string;
    description: string;
    planningStatus: string;
    slug: string;
    tags: string[];
    metaTitle: string;
    metaDescription: string;
}

interface SalonEditProps {
    isOpen: boolean;
    salon: Article | null;
    onClose: () => void;
    onSubmit?: (article: Article) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PLANNING_STATUSES = ["Brouillon", "En Révision", "Publié", "Archivé"];

const TAG_COLORS: Record<string, string> = {
    Tourisme:      "bg-orange-100 text-orange-700 border-orange-200",
    MICE:          "bg-blue-100 text-blue-700 border-blue-200",
    International: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

/** Extrait le texte du content JSON de l'article */
function extractBodyText(article: Article): string {
    if (!article.content || !Array.isArray(article.content)) return "";
    return (article.content as { type: string; value: string }[])
        .filter((b) => b.type === "text" || b.type === "heading")
        .map((b) => (b.type === "heading" ? `## ${b.value}` : b.value))
        .join("\n\n");
}

/** Mappe le statut interne salon → statut API article */
function toApiStatus(planningStatus: string): "DRAFT" | "PUBLISHED" | "REVIEW" | "ARCHIVED" {
    const map: Record<string, "DRAFT" | "PUBLISHED" | "REVIEW" | "ARCHIVED"> = {
        "Brouillon":    "DRAFT",
        "En Révision":  "REVIEW",
        "Publié":       "PUBLISHED",
        "Archivé":      "ARCHIVED",
    };
    return map[planningStatus] ?? "DRAFT";
}

/** Mappe le statut API → statut interne salon */
function fromApiStatus(apiStatus: string): string {
    const map: Record<string, string> = {
        DRAFT:     "Brouillon",
        REVIEW:    "En Révision",
        PUBLISHED: "Publié",
        ARCHIVED:  "Archivé",
    };
    return map[apiStatus] ?? "À Planifier";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({icon: Icon, title, color = "text-orange-500",}: { icon: React.ElementType; title: string; color?: string }) {
    return (
        <div className="flex items-center gap-2 mb-5">
        <Icon size={16} className={color} />
        <h3 className="font-semibold text-slate-800 text-sm tracking-wide uppercase">{title}</h3>
        </div>
    );
}

function InputField({label, placeholder, value, onChange, type = "text", hint,}: {
    label: string; placeholder?: string; value: string;
    onChange: (v: string) => void; type?: string; hint?: string;
}) {
    return (
        <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
        </div>
    );
}

function SelectField({label, value, onChange, options,}: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
    return (
        <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</label>
        <div className="relative">
            <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            >
            {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        </div>
    );
}

function RichTextToolbar() {
    return (
        <div className="flex items-center gap-0.5 border-b border-slate-100 bg-slate-50 px-3 py-2 rounded-t-lg">
        {[
            { icon: Bold, label: "Gras" }, { icon: Italic, label: "Italique" },
            { icon: Underline, label: "Souligné" },
        ].map(({ icon: Icon, label }) => (
            <button key={label} title={label} className="rounded p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-800 hover:shadow-sm">
            <Icon size={14} />
            </button>
        ))}
        <div className="mx-1.5 h-4 w-px bg-slate-200" />
        {[
            { icon: List, label: "Liste" }, { icon: ListOrdered, label: "Liste numérotée" },
        ].map(({ icon: Icon, label }) => (
            <button key={label} title={label} className="rounded p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-800 hover:shadow-sm">
            <Icon size={14} />
            </button>
        ))}
        <div className="mx-1.5 h-4 w-px bg-slate-200" />
        <button title="Lien" className="rounded p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-800 hover:shadow-sm">
            <Link size={14} />
        </button>
        </div>
    );
}

function TagBadge({ tag, onRemove }: { tag: string; onRemove: () => void }) {
    return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        TAG_COLORS[tag] ?? "bg-slate-100 text-slate-600 border-slate-200"
        }`}>
        {tag}
        <button onClick={onRemove} className="ml-0.5 rounded-full opacity-60 hover:opacity-100 transition">
            <X size={10} />
        </button>
        </span>
    );
}

// ─── Editor Content ───────────────────────────────────────────────────────────

function SalonEditorContent({salon, onClose, onSubmit,}: { salon: Article; onClose: () => void; onSubmit?: (a: Article) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<SalonForm>({
        title:          salon.title ?? "",
        location:       "",
        startDate:      "",
        endDate:        "",
        website:        "",
        description:    extractBodyText(salon),
        planningStatus: fromApiStatus(salon.status),
        slug:           salon.slug ?? "",
        tags:           [],
        metaTitle:      salon.metaTitle ?? "",
        metaDescription: salon.metaDescription ?? "",
    });

    const [tagInput,    setTagInput]    = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(
        salon.coverImage || null
    );
    const [saving,      setSaving]      = useState(false);
    const [publishing,  setPublishing]  = useState(false);
    const [saveError,   setSaveError]   = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const set = <K extends keyof SalonForm>(key: K, value: SalonForm[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const addTag = (tag: string) => {
        const trimmed = tag.trim();
        if (trimmed && !form.tags.includes(trimmed)) set("tags", [...form.tags, trimmed]);
        setTagInput("");
    };

    const removeTag = (tag: string) => set("tags", form.tags.filter((t) => t !== tag));

    // ── Sauvegarde ─────────────────────────────────────────────────────────────

    const save = async (publish = false) => {
        if (publish) setPublishing(true); else setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
        const apiStatus = publish ? "PUBLISHED" : toApiStatus(form.planningStatus);

        const contentBlocks = form.description.trim()
            ? form.description.split(/\n{2,}/).map((line) => {
                const t = line.trim();
                if (!t) return null;
                if (t.startsWith("## ")) return { type: "heading", value: t.slice(3) };
                return { type: "text", value: t };
            }).filter(Boolean) as { type: string; value: string }[]
            : [{ type: "text", value: "Contenu vide" }];

        const payload: Parameters<typeof updateSalon>[1] = {
            title:   form.title.trim() || undefined,
            status:  apiStatus as "DRAFT" | "PUBLISHED" | "REVIEW" | "ARCHIVED",
            content: contentBlocks,
            planningStatus: form.planningStatus,
            location:       form.location.trim() || undefined,
            startDate:      form.startDate || undefined,
            endDate:        form.endDate || undefined,
            website:        form.website.trim() || undefined,
            tags:           form.tags.length ? form.tags : undefined,
        };
        if (form.metaTitle.trim())       payload.metaTitle       = form.metaTitle.trim();
        if (form.metaDescription.trim()) payload.metaDescription = form.metaDescription.trim();
        if (form.slug.trim())            payload.featured        = undefined; // slug non modifiable via updateArticle sans endpoint dédié

        const res = await updateSalon(salon.id, payload);
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

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div className="relative w-full max-w-4xl max-h-[95vh] flex flex-col bg-white rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-100 bg-white z-10 shrink-0">
            <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 shadow-md shadow-orange-200">
                <BookOpen size={15} className="text-white" />
            </div>
            <h2 className="font-semibold text-slate-800 text-base">
                Édition :{" "}
                <span className="text-orange-600">{form.title || salon.title}</span>
            </h2>
            </div>

            <div className="flex items-center gap-2">
            {/* Feedback */}
            {saveError && (
                <span className="hidden sm:flex items-center gap-1 text-xs text-red-500">
                <AlertCircle size={13} /> {saveError}
                </span>
            )}
            {saveSuccess && (
                <span className="hidden sm:flex items-center gap-1 text-xs text-green-600">
                <CheckCircle2 size={13} /> Sauvegardé !
                </span>
            )}
            {!saveError && !saveSuccess && (
                <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                <Clock size={11} />
                Salon #{salon.id} · {new Date(salon.updatedAt).toLocaleDateString("fr-FR")}
                </span>
            )}

            <button
                onClick={() => save(false)}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-60"
            >
                {saving ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} />}
                {saving ? "Enregistrement…" : "Enregistrer le Brouillon"}
            </button>
            <button
                onClick={() => save(true)}
                disabled={publishing}
                className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 active:scale-95 disabled:opacity-60"
            >
                {publishing ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                {publishing ? "Publication…" : "Enregistrer et Publier"}
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50">
                <Eye size={13} /> Prévisualiser
            </button>
            <button
                onClick={onClose}
                className="ml-1 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
                <X size={16} />
            </button>
            </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

            {/* Left column */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

            {/* Informations de Base */}
            <section>
                <SectionHeader icon={Settings} title="Informations de Base" />
                <div className="space-y-4">
                <InputField
                    label="Titre du Salon / Événement"
                    value={form.title}
                    onChange={(v) => set("title", v)}
                    placeholder="Ex: Salon International du Tourisme"
                />
                <div className="grid grid-cols-3 gap-3">
                    <InputField
                    label="Lieu"
                    value={form.location}
                    onChange={(v) => set("location", v)}
                    placeholder="Paris Expo..."
                    />
                    <InputField
                    label="Date de Début"
                    type="date"
                    value={form.startDate}
                    onChange={(v) => set("startDate", v)}
                    />
                    <InputField
                    label="Date de Fin"
                    type="date"
                    value={form.endDate}
                    onChange={(v) => set("endDate", v)}
                    />
                </div>
                <InputField
                    label="Site Web Officiel"
                    type="url"
                    value={form.website}
                    onChange={(v) => set("website", v)}
                    placeholder="https://..."
                    hint="URL complète du site officiel de l'événement"
                />
                </div>
            </section>

            {/* Description */}
            <section>
                <SectionHeader icon={AlignLeft} title="Description Détaillée" color="text-blue-500" />
                <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Description (Historique, Objectifs, Thème de l&apos;année)
                </label>
                <div className="rounded-lg border border-slate-200 overflow-hidden transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                    <RichTextToolbar />
                    <textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    rows={8}
                    placeholder="Décrivez le salon en détail…"
                    className="w-full px-4 py-3 text-sm text-slate-700 leading-relaxed placeholder-slate-400 outline-none resize-none bg-white"
                    />
                </div>
                </div>
            </section>

            {/* Image */}
            <section>
                <SectionHeader icon={ImageIcon} title="Média à la Une" color="text-purple-500" />
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 cursor-pointer transition hover:border-orange-300 hover:bg-orange-50"
                >
                {imagePreview ? (
                    <img src={imagePreview} alt="Aperçu" className="max-h-32 rounded-lg object-contain shadow" />
                ) : (
                    <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 group-hover:border-orange-200 transition">
                        <Upload size={20} className="text-slate-400 group-hover:text-orange-400 transition" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-slate-600">Ajouter l&apos;image à la Une / Logo du Salon</p>
                        <p className="text-xs text-slate-400 mt-0.5">PNG, JPG jusqu&apos;à 5 MB</p>
                    </div>
                    <button className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-600">
                        Choisir un fichier
                    </button>
                    </>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={handleImageChange}
                />
                </div>
            </section>
            </div>

            {/* Right sidebar */}
            <aside className="w-72 shrink-0 overflow-y-auto border-l border-slate-100 bg-slate-50/60 px-5 py-6 space-y-8">

            {/* Statut */}
            <section>
                <SectionHeader icon={Settings} title="Statut et Planification" color="text-orange-500" />
                <div className="space-y-4">
                <SelectField
                    label="Statut de Planification"
                    value={form.planningStatus}
                    onChange={(v) => set("planningStatus", v)}
                    options={PLANNING_STATUSES}
                />

                {/* Auteur (lecture seule) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Responsable
                    </label>
                    <p className="text-sm text-slate-700 border border-slate-200 rounded-lg bg-white px-3 py-2.5">
                    {salon.author.name}
                    </p>
                </div>

                {/* Catégorie (lecture seule) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Catégorie
                    </label>
                    <p
                    className="text-sm font-medium border border-slate-200 rounded-lg bg-white px-3 py-2.5"
                    style={{ color: salon.category.color }}
                    >
                    {salon.category.name}
                    </p>
                </div>

                <InputField
                    label="URL de la Fiche (Slug)"
                    value={form.slug}
                    onChange={(v) => set("slug", v)}
                    placeholder="/salons/mon-salon-2024"
                />
                </div>
            </section>

            {/* Tags */}
            <section>
                <SectionHeader icon={Tag} title="Taxonomie et Contenu" color="text-amber-500" />
                <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Tags / Mots-clés
                    </label>
                    <div className="flex gap-1.5">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            addTag(tagInput);
                        }
                        }}
                        placeholder="Ex: MICE, Hôtellerie…"
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs placeholder-slate-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                    <button
                        onClick={() => addTag(tagInput)}
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-orange-50 hover:border-orange-300 hover:text-orange-500"
                    >
                        <Plus size={14} />
                    </button>
                    </div>
                    {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                        {form.tags.map((tag) => (
                        <TagBadge key={tag} tag={tag} onRemove={() => removeTag(tag)} />
                        ))}
                    </div>
                    )}
                </div>

                {/* Contenu associé (placeholder statique — à connecter) */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contenu Associé
                    </label>
                    <div className="space-y-1.5">
                    {[
                        { icon: FileText, label: "Articles liés", color: "text-blue-500" },
                        { icon: Video,    label: "Vidéos liées",  color: "text-purple-500" },
                    ].map(({ icon: Icon, label, color }) => (
                        <div key={label} className="flex items-center gap-2 rounded-lg bg-white border border-slate-100 px-3 py-2 text-xs text-slate-500 shadow-sm">
                        <Icon size={12} className={color} />
                        <span>{label}</span>
                        </div>
                    ))}
                    <button className="flex w-full items-center gap-1.5 rounded-lg border border-dashed border-slate-200 px-3 py-2 text-xs text-slate-400 transition hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50">
                        <Plus size={12} /> Ajouter du contenu
                    </button>
                    </div>
                </div>
                </div>
            </section>

            {/* SEO */}
            <section>
                <SectionHeader icon={Search} title="Optimisation SEO" color="text-emerald-500" />
                <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Titre Méta</label>
                    <span className={`text-xs font-medium ${form.metaTitle.length > 60 ? "text-red-500" : "text-slate-400"}`}>
                        {form.metaTitle.length}/60
                    </span>
                    </div>
                    <input
                    type="text"
                    value={form.metaTitle}
                    onChange={(e) => set("metaTitle", e.target.value)}
                    placeholder="Titre pour le référencement…"
                    maxLength={60}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs placeholder-slate-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Description Méta</label>
                    <span className={`text-xs font-medium ${form.metaDescription.length > 160 ? "text-red-500" : "text-slate-400"}`}>
                        {form.metaDescription.length}/160
                    </span>
                    </div>
                    <textarea
                    value={form.metaDescription}
                    onChange={(e) => set("metaDescription", e.target.value)}
                    placeholder="Description pour les moteurs de recherche…"
                    rows={3}
                    maxLength={160}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs placeholder-slate-400 outline-none resize-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                </div>
                </div>
            </section>
            </aside>
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
            style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
            transition: "opacity 300ms ease, transform 300ms ease",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            }}
        >
            <SalonEditorContent salon={salon} onClose={onClose} onSubmit={onSubmit} />
        </div>
        </div>
    );
}