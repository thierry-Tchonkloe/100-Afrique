// // src/routes/index.ts
// import { Router } from 'express';

// // ========================================
// // ROUTES EXISTANTES
// // ========================================
// import authRoutes from './auth.routes';
// import publicArticlesRoutes from './public-articles.routes';
// import adminArticlesRoutes from './admin-articles.routes';
// import publicCategoriesRoutes from './public-categories.routes';
// import adminCategoriesRoutes from './admin-categories.routes';
// import mediaRoutes from './media.routes';
// import statsRoutes from './stats.routes';
// import destinationsRoutes from './destinations.routes';
// import newsletterRoutes from './newsletter.routes';
// import magazineRoutes from './magazine.routes';
// import partnersRoutes from './partners.routes';
// import annonceursRoutes from './annonceurs.routes';
// import editorialRoutes from './editorial.routes';
// import destinationPartnershipRoutes from './destination-partnership.routes';
// import demandeDevisRoutes from './demande-devis.routes';
// import contactRoutes from './contact.routes';
// import tagsRoutes from './tags.routes';
// import settingsRoutes from './settings.routes';
// import chatbotRoutes from './chatbot.routes';
// import publicChatbotRoutes from './public-chatbot.routes';
// import usersRoutes from './users.routes';
// import permissionsRoutes from './permissions.routes';
// import rolesRoutes from './roles.routes';
// import languagesRoutes from './languages.routes';
// import newsletterAdminRoutes from "./admin/newsletter.routes";
// import advertisingAdminRoutes from './admin/advertising.routes';
// import advertisingPublicRouter from "./advertising.public.routes";


// const router = Router();

// // ========================================
// // ROUTES PUBLIC (FRONT-OFFICE)
// // ========================================

// /**
//  * Articles publics (Magazine)
//  * GET /api/mag/articles - Liste des articles publiés
//  * GET /api/mag/articles/:slug - Détail d'un article
//  * 
//  * Filtres disponibles:
//  * - featured: boolean
//  * - categoryId: number
//  * - categorySlug: string
//  * - search: string
//  * - hasVideo: boolean (pour filtrer les vidéos)
//  * - year: number (pour filtrer par année)
//  * - page: number
//  * - pageSize: number
//  */
// router.use('/mag/articles', publicArticlesRoutes);

// /**
//  * Catégories publiques
//  * GET /api/categories - Liste des catégories
//  * GET /api/categories/:slug - Détail d'une catégorie
//  */
// router.use('/categories', publicCategoriesRoutes);

// /**
//  * Destinations
//  * GET /api/destinations - Liste des destinations (avec filtres continent, search)
//  * GET /api/destinations/featured - Destinations coup de cœur
//  * GET /api/destinations/:slug - Détail d'une destination
//  */
// router.use('/destinations', destinationsRoutes);

// // ========================================
// // ✅ NOUVELLES ROUTES PUBLIC
// // ========================================

// /**
//  * Newsletter
//  * POST /api/newsletter/subscribe - Inscription à la newsletter
//  * POST /api/newsletter/unsubscribe - Désabonnement
//  * GET /api/newsletter/verify/:token - Vérification email
//  */
// router.use('/newsletter', newsletterRoutes);
// /**
//  * Magazine (Abonnements)
//  * GET /api/magazine/subscription-plans - Plans d'abonnement disponibles
//  * POST /api/magazine/create-checkout-session - Créer session de paiement
//  */
// router.use('/magazine', magazineRoutes);

// /**
//  * Contact Général
//  * POST /api/contact - Formulaire de contact général
//  */
// router.use('/contact', contactRoutes);

// /**
//  * Chatbot Public
//  * GET /api/chatbot/settings - Paramètres publics du chatbot
//  * GET /api/chatbot/faqs - FAQs actives
//  */
// router.use('/chatbot', publicChatbotRoutes);

// /**
//  * Partenaires & Annonceurs & Editorial
//  * GET /api/pages/partners - Données complètes de la page partenaires
//  * POST /api/contacts/partners - Formulaire de contact partenariat
//  * POST /api/contacts/annonceurs - Formulaire demande kit média annonceurs
//  * POST /api/contacts/editorial - Formulaire demande couverture éditoriale
//  * POST /api/contacts/partenariat-destination - Formulaire partenariat destination
//  * POST /api/contacts/demande-devis - Formulaire demande de devis
//  * 
//  * Note: Ces routes utilisent le router directement (sans préfixe)
//  * car elles ont des chemins spécifiques
//  */
// router.use('/', partnersRoutes);
// router.use('/contacts/annonceurs', annonceursRoutes);
// router.use('/contacts/editorial', editorialRoutes);
// router.use('/contacts/partenariat-destination', destinationPartnershipRoutes);
// router.use('/contacts/demande-devis', demandeDevisRoutes);

