// "use client";

// import { useState } from "react";
// import {Bold, Italic, Underline, List, ListOrdered, Link, Image, Eye, X, ChevronDown, AlertTriangle, Globe, Lock,} from "lucide-react";

// // ── Types ──────────────────────────────────────────────────────────────────────

// type Status = "Brouillon" | "Publié" | "Archivé";
// type Visibility = "Publique" | "Privée";
// type PageTemplate = "Modèle Standard" | "Modèle Pleine Largeur" | "Modèle Blog";
// type LinkGroup = "Société" | "Services" | "Blog" | "Légal";

// interface NavigationParams {
//     includeInMainMenu: boolean;
//     sortOrder: number;
//     includeInFooter: boolean;
//     linkGroup: LinkGroup;
// }

// interface SeoParams {
//     metaTitle: string;
//     metaDescription: string;
// }

// interface PageData {
//     title: string;
//     content: string;
//     status: Status;
//     visibility: Visibility;
//     slug: string;
//     navigation: NavigationParams;
//     pageTemplate: PageTemplate;
//     seo: SeoParams;
// }

// // ── Sub-components ─────────────────────────────────────────────────────────────

// function ToolbarButton({children, title, onClick, }: { children: React.ReactNode; title: string; onClick?: () => void; }) {
//     return (
//         <button
//         type="button"
//         title={title}
//         onClick={onClick}
//         className="p-1.5 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
//         >
//         {children}
//         </button>
//     );
// }

// function SelectField({value, onChange, options,}: { value: string; onChange: (v: string) => void; options: string[]; }) {
//     return (
//         <div className="relative">
//         <select
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             className="w-full appearance-none rounded-md border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-700 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
//         >
//             {options.map((opt) => (
//             <option key={opt} value={opt}>
//                 {opt}
//             </option>
//             ))}
//         </select>
//         <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//         </div>
//     );
// }

// function SectionLabel({ children }: { children: React.ReactNode }) {
//     return (
//         <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
//         {children}
//         </label>
//     );
// }

// function CharCount({ current, max }: { current: number; max: number }) {
//     const over = current > max;
//     return (
//         <p className={`mt-1 text-xs ${over ? "text-red-500" : "text-slate-400"}`}>
//         {current}/{max} caractères recommandés
//         </p>
//     );
// }

// // ── Main Component ─────────────────────────────────────────────────────────────

// export default function StaticPageEditor({ onClose, onPreview, }: { onClose?: () => void; onPreview?: () => void; }) {
//     const [page, setPage] = useState<PageData>({
//         title: "À Propos de Notre Société",
//         content: `Fondée en 2010, notre société s'est imposée comme un leader dans le domaine de l'innovation technologique. Nous nous engageons à fournir des solutions de qualité supérieure qui transforment la façon dont nos clients travaillent et vivent.\n\nNotre Mission\nNous croyons en la puissance de la technologie pour créer un monde meilleur. Notre mission est de développer des produits et services qui simplifient la vie quotidienne tout en respectant l'environnement.\n\nNotre Équipe\nComposée de plus de 200 professionnels passionnés, notre équipe multidisciplinaire unit des experts en technologie, design et stratégie d'entreprise. Chaque membre apporte une expertise unique qui enrichit notre capacité d'innovation.\n\nNos Valeurs\n• Innovation constante\n• Excellence opérationnelle\n• Responsabilité environnementale\n• Satisfaction client`,
//         status: "Brouillon",
//         visibility: "Publique",
//         slug: "a-propos",
//         navigation: {
//         includeInMainMenu: true,
//         sortOrder: 3,
//         includeInFooter: false,
//         linkGroup: "Société",
//         },
//         pageTemplate: "Modèle Standard",
//         seo: {
//         metaTitle: "À Propos - Notre Histoire et Nos Valeurs",
//         metaDescription:
//             "Découvrez l'histoire de notre société, notre mission d'innovation technologique et les valeurs qui nous guident depuis plus de 10 ans.",
//         },
//     });

