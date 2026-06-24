// src/hooks/useContentList.ts
/**
 * useContentList.ts
 *
 * Hook générique partagé par ArticlesTab, VideoTable, etc.
 * Encapsule : chargement paginé, debounce de recherche,
 * filtre de statut, et suppression avec gestion de page.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchAdminArticles, deleteArticle, Article, ArticleFilters, STATUS_UI_TO_API, ArticleStatus,} from "@/services/Dashboard/articleservice";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ContentType = "ARTICLE" | "VIDEO" | "PAGE" | "SALON" | "DESTINATION";

interface Pagination {
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface UseContentListOptions {
    type: ContentType;
    itemsPerPage?: number;
    /** Délai de debounce en ms pour la recherche (défaut : 400) */
    searchDelay?: number;
}

interface UseContentListReturn {
    items: Article[];
    pagination: Pagination;
    loading: boolean;
    error: string | null;

    search: string;
    setSearch: (v: string) => void;

    filterStatus: string;
    setFilterStatus: (v: string) => void;

    currentPage: number;
    setCurrentPage: (p: number) => void;

    deletingId: number | null;
    handleDelete: (id: number, confirm?: () => boolean) => Promise<void>;

    reload: () => void;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useContentList({ type, itemsPerPage = 5, searchDelay = 400,}: UseContentListOptions): UseContentListReturn {
    const isFetchingRef = useRef(false);

    const [items, setItems] = useState<Article[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // ── Chargement ─────────────────────────────────────────────────────────────

    const load = useCallback(async () => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);

        try {
        const filters: ArticleFilters = {
            type,
            page: currentPage,
            pageSize: itemsPerPage,
            ...(search.trim() ? { search: search.trim() } : {}),
            ...(filterStatus
            ? { status: STATUS_UI_TO_API[filterStatus] as ArticleStatus }
            : {}),
        };

        const res = await fetchAdminArticles(filters);
        setItems(res.data);
        setPagination(res.pagination);
        } catch (err: unknown) {
        setError((err as Error).message || "Erreur lors du chargement.");
        } finally {
        setLoading(false);
        isFetchingRef.current = false;
        }
    }, [type, currentPage, search, filterStatus, itemsPerPage]);

    // ── Debounce sur la recherche ──────────────────────────────────────────────

    useEffect(() => {
        const timer = setTimeout(() => {
        load();
        }, search ? searchDelay : 0);
        return () => clearTimeout(timer);
    }, [search, load, searchDelay]);

    // ── Suppression ────────────────────────────────────────────────────────────

    const handleDelete = useCallback(
        async (id: number, confirmFn?: () => boolean) => {
        if (confirmFn && !confirmFn()) return;
        setDeletingId(id);
        try {
            await deleteArticle(id);
            const newTotal = pagination.totalItems - 1;
            const newTotalPages = Math.ceil(newTotal / itemsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
            } else {
            await load();
            }
        } catch (err: unknown) {
            throw new Error((err as Error).message || "Impossible de supprimer.");
        } finally {
            setDeletingId(null);
        }
        },
        [pagination.totalItems, currentPage, itemsPerPage, load]
    );

    return {
        items,
        pagination,
        loading,
        error,
        search,
        setSearch,
        filterStatus,
        setFilterStatus,
        currentPage,
        setCurrentPage,
        deletingId,
        handleDelete,
        reload: load,
    };
}