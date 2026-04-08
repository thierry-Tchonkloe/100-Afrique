// "use client";

// import { useState } from "react";
// import { X, Globe, Image, Info, Edit3, Bold, Italic, Underline, List, ListOrdered, Link, Eye, Save, CheckCircle, } from "lucide-react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// type Tab = "general" | "media" | "pratique";

// interface DestinationFormData {
//     nom: string;
//     slogan: string;
//     typeZone: string;
//     niveauGeographique: string;
//     description: string;
//     continent: string;
//     regionAssociee: string;
// }

// interface DestinationModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSaveDraft?: (data: DestinationFormData) => void;
//     onPublish?: (data: DestinationFormData) => void;
//     initialData?: Partial<DestinationFormData>;
// }

// // ─── Constants ────────────────────────────────────────────────────────────────

// const TYPES_ZONE = ["Pays", "Région", "Ville", "Site", "Île"] as const;
// const NIVEAUX_GEO = ["National", "Régional", "Local"] as const;
// const CONTINENTS = [ "Afrique", "Amérique du Nord", "Amérique du Sud", "Asie", "Europe", "Océanie", ] as const;
// const REGIONS: Record<string, string[]> = {
//     Afrique: [
//         "Afrique de l'Ouest",
//         "Afrique de l'Est",
//         "Afrique du Nord",
//         "Afrique Centrale",
//         "Afrique Australe",
//     ],
//     "Amérique du Nord": ["Caraïbes", "Amérique Centrale", "Amérique du Nord"],
//     "Amérique du Sud": ["Cône Sud", "Amazonie", "Andes"],
//     Asie: ["Asie du Sud-Est", "Asie du Sud", "Asie de l'Est", "Moyen-Orient"],
//     Europe: [
//         "Europe de l'Ouest",
//         "Europe de l'Est",
//         "Europe du Sud",
//         "Europe du Nord",
//     ],
//     Océanie: ["Australasie", "Mélanésie", "Polynésie", "Micronésie"],
// };

// const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
//     { id: "general", label: "Général & Description", icon: <Edit3 size={15} /> },
//     { id: "media", label: "Médias & SEO", icon: <Image size={15} /> },
//     { id: "pratique", label: "Informations Pratiques", icon: <Info size={15} /> },
// ];

// // ─── Sub-components ──────────────────────────────────────────────────────────

// function SelectField({ label, value, onChange, options, className = "",}: {
//     label: string;
//     value: string;
//     onChange: (v: string) => void;
//     options: readonly string[];
//     className?: string;
// }) {
//     return (
//         <div className={`flex flex-col gap-1.5 ${className}`}>
//         <label className="text-sm font-medium text-gray-700">{label}</label>
//         <div className="relative">
//             <select
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-gray-800 shadow-sm transition focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
//             >
//             {options.map((o) => (
//                 <option key={o} value={o}>
//                 {o}
//                 </option>
//             ))}
//             </select>
//             <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
//             <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                 <path
//                 d="M3 5l4 4 4-4"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 />
//             </svg>
//             </span>
//         </div>
//         </div>
//     );
// }

// function RichTextToolbar() {
//     return (
//         <div className="flex items-center gap-0.5 border-b border-gray-100 bg-gray-50 px-2 py-1.5">
//         {[
//             { icon: <Bold size={14} />, title: "Gras" },
//             { icon: <Italic size={14} />, title: "Italique" },
//             { icon: <Underline size={14} />, title: "Souligné" },
//         ].map(({ icon, title }) => (
//             <button
//             key={title}
//             type="button"
//             title={title}
//             className="rounded p-1.5 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
//             >
//             {icon}
//             </button>
//         ))}
//         <div className="mx-1.5 h-4 w-px bg-gray-200" />
//         {[
//             { icon: <List size={14} />, title: "Liste" },
//             { icon: <ListOrdered size={14} />, title: "Liste numérotée" },
//         ].map(({ icon, title }) => (
//             <button
//             key={title}
//             type="button"
//             title={title}
//             className="rounded p-1.5 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
//             >
//             {icon}
//             </button>
//         ))}
//         <div className="mx-1.5 h-4 w-px bg-gray-200" />
//         <button
//             type="button"
//             title="Lien"
//             className="rounded p-1.5 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
//         >
//             <Link size={14} />
//         </button>
//         </div>
//     );
// }