//     const [seoOpen, setSeoOpen] = useState(true);
//     const [slugWarning] = useState(true);

//     const update = <K extends keyof PageData>(key: K, value: PageData[K]) =>
//         setPage((prev) => ({ ...prev, [key]: value }));

//     const updateNav = <K extends keyof NavigationParams>(
//         key: K,
//         value: NavigationParams[K]
//     ) =>
//         setPage((prev) => ({
//         ...prev,
//         navigation: { ...prev.navigation, [key]: value },
//         }));

//     const updateSeo = <K extends keyof SeoParams>(key: K, value: SeoParams[K]) =>
//         setPage((prev) => ({ ...prev, seo: { ...prev.seo, [key]: value } }));

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
//         <div className="relative w-full max-w-4xl max-h-[95vh] flex flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden">

//             {/* ── Header ── */}
//             <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
//             <h2 className="text-lg font-bold text-slate-800 tracking-tight">
//                 Édition de la Page Statique :{" "}
//                 <span className="text-orange-600">{page.title}</span>
//             </h2>
//             <div className="flex items-center gap-3">
//                 <button
//                 onClick={onPreview}
//                 className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-orange-600 transition-colors font-medium"
//                 >
//                 <Eye className="h-4 w-4" />
//                 Prévisualiser
//                 </button>
//                 <button
//                 onClick={onClose}
//                 className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
//                 >
//                 <X className="h-5 w-5" />
//                 </button>
//             </div>
//             </div>

//             {/* ── Body ── */}
//             <div className="flex flex-1 overflow-hidden">

//             {/* Left column — main content */}
//             <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

//                 {/* Page title */}
//                 <div>
//                 <SectionLabel>Titre de la Page (H1)</SectionLabel>
//                 <input
//                     type="text"
//                     value={page.title}
//                     onChange={(e) => update("title", e.target.value)}
//                     className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
//                 />
//                 </div>

//                 {/* Rich text editor */}
//                 <div>
//                 <SectionLabel>Contenu de la Page</SectionLabel>
//                 <div className="rounded-lg border border-slate-300 shadow-sm overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
//                     {/* Toolbar */}
//                     <div className="flex items-center gap-0.5 px-3 py-2 border-b border-slate-200 bg-slate-50">
//                     <ToolbarButton title="Gras"><Bold className="h-4 w-4" /></ToolbarButton>
//                     <ToolbarButton title="Italique"><Italic className="h-4 w-4" /></ToolbarButton>
//                     <ToolbarButton title="Souligné"><Underline className="h-4 w-4" /></ToolbarButton>
//                     <div className="w-px h-5 bg-slate-300 mx-1" />
//                     <ToolbarButton title="Liste à puces"><List className="h-4 w-4" /></ToolbarButton>
//                     <ToolbarButton title="Liste numérotée"><ListOrdered className="h-4 w-4" /></ToolbarButton>
//                     <div className="w-px h-5 bg-slate-300 mx-1" />
//                     <ToolbarButton title="Insérer un lien"><Link className="h-4 w-4" /></ToolbarButton>
//                     <ToolbarButton title="Insérer une image"><Image className="h-4 w-4" /></ToolbarButton>
//                     </div>
//                     <textarea
//                     value={page.content}
//                     onChange={(e) => update("content", e.target.value)}
//                     rows={12}
//                     className="w-full resize-none px-4 py-3 text-sm text-slate-700 leading-relaxed focus:outline-none"
//                     />
//                 </div>
//                 </div>

