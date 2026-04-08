/**
 * salonservice.ts
 *
 * Réutilise fetchAdminArticles / deleteArticle / updateArticle depuis articleservice.
 * Ajoute quickCreateSalon + updateSalon propres au type SALON.
 */

import { fetchAdminArticles, deleteArticle, updateArticle, Article, ArticleFilters, STATUS_API_TO_UI, STATUS_UI_TO_API, ArticleStatus, } from "@/services/Dashboard/articleservice";
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

// ── Types spécifiques salon ────────────────────────────────────────────────────

export interface QuickSalonPayload {
    /** Nom officiel du salon — mappé sur title */
    title: string;
    status: ArticleStatus;
    authorId: number;
    categoryId?: number;
    /** Champs métier stockés dans le content JSON */
    location?: string;
    startDate?: string;
    endDate?: string;
    planningStatus?: string;
    type: "SALON";
}

export interface UpdateSalonPayload {
    title?: string;
    status?: ArticleStatus;
    categoryId?: number;
    content?: { type: string; value: string }[];
    excerpt?: string;
    coverImage?: string;
    metaTitle?: string;
    metaDescription?: string;
    featured?: boolean;
    /** Champs métier salon */
    location?: string;
    startDate?: string;
    endDate?: string;
    website?: string;
    planningStatus?: string;
    tags?: string[];
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

// ── Fetch salons (alias typé) ──────────────────────────────────────────────────

export type SalonFilters = Omit<ArticleFilters, "type">;

export function fetchAdminSalons(filters: SalonFilters) {
    return fetchAdminArticles({ ...filters, type: "SALON" });
}

// ── Création rapide ────────────────────────────────────────────────────────────

export async function quickCreateSalon(payload: QuickSalonPayload): Promise<Article> {
    const body: Record<string, unknown> = {
        title:      payload.title.trim(),
        status:     payload.status,
        categoryId: payload.categoryId ?? 1,
        authorId:   payload.authorId,
        type:       payload.type,
    };

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
        json?.data?.id ?? json?.data?.article?.id ?? json?.data?.salon?.id ?? json?.id;

    if (!id) throw new Error("ID du salon introuvable dans la réponse.");

    // Récupère l'objet complet pour avoir category + author
    const detail = await fetch(`${API()}/admin/articles/${id}`, {
        headers: authHeaders(),
    }).then((r) => r.json());

    return detail?.data?.article ?? detail?.data ?? detail;
}

// ── Mise à jour salon ──────────────────────────────────────────────────────────

export async function updateSalon(id: number, payload: UpdateSalonPayload): Promise<{ data: Article }> {
    return updateArticle(id, payload as Parameters<typeof updateArticle>[1]);
}