// // src/services/Dashboard/magazineService.ts
// import { getToken } from "@/lib/auth";
// const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
 
// interface Magazine {
//   id: number;
//   title: string;
//   slug: string;
//   url: string;
//   excerpt: string | null;
//   content: string | null;
//   coverImage: string | null;
//   publishedAt: string;
//   source: string;
//   author?: string | null;
//   categoryId: number;
//   status: string;
//   featured: boolean;
//   createdAt: string;
//   updatedAt: string;
//   category?: any;
//   readOnlineUrl?: string;
//   previewUrl?: string;
//   downloadUrl?: string;
//   shareUrl?: string;
// }
 
// interface MagazinePagination {
//   page: number;
//   pageSize: number;
//   total: number;
//   totalPages: number;
//   hasNextPage: boolean;
//   hasPrevPage: boolean;
// }
 
// interface MagazineListResponse {
//   success: boolean;
//   message: string;
//   data: {
//     magazines: Magazine[];
//     pagination: MagazinePagination;
//     filters: any;
//   };
// }
 
// interface MagazineDetailResponse {
//   success: boolean;
//   data: Magazine;
// }
 
// interface RSSSource {
//   name: string;
//   count: number;
// }
 
// function getAuthHeaders(): HeadersInit {
//   const token = getToken();
//   return {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// }
 
// async function handleResponse<T>(res: Response): Promise<T> {
//   const text = await res.text();
//   try {
//     const json = JSON.parse(text);
//     if (!res.ok) {
//       throw new Error(json?.message || `Erreur HTTP ${res.status}`);
//     }
//     return json as T;
//   } catch {
//     throw new Error("Réponse serveur invalide");
//   }
// }
 
// export async function fetchMagazines(filters: {
//   page?: number;
//   pageSize?: number;
//   search?: string;
//   source?: string;
//   category?: string;
//   sortBy?: string;
//   sortOrder?: string;
// } = {}): Promise<MagazineListResponse> {
//   const params = new URLSearchParams();
  
//   if (filters.page) params.set("page", String(filters.page));
//   if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
//   if (filters.search) params.set("search", filters.search);
//   if (filters.source) params.set("source", filters.source);
//   if (filters.sortBy) params.set("sortBy", filters.sortBy);
//   if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
 
//   const res = await fetch(
//     `${BASE_URL}/magazines/rss?${params.toString()}`,
//     { headers: getAuthHeaders() }
//   );
 
//   return handleResponse<MagazineListResponse>(res);
// }
 
// export async function fetchMagazineById(id: number): Promise<MagazineDetailResponse> {
//   const res = await fetch(`${BASE_URL}/magazines/rss/${id}`, {
//     headers: getAuthHeaders(),
//   });
//   return handleResponse<MagazineDetailResponse>(res);
// }
 
// export async function fetchRSSSources(): Promise<{ success: boolean; data: RSSSource[] }> {
//   const res = await fetch(`${BASE_URL}/magazines/rss/sources/list`, {
//     headers: getAuthHeaders(),
//   });
//   return handleResponse<{ success: boolean; data: RSSSource[] }>(res);
// }









// src/services/Dashboard/magazineService.ts
import { getToken } from "@/lib/auth";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
 
export interface Magazine {
  id: number;
  title: string;
  slug: string;
  url: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  publishedAt: string;
  source: string;
  author?: string | null;
  categoryId: number;
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  category?: any;
  readOnlineUrl?: string;
  previewUrl?: string;
  downloadUrl?: string;
  shareUrl?: string;
  embedUrl?: string;
  relatedMagazines?: Magazine[];
}
 
interface MagazinePagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
 
interface MagazineListResponse {
  success: boolean;
  message: string;
  data: {
    magazines: Magazine[];
    pagination: MagazinePagination;
    filters: any;
  };
}
 
interface MagazineDetailResponse {
  success: boolean;
  data: Magazine;
}
 
interface RSSSource {
  name: string;
  count: number;
}
 
function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
 
async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (!res.ok) {
      throw new Error(json?.message || `Erreur HTTP ${res.status}`);
    }
    return json as T;
  } catch {
    throw new Error("Réponse serveur invalide");
  }
}
 
export async function fetchMagazines(filters: {
  page?: number;
  pageSize?: number;
  search?: string;
  source?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: string;
} = {}): Promise<MagazineListResponse> {
  const params = new URLSearchParams();
  
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  if (filters.search) params.set("search", filters.search);
  if (filters.source) params.set("source", filters.source);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
 
  const res = await fetch(
    `${BASE_URL}/magazines/rss?${params.toString()}`,
    { headers: getAuthHeaders() }
  );
 
  return handleResponse<MagazineListResponse>(res);
}
 
export async function fetchMagazineById(id: number): Promise<MagazineDetailResponse> {
  const res = await fetch(`${BASE_URL}/magazines/rss/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<MagazineDetailResponse>(res);
}

export async function fetchMagazineBySlug(slug: string): Promise<MagazineDetailResponse> {
  const res = await fetch(`${BASE_URL}/magazines/rss/slug/${slug}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<MagazineDetailResponse>(res);
}
 
export async function fetchRSSSources(): Promise<{ success: boolean; data: RSSSource[] }> {
  const res = await fetch(`${BASE_URL}/magazines/rss/sources/list`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<{ success: boolean; data: RSSSource[] }>(res);
}
 