//                 {/* Slug */}
//                 <div>
//                 <SectionLabel>Chemin d'Accès (Slug)</SectionLabel>
//                 <div className="flex rounded-lg border border-slate-300 overflow-hidden shadow-sm focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
//                     <span className="flex items-center px-3 bg-slate-100 text-slate-500 text-sm border-r border-slate-300 whitespace-nowrap select-none">
//                     https://monsite.com/
//                     </span>
//                     <input
//                     type="text"
//                     value={page.slug}
//                     onChange={(e) => update("slug", e.target.value)}
//                     className="flex-1 px-3 py-2.5 text-sm text-slate-800 focus:outline-none"
//                     />
//                 </div>
//                 {slugWarning && (
//                     <p className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-600">
//                     <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
//                     Attention : Modifier le slug après publication peut briser les liens existants
//                     </p>
//                 )}
//                 </div>

//                 {/* SEO accordion */}
//                 <div className="border border-slate-200 rounded-xl overflow-hidden">
//                 <button
//                     onClick={() => setSeoOpen((o) => !o)}
//                     className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-semibold text-slate-700"
//                 >
//                     Optimisation SEO
//                     <ChevronDown
//                     className={`h-4 w-4 text-slate-400 transition-transform ${
//                         seoOpen ? "rotate-180" : ""
//                     }`}
//                     />
//                 </button>
//                 {seoOpen && (
//                     <div className="px-4 py-4 space-y-4 bg-white">
//                     <div>
//                         <SectionLabel>Titre Méta</SectionLabel>
//                         <input
//                         type="text"
//                         value={page.seo.metaTitle}
//                         onChange={(e) => updateSeo("metaTitle", e.target.value)}
//                         className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
//                         />
//                         <CharCount current={page.seo.metaTitle.length} max={60} />
//                     </div>
//                     <div>
//                         <SectionLabel>Description Méta</SectionLabel>
//                         <textarea
//                         value={page.seo.metaDescription}
//                         onChange={(e) =>
//                             updateSeo("metaDescription", e.target.value)
//                         }
//                         rows={3}
//                         className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 leading-relaxed resize-none focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
//                         />
//                         <CharCount
//                         current={page.seo.metaDescription.length}
//                         max={155}
//                         />
//                     </div>
//                     </div>
//                 )}
//                 </div>
//             </div>

//             {/* Right column — settings sidebar */}
//             <aside className="w-72 shrink-0 border-l border-slate-200 overflow-y-auto bg-slate-50 px-5 py-6 space-y-6">

//                 {/* Status & visibility */}
//                 <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4 shadow-sm">
//                 <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
//                     Statut et Visibilité
//                 </h3>

//                 <div>
//                     <SectionLabel>Statut</SectionLabel>
//                     <SelectField
//                     value={page.status}
//                     onChange={(v) => update("status", v as Status)}
//                     options={["Brouillon", "Publié", "Archivé"]}
//                     />
//                 </div>

//                 <div>
//                     <SectionLabel>Visibilité</SectionLabel>
//                     <div className="space-y-2">
//                     {(["Publique", "Privée"] as Visibility[]).map((v) => (
//                         <label
//                         key={v}
//                         className="flex items-center gap-2 cursor-pointer"
//                         >
//                         <input
//                             type="radio"
//                             name="visibility"
//                             value={v}
//                             checked={page.visibility === v}
//                             onChange={() => update("visibility", v)}
//                             className="accent-orange-500 h-4 w-4"
//                         />
//                         <span className="flex items-center gap-1.5 text-sm text-slate-700">
//                             {v === "Publique" ? (
//                             <Globe className="h-3.5 w-3.5 text-slate-400" />
//                             ) : (
//                             <Lock className="h-3.5 w-3.5 text-slate-400" />
//                             )}
//                             {v}
//                         </span>
//                         </label>
//                     ))}
//                     </div>
//                 </div>

//                 <div>
//                     <SectionLabel>Dernière Modification</SectionLabel>
//                     <p className="text-sm text-slate-500">15 Déc 2024, 14:32</p>
//                 </div>
//                 </div>

