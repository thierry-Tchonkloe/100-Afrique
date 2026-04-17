// Types partagés entre l'éditeur et les templates de rendu

export type PageStatus = "Brouillon" | "Publié" | "Archivé" | "En Révision";
export type Visibility = "Publique" | "Privée";
export type PageTemplate = "Modèle Standard" | "Modèle Pleine Largeur" | "Modèle Blog";
export type LinkGroup = "Hôtellerie" | "Transport" | "Restauration" | "Voyages d'Affaires" | "MICE & Événements" | "Divertissement" | "Tourisme Durable";

export interface NavigationParams {
    includeInMainMenu: boolean;
    sortOrder: number;
    includeInFooter: boolean;
    linkGroup: LinkGroup;
}

export interface SeoParams {
    metaTitle: string;
    metaDescription: string;
}

/** Correspond exactement au PageForm du StaticPageEditor */
export interface PageData {
    title: string;
    content: string;
    status: PageStatus;
    visibility: Visibility;
    slug: string;
    navigation: NavigationParams;
    pageTemplate: PageTemplate;
    seo: SeoParams;
    author?: { name: string };
    updatedAt?: string;
}

/** Un bloc de contenu parsé depuis le textarea (## = heading, sinon texte) */
export interface ContentBlock {
    type: 'text' | 'image' | 'video' | 'quote' | 'code' | 'heading';
    value: string;
}

/** Parse le contenu brut textarea → blocs */
export function parseContent(raw: string): ContentBlock[] {
    return raw
        .split(/\n{1,}/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            if (line.startsWith("## ")) return { type: "heading", value: line.slice(3) };
            if (line.startsWith("> "))  return { type: "quote",   value: line.slice(2) };
            return { type: "text", value: line };
        });
}

/** Estime le temps de lecture (mots / 200 mpm) */
export function readingTime(content: string): number {
    const words = content.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
}

/** Formate une date ISO en français */
export function formatDate(iso?: string): string {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

/** Badge couleur selon statut */
export const STATUS_BADGE: Record<PageStatus, { label: string; className: string }> = {
    Publié:        { label: "Publié",        className: "bg-green-50 text-green-700 border-green-200" },
    Brouillon:     { label: "Brouillon",     className: "bg-amber-50 text-amber-700 border-amber-200" },
    Archivé:       { label: "Archivé",       className: "bg-slate-100 text-slate-500 border-slate-200" },
    "En Révision": { label: "En Révision",   className: "bg-blue-50 text-blue-600 border-blue-200" },
};