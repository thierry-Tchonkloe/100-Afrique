// ─── Config ───────────────────────────────────────────────────────────────────

import { getToken } from "@/lib/auth";
//import { Tag } from 'lucide-react';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import {UpdateDestinationPayload,} from "@/services/Dashboard/destinationservice";
import { PageTemplate, LinkGroup } from '../../components/Dashboard/StaticpageEdit';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContentType = "ARTICLE" | "VIDEO" | "PAGE" | "SALON" | "DESTINATION";
export type ArticleStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED" | "REVIEW";

export type ContentBlock =
    | { type: "text"; value: string }
    | { type: "heading"; value: string }
    | { type: "image"; url: string; caption?: string }
    | { type: "video"; url: string }
    | { type: "quote"; value: string; author?: string }
    | { type: "code"; value: string; language?: string };

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    type: "MAGAZINE" | "DESTINATION";
    order: number;
    color: string;
    createdAt: string;
    updatedAt: string;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
}

export interface Author {
    id: number;
    name: string;
    email: string;
}

export interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: ContentBlock[];
    coverImage: string;
    status: ArticleStatus;
    featured: boolean;
    views: number;
    metaTitle?: string;
    metaDescription?: string;
    createdAt: string;
    updatedAt: string;
    type: ContentType;
    categoryId: number;
    authorId: number;
    destinationId: number | null;
    destination: UpdateDestinationPayload | null;
    category: Category;
    author: Author;
    sourceUrl?: string;
    duration?: string;
    videoType?: string;
    tags: Tag[];
    location?: string;
    startDate?: string;
    endDate?: string;
    website?: string;
    relatedContentIds?: number[];
    relatedContent?: Article[];
    visibility?: "public" | "private",
    linkGroup?: LinkGroup;
    pageTemplate?: PageTemplate;
    includeInMainMenu?: boolean;
    includeInFooter?: boolean;
    sortOrder?: number;
}

export interface ArticlePagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface ArticleListResponse {
    success: boolean;
    data: Article[];
    pagination: ArticlePagination;
}

export interface ArticleDetailResponse {
    success: boolean;
    data: Article;
}

export interface ArticleFilters {
    type: ContentType;
    page?: number;
    pageSize?: number;
    search?: string;
    status?: ArticleStatus | "";
    categoryId?: number;
    sortBy?: "createdAt:asc" | "createdAt:desc" | "views:desc" | "title:asc";
}

export interface CreateArticlePayload {
    title: string;
    content: ContentBlock[];
    excerpt: string;
    coverImage?: string;
    categoryId: number;
    type: ContentType;
    status: ArticleStatus;
    featured?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    tags?: number[];
    sourceUrl?: string;
    duration?: string;
    videoType?: string;
    destinationId?: number;
}

export type UpdateArticlePayload = Partial<CreateArticlePayload>;

// ─── Auth Helper ──────────────────────────────────────────────────────────────

function getAuthHeaders(): HeadersInit {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

// ─── Error Handler ────────────────────────────────────────────────────────────

    export async function handleResponse<T>(res: Response): Promise<T> {
        const text = await res.text();

        try {
            const json = JSON.parse(text);

            if (!res.ok) {
            throw new Error(json?.message || `Erreur HTTP ${res.status}`);
            }

            return json as T;
        } catch {
            throw new Error("Réponse serveur invalide (non JSON)");
        }
    }

// ─── API Functions ────────────────────────────────────────────────────────────

    export async function fetchAdminArticles(filters: ArticleFilters ): Promise<ArticleListResponse> {
        const params = new URLSearchParams();

        params.set("type", filters.type.toUpperCase());

        if (filters.page) params.set("page", String(filters.page));
        if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
        if (filters.search) params.set("search", filters.search);
        if (filters.status) params.set("status", filters.status);
        if (filters.categoryId) params.set("categoryId", String(filters.categoryId));
        if (filters.sortBy) params.set("sortBy", filters.sortBy);

        console.log("URL 👉", `${BASE_URL}/admin/articles?${params.toString()}`);

        const res = await fetch(
            `${BASE_URL}/admin/articles?${params.toString()}`,
            { headers: getAuthHeaders() }
        );

        return handleResponse<ArticleListResponse>(res);
    }

/**
 * Récupère un article par son ID (admin)
 * GET /api/admin/articles/:id
 */
export async function fetchAdminArticleById(id: number): Promise<ArticleDetailResponse> {
    const res = await fetch(`${BASE_URL}/admin/articles/${id}`, {
        headers: getAuthHeaders(),
    });
    return handleResponse<ArticleDetailResponse>(res);
}

/**
 * Crée un nouvel article
 * POST /api/admin/articles
 */
export async function createArticle(payload: CreateArticlePayload ): Promise<ArticleDetailResponse> {
    const res = await fetch(`${BASE_URL}/admin/articles`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse<ArticleDetailResponse>(res);
}

/**
 * Met à jour un article existant
 * PUT /api/admin/articles/:id
 */
export async function updateArticle(id: number, payload: UpdateArticlePayload): Promise<ArticleDetailResponse> {
    const res = await fetch(`${BASE_URL}/admin/articles/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse<ArticleDetailResponse>(res);
}

/**
 * Supprime un article
 * DELETE /api/admin/articles/:id
 */
export async function deleteArticle(id: number): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/admin/articles/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    return handleResponse<{ success: boolean }>(res);
}

/**
 * Récupère les catégories pour les selects
 * GET /api/admin/categories
 */
export async function fetchCategories(): Promise<{success: boolean; data: Category[];}> {
    const res = await fetch(`${BASE_URL}/admin/categories`, {
        headers: getAuthHeaders(),
    });
    return handleResponse<{ success: boolean; data: Category[] }>(res);
}

// export async function fetchTags(): Promise<{success: boolean; data: Tag[];}> {
//     const res = await fetch(`${BASE_URL}/admin/tags`, {
//         headers: getAuthHeaders(),
//     });
//     return handleResponse<{ success: boolean; data: Tag[] }>(res);
// }

export async function fetchTags() {
    const res = await fetch(`${BASE_URL}/admin/tags`, {
        headers: getAuthHeaders(),
    });

    const json = await res.json();
    return json?.data ?? [];
}

// ─── Status Mapping (API ↔ UI) ────────────────────────────────────────────────

export const STATUS_API_TO_UI: Record<ArticleStatus, string> = {
    PUBLISHED: "Publié",
    DRAFT: "Brouillon",
    REVIEW: "En révision",
    ARCHIVED: "Archivé",
};

export const STATUS_UI_TO_API: Record<string, ArticleStatus> = {
    Publié: "PUBLISHED",
    Brouillon: "DRAFT",
    "En révision": "REVIEW",
    Archivé: "ARCHIVED",
};