// // ─── Tab: Général & Description ──────────────────────────────────────────────

// function TabGeneral({ data, onChange, }: {
//     data: DestinationFormData;
//     onChange: (patch: Partial<DestinationFormData>) => void;
// }) {
//     const regions = REGIONS[data.continent] ?? [];

//     return (
//         <div className="space-y-8 py-6">
//         {/* Identification */}
//         <section>
//             <div className="mb-4 flex items-center gap-2 text-red-500">
//             <Edit3 size={16} />
//             <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-800">
//                 Identification et Description
//             </h3>
//             </div>

//             <div className="space-y-4">
//             {/* Nom */}
//             <div>
//                 <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                 Nom de la Destination{" "}
//                 <span className="text-gray-400 font-normal">(H1)</span>
//                 </label>
//                 <input
//                 type="text"
//                 value={data.nom}
//                 onChange={(e) => onChange({ nom: e.target.value })}
//                 className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 shadow-sm transition focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
//                 />
//             </div>

//             {/* Slogan */}
//             <div>
//                 <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                 Slogan / Phrase d&apos;Accroche
//                 </label>
//                 <input
//                 type="text"
//                 value={data.slogan}
//                 onChange={(e) => onChange({ slogan: e.target.value })}
//                 placeholder="Ex: Terre de Téranga, destination d'exception"
//                 className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-400 shadow-sm transition placeholder:text-gray-300 focus:border-red-400 focus:text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-100"
//                 />
//             </div>

//             {/* Type + Niveau */}
//             <div className="grid grid-cols-2 gap-4">
//                 <SelectField
//                 label="Type de Zone"
//                 value={data.typeZone}
//                 onChange={(v) => onChange({ typeZone: v })}
//                 options={TYPES_ZONE}
//                 />
//                 <SelectField
//                 label="Niveau Géographique"
//                 value={data.niveauGeographique}
//                 onChange={(v) => onChange({ niveauGeographique: v })}
//                 options={NIVEAUX_GEO}
//                 />
//             </div>

//             {/* Description riche */}
//             <div>
//                 <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                 Description Détaillée{" "}
//                 <span className="text-gray-400 font-normal">(Atouts B2B)</span>
//                 </label>
//                 <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm transition focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100">
//                 <RichTextToolbar />
//                 <textarea
//                     value={data.description}
//                     onChange={(e) => onChange({ description: e.target.value })}
//                     placeholder="Rédigez une présentation complète de la destination, ses atouts touristiques, son patrimoine culturel…"
//                     rows={7}
//                     className="w-full resize-none px-3.5 py-3 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none"
//                 />
//                 </div>
//             </div>
//             </div>
//         </section>

//         {/* Relations géographiques */}
//         <section>
//             <div className="mb-4 flex items-center gap-2 text-red-500">
//             <Globe size={16} />
//             <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-800">
//                 Relations Géographiques
//             </h3>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//             <SelectField
//                 label="Continent"
//                 value={data.continent}
//                 onChange={(v) => onChange({ continent: v, regionAssociee: REGIONS[v]?.[0] ?? "" })}
//                 options={CONTINENTS}
//             />
//             <SelectField
//                 label="Région Associée"
//                 value={data.regionAssociee}
//                 onChange={(v) => onChange({ regionAssociee: v })}
//                 options={regions.length ? regions : [data.regionAssociee]}
//             />
//             </div>
//         </section>
//         </div>
//     );
// }

//     // ─── Tab placeholders ─────────────────────────────────────────────────────────