// // ========================================
// // ROUTES ADMIN (BACK-OFFICE)
// // ========================================

// /**
//  * Authentification
//  * POST /api/admin/register - Inscription (SUPER_ADMIN uniquement)
//  * POST /api/admin/login - Connexion
//  * GET /api/admin/me - Profil utilisateur authentifié
//  */
// router.use('/admin', authRoutes);

// /**
//  * Articles admin
//  * GET /api/admin/articles - Liste tous les articles (brouillons inclus)
//  * GET /api/admin/articles/:id - Détail d'un article
//  * POST /api/admin/articles - Créer un article
//  * PUT /api/admin/articles/:id - Modifier un article
//  * DELETE /api/admin/articles/:id - Supprimer un article
//  * 
//  * Toutes les routes nécessitent une authentification
//  */
// router.use('/admin/articles', adminArticlesRoutes);

// /**
//  * Catégories admin
//  * GET /api/admin/categories - Liste toutes les catégories
//  * GET /api/admin/categories/:id - Détail d'une catégorie
//  * POST /api/admin/categories - Créer une catégorie (SUPER_ADMIN)
//  * PUT /api/admin/categories/:id - Modifier une catégorie (SUPER_ADMIN)
//  * DELETE /api/admin/categories/:id - Supprimer une catégorie (SUPER_ADMIN)
//  * 
//  * Toutes les routes nécessitent une authentification
//  * Certaines routes nécessitent le rôle SUPER_ADMIN
//  */
// router.use('/admin/categories', adminCategoriesRoutes);

// /**
//  * Médias (Upload & Bibliothèque)
//  * GET /api/admin/media - Liste des médias
//  * POST /api/admin/media/upload - Upload d'un fichier (Cloudinary)
//  * DELETE /api/admin/media/:publicId - Supprimer un média
//  * 
//  * Toutes les routes nécessitent une authentification
//  */
// router.use('/admin/media', mediaRoutes);

// /**
//  * Statistiques
//  * GET /api/admin/stats/dashboard - Statistiques globales du dashboard
//  * GET /api/admin/stats/articles - Statistiques détaillées des articles
//  * GET /api/admin/stats/traffic - Statistiques de trafic
//  * 
//  * Toutes les routes nécessitent une authentification
//  */
// router.use('/admin/stats', statsRoutes);
// router.use('/admin/tags', tagsRoutes);
// router.use('/admin/settings', settingsRoutes);

// /**
//  * Chatbot Admin
//  * GET /api/admin/chatbot/settings - Récupérer paramètres (SUPER_ADMIN)
//  * PUT /api/admin/chatbot/settings - Mettre à jour paramètres (SUPER_ADMIN)
//  * GET /api/admin/chatbot/faqs - Liste FAQs (SUPER_ADMIN)
//  * GET /api/admin/chatbot/faqs/:id - Détail FAQ (SUPER_ADMIN)
//  * POST /api/admin/chatbot/faqs - Créer FAQ (SUPER_ADMIN)
//  * PUT /api/admin/chatbot/faqs/:id - Modifier FAQ (SUPER_ADMIN)
//  * DELETE /api/admin/chatbot/faqs/:id - Supprimer FAQ (SUPER_ADMIN)
//  */
// router.use('/admin/chatbot', chatbotRoutes);

// /**
//  * Users Management
//  * GET /api/admin/users - Liste utilisateurs (SUPER_ADMIN)
//  * GET /api/admin/users/:id - Détail utilisateur (SUPER_ADMIN)
//  * PUT /api/admin/users/:id - Modifier utilisateur (SUPER_ADMIN)
//  * DELETE /api/admin/users/:id - Supprimer utilisateur (SUPER_ADMIN)
//  * PATCH /api/admin/users/:id/status - Changer statut (SUPER_ADMIN)
//  */
// router.use('/admin/users', usersRoutes);

// /**
//  * Permissions Management
//  * GET /api/admin/permissions - Liste permissions (SUPER_ADMIN)
//  */
// router.use('/admin/permissions', permissionsRoutes);

// /**
//  * Roles Management
//  * GET /api/admin/roles - Liste rôles (SUPER_ADMIN)
//  * GET /api/admin/roles/:role - Détail rôle (SUPER_ADMIN)
//  * PUT /api/admin/roles/:role/permissions - Modifier permissions (SUPER_ADMIN)
//  */
// router.use('/admin/roles', rolesRoutes);

// /**
//  * Languages Management
//  * GET /api/admin/languages - Liste langues (SUPER_ADMIN)
//  * POST /api/admin/languages - Créer langue (SUPER_ADMIN)
//  * GET /api/admin/languages/:id - Détail langue (SUPER_ADMIN)
//  * PUT /api/admin/languages/:id - Modifier langue (SUPER_ADMIN)
//  * PATCH /api/admin/languages/:id/toggle - Activer/désactiver (SUPER_ADMIN)
//  * DELETE /api/admin/languages/:id - Supprimer langue (SUPER_ADMIN)
//  * PATCH /api/admin/languages/default - Définir par défaut (SUPER_ADMIN)
//  * GET /api/admin/languages/settings - Paramètres (SUPER_ADMIN)
//  * PUT /api/admin/languages/settings - Modifier paramètres (SUPER_ADMIN)
//  */
// router.use('/admin/languages', languagesRoutes);


