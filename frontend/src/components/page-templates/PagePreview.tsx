"use client";

import { PageData } from "./types";
import StandardTemplate  from "./StandardTemplate";
import FullWidthTemplate from "./FullWidthTemplate";
import BlogTemplate      from "./BlogTemplate";

interface PagePreviewProps {
    page: PageData;
}

/**
 * Composant racine — sélectionne le bon template selon page.pageTemplate.
 * À intégrer dans la prévisualisation du StaticPageEditor :
 *
 *   <PagePreview page={form} />
 *
 * Où `form` est le PageForm du StaticPageEditor casté en PageData
 * (les types sont identiques).
 */
export default function PagePreview({ page }: PagePreviewProps) {
    switch (page.pageTemplate) {
        case "Modèle Pleine Largeur":
            return <FullWidthTemplate page={page} />;
        case "Modèle Blog":
            return <BlogTemplate page={page} />;
        case "Modèle Standard":
            default:
        return <StandardTemplate page={page} />;
    }
}