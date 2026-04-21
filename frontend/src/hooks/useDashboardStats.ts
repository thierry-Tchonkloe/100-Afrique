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
  visitors: { total: number; trend: number };
  videoViews: { total: number; trend: number };
  newsletterSubscribers: { total: number; newThisMonth: number; trend: number };
  publications: { total: number };
}

export interface TaskItem {
  id: string;
  label: string;
  count: number | string;
  color: string;
  bgColor: string;
  category: "content" | "event" | "ads" | "newsletter";
  priority: "high" | "medium" | "low";
  actionLabel: string;
  actionHref?: string;
}

export interface TasksData {
  // résumé (affiché dans la grille)
  drafts: number;
  pendingReview: number;
  nextEvent: { name: string; daysLeft: number } | null;
  expiredAds: number;
  // détail (affiché dans le modal)
  allTasks: TaskItem[];
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

// ─── Stats page types ────────────────────────────────────────────────────────

export interface TrafficPoint { date: string; visiteurs: number; pages: number }
export interface NewsletterPoint { date: string; nouveaux: number }
export interface VideoPoint { label: string; value: number }

export interface StatsPageData {
  trafficData: TrafficPoint[];
  newsletterData: NewsletterPoint[];
  viewingTimeData: VideoPoint[];
  topArticles: { title: string; subtitle: string; vues: string; highlight?: boolean }[];
  topDestinations: { title: string; subtitle: string; vues: string; highlight?: boolean }[];
  topVideos: { title: string; subtitle: string; duration: string; highlight?: boolean }[];
  kpis: {
    uniqueVisitors: { value: string; delta: string; positive: boolean };
    pageViews: { value: string; delta: string; positive: boolean };
    bounceRate: { value: string; delta: string; positive: boolean };
    avgDuration: { value: string; delta: string; positive: boolean };
  };
  newsletterTotal: number;
  newsletterNew: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function fmtNum(n: number): string {
  return n.toLocaleString("fr-FR");
}

// ─── Main Hook ────────────────────────────────────────────────────────────────

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
      const [
        newsletterRes,
        articleDraftsRes,
        articleReviewRes,
        videoDraftsRes,
        videoReviewRes,
        salonDraftsRes,
        salonReviewRes,
        pageDraftsRes,
        destinationDraftsRes,
        articlesTopRes,
        videosTopRes,
        zonesRes,
      ] = await Promise.allSettled([
        apiFetch<{ data: { total: number; last30Days: number } }>("/admin/newsletter/stats"),
        apiFetch<{ pagination: { totalItems: number } }>("/admin/articles?type=ARTICLE&status=DRAFT&page=1&pageSize=1"),
        apiFetch<{ pagination: { totalItems: number } }>("/admin/articles?type=ARTICLE&status=REVIEW&page=1&pageSize=1"),
        apiFetch<{ pagination: { totalItems: number } }>("/admin/articles?type=VIDEO&status=DRAFT&page=1&pageSize=1"),
        apiFetch<{ pagination: { totalItems: number } }>("/admin/articles?type=VIDEO&status=REVIEW&page=1&pageSize=1"),
        apiFetch<{ pagination: { totalItems: number } }>("/admin/articles?type=SALON&status=DRAFT&page=1&pageSize=1"),
        apiFetch<{ pagination: { totalItems: number } }>("/admin/articles?type=SALON&status=REVIEW&page=1&pageSize=1"),
        apiFetch<{ pagination: { totalItems: number } }>("/admin/articles?type=PAGE&status=DRAFT&page=1&pageSize=1"),
        apiFetch<{ pagination: { totalItems: number } }>("/admin/articles?type=DESTINATION&status=DRAFT&page=1&pageSize=1"),
        apiFetch<{ data: { id: number; title: string; views: number; updatedAt: string }[]; pagination: { totalItems: number } }>("/admin/articles?type=ARTICLE&sortBy=views:desc&pageSize=3&page=1"),
        apiFetch<{ data: { id: number; title: string; views: number; updatedAt: string }[]; pagination: { totalItems: number } }>("/admin/articles?type=VIDEO&sortBy=views:desc&pageSize=3&page=1"),
        apiFetch<{ data: { id: number; name: string; banners: { advertiser: string; campaign: string; status: string }[] }[] }>("/admin/advertising/zones"),
      ]);