// // ========================================
// // ROUTE D'ADMINISTRATION DE LA NEWSLETTER
// // ========================================

// router.use('/admin/newsletter', newsletterAdminRoutes);

// // ========================================
// // ROUTE D'ADMINISTRATION DE LA PUBLICITÉ
// // ========================================

// router.use('/admin/advertising', advertisingAdminRoutes);

// // ========================================
// // ROUTE D'ADMINISTRATION DE LA PUBLICITÉ
// // ========================================

// router.use("/advertising", advertisingPublicRouter);

// // ========================================
// // ROUTE DE BIENVENUE / DOCUMENTATION
// // ========================================

// router.get('/', (_req, res) => {
//   res.json({
//     success: true,
//     message: '🚀 Bienvenue sur l\'API iTourisme Nomade',
//     version: '2.0.0', // ✅ Nouvelle version
//     documentation: {
//       swagger: '/api/docs',
//       postman: '/api/postman-collection'
//     },
//     endpoints: {
//       public: {
//         articles: {
//           list: 'GET /api/mag/articles',
//           detail: 'GET /api/mag/articles/:slug',
//         },
//         categories: {
//           list: 'GET /api/categories',
//           detail: 'GET /api/categories/:slug'
//         },
//         destinations: {
//           list: 'GET /api/destinations',
//           featured: 'GET /api/destinations/featured',
//           detail: 'GET /api/destinations/:slug'
//         },
//         newsletter: {
//           subscribe: 'POST /api/newsletter/subscribe',
//           unsubscribe: 'POST /api/newsletter/unsubscribe'
//         },
//         magazine: {
//           plans: 'GET /api/magazine/subscription-plans',
//           checkout: 'POST /api/magazine/create-checkout-session'
//         },
//         contact: {
//           general: 'POST /api/contact'
//         },
//         partners: {
//           pageData: 'GET /api/pages/partners',
//           contact: 'POST /api/contacts/partners',
//           annonceurs: 'POST /api/contacts/annonceurs',
//           editorial: 'POST /api/contacts/editorial',
//           destinationPartnership: 'POST /api/contacts/partenariat-destination',
//           devis: 'POST /api/contacts/demande-devis'
//         },
//         chatbot: {
//           settings: 'GET /api/chatbot/settings',
//           faqs: 'GET /api/chatbot/faqs'
//         },
//         advertising: {
//           list: 'GET /api/advertising',
//           detail: 'GET /api/advertising/:slug'
//         },
//       },
//       admin: {
//         auth: {
//           login: 'POST /api/admin/login',
//           register: 'POST /api/admin/register',
//           me: 'GET /api/admin/me'
//         },
//         articles: {
//           list: 'GET /api/admin/articles',
//           create: 'POST /api/admin/articles',
//           update: 'PUT /api/admin/articles/:id',
//           delete: 'DELETE /api/admin/articles/:id'
//         },
//         categories: {
//           list: 'GET /api/admin/categories',
//           create: 'POST /api/admin/categories',
//           update: 'PUT /api/admin/categories/:id',
//           delete: 'DELETE /api/admin/categories/:id'
//         },
//         tags: {
//           list: 'GET /api/admin/tags',
//           detail: 'GET /api/admin/tags/:id',
//           create: 'POST /api/admin/tags',
//           update: 'PUT /api/admin/tags/:id',
//           delete: 'DELETE /api/admin/tags/:id'
//         },
//         settings: {
//           getTaxonomy: 'GET /api/admin/settings/taxonomy',
//           updateTaxonomy: 'PUT /api/admin/settings/taxonomy'
//         },
//         chatbot: {
//           getSettings: 'GET /api/admin/chatbot/settings',
//           updateSettings: 'PUT /api/admin/chatbot/settings',
//           listFAQs: 'GET /api/admin/chatbot/faqs',
//           getFAQ: 'GET /api/admin/chatbot/faqs/:id',
//           createFAQ: 'POST /api/admin/chatbot/faqs',
//           updateFAQ: 'PUT /api/admin/chatbot/faqs/:id',
//           deleteFAQ: 'DELETE /api/admin/chatbot/faqs/:id'
//         },
//         users: {
//           list: 'GET /api/admin/users',
//           detail: 'GET /api/admin/users/:id',
//           update: 'PUT /api/admin/users/:id',
//           delete: 'DELETE /api/admin/users/:id',
//           updateStatus: 'PATCH /api/admin/users/:id/status'
//         },
//         permissions: {
//           list: 'GET /api/admin/permissions'
//         },
//         roles: {
//           list: 'GET /api/admin/roles',
//           detail: 'GET /api/admin/roles/:role',
//           updatePermissions: 'PUT /api/admin/roles/:role/permissions'
//         },
//         languages: {
//           list: 'GET /api/admin/languages',
//           create: 'POST /api/admin/languages',
//           detail: 'GET /api/admin/languages/:id',
//           update: 'PUT /api/admin/languages/:id',
//           toggle: 'PATCH /api/admin/languages/:id/toggle',
//           delete: 'DELETE /api/admin/languages/:id',
//           setDefault: 'PATCH /api/admin/languages/default',
//           getSettings: 'GET /api/admin/languages/settings',
//           updateSettings: 'PUT /api/admin/languages/settings'
//         },
//         media: {
//           list: 'GET /api/admin/media',
//           upload: 'POST /api/admin/media/upload',
//           delete: 'DELETE /api/admin/media/:publicId'
//         },
//         stats: {
//           dashboard: 'GET /api/admin/stats/dashboard',
//           articles: 'GET /api/admin/stats/articles',
//           traffic: 'GET /api/admin/stats/traffic'
//         },
//         advertising: {
//           list: 'GET /api/admin/advertising/zones',
//           stats: 'GET /api/admin/advertising/zones/stats',
//           detail: 'GET /api/admin/advertising/zones/:id',
//           create: 'POST /api/admin/advertising/zones',
//           update: 'PATCH /api/admin/advertising/zones/:id',
//           toggle: 'PATCH /api/admin/advertising/zones/:id/toggle',
//           delete: 'DELETE /api/admin/advertising/zones/:id',
//         },
//         banners:{
//           list: 'GET /api/admin/advertising/zones/:zoneId/banners',
//           create: 'POST /api/admin/advertising/banners',
//           update: 'PATCH /api/admin/advertising/banners/:id',
//           delete: 'DELETE /api/admin/advertising/banners/:id',
//           refreshStatuses: 'POST /api/admin/advertising/banners/refresh-statuses',
//         },
//         thirdPartyCodes: {
//           get: 'GET /api/admin/advertising/third-party',
//           upsert: 'PUT /api/admin/advertising/third-party',
//         },
//       },
//     },