// function TabPlaceholder({ label }: { label: string }) {
//     return (
//         <div className="flex h-52 items-center justify-center text-sm text-gray-400">
//         Section <span className="mx-1 font-medium text-gray-600">{label}</span> à
//         développer
//         </div>
//     );
// }

// // ─── Main Modal ───────────────────────────────────────────────────────────────

// export default function DestinationModal({ isOpen, onClose, onSaveDraft, onPublish, initialData = {}, }: DestinationModalProps) {
//     const [activeTab, setActiveTab] = useState<Tab>("general");
//     const [form, setForm] = useState<DestinationFormData>({
//         nom: initialData.nom ?? "Sénégal",
//         slogan: initialData.slogan ?? "",
//         typeZone: initialData.typeZone ?? "Pays",
//         niveauGeographique: initialData.niveauGeographique ?? "National",
//         description: initialData.description ?? "",
//         continent: initialData.continent ?? "Afrique",
//         regionAssociee: initialData.regionAssociee ?? "Afrique de l'Ouest",
//     });

//     const patch = (p: Partial<DestinationFormData>) =>
//         setForm((prev) => ({ ...prev, ...p }));

//     if (!isOpen) return null;

//     return (
//         /* Backdrop */
//         <div
//         className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
//         onClick={(e) => e.target === e.currentTarget && onClose()}
//         >
//         {/* Modal */}
//         <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
//             {/* ── Header ── */}
//             <div className="flex items-start justify-between border-b border-gray-100 px-6 pt-5 pb-4">
//             <div>
//                 <h2 className="text-lg font-semibold text-gray-900">
//                 Édition de la Fiche Destination :{" "}
//                 <span className="text-red-500">{form.nom || "—"}</span>
//                 </h2>
//                 <p className="mt-0.5 text-xs text-gray-400">
//                 Gérez tous les détails de votre destination touristique
//                 </p>
//             </div>
//             <button
//                 onClick={onClose}
//                 className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
//             >
//                 <X size={18} />
//             </button>
//             </div>

//             {/* ── Tabs ── */}
//             <div className="flex border-b border-gray-100 px-6">
//             {TABS.map(({ id, label, icon }) => (
//                 <button
//                 key={id}
//                 onClick={() => setActiveTab(id)}
//                 className={`flex items-center gap-1.5 border-b-2 px-1 py-3 text-sm font-medium transition mr-6 ${
//                     activeTab === id
//                     ? "border-red-500 text-red-500"
//                     : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//                 >
//                 {icon}
//                 {label}
//                 </button>
//             ))}
//             </div>

//             {/* ── Body ── */}
//             <div className="overflow-y-auto px-6" style={{ maxHeight: "60vh" }}>
//             {activeTab === "general" && (
//                 <TabGeneral data={form} onChange={patch} />
//             )}
//             {activeTab === "media" && (
//                 <TabPlaceholder label="Médias & SEO" />
//             )}
//             {activeTab === "pratique" && (
//                 <TabPlaceholder label="Informations Pratiques" />
//             )}
//             </div>

//             {/* ── Footer ── */}
//             <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
//             <button
//                 onClick={onClose}
//                 className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100"
//             >
//                 <X size={15} />
//                 Fermer la Modale
//             </button>

//             <div className="flex items-center gap-2">
//                 <button
//                 onClick={() => {}}
//                 className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50"
//                 >
//                 <Eye size={15} />
//                 Prévisualiser la Fiche
//                 </button>

//                 <button
//                 onClick={() => onSaveDraft?.(form)}
//                 className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50"
//                 >
//                 <Save size={15} />
//                 Enregistrer le Brouillon
//                 </button>

//                 <button
//                 onClick={() => onPublish?.(form)}
//                 className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 active:scale-95"
//                 >
//                 <CheckCircle size={15} />
//                 Enregistrer et Publier la Fiche
//                 </button>
//             </div>
//             </div>
//         </div>
//         </div>
//     );
// }
















