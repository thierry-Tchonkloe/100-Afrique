// src/routes/advertising.public.routes.ts
import { Router } from "express";
import { advertisingPublicController } from "../controllers/advertising.public.controller";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/advertising          → toutes les zones actives + bannières actives
// GET  /api/advertising/:slug    → une zone active par slug + ses bannières
// ─────────────────────────────────────────────────────────────────────────────

router.get("/", advertisingPublicController.getActiveZones);
router.get("/:slug", advertisingPublicController.getActiveZoneBySlug);

export default router;