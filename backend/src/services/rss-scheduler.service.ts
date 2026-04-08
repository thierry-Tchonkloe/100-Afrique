// src/services/rss-scheduler.service.ts
import cron from 'node-cron';
import { RSSScraperService } from './rss-scraper.service';
 
class RSSSchedulerService {
  private rssScraper: RSSScraperService;
 
  constructor() {
    this.rssScraper = new RSSScraperService();
  }
 
  startScheduler() {
    console.log('🚀 Démarrage du scheduler RSS - Toutes les 6 heures');
    
    // Exécuter immédiatement au démarrage
    this.runScraping();
    
    // Puis toutes les 6 heures (cron: 0 */6 * * *)
    cron.schedule('0 */6 * * *', async () => {
      console.log('⏰ Lancement automatique du scraping RSS -', new Date().toLocaleString());
      await this.runScraping();
    });
 
    // Optionnel: toutes les heures pour le développement (à commenter en production)
    // cron.schedule('0 * * * *', async () => {
    //   console.log('⏰ Lancement horaire du scraping RSS -', new Date().toLocaleString());
    //   await this.runScraping();
    // });
  }
 
  private async runScraping() {
    try {
      const result = await this.rssScraper.scrapeAllSources();
      
      // Log des résultats
      console.log('✅ Scraping RSS terminé avec succès:');
      console.log(`📊 Total importé: ${result.imported}`);
      console.log(`⏭️ Total ignoré: ${result.skipped}`);
      console.log(`❌ Total erreurs: ${result.errors}`);
      
      // Envoyer une notification (optionnel)
      if (result.errors > 0) {
        console.warn('⚠️ Des erreurs sont survenues lors du scraping RSS');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du scraping RSS automatique:', error);
    }
  }
 
  // Pour déclencher manuellement le scraping
  async triggerManualScraping() {
    console.log('🔄 Déclenchement manuel du scraping RSS');
    return await this.runScraping();
  }
}
 
export const rssScheduler = new RSSSchedulerService();
export default RSSSchedulerService;
 