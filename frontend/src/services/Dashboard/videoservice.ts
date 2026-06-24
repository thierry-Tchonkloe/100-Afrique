// src/services/Dashboard/videoservice.ts
// ─── Configuration ───────────────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Token Management ─────────────────────────────────────────────────────────
export const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
};

export const setToken = (token: string) => {
    if (typeof window !== "undefined") localStorage.setItem("auth_token", token);
};

export const removeToken = () => {
    if (typeof window !== "undefined") localStorage.removeItem("auth_token");
};

// ─── HTTP Helpers ─────────────────────────────────────────────────────────────
const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
});

async function handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json();
    if (!res.ok) {
        throw new ApiError(data.message || "Une erreur est survenue", res.status, data);
    }
    return data;
}

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: unknown
    ) {
        super(message);
        this.name = "ApiError";
    }
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export type VideoStatus = "Publié" | "Brouillon" | "En Révision" | "Archivé";
export type VideoType = "Reportage" | "Interview" | "Tutoriel" | "Présentation" | "Documentaire" | "Plateau TV" | "Terrain" | "Autre";

export interface ArticleContentBlock {
    type: "text" | "heading" | "image" | "video" | "quote" | "code";
    value?: string;
    url?: string;
    caption?: string;
    author?: string;
    language?: string;
}

export interface Article {
    id: number;
    title: string;
    slug: string;
    content: ArticleContentBlock[];
    excerpt: string;
    coverImage: string;
    status: string;
    featured: boolean;
    views: number;
    metaTitle?: string;
    metaDescription?: string;
    category: {
        id: number;
        name: string;
        slug: string;
        type: string;
        color: string;
    };
    author: {
        id: number;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface ArticlesResponse {
    success: boolean;
    data: Article[];
    pagination: Pagination;
}

export interface ArticleResponse {
    success: boolean;
    data: Article;
}

export interface CreateArticlePayload {
    title: string;
    content: ArticleContentBlock[];
    excerpt?: string;
    coverImage?: string;
    categoryId?: number;
    status?: "DRAFT" | "PUBLISHED";
    featured?: boolean;
    metaTitle?: string;
    metaDescription?: string;
}

export interface ArticlesListParams {
    page?: number;
    pageSize?: number;
    search?: string;
    categoryId?: number;
    categorySlug?: string;
    featured?: boolean;
    hasVideo?: boolean;
    year?: number;
    sortBy?: "createdAt:asc" | "createdAt:desc" | "views:desc" | "title:asc";
    status?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: {
        id: number;
        email: string;
        name: string;
        role: "EDITOR" | "SUPER_ADMIN";
        };
        token: string;
    };
}

export interface DashboardStats {
    success: boolean;
    data: {
        articles: { total: number; published: number; draft: number };
        categories: number;
        destinations: number;
        users: number;
        media: number;
        totalViews: number;
        newsletterSubscribers: number;
    };
}

export interface MediaItem {
    id: number;
    url: string;
    publicId: string;
    filename: string;
    altText?: string;
    size: number;
    mimeType: string;
}

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
    async login(payload: LoginPayload): Promise<AuthResponse> {
        const res = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        });
        const data = await handleResponse<AuthResponse>(res);
        if (data.data?.token) setToken(data.data.token);
        return data;
    },

    async register(payload: RegisterPayload): Promise<AuthResponse> {
        const res = await fetch(`${BASE_URL}/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        });
        const data = await handleResponse<AuthResponse>(res);
        if (data.data?.token) setToken(data.data.token);
        return data;
    },

    async me(): Promise<AuthResponse["data"]["user"]> {
        const res = await fetch(`${BASE_URL}/admin/me`, {
        headers: authHeaders(),
        });
        const data = await handleResponse<{ success: boolean; data: AuthResponse["data"]["user"] }>(res);
        return data.data;
    },

    logout() {
        removeToken();
    },
};

// ─── Articles Service (Public) ────────────────────────────────────────────────

export const articlesService = {
    async list(params: ArticlesListParams = {}): Promise<ArticlesResponse> {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.set(key, String(value));
        }
        });
        const res = await fetch(`${BASE_URL}/mag/articles?${query.toString()}`);
        return handleResponse<ArticlesResponse>(res);
    },

    async getBySlug(slug: string): Promise<ArticleResponse> {
        const res = await fetch(`${BASE_URL}/mag/articles/${slug}`);
        return handleResponse<ArticleResponse>(res);
    },
};

// ─── Admin Articles Service ────────────────────────────────────────────────────

export const adminArticlesService = {
    async list(params: ArticlesListParams = {}): Promise<ArticlesResponse> {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.set(key, String(value));
        }
        });
        const res = await fetch(`${BASE_URL}/admin/articles?${query.toString()}`, {
        headers: authHeaders(),
        });
        return handleResponse<ArticlesResponse>(res);
    },

    async getById(id: number): Promise<ArticleResponse> {
        const res = await fetch(`${BASE_URL}/admin/articles/${id}`, {
        headers: authHeaders(),
        });
        return handleResponse<ArticleResponse>(res);
    },

    async create(payload: CreateArticlePayload): Promise<ArticleResponse> {
        const res = await fetch(`${BASE_URL}/admin/articles`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
        });
        return handleResponse<ArticleResponse>(res);
    },

    async update(id: number, payload: Partial<CreateArticlePayload>): Promise<ArticleResponse> {
        const res = await fetch(`${BASE_URL}/admin/articles/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
        });
        return handleResponse<ArticleResponse>(res);
    },

    async delete(id: number): Promise<{ success: boolean; message: string }> {
        const res = await fetch(`${BASE_URL}/admin/articles/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
        });
        return handleResponse(res);
    },
};

// ─── Media Service ─────────────────────────────────────────────────────────────

export const mediaService = {
    async upload(file: File, altText?: string): Promise<{ success: boolean; data: MediaItem }> {
        const formData = new FormData();
        formData.append("image", file);
        if (altText) formData.append("altText", altText);

        const res = await fetch(`${BASE_URL}/admin/media/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
        });
        return handleResponse(res);
    },

    async list(page = 1, pageSize = 20): Promise<{ success: boolean; data: MediaItem[]; pagination: Pagination }> {
        const res = await fetch(`${BASE_URL}/admin/media?page=${page}&pageSize=${pageSize}`, {
        headers: authHeaders(),
        });
        return handleResponse(res);
    },

    async update(id: number, data: { altText?: string; filename?: string }): Promise<{ success: boolean; data: MediaItem }> {
        const res = await fetch(`${BASE_URL}/admin/media/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    async delete(id: number): Promise<{ success: boolean; message: string }> {
        const res = await fetch(`${BASE_URL}/admin/media/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
        });
        return handleResponse(res);
    },
};

