// src/services/Dashboard/destinationservice.ts
/**
 * destinationservice.ts
 *
 * Réutilise fetchAdminArticles / deleteArticle / updateArticle depuis articleservice.
 * Ajoute quickCreateDestination + updateDestination propres au type DESTINATION,
 * ainsi que fetchDestinationsForSelect pour peupler les selects d'association
 * (création/édition d'un article ou d'une vidéo).
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

import { fetchAdminArticles, deleteArticle, updateArticle, Article, ArticleFilters, STATUS_API_TO_UI, STATUS_UI_TO_API, ArticleStatus, handleResponse} from "@/services/Dashboard/articleservice";
import { getToken } from "@/lib/auth";

// ── Re-exports utiles ──────────────────────────────────────────────────────────

export {
    fetchAdminArticles,
    deleteArticle,
    updateArticle,
    STATUS_API_TO_UI,
    STATUS_UI_TO_API,
};

// ── Types spécifiques destination ──────────────────────────────────────────────

export type GeographicLevel = "pays" | "region" | "ville" | "province";
export type DestinationStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "REVIEW";

export interface QuickDestinationPayload {
    title: string;
    slug?: string;
    status: DestinationStatus;
    authorId: number;
    categoryId?: number;
    niveauGeographique?: GeographicLevel;
    type: "DESTINATION";
}

export interface UpdateDestinationPayload {
    id?: number;
    title?: string;
    name?: string;
    slug?: string;
    status?: ArticleStatus;
    description?: string;
    categoryId?: number;
    tags?: number[];
    content?: { type: string; value: string }[];
    excerpt?: string;
    coverImage?: string;
    metaTitle?: string;
    metaDescription?: string;
    featured?: boolean;
    slogan?: string;
    typeZone?: string;
    niveauGeographique?: string;
    continent?: string;
    regionAssociee?: string;
    langue?: string;
    monnaie?: string;
    fuseauHoraire?: string;
    officeTourisme?: string;
    climatDominant?: string;
    population?: string;
    codeTel?: string;
    meillerePeriode?: string;
    destinationId?: number | null;
}

export interface DestinationDetailResponse {
    success: boolean;
    data: UpdateDestinationPayload;
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

// ── Fetch destinations (alias typé) ───────────────────────────────────────────

export type DestinationFilters = Omit<ArticleFilters, "type">;

export function fetchAdminDestinations(filters: DestinationFilters) {
    return fetchAdminArticles({ ...filters, type: "DESTINATION" });
}

// ── Sélection légère des destinations pour les formulaires ────────────────────

export interface DestinationOption {
    id: number;
    name: string;
    slug: string;
    continent?: string | null;
}

/**
 * Liste les vraies fiches Destination (table `destinations`, pas les
 * articles-vitrines de type DESTINATION) pour peupler les selects
 * d'association lors de la création/édition d'un article ou d'une vidéo.
 *
 * Endpoint réel : GET /api/destinations/admin/destinations
 * (destinations.routes.ts est monté sur /destinations dans routes/index.ts,
 * et déclare ses sous-routes admin en /admin/destinations).
 *
 * ⚠️ La réponse de destinationController.getAllAdmin est doublement
 * imbriquée : successResponse() enveloppe son payload dans une clé `data`,
 * et ce payload contient lui-même `{ data: [...], pagination: {...} }`.
 * Donc la forme réelle est { success, data: { data: [...], pagination } },
 * pas { success, data: [...] }.
 */
