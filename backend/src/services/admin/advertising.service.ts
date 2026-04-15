import { BannerStatus } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";
import {
    CreateAdZoneInput,
    UpdateAdZoneInput,
    CreateBannerInput,
    UpdateBannerInput,
    UpsertThirdPartyCodeInput,
} from "../../validators/advertising.schema";

import { prisma } from '../../config/database';

// ─── Cloudinary ───────────────────────────────────────────────────────────────

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
        await advertisingService.findById(id);
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
            htmlCode: data.htmlCode,
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

        let imageUrl = existing.imageUrl ?? undefined;
        let publicId = existing.publicId ?? undefined;

        if (file) {
        // Supprimer l'ancienne image Cloudinary si existante
        if (existing.publicId) {
            await cloudinary.uploader.destroy(existing.publicId);
        }
        const uploaded = await uploadToCloudinary(file.buffer, file.originalname);
        imageUrl = uploaded.url;
        publicId = uploaded.publicId;
        }

        const officialWebSite = data.officialWebSite ?? existing.officialWebSite ?? null;
        const description = data.description ?? existing.description ?? null;

        const startDate = data.startDate ? new Date(data.startDate) : existing.startDate;
        const endDate = data.endDate ? new Date(data.endDate) : existing.endDate;
        const status = computeStatus(startDate, endDate);

        return prisma.banner.update({
        where: { id: Number(id) },
        data: {
            ...data,
            officialWebSite,
            description,
            startDate,
            endDate,
            status,
            imageUrl: imageUrl ?? existing.imageUrl ?? null,
            publicId,
            htmlCode: data.htmlCode ?? existing.htmlCode ?? null, // permet de supprimer le code si type change
        },
        });
    },

    async delete(id: number) {
        const banner = await bannerService.findById(id);
        // Supprimer l'image Cloudinary
        if (banner.publicId) {
        await cloudinary.uploader.destroy(banner.publicId);
        }
        return prisma.banner.delete({ where: { id: Number(id) } });
    },

    // Cron-compatible: rafraîchit les statuts selon les dates
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
        // On ne garde qu'un seul enregistrement (upsert)
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