"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    X, Eye, Save, Upload, Plus, Image as ImageIcon,
    Globe, Info, FileText, Trash2, GripVertical,
    Edit3, Bold, Italic, Underline, List, ListOrdered, Link,
    CheckCircle, Loader2, AlertCircle, CheckCircle2, Clock,
} from "lucide-react";
import { updateDestination } from "@/services/Dashboard/destinationservice";
import { Article, STATUS_API_TO_UI } from "@/services/Dashboard/articleservice";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = "general" | "media" | "pratique";

interface GalleryImage { id: string; url: string; file?: File }

interface DestinationForm {
    // Général
    nom: string;
    slogan: string;
    typeZone: string;
    niveauGeographique: string;
    description: string;
    continent: string;
    regionAssociee: string;
    // Pratique
    langue: string;
    monnaie: string;
    fuseauHoraire: string;
    officeTourisme: string;
    climatDominant: string;
    population: string;
    codeTel: string;
    meillerePeriode: string;
    // SEO
    metaTitle: string;
    metaDescription: string;
}

interface DestinationEditProps {
    isOpen: boolean;
    destination: Article | null;
    onClose: () => void;
    onSubmit?: (article: Article) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "general",  label: "Général & Description",   icon: <Edit3 size={14} /> },
    { id: "media",    label: "Médias & SEO",             icon: <ImageIcon size={14} /> },
    { id: "pratique", label: "Informations Pratiques",   icon: <Info size={14} /> },
];

const TYPES_ZONE  = ["Pays", "Région", "Ville", "Site", "Île"];
const NIVEAUX_GEO = ["National", "Régional", "Local"];
const CONTINENTS  = ["Afrique", "Amérique du Nord", "Amérique du Sud", "Asie", "Europe", "Océanie"];
const REGIONS: Record<string, string[]> = {
    "Afrique":         ["Afrique de l'Ouest", "Afrique de l'Est", "Afrique du Nord", "Afrique Centrale", "Afrique Australe"],
    "Amérique du Nord":["Caraïbes", "Amérique Centrale", "Amérique du Nord"],
    "Amérique du Sud": ["Cône Sud", "Amazonie", "Andes"],
    "Asie":            ["Asie du Sud-Est", "Asie du Sud", "Asie de l'Est", "Moyen-Orient"],
    "Europe":          ["Europe de l'Ouest", "Europe de l'Est", "Europe du Sud", "Europe du Nord"],
    "Océanie":         ["Australasie", "Mélanésie", "Polynésie", "Micronésie"],
};
const CLIMATS = ["Tropical", "Subtropical", "Tempéré", "Méditerranéen", "Continental", "Aride", "Polaire"];
const FUSEAUX = ["UTC-12", "UTC-11", "UTC-10", "UTC-9", "UTC-8", "UTC-7", "UTC-6", "UTC-5", "UTC-4", "UTC-3", "UTC-2", "UTC-1", "UTC+0", "UTC+1", "UTC+2", "UTC+3", "UTC+4", "UTC+5", "UTC+6", "UTC+7", "UTC+8", "UTC+9", "UTC+10", "UTC+11", "UTC+12"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractBodyText(article: Article): string {
    if (!article.content || !Array.isArray(article.content)) return "";
    return (article.content as { type: string; value: string }[])
        .filter((b) => b.type === "text" || b.type === "heading")
        .map((b) => (b.type === "heading" ? `## ${b.value}` : b.value))
        .join("\n\n");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SelectField({label, value, onChange, options, className = "", }: { label: string; value: string; onChange: (v: string) => void; options: string[]; className?: string;}) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="relative">
            <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-gray-800 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
            >
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            </span>
        </div>
        </div>
    );
}

function InputField({
    label, value, onChange, placeholder, type = "text", hint,
}: {
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
            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
        />
        {hint && <p className="text-xs text-gray-400">{hint}</p>}
        </div>
    );
}

