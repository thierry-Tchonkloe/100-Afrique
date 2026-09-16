// src/services/admin/advertising.service.ts
import { BannerStatus } from "@prisma/client";
import slugify from "slugify";
import cloudinary from "../../config/cloudinary"; // ✅ instance unique et déjà configurée
import {
    CreateAdZoneInput,
    UpdateAdZoneInput,
    CreateBannerInput,
    UpdateBannerInput,
    UpsertThirdPartyCodeInput,
} from "../../validators/advertising.schema";

import { prisma } from '../../config/database';

// ─── Cloudinary ───────────────────────────────────────────────────────────────
// ⚠️ Ne PAS reconfigurer cloudinary.config(...) ici : c'est déjà fait une seule
// fois dans src/config/cloudinary.ts. Une double configuration est une source
// de divergence si l'un des deux fichiers change sans l'autre.

async function uploadToCloudinary(
    buffer: Buffer,
    originalName: string
): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
        {
            folder: "ad-banners",
            public_id: `banner_${Date.now()}_${slugify(originalName, { lower: true })}`,
            resource_type: "image",
        },
        (err, result) => {
            if (err || !result) return reject(err ?? new Error("Upload échoué"));
            resolve({ url: result.secure_url, publicId: result.public_id });
        }
        );
        uploadStream.end(buffer);
    });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeStatus(startDate: Date, endDate: Date): BannerStatus {
    const now = new Date();
    if (now < startDate) return BannerStatus.FUTUR;
    if (now > endDate) return BannerStatus.EXPIRE;
    return BannerStatus.ACTIF;
}

// ─── AdZone ───────────────────────────────────────────────────────────────────

export const advertisingService = {
    async findAll() {
        const zones = await prisma.advertising.findMany({
        include: { banners: true },
        orderBy: { createdAt: "asc" },
        });

        return zones.map((zone) => {
        const activeBanners = zone.banners.filter((b) => b.status === BannerStatus.ACTIF);
        const fillRate =
            zone.banners.length > 0
            ? Math.round((activeBanners.length / zone.banners.length) * 100)
            : 0;
        return { ...zone, fillRate };
        });
    },

    async findById(id: number) {
        const zone = await prisma.advertising.findUnique({
        where: { id: Number(id) },
        include: { banners: { orderBy: { createdAt: "desc" } } },
        });
        if (!zone) throw new Error("Zone introuvable");
        return zone;
    },

    async create(data: CreateAdZoneInput) {
        const slug = slugify(data.name, { lower: true, strict: true });
        return prisma.advertising.create({ data: { ...data, slug } });
    },

    async update(id: number, data: UpdateAdZoneInput) {
        await advertisingService.findById(id); // ensure exists
        const slug = data.name
        ? slugify(data.name, { lower: true, strict: true })
        : undefined;
        return prisma.advertising.update({
        where: { id: Number(id) },
        data: { ...data, ...(slug ? { slug } : {}) },
        });
    },

    async toggle(id: number) {
        const zone = await advertisingService.findById(id);
        return prisma.advertising.update({
        where: { id: Number(id) },
        data: { isEnabled: !zone.isEnabled },
        });
    },

    async delete(id: number) {
        const zone = await advertisingService.findById(id);

        // Nettoyage Cloudinary des images des bannières de la zone,
        // pour éviter des fichiers orphelins facturés indéfiniment.
        const publicIds = zone.banners.map((b) => b.publicId).filter(Boolean) as string[];
        await Promise.all(publicIds.map((pid) => cloudinary.uploader.destroy(pid).catch(() => null)));

        return prisma.advertising.delete({ where: { id: Number(id) } });
    },

    async globalStats() {
        const zones = await advertisingService.findAll();
        const enabledZones = zones.filter((z) => z.isEnabled);
        const globalFillRate =
        enabledZones.length > 0
            ? Math.round(
                enabledZones.reduce((acc, z) => acc + z.fillRate, 0) /
                enabledZones.length
            )
            : 0;
        return {
        totalZones: zones.length,
        enabledZones: enabledZones.length,
        globalFillRate,
        };
    },
};

// ─── Banner ───────────────────────────────────────────────────────────────────