//     features: {
//       authentication: '✅ JWT Bearer Token',
//       fileUpload: '✅ Cloudinary Integration',
//       rateLimit: '✅ 100 req/15min',
//       cors: '✅ Enabled',
//       validation: '✅ Zod Schemas',
//       newsletter: '✅ Newsletter Management',
//       magazine: '✅ Subscription Plans',
//       partners: '✅ Partnership Contacts',
//       annonceurs: '✅ Advertiser Contact Forms',
//       editorial: '✅ Editorial Contact Forms',
//       destinations: '✅ Featured Destinations',
//       destinationPartnership: '✅ Destination Partnership Forms',
//       devis: '✅ Quote Request Forms',
//       generalContact: '✅ General Contact Form',
//       tags: '✅ Tags Management',
//       settings: '✅ Site Settings',
//       chatbot: '✅ Chatbot & FAQ Management',
//       users: '✅ Users & Roles Management',
//       languages: '✅ Multilingual Management'
//     },
//   });
// });

// export default router;




// src/routes/index.ts
import { Router } from 'express';
 
// ========================================
// ROUTES EXISTANTES
// ========================================
import authRoutes from './auth.routes';
import publicArticlesRoutes from './public-articles.routes';
import adminArticlesRoutes from './admin-articles.routes';
import publicCategoriesRoutes from './public-categories.routes';
import adminCategoriesRoutes from './admin-categories.routes';
import mediaRoutes from './media.routes';
import statsRoutes from './stats.routes';
import destinationsRoutes from './destinations.routes';
import newsletterRoutes from './newsletter.routes';
import magazineRoutes from './magazine.routes';
import partnersRoutes from './partners.routes';
import annonceursRoutes from './annonceurs.routes';
import editorialRoutes from './editorial.routes';
import destinationPartnershipRoutes from './destination-partnership.routes';
import demandeDevisRoutes from './demande-devis.routes';
import contactRoutes from './contact.routes';
import tagsRoutes from './tags.routes';
import settingsRoutes from './settings.routes';
import chatbotRoutes from './chatbot.routes';
import publicChatbotRoutes from './public-chatbot.routes';
import usersRoutes from './users.routes';
import permissionsRoutes from './permissions.routes';
import rolesRoutes from './roles.routes';
import languagesRoutes from './languages.routes';
import newsletterAdminRoutes from "./admin/newsletter.routes";
import advertisingAdminRoutes from './admin/advertising.routes';
import advertisingPublicRouter from "./advertising.public.routes";
import rssScraperRoutes from './rss-scraper.routes';
import rssScraperAdminRoutes from "./rss-scraper.admin.routes";

