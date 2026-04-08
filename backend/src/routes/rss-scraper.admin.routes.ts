// src/routes/rss-scraper.admin.routes.ts
import { Router } from "express";
import { asyncHandler } from "../middlewares/errorHandler";
import { authenticate } from "../middlewares/auth";
import {
  importArticles,
  updateRSSMagazineStatus,
  getImportHistory,
} from "../controllers/rss-scraper.controller";
 
const router = Router();

// Protéger toutes les routes admin par middleware d'auth
router.use(authenticate);
 
/**
* Admin routes for RSS scraper
* POST /api/admin/scraper/import - Import articles from all RSS sources
* PUT  /api/admin/scraper/:id/status - Update magazine status
* These routes should be protected by admin auth middleware where mounted.
*/
router.post("/import", asyncHandler(importArticles));
router.put("/:id/status", asyncHandler(updateRSSMagazineStatus));
router.get("/history", asyncHandler(getImportHistory));
 
export default router;