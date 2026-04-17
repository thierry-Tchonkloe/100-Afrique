// lib/pages/toPageData.ts
import type { Article } from "@/services/Dashboard/articleservice";
import type { PageData } from "@/components/page-templates/types";

/**
 * Convertit un Article (format API) en PageData (format templates).
 * Centralise le mapping pour ne pas le dupliquer dans chaque route.
 */
export function toPageData(article: Article): PageData {
  const content = Array.isArray(article.content)
    ? (article.content as { type: string; value: string }[])
        .map((b) => (b.type === "heading" ? `## ${b.value}` : b.value))
        .join("\n\n")
    : "";

  return {
    title:       article.title ?? "",
    content,
    status:      toUiStatus(article.status),
    visibility:  article.visibility === "public" ? "Publique" : "Privée",
    slug:        article.slug ?? "",
    pageTemplate: (article.pageTemplate as PageData["pageTemplate"]) ?? "Modèle Standard",
    navigation: {
      includeInMainMenu: article.includeInMainMenu ?? false,
      sortOrder:         article.sortOrder         ?? 0,
      includeInFooter:   article.includeInFooter   ?? false,
      linkGroup:         (article.linkGroup as PageData["navigation"]["linkGroup"]) ?? "Société",
    },
    seo: {
      metaTitle:       article.metaTitle       ?? article.title ?? "",
      metaDescription: article.metaDescription ?? article.excerpt ?? "",
    },
    author:    { name: article.author?.name ?? "" },
    updatedAt: article.updatedAt,
  };
}

function toUiStatus(s: string): PageData["status"] {
  return ({ PUBLISHED: "Publié", DRAFT: "Brouillon", ARCHIVED: "Archivé", REVIEW: "En Révision" } as Record<string, PageData["status"]>)[s] ?? "Brouillon";
}