//                 {/* Navigation params */}
//                 <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4 shadow-sm">
//                 <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
//                     Paramètres de Navigation
//                 </h3>

//                 <label className="flex items-start gap-2 cursor-pointer">
//                     <input
//                     type="checkbox"
//                     checked={page.navigation.includeInMainMenu}
//                     onChange={(e) =>
//                         updateNav("includeInMainMenu", e.target.checked)
//                     }
//                     className="mt-0.5 accent-orange-500 h-4 w-4"
//                     />
//                     <span className="text-sm text-slate-700">
//                     Inclure dans le Menu Principal
//                     </span>
//                 </label>

//                 {page.navigation.includeInMainMenu && (
//                     <div>
//                     <SectionLabel>Ordre de Tri</SectionLabel>
//                     <input
//                         type="number"
//                         value={page.navigation.sortOrder}
//                         onChange={(e) =>
//                         updateNav("sortOrder", parseInt(e.target.value) || 0)
//                         }
//                         className="w-24 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
//                     />
//                     </div>
//                 )}

//                 <label className="flex items-start gap-2 cursor-pointer">
//                     <input
//                     type="checkbox"
//                     checked={page.navigation.includeInFooter}
//                     onChange={(e) =>
//                         updateNav("includeInFooter", e.target.checked)
//                     }
//                     className="mt-0.5 accent-orange-500 h-4 w-4"
//                     />
//                     <span className="text-sm text-slate-700">
//                     Inclure dans le Footer
//                     </span>
//                 </label>

//                 <div>
//                     <SectionLabel>Groupe de Liens</SectionLabel>
//                     <SelectField
//                     value={page.navigation.linkGroup}
//                     onChange={(v) => updateNav("linkGroup", v as LinkGroup)}
//                     options={["Société", "Services", "Blog", "Légal"]}
//                     />
//                 </div>

//                 <div>
//                     <SectionLabel>Modèle de Page</SectionLabel>
//                     <SelectField
//                     value={page.pageTemplate}
//                     onChange={(v) => update("pageTemplate", v as PageTemplate)}
//                     options={[
//                         "Modèle Standard",
//                         "Modèle Pleine Largeur",
//                         "Modèle Blog",
//                     ]}
//                     />
//                 </div>
//                 </div>

//                 {/* Action buttons */}
//                 <div className="space-y-2.5">
//                 <button
//                     type="button"
//                     className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-2.5 text-sm transition-colors shadow-md shadow-orange-200"
//                 >
//                     Publier la Page
//                 </button>
//                 <button
//                     type="button"
//                     className="w-full rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2.5 text-sm transition-colors"
//                 >
//                     Enregistrer le Brouillon
//                 </button>
//                 <button
//                     type="button"
//                     onClick={onClose}
//                     className="w-full rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2.5 text-sm transition-colors"
//                 >
//                     Fermer la Modale
//                 </button>
//                 </div>
//             </aside>
//             </div>
//         </div>
//         </div>
//     );
// }












"use client";

import { useState, useEffect, useRef } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Link, Image, Eye, X, ChevronDown, AlertTriangle, Globe, Lock, Save, Loader2, AlertCircle, CheckCircle2,} from "lucide-react";
import { updatePage } from "@/services/Dashboard/pageservice";
import { Article, STATUS_API_TO_UI, STATUS_UI_TO_API } from "@/services/Dashboard/articleservice";

// ── Types ──────────────────────────────────────────────────────────────────────

type PageStatus = "Brouillon" | "Publié" | "Archivé" | "En Révision";
type Visibility = "Publique" | "Privée";
type PageTemplate = "Modèle Standard" | "Modèle Pleine Largeur" | "Modèle Blog";
type LinkGroup = "Société" | "Services" | "Blog" | "Légal";

interface NavigationParams {
    includeInMainMenu: boolean;
    sortOrder: number;
    includeInFooter: boolean;
    linkGroup: LinkGroup;
}

