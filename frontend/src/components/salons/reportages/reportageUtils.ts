// src/components/salons/reportages/reportageUtils.ts
export interface Reportage {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  createdAt: string;
  category: { id: number; name: string };
  content: Array<{ type: string; url?: string; value?: string }>;
}

export interface ReportagePagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ReportageApiResponse {
  success: boolean;
  data: Reportage[];
  pagination: ReportagePagination;
}

export interface ReportageFilterState {
  year: string;
  region: string;
  /** Filtre "format" : all | article | video | interview */
  type: string;
}

export const PAGE_SIZE = 12;

export function getContentType(r: Reportage): 'video' | 'article' | 'interview' {
  if (r.content?.some((b) => b.type === 'video')) return 'video';
  if (r.category.name.toLowerCase().includes('interview')) return 'interview';
  return 'article';
}

export function getCategoryStyle(n: string): { background: string } {
  const name = n.toLowerCase();
  if (name.includes('interview')) return { background: 'rgba(42,127,95,0.9)' };
  if (name.includes('video'))     return { background: 'rgba(184,92,56,0.9)' };
  if (name.includes('analyse'))   return { background: 'rgba(0,26,77,0.9)' };
  return { background: 'rgba(26,92,67,0.9)' };
}

/**
 * ✅ Construit les paramètres de requête `/mag/articles` à partir des
 * filtres UI. C'est ici que le "Format" (article/vidéo/interview) et la
 * "Région" prennent effet réellement côté backend (voir article.controller.ts
 * → `types` et `region`).
 *
 * Le filtre `types` est TOUJOURS restreint à ARTICLE/VIDEO (jamais
 * SALON/DESTINATION/PAGE) : c'est ce qui empêche les salons créés dans le
 * back-office d'apparaître à tort dans "Reportages & Comptes-rendus".
 */
export function buildRequestParams(filters: ReportageFilterState, page: number): Record<string, string | number> {
  const params: Record<string, string | number> = {
    pageSize: PAGE_SIZE,
    page,
    status: 'PUBLISHED',
  };

  if (filters.year !== 'all') params.year = filters.year;
  if (filters.region !== 'all') params.region = filters.region;

  switch (filters.type) {
    case 'video':
      params.types = 'VIDEO';
      break;
    case 'interview':
      // Une "interview" est un ARTICLE classé dans la catégorie "interviews".
      params.types = 'ARTICLE';
      params.categorySlug = 'interviews';
      break;
    case 'article':
      params.types = 'ARTICLE';
      break;
    default:
      // 'all' → articles + vidéos uniquement, jamais SALON/DESTINATION/PAGE.
      params.types = 'ARTICLE,VIDEO';
  }

  return params;
}