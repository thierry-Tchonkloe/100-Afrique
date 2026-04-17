// prisma/migrations/recategorize-magazines.ts
// Exécuter avec : npx ts-node prisma/migrations/recategorize-magazines.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Correspondance source → catégorie ──────────────────────────────────────
// Ajoutez ici chaque nom de source avec la catégorie cible
const SOURCE_TO_CATEGORY: Record<string, string> = {
  // Hôtellerie
  'Hotel Management Africa':  'hotellerie',
  'Hospitality Net Africa':   'hotellerie',
  'Lodging Magazine':         'hotellerie',
  'Africa Hotel Review':      'hotellerie',
  'Getaway Magazine':         'hotellerie',
  'Wild Magazine':            'hotellerie',

  // Transport
  'African Aviation News':    'transport',
  'East African Travel':      'transport',
  'Msafiri (Kenya Airways)':  'transport',
  'SA4x4':                    'transport',
  'Inside Travel News':       'transport',

  // Restauration
  'Africa Food & Travel':     'restauration',
  'Afrique Magazine Food':    'restauration',
  'Vacations & Travel':       'restauration',
  'Egypt Today Food':         'restauration',

  // Voyages d'Affaires
  'African Business Travel':  'voyages-affaires',
  'Jeune Afrique Voyages':    'voyages-affaires',
  "Condé Nast Traveller SA":  'voyages-affaires',
  'Voyages Afriq':            'voyages-affaires',
  'AllAfrica Travel':         'voyages-affaires',
  'Maroc Hebdo Travel':       'voyages-affaires',

  // MICE & Événements
  'Nigeria Travel Week':      'mice-evenements',
  'Africa News Agency':       'mice-evenements',
  'Destinations Mag':         'mice-evenements',
  'Afrik.com Tourisme':       'mice-evenements',

  // Divertissement
  'Travel Africa':            'divertissement',
  'Travel Essence Mag':       'divertissement',
  'Sarie Reise':              'divertissement',
  'Kipepeo Magazine':         'divertissement',
  'Magical Kenya':            'divertissement',
  'Seychelles Travel':        'divertissement',
  'Tourism Mauritius':        'divertissement',

  // Tourisme Durable
  'Discover Rwanda':          'tourisme-durable',
  'Destination Maroc':        'tourisme-durable',
  'Tunisie Tourism':          'tourisme-durable',
  'Algeria Tourism Review':   'tourisme-durable',
  'Visit Sénégal':            'tourisme-durable',
  'Ghana Tourism Mag':        'tourisme-durable',
  "Côte d'Ivoire Tourism":    'tourisme-durable',
  'Madagascar Tourisme':      'tourisme-durable',
  'Namibia Tourism':          'tourisme-durable',
  'Botswana Tourism':         'tourisme-durable',
  'Zimbabwe Tourism':         'tourisme-durable',
  'Zambia Travel':            'tourisme-durable',
  'Cap Vert Tourism':         'tourisme-durable',

  // Anciennes sources (noms originaux avant renommage)
  'Africa Geographic':        'divertissement',
  'Afrique Magazine':         'restauration',
  'Sarie Tuin':               'divertissement',
  'Maroc Hebdo':              'voyages-affaires',
  'Visit Maroc':              'tourisme-durable',
  'Egypt Today Travel':       'restauration',
  'Visit Rwanda':             'tourisme-durable',
  'Visit Ghana':              'tourisme-durable',
  'Visit Senegal':            'tourisme-durable',
};

const CATEGORY_DEFINITIONS = [
  { slug: 'hotellerie',        name: 'Hôtellerie',           color: '#1A73E8' },
  { slug: 'transport',         name: 'Transport',             color: '#34A853' },
  { slug: 'restauration',      name: 'Restauration',          color: '#FBBC04' },
  { slug: 'voyages-affaires',  name: "Voyages d'Affaires",    color: '#EA4335' },
  { slug: 'mice-evenements',   name: 'MICE & Événements',     color: '#9C27B0' },
  { slug: 'divertissement',    name: 'Divertissement',        color: '#FF5722' },
  { slug: 'tourisme-durable',  name: 'Tourisme Durable',      color: '#009688' },
];

async function run() {
  console.log('🚀 Démarrage de la migration de recatégorisation...\n');

  // 1. Créer toutes les catégories manquantes
  const categoryIds: Record<string, number> = {};

  for (const def of CATEGORY_DEFINITIONS) {
    let cat = await prisma.category.findUnique({ where: { slug: def.slug } });
    if (!cat) {
      cat = await prisma.category.create({
        data: { name: def.name, slug: def.slug, type: 'MAGAZINE', color: def.color, order: CATEGORY_DEFINITIONS.indexOf(def) },
      });
      console.log(`  ✅ Catégorie créée : ${def.name}`);
    } else {
      console.log(`  ✓  Catégorie existante : ${def.name} (id=${cat.id})`);
    }
    categoryIds[def.slug] = cat.id;
  }

  console.log('');

  // 2. Récupérer tous les magazines
  const allMagazines = await prisma.magazine.findMany({ select: { id: true, source: true, categoryId: true } });
  console.log(`📚 ${allMagazines.length} magazines trouvés en base\n`);

  let updated = 0;
  let skipped = 0;
  let unknown = 0;

  for (const magazine of allMagazines) {
    const targetSlug = SOURCE_TO_CATEGORY[magazine.source];

    if (!targetSlug) {
      console.warn(`  ⚠️  Source inconnue : "${magazine.source}" (id=${magazine.id}) — non modifié`);
      unknown++;
      continue;
    }

    const targetId = categoryIds[targetSlug];

    if (magazine.categoryId === targetId) {
      skipped++;
      continue;
    }

    await prisma.magazine.update({
      where: { id: magazine.id },
      data:  { categoryId: targetId },
    });

    console.log(`  ♻️  [${magazine.id}] "${magazine.source}" → ${targetSlug}`);
    updated++;
  }

  console.log(`
📊 Résumé de la migration :
  ✅ Mis à jour : ${updated}
  ⏭️  Déjà corrects : ${skipped}
  ⚠️  Sources inconnues : ${unknown}
  `);

  await prisma.$disconnect();
}

run().catch((err) => {
  console.error('❌ Erreur de migration:', err);
  prisma.$disconnect();
  process.exit(1);
});