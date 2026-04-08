// prisma/seed.ts
import { PrismaClient, BannerType, BannerStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...\n');

  // ========================================
  // NETTOYAGE DES ANCIENS ARTICLES
  // ========================================
  console.log('🧹 Nettoyage des anciens articles...');

  await prisma.article.deleteMany({});

console.log('✅ Anciens articles supprimés\n');

  // ========================================
  // 1. UTILISATEURS
  // ========================================
  console.log('👤 Création des utilisateurs...');
  
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@itourisme-nomade.com' },
    update: {},
    create: {
      email: 'admin@itourisme-nomade.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: 'editor@itourisme-nomade.com' },
    update: {},
    create: {
      email: 'editor@itourisme-nomade.com',
      password: hashedPassword,
      name: 'Éditeur Principal',
      role: 'EDITOR',
    },
  });

  console.log('✅ Utilisateurs créés\n');

  // ========================================
  // 2. CATÉGORIES
  // Deux axes distincts :
  //   - TYPE DE CONTENU (pour le routing/affichage)
  //   - SECTEUR TOURISTIQUE (pour le filtrage thématique)
  // ========================================
  console.log('📁 Création des catégories...');

  // --- Types de contenu ---
  const contentTypes = [
    { name: 'Actualités',        slug: 'actualites',        description: 'Les dernières nouvelles du tourisme',           type: 'MAGAZINE' as const, order: 1 },
    { name: 'Reportages Salons', slug: 'reportages-salons', description: 'Couverture des grands salons du tourisme',      type: 'MAGAZINE' as const, order: 2 },
    { name: 'Interviews',        slug: 'interviews',        description: 'Rencontres avec les acteurs du tourisme',       type: 'MAGAZINE' as const, order: 3 },
    { name: 'Destinations',      slug: 'destinations',      description: 'Découvrez nos destinations phares',             type: 'DESTINATION' as const, order: 4 },
    { name: 'Analyses',          slug: 'analyses',          description: 'Analyses approfondies du secteur',              type: 'MAGAZINE' as const, order: 5 },
    { name: 'Magazine',          slug: 'magazine',          description: 'Nos éditions du magazine',                     type: 'MAGAZINE' as const, order: 6 },
  ];

  // --- Secteurs touristiques ---
  const sectors = [
    { name: 'Hôtellerie',            slug: 'hotellerie',           description: 'Hébergement haut de gamme et tendances hôtelières', type: 'MAGAZINE' as const, order: 10 },
    { name: 'Transport',             slug: 'transport',            description: 'Aérien, maritime, ferroviaire et mobilité',          type: 'MAGAZINE' as const, order: 11 },
    { name: 'Restauration',          slug: 'restauration',         description: 'Gastronomie, street food et expériences culinaires', type: 'MAGAZINE' as const, order: 12 },
    { name: 'Voyages d\'Affaires',   slug: 'voyages-affaires',     description: 'Business travel, bleisure et travel management',    type: 'MAGAZINE' as const, order: 13 },
    { name: 'MICE & Événements',     slug: 'mice-evenements',      description: 'Congrès, incentives, conférences et événements pro', type: 'MAGAZINE' as const, order: 14 },
    { name: 'Divertissement',        slug: 'divertissement',       description: 'Culture, loisirs, parcs et expériences',            type: 'MAGAZINE' as const, order: 15 },
    { name: 'Tourisme Durable',      slug: 'tourisme-durable',     description: 'Éco-tourisme, tourisme responsable et bas-carbone', type: 'MAGAZINE' as const, order: 16 },
  ];

  const createdCategories: Record<string, { id: number }> = {};
  
  for (const cat of [...contentTypes, ...sectors]) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = category;
  }

  console.log('✅ Catégories créées\n');

  // ========================================
  // 3. DESTINATIONS
  // ========================================
  console.log('🌍 Création des destinations...');

  const destinations = [
    { name: 'Sénégal',      slug: 'senegal',     description: 'Terre de la Téranga, plages paradisiaques et hospitalité légendaire.',                                         coverImage: 'https://images.unsplash.com/photo-1609198092357-8868e6c06fbc', continent: 'AFRIQUE', featured: true,  status: 'PUBLISHED' },
    { name: 'Côte d\'Ivoire', slug: 'cote-ivoire', description: 'La perle de l\'Afrique de l\'Ouest, entre modernité d\'Abidjan et traditions ancestrales.',                  coverImage: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44', continent: 'AFRIQUE', featured: true,  status: 'PUBLISHED' },
    { name: 'Maroc',        slug: 'maroc',       description: 'Entre traditions millénaires et modernité, diversité culturelle et paysages époustouflants.',                   coverImage: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43', continent: 'AFRIQUE', featured: true,  status: 'PUBLISHED' },
    { name: 'Kenya',        slug: 'kenya',       description: 'Safaris inoubliables et plages de rêve, destination idéale pour les amoureux de la nature.',                   coverImage: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53', continent: 'AFRIQUE', featured: false, status: 'PUBLISHED' },
    { name: 'Tanzanie',     slug: 'tanzanie',    description: 'Du Kilimandjaro à Zanzibar, aventure et détente en un même voyage.',                                           coverImage: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5', continent: 'AFRIQUE', featured: false, status: 'PUBLISHED' },
    { name: 'Cap-Vert',     slug: 'cap-vert',    description: 'Archipel aux multiples facettes, entre musique créole et plages volcaniques.',                                 coverImage: 'https://images.unsplash.com/photo-1578070181910-f1e514afdd08', continent: 'AFRIQUE', featured: true,  status: 'PUBLISHED' },
    { name: 'Bénin',        slug: 'benin',       description: 'Berceau du vaudou, le Bénin surprend par son patrimoine royal et ses villages lacustres uniques.',             coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64', continent: 'AFRIQUE', featured: true,  status: 'PUBLISHED' },
    { name: 'Rwanda',       slug: 'rwanda',      description: 'Le pays des mille collines, pionnier du tourisme durable et de la préservation des gorilles.',                 coverImage: 'https://images.unsplash.com/photo-1609743522653-52354461eb27', continent: 'AFRIQUE', featured: false, status: 'PUBLISHED' },
  ];

  for (const dest of destinations) {
    await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: dest,
      create: dest,
    });
  }

  console.log('✅ Destinations créées\n');

  // ========================================
  // 4. ARTICLES HERO (featured: true, 3 articles)
  // ========================================
  console.log('📰 Création des articles Hero...');

  const heroArticles = [
    {
      title: 'IFTM Top Resa 2024 : Les Tendances du Tourisme Africain',
      slug: 'iftm-top-resa-2024-tendances-tourisme-africain',
      excerpt: 'Retour sur les temps forts du plus grand salon professionnel du tourisme avec un focus particulier sur les destinations africaines en pleine expansion.',
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      content: [
        { type: 'text', value: 'Le salon IFTM Top Resa 2024 a fermé ses portes avec un bilan exceptionnel pour les destinations africaines. Plus de 50 offices de tourisme du continent étaient présents.' },
        { type: 'heading', value: 'Un engouement sans précédent' },
        { type: 'text', value: 'Les visiteurs ont montré un intérêt croissant pour les destinations d\'Afrique de l\'Ouest, en particulier le Sénégal, la Côte d\'Ivoire et le Cap-Vert.' },
        { type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      ],
      categoryId: createdCategories['reportages-salons'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      featured: true,
      metaTitle: 'IFTM Top Resa 2024 - Tourisme Africain',
      metaDescription: 'Découvrez les tendances du tourisme africain présentées à IFTM Top Resa 2024',
    },
    {
      title: 'Le Sénégal, Nouvelle Destination Tendance pour 2025',
      slug: 'senegal-destination-tendance-2025',
      excerpt: 'Avec ses plages paradisiaques, sa culture vibrante et son hospitalité légendaire, le Sénégal s\'impose comme la destination incontournable de 2025.',
      coverImage: 'https://images.unsplash.com/photo-1773842136514-2527444ed71f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      content: [
        { type: 'text', value: 'Le Sénégal connaît une croissance touristique remarquable avec une augmentation de 35% des arrivées internationales en 2024.' },
        { type: 'heading', value: 'Des infrastructures modernisées' },
        { type: 'text', value: 'L\'ouverture du nouvel aéroport international Blaise Diagne facilite l\'accès à cette destination de rêve.' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1564759298141-cef86f51d0b4' },
      ],
      categoryId: createdCategories['actualites'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      featured: true,
      metaTitle: 'Sénégal Destination 2025',
      metaDescription: 'Pourquoi le Sénégal est la destination touristique incontournable de 2025',
    },
    {
      title: 'Interview Exclusive : Le Ministre du Tourisme Ivoirien',
      slug: 'interview-ministre-tourisme-cote-ivoire',
      excerpt: 'Rencontre avec le Ministre du Tourisme de Côte d\'Ivoire qui nous dévoile la nouvelle stratégie de développement touristique du pays à l\'horizon 2030.',
      coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
      content: [
        { type: 'text', value: 'Dans cette interview exclusive, le Ministre présente la vision ambitieuse de la Côte d\'Ivoire pour devenir une destination touristique majeure en Afrique de l\'Ouest.' },
        { type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { type: 'heading', value: 'Les grands projets en cours' },
        { type: 'text', value: 'Modernisation des sites touristiques, création de zones touristiques intégrées et formation de 10 000 professionnels du secteur.' },
      ],
      categoryId: createdCategories['interviews'].id,
      authorId: editor.id,
      status: 'PUBLISHED',
      featured: true,
      metaTitle: 'Interview Ministre Tourisme Côte d\'Ivoire',
      metaDescription: 'Stratégie touristique de la Côte d\'Ivoire - Interview exclusive',
    },
  ];

  for (const article of heroArticles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article as any,
    });
  }

  console.log('✅ Articles Hero créés\n');

  // ========================================
  // 5. ACTUALITÉS PAR SECTEUR (≥3 par secteur)
  // ========================================
  console.log('📰 Création des actualités par secteur...');

  const sectorArticles = [
    // ── TRANSPORT (4 articles) ─────────────────────────────────────────────────
    {
      title: 'Air Sénégal Lance une Nouvelle Liaison Paris-Dakar',
      slug: 'air-senegal-nouvelle-liaison-paris-dakar',
      excerpt: 'La compagnie nationale sénégalaise renforce sa desserte européenne avec 5 vols hebdomadaires opérés en A330neo.',
      coverImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05',
      content: [
        { type: 'text', value: 'Air Sénégal annonce le lancement d\'une nouvelle liaison directe entre Paris-CDG et Dakar, opérée en A330neo dès juillet 2025.' },
      ],
      categoryId: createdCategories['transport'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      featured: false,
    },
    {
      title: 'Royal Air Maroc Ouvre la Ligne Casablanca-Cotonou',
      slug: 'royal-air-maroc-casablanca-cotonou',
      excerpt: 'Trois vols par semaine relieront désormais le Maroc au Bénin, facilitant les connexions pour toute l\'Afrique de l\'Ouest.',
      coverImage: 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?w=1280',
      content: [
        { type: 'text', value: 'Royal Air Maroc inaugure sa 35e destination africaine avec cette liaison qui s\'ouvre en juin 2025.' },
        { type: 'text', value: 'Les voyageurs béninois bénéficieront d\'une connexion directe vers Casablanca avant tout vol transatlantique.' },
      ],
      categoryId: createdCategories['transport'].id,
      authorId: editor.id,
      status: 'PUBLISHED',
      featured: false,
    },
    {
      title: 'Zanzibar : Nouvelles Liaisons Aériennes depuis l\'Europe',
      slug: 'zanzibar-nouvelles-liaisons-europe',
      excerpt: 'L\'archipel tanzanien devient plus accessible avec des vols directs depuis 5 capitales européennes dès l\'été 2025.',
      coverImage: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?w=1280',
      content: [
        { type: 'text', value: 'Zanzibar renforce sa connectivité avec l\'Europe grâce à de nouvelles liaisons directes depuis Paris, Londres, Amsterdam, Rome et Vienne.' },
      ],
      categoryId: createdCategories['transport'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      featured: false,
    },
    {
      title: 'Le Train à Grande Vitesse Maroc-Afrique : Mythe ou Réalité ?',
      slug: 'tgv-maroc-afrique-perspective',
      excerpt: 'Après le succès du TGV Tanger-Casablanca, le Maroc étudie des corridors ferroviaires vers l\'Afrique subsaharienne.',
      coverImage: 'https://images.pexels.com/photos/302428/pexels-photo-302428.jpeg?w=1280',
      content: [
        { type: 'text', value: 'L\'ONCF marocain a commandé une étude de faisabilité pour un couloir ferroviaire vers la Mauritanie, première étape d\'un grand projet panafricain.' },
      ],
      categoryId: createdCategories['transport'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      featured: false,
    },

    // ── HÔTELLERIE (4 articles) ────────────────────────────────────────────────
    {
      title: 'Accor Ouvre son Premier Hôtel de Luxe à Abidjan',
      slug: 'accor-hotel-luxe-abidjan-2025',
      excerpt: 'Le groupe Accor inaugure le Sofitel Abidjan Plateau, 280 chambres avec vue panoramique sur la lagune Ébrié.',
      coverImage: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791',
      content: [
        { type: 'text', value: 'Le Sofitel Abidjan Plateau ouvre ses portes avec 280 chambres, 5 restaurants et un spa de 1 500 m².' },
        { type: 'heading', value: 'Un investissement de 80 millions d\'euros' },
        { type: 'text', value: 'Cet hôtel symbolise la montée en gamme de l\'offre hôtelière ivoirienne à l\'horizon 2025.' },
      ],
      categoryId: createdCategories['hotellerie'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      featured: false,
    },
    {
      title: 'Le Bénin Marina Hôtel Rénove ses Suites Présidentielles',
      slug: 'benin-marina-hotel-renovation-suites',
      excerpt: 'La rénovation de 12 suites présidentielles positionne l\'établissement phare de Cotonou en haut de gamme MICE.',
      coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      content: [
        { type: 'text', value: 'Après 18 mois de travaux, le Bénin Marina Hôtel dévoile ses nouvelles suites et ses espaces de réception rénovés.' },
        { type: 'text', value: 'La capacité MICE passe à 1 200 personnes, renforçant la position de Cotonou comme hub régional.' },
      ],
      categoryId: createdCategories['hotellerie'].id,
      authorId: editor.id,
      status: 'PUBLISHED',
      featured: false,
    },
    {
      title: 'Marriott s\'Implante à Dakar avec un Hôtel de 300 Chambres',
      slug: 'marriott-dakar-300-chambres',
      excerpt: 'Le groupe américain confirme son premier établissement au Sénégal, prévu pour l\'horizon 2026.',
      coverImage: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
      content: [
        { type: 'text', value: 'Marriott International signe un accord de développement avec un promoteur dakarois pour l\'ouverture d\'un Westin à Dakar Plateau.' },
      ],
      categoryId: createdCategories['hotellerie'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      featured: false,
    },
    {
      title: 'Les Écolodges au Cœur de la Nouvelle Hôtellerie Africaine',
      slug: 'ecolodges-hotellerie-africaine-tendance',
      excerpt: 'De l\'Okavango au Bénin, les écolodges premium redéfinissent l\'hébergement haut de gamme sur le continent.',
      coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      content: [
        { type: 'text', value: 'La demande pour des hébergements durables a explosé de 42% en Afrique subsaharienne selon l\'OMT.' },
        { type: 'text', value: 'Des établissements comme le Bisate Lodge au Rwanda ou le Ganvié Floating Lodge au Bénin font figure de références.' },
      ],
      categoryId: createdCategories['hotellerie'].id,
      authorId: editor.id,
      status: 'PUBLISHED',
      featured: false,
    },

    // ── RESTAURATION (3 articles) ──────────────────────────────────────────────
    {
      title: 'Gastronomie Africaine : La Grande Percée sur la Scène Mondiale',
      slug: 'gastronomie-africaine-percee-mondiale',
      excerpt: 'Des chefs comme Dieuveil Malonga ou Fatmata Bah bouleversent les codes de la haute cuisine et mettent l\'Afrique sur la carte gastronomique.',
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
      content: [
        { type: 'text', value: 'Le restaurant Meza Malonga à Kigali vient d\'entrer dans la liste des 50 meilleurs restaurants africains 2025, propulsant la cuisine congolaise sous les feux de la rampe.' },
        { type: 'heading', value: 'Le mouvement Afro-fine dining' },
        { type: 'text', value: 'De Lagos à Dakar, une nouvelle génération de chefs réinterprète les recettes ancestrales avec des techniques modernes.' },
      ],
      categoryId: createdCategories['restauration'].id,
      authorId: editor.id,
      status: 'PUBLISHED',
      featured: false,
    },
    {
      title: 'Street Food à Cotonou : Un Circuit Gastronomique en Plein Essor',
      slug: 'street-food-cotonou-circuit-gastronomique',
      excerpt: 'La capitale économique béninoise développe un parcours street food guidé qui attire les touristes curieux de saveurs authentiques.',
      coverImage: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
      content: [
        { type: 'text', value: 'Le circuit "Goût de Cotonou" propose 8 arrêts incontournables : pâte noire, agouti grillé, akassa et tchoukoutou dans les meilleurs bouis-bouis de la ville.' },
      ],
      categoryId: createdCategories['restauration'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      featured: false,
    },
    {
      title: 'Les Restaurants Halal de Référence au Maroc en 2025',
      slug: 'restaurants-halal-maroc-guide-2025',
      excerpt: 'Sélection des meilleures adresses pour une gastronomie marocaine authentique certifiée halal, de Marrakech à Fès.',
      coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
      content: [
        { type: 'text', value: 'Le guide Michelin Maroc 2025 inclut pour la première fois une sélection spécifique halal, reconnue par 8 restaurants marocains.' },
      ],
      categoryId: createdCategories['restauration'].id,
      authorId: editor.id,
      status: 'PUBLISHED',
      featured: false,
    },

    // ── VOYAGES D'AFFAIRES (3 articles) ───────────────────────────────────────
    {
      title: 'Bleisure en Afrique : La Tendance des Voyageurs d\'Affaires',
      slug: 'bleisure-afrique-tendance-voyageurs-affaires',
      excerpt: 'De plus en plus de cadres prolongent leurs déplacements professionnels pour découvrir Abidjan, Nairobi ou Dakar en mode touriste.',
      coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
      content: [
        { type: 'text', value: 'Selon l\'ACTE, 68% des voyageurs d\'affaires africains ajoutent désormais au moins deux nuits leisure à leurs missions.' },
        { type: 'heading', value: 'Les destinations les plus plébiscitées' },
        { type: 'text', value: 'Nairobi, Abidjan et Dakar trustent le top 3 des villes africaines plébiscitées pour le bleisure.' },
      ],
      categoryId: createdCategories['voyages-affaires'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      featured: false,
    },
    {
      title: 'Nouvelles Politiques Visa pour les Businessmen Africains',
      slug: 'visa-businessmen-africains-facilitations-2025',
      excerpt: 'La CEDEAO annonce la suppression du visa d\'affaires entre 12 pays membres, une avancée majeure pour la mobilité professionnelle.',
      coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
      content: [
        { type: 'text', value: 'La suppression du visa d\'affaires entre 12 pays de la CEDEAO entrera en vigueur au 1er janvier 2026, facilitant la mobilité de plus de 3 millions de voyageurs professionnels.' },
      ],
      categoryId: createdCategories['voyages-affaires'].id,
      authorId: editor.id,
      status: 'PUBLISHED',
      featured: false,
    },
    {
      title: 'Les Lounges d\'Aéroport qui Font la Différence en Afrique',
      slug: 'lounges-aeroport-afrique-meilleures-adresses',
      excerpt: 'Notre sélection des salons VIP les mieux équipés pour les voyageurs d\'affaires dans les hubs aériens africains.',
      coverImage: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd',
      content: [
        { type: 'text', value: 'De Lagos Murtala Muhammed au Casablanca Mohammed V en passant par Abidjan Félix Houphouët-Boigny, les lounges africains montent en gamme.' },
      ],
      categoryId: createdCategories['voyages-affaires'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      featured: false,
    },

    // ── MICE & ÉVÉNEMENTS (3 articles) ────────────────────────────────────────
    {
      title: 'Rwanda : Le Tourisme de Congrès en Plein Essor',
      slug: 'rwanda-tourisme-congres-essor',
      excerpt: 'Kigali s\'impose comme une destination de premier plan pour les événements professionnels internationaux grâce à ses infrastructures modernes.',
      coverImage: 'https://images.unsplash.com/photo-1609743522653-52354461eb27',
      content: [
        { type: 'text', value: 'Le Kigali Convention Centre a accueilli 42 congrès internationaux en 2024, faisant du Rwanda la 3e destination MICE d\'Afrique subsaharienne.' },
      ],
      categoryId: createdCategories['mice-evenements'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      featured: false,
    },
    {
      title: 'IFTM Top Resa 2025 : Les Dates et Nouveautés',
      slug: 'iftm-top-resa-2025-dates-nouveautes',
      excerpt: 'Marquez vos calendriers ! Le plus grand salon professionnel du tourisme revient du 30 septembre au 3 octobre 2025 à Paris Porte de Versailles.',
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      content: [
        { type: 'text', value: 'L\'IFTM Top Resa 2025 se tiendra à Paris Porte de Versailles du 30 septembre au 3 octobre.' },
        { type: 'heading', value: 'Les nouveautés 2025' },
        { type: 'text', value: 'Cette édition mettra l\'accent sur le tourisme durable et les nouvelles technologies de voyage.' },
      ],
      categoryId: createdCategories['mice-evenements'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      featured: true,
    },
    {
      title: 'Salon International du Tourisme de Dakar : L\'Édition 2025',
      slug: 'salon-tourisme-dakar-2025',
      excerpt: 'Le SITD s\'impose comme le rendez-vous incontournable de la filière touristique en Afrique de l\'Ouest.',
      coverImage: 'https://i.pinimg.com/736x/58/90/42/58904251f1c8fd186a9624ea294d7bbc.jpg',
      content: [
        { type: 'text', value: 'La 5e édition du Salon International du Tourisme de Dakar réunira plus de 200 exposants africains et européens du 12 au 15 mars 2025.' },
      ],
      categoryId: createdCategories['mice-evenements'].id,
      authorId: editor.id,
      status: 'PUBLISHED',
      featured: false,
    },

    // ── DIVERTISSEMENT (3 articles) ───────────────────────────────────────────
    {
      title: 'Festival FESPACO 2025 : Ouagadougou au Cœur du Cinéma Africain',
      slug: 'fespaco-2025-ouagadougou-cinema-africain',
      excerpt: 'Le plus grand festival de cinéma africain revient avec une édition spéciale célébrant les 50 ans de la révolution culturelle panafricaine.',
      coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
      content: [
        { type: 'text', value: 'Le FESPACO 2025 projette plus de 150 films en compétition et accueillera des délégations de 40 pays africains et de la diaspora.' },
        { type: 'text', value: 'Pour les touristes, un pass "Cinéphile" combinant projection, hôtel et navettes est proposé à partir de 120 000 FCFA.' },
      ],
      categoryId: createdCategories['divertissement'].id,
      authorId: editor.id,
      status: 'PUBLISHED',
      featured: false,
    },
    {
      title: 'Safari Nocturne : La Nouvelle Expérience Star des Parcs Africains',
      slug: 'safari-nocturne-experience-parcs-africains',
      excerpt: 'Le Masai Mara, l\'Etosha et le Parc du Niokolo-Koba ouvrent leurs pistes la nuit pour une immersion inédite dans la faune sauvage.',
      coverImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801',
      content: [
        { type: 'text', value: 'Les safaris nocturnes, guidés par des rangers certifiés équipés de lampes infrarouges, permettent d\'observer léopards, hyènes et civettes dans leur habitat naturel.' },
      ],
      categoryId: createdCategories['divertissement'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      featured: false,
    },
    {
      title: 'Parc Aquatique W-Park : Cotonou se Dote d\'un Complexe de Loisirs',
      slug: 'parc-aquatique-w-park-cotonou',
      excerpt: 'Le premier grand parc aquatique béninois ouvre ses portes à Fidjrossè, offrant une alternative de loisirs local pour familles et touristes.',
      coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
      content: [
        { type: 'text', value: 'W-Park Cotonou propose 12 toboggans, une piscine à vagues et un espace food court sur 3 hectares en bord de mer.' },
      ],
      categoryId: createdCategories['divertissement'].id,
      authorId: editor.id,
      status: 'PUBLISHED',
      featured: false,
    },

    // ── TOURISME DURABLE (3 articles) ─────────────────────────────────────────
    {
      title: 'Cap-Vert : Programme de Visa Digital Nomad et Éco-responsabilité',
      slug: 'cap-vert-visa-digital-nomad-eco',
      excerpt: 'L\'archipel combine visa digital nomad et charte verte stricte pour attirer des voyageurs responsables tout au long de l\'année.',
      coverImage: 'https://images.unsplash.com/photo-1578070181910-f1e514afdd08',
      content: [
        { type: 'text', value: 'Le Cap-Vert mise sur les digital nomads éco-responsables avec un nouveau visa facilité valable 6 mois, couplé à une charte de conduite verte.' },
        { type: 'text', value: 'L\'archipel vise la neutralité carbone en 2030 en interdisant les plastiques à usage unique dans tout l\'hôtellerie.' },
      ],
      categoryId: createdCategories['tourisme-durable'].id,
      authorId: editor.id,
      status: 'PUBLISHED',
      featured: false,
    },
    {
      title: 'L\'Éco-Tourisme au Bénin : Ganvié, Modèle de Durabilité',
      slug: 'eco-tourisme-benin-ganvie-durabilite',
      excerpt: 'Le village lacustre de Ganvié développe un modèle de tourisme communautaire vertueux qui fait école en Afrique de l\'Ouest.',
      coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
      content: [
        { type: 'text', value: 'Ganvié, surnommée la "Venise de l\'Afrique", reverse désormais 40% des recettes touristiques directement aux familles du village via une coopérative locale.' },
        { type: 'heading', value: 'Un label international en vue' },
        { type: 'text', value: 'L\'UNESCO étudie l\'attribution d\'un label de tourisme durable au village lacustre, ce qui serait une première pour le Bénin.' },
      ],
      categoryId: createdCategories['tourisme-durable'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      featured: false,
    },
    {
      title: 'Kenya : Le Parc Masai Mara Passe au Solaire à 100%',
      slug: 'masai-mara-energie-solaire-100-pourcent',
      excerpt: 'Le plus célèbre parc safari au monde complète sa transition énergétique et devient la première grande réserve africaine entièrement alimentée en solaire.',
      coverImage: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53',
      content: [
        { type: 'text', value: 'L\'installation de 4 000 panneaux photovoltaïques dans la réserve du Masai Mara éliminent 85 tonnes de CO₂ par an et réduisent les coûts opérationnels de 60%.' },
      ],
      categoryId: createdCategories['tourisme-durable'].id,
      authorId: editor.id,
      status: 'PUBLISHED',
      featured: false,
    },
  ];

  for (const article of sectorArticles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article as any,
    });
  }

  console.log(`✅ ${sectorArticles.length} articles sectoriels créés\n`);

  // // ========================================
  // // 6. VIDÉOS / REPORTAGES (4 articles)
  // // ========================================
  // console.log('🎥 Création des vidéos/reportages...');

  // const videoArticles = [
  //   {
  //     title: 'Reportage IFTM 2024 : Les Coulisses du Plus Grand Salon du Tourisme',
  //     slug: 'reportage-iftm-2024-coulisses',
  //     excerpt: 'Plongez dans les coulisses de l\'IFTM Top Resa 2024 avec notre équipe sur place.',
  //     coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
  //     content: [
  //       { type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  //       { type: 'text', value: 'Découvrez les temps forts du salon IFTM Top Resa 2024 à travers notre reportage exclusif.' },
  //     ],
  //     categoryId: createdCategories['reportages-salons'].id,
  //     authorId: admin.id,
  //     status: 'PUBLISHED',
  //     featured: true,
  //   },
  //   {
  //     title: 'Dakar en 48h : Notre Guide Vidéo Complet',
  //     slug: 'dakar-48h-guide-video',
  //     excerpt: 'Que faire à Dakar en un week-end ? Suivez notre guide vidéo pour ne rien manquer.',
  //     coverImage: 'https://images.unsplash.com/photo-1609198092357-8868e6c06fbc',
  //     content: [
  //       { type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  //       { type: 'text', value: 'De l\'île de Gorée au marché Sandaga, découvrez les incontournables de Dakar.' },
  //     ],
  //     categoryId: createdCategories['destinations'].id,
  //     authorId: editor.id,
  //     status: 'PUBLISHED',
  //     featured: false,
  //   },
  //   {
  //     title: 'Interview : Le Directeur de l\'Office de Tourisme du Maroc',
  //     slug: 'interview-directeur-office-tourisme-maroc',
  //     excerpt: 'Stratégie 2025 du tourisme marocain — Interview exclusive avec le DG de l\'ONMT.',
  //     coverImage: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43',
  //     content: [
  //       { type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  //       { type: 'text', value: 'Le Directeur de l\'ONMT nous dévoile les ambitions du Maroc pour 2025.' },
  //     ],
  //     categoryId: createdCategories['interviews'].id,
  //     authorId: admin.id,
  //     status: 'PUBLISHED',
  //     featured: false,
  //   },
  //   {
  //     title: 'Safari au Kenya : Immersion Totale dans le Masai Mara',
  //     slug: 'safari-kenya-masai-mara-video',
  //     excerpt: 'Vivez un safari inoubliable à travers notre reportage vidéo immersif au cœur du Masai Mara.',
  //     coverImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801',
  //     content: [
  //       { type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  //       { type: 'text', value: 'Grande migration, Big Five... Découvrez les merveilles du Masai Mara.' },
  //     ],
  //     categoryId: createdCategories['destinations'].id,
  //     authorId: editor.id,
  //     status: 'PUBLISHED',
  //     featured: false,
  //   },
  // ];

  // for (const article of videoArticles) {
  //   await prisma.article.upsert({
  //     where: { slug: article.slug },
  //     update: {},
  //     create: article as any,
  //   });
  // }

  // console.log('✅ Vidéos/Reportages créés\n');

  // // ========================================
  // // 7. MAGAZINES (3 numéros)
  // // ========================================
  // console.log('📚 Création des magazines...');

  // const magazineArticles = [
  //   {
  //     title: 'iTourisme Nomade N°12 - Spécial Afrique de l\'Ouest',
  //     slug: 'magazine-n12-special-afrique-ouest',
  //     excerpt: 'Notre dernier numéro explore les trésors cachés de l\'Afrique de l\'Ouest : Sénégal, Côte d\'Ivoire, Ghana et Bénin.',
  //     coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
  //     content: [
  //       { type: 'text', value: 'SOMMAIRE — Dossier spécial : L\'Afrique de l\'Ouest, nouvelle frontière du tourisme mondial.' },
  //       { type: 'heading', value: 'Au sommaire :' },
  //       { type: 'text', value: '• Sénégal : Les 10 expériences incontournables\n• Côte d\'Ivoire : Grand Bassam, la perle coloniale\n• Ghana : Sur les traces de l\'histoire\n• Bénin : Le royaume du vaudou' },
  //     ],
  //     categoryId: createdCategories['magazine'].id,
  //     authorId: admin.id,
  //     status: 'PUBLISHED',
  //     featured: true,
  //     metaTitle: 'Magazine N°12 - Spécial Afrique de l\'Ouest',
  //   },
  //   {
  //     title: 'iTourisme Nomade N°11 - Safaris & Nature',
  //     slug: 'magazine-n11-safaris-nature',
  //     excerpt: 'Partez à l\'aventure avec notre numéro consacré aux plus beaux safaris d\'Afrique : Kenya, Tanzanie, Botswana.',
  //     coverImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801',
  //     content: [
  //       { type: 'text', value: 'Les plus beaux safaris d\'Afrique : Kenya, Tanzanie, Botswana, Namibie.' },
  //     ],
  //     categoryId: createdCategories['magazine'].id,
  //     authorId: admin.id,
  //     status: 'PUBLISHED',
  //     featured: false,
  //   },
  //   {
  //     title: 'iTourisme Nomade N°10 - Îles Paradisiaques',
  //     slug: 'magazine-n10-iles-paradisiaques',
  //     excerpt: 'Zanzibar, Maurice, Seychelles, Cap-Vert... Notre sélection des plus belles îles de l\'Atlantique et de l\'Indien.',
  //     coverImage: 'https://images.unsplash.com/photo-1590076215667-875d4c5d8e5d',
  //     content: [
  //       { type: 'text', value: 'Évadez-vous sur les plus belles îles de l\'Afrique.' },
  //     ],
  //     categoryId: createdCategories['magazine'].id,
  //     authorId: editor.id,
  //     status: 'PUBLISHED',
  //     featured: false,
  //   },
  // ];

  // for (const article of magazineArticles) {
  //   await prisma.article.upsert({
  //     where: { slug: article.slug },
  //     update: {},
  //     create: article as any,
  //   });
  // }

  // console.log('✅ Magazines créés\n');

  // ========================================
  // 8. NEWSLETTER SUBSCRIBERS
  // ========================================
  console.log('📧 Création d\'abonnés newsletter...');

  const subscribers = [
    { email: 'test1@example.com', source: 'website',         type: 'general',            isActive: true },
    { email: 'test2@example.com', source: 'salons_page',     type: 'alerts_salons',      isActive: true },
    { email: 'test3@example.com', source: 'actualites_page', type: 'actualites_page',    isActive: true },
  ];

  for (const sub of subscribers) {
    await prisma.newsletterSubscriber.upsert({
      where: { email: sub.email },
      update: {},
      create: { ...sub, verifiedAt: new Date() },
    });
  }

  console.log('✅ Abonnés newsletter créés\n');

  // ========================================
  // 9. MÉDIAS
  // ========================================
  console.log('🖼️ Création des médias...');

  const mediaFiles = [
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', publicId: 'unsplash/mountain-sunrise',    filename: 'mountain-sunrise.jpg',    altText: 'Mountain sunrise landscape', size: 1200000, mimeType: 'image/jpeg' },
    { url: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1', publicId: 'unsplash/beach-resort',       filename: 'beach-resort.jpg',        altText: 'Beach resort view',          size: 2100000, mimeType: 'image/jpeg' },
    { url: 'https://example.com/files/guide-tourisme.pdf',                   publicId: 'files/guide-tourisme',       filename: 'guide-tourisme.pdf',      altText: 'Guide tourisme PDF',         size:  856000, mimeType: 'application/pdf' },
    { url: 'https://example.com/videos/festival-culturel.mp4',               publicId: 'videos/festival-culturel',   filename: 'festival-culturel.mp4',   altText: 'Festival culturel video',    size: 15300000, mimeType: 'video/mp4' },
    { url: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098',  publicId: 'unsplash/safari-elephants',  filename: 'safari-elephants.jpg',    altText: 'Safari elephants',           size: 3400000, mimeType: 'image/jpeg' },
    { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',     publicId: 'unsplash/architecture-benin', filename: 'architecture-benin.jpg',  altText: 'Architecture Benin',         size: 1800000, mimeType: 'image/jpeg' },
  ];

  for (const media of mediaFiles) {
    await prisma.media.upsert({
      where: { publicId: media.publicId },
      update: {},
      create: media,
    });
  }

  console.log('✅ Médias créés\n');

  // ========================================
  // 10. PUBLICITÉS (Espaces, Bannières, Code tiers)
  // ========================================
  console.log('📢 Création des espaces publicitaires...');

  const now = new Date();
  const daysAgo  = (n: number) => new Date(now.getTime() - n * 86_400_000);
  const daysFrom = (n: number) => new Date(now.getTime() + n * 86_400_000);

  const adZonesData = [
    { name: 'Top Banner Accueil',  slug: 'top-banner-accueil',  width: 728, height: 90,  path: '/accueil',        isEnabled: true  },
    { name: 'Skyscraper Sidebar',  slug: 'skyscraper-sidebar',  width: 160, height: 600, path: '/articles/*',     isEnabled: true  },
    { name: 'Rectangle Moyen',     slug: 'rectangle-moyen',     width: 300, height: 250, path: '/destinations/*', isEnabled: false },
    { name: 'Leaderboard Footer',  slug: 'leaderboard-footer',  width: 728, height: 90,  path: '/',               isEnabled: true  },
    { name: 'Large Rectangle',     slug: 'large-rectangle',     width: 336, height: 280, path: '/videos/*',       isEnabled: true  },
    { name: 'Mobile Banner',       slug: 'mobile-banner',       width: 320, height: 50,  path: '/',               isEnabled: true  },
  ];

  const bannersData = [
    {
      zoneSlug: 'top-banner-accueil',
      banners: [
        { advertiser: 'Agence Voyage Plus',        campaign: 'Campagne Été 2024',           type: BannerType.IMAGE_JPG, imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/ad-banners/agence_voyage_plus_728x90.jpg', publicId: 'ad-banners/agence_voyage_plus_728x90', htmlCode: null, startDate: daysAgo(30), endDate: daysFrom(62),  status: BannerStatus.ACTIF  },
        { advertiser: 'Office de Tourisme du Bénin', campaign: 'Promotion Été 2024',        type: BannerType.IMAGE_JPG, imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/ad-banners/otb_728x90.jpg',              publicId: 'ad-banners/otb_728x90',              htmlCode: null, startDate: daysAgo(15), endDate: daysFrom(75),  status: BannerStatus.ACTIF  },
        { advertiser: 'Google AdSense',             campaign: 'Code Automatique 2024',      type: BannerType.HTML_JS,  imageUrl: null, publicId: null, htmlCode: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script><ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="1234567890"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`, startDate: daysAgo(45), endDate: daysFrom(210), status: BannerStatus.ACTIF  },
        { advertiser: 'Hôtel Babo Beach Resort',    campaign: 'Lancement Saison Sèche 2025', type: BannerType.IMAGE_JPG, imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/ad-banners/babo_beach_728x90.jpg',    publicId: 'ad-banners/babo_beach_728x90',       htmlCode: null, startDate: daysFrom(15), endDate: daysFrom(105), status: BannerStatus.FUTUR },
      ],
    },
    {
      zoneSlug: 'skyscraper-sidebar',
      banners: [
        { advertiser: 'Air Côte d\'Ivoire',  campaign: 'Vols Cotonou–Abidjan Printemps', type: BannerType.IMAGE_JPG, imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/ad-banners/air_ci_160x600.jpg',     publicId: 'ad-banners/air_ci_160x600',     htmlCode: null, startDate: daysAgo(20), endDate: daysFrom(40), status: BannerStatus.ACTIF },
        { advertiser: 'Ecobank Bénin',       campaign: 'Prêt Tourisme & Loisirs',       type: BannerType.IMAGE_JPG, imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/ad-banners/ecobank_160x600.jpg',     publicId: 'ad-banners/ecobank_160x600',     htmlCode: null, startDate: daysAgo(10), endDate: daysFrom(80), status: BannerStatus.ACTIF },
        { advertiser: 'Sèmè Beach Hôtel',   campaign: 'Forfait Week-end Détente',       type: BannerType.HTML_JS,  imageUrl: null, publicId: null, htmlCode: `<div style="width:160px;height:600px;overflow:hidden;"><iframe src="https://ads.seme-beach.bj/iframe/160x600" width="160" height="600" frameborder="0" scrolling="no"></iframe></div>`, startDate: daysAgo(5), endDate: daysFrom(55), status: BannerStatus.ACTIF },
      ],
    },
    {
      zoneSlug: 'rectangle-moyen',
      banners: [
        { advertiser: 'Bénin Marina Hôtel', campaign: 'Offre MICE 2024', type: BannerType.IMAGE_JPG, imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/ad-banners/marina_hotel_300x250.jpg', publicId: 'ad-banners/marina_hotel_300x250', htmlCode: null, startDate: daysAgo(90), endDate: daysAgo(1), status: BannerStatus.EXPIRE },
      ],
    },
    {
      zoneSlug: 'leaderboard-footer',
      banners: [
        { advertiser: 'MTN Bénin',       campaign: 'MTN Travel SIM – Roaming Afrique',  type: BannerType.IMAGE_JPG, imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/ad-banners/mtn_728x90.jpg', publicId: 'ad-banners/mtn_728x90', htmlCode: null, startDate: daysAgo(7),  endDate: daysFrom(53),  status: BannerStatus.ACTIF  },
        { advertiser: 'Royal Air Maroc', campaign: 'Cotonou–Casablanca Connexion',       type: BannerType.IMAGE_JPG, imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/ad-banners/ram_728x90.jpg', publicId: 'ad-banners/ram_728x90', htmlCode: null, startDate: daysFrom(30), endDate: daysFrom(120), status: BannerStatus.FUTUR },
      ],
    },
    {
      zoneSlug: 'large-rectangle',
      banners: [
        { advertiser: 'Ganvié Éco-Tourisme', campaign: 'Découverte Village Lacustre',  type: BannerType.IMAGE_JPG, imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/ad-banners/ganvie_336x280.jpg',   publicId: 'ad-banners/ganvie_336x280',   htmlCode: null, startDate: daysAgo(12), endDate: daysFrom(48),  status: BannerStatus.ACTIF },
        { advertiser: 'Songhaï Bénin',       campaign: 'Agro-Tourisme Porto-Novo',     type: BannerType.IMAGE_JPG, imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/ad-banners/songhai_336x280.jpg',  publicId: 'ad-banners/songhai_336x280',  htmlCode: null, startDate: daysAgo(3),  endDate: daysFrom(87),  status: BannerStatus.ACTIF },
        { advertiser: 'Google AdSense',       campaign: 'Auto-placement Vidéo',         type: BannerType.HTML_JS,  imageUrl: null, publicId: null, htmlCode: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script><ins class="adsbygoogle" style="display:inline-block;width:336px;height:280px" data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="9876543210"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`, startDate: daysAgo(60), endDate: daysFrom(300), status: BannerStatus.ACTIF },
      ],
    },
    {
      zoneSlug: 'mobile-banner',
      banners: [
        { advertiser: 'Moov Africa Bénin',      campaign: 'Data Roaming – Forfait Voyageur', type: BannerType.IMAGE_JPG, imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/ad-banners/moov_320x50.jpg',   publicId: 'ad-banners/moov_320x50',   htmlCode: null, startDate: daysAgo(8),  endDate: daysFrom(22), status: BannerStatus.ACTIF },
        { advertiser: 'Taxi-Bénin App',          campaign: 'Téléchargez l\'app – Été 2024',  type: BannerType.HTML_JS,  imageUrl: null, publicId: null, htmlCode: `<div id="taxi-benin-ad" style="width:320px;height:50px;background:#f97316;display:flex;align-items:center;justify-content:space-between;padding:0 12px;border-radius:6px;font-family:sans-serif;"><span style="color:#fff;font-size:13px;font-weight:600;">🚕 Taxi-Bénin — Réservez en 1 clic</span><a href="https://taxibenin.bj/app" style="color:#fff;font-size:11px;border:1px solid rgba(255,255,255,.6);padding:3px 8px;border-radius:4px;text-decoration:none;">Télécharger</a></div>`, startDate: daysAgo(2), endDate: daysFrom(28), status: BannerStatus.ACTIF },
        { advertiser: 'Festival Vodoun Ouidah', campaign: 'Billetterie Festival 2025',       type: BannerType.IMAGE_JPG, imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/ad-banners/vodoun_320x50.jpg', publicId: 'ad-banners/vodoun_320x50', htmlCode: null, startDate: daysFrom(60), endDate: daysFrom(95), status: BannerStatus.FUTUR },
      ],
    },
  ];

  const thirdPartyCodeData = { code:`<!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
      <!-- End Google Tag Manager -->

      <!-- Google Ad Manager (GPT) -->
      <script async src="https://www.googletagservices.com/tag/js/gpt.js"></script>
      <script>
        window.googletag = window.googletag || {cmd: []};
        googletag.cmd.push(function() {
          googletag.defineSlot('/XXXXXXXX/itourisme_top_banner', [728, 90], 'div-gpt-ad-top').addService(googletag.pubads());
          googletag.defineSlot('/XXXXXXXX/itourisme_sidebar', [160, 600], 'div-gpt-ad-sidebar').addService(googletag.pubads());
          googletag.pubads().enableSingleRequest();
          googletag.enableServices();
        });
    </script>`,
  };

async function seedAdSpaces() {
  console.log("🌱 Seed — Espaces Publicitaires...\n");

    await prisma.$transaction(async (tx) => {

      // ─────────────────────────────────────────────
      // 1. ZONES (UPSERT)
      // ─────────────────────────────────────────────
      const createdZones: Record<string, number> = {};

      for (const zone of adZonesData) {
        const created = await tx.advertising.upsert({
          where: { slug: zone.slug },

          update: {},

          create: {
            name: zone.name,
            slug: zone.slug,
            width: zone.width,
            height: zone.height,
            path: zone.path,
            isEnabled: zone.isEnabled ?? true,
          },
        });

        createdZones[zone.slug] = created.id;

        console.log(`✓ Zone upsert : ${zone.name}`);
      }

      // ─────────────────────────────────────────────
      // 2. BANNERS (UPSERT)
      // ─────────────────────────────────────────────
      let totalBanners = 0;

      const computeStatus = (start: Date, end: Date): BannerStatus => {
        const now = new Date();
        if (end < now) return BannerStatus.EXPIRE;
        if (start > now) return BannerStatus.FUTUR;
        return BannerStatus.ACTIF;
      };

      for (const group of bannersData) {
        const zoneId = createdZones[group.zoneSlug];

        if (!zoneId) {
          console.warn(`⚠ Zone introuvable: ${group.zoneSlug}`);
          continue;
        }

        for (const banner of group.banners) {

          // 🔒 Validation minimale
          if (new Date(banner.startDate) >= new Date(banner.endDate)) {
            console.warn(`⚠ Dates invalides pour ${banner.campaign}`);
            continue;
          }

          if (banner.type === "HTML_JS" && !banner.htmlCode) {
            console.warn(`⚠ HTML manquant pour ${banner.campaign}`);
            continue;
          }

          const startDate = new Date(banner.startDate);
          const endDate = new Date(banner.endDate);

          const cleanData = {
            advertiser: banner.advertiser,
            campaign: banner.campaign,
            type: banner.type,
            htmlCode: banner.type === "HTML_JS" ? banner.htmlCode : null,
            imageUrl: banner.type === "IMAGE_JPG" ? banner.imageUrl : null,
            publicId: banner.type === "IMAGE_JPG" ? banner.publicId : null,
            startDate,
            endDate,
            status: computeStatus(startDate, endDate),
          };

          await tx.banner.upsert({
            where: {
              campaign_advertisingId: {
                campaign: banner.campaign,
                advertisingId: zoneId,
              },
            },

            update: {},

            create: {
              ...cleanData,
              advertisingId: zoneId,
            },
          });

          totalBanners++;
        }

        console.log(`✓ ${group.banners.length} bannières (zone: ${group.zoneSlug})`);
      }

      // ─────────────────────────────────────────────
      // 3. CODE TIERS (UPSERT)
      // ─────────────────────────────────────────────
      await tx.thirdPartyCode.upsert({
        where: { id: 1 },

        update: {},

        create: {
          id: 1,
          code: thirdPartyCodeData.code,
        },
      });

      console.log("✓ Code tiers upsert");
    });

    // ─────────────────────────────────────────────
    // RÉCAP
    // ─────────────────────────────────────────────
    console.log(`
  ┌─────────────────────────────────────────────┐
  │ ✅ Seed terminé                            │
  │ Zones : ${adZonesData.length}                         │
  │ Bannières : OK                          │
  │ Code tiers : 1                          │
  └─────────────────────────────────────────────┘
  `);
};





  // ========================================
  // STATISTIQUES FINALES
  // ========================================
  console.log('\n📊 STATISTIQUES FINALES:');

  const stats = {
    users: await prisma.user.count(),
    categories: await prisma.category.count(),
    destinations: await prisma.destination.count(),
    articles: await prisma.article.count(),
    articlesFeatured: await prisma.article.count({ where: { featured: true } }),
    articlesPublished: await prisma.article.count({ where: { status: 'PUBLISHED' } }),
    newsletterSubscribers: await prisma.newsletterSubscriber.count(),
  };

  console.log(`
  👤 Utilisateurs: ${stats.users}
  📁 Catégories: ${stats.categories}
  🌍 Destinations: ${stats.destinations}
  📰 Articles totaux: ${stats.articles}
  ⭐ Articles à la une: ${stats.articlesFeatured}
  ✅ Articles publiés: ${stats.articlesPublished}
  📧 Abonnés newsletter: ${stats.newsletterSubscribers}
  `);

  console.log('🎉 Seeding terminé avec succès !');

  await seedAdSpaces();
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });