// src/routes/rss-scraper.admin.routes.ts
import { Router } from "express";
import { asyncHandler } from "../middlewares/errorHandler";
import {
  importArticles,
  updateRSSMagazineStatus,
} from "../controllers/rss-scraper.controller";
 
const router = Router();
 
/**
* Admin routes for RSS scraper
* POST /api/admin/scraper/import - Import articles from all RSS sources
* PUT  /api/admin/scraper/:id/status - Update magazine status
* These routes should be protected by admin auth middleware where mounted.
*/
router.post("/import", asyncHandler(importArticles));
router.put("/:id/status", asyncHandler(updateRSSMagazineStatus));
 
export default router;