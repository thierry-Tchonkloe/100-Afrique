import { Router } from "express";
import { advertisingController, bannerController, thirdPartyController } from "../../controllers/admin/advertising.controller";
import { uploadSingle } from "../../middlewares/upload";
import { authenticate } from "../../middlewares/auth"; // votre middleware JWT existant
import { createAdZoneSchema, updateAdZoneSchema, createBannerSchema, updateBannerSchema, upsertThirdPartyCodeSchema, } from "../../validators/advertising.schema";
import { validateBody } from "../../middlewares/advertising.middleware";


const router = Router();
router.use(authenticate);  // Toutes les routes sont protéger et authentifier

// ─────────────────────────────────────────────────────────────────────────────
// AD ZONES    /api/admin/advertising
// ─────────────────────────────────────────────────────────────────────────────

router.get("/zones/stats", advertisingController.getStats);
router.get("/zones", advertisingController.getAll);
router.get("/zones/:id", advertisingController.getOne);
router.post("/zones", validateBody(createAdZoneSchema), advertisingController.create);
router.patch("/zones/:id", validateBody(updateAdZoneSchema), advertisingController.update);
router.patch("/zones/:id/toggle", advertisingController.toggle);
router.delete("/zones/:id", advertisingController.remove);

// ─────────────────────────────────────────────────────────────────────────────
// BANNERS  /api/admin/advertising/banners                      une bannière
// ─────────────────────────────────────────────────────────────────────────────

router.get("/zones/:zoneId/banners", bannerController.getByZone);
router.post("/banners", uploadSingle, validateBody(createBannerSchema), bannerController.create ); // (uploadSingle) multer en premier (parse multipart)
router.patch( "/banners/:id", uploadSingle, validateBody(updateBannerSchema), bannerController.update );
router.delete("/banners/:id", bannerController.remove);
router.post("/banners/refresh-statuses", bannerController.refreshStatuses);

// ─────────────────────────────────────────────────────────────────────────────
// THIRD-PARTY CODES  /api/admin/advertising/third-party  le code tiers enregistré
// ─────────────────────────────────────────────────────────────────────────────

router.get("/third-party", thirdPartyController.get);
router.put("/third-party", validateBody(upsertThirdPartyCodeSchema), thirdPartyController.upsert);

export default router;