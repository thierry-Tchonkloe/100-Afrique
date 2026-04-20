// src/hooks/useDashboardStats.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { getToken } from "@/lib/auth";

const API = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API()}${path}`, { headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message ?? `HTTP ${res.status}`);
  return json;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  visitors: {
    total: number;
    trend: number; // pourcentage vs mois précédent
  };
  videoViews: {
    total: number;
    trend: number;
  };
  newsletterSubscribers: {
    total: number;
    newThisMonth: number;
    trend: number;
  };
  publications: {
    total: number;
  };
}

export interface TasksData {
  drafts: number;
  pendingReview: number;
  nextEvent: { name: string; daysLeft: number } | null;
  expiredAds: number;
}

export interface TopContent {
  id: number;
  title: string;
  publishedAgo: string;
  views: number;
}

export interface AdStatus {
  name: string;
  company: string;
  status: "ACTIF" | "FUTUR" | "EXPIRE";
  isActive: boolean;
}

export interface ContactStats {
  totalLeads: number;
  byCategory: { label: string; count: number }[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Publié aujourd'hui";
  if (days === 1) return "Publié il y a 1 jour";
  if (days < 7) return `Publié il y a ${days} jours`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "Publié il y a 1 semaine";
  return `Publié il y a ${weeks} semaines`;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tasks, setTasks] = useState<TasksData | null>(null);
  const [topArticles, setTopArticles] = useState<TopContent[]>([]);
  const [topVideos, setTopVideos] = useState<TopContent[]>([]);
  const [adStatuses, setAdStatuses] = useState<AdStatus[]>([]);
  const [contactStats, setContactStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // ── 1. Newsletter stats ───────────────────────────────────────────────
      const newsletterRes = await apiFetch<{
        success: boolean;
        data: { total: number; last30Days: number };
      }>("/admin/newsletter/stats");

      const nlTotal = newsletterRes.data.total ?? 0;
      const nlNew = newsletterRes.data.last30Days ?? 0;
      const nlTrend = nlTotal > 0 ? Math.round((nlNew / nlTotal) * 100) : 0;

      // ── 2. Articles en Brouillon ──────────────────────────────────────────
      const [draftsRes, reviewRes, articlesRes, videosRes, zonesRes] =
        await Promise.allSettled([
          apiFetch<{ pagination: { totalItems: number } }>(
            "/admin/articles?type=ARTICLE&status=DRAFT&page=1&pageSize=1"
          ),
          apiFetch<{ pagination: { totalItems: number } }>(
            "/admin/articles?type=ARTICLE&status=REVIEW&page=1&pageSize=1"
          ),
          apiFetch<{
            data: {
              id: number;
              title: string;
              views: number;
              updatedAt: string;
              status: string;
            }[];
            pagination: { totalItems: number };
          }>(
            "/admin/articles?type=ARTICLE&sortBy=views:desc&pageSize=3&page=1"
          ),
          apiFetch<{
            data: {
              id: number;
              title: string;
              views: number;
              updatedAt: string;
              status: string;
            }[];
            pagination: { totalItems: number };
          }>(
            "/admin/articles?type=VIDEO&sortBy=views:desc&pageSize=3&page=1"
          ),
          apiFetch<{ data: { id: number; name: string; banners: { advertiser: string; campaign: string; status: string }[] }[] }>(
            "/admin/advertising/zones"
          ),
        ]);

      // ── 3. Drafts & review ────────────────────────────────────────────────
      const draftsCount =
        draftsRes.status === "fulfilled"
          ? (draftsRes.value as { pagination: { totalItems: number } }).pagination?.totalItems ?? 0
          : 0;

      const reviewCount =
        reviewRes.status === "fulfilled"
          ? (reviewRes.value as { pagination: { totalItems: number } }).pagination?.totalItems ?? 0
          : 0;

      // ── 4. Top articles ───────────────────────────────────────────────────
      if (articlesRes.status === "fulfilled") {
        const articles = (
          articlesRes.value as {
            data: {
              id: number;
              title: string;
              views: number;
              updatedAt: string;
            }[];
          }
        ).data;
        setTopArticles(
          articles.map((a) => ({
            id: a.id,
            title: a.title,
            views: a.views,
            publishedAgo: timeAgo(a.updatedAt),
          }))
        );
      }

      // ── 5. Top videos ─────────────────────────────────────────────────────
      if (videosRes.status === "fulfilled") {
        const videos = (
          videosRes.value as {
            data: {
              id: number;
              title: string;
              views: number;
              updatedAt: string;
            }[];
          }
        ).data;
        setTopVideos(
          videos.map((v) => ({
            id: v.id,
            title: v.title,
            views: v.views,
            publishedAgo: timeAgo(v.updatedAt),
          }))
        );

        const totalVideoViews = videos.reduce((acc, v) => acc + (v.views ?? 0), 0);
        setStats({
          visitors: { total: 0, trend: 0 }, // pas d'endpoint analytics
          videoViews: { total: totalVideoViews, trend: 0 },
          newsletterSubscribers: {
            total: nlTotal,
            newThisMonth: nlNew,
            trend: nlTrend,
          },
          publications: { total: 0 },
        });
      }

      // ── 6. Publications totales ───────────────────────────────────────────
      const totalPubs =
        (articlesRes.status === "fulfilled"
          ? (
              articlesRes.value as {
                pagination: { totalItems: number };
              }
            ).pagination?.totalItems ?? 0
          : 0) +
        (videosRes.status === "fulfilled"
          ? (
              videosRes.value as {
                pagination: { totalItems: number };
              }
            ).pagination?.totalItems ?? 0
          : 0);

      setStats((prev) =>
        prev
          ? {
              ...prev,
              publications: { total: totalPubs },
            }
          : null
      );

      // ── 7. Ads ────────────────────────────────────────────────────────────
      let expiredAdsCount = 0;
      if (zonesRes.status === "fulfilled") {
        const zones = (
          zonesRes.value as {
            data: {
              banners: {
                advertiser: string;
                campaign: string;
                status: string;
              }[];
              name: string;
            }[];
          }
        ).data;

        const allBanners = zones.flatMap((z) =>
          (z.banners ?? []).map((b) => ({
            name: z.name,
            company: b.advertiser,
            status: b.status as "ACTIF" | "FUTUR" | "EXPIRE",
            isActive: b.status === "ACTIF",
          }))
        );

        expiredAdsCount = allBanners.filter((b) => b.status === "EXPIRE").length;
        setAdStatuses(allBanners.slice(0, 3));
      }

      // ── 8. Tasks ──────────────────────────────────────────────────────────
      setTasks({
        drafts: draftsCount,
        pendingReview: reviewCount,
        nextEvent: null, // pas d'endpoint salon/event dédié
        expiredAds: expiredAdsCount,
      });

      // ── 9. Newsletter contacts placeholder ────────────────────────────────
      setContactStats({
        totalLeads: nlNew,
        byCategory: [
          { label: "Agences de voyage", count: 0 },
          { label: "Compagnies aériennes", count: 0 },
          { label: "Offices de tourisme", count: 0 },
        ],
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    stats,
    tasks,
    topArticles,
    topVideos,
    adStatuses,
    contactStats,
    loading,
    error,
    reload: load,
  };
}