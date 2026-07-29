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

// ─── Helper : borne "à partir d'aujourd'hui" pour l'agenda ────────────────────
// ✅ NOUVEAU — utilisé par getHomeSalons() et getPageSalons() pour ne
// remonter que les événements à venir (ou en cours aujourd'hui), triés
// chronologiquement du plus proche au plus lointain.
//
// Sans ce filtre, un tri `startDate:asc` remonte en premier les
// événements les plus ANCIENS (y compris ceux déjà terminés depuis
// longtemps), ce qui donnait l'impression d'un ordre incohérent sur la
// page d'accueil : un nouvel événement à venir dans 2 mois se
// retrouvait après un vieux salon passé depuis un an, simplement parce
// que sa date est numériquement plus grande.
//
// On prend le début de la journée (minuit) plutôt que l'heure exacte,
// pour ne pas faire disparaître un événement dont l'heure de début est
// déjà passée aujourd'hui mais dont la journée n'est pas terminée.
function startOfTodayISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
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
  // ✅ CORRIGÉ — ajout de `startDateFrom` (début de journée courante) pour
  // ne récupérer que les événements à venir (ou en cours aujourd'hui),
  // triés du plus proche au plus lointain (`startDate:asc`). Auparavant,
  // sans borne basse, le tri ascendant remontait les événements les plus
  // anciens en premier — d'où l'ordre "incohérent" observé dans
  // SalonCard / EventsDestinationsSection sur la page d'accueil.
  const json = await safeFetch<{ data?: Salon[] }>(
    '/mag/articles',
    {
      type: 'SALON',
      pageSize: 4,
      page: 1,
      status: 'PUBLISHED',
      sortBy: 'startDate:asc',
      startDateFrom: startOfTodayISO(),
    },
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
  // ✅ CORRIGÉ — deux bugs distincts corrigés ici :
  //
  // 1. Le tri était `createdAt:asc` (date de CRÉATION de la fiche) au
  //    lieu de `startDate:asc` (date de l'ÉVÉNEMENT). Un agenda doit être
  //    trié chronologiquement par date d'événement, jamais par date de
  //    création en base.
  //
  // 2. Combiné à `pageSize: 10` et un tri ascendant sur `createdAt`, les
  //    salons les PLUS RÉCEMMENT CRÉÉS se retrouvaient toujours en toute
  //    fin de liste. Dès qu'il existait déjà 10 salons plus anciens en
  //    base, les nouveaux salons créés n'étaient TOUT SIMPLEMENT JAMAIS
  //    renvoyés par cette requête — d'où leur absence totale dans
  //    AgendaSection (page /salons).
  //
  // Le correctif : trier par `startDate:asc` (chronologique), ne garder
  // que les événements à venir via `startDateFrom`, et fixer un
  // `pageSize` généreux (50, plafond du backend — voir
  // config.pagination.maxPageSize) puisque AgendaSection paginate déjà
  // côté client sur la liste complète reçue.
  const json = await safeFetch<{ data?: Salon[] }>(
    '/mag/articles',
    {
      type: 'SALON',
      pageSize: 50,
      page: 1,
      status: 'PUBLISHED',
      sortBy: 'startDate:asc',
      startDateFrom: startOfTodayISO(),
    },
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














// // src/lib/server-data.ts
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// const FETCH_TIMEOUT_MS = 25000;

// async function safeFetch<T>(
//   path: string,
//   params: Record<string, string | number> = {},
//   revalidate = 60
// ): Promise<T | null> {
//   const url = new URL(`${API_BASE_URL}${path}`);
//   Object.entries(params).forEach(([key, value]) =>
//     url.searchParams.set(key, String(value))
//   );

//   try {
//     const res = await fetch(url.toString(), {
//       next: { revalidate },
//       signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
//     });
//     if (!res.ok) {
//       console.error(`[server-data] ${path} → HTTP ${res.status}`);
//       return null;
//     }
//     return (await res.json()) as T;
//   } catch (error) {
//     console.error(
//       `[server-data] ${path} →`,
//       error instanceof Error ? error.message : error
//     );
//     return null;
//   }
// }

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface Magazine {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt?: string | null;
//   coverImage: string | null;
//   source: string;
//   publishedAt: string;
//   category?: { id: number; name: string; slug: string };
// }

// export interface VideoArticle {
//   id: number;
//   title: string;
//   slug: string;
//   coverImage: string;
//   createdAt: string;
//   excerpt?: string;
//   sourceUrl?: string | null;
//   content: Array<{ type: string; url?: string; value?: string }>;
//   category: { id: number; name: string; slug?: string };
// }

// export interface Salon {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   coverImage: string;
//   createdAt: string;
//   startDate?: string;
//   endDate?: string;
//   location?: string;
//   city?: string;
//   country?: string;
//   category?: { id: number; name: string };
// }

// export interface SalonInterview {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   coverImage: string;
//   author: { name: string };
// }

// export interface DestinationArticle {
//   id: number;
//   title: string;
//   slug: string;
//   coverImage: string;
// }

// export interface Highlight {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   coverImage: string;
//   category?: { name: string };
// }

// export interface SidebarArticle {
//   id: string;
//   slug: string;
//   title: string;
//   coverImage: string;
//   excerpt: string;
//   createdAt: string;
//   category?: { name: string };
//   author?: { name: string };
//   readingTime?: string;
// }

// // ─── Homepage ─────────────────────────────────────────────────────────────────

// export async function getHomeMagazines(): Promise<Magazine[]> {
//   const json = await safeFetch<{ data?: { magazines?: Magazine[] } }>(
//     '/magazines/rss',
//     { pageSize: 5, page: 1 },
//     60
//   );
//   return json?.data?.magazines ?? [];
// }

// export async function getHomeVideos(): Promise<VideoArticle[]> {
//   const json = await safeFetch<{ data?: VideoArticle[] }>(
//     '/mag/articles',
//     { pageSize: 4, page: 1, status: 'PUBLISHED', type: 'VIDEO' },
//     120
//   );
//   return json?.data ?? [];
// }

// export async function getHomeSalons(): Promise<Salon[]> {
//   const json = await safeFetch<{ data?: Salon[] }>(
//     '/mag/articles',
//     { type: 'SALON', pageSize: 4, page: 1, status: 'PUBLISHED', sortBy: 'startDate:asc' },
//     300
//   );
//   return json?.data ?? [];
// }

// export async function getHomeDestinations(): Promise<DestinationArticle[]> {
//   const json = await safeFetch<{ data?: DestinationArticle[] }>(
//     '/destinations/featured',
//     { limit: 3 },
//     300
//   );
//   return json?.data ?? [];
// }

// // ─── Page /actualites ─────────────────────────────────────────────────────────

// export async function getNewsHeroMagazines(): Promise<Magazine[]> {
//   const json = await safeFetch<{ data?: { magazines?: Magazine[] } }>(
//     '/magazines/rss',
//     { pageSize: 3, page: 1 },
//     60
//   );
//   return json?.data?.magazines ?? [];
// }

// export async function getNewsSidebarData(): Promise<{
//   analyses: SidebarArticle[];
//   interview: SidebarArticle | null;
// }> {
//   const [analysesJson, interviewJson] = await Promise.all([
//     safeFetch<{ data?: SidebarArticle[] }>(
//       '/mag/articles',
//       { type: 'ARTICLE', categorySlug: 'analyses', pageSize: 4, status: 'PUBLISHED' },
//       300
//     ),
//     safeFetch<{ data?: SidebarArticle[] }>(
//       '/mag/articles',
//       { type: 'ARTICLE', categorySlug: 'interviews', pageSize: 1, status: 'PUBLISHED' },
//       300
//     ),
//   ]);
//   return {
//     analyses: analysesJson?.data ?? [],
//     interview: interviewJson?.data?.[0] ?? null,
//   };
// }

// // ─── Page /salons ─────────────────────────────────────────────────────────────

// export async function getPageSalons(): Promise<Salon[]> {
//   const json = await safeFetch<{ data?: Salon[] }>(
//     '/mag/articles',
//     { type: 'SALON', pageSize: 10, page: 1, status: 'PUBLISHED', sortBy: 'createdAt:asc' },
//     300
//   );
//   return json?.data ?? [];
// }

// export async function getPageSalonInterview(): Promise<SalonInterview | null> {
//   const json = await safeFetch<{ data?: SalonInterview[] }>(
//     '/mag/articles',
//     { type: 'ARTICLE', categorySlug: 'interviews', featured: 1, pageSize: 1, status: 'PUBLISHED' },
//     300
//   );
//   return json?.data?.[0] ?? null;
// }

// // ─── Page /destinations ───────────────────────────────────────────────────────

// /** Coups de cœur Afrique pour la section AfricaHighlights (revalidate 5 min). */
// export async function getAfricaHighlights(): Promise<Highlight[]> {
//   const json = await safeFetch<{ data?: Highlight[] } | Highlight[]>(
//     '/destinations/featured',
//     { limit: 6, region: 'AFRIQUE' },
//     300
//   );
//   // L'API peut retourner { data: [...] } ou directement [...]
//   if (Array.isArray(json)) return json;
//   return (json as { data?: Highlight[] })?.data ?? [];
// }

// // ─── Page /videos ─────────────────────────────────────────────────────────────

// /** Vidéo featured pour le hero de la page vidéos (revalidate 2 min). */
// export async function getFeaturedVideo(): Promise<VideoArticle | null> {
//   // Essai 1 : vidéo featured
//   const featuredJson = await safeFetch<{ data?: VideoArticle[] }>(
//     '/mag/articles',
//     { type: 'VIDEO', featured: 1, pageSize: 1, page: 1, status: 'PUBLISHED' },
//     120
//   );
//   if (featuredJson?.data?.[0]) return featuredJson.data[0];

//   // Fallback : dernière vidéo publiée
//   const fallbackJson = await safeFetch<{ data?: VideoArticle[] }>(
//     '/mag/articles',
//     { type: 'VIDEO', pageSize: 1, page: 1, status: 'PUBLISHED' },
//     120
//   );
//   return fallbackJson?.data?.[0] ?? null;
// }