interface SeoParams {
    metaTitle: string;
    metaDescription: string;
}

interface PageForm {
    title: string;
    content: string;
    status: PageStatus;
    visibility: Visibility;
    slug: string;
    navigation: NavigationParams;
    pageTemplate: PageTemplate;
    seo: SeoParams;
}

interface StaticPageEditorProps {
    isOpen: boolean;
    page: Article | null;
    onClose: () => void;
    onSubmit?: (article: Article) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Mappe le statut API → libellé UI éditeur */
function toEditorStatus(apiStatus: string): PageStatus {
    const map: Record<string, PageStatus> = {
        PUBLISHED: "Publié",
        DRAFT:     "Brouillon",
        ARCHIVED:  "Archivé",
        REVIEW:    "En Révision",
    };
    return map[apiStatus] ?? "Brouillon";
}

/** Mappe le libellé UI éditeur → statut API */
function toApiStatus(uiStatus: PageStatus): string {
    const map: Record<PageStatus, string> = {
        Publié:    "PUBLISHED",
        Brouillon: "DRAFT",
        Archivé:   "ARCHIVED",
        "En Révision": "REVIEW",
    };
    return map[uiStatus] ?? "DRAFT";
}

/** Extrait le texte du content JSON de l'article */
function extractBodyText(article: Article): string {
    if (!article.content || !Array.isArray(article.content)) return "";
    return (article.content as { type: string; value: string }[])
        .filter((b) => b.type === "text" || b.type === "heading")
        .map((b) => (b.type === "heading" ? `## ${b.value}` : b.value))
        .join("\n\n");
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ToolbarButton({children, title,}: { children: React.ReactNode; title: string }) {
    return (
        <button
        type="button"
        title={title}
        className="p-1.5 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
        {children}
        </button>
    );
}

function SelectField({value, onChange, options,}: { value: string; onChange: (v: string) => void; options: string[] }) {
    return (
        <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-700 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        >
            {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
        {children}
        </label>
    );
}

function CharCount({ current, max }: { current: number; max: number }) {
    const over = current > max;
    return (
        <p className={`mt-1 text-xs ${over ? "text-red-500" : "text-slate-400"}`}>
        {current}/{max} caractères recommandés
        </p>
    );
}

// ── Editor Content ─────────────────────────────────────────────────────────────

function PageEditorContent({page, onClose, onPreview, onSubmit,
    }: {
        page: Article;
        onClose: () => void;
        onPreview?: () => void;
        onSubmit?: (article: Article) => void;
    }) {
        const [form, setForm] = useState<PageForm>({
            title:      page.title ?? "",
            content:    extractBodyText(page),
            status:     toEditorStatus(page.status),
            visibility: "Publique",
            slug:       page.slug ?? "",
            navigation: {
            includeInMainMenu: false,
            sortOrder:         0,
            includeInFooter:   false,
            linkGroup:         "Société",
            },
            pageTemplate: "Modèle Standard",
            seo: {
            metaTitle:       page.metaTitle ?? page.title ?? "",
            metaDescription: page.metaDescription ?? page.excerpt ?? "",
            },
        });

        const [seoOpen,     setSeoOpen]     = useState(true);
        const [saving,      setSaving]      = useState(false);
        const [publishing,  setPublishing]  = useState(false);
        const [saveError,   setSaveError]   = useState<string | null>(null);
        const [saveSuccess, setSaveSuccess] = useState(false);

        const update    = <K extends keyof PageForm>(key: K, val: PageForm[K]) =>
            setForm((p) => ({ ...p, [key]: val }));
        const updateNav = <K extends keyof NavigationParams>(key: K, val: NavigationParams[K]) =>
            setForm((p) => ({ ...p, navigation: { ...p.navigation, [key]: val } }));
        const updateSeo = <K extends keyof SeoParams>(key: K, val: SeoParams[K]) =>
            setForm((p) => ({ ...p, seo: { ...p.seo, [key]: val } }));

        // ── Sauvegarde ─────────────────────────────────────────────────────────────

        const save = async (targetStatus?: PageStatus) => {
            const isSaving = !targetStatus;
            if (isSaving) setSaving(true); else setPublishing(true);
            setSaveError(null);
            setSaveSuccess(false);

            try {
            const statusToSave = targetStatus ?? form.status;
            const apiStatus    = toApiStatus(statusToSave) as
                "DRAFT" | "PUBLISHED" | "ARCHIVED" | "REVIEW";

            const contentBlocks = form.content.trim()
                ? form.content.split(/\n{2,}/).map((line) => {
                    const t = line.trim();
                    if (!t) return null;
                    if (t.startsWith("## ")) return { type: "heading", value: t.slice(3) };
                    return { type: "text", value: t };
                }).filter(Boolean) as { type: string; value: string }[]
                : [{ type: "text", value: "Contenu vide" }];

            const payload: Parameters<typeof updatePage>[1] = {
                title:   form.title.trim() || undefined,
                status:  apiStatus,
                content: contentBlocks,
            };
            if (form.seo.metaTitle.trim())       payload.metaTitle       = form.seo.metaTitle.trim();
            if (form.seo.metaDescription.trim()) payload.metaDescription = form.seo.metaDescription.trim();
            if (form.slug.trim())                payload.slug            = form.slug.trim();
            if (form.pageTemplate)               payload.pageTemplate    = form.pageTemplate;
            payload.includeInMainMenu = form.navigation.includeInMainMenu;
            payload.includeInFooter   = form.navigation.includeInFooter;
            payload.sortOrder         = form.navigation.sortOrder;
            payload.linkGroup         = form.navigation.linkGroup;
            payload.visibility        = form.visibility === "Publique" ? "public" : "private";

            const res = await updatePage(page.id, payload);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            if (targetStatus) onSubmit?.(res.data);
            } catch (err: unknown) {
            setSaveError((err as Error).message || "Erreur lors de la sauvegarde.");
            } finally {
            setSaving(false);
            setPublishing(false);
            }
        };

        const slugWillBreakLinks = page.status === "PUBLISHED" && form.slug !== page.slug;

        // ── Render ─────────────────────────────────────────────────────────────────

        return (
            <div className="relative w-full max-w-4xl max-h-[95vh] flex flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                Édition :{" "}
                <span className="text-orange-600">{form.title || page.title}</span>
                </h2>
                <div className="flex items-center gap-3">
                {/* Feedback */}
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
                    onClick={onPreview}
                    className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-orange-600 transition-colors font-medium"
                >
                    <Eye className="h-4 w-4" />
                    Prévisualiser
                </button>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">

                {/* Left — contenu principal */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

                {/* Titre */}
                <div>
                    <SectionLabel>Titre de la Page (H1)</SectionLabel>
                    <input
                    type="text"
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                </div>

                {/* Contenu */}
                <div>
                    <SectionLabel>Contenu de la Page</SectionLabel>
                    <div className="rounded-lg border border-slate-200 shadow-sm overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
                    {/* Toolbar */}
                    <div className="flex items-center gap-0.5 px-3 py-2 border-b border-slate-200 bg-slate-50">
                        <ToolbarButton title="Gras"><Bold className="h-4 w-4" /></ToolbarButton>
                        <ToolbarButton title="Italique"><Italic className="h-4 w-4" /></ToolbarButton>
                        <ToolbarButton title="Souligné"><Underline className="h-4 w-4" /></ToolbarButton>
                        <div className="w-px h-5 bg-slate-200 mx-1" />
                        <ToolbarButton title="Liste à puces"><List className="h-4 w-4" /></ToolbarButton>
                        <ToolbarButton title="Liste numérotée"><ListOrdered className="h-4 w-4" /></ToolbarButton>
                        <div className="w-px h-5 bg-slate-200 mx-1" />
                        <ToolbarButton title="Insérer un lien"><Link className="h-4 w-4" /></ToolbarButton>
                        <ToolbarButton title="Insérer une image"><Image className="h-4 w-4" /></ToolbarButton>
                    </div>
                    <textarea
                        value={form.content}
                        onChange={(e) => update("content", e.target.value)}
                        rows={14}
                        placeholder="Rédigez le contenu. Utilisez ## pour les sous-titres, séparés par une ligne vide…"
                        className="w-full resize-none px-4 py-3 text-sm text-slate-700 leading-relaxed focus:outline-none font-mono"
                    />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400">
                    Utilisez <code className="bg-slate-100 px-1 rounded">## Titre</code> pour les sous-titres. Séparez les paragraphes par une ligne vide.
                    </p>
                </div>

                {/* Slug */}
                <div>
                    <SectionLabel>Chemin d&apos;Accès (Slug)</SectionLabel>
                    <div className="flex rounded-lg border border-slate-200 overflow-hidden shadow-sm focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
                    <span className="flex items-center px-3 bg-slate-100 text-slate-500 text-sm border-r border-slate-200 whitespace-nowrap select-none font-mono">
                        /
                    </span>
                    <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => update("slug", e.target.value)}
                        className="flex-1 px-3 py-2.5 text-sm text-slate-800 font-mono focus:outline-none"
                    />
                    </div>
                    {slugWillBreakLinks && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-600">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        Attention : modifier le slug après publication peut briser les liens existants
                    </p>
                    )}
                </div>

                {/* SEO */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                    onClick={() => setSeoOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-semibold text-slate-700"
                    >
                    Optimisation SEO
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${seoOpen ? "rotate-180" : ""}`} />
                    </button>
                    {seoOpen && (
                    <div className="px-4 py-4 space-y-4 bg-white">
                        <div>
                        <SectionLabel>Titre Méta</SectionLabel>
                        <input
                            type="text"
                            value={form.seo.metaTitle}
                            onChange={(e) => updateSeo("metaTitle", e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        <CharCount current={form.seo.metaTitle.length} max={60} />
                        </div>
                        <div>
                        <SectionLabel>Description Méta</SectionLabel>
                        <textarea
                            value={form.seo.metaDescription}
                            onChange={(e) => updateSeo("metaDescription", e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 leading-relaxed resize-none focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        <CharCount current={form.seo.metaDescription.length} max={155} />
                        </div>
                    </div>
                    )}
                </div>
                </div>

                {/* Right — sidebar */}
                <aside className="w-72 shrink-0 border-l border-slate-200 overflow-y-auto bg-slate-50 px-5 py-6 space-y-6">

                {/* Statut & visibilité */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                    Statut et Visibilité
                    </h3>

                    <div>
                    <SectionLabel>Statut</SectionLabel>
                    <SelectField
                        value={form.status}
                        onChange={(v) => update("status", v as PageStatus)}
                        options={["Brouillon", "Publié", "Archivé", "En Révision"] as PageStatus[]}
                    />
                    </div>

                    <div>
                    <SectionLabel>Visibilité</SectionLabel>
                    <div className="space-y-2">
                        {(["Publique", "Privée"] as Visibility[]).map((v) => (
                        <label key={v} className="flex items-center gap-2 cursor-pointer">
                            <input
                            type="radio"
                            name="visibility"
                            value={v}
                            checked={form.visibility === v}
                            onChange={() => update("visibility", v)}
                            className="accent-orange-500 h-4 w-4"
                            />
                            <span className="flex items-center gap-1.5 text-sm text-slate-700">
                            {v === "Publique"
                                ? <Globe className="h-3.5 w-3.5 text-slate-400" />
                                : <Lock className="h-3.5 w-3.5 text-slate-400" />
                            }
                            {v}
                            </span>
                        </label>
                        ))}
                    </div>
                    </div>

                    <div>
                    <SectionLabel>Auteur</SectionLabel>
                    <p className="text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">
                        {page.author.name}
                    </p>
                    </div>

                    <div>
                    <SectionLabel>Dernière Modification</SectionLabel>
                    <p className="text-sm text-slate-500">
                        {new Date(page.updatedAt).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "short", year: "numeric",
                        })}
                    </p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                    Paramètres de Navigation
                    </h3>

                    <label className="flex items-start gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={form.navigation.includeInMainMenu}
                        onChange={(e) => updateNav("includeInMainMenu", e.target.checked)}
                        className="mt-0.5 accent-orange-500 h-4 w-4"
                    />
                    <span className="text-sm text-slate-700">Inclure dans le Menu Principal</span>
                    </label>

                    {form.navigation.includeInMainMenu && (
                    <div>
                        <SectionLabel>Ordre de Tri</SectionLabel>
                        <input
                        type="number"
                        value={form.navigation.sortOrder}
                        onChange={(e) => updateNav("sortOrder", parseInt(e.target.value) || 0)}
                        className="w-24 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                    </div>
                    )}

                    <label className="flex items-start gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={form.navigation.includeInFooter}
                        onChange={(e) => updateNav("includeInFooter", e.target.checked)}
                        className="mt-0.5 accent-orange-500 h-4 w-4"
                    />
                    <span className="text-sm text-slate-700">Inclure dans le Footer</span>
                    </label>

                    <div>
                    <SectionLabel>Groupe de Liens</SectionLabel>
                    <SelectField
                        value={form.navigation.linkGroup}
                        onChange={(v) => updateNav("linkGroup", v as LinkGroup)}
                        options={["Société", "Services", "Blog", "Légal"]}
                    />
                    </div>

                    <div>
                    <SectionLabel>Modèle de Page</SectionLabel>
                    <SelectField
                        value={form.pageTemplate}
                        onChange={(v) => update("pageTemplate", v as PageTemplate)}
                        options={["Modèle Standard", "Modèle Pleine Largeur", "Modèle Blog"]}
                    />
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-2.5">
                    <button
                    type="button"
                    onClick={() => save("Publié")}
                    disabled={publishing}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-2.5 text-sm transition-colors shadow-md shadow-orange-200 disabled:opacity-60"
                    >
                    {publishing
                        ? <><Loader2 size={15} className="animate-spin" /> Publication…</>
                        : "Publier la Page"
                    }
                    </button>
                    <button
                    type="button"
                    onClick={() => save()}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2.5 text-sm transition-colors disabled:opacity-60"
                    >
                    {saving
                        ? <><Loader2 size={15} className="animate-spin" /> Enregistrement…</>
                        : <><Save size={14} /> Enregistrer le Brouillon</>
                    }
                    </button>
                    <button
                    type="button"
                    onClick={onClose}
                    className="w-full rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2.5 text-sm transition-colors"
                    >
                    Fermer
                    </button>
                </div>
                </aside>
            </div>
            </div>
        );
    }

// ── Modal Wrapper ──────────────────────────────────────────────────────────────

export default function StaticPageEditor({isOpen, page, onClose, onSubmit,}: StaticPageEditorProps) {
    const overlayRef              = useRef<HTMLDivElement>(null);
    const [visible, setVisible]   = useState(false);
    const [mounted, setMounted]   = useState(false);

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

    if (!mounted || !page) return null;

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
            opacity:       visible ? 1 : 0,
            transform:     visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
            transition:    "opacity 300ms ease, transform 300ms ease",
            width:         "100%",
            display:       "flex",
            alignItems:    "center",
            justifyContent:"center",
            }}
        >
            <PageEditorContent
            page={page}
            onClose={onClose}
            onSubmit={onSubmit}
            />
        </div>
        </div>
    );
}