export const bannerService = {
    async findByZone(advertisingId: number) {
        return prisma.banner.findMany({
        where: { advertisingId },
        orderBy: { createdAt: "desc" },
        });
    },

    async findById(id: number) {
        const banner = await prisma.banner.findUnique({ where: { id: Number(id) } });
        if (!banner) throw new Error("Bannière introuvable");
        return banner;
    },

    async create(
        data: CreateBannerInput,
        file?: Express.Multer.File
    ) {
        // Validate zone exists
        await advertisingService.findById(data.advertisingId);

        let imageUrl: string | undefined;
        let publicId: string | undefined;

        if (data.type === "IMAGE_JPG") {
        if (!file) throw new Error("Une image est requise pour ce type de bannière");
        const uploaded = await uploadToCloudinary(file.buffer, file.originalname);
        imageUrl = uploaded.url;
        publicId = uploaded.publicId;
        }

        const officialWebSite = data.officialWebSite ?? null;
        const description = data.description ?? null;

        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        const status = computeStatus(startDate, endDate);

        return prisma.banner.create({
        data: {
            officialWebSite,
            description,
            advertiser: data.advertiser,
            campaign: data.campaign,
            type: data.type,
            // On ne garde le htmlCode que pour le type HTML_JS
            htmlCode: data.type === "HTML_JS" ? data.htmlCode ?? null : null,
            imageUrl,
            publicId,
            startDate,
            endDate,
            status,
            advertisingId: data.advertisingId,
        },
        });
    },

    async update(
        id: number,
        data: UpdateBannerInput,
        file?: Express.Multer.File
    ) {
        const existing = await bannerService.findById(id);
        const newType = data.type ?? existing.type;

        let imageUrl: string | null = existing.imageUrl;
        let publicId: string | null = existing.publicId;
        let htmlCode: string | null = existing.htmlCode;

        if (newType === "IMAGE_JPG") {
            // On bascule (ou on reste) en image → on nettoie tout code JS résiduel
            htmlCode = null;

            if (file) {
                // Nouvelle image fournie : on supprime l'ancienne sur Cloudinary
                if (existing.publicId) {
                    await cloudinary.uploader.destroy(existing.publicId).catch(() => null);
                }
                const uploaded = await uploadToCloudinary(file.buffer, file.originalname);
                imageUrl = uploaded.url;
                publicId = uploaded.publicId;
            } else if (!imageUrl) {
                // Pas de nouvelle image ET pas d'image existante (ex: on vient de HTML_JS)
                throw new Error("Une image est requise pour ce type de bannière");
            }
        } else {
            // newType === "HTML_JS" → on nettoie toute image résiduelle
            if (existing.publicId) {
                await cloudinary.uploader.destroy(existing.publicId).catch(() => null);
            }
            imageUrl = null;
            publicId = null;

            htmlCode = data.htmlCode ?? existing.htmlCode;
            if (!htmlCode) throw new Error("Le code HTML/JS est requis pour ce type");
        }

        const officialWebSite = data.officialWebSite ?? existing.officialWebSite ?? null;
        const description = data.description ?? existing.description ?? null;

        const startDate = data.startDate ? new Date(data.startDate) : existing.startDate;
        const endDate = data.endDate ? new Date(data.endDate) : existing.endDate;
        const status = computeStatus(startDate, endDate);

        return prisma.banner.update({
        where: { id: Number(id) },
        data: {
            advertiser: data.advertiser ?? existing.advertiser,
            campaign: data.campaign ?? existing.campaign,
            type: newType,
            officialWebSite,
            description,
            startDate,
            endDate,
            status,
            imageUrl,
            publicId,
            htmlCode,
        },
        });
    },

    async delete(id: number) {
        const banner = await bannerService.findById(id);
        // Supprimer l'image Cloudinary
        if (banner.publicId) {
        await cloudinary.uploader.destroy(banner.publicId).catch(() => null);
        }
        return prisma.banner.delete({ where: { id: Number(id) } });
    },

    // Cron-compatible: rafraîchit les statuts selon les dates.
    // ⚠️ Ce champ `status` sert désormais uniquement à l'affichage ADMIN
    // (tableaux, fillRate, stats) — l'affichage PUBLIC ne dépend plus de lui,
    // il filtre directement sur les dates (voir advertising.public.service.ts).
    async refreshStatuses() {
        const banners = await prisma.banner.findMany();
        const updates = banners.map((b) => {
        const status = computeStatus(b.startDate, b.endDate);
        if (status !== b.status) {
            return prisma.banner.update({ where: { id: b.id }, data: { status } });
        }
        return null;
        });
        await Promise.all(updates.filter(Boolean));
        return { updated: updates.filter(Boolean).length };
    },
};

// ─── ThirdPartyCode ───────────────────────────────────────────────────────────

export const thirdPartyService = {
    async get() {
        return prisma.thirdPartyCode.findFirst();
    },

    async upsert(data: UpsertThirdPartyCodeInput) {
        const existing = await prisma.thirdPartyCode.findFirst();
        if (existing) {
        return prisma.thirdPartyCode.update({
            where: { id: existing.id },
            data: { code: data.code },
        });
        }
        return prisma.thirdPartyCode.create({ data: { code: data.code } });
    },
};