// src/lib/server-data.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const FETCH_TIMEOUT_MS = 25000;

async function safeFetch<T>(
  path: string,
  params: Record<string, string | number> = {},
  revalidate = 60
): Promise<T | null> {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, String(value))
  );

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`[server-data] ${path} → HTTP ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error(
      `[server-data] ${path} →`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Magazine {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage: string | null;
  source: string;
  publishedAt: string;
  category?: { id: number; name: string; slug: string };
}

export interface VideoArticle {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  createdAt: string;
  excerpt?: string;
  sourceUrl?: string | null;
  content: Array<{ type: string; url?: string; value?: string }>;
  category: { id: number; name: string; slug?: string };
}

export interface Salon {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  city?: string;
  country?: string;
  category?: { id: number; name: string };
}

export interface SalonInterview {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: { name: string };
}

export interface DestinationArticle {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
}

export interface Highlight {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category?: { name: string };
}

export interface SidebarArticle {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  excerpt: string;
  createdAt: string;
  category?: { name: string };
  author?: { name: string };
  readingTime?: string;
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

export async function getHomeMagazines(): Promise<Magazine[]> {
  const json = await safeFetch<{ data?: { magazines?: Magazine[] } }>(
    '/magazines/rss',
    { pageSize: 5, page: 1 },
    60
  );
  return json?.data?.magazines ?? [];
}

export async function getHomeVideos(): Promise<VideoArticle[]> {
  const json = await safeFetch<{ data?: VideoArticle[] }>(
    '/mag/articles',
    { pageSize: 4, page: 1, status: 'PUBLISHED', type: 'VIDEO' },
    120
  );
  return json?.data ?? [];
}

export async function getHomeSalons(): Promise<Salon[]> {
  const json = await safeFetch<{ data?: Salon[] }>(
    '/mag/articles',
    { type: 'SALON', pageSize: 4, page: 1, status: 'PUBLISHED', sortBy: 'startDate:asc' },
    300
  );
  return json?.data ?? [];
}

export async function getHomeDestinations(): Promise<DestinationArticle[]> {
  const json = await safeFetch<{ data?: DestinationArticle[] }>(
    '/destinations/featured',
    { limit: 3 },
    300
  );
  return json?.data ?? [];
}

// ─── Page /actualites ─────────────────────────────────────────────────────────

export async function getNewsHeroMagazines(): Promise<Magazine[]> {
  const json = await safeFetch<{ data?: { magazines?: Magazine[] } }>(
    '/magazines/rss',
    { pageSize: 3, page: 1 },
    60
  );
  return json?.data?.magazines ?? [];
}

export async function getNewsSidebarData(): Promise<{
  analyses: SidebarArticle[];
  interview: SidebarArticle | null;
}> {
  const [analysesJson, interviewJson] = await Promise.all([
    safeFetch<{ data?: SidebarArticle[] }>(
      '/mag/articles',
      { type: 'ARTICLE', categorySlug: 'analyses', pageSize: 4, status: 'PUBLISHED' },
      300
    ),
    safeFetch<{ data?: SidebarArticle[] }>(
      '/mag/articles',
      { type: 'ARTICLE', categorySlug: 'interviews', pageSize: 1, status: 'PUBLISHED' },
      300
    ),
  ]);
  return {
    analyses: analysesJson?.data ?? [],
    interview: interviewJson?.data?.[0] ?? null,
  };
}

// ─── Page /salons ─────────────────────────────────────────────────────────────

export async function getPageSalons(): Promise<Salon[]> {
  const json = await safeFetch<{ data?: Salon[] }>(
    '/mag/articles',
    { type: 'SALON', pageSize: 10, page: 1, status: 'PUBLISHED', sortBy: 'createdAt:asc' },
    300
  );
  return json?.data ?? [];
}

export async function getPageSalonInterview(): Promise<SalonInterview | null> {
  const json = await safeFetch<{ data?: SalonInterview[] }>(
    '/mag/articles',
    { type: 'ARTICLE', categorySlug: 'interviews', featured: 1, pageSize: 1, status: 'PUBLISHED' },
    300
  );
  return json?.data?.[0] ?? null;
}

// ─── Page /destinations ───────────────────────────────────────────────────────

/** Coups de cœur Afrique pour la section AfricaHighlights (revalidate 5 min). */
export async function getAfricaHighlights(): Promise<Highlight[]> {
  const json = await safeFetch<{ data?: Highlight[] } | Highlight[]>(
    '/destinations/featured',
    { limit: 6, region: 'AFRIQUE' },
    300
  );
  // L'API peut retourner { data: [...] } ou directement [...]
  if (Array.isArray(json)) return json;
  return (json as { data?: Highlight[] })?.data ?? [];
}

// ─── Page /videos ─────────────────────────────────────────────────────────────

/** Vidéo featured pour le hero de la page vidéos (revalidate 2 min). */
export async function getFeaturedVideo(): Promise<VideoArticle | null> {
  // Essai 1 : vidéo featured
  const featuredJson = await safeFetch<{ data?: VideoArticle[] }>(
    '/mag/articles',
    { type: 'VIDEO', featured: 1, pageSize: 1, page: 1, status: 'PUBLISHED' },
    120
  );
  if (featuredJson?.data?.[0]) return featuredJson.data[0];

  // Fallback : dernière vidéo publiée
  const fallbackJson = await safeFetch<{ data?: VideoArticle[] }>(
    '/mag/articles',
    { type: 'VIDEO', pageSize: 1, page: 1, status: 'PUBLISHED' },
    120
  );
  return fallbackJson?.data?.[0] ?? null;
}