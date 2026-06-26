// src/services/Dashboard/pageservice.ts
/**
 * pageservice.ts
 *
 * Réutilise fetchAdminArticles / deleteArticle / updateArticle depuis articleservice.
 * Ajoute quickCreatePage + updatePage propres au type PAGE.
 */

import { fetchAdminArticles, deleteArticle, updateArticle, Article, ArticleFilters, STATUS_API_TO_UI, STATUS_UI_TO_API, ArticleStatus,} from "@/services/Dashboard/articleservice";
import { getToken } from "@/lib/auth";

// ── Re-exports utiles ──────────────────────────────────────────────────────────

export {
    fetchAdminArticles,
    deleteArticle,
    updateArticle,
    //Article,
    //ArticleFilters,
    STATUS_API_TO_UI,
    STATUS_UI_TO_API,
    //ArticleStatus,
};

// ── Types spécifiques page ─────────────────────────────────────────────────────

export interface QuickPagePayload {
    title: string;
    /** Valeur API : "DRAFT" | "PUBLISHED" | "ARCHIVED" | "REVIEW" */
    status: ArticleStatus;
    /** Slug personnalisé (optionnel — le backend en génère un si absent) */
    slug?: string;
    authorId: number;
    /** Pour l'instant fixé à 1 ; passez la vraie catégorie quand l'API l'exige */
    categoryId?: number;
    type: "PAGE";
}

export interface UpdatePagePayload {
    title?: string;
    status?: ArticleStatus;
    categoryId?: number;
    content?: { type: string; value: string }[];
    excerpt?: string;
    coverImage?: string;
    metaTitle?: string;
    metaDescription?: string;
    featured?: boolean;
    /** Champs spécifiques page statique (stockés dans le content JSON ou via champ dédié) */
    slug?: string;
    pageTemplate?: string;
    includeInMainMenu?: boolean;
    includeInFooter?: boolean;
    sortOrder?: number;
    linkGroup?: string;
    visibility?: "public" | "private";
}


export const getPageBySlug = async (slug: string) => {
    const res = await fetch(`${API()}/mag/articles/${slug}`, {
        method: "GET",
    });
    return res.json(); // déjà dépaquété
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function authHeaders(): HeadersInit {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

const API = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

// ── Fetch pages (alias typé) ───────────────────────────────────────────────────

export type PageFilters = Omit<ArticleFilters, "type">;

export function fetchAdminPages(filters: PageFilters) {
    return fetchAdminArticles({ ...filters, type: "PAGE" });
}

// ── Création rapide ────────────────────────────────────────────────────────────

export async function quickCreatePage(payload: QuickPagePayload): Promise<Article> {
    const body: Record<string, unknown> = {
        title: payload.title.trim(),
        status: payload.status,
        categoryId: payload.categoryId ?? 1,
        authorId: payload.authorId,
        type:     payload.type,
    };
    if (payload.slug) body.slug = payload.slug.trim();

    const res = await fetch(`${API()}/admin/articles/quick`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!res.ok) {
        const msg =
        json?.errors?.[0]?.message ?? json?.message ?? "Erreur lors de la création.";
        throw new Error(msg);
    }

    const id: number =
        json?.data?.id ?? json?.data?.article?.id ?? json?.data?.page?.id ?? json?.id;

    if (!id) throw new Error("ID de la page introuvable dans la réponse.");

    // Récupère l'objet complet pour avoir category + author
    const detail = await fetch(`${API()}/admin/articles/${id}`, {
        headers: authHeaders(),
    }).then((r) => r.json());

    return detail?.data?.article ?? detail?.data ?? detail;
}

// ── Mise à jour page ───────────────────────────────────────────────────────────

export async function updatePage(id: number, payload: UpdatePagePayload): Promise<{ data: Article }> {
    return updateArticle(id, payload as Parameters<typeof updateArticle>[1]);
}