function RichTextToolbar() {
    return (
        <div className="flex items-center gap-0.5 border-b border-gray-100 bg-gray-50 px-2 py-1.5">
        {[
            { icon: <Bold size={14} />, title: "Gras" },
            { icon: <Italic size={14} />, title: "Italique" },
            { icon: <Underline size={14} />, title: "Souligné" },
        ].map(({ icon, title }) => (
            <button key={title} type="button" title={title} className="rounded p-1.5 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800">{icon}</button>
        ))}
        <div className="mx-1.5 h-4 w-px bg-gray-200" />
        {[
            { icon: <List size={14} />, title: "Liste" },
            { icon: <ListOrdered size={14} />, title: "Liste numérotée" },
        ].map(({ icon, title }) => (
            <button key={title} type="button" title={title} className="rounded p-1.5 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800">{icon}</button>
        ))}
        <div className="mx-1.5 h-4 w-px bg-gray-200" />
        <button type="button" title="Lien" className="rounded p-1.5 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800">
            <Link size={14} />
        </button>
        </div>
    );
}

// ─── Tab: Général ─────────────────────────────────────────────────────────────

function TabGeneral({form, onChange,}: {form: DestinationForm; onChange: (patch: Partial<DestinationForm>) => void;}) {
    const regions = REGIONS[form.continent] ?? [];

    return (
        <div className="space-y-8 py-6">
        {/* Identification */}
        <section>
            <div className="mb-4 flex items-center gap-2">
            <Edit3 size={16} className="text-orange-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-800">
                Identification et Description
            </h3>
            </div>
            <div className="space-y-4">
            <InputField
                label="Nom de la Destination (H1)"
                value={form.nom}
                onChange={(v) => onChange({ nom: v })}
            />
            <InputField
                label="Slogan / Phrase d'Accroche"
                value={form.slogan}
                onChange={(v) => onChange({ slogan: v })}
                placeholder="Ex: Terre de Téranga, destination d'exception"
            />
            <div className="grid grid-cols-2 gap-4">
                <SelectField label="Type de Zone"          value={form.typeZone}          onChange={(v) => onChange({ typeZone: v })}          options={TYPES_ZONE} />
                <SelectField label="Niveau Géographique"   value={form.niveauGeographique} onChange={(v) => onChange({ niveauGeographique: v })} options={NIVEAUX_GEO} />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                Description Détaillée <span className="text-gray-400 font-normal">(Atouts B2B)</span>
                </label>
                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                <RichTextToolbar />
                <textarea
                    value={form.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    placeholder="Rédigez une présentation complète de la destination, ses atouts touristiques, son patrimoine culturel…"
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
            <Globe size={16} className="text-orange-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-800">
                Relations Géographiques
            </h3>
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

        {/* SEO */}
        <section>
            <div className="mb-4 flex items-center gap-2">
            <FileText size={16} className="text-orange-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-800">
                Optimisation SEO
            </h3>
            </div>
            <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700">Titre Méta</label>
                <span className={`text-xs ${form.metaTitle.length > 60 ? "text-red-500" : "text-gray-400"}`}>
                    {form.metaTitle.length}/60
                </span>
                </div>
                <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => onChange({ metaTitle: e.target.value })}
                maxLength={60}
                placeholder="Titre pour le référencement…"
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-gray-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700">Description Méta</label>
                <span className={`text-xs ${form.metaDescription.length > 160 ? "text-red-500" : "text-gray-400"}`}>
                    {form.metaDescription.length}/160
                </span>
                </div>
                <textarea
                value={form.metaDescription}
                onChange={(e) => onChange({ metaDescription: e.target.value })}
                maxLength={160}
                placeholder="Description pour les moteurs de recherche…"
                rows={3}
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-gray-300 resize-none focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
            </div>
            </div>
        </section>
        </div>
    );
}

// ─── Tab: Médias ──────────────────────────────────────────────────────────────

