/**
 * videoservice.ts
 *
 * Réutilise fetchAdminArticles / deleteArticle depuis articleservice.
 * Ajoute quickCreateVideo + updateVideo propres au type VIDEO.
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

// ── Types spécifiques vidéo ────────────────────────────────────────────────────

export interface QuickVideoPayload {
    title: string;
    /** Valeur UI ("Brouillon", "Publié", etc.) — convertie automatiquement */
    statusUI: string;
    authorId: number;
    /** Pour l'instant fixé à 1 ; passez la vraie catégorie quand l'API l'exige */
    categoryId?: number;
    type: "VIDEO";
}

export interface UpdateVideoPayload {
    title?: string;
    status?: ArticleStatus;
    categoryId?: number;
    content?: { type: string; value?: string; url?: string }[];  // ← les deux optionnels
    excerpt?: string;
    coverImage?: string;
    metaTitle?: string;
    metaDescription?: string;
    featured?: boolean;
    sourceUrl?: string;
    duration?: string;
    videoType?: string;
    tags: number[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function authHeaders(): HeadersInit {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

const API = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

// ── Fetch vidéos (alias typé) ──────────────────────────────────────────────────

export type VideoFilters = Omit<ArticleFilters, "type">;

export function fetchAdminVideos(filters: VideoFilters) {
    return fetchAdminArticles({ ...filters, type: "VIDEO" });
}

// ── Création rapide ────────────────────────────────────────────────────────────

export async function quickCreateVideo(payload: QuickVideoPayload): Promise<Article> {
    const res = await fetch(`${API()}/admin/articles/quick`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
        title: payload.title.trim(),
        status: STATUS_UI_TO_API[payload.statusUI] ?? "DRAFT",
        categoryId: payload.categoryId ?? 1,
        authorId: payload.authorId,
        type: payload.type,
        }),
    });

    const json = await res.json();

    if (!res.ok) {
        const msg =
        json?.errors?.[0]?.message ?? json?.message ?? "Erreur lors de la création.";
        throw new Error(msg);
    }

    const id: number =
        json?.data?.id ?? json?.data?.article?.id ?? json?.id;

    if (!id) throw new Error("ID de la vidéo introuvable dans la réponse.");

    // Récupère l'objet complet pour avoir category + author
    const detail = await fetch(`${API()}/admin/articles/${id}`, {
        headers: authHeaders(),
    }).then((r) => r.json());

    return detail?.data?.article ?? detail?.data ?? detail;
}

// ── Mise à jour vidéo ──────────────────────────────────────────────────────────

export async function updateVideo( id: number, payload: UpdateVideoPayload): Promise<{ data: Article }> {
    // Réutilise updateArticle — même endpoint PATCH /admin/articles/:id
    return updateArticle(id, payload as Parameters<typeof updateArticle>[1]);
}