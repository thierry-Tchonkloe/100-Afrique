// // src/services/advertising.service.ts

// //import { getToken } from "@/lib/auth";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// // ─── Types ─────────────────────────────────────────────

// export interface Banner {
//     id: number;
//     advertiser: string;
//     campaign: string;
//     type: string;
//     imageUrl: string | null;
//     htmlCode: string | null;
//     startDate: string;
//     endDate: string;
//     status: string;
// }

// export interface AdvertisingZone {
//     id: number;
//     name: string;
//     slug: string;
//     width: number;
//     height: number;
//     path: string;
//     isEnabled: boolean;
//     banners: Banner[];
// }

// // ─── Helper ────────────────────────────────────────────

// // function getHeaders(): HeadersInit {
// //     const token = getToken();

// //     return {
// //         "Content-Type": "application/json",
// //         ...(token ? { Authorization: `Bearer ${token}` } : {}),
// //     };
// // }

// async function handleResponse<T>(res: Response): Promise<T> {
//     const text = await res.text();

//     try {
//         const json = JSON.parse(text);

//         if (!res.ok) {
//         throw new Error(json?.message || "Erreur serveur");
//         }

//         return json.data;
//     } catch {
//         throw new Error("Réponse serveur invalide");
//     }
// }


// /**
//  * Récupère toutes les zones publicitaires actives
//  */

// export async function fetchActiveZones(): Promise<AdvertisingZone[]> {
//     const res = await fetch(`${BASE_URL}/advertising`, {
//         method: "GET",
//     });
//     return handleResponse<AdvertisingZone[]>(res);
// }



// /**
//  * Récupère une zone publicitaire par son slug
//  */

// export async function fetchZoneBySlug(slug: string): Promise<AdvertisingZone> {
//     const res = await fetch(`${BASE_URL}/advertising/${slug}`, {
//         method: "GET",
//     });
//     return handleResponse<AdvertisingZone>(res);
// }



// src/services/advertising.service.ts
 
//import { getToken } from "@/lib/auth";
 
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
 
// ─── Types ─────────────────────────────────────────────
 
export interface Banner {
    id: number;
    advertiser: string;
    campaign: string;
    type: string;
    imageUrl: string | null;
    htmlCode: string | null;
    startDate: string;
    endDate: string;
    status: string;
}
 
export interface AdvertisingZone {
    id: number;
    name: string;
    slug: string;
    width: number;
    height: number;
    path: string;
    isEnabled: boolean;
    banners: Banner[];
}
 
// ─── Helper ────────────────────────────────────────────
 
// function getHeaders(): HeadersInit {
//     const token = getToken();
 
//     return {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     };
// }
 
async function handleResponse<T>(res: Response): Promise<T> {
    const text = await res.text();
 
    try {
        const json = JSON.parse(text);
 
        if (!res.ok) {
        throw new Error(json?.message || "Erreur serveur");
        }
 
        return json.data;
    } catch {
        throw new Error("Réponse serveur invalide");
    }
}
 
 
/**
* Récupère toutes les zones publicitaires actives
*/
 
export async function fetchActiveZones(): Promise<AdvertisingZone[]> {
    const res = await fetch(`${BASE_URL}/advertising`, {
        method: "GET",
    });
    return handleResponse<AdvertisingZone[]>(res);
}
 
 
 
/**
* Récupère une zone publicitaire par son slug
*/
 
export async function fetchZoneBySlug(slug: string): Promise<AdvertisingZone> {
    const res = await fetch(`${BASE_URL}/advertising/${slug}`, {
        method: "GET",
    });
    return handleResponse<AdvertisingZone>(res);
}