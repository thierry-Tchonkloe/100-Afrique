// src/services/rss-scraper.service.ts
import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { prisma } from '../config/database';
 
interface CustomFeedItem {
  title?: string;
  link?: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  categories?: string[];
  creator?: string;
  'content:encoded'?: string;
}
 
interface CustomFeed {
  items: CustomFeedItem[];
}
 
interface ScrapedMagazine {
  title: string;
  url: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: Date;
  source: string;
  author?: string;
  categories?: string[];
  issueNumber?: string;
  issuuUrl?: string;
  pdfUrl?: string;
  flipHtml5Url?: string;
  readOnlineUrl?: string;
  previewUrl?: string;
  type: 'magazine' | 'article';
}
 
export class RSSScraperService {
  private parser = new Parser<CustomFeed, CustomFeedItem>({
    customFields: {
      item: [
        ['media:content', 'media:content'],
        ['content:encoded', 'content:encoded'],
      ],
    },
  });
 
  private readonly RSS_SOURCES = [
    // 📰 Magazines Voyage Afrique
    { name: 'Travel Africa', url: 'https://travelafricamag.com/feed/', baseUrl: 'https://travelafricamag.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Africa Geographic', url: 'https://africageographic.com/feed/', baseUrl: 'https://africageographic.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Afrique Magazine', url: 'https://afriquemagazine.com/feed/', baseUrl: 'https://afriquemagazine.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'African Business Travel', url: 'https://africanbusinesstravel.com/feed/', baseUrl: 'https://africanbusinesstravel.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Jeune Afrique Voyages', url: 'https://jeuneafrique.com/rubriques/lifestyle/voyages/feed/', baseUrl: 'https://jeuneafrique.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'SA4x4', url: 'https://sa4x4.co.za/feed/', baseUrl: 'https://sa4x4.co.za', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Getaway Magazine', url: 'https://getaway.co.za/feed/', baseUrl: 'https://getaway.co.za', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Sarie Tuin', url: 'https://sarie.com/lifestyle/reise/feed/', baseUrl: 'https://sarie.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Condé Nast Traveller SA', url: 'https://travellersa.co.za/feed/', baseUrl: 'https://travellersa.co.za', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Wild Magazine', url: 'https://wildmag.co.za/feed/', baseUrl: 'https://wildmag.co.za', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Vacations & Travel', url: 'https://vacationsandtravel.com.au/feed/', baseUrl: 'https://vacationsandtravel.com.au', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Msafiri (Kenya Airways)', url: 'https://msafirimag.com/feed/', baseUrl: 'https://msafirimag.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'East African Travel', url: 'https://theeastafrican.co.ke/lifestyle/travel/feed/', baseUrl: 'https://theeastafrican.co.ke', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Kipepeo Magazine', url: 'https://magicalkenya.com/kipepeo-magazine/feed/', baseUrl: 'https://magicalkenya.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Discover Rwanda', url: 'https://visitrwanda.com/feed/', baseUrl: 'https://visitrwanda.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Maroc Hebdo Travel', url: 'https://maroc-hebdo.press.ma/feed/', baseUrl: 'https://maroc-hebdo.press.ma', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Destination Maroc', url: 'https://visitmorocco.com/fr/feed/', baseUrl: 'https://visitmorocco.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Tunisie Tourism', url: 'https://tourisme.gov.tn/feed/', baseUrl: 'https://tourisme.gov.tn', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Egypt Today Travel', url: 'https://egypttoday.com/Section/15/Travel/feed/', baseUrl: 'https://egypttoday.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Algeria Tourism Review', url: 'https://ont.dz/feed/', baseUrl: 'https://ont.dz', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Côte d\'Ivoire Tourism', url: 'https://tourisme.gouv.ci/feed/', baseUrl: 'https://tourisme.gouv.ci', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Visit Sénégal', url: 'https://visitezlesenegal.com/feed/', baseUrl: 'https://visitezlesenegal.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Ghana Tourism Mag', url: 'https://visitghana.com/feed/', baseUrl: 'https://visitghana.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Nigeria Travel Week', url: 'https://nigeriatravelweek.com/feed/', baseUrl: 'https://nigeriatravelweek.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Mali Tourisme', url: 'https://visit-mali.com/feed/', baseUrl: 'https://visit-mali.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Congo Tourisme', url: 'https://visit-rdc.com/feed/', baseUrl: 'https://visit-rdc.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Gabon Tourisme', url: 'https://gabontourisme.ga/feed/', baseUrl: 'https://gabontourisme.ga', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Cameroun Découverte', url: 'https://tourisme.cm/feed/', baseUrl: 'https://tourisme.cm', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Zimbabwe Tourism', url: 'https://zimbabwetourism.net/feed/', baseUrl: 'https://zimbabwetourism.net', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Botswana Tourism', url: 'https://botswanatourism.co.bw/feed/', baseUrl: 'https://botswanatourism.co.bw', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Namibia Tourism', url: 'https://visitnamibia.com.na/feed/', baseUrl: 'https://visitnamibia.com.na', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Mozambique Tourism', url: 'https://visitmozambique.gov.mz/feed/', baseUrl: 'https://visitmozambique.gov.mz', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Zambia Travel', url: 'https://zambia.travel/feed/', baseUrl: 'https://zambia.travel', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Magical Kenya', url: 'https://magicalkenya.com/feed/', baseUrl: 'https://magicalkenya.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Seychelles Travel', url: 'https://seychelles.com/feed/', baseUrl: 'https://seychelles.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Tourism Mauritius', url: 'https://mymauritius.travel/feed/', baseUrl: 'https://mymauritius.travel', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Madagascar Tourisme', url: 'https://madagascar-tourisme.com/feed/', baseUrl: 'https://madagascar-tourisme.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Cap Vert Tourism', url: 'https://turismo.cv/feed/', baseUrl: 'https://turismo.cv', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    
    // � Médias Spécialisés
    { name: 'Voyages Afriq', url: 'https://voyagesafriq.com/feed/', baseUrl: 'https://voyagesafriq.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Travel Essence Mag', url: 'https://travelessencemag.com/feed/', baseUrl: 'https://travelessencemag.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Africa News Agency', url: 'https://africa-news-agency.com/feed/', baseUrl: 'https://africa-news-agency.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'AllAfrica Travel', url: 'https://allafrica.com/travel/feed/', baseUrl: 'https://allafrica.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Tourism Update', url: 'https://tourismupdate.co.za/feed/', baseUrl: 'https://tourismupdate.co.za', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Inside Travel News', url: 'https://insidetravel.news/feed/', baseUrl: 'https://insidetravel.news', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Afrik.com Tourisme', url: 'https://afrik.com/tourisme/feed/', baseUrl: 'https://afrik.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true },
    { name: 'Destinations Mag', url: 'https://destinations-mag.com/feed/', baseUrl: 'https://destinations-mag.com', categorySlug: 'magazines', type: 'magazine' as const, scraping: true }
  ];
 
  async scrapeAllSources() {
    console.log('🚀 Démarrage du scraping RSS avec 40 sources...');
    
    const results = [];
    let totalImported = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
 
    for (const source of this.RSS_SOURCES) {
      console.log(`\n📡 Traitement de: ${source.name}`);
      
      try {
        const result = await this.scrapeSource(source);
        
        results.push({
          name: source.name,
          status: result.errors > 0 ? 'error' : 'success',
          imported: result.imported,
          skipped: result.skipped,
          errors: result.errors,
          message: result.errors > 0 ? `${result.errors} erreurs` : 'Succès',
          source: source.name
        });
        
        totalImported += result.imported;
        totalSkipped += result.skipped;
        totalErrors += result.errors;
        
        await this.sleep(1000); // Pause entre sources
        
      } catch (error: any) {
        console.error(`❌ Erreur scraping ${source.name}:`, error.message);
        
        results.push({
          name: source.name,
          status: 'error',
          imported: 0,
          skipped: 0,
          errors: 1,
          message: error.message
        });
        
        totalErrors++;
      }
    }
 
    console.log(`\n📊 STATISTIQUES FINALES D'IMPORTATION:`);
    console.log(`✅ Magazines importés: ${totalImported}`);
    console.log(`⏭️  Magazines ignorés: ${totalSkipped}`);
    console.log(`❌ Erreurs: ${totalErrors}`);
    console.log(`📡 Sources traitées: ${results.length}`);
 
    return {
      imported: totalImported,
      skipped: totalSkipped,
      errors: totalErrors,
      sources: results,
      totalProcessed: totalImported + totalSkipped + totalErrors
    };
  }
 
  private async scrapeSource(source: typeof this.RSS_SOURCES[0]) {
    let imported = 0;
    let skipped = 0;
    let errors = 0;
 
    try {
      // Essayer RSS d'abord
      const feed = await this.parser.parseURL(source.url);
      console.log(`📊 ${feed.items.length} articles trouvés dans RSS`);
 
      for (const item of feed.items) {
        try {
          const magazine = await this.extractFromRSSItem(item, source);
          if (magazine) {
            await this.saveMagazine(magazine);
            imported++;
          } else {
            skipped++;
          }
        } catch (error) {
          console.error(`Erreur traitement item:`, error);
          errors++;
        }
      }
 
    } catch (rssError) {
      console.log(`❌ Erreur RSS, tentative scraping HTML pour ${source.name}`);
      
      // Si RSS échoue, essayer le scraping HTML
      try {
        const htmlItems = await this.scrapeHTML(source);
        console.log(`📊 ${htmlItems.length} articles trouvés via HTML scraping`);
 
        for (const item of htmlItems) {
          try {
            await this.saveMagazine(item);
            imported++;
          } catch (error) {
            console.error(`Erreur traitement item HTML:`, error);
            errors++;
          }
        }
      } catch (htmlError: any) {
        console.error(`❌ Erreur scraping HTML pour ${source.name}:`, htmlError.message || htmlError);
        errors++;
      }
    }
 
    return { imported, skipped, errors };
  }
 
  private async extractFromRSSItem(item: CustomFeedItem, source: any): Promise<ScrapedMagazine | null> {
    try {
      // Vérifier si déjà existant
      const existing = await prisma.magazine.findFirst({
        where: {
          OR: [
            { title: item.title },
            { url: item.link }
          ]
        }
      });
 
      if (existing) {
        console.log(`⏭️  Magazine déjà existant: ${item.title}`);
        return null;
      }
 
      return {
        title: item.title || 'Sans titre',
        url: item.link || '',
        excerpt: this.extractExcerpt(item.content || item.contentSnippet || ''),
        content: item.content || item.contentSnippet || '',
        coverImage: this.extractImage(item),
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        source: source.name,
        author: item.creator,
        type: source.type
      };
    } catch (error) {
      console.error('Erreur extraction RSS item:', error);
      return null;
    }
  }
 
  private async scrapeHTML(source: any): Promise<ScrapedMagazine[]> {
    try {
      const response = await axios.get(source.baseUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; RSS-Scraper/1.0)'
        }
      });
 
      const $ = cheerio.load(response.data);
      const items: ScrapedMagazine[] = [];
 
      // Chercher les articles/magazines
      $('article, .post, .magazine, .news-item').each((_index: number, element: any) => {
        const $el = $(element);
        
        const title = $el.find('h1, h2, h3, .title').first().text().trim();
        const url = $el.find('a').first().attr('href') || '';
        const excerpt = $el.find('.excerpt, .summary, p').first().text().trim();
        const content = $el.find('.content, .body').html() || excerpt;
        const coverImage = $el.find('img').first().attr('src') || '';
        
        if (title && url) {
          items.push({
            title,
            url: this.resolveUrl(url, source.baseUrl),
            excerpt: this.extractExcerpt(excerpt),
            content,
            coverImage: this.resolveUrl(coverImage, source.baseUrl),
            publishedAt: new Date(),
            source: source.name,
            type: source.type
          });
        }
      });
 
      return items;
    } catch (error) {
      console.error('Erreur HTML scraping:', error);
      throw error;
    }
  }
 
  private async saveMagazine(magazine: ScrapedMagazine) {
    try {
      // Récupérer ou créer la catégorie
      let category = await prisma.category.findFirst({
        where: { slug: magazine.type === 'magazine' ? 'magazines' : 'articles' }
      });
 
      if (!category) {
        category = await prisma.category.create({
          data: {
            name: magazine.type === 'magazine' ? 'Magazines' : 'Articles',
            slug: magazine.type === 'magazine' ? 'magazines' : 'articles',
            type: magazine.type === 'magazine' ? 'MAGAZINE' as any : 'ARTICLE' as any,
            order: 1,
            color: '#amber-500'
          }
        });
      }
 
      await prisma.magazine.create({
        data: {
          title: magazine.title,
          slug: this.generateSlug(magazine.title),
          url: magazine.url,
          excerpt: magazine.excerpt,
          content: magazine.content,
          coverImage: magazine.coverImage,
          publishedAt: magazine.publishedAt,
          source: magazine.source,
          author: magazine.author,
          categoryId: category.id,
          status: 'PUBLISHED',
          featured: false
        }
      });
 
      console.log(`✅ Magazine importé: ${magazine.title}`);
    } catch (error) {
      console.error(`Erreur sauvegarde magazine:`, error);
      throw error;
    }
  }
 
  private extractExcerpt(content: string): string {
    if (!content) return '';
    
    // Nettoyer le HTML
    const clean = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    return clean.length > 200 ? clean.substring(0, 200) + '...' : clean;
  }
 
  private extractImage(item: any): string {
    // Chercher dans différents champs
    if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
      return item['media:content'].$.url;
    }
    
    if (item.enclosure && item.enclosure.url) {
      return item.enclosure.url;
    }
    
    // Chercher dans le contenu
    const imgMatch = (item.content || '').match(/<img[^>]+src="([^"]+)"/);
    return imgMatch ? imgMatch[1] : '';
  }
 
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
 
  private resolveUrl(url: string, baseUrl: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return baseUrl + (url.startsWith('/') ? '' : '/') + url;
  }
 
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
 
export const rssScraperService = new RSSScraperService();