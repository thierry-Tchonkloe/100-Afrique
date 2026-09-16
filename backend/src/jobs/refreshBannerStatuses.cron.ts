// src/jobs/refreshBannerStatuses.cron.ts
import cron from "node-cron";
import { bannerService } from "../services/admin/advertising.service";

/**
 * Rafraîchit le champ `status` de toutes les bannières toutes les 15 minutes.
 * Ce job ne conditionne PAS l'affichage public (qui filtre sur les dates
 * en temps réel), il garde seulement l'admin (tableaux, fillRate, stats)
 * synchronisé sans action manuelle.
 */
export function startBannerStatusCron() {
  cron.schedule("*/15 * * * *", async () => {
    try {
      const result = await bannerService.refreshStatuses();
      if (result.updated > 0) {
        console.log(`[cron] Statuts bannières mis à jour : ${result.updated}`);
      }
    } catch (e) {
      console.error("[cron] Échec refreshStatuses :", e);
    }
  });
}