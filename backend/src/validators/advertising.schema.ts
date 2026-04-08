import { z } from "zod";

// ───────────────────────────────────────────────────────────────
// 🧱 AdZone
// ───────────────────────────────────────────────────────────────

export const createAdZoneSchema = z.object({
    name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
    width: z.number().int().positive("Largeur invalide"),
    height: z.number().int().positive("Hauteur invalide"),
    path: z.string().min(1, "Le chemin est requis"),
    isEnabled: z.boolean().optional().default(true),
});


export const updateAdZoneSchema = createAdZoneSchema.partial();

// ───────────────────────────────────────────────────────────────
// 🧱 Banner (STRUCTURE PROPRE)
// ───────────────────────────────────────────────────────────────

// ✅ Base schema (SANS refine)
const baseBannerSchema = z.object({
    advertiser: z.string().min(2, "Annonceur requis"),
    campaign: z.string().min(2, "Campagne requise"),
    type: z.enum(["IMAGE_JPG", "HTML_JS"]),
    htmlCode: z.string().optional(),
    startDate: z.string().datetime({
        message: "Date de début invalide (ISO 8601)",
    }),
    endDate: z.string().datetime({
        message: "Date de fin invalide (ISO 8601)",
    }),
    advertisingId: z.coerce.number().int().positive("ID zone invalide"), // ✅ corrigé
    imageUrl: z.string().url("URL de l'image invalide").optional(),
});

// ✅ CREATE
export const createBannerSchema = baseBannerSchema
    .refine(
        (d) => new Date(d.startDate) < new Date(d.endDate),
        {
            message: "La date de fin doit être après la date de début",
            path: ["endDate"],
        }
    )
    .refine(
        (d) => (d.type === "HTML_JS" ? !!d.htmlCode : true),
        {
            message: "Le code HTML/JS est requis pour ce type",
            path: ["htmlCode"],
        }
    );



// ✅ UPDATE (propre et flexible)
export const updateBannerSchema = baseBannerSchema
    .omit({ advertisingId: true }) // ❗ maintenant OK
    .partial()
    .refine(
        (d) =>
            !d.startDate ||
            !d.endDate ||
            new Date(d.startDate) < new Date(d.endDate),
        {
            message: "La date de fin doit être après la date de début",
            path: ["endDate"],
        }
    )
    .refine(
        (d) =>
            d.type === "HTML_JS"
                ? !!d.htmlCode
                : true,
        {
            message: "Le code HTML/JS est requis pour ce type",
            path: ["htmlCode"],
        }
    );

// ───────────────────────────────────────────────────────────────
// 🧱 Third Party Code
// ───────────────────────────────────────────────────────────────

export const upsertThirdPartyCodeSchema = z.object({
    code: z.string().min(1, "Le code ne peut pas être vide"),
});

// ───────────────────────────────────────────────────────────────
// 🧠 Types
// ───────────────────────────────────────────────────────────────

export type CreateAdZoneInput = z.infer<typeof createAdZoneSchema>;
export type UpdateAdZoneInput = z.infer<typeof updateAdZoneSchema>;
export type CreateBannerInput = z.infer<typeof createBannerSchema>;
export type UpdateBannerInput = z.infer<typeof updateBannerSchema>;
export type UpsertThirdPartyCodeInput = z.infer<typeof upsertThirdPartyCodeSchema>;