function TabMedia({
    coverImage, gallery, onCoverChange, onGalleryAdd, onGalleryRemove,
}: {
    coverImage: string | null;
    gallery: GalleryImage[];
    onCoverChange: (file: File) => void;
    onGalleryAdd: (file: File) => void;
    onGalleryRemove: (id: string) => void;
}) {
    const coverRef   = useRef<HTMLInputElement>(null);
    const galleryRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file?.type.startsWith("image/")) onCoverChange(file);
    }, [onCoverChange]);

    return (
        <div className="space-y-8 py-6">
        {/* Image principale */}
        <section>
            <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-orange-500 inline-block" />
            Média à la Une
            </h3>
            <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 tracking-wide">
                Image Principale (Header)
            </label>
            <div
                className={`relative rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
                isDragging
                    ? "border-orange-400 bg-orange-50 scale-[1.01]"
                    : "border-slate-200 bg-slate-50 hover:border-orange-300 hover:bg-orange-50/40"
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <div className="w-full h-52 relative">
                {coverImage ? (
                    <img src={coverImage} alt="Couverture" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                    <ImageIcon size={40} strokeWidth={1.2} />
                    <p className="text-sm font-medium">Glissez une image ici</p>
                    <p className="text-xs text-slate-300">ou cliquez pour parcourir</p>
                    </div>
                )}
                {coverImage && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                )}
                </div>
                <div className="flex flex-col items-center gap-1.5 py-4 bg-white/80 backdrop-blur-sm border-t border-slate-100">
                <button
                    type="button"
                    onClick={() => coverRef.current?.click()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg shadow-md shadow-orange-200 active:scale-[0.98] transition-all"
                >
                    <Upload size={15} />
                    Ajouter / Remplacer l&apos;Image de Couverture
                </button>
                <p className="text-xs text-slate-400">Format recommandé : 1920×800px, JPG ou PNG</p>
                </div>
                <input ref={coverRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onCoverChange(f); }} />
            </div>
            </div>
        </section>

        <div className="border-t border-slate-100" />

        {/* Galerie */}
        <section>
            <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 tracking-wide">
                Galerie d&apos;Images
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {gallery.map((img) => (
                <div key={img.id} className="group relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm hover:shadow-md transition-all">
                    <img src={img.url} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <button type="button" onClick={() => onGalleryRemove(img.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all scale-90 group-hover:scale-100">
                        <Trash2 size={13} />
                    </button>
                    </div>
                    <div className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-60 text-white transition-opacity cursor-grab">
                    <GripVertical size={14} />
                    </div>
                </div>
                ))}
                <button type="button" onClick={() => galleryRef.current?.click()}
                className="aspect-4/3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-orange-400 hover:bg-orange-50 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-orange-500 transition-all group">
                <div className="w-8 h-8 rounded-full bg-slate-200 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                    <Plus size={16} />
                </div>
                <span className="text-xs font-medium">Ajouter</span>
                </button>
            </div>
            <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => { Array.from(e.target.files ?? []).forEach((f) => onGalleryAdd(f)); e.target.value = ""; }} />
            </div>
        </section>
        </div>
    );
}

// ─── Tab: Informations Pratiques ──────────────────────────────────────────────

function TabPratique({form, onChange,}: { form: DestinationForm; onChange: (patch: Partial<DestinationForm>) => void }) {
    return (
        <div className="space-y-8 py-6">
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
            <Globe size={16} className="text-orange-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-800">
                Informations Pratiques Clés
            </h3>
            </div>
            <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Langue(s) Officielle(s)</label>
                <input
                    type="text"
                    value={form.langue}
                    onChange={(e) => onChange({ langue: e.target.value })}
                    placeholder="Arabe, Français, Berbère"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-gray-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
                <p className="text-xs text-gray-400">Séparez les langues par des virgules</p>
                </div>
                <InputField
                label="Monnaie"
                value={form.monnaie}
                onChange={(v) => onChange({ monnaie: v })}
                placeholder="Dirham Marocain - MAD"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <SelectField
                label="Fuseau Horaire"
                value={form.fuseauHoraire || "UTC+0"}
                onChange={(v) => onChange({ fuseauHoraire: v })}
                options={["Sélectionner un fuseau horaire", ...FUSEAUX]}
                />
                <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Office de Tourisme Professionnel</label>
                <div className="relative">
                    <input
                    type="url"
                    value={form.officeTourisme}
                    onChange={(e) => onChange({ officeTourisme: e.target.value })}
                    placeholder="https://www.visitmaroc.com"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm placeholder:text-gray-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                    <Globe size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
                </div>
                <p className="text-xs text-gray-400">Lien vers le site officiel du tourisme</p>
                </div>
            </div>
            </div>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
            <Plus size={16} className="text-orange-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-800">
                Informations Complémentaires
            </h3>
            </div>
            <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <SelectField
                label="Climat Dominant"
                value={form.climatDominant || "Sélectionner un climat"}
                onChange={(v) => onChange({ climatDominant: v })}
                options={["Sélectionner un climat", ...CLIMATS]}
                />
                <InputField
                label="Population (approximative)"
                value={form.population}
                onChange={(v) => onChange({ population: v })}
                placeholder="950 000 habitants"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <InputField
                label="Code Téléphonique"
                value={form.codeTel}
                onChange={(v) => onChange({ codeTel: v })}
                placeholder="+212"
                />
                <InputField
                label="Meilleure Période de Visite"
                value={form.meillerePeriode}
                onChange={(v) => onChange({ meillerePeriode: v })}
                placeholder="Octobre à Avril"
                />
            </div>
            </div>
        </section>
        </div>
    );
}

// ─── Editor Content ───────────────────────────────────────────────────────────

function DestinationEditorContent({
    destination, onClose, onSubmit,
}: { destination: Article; onClose: () => void; onSubmit?: (a: Article) => void }) {
    const [activeTab, setActiveTab] = useState<TabId>("general");
    const [form, setForm] = useState<DestinationForm>({
        nom:               destination.title ?? "",
        slogan:            "",
        typeZone:          TYPES_ZONE[0],
        niveauGeographique: NIVEAUX_GEO[0],
        description:       extractBodyText(destination),
        continent:         CONTINENTS[0],
        regionAssociee:    REGIONS[CONTINENTS[0]]?.[0] ?? "",
        langue:            "",
        monnaie:           "",
        fuseauHoraire:     "",
        officeTourisme:    "",
        climatDominant:    "",
        population:        "",
        codeTel:           "",
        meillerePeriode:   "",
        metaTitle:         destination.metaTitle ?? "",
        metaDescription:   destination.metaDescription ?? "",
    });

    const [coverImage,  setCoverImage]  = useState<string | null>(destination.coverImage || null);
    const [gallery,     setGallery]     = useState<GalleryImage[]>([]);
    const [saving,      setSaving]      = useState(false);
    const [publishing,  setPublishing]  = useState(false);
    const [saveError,   setSaveError]   = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const patch = (p: Partial<DestinationForm>) => setForm((prev) => ({ ...prev, ...p }));

    const handleCoverChange = (file: File) => {
        const url = URL.createObjectURL(file);
        setCoverImage(url);
    };

    const handleGalleryAdd = (file: File) => {
        const url = URL.createObjectURL(file);
        setGallery((prev) => [...prev, { id: crypto.randomUUID(), url, file }]);
    };

    const handleGalleryRemove = (id: string) =>
        setGallery((prev) => prev.filter((img) => img.id !== id));

    // ── Sauvegarde ─────────────────────────────────────────────────────────────

    const save = async (publish = false) => {
        if (publish) setPublishing(true); else setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
        const apiStatus = publish ? "PUBLISHED" : (STATUS_API_TO_UI[destination.status] === "Publié" ? "PUBLISHED" : "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED";

        const contentBlocks = form.description.trim()
            ? form.description.split(/\n{2,}/).map((line) => {
                const t = line.trim();
                if (!t) return null;
                if (t.startsWith("## ")) return { type: "heading", value: t.slice(3) };
                return { type: "text", value: t };
            }).filter(Boolean) as { type: string; value: string }[]
            : [{ type: "text", value: "Contenu vide" }];

        const payload: Parameters<typeof updateDestination>[1] = {
            title:              form.nom.trim() || undefined,
            status:             apiStatus,
            content:            contentBlocks,
            slogan:             form.slogan.trim() || undefined,
            typeZone:           form.typeZone,
            niveauGeographique: form.niveauGeographique,
            continent:          form.continent,
            regionAssociee:     form.regionAssociee,
            langue:             form.langue.trim() || undefined,
            monnaie:            form.monnaie.trim() || undefined,
            fuseauHoraire:      form.fuseauHoraire || undefined,
            officeTourisme:     form.officeTourisme.trim() || undefined,
            climatDominant:     form.climatDominant || undefined,
            population:         form.population.trim() || undefined,
            codeTel:            form.codeTel.trim() || undefined,
            meillerePeriode:    form.meillerePeriode.trim() || undefined,
        };
        if (form.metaTitle.trim())       payload.metaTitle       = form.metaTitle.trim();
        if (form.metaDescription.trim()) payload.metaDescription = form.metaDescription.trim();
        if (coverImage && !coverImage.startsWith("blob:")) payload.coverImage = coverImage;

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

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 pt-5 pb-4 shrink-0">
            <div>
            <h2 className="text-lg font-semibold text-gray-900">
                Édition de la Fiche Destination :{" "}
                <span className="text-orange-500">{form.nom || destination.title}</span>
            </h2>
            <p className="mt-0.5 text-xs text-gray-400 flex items-center gap-1.5">
                {saveError && <><AlertCircle size={11} className="text-red-500" /><span className="text-red-500">{saveError}</span></>}
                {saveSuccess && <><CheckCircle2 size={11} className="text-green-500" /><span className="text-green-500">Sauvegardé !</span></>}
                {!saveError && !saveSuccess && (
                <><Clock size={11} /> Destination #{destination.id} · {new Date(destination.updatedAt).toLocaleDateString("fr-FR")}</>
                )}
            </p>
            </div>
            <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
            <X size={18} />
            </button>
        </div>

        {/* Tabs */}
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
                {icon}
                {label}
            </button>
            ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6" style={{ maxHeight: "60vh" }}>
            {activeTab === "general" && <TabGeneral form={form} onChange={patch} />}
            {activeTab === "media"   && (
            <TabMedia
                coverImage={coverImage}
                gallery={gallery}
                onCoverChange={handleCoverChange}
                onGalleryAdd={handleGalleryAdd}
                onGalleryRemove={handleGalleryRemove}
            />
            )}
            {activeTab === "pratique" && <TabPratique form={form} onChange={patch} />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 shrink-0">
            <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={11} />
            Dernière sauvegarde : il y a 2 minutes
            </div>

            <div className="flex items-center gap-2">
            <button
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100"
            >
                <X size={15} /> Fermer la Modale
            </button>
            <button
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50"
            >
                <Eye size={15} /> Prévisualiser la Fiche
            </button>
            <button
                onClick={() => save(false)}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-slate-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
            >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? "Enregistrement…" : "Enregistrer le Brouillon"}
            </button>
            <button
                onClick={() => save(true)}
                disabled={publishing}
                className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 active:scale-[0.98] transition disabled:opacity-60"
            >
                {publishing ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                {publishing ? "Publication…" : "Enregistrer et Publier la Fiche"}
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
            backgroundColor: visible ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)",
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
            <DestinationEditorContent
            destination={destination}
            onClose={onClose}
            onSubmit={onSubmit}
            />
        </div>
        </div>
    );
}