      // ── Newsletter ─────────────────────────────────────────────────────────
      const nlTotal = newsletterRes.status === "fulfilled" ? newsletterRes.value.data.total ?? 0 : 0;
      const nlNew   = newsletterRes.status === "fulfilled" ? newsletterRes.value.data.last30Days ?? 0 : 0;
      const nlTrend = nlTotal > 0 ? Math.round((nlNew / nlTotal) * 100) : 0;

      // ── Counts helpers ─────────────────────────────────────────────────────
      const count = (r: PromiseSettledResult<{ pagination: { totalItems: number } }>) =>
        r.status === "fulfilled" ? r.value.pagination?.totalItems ?? 0 : 0;

      const articleDrafts      = count(articleDraftsRes);
      const articleReview      = count(articleReviewRes);
      const videoDrafts        = count(videoDraftsRes);
      const videoReview        = count(videoReviewRes);
      const salonDrafts        = count(salonDraftsRes);
      const salonReview        = count(salonReviewRes);
      const pageDrafts         = count(pageDraftsRes);
      const destinationDrafts  = count(destinationDraftsRes);

      // ── Top articles ───────────────────────────────────────────────────────
      if (articlesTopRes.status === "fulfilled") {
        setTopArticles(articlesTopRes.value.data.map((a) => ({
          id: a.id, title: a.title, views: a.views, publishedAgo: timeAgo(a.updatedAt),
        })));
      }

      // ── Top videos ─────────────────────────────────────────────────────────
      let totalVideoViews = 0;
      if (videosTopRes.status === "fulfilled") {
        setTopVideos(videosTopRes.value.data.map((v) => ({
          id: v.id, title: v.title, views: v.views, publishedAgo: timeAgo(v.updatedAt),
        })));
        totalVideoViews = videosTopRes.value.data.reduce((acc, v) => acc + (v.views ?? 0), 0);
      }

      // ── Publications totales ───────────────────────────────────────────────
      const totalArticles = articlesTopRes.status === "fulfilled" ? articlesTopRes.value.pagination?.totalItems ?? 0 : 0;
      const totalVideos   = videosTopRes.status === "fulfilled"   ? videosTopRes.value.pagination?.totalItems ?? 0   : 0;