export async function fetchDestinationsForSelect(): Promise<DestinationOption[]> {
    const res = await fetch(`${API()}/destinations/admin/destinations?pageSize=100`, {
        headers: authHeaders(),
    });

    const json = await handleResponse<{
        success: boolean;
        data: {
            data: { id: number; name: string; slug: string; continent?: string | null }[];
            pagination?: unknown;
        };
    }>(res);

    const list = json.data?.data ?? [];

    return list
        .map((d) => ({ id: d.id, name: d.name, slug: d.slug, continent: d.continent }))
        .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

// ── Création rapide ────────────────────────────────────────────────────────────

export async function quickCreateDestination(payload: QuickDestinationPayload): Promise<Article> {
    const body: Record<string, unknown> = {
        title:      payload.title.trim(),
        status:     payload.status,
        categoryId: payload.categoryId ?? 1,
        authorId:   payload.authorId,
        type:       payload.type,
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
        json?.data?.id ??
        json?.data?.article?.id ??
        json?.data?.destination?.id ??
        json?.id;

    if (!id) throw new Error("ID de la destination introuvable dans la réponse.");

    const detail = await fetch(`${API()}/admin/articles/${id}`, {
        headers: authHeaders(),
    }).then((r) => r.json());

    return detail?.data?.article ?? detail?.data ?? detail;
}

// ── Mise à jour destination ────────────────────────────────────────────────────

export async function updateDestination(id: number, payload: UpdateDestinationPayload): Promise<{ data: Article }> {
    return updateArticle(id, payload as Parameters<typeof updateArticle>[1]);
}

export async function createDestination(payload: UpdateDestinationPayload): Promise<DestinationDetailResponse> {
    const res = await fetch(`${API()}/destinations/admin/destinations`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse<DestinationDetailResponse>(res);
}

export async function editDestination(id: number, payload: UpdateDestinationPayload): Promise<DestinationDetailResponse> {
    const res = await fetch(`${API()}/destinations/admin/destinations/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse<DestinationDetailResponse>(res);
}













// // src/services/Dashboard/destinationservice.ts
// /**
//  * destinationservice.ts
//  *
//  * Réutilise fetchAdminArticles / deleteArticle / updateArticle depuis articleservice.
//  * Ajoute quickCreateDestination + updateDestination propres au type DESTINATION.
//  */

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// import { fetchAdminArticles, deleteArticle, updateArticle, Article, ArticleFilters, STATUS_API_TO_UI, STATUS_UI_TO_API, ArticleStatus, handleResponse} from "@/services/Dashboard/articleservice";
// import { getToken } from "@/lib/auth";

// // ── Re-exports utiles ──────────────────────────────────────────────────────────

// export {
//     fetchAdminArticles,
//     deleteArticle,
//     updateArticle,
//     //Article,
//     //ArticleFilters,
//     STATUS_API_TO_UI,
//     STATUS_UI_TO_API,
//     //ArticleStatus,
// };

// // ── Types spécifiques destination ──────────────────────────────────────────────

// export type GeographicLevel = "pays" | "region" | "ville" | "province";
// export type DestinationStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "REVIEW";

// export interface QuickDestinationPayload {
//     title: string;
//     slug?: string;
//     status: DestinationStatus;
//     authorId: number;
//     categoryId?: number;
//     niveauGeographique?: GeographicLevel;
//     type: "DESTINATION";
// }

// export interface UpdateDestinationPayload {
//     id?: number;
//     title?: string;
//     name?: string;
//     slug?: string;
//     status?: ArticleStatus;
//     description?: string;
//     categoryId?: number;
//     tags?: number[];
//     content?: { type: string; value: string }[];
//     excerpt?: string;
//     coverImage?: string;
//     metaTitle?: string;
//     metaDescription?: string;
//     featured?: boolean;
//     /** Champs métier destination */
//     slogan?: string;
//     typeZone?: string;
//     niveauGeographique?: string;
//     continent?: string;
//     regionAssociee?: string;
//     langue?: string;
//     monnaie?: string;
//     fuseauHoraire?: string;
//     officeTourisme?: string;
//     climatDominant?: string;
//     population?: string;
//     codeTel?: string;
//     meillerePeriode?: string;
//     destinationId ?: number | null;
// }

// export interface DestinationDetailResponse {
//     success: boolean;
//     data: UpdateDestinationPayload;
// }

// // ── Helpers ────────────────────────────────────────────────────────────────────

// function authHeaders(): HeadersInit {
//     const token = getToken();
//     return {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     };
// }

// const API = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

// // ── Fetch destinations (alias typé) ───────────────────────────────────────────

// export type DestinationFilters = Omit<ArticleFilters, "type">;

// export function fetchAdminDestinations(filters: DestinationFilters) {
//     return fetchAdminArticles({ ...filters, type: "DESTINATION" });
// }

// // ── Création rapide ────────────────────────────────────────────────────────────

// export async function quickCreateDestination(payload: QuickDestinationPayload): Promise<Article> {
//     const body: Record<string, unknown> = {
//         title:      payload.title.trim(),
//         status:     payload.status,
//         categoryId: payload.categoryId ?? 1,
//         authorId:   payload.authorId,
//         type:       payload.type,
//     };
//     if (payload.slug) body.slug = payload.slug.trim();

//     const res = await fetch(`${API()}/admin/articles/quick`, {
//         method: "POST",
//         headers: authHeaders(),
//         body: JSON.stringify(body),
//     });

//     const json = await res.json();

//     if (!res.ok) {
//         const msg =
//         json?.errors?.[0]?.message ?? json?.message ?? "Erreur lors de la création.";
//         throw new Error(msg);
//     }

//     const id: number =
//         json?.data?.id ??
//         json?.data?.article?.id ??
//         json?.data?.destination?.id ??
//         json?.id;

//     if (!id) throw new Error("ID de la destination introuvable dans la réponse.");

//     const detail = await fetch(`${API()}/admin/articles/${id}`, {
//         headers: authHeaders(),
//     }).then((r) => r.json());

//     return detail?.data?.article ?? detail?.data ?? detail;
// }

// // ── Mise à jour destination ────────────────────────────────────────────────────

// export async function updateDestination(id: number, payload: UpdateDestinationPayload): Promise<{ data: Article }> {
//     return updateArticle(id, payload as Parameters<typeof updateArticle>[1]);
// }

// export async function createDestination(payload: UpdateDestinationPayload ): Promise<DestinationDetailResponse> {
//     const res = await fetch(`${API()}/destinations/admin/destinations`, {
//         method: "POST",
//         headers: authHeaders(),
//         body: JSON.stringify(payload),
//     });
//     return handleResponse<DestinationDetailResponse>(res);
// }

// export async function editDestination(id: number, payload: UpdateDestinationPayload): Promise<DestinationDetailResponse> {
//     const res = await fetch(`${API()}/destinations/admin/destinations/${id}`, {
//         method: "PUT",
//         headers: authHeaders(),
//         body: JSON.stringify(payload), // Ne pas oublier le body !
//     });
//     return handleResponse<DestinationDetailResponse>(res);
// }