// ========================================
// ROUTES EMPLOI (NOUVEAU)
// ========================================
import emploiRoutes from './emploi/index';
 
const router = Router();
 
// ========================================
// ROUTES PUBLIC (FRONT-OFFICE)
// ========================================
 
/**
* Magazines RSS (Public)
* GET /api/magazines/rss - Liste des magazines RSS avec pagination
* GET /api/magazines/rss/:id - Détail d'un magazine RSS
* GET /api/magazines/rss/sources/list - Sources RSS disponibles
*/
router.use('/magazines/rss', rssScraperRoutes);
 
/**
* Articles publics (Magazine)
* GET /api/mag/articles - Liste des articles publiés
* GET /api/mag/articles/:slug - Détail d'un article
*
* Filtres disponibles:
* - featured: boolean
* - categoryId: number
* - categorySlug: string
* - search: string
* - hasVideo: boolean (pour filtrer les vidéos)
* - year: number (pour filtrer par année)
* - page: number
* - pageSize: number
*/
router.use('/mag/articles', publicArticlesRoutes);
 
/**
* Catégories publiques
* GET /api/categories - Liste des catégories
* GET /api/categories/:slug - Détail d'une catégorie
*/
router.use('/categories', publicCategoriesRoutes);
 
/**
* Destinations
* GET /api/destinations - Liste des destinations (avec filtres continent, search)
* GET /api/destinations/featured - Destinations coup de cœur
* GET /api/destinations/:slug - Détail d'une destination
*/
router.use('/destinations', destinationsRoutes);
 
// ========================================
// ✅ NOUVELLES ROUTES PUBLIC
// ========================================
 
/**
* Newsletter
* POST /api/newsletter/subscribe - Inscription à la newsletter
* POST /api/newsletter/unsubscribe - Désabonnement
* GET /api/newsletter/verify/:token - Vérification email
*/
router.use('/newsletter', newsletterRoutes);
/**
* Magazine (Abonnements)
* GET /api/magazine/subscription-plans - Plans d'abonnement disponibles
* POST /api/magazine/create-checkout-session - Créer session de paiement
*/
router.use('/magazine', magazineRoutes);
 
/**
* Contact Général
* POST /api/contact - Formulaire de contact général
*/
router.use('/contact', contactRoutes);
 
/**
* Chatbot Public
* GET /api/chatbot/settings - Paramètres publics du chatbot
* GET /api/chatbot/faqs - FAQs actives
*/
router.use('/chatbot', publicChatbotRoutes);
 
/**
* Partenaires & Annonceurs & Editorial
* GET /api/pages/partners - Données complètes de la page partenaires
* POST /api/contacts/partners - Formulaire de contact partenariat
* POST /api/contacts/annonceurs - Formulaire demande kit média annonceurs
* POST /api/contacts/editorial - Formulaire demande couverture éditoriale
* POST /api/contacts/partenariat-destination - Formulaire partenariat destination
* POST /api/contacts/demande-devis - Formulaire demande de devis
*
* Note: Ces routes utilisent le router directement (sans préfixe)
* car elles ont des chemins spécifiques
*/
router.use('/', partnersRoutes);
router.use('/contacts/annonceurs', annonceursRoutes);
router.use('/contacts/editorial', editorialRoutes);
router.use('/contacts/partenariat-destination', destinationPartnershipRoutes);
router.use('/contacts/demande-devis', demandeDevisRoutes);
 
// ========================================
// ROUTES ADMIN (BACK-OFFICE)
// ========================================
 
/**
* Authentification
* POST /api/admin/register - Inscription (SUPER_ADMIN uniquement)
* POST /api/admin/login - Connexion
* GET /api/admin/me - Profil utilisateur authentifié
*/
router.use('/admin', authRoutes);
 
/**
* Articles admin
* GET /api/admin/articles - Liste tous les articles (brouillons inclus)
* GET /api/admin/articles/:id - Détail d'un article
* POST /api/admin/articles - Créer un article
* PUT /api/admin/articles/:id - Modifier un article
* DELETE /api/admin/articles/:id - Supprimer un article
*
* Toutes les routes nécessitent une authentification
*/
router.use('/admin/articles', adminArticlesRoutes);
 
/**
* Catégories admin
* GET /api/admin/categories - Liste toutes les catégories
* GET /api/admin/categories/:id - Détail d'une catégorie
* POST /api/admin/categories - Créer une catégorie (SUPER_ADMIN)
* PUT /api/admin/categories/:id - Modifier une catégorie (SUPER_ADMIN)
* DELETE /api/admin/categories/:id - Supprimer une catégorie (SUPER_ADMIN)
*
* Toutes les routes nécessitent une authentification
* Certaines routes nécessitent le rôle SUPER_ADMIN
*/
router.use('/admin/categories', adminCategoriesRoutes);
 
