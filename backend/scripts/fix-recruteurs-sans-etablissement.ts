// scripts/fix-recruteurs-sans-etablissement.ts
// Lance avec : npx ts-node scripts/fix-recruteurs-sans-etablissement.ts
//
// Ce script détecte tous les recruteurs qui n'ont pas de lien RecruteurEtablissement
// et leur crée un établissement placeholder + le lien avec isDefault:true.
// À exécuter une seule fois après avoir appliqué le fix auth.controller.ts.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Trouver tous les recruteurs
  const recruteurs = await prisma.emploiUser.findMany({
    where:  { role: 'RECRUITER' },
    select: { id: true, firstName: true, lastName: true, email: true },
  });

  console.log(`Recruteurs trouvés : ${recruteurs.length}`);

  let fixed = 0;

  for (const rec of recruteurs) {
    // 2. Vérifier s'il a au moins un établissement lié
    const liens = await prisma.recruteurEtablissement.findMany({
      where: { userId: rec.id },
    });

    if (liens.length > 0) {
      // S'assurer qu'au moins un est isDefault:true
      const hasDefault = liens.some((l) => l.isDefault);
      if (!hasDefault) {
        await prisma.recruteurEtablissement.update({
          where: {
            userId_etablissementId: {
              userId:          rec.id,
              etablissementId: liens[0].etablissementId,
            },
          },
          data: { isDefault: true },
        });
        console.log(`  ✓ ${rec.email} — isDefault fixé sur établissement ${liens[0].etablissementId}`);
        fixed++;
      }
      continue;  // Ce recruteur a déjà un établissement
    }

    // 3. Aucun établissement → créer un placeholder
    console.log(`  → ${rec.email} n'a pas d'établissement. Création d'un placeholder...`);

    const placeholder = await prisma.etablissement.create({
      data: {
        name:   `Établissement de ${rec.firstName} ${rec.lastName}`,
        sector: 'Hôtellerie',
        city:   '',
      },
    });

    await prisma.recruteurEtablissement.create({
      data: {
        userId:          rec.id,
        etablissementId: placeholder.id,
        isDefault:       true,
      },
    });

    // Créer une vitrine vide
    await prisma.vitrine.upsert({
      where:  { etablissementId: placeholder.id },
      update: {},
      create: { etablissementId: placeholder.id, completionScore: 0, views: 0 },
    }).catch(() => {});

    console.log(`  ✓ ${rec.email} — établissement placeholder créé (id: ${placeholder.id})`);
    fixed++;
  }

  console.log(`\nRésultat : ${fixed} compte(s) réparé(s) sur ${recruteurs.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());