// ─── Stats Service ─────────────────────────────────────────────────────────────

export const statsService = {
    async dashboard(): Promise<DashboardStats> {
        const res = await fetch(`${BASE_URL}/admin/stats/dashboard`, {
        headers: authHeaders(),
        });
        return handleResponse<DashboardStats>(res);
    },

    async articles() {
        const res = await fetch(`${BASE_URL}/admin/stats/articles`, {
        headers: authHeaders(),
        });
        return handleResponse(res);
    },

    async traffic() {
        const res = await fetch(`${BASE_URL}/admin/stats/traffic`, {
        headers: authHeaders(),
        });
        return handleResponse(res);
    },
};

// ─── Categories Service ────────────────────────────────────────────────────────

export const categoriesService = {
    async list(type?: "MAGAZINE" | "DESTINATION") {
        const query = type ? `?type=${type}` : "";
        const res = await fetch(`${BASE_URL}/categories${query}`);
        return handleResponse(res);
    },

    async getBySlug(slug: string) {
        const res = await fetch(`${BASE_URL}/categories/${slug}`);
        return handleResponse(res);
    },
};

// ─── Newsletter Service ────────────────────────────────────────────────────────

export const newsletterService = {
    async subscribe(email: string, source?: string, type?: string) {
        const res = await fetch(`${BASE_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, type }),
        });
        return handleResponse(res);
    },

    async unsubscribe(email: string) {
        const res = await fetch(`${BASE_URL}/newsletter/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        });
        return handleResponse(res);
    },
};

// ─── Utility: map API article status to UI VideoStatus ────────────────────────

export const STATUS_MAP: Record<string, VideoStatus> = {
    PUBLISHED: "Publié",
    DRAFT: "Brouillon",
    REVIEW: "En Révision",
    ARCHIVED: "Archivé",
};

export const STATUS_MAP_REVERSE: Record<VideoStatus, string> = {
    "Publié": "PUBLISHED",
    "Brouillon": "DRAFT",
    "En Révision": "REVIEW",
    "Archivé": "ARCHIVED",
};

// ─── Extract video URL from article content ────────────────────────────────────
export function extractVideoUrl(content: ArticleContentBlock[]): string | null {
    const block = content?.find((b) => b.type === "video");
    return block?.url || null;
}

export function hasVideoContent(content: ArticleContentBlock[]): boolean {
  return content?.some((b) => b.type === "video") ?? false;
}

// ─── Map API Article → UI Video shape ─────────────────────────────────────────
export interface UIVideo {
    id: number;
    title: string;
    type: string;
    author: string;
    date: string;
    status: VideoStatus;
    slug: string;
    coverImage?: string;
    excerpt?: string;
    sourceUrl?: string | null;
    categoryColor?: string;
}

export function mapArticleToVideo(article: Article): UIVideo {
    const date = new Date(article.createdAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return {
        id: article.id,
        title: article.title,
        type: article.category?.name || "Reportage",
        author: article.author?.name || "—",
        date,
        status: STATUS_MAP[article.status] ?? "Brouillon",
        slug: article.slug,
        coverImage: article.coverImage,
        excerpt: article.excerpt,
        sourceUrl: extractVideoUrl(article.content),
        categoryColor: article.category?.color,
    };
}