/**
* Médias (Upload & Bibliothèque)
* GET /api/admin/media - Liste des médias
* POST /api/admin/media/upload - Upload d'un fichier (Cloudinary)
* DELETE /api/admin/media/:publicId - Supprimer un média
*
* Toutes les routes nécessitent une authentification
*/
router.use('/admin/media', mediaRoutes);
 
/**
* Statistiques
* GET /api/admin/stats/dashboard - Statistiques globales du dashboard
* GET /api/admin/stats/articles - Statistiques détaillées des articles
* GET /api/admin/stats/traffic - Statistiques de trafic
*
* Toutes les routes nécessitent une authentification
*/
router.use('/admin/stats', statsRoutes);
router.use('/admin/tags', tagsRoutes);
router.use('/admin/settings', settingsRoutes);
 
/**
* Chatbot Admin
* GET /api/admin/chatbot/settings - Récupérer paramètres (SUPER_ADMIN)
* PUT /api/admin/chatbot/settings - Mettre à jour paramètres (SUPER_ADMIN)
* GET /api/admin/chatbot/faqs - Liste FAQs (SUPER_ADMIN)
* GET /api/admin/chatbot/faqs/:id - Détail FAQ (SUPER_ADMIN)
* POST /api/admin/chatbot/faqs - Créer FAQ (SUPER_ADMIN)
* PUT /api/admin/chatbot/faqs/:id - Modifier FAQ (SUPER_ADMIN)
* DELETE /api/admin/chatbot/faqs/:id - Supprimer FAQ (SUPER_ADMIN)
*/
router.use('/admin/chatbot', chatbotRoutes);
 
/**
* Users Management
* GET /api/admin/users - Liste utilisateurs (SUPER_ADMIN)
* GET /api/admin/users/:id - Détail utilisateur (SUPER_ADMIN)
* PUT /api/admin/users/:id - Modifier utilisateur (SUPER_ADMIN)
* DELETE /api/admin/users/:id - Supprimer utilisateur (SUPER_ADMIN)
* PATCH /api/admin/users/:id/status - Changer statut (SUPER_ADMIN)
*/
router.use('/admin/users', usersRoutes);
 
/**
* Permissions Management
* GET /api/admin/permissions - Liste permissions (SUPER_ADMIN)
*/
router.use('/admin/permissions', permissionsRoutes);
 
/**
* Roles Management
* GET /api/admin/roles - Liste rôles (SUPER_ADMIN)
* GET /api/admin/roles/:role - Détail rôle (SUPER_ADMIN)
* PUT /api/admin/roles/:role/permissions - Modifier permissions (SUPER_ADMIN)
*/
router.use('/admin/roles', rolesRoutes);
 
/**
* Languages Management
* GET /api/admin/languages - Liste langues (SUPER_ADMIN)
* POST /api/admin/languages - Créer langue (SUPER_ADMIN)
* GET /api/admin/languages/:id - Détail langue (SUPER_ADMIN)
* PUT /api/admin/languages/:id - Modifier langue (SUPER_ADMIN)
* PATCH /api/admin/languages/:id/toggle - Activer/désactiver (SUPER_ADMIN)
* DELETE /api/admin/languages/:id - Supprimer langue (SUPER_ADMIN)
* PATCH /api/admin/languages/default - Définir par défaut (SUPER_ADMIN)
* GET /api/admin/languages/settings - Paramètres (SUPER_ADMIN)
* PUT /api/admin/languages/settings - Modifier paramètres (SUPER_ADMIN)
*/
router.use('/admin/languages', languagesRoutes);
 
 
// ========================================
// ROUTE D'ADMINISTRATION DE LA NEWSLETTER
// ========================================
 
router.use('/admin/newsletter', newsletterAdminRoutes);
 
// ========================================
// ROUTE D'ADMINISTRATION DE LA PUBLICITÉ
// ========================================
 
router.use('/admin/advertising', advertisingAdminRoutes);
 
// ========================================
// ROUTE D'ADMINISTRATION DE LA PUBLICITÉ
// ========================================
 
router.use("/advertising", advertisingPublicRouter);
 
// ========================================
// ROUTES RSS - IMPORTATION ARTICLES
// ========================================
 
/**
* RSS Scraper - Admin importation routes
* POST /api/admin/scraper/import - Importer articles RSS (ADMIN)
* PUT  /api/admin/scraper/:id/status - Mettre à jour statut magazine (ADMIN)
*/
router.use("/admin/scraper", rssScraperAdminRoutes);

