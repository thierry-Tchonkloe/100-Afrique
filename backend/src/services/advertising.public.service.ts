// src/services/advertising.public.service.ts
import { BannerStatus } from "@prisma/client";
import { prisma } from '../config/database';

/**
 * Données renvoyées côté front-office :
 * - Uniquement les zones isEnabled = true
 * - Uniquement les bannières status = ACTIF dans chaque zone
 * - Champs sensibles retirés : publicId, htmlCode, advertisingId
 */
export const advertisingPublicService = {

    async getActiveZones() {
        const zones = await prisma.advertising.findMany({
            where: { isEnabled: true },
            orderBy: { createdAt: "asc" },
            select: {
            id: true,
            name: true,
            slug: true,
            width: true,
            height: true,
            path: true,
            isEnabled: true,
            banners: {
                where: { status: BannerStatus.ACTIF,},
                select: {
                id: true,
                advertiser: true,
                officialWebSite: true,
                description: true,
                campaign: true,
                type: true,
                imageUrl: true,
                htmlCode: true,
                startDate: true,
                endDate: true,
                status: true,
                },
                orderBy: { createdAt: "desc" },
            },
            },
        });

        return zones;
    },

    async getActiveZoneBySlug(slug: string) {
        // FIX : normalisation défensive (espaces, casse) — évite un 404
        // silencieux si le slug transmis par le front diffère légèrement
        // (ex: trailing space, majuscule) de celui stocké en base.
        const normalizedSlug = slug.trim().toLowerCase();

        const zone = await prisma.advertising.findFirst({
        where: { slug: normalizedSlug, isEnabled: true },
        select: {
            id: true,
            name: true,
            slug: true,
            width: true,
            height: true,
            path: true,
            isEnabled: true,
            banners: {
            where: { status: BannerStatus.ACTIF,},
            select: {
                id: true,
                advertiser: true,
                officialWebSite: true,
                description: true,
                campaign: true,
                type: true,
                imageUrl: true,
                htmlCode: true,
                startDate: true,
                endDate: true,
                status: true,
            },
            orderBy: { createdAt: "desc" },
            },
        },
        });

        if (!zone) {
            // Message de diagnostic plus précis en logs serveur (jamais renvoyé
            // tel quel au client) pour distinguer "n'existe pas" de "désactivée".
            const exists = await prisma.advertising.findFirst({ where: { slug: normalizedSlug } });
            console.warn(
                exists
                    ? `[advertisingPublicService] Zone "${normalizedSlug}" existe mais est désactivée (isEnabled=false).`
                    : `[advertisingPublicService] Aucune zone avec le slug "${normalizedSlug}" n'existe en base.`
            );
            throw new Error("Zone introuvable ou désactivée");
        }
        return zone;
    },
};













// // src/services/advertising.public.service.ts
// import { BannerStatus } from "@prisma/client";
// import { prisma } from '../config/database';

// //const prisma = new PrismaClient();

// /**
//  * Données renvoyées côté front-office :
//  * - Uniquement les zones isEnabled = true
//  * - Uniquement les bannières status = ACTIF dans chaque zone
//  * - Champs sensibles retirés : publicId, htmlCode, advertisingId
//  */
// export const advertisingPublicService = {

//     async getActiveZones() {
//         const zones = await prisma.advertising.findMany({
//             where: { isEnabled: true },
//             orderBy: { createdAt: "asc" },
//             select: {
//             id: true,
//             name: true,
//             slug: true,
//             width: true,
//             height: true,
//             path: true,
//             isEnabled: true,
//             banners: {
//                 where: { status: BannerStatus.ACTIF,},
//                 select: {
//                 id: true,
//                 advertiser: true,
//                 officialWebSite: true,
//                 description: true,
//                 campaign: true,
//                 type: true,
//                 imageUrl: true,
//                 htmlCode: true,
//                 startDate: true,
//                 endDate: true,
//                 status: true,
//                 },
//                 orderBy: { createdAt: "desc" },
//             },
//             },
//         });

//         return zones;
//     },

//     async getActiveZoneBySlug(slug: string) {
//         const zone = await prisma.advertising.findUnique({
//         where: { slug, isEnabled: true },
//         select: {
//             id: true,
//             name: true,
//             slug: true,
//             width: true,
//             height: true,
//             path: true,
//             isEnabled: true,
//             banners: {
//             where: { status: BannerStatus.ACTIF,},
//             select: {
//                 id: true,
//                 advertiser: true,
//                 officialWebSite: true,
//                 description: true,
//                 campaign: true,
//                 type: true,
//                 imageUrl: true,
//                 htmlCode: true,
//                 startDate: true,
//                 endDate: true,
//                 status: true,
//             },
//             orderBy: { createdAt: "desc" },
//             },
//         },
//         });

//         if (!zone) throw new Error("Zone introuvable ou désactivée");
//         return zone;
//     },
// };