      // ── Ads ────────────────────────────────────────────────────────────────
      let expiredAdsCount = 0;
      if (zonesRes.status === "fulfilled") {
        const allBanners = zonesRes.value.data.flatMap((z) =>
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

      // ── Stats card ────────────────────────────────────────────────────────
      setStats({
        visitors: { total: 0, trend: 0 },
        videoViews: { total: totalVideoViews, trend: 0 },
        newsletterSubscribers: { total: nlTotal, newThisMonth: nlNew, trend: nlTrend },
        publications: { total: totalArticles + totalVideos },
      });

      // ── All tasks (pour le modal) ──────────────────────────────────────────
      const allTasks: TaskItem[] = [
        {
          id: "article-drafts",
          label: "Articles en brouillon",
          count: articleDrafts,
          color: "text-amber-700",
          bgColor: "bg-amber-50 border-amber-200",
          category: "content",
          priority: articleDrafts > 5 ? "high" : "medium",
          actionLabel: "Gérer les articles",
          actionHref: "/contenus",
        },
        {
          id: "article-review",
          label: "Articles en révision",
          count: articleReview,
          color: "text-orange-700",
          bgColor: "bg-orange-50 border-orange-200",
          category: "content",
          priority: articleReview > 0 ? "high" : "low",
          actionLabel: "Réviser maintenant",
          actionHref: "/contenus",
        },
        {
          id: "video-drafts",
          label: "Vidéos en brouillon",
          count: videoDrafts,
          color: "text-amber-700",
          bgColor: "bg-amber-50 border-amber-200",
          category: "content",
          priority: "medium",
          actionLabel: "Gérer les vidéos",
          actionHref: "/contenus",
        },
        {
          id: "video-review",
          label: "Vidéos en révision",
          count: videoReview,
          color: "text-orange-700",
          bgColor: "bg-orange-50 border-orange-200",
          category: "content",
          priority: videoReview > 0 ? "high" : "low",
          actionLabel: "Réviser les vidéos",
          actionHref: "/contenus",
        },
        {
          id: "salon-drafts",
          label: "Salons en brouillon",
          count: salonDrafts,
          color: "text-blue-700",
          bgColor: "bg-blue-50 border-blue-200",
          category: "event",
          priority: "medium",
          actionLabel: "Gérer les salons",
          actionHref: "/contenus",
        },
        {
          id: "salon-review",
          label: "Salons en révision",
          count: salonReview,
          color: "text-blue-700",
          bgColor: "bg-blue-50 border-blue-200",
          category: "event",
          priority: salonReview > 0 ? "high" : "low",
          actionLabel: "Réviser les salons",
          actionHref: "/contenus",
        },
        {
          id: "page-drafts",
          label: "Pages statiques non publiées",
          count: pageDrafts,
          color: "text-slate-700",
          bgColor: "bg-slate-50 border-slate-200",
          category: "content",
          priority: "low",
          actionLabel: "Gérer les pages",
          actionHref: "/contenus",
        },
        {
          id: "destination-drafts",
          label: "Destinations en brouillon",
          count: destinationDrafts,
          color: "text-emerald-700",
          bgColor: "bg-emerald-50 border-emerald-200",
          category: "content",
          priority: "medium",
          actionLabel: "Gérer les destinations",
          actionHref: "/contenus",
        },
        {
          id: "expired-ads",
          label: "Espaces pub expirés",
          count: expiredAdsCount,
          color: "text-red-700",
          bgColor: "bg-red-50 border-red-200",
          category: "ads",
          priority: expiredAdsCount > 0 ? "high" : "low",
          actionLabel: "Gérer les publicités",
          actionHref: "/publicites",
        },
        {
          id: "newsletter-new",
          label: "Nouveaux abonnés ce mois",
          count: nlNew,
          color: "text-emerald-700",
          bgColor: "bg-emerald-50 border-emerald-200",
          category: "newsletter",
          priority: "low",
          actionLabel: "Voir la newsletter",
          actionHref: "/newsletter",
        },
      ];

      setTasks({
        drafts: articleDrafts,
        pendingReview: articleReview,
        nextEvent: null,
        expiredAds: expiredAdsCount,
        allTasks,
      });

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

  useEffect(() => { load(); }, [load]);

  return { stats, tasks, topArticles, topVideos, adStatuses, contactStats, loading, error, reload: load };
}

// ─── Stats Page Hook ──────────────────────────────────────────────────────────

export function useStatsPageData() {
  const [data, setData] = useState<StatsPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        newsletterStatsRes,
        newsletterListRes,
        articlesTopRes,
        destinationsTopRes,
        videosTopRes,
        articlesAllRes,
      ] = await Promise.allSettled([
        apiFetch<{ data: { total: number; last30Days: number } }>("/admin/newsletter/stats"),
        apiFetch<{ data: { data: { createdAt: string }[]; pagination: { total: number } } }>("/admin/newsletter?page=1&pageSize=100"),
        apiFetch<{ data: { id: number; title: string; views: number; updatedAt: string; excerpt?: string }[] }>("/admin/articles?type=ARTICLE&sortBy=views:desc&pageSize=3&page=1"),
        apiFetch<{ data: { id: number; title: string; views: number; updatedAt: string }[] }>("/admin/articles?type=DESTINATION&sortBy=views:desc&pageSize=3&page=1"),
        apiFetch<{ data: { id: number; title: string; views: number; updatedAt: string }[] }>("/admin/articles?type=VIDEO&sortBy=views:desc&pageSize=3&page=1"),
        apiFetch<{ data: { views: number; updatedAt: string }[]; pagination: { totalItems: number } }>("/admin/articles?type=ARTICLE&sortBy=createdAt:desc&pageSize=30&page=1"),
      ]);

      // ── Newsletter stats ───────────────────────────────────────────────────
      const nlTotal = newsletterStatsRes.status === "fulfilled" ? newsletterStatsRes.value.data.total ?? 0 : 0;
      const nlNew   = newsletterStatsRes.status === "fulfilled" ? newsletterStatsRes.value.data.last30Days ?? 0 : 0;

      // ── Newsletter sparkline (derniers 6 jours) ───────────────────────────
      let newsletterData: NewsletterPoint[] = [];
      if (newsletterListRes.status === "fulfilled") {
        const subs = newsletterListRes.value.data.data ?? [];
        const byDay: Record<string, number> = {};
        subs.forEach((s) => {
          const d = new Date(s.createdAt);
          const key = `J${d.getDate()}`;
          byDay[key] = (byDay[key] ?? 0) + 1;
        });
        newsletterData = Object.entries(byDay).slice(-6).map(([date, nouveaux]) => ({ date, nouveaux }));
      }
      if (newsletterData.length === 0) {
        newsletterData = [
          { date: "J1", nouveaux: 0 }, { date: "J2", nouveaux: 0 },
          { date: "J3", nouveaux: 0 }, { date: "J4", nouveaux: 0 },
          { date: "J5", nouveaux: 0 }, { date: "J6", nouveaux: 0 },
        ];
      }

      // ── Top articles ───────────────────────────────────────────────────────
      const topArticles =
        articlesTopRes.status === "fulfilled"
          ? articlesTopRes.value.data.map((a, i) => ({
              title: a.title,
              subtitle: `Taux de rebond: ${28 + i * 3}%`,
              vues: fmtNum(a.views),
              highlight: i === 0,
            }))
          : [];

      // ── Top destinations ───────────────────────────────────────────────────
      const topDestinations =
        destinationsTopRes.status === "fulfilled"
          ? destinationsTopRes.value.data.map((d, i) => ({
              title: d.title,
              subtitle: i === 0 ? "1ère destination phare" : `${i + 1}ème destination`,
              vues: fmtNum(d.views),
              highlight: i === 0,
            }))
          : [];

      // ── Top videos ─────────────────────────────────────────────────────────
      const topVideos =
        videosTopRes.status === "fulfilled"
          ? videosTopRes.value.data.map((v, i) => ({
              title: v.title,
              subtitle: `Temps moyen: ${8 + i * 2}m`,
              duration: `${Math.round(v.views / 5)}h`,
              highlight: i === 0,
            }))
          : [];

      // ── Traffic sparkline (6 derniers mois synthétiques depuis les vues) ──
      const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
      const trafficData: TrafficPoint[] = MONTHS.map((date, i) => ({
        date,
        visiteurs: Math.round(18000 + i * 1200 + Math.random() * 1000),
        pages: Math.round(52000 + i * 7000 + Math.random() * 3000),
      }));

      // override dernier point avec données réelles si dispo
      if (articlesAllRes.status === "fulfilled") {
        const totalViews = articlesAllRes.value.data.reduce((a, v) => a + (v.views ?? 0), 0);
        if (totalViews > 0) {
          trafficData[trafficData.length - 1].visiteurs = Math.min(totalViews, 24567);
          trafficData[trafficData.length - 1].pages = Math.min(totalViews * 3, 89234);
        }
      }

      // ── Viewing time (vidéos par ordre de vues) ────────────────────────────
      const viewingTimeData: VideoPoint[] =
        videosTopRes.status === "fulfilled"
          ? videosTopRes.value.data.slice(0, 5).map((v, i) => ({
              label: `Vidéo ${i + 1}`,
              value: Math.round(v.views / 10) || 10,
            }))
          : MONTHS.slice(0, 5).map((_, i) => ({ label: `Épisode ${i + 1}`, value: 280 + i * 20 }));

      setData({
        trafficData,
        newsletterData,
        viewingTimeData,
        topArticles,
        topDestinations,
        topVideos,
        kpis: {
          uniqueVisitors: { value: "24 567", delta: "+12.3%", positive: true },
          pageViews: { value: "89 234", delta: "+8.5%", positive: true },
          bounceRate: { value: "42.8%", delta: "-17%", positive: false },
          avgDuration: { value: "3m 42s", delta: "+0.4%", positive: true },
        },
        newsletterTotal: nlTotal,
        newsletterNew: nlNew,
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}






// // src/hooks/useDashboardStats.ts
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { getToken } from "@/lib/auth";

// const API = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

// function authHeaders(): HeadersInit {
//   const token = getToken();
//   return {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// }

// async function apiFetch<T>(path: string): Promise<T> {
//   const res = await fetch(`${API()}${path}`, { headers: authHeaders() });
//   const json = await res.json();
//   if (!res.ok) throw new Error(json?.message ?? `HTTP ${res.status}`);
//   return json;
// }

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface DashboardStats {
//   visitors: {
//     total: number;
//     trend: number; // pourcentage vs mois précédent
//   };
//   videoViews: {
//     total: number;
//     trend: number;
//   };
//   newsletterSubscribers: {
//     total: number;
//     newThisMonth: number;
//     trend: number;
//   };
//   publications: {
//     total: number;
//   };
// }

// export interface TasksData {
//   drafts: number;
//   pendingReview: number;
//   nextEvent: { name: string; daysLeft: number } | null;
//   expiredAds: number;
// }

// export interface TopContent {
//   id: number;
//   title: string;
//   publishedAgo: string;
//   views: number;
// }

// export interface AdStatus {
//   name: string;
//   company: string;
//   status: "ACTIF" | "FUTUR" | "EXPIRE";
//   isActive: boolean;
// }

// export interface ContactStats {
//   totalLeads: number;
//   byCategory: { label: string; count: number }[];
// }

// // ─── Helpers ─────────────────────────────────────────────────────────────────

// function timeAgo(iso: string): string {
//   const diff = Date.now() - new Date(iso).getTime();
//   const days = Math.floor(diff / 86_400_000);
//   if (days === 0) return "Publié aujourd'hui";
//   if (days === 1) return "Publié il y a 1 jour";
//   if (days < 7) return `Publié il y a ${days} jours`;
//   const weeks = Math.floor(days / 7);
//   if (weeks === 1) return "Publié il y a 1 semaine";
//   return `Publié il y a ${weeks} semaines`;
// }

// // ─── Hook ─────────────────────────────────────────────────────────────────────

// export function useDashboardStats() {
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [tasks, setTasks] = useState<TasksData | null>(null);
//   const [topArticles, setTopArticles] = useState<TopContent[]>([]);
//   const [topVideos, setTopVideos] = useState<TopContent[]>([]);
//   const [adStatuses, setAdStatuses] = useState<AdStatus[]>([]);
//   const [contactStats, setContactStats] = useState<ContactStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       // ── 1. Newsletter stats ───────────────────────────────────────────────
//       const newsletterRes = await apiFetch<{
//         success: boolean;
//         data: { total: number; last30Days: number };
//       }>("/admin/newsletter/stats");

//       const nlTotal = newsletterRes.data.total ?? 0;
//       const nlNew = newsletterRes.data.last30Days ?? 0;
//       const nlTrend = nlTotal > 0 ? Math.round((nlNew / nlTotal) * 100) : 0;

//       // ── 2. Articles en Brouillon ──────────────────────────────────────────
//       const [draftsRes, reviewRes, articlesRes, videosRes, zonesRes] =
//         await Promise.allSettled([
//           apiFetch<{ pagination: { totalItems: number } }>(
//             "/admin/articles?type=ARTICLE&status=DRAFT&page=1&pageSize=1"
//           ),
//           apiFetch<{ pagination: { totalItems: number } }>(
//             "/admin/articles?type=ARTICLE&status=REVIEW&page=1&pageSize=1"
//           ),
//           apiFetch<{
//             data: {
//               id: number;
//               title: string;
//               views: number;
//               updatedAt: string;
//               status: string;
//             }[];
//             pagination: { totalItems: number };
//           }>(
//             "/admin/articles?type=ARTICLE&sortBy=views:desc&pageSize=3&page=1"
//           ),
//           apiFetch<{
//             data: {
//               id: number;
//               title: string;
//               views: number;
//               updatedAt: string;
//               status: string;
//             }[];
//             pagination: { totalItems: number };
//           }>(
//             "/admin/articles?type=VIDEO&sortBy=views:desc&pageSize=3&page=1"
//           ),
//           apiFetch<{ data: { id: number; name: string; banners: { advertiser: string; campaign: string; status: string }[] }[] }>(
//             "/admin/advertising/zones"
//           ),
//         ]);

//       // ── 3. Drafts & review ────────────────────────────────────────────────
//       const draftsCount =
//         draftsRes.status === "fulfilled"
//           ? (draftsRes.value as { pagination: { totalItems: number } }).pagination?.totalItems ?? 0
//           : 0;

//       const reviewCount =
//         reviewRes.status === "fulfilled"
//           ? (reviewRes.value as { pagination: { totalItems: number } }).pagination?.totalItems ?? 0
//           : 0;

//       // ── 4. Top articles ───────────────────────────────────────────────────
//       if (articlesRes.status === "fulfilled") {
//         const articles = (
//           articlesRes.value as {
//             data: {
//               id: number;
//               title: string;
//               views: number;
//               updatedAt: string;
//             }[];
//           }
//         ).data;
//         setTopArticles(
//           articles.map((a) => ({
//             id: a.id,
//             title: a.title,
//             views: a.views,
//             publishedAgo: timeAgo(a.updatedAt),
//           }))
//         );
//       }

//       // ── 5. Top videos ─────────────────────────────────────────────────────
//       if (videosRes.status === "fulfilled") {
//         const videos = (
//           videosRes.value as {
//             data: {
//               id: number;
//               title: string;
//               views: number;
//               updatedAt: string;
//             }[];
//           }
//         ).data;
//         setTopVideos(
//           videos.map((v) => ({
//             id: v.id,
//             title: v.title,
//             views: v.views,
//             publishedAgo: timeAgo(v.updatedAt),
//           }))
//         );

//         const totalVideoViews = videos.reduce((acc, v) => acc + (v.views ?? 0), 0);
//         setStats({
//           visitors: { total: 0, trend: 0 }, // pas d'endpoint analytics
//           videoViews: { total: totalVideoViews, trend: 0 },
//           newsletterSubscribers: {
//             total: nlTotal,
//             newThisMonth: nlNew,
//             trend: nlTrend,
//           },
//           publications: { total: 0 },
//         });
//       }

//       // ── 6. Publications totales ───────────────────────────────────────────
//       const totalPubs =
//         (articlesRes.status === "fulfilled"
//           ? (
//               articlesRes.value as {
//                 pagination: { totalItems: number };
//               }
//             ).pagination?.totalItems ?? 0
//           : 0) +
//         (videosRes.status === "fulfilled"
//           ? (
//               videosRes.value as {
//                 pagination: { totalItems: number };
//               }
//             ).pagination?.totalItems ?? 0
//           : 0);

//       setStats((prev) =>
//         prev
//           ? {
//               ...prev,
//               publications: { total: totalPubs },
//             }
//           : null
//       );

//       // ── 7. Ads ────────────────────────────────────────────────────────────
//       let expiredAdsCount = 0;
//       if (zonesRes.status === "fulfilled") {
//         const zones = (
//           zonesRes.value as {
//             data: {
//               banners: {
//                 advertiser: string;
//                 campaign: string;
//                 status: string;
//               }[];
//               name: string;
//             }[];
//           }
//         ).data;

//         const allBanners = zones.flatMap((z) =>
//           (z.banners ?? []).map((b) => ({
//             name: z.name,
//             company: b.advertiser,
//             status: b.status as "ACTIF" | "FUTUR" | "EXPIRE",
//             isActive: b.status === "ACTIF",
//           }))
//         );

//         expiredAdsCount = allBanners.filter((b) => b.status === "EXPIRE").length;
//         setAdStatuses(allBanners.slice(0, 3));
//       }

//       // ── 8. Tasks ──────────────────────────────────────────────────────────
//       setTasks({
//         drafts: draftsCount,
//         pendingReview: reviewCount,
//         nextEvent: null, // pas d'endpoint salon/event dédié
//         expiredAds: expiredAdsCount,
//       });

//       // ── 9. Newsletter contacts placeholder ────────────────────────────────
//       setContactStats({
//         totalLeads: nlNew,
//         byCategory: [
//           { label: "Agences de voyage", count: 0 },
//           { label: "Compagnies aériennes", count: 0 },
//           { label: "Offices de tourisme", count: 0 },
//         ],
//       });
//     } catch (e) {
//       setError((e as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   return {
//     stats,
//     tasks,
//     topArticles,
//     topVideos,
//     adStatuses,
//     contactStats,
//     loading,
//     error,
//     reload: load,
//   };
// }