// ========================================
// ROUTES EMPLOI
// Préfixe: /api/emploi
// Auth:    POST /api/emploi/auth/register
//          POST /api/emploi/auth/login
//          GET  /api/emploi/auth/me
// Candidat: /api/emploi/candidat/**
// Recruteur: /api/emploi/recruteur/**
// Public:   GET /api/emploi/jobs
//           GET /api/emploi/jobs/:id
//           GET /api/emploi/vitrines/:etablissementId
// ========================================
router.use('/emploi', emploiRoutes);
 
// ========================================
// ROUTE DE BIENVENUE / DOCUMENTATION
// ========================================
 
router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: '🚀 Bienvenue sur l\'API iTourisme Nomade',
    version: '2.0.0', // ✅ Nouvelle version
    documentation: {
      swagger: '/api/docs',
      postman: '/api/postman-collection'
    },
    endpoints: {
      public: {
        articles: {
          list: 'GET /api/mag/articles',
          detail: 'GET /api/mag/articles/:slug',
        },
        categories: {
          list: 'GET /api/categories',
          detail: 'GET /api/categories/:slug'
        },
        destinations: {
          list: 'GET /api/destinations',
          featured: 'GET /api/destinations/featured',
          detail: 'GET /api/destinations/:slug'
        },
        newsletter: {
          subscribe: 'POST /api/newsletter/subscribe',
          unsubscribe: 'POST /api/newsletter/unsubscribe'
        },
        magazine: {
          plans: 'GET /api/magazine/subscription-plans',
          checkout: 'POST /api/magazine/create-checkout-session'
        },
        contact: {
          general: 'POST /api/contact'
        },
        partners: {
          pageData: 'GET /api/pages/partners',
          contact: 'POST /api/contacts/partners',
          annonceurs: 'POST /api/contacts/annonceurs',
          editorial: 'POST /api/contacts/editorial',
          destinationPartnership: 'POST /api/contacts/partenariat-destination',
          devis: 'POST /api/contacts/demande-devis'
        },
        chatbot: {
          settings: 'GET /api/chatbot/settings',
          faqs: 'GET /api/chatbot/faqs'
        },
        advertising: {
          list: 'GET /api/advertising',
          detail: 'GET /api/advertising/:slug'
        },
      },
      admin: {
        auth: {
          login: 'POST /api/admin/login',
          register: 'POST /api/admin/register',
          me: 'GET /api/admin/me'
        },
        articles: {
          list: 'GET /api/admin/articles',
          create: 'POST /api/admin/articles',
          update: 'PUT /api/admin/articles/:id',
          delete: 'DELETE /api/admin/articles/:id'
        },
        categories: {
          list: 'GET /api/admin/categories',
          create: 'POST /api/admin/categories',
          update: 'PUT /api/admin/categories/:id',
          delete: 'DELETE /api/admin/categories/:id'
        },
        tags: {
          list: 'GET /api/admin/tags',
          detail: 'GET /api/admin/tags/:id',
          create: 'POST /api/admin/tags',
          update: 'PUT /api/admin/tags/:id',
          delete: 'DELETE /api/admin/tags/:id'
        },
        settings: {
          getTaxonomy: 'GET /api/admin/settings/taxonomy',
          updateTaxonomy: 'PUT /api/admin/settings/taxonomy'
        },
        chatbot: {
          getSettings: 'GET /api/admin/chatbot/settings',
          updateSettings: 'PUT /api/admin/chatbot/settings',
          listFAQs: 'GET /api/admin/chatbot/faqs',
          getFAQ: 'GET /api/admin/chatbot/faqs/:id',
          createFAQ: 'POST /api/admin/chatbot/faqs',
          updateFAQ: 'PUT /api/admin/chatbot/faqs/:id',
          deleteFAQ: 'DELETE /api/admin/chatbot/faqs/:id'
        },
        users: {
          list: 'GET /api/admin/users',
          detail: 'GET /api/admin/users/:id',
          update: 'PUT /api/admin/users/:id',
          delete: 'DELETE /api/admin/users/:id',
          updateStatus: 'PATCH /api/admin/users/:id/status'
        },
        permissions: {
          list: 'GET /api/admin/permissions'
        },
        roles: {
          list: 'GET /api/admin/roles',
          detail: 'GET /api/admin/roles/:role',
          updatePermissions: 'PUT /api/admin/roles/:role/permissions'
        },
        languages: {
          list: 'GET /api/admin/languages',
          create: 'POST /api/admin/languages',
          detail: 'GET /api/admin/languages/:id',
          update: 'PUT /api/admin/languages/:id',
          toggle: 'PATCH /api/admin/languages/:id/toggle',
          delete: 'DELETE /api/admin/languages/:id',
          setDefault: 'PATCH /api/admin/languages/default',
          getSettings: 'GET /api/admin/languages/settings',
          updateSettings: 'PUT /api/admin/languages/settings'
        },
        media: {
          list: 'GET /api/admin/media',
          upload: 'POST /api/admin/media/upload',
          delete: 'DELETE /api/admin/media/:publicId'
        },
        stats: {
          dashboard: 'GET /api/admin/stats/dashboard',
          articles: 'GET /api/admin/stats/articles',
          traffic: 'GET /api/admin/stats/traffic'
        },
        advertising: {
          list: 'GET /api/admin/advertising/zones',
          stats: 'GET /api/admin/advertising/zones/stats',
          detail: 'GET /api/admin/advertising/zones/:id',
          create: 'POST /api/admin/advertising/zones',
          update: 'PATCH /api/admin/advertising/zones/:id',
          toggle: 'PATCH /api/admin/advertising/zones/:id/toggle',
          delete: 'DELETE /api/admin/advertising/zones/:id',
        },
        banners:{
          list: 'GET /api/admin/advertising/zones/:zoneId/banners',
          create: 'POST /api/admin/advertising/banners',
          update: 'PATCH /api/admin/advertising/banners/:id',
          delete: 'DELETE /api/admin/advertising/banners/:id',
          refreshStatuses: 'POST /api/admin/advertising/banners/refresh-statuses',
        },
        thirdPartyCodes: {
          get: 'GET /api/admin/advertising/third-party',
          upsert: 'PUT /api/admin/advertising/third-party',
        },
      },
      emploi: {
        auth: {
          register:       'POST /api/emploi/auth/register',
          login:          'POST /api/emploi/auth/login',
          me:             'GET  /api/emploi/auth/me',
          changePassword: 'PATCH /api/emploi/auth/password',
        },
        public: {
          jobs:     'GET /api/emploi/jobs',
          job:      'GET /api/emploi/jobs/:id',
          vitrine:  'GET /api/emploi/vitrines/:etablissementId',
        },
        candidat: {
          dashboard:    'GET   /api/emploi/candidat/dashboard',
          profil:       'GET   /api/emploi/candidat/profil',
          updateProfil: 'PATCH /api/emploi/candidat/profil/identity',
          skills:       'PATCH /api/emploi/candidat/profil/skills',
          visibility:   'PATCH /api/emploi/candidat/profil/visibility',
          avatar:       'POST  /api/emploi/candidat/profil/avatar',
          cv:           'POST  /api/emploi/candidat/profil/cv',
          experiences:  'POST  /api/emploi/candidat/profil/experiences',
          formations:   'POST  /api/emploi/candidat/profil/formations',
          applications: 'GET   /api/emploi/candidat/applications',
          apply:        'POST  /api/emploi/candidat/applications',
          withdraw:     'DELETE /api/emploi/candidat/applications/:id',
          suggestions:  'GET   /api/emploi/candidat/suggestions',
          alertes:      'GET   /api/emploi/candidat/alertes',
          notifications:'GET   /api/emploi/candidat/notifications',
          settings:     'GET   /api/emploi/candidat/settings',
        },
        recruteur: {
          profile:        'GET   /api/emploi/recruteur/profile',
          switchEtab:     'PATCH /api/emploi/recruteur/profile/etablissement',
          dashboard:      'GET   /api/emploi/recruteur/dashboard',
          offres:         'GET   /api/emploi/recruteur/offres',
          createOffre:    'POST  /api/emploi/recruteur/offres',
          updateOffre:    'PATCH /api/emploi/recruteur/offres/:id',
          offreStatus:    'PATCH /api/emploi/recruteur/offres/:id/status',
          duplicateOffre: 'POST  /api/emploi/recruteur/offres/:id/duplicate',
          vitrine:        'GET   /api/emploi/recruteur/vitrine',
          updateVitrine:  'PATCH /api/emploi/recruteur/vitrine',
          candidatures:   'GET   /api/emploi/recruteur/candidatures',
          updateStatus:   'PATCH /api/emploi/recruteur/candidatures/:id/status',
          notes:          'PATCH /api/emploi/recruteur/candidatures/:id/notes',
          message:        'POST  /api/emploi/recruteur/candidatures/:id/message',
        },
      },
    },
 
    features: {
      authentication: '✅ JWT Bearer Token',
      fileUpload: '✅ Cloudinary Integration',
      rateLimit: '✅ 100 req/15min',
      cors: '✅ Enabled',
      validation: '✅ Zod Schemas',
      newsletter: '✅ Newsletter Management',
      magazine: '✅ Subscription Plans',
      partners: '✅ Partnership Contacts',
      annonceurs: '✅ Advertiser Contact Forms',
      editorial: '✅ Editorial Contact Forms',
      destinations: '✅ Featured Destinations',
      destinationPartnership: '✅ Destination Partnership Forms',
      devis: '✅ Quote Request Forms',
      generalContact: '✅ General Contact Form',
      tags: '✅ Tags Management',
      settings: '✅ Site Settings',
      chatbot: '✅ Chatbot & FAQ Management',
      users: '✅ Users & Roles Management',
      languages: '✅ Multilingual Management'
    },
  });
});
 
export default router;