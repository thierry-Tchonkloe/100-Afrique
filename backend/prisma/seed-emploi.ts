// prisma/seed-emploi.ts
// Appel depuis votre seed.ts existant: import './seed-emploi';
// Ou directement: npx ts-node prisma/seed-emploi.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedEmploi() {
  console.log('\n🌱 Seeding sous-univers Emploi...');

  // ── Candidat demo ─────────────────────────────────────────────────────────
  const candidatPwd = await bcrypt.hash('candidat123', 10);
  const candidat = await prisma.emploiUser.upsert({
    where: { email: 'marie.dubois@email.com' },
    update: {},
    create: {
      email: 'marie.dubois@email.com',
      password: candidatPwd,
      firstName: 'Marie',
      lastName: 'Dubois',
      role: 'CANDIDAT',
      settings: { create: {} },
      candidatProfil: {
        create: {
          headline: "Réceptionniste bilingue - 5 ans d'expérience",
          city: 'Nice',
          mobility: "Côte d'Azur",
          bio: "Passionnée par l'accueil et le service client, je mets mon expertise au service des établissements hôteliers.",
          hardSkills: ['PMS Opera', 'Booking.com', 'Expedia Partner Central'],
          softSkills: ["Sens du service", "Esprit d'équipe", 'Rigueur', 'Adaptabilité'],
          languages: [
            { id: 'l1', name: 'Français', level: 'Natif' },
            { id: 'l2', name: 'Anglais',  level: 'B2'    },
            { id: 'l3', name: 'Italien',  level: 'A2'    },
          ],
          isVisible: true,
          availability: 'immediate',
          profileStrength: 65,
          experiences: {
            create: [
              {
                jobTitle: 'Réceptionniste Senior',
                companyName: 'Hôtel Negresco',
                location: 'Nice',
                startDate: '2020-03',
                contractType: 'CDI',
                missions: ['Accueil et enregistrement des clients VIP', 'Gestion des réservations et du planning', 'Coordination avec les services de conciergerie'],
                sortOrder: 0,
              },
              {
                jobTitle: 'Réceptionniste',
                companyName: 'Best Western Villa Victoria',
                location: 'Nice',
                startDate: '2018-06',
                endDate: '2020-02',
                contractType: 'CDI',
                missions: ['Accueil multilingue de la clientèle internationale', 'Gestion des check-in/check-out', 'Traitement des réclamations clients'],
                sortOrder: 1,
              },
            ],
          },
          formations: {
            create: [
              { diploma: 'BTS Tourisme', school: 'Lycée Technique Paul Augier', year: '2018' },
            ],
          },
        },
      },
    },
  });
  console.log(`  ✅ Candidat: ${candidat.email}`);

  // ── Recruteur demo ─────────────────────────────────────────────────────────
  const recruteurPwd = await bcrypt.hash('recruteur123', 10);
  const recruteur = await prisma.emploiUser.upsert({
    where: { email: 'recruteur@grandhotel.fr' },
    update: {},
    create: {
      email: 'recruteur@grandhotel.fr',
      password: recruteurPwd,
      firstName: 'Marie',
      lastName: 'Dupont',
      role: 'RECRUITER',
      settings: { create: {} },
    },
  });
  console.log(`  ✅ Recruteur: ${recruteur.email}`);

  // ── Établissement ──────────────────────────────────────────────────────────
  let etab = await prisma.etablissement.findFirst({ where: { name: 'Grand Hôtel de Paris' } });
  if (!etab) {
    etab = await prisma.etablissement.create({
      data: {
        name: 'Grand Hôtel de Paris',
        sector: 'Hôtellerie',
        city: 'Paris',
        recruteurs: { create: { userId: recruteur.id, isDefault: true } },
        vitrine: {
          create: {
            slogan: "L'excellence hôtelière au cœur de Paris",
            location: 'Paris, France',
            sector: 'Hôtellerie de luxe',
            kpis: [
              { id: 'k1', icon: 'users',    value: '150',   label: 'Collaborateurs'       },
              { id: 'k2', icon: 'calendar', value: '25',    label: "Années d'expérience"  },
              { id: 'k3', icon: 'star',     value: '4.8/5', label: 'Satisfaction clients'  },
            ],
            values: [
              { id: 'v1', title: 'Excellence',  description: "Nous visons l'excellence dans chaque détail de nos services." },
              { id: 'v2', title: 'Durabilité',  description: "Engagés pour l'environnement, nous adoptons des pratiques responsables." },
              { id: 'v3', title: 'Innovation',  description: "Nous encourageons la créativité et l'innovation." },
            ],
            perks: ['Mutuelle', 'Tickets Restaurant', 'Formation continue', 'Horaires flexibles'],
            completionScore: 75,
          },
        },
      },
    });
  }
  console.log(`  ✅ Établissement: ${etab.name}`);

  // ── Offres ─────────────────────────────────────────────────────────────────
  const offresData = [
    {
      title: 'Chef de Réception H/F',
      sector: 'hotel',
      contractType: 'CDI',
      location: 'Paris 8ème',
      missions: "Superviser et coordonner l'équipe de réception.\nGarantir un accueil VIP exceptionnel.",
      profileDesc: 'Expérience de 3 ans minimum en hôtellerie haut de gamme.',
      requiredSkills: ['PMS Opera', 'Management', 'Anglais'],
      status: 'ACTIVE' as const,
      isPremium: true,
      views: 342,
      publishedAt: new Date(Date.now() - 5 * 86400000),
      expiresAt:   new Date(Date.now() + 25 * 86400000),
    },
    {
      title: 'Concierge de Luxe H/F',
      sector: 'hotel',
      contractType: 'CDI',
      location: 'Paris 8ème',
      missions: 'Accueillir et conseiller une clientèle internationale haut de gamme.',
      profileDesc: 'Bilingue anglais obligatoire. Expérience en hôtellerie 5 étoiles.',
      requiredSkills: ['Anglais', 'Service VIP'],
      status: 'ACTIVE' as const,
      isPremium: false,
      views: 198,
      publishedAt: new Date(Date.now() - 8 * 86400000),
      expiresAt:   new Date(Date.now() + 22 * 86400000),
    },
    {
      title: 'Directeur F&B',
      sector: 'restaurant',
      contractType: 'CDI',
      location: 'Paris',
      missions: "Piloter l'activité restauration de l'hôtel.",
      profileDesc: "Minimum 5 ans d'expérience en direction F&B.",
      requiredSkills: ['Management', 'HACCP'],
      status: 'DRAFT' as const,
      isPremium: false,
      views: 0,
    },
  ];

  for (const d of offresData) {
    const exists = await prisma.offre.findFirst({ where: { title: d.title, etablissementId: etab.id } });
    if (!exists) await prisma.offre.create({ data: { etablissementId: etab.id, ...d } });
  }
  console.log(`  ✅ ${offresData.length} offres créées`);

  // ── Candidature demo ───────────────────────────────────────────────────────
  const offre1 = await prisma.offre.findFirst({ where: { title: 'Chef de Réception H/F', etablissementId: etab.id } });
  if (offre1) {
    const appExists = await prisma.application.findUnique({
      where: { userId_offreId: { userId: candidat.id, offreId: offre1.id } },
    });
    if (!appExists) {
      await prisma.application.create({
        data: {
          userId: candidat.id, offreId: offre1.id, etablissementId: etab.id,
          status: 'INTERVIEW',
          matchScore: 95,
          timeline: [
            { status: 'sent',      date: new Date(Date.now() - 5 * 86400000).toISOString(), note: 'Candidature envoyée' },
            { status: 'viewed',    date: new Date(Date.now() - 3 * 86400000).toISOString(), note: 'Profil consulté' },
            { status: 'interview', date: new Date(Date.now() - 1 * 86400000).toISOString(), note: 'Invitation à un entretien' },
          ],
        },
      });
      console.log('  ✅ Candidature demo créée');
    }
  }

  // ── Alertes ────────────────────────────────────────────────────────────────
  const alerteExists = await prisma.alerteJob.findFirst({ where: { userId: candidat.id } });
  if (!alerteExists) {
    await prisma.alerteJob.createMany({
      data: [
        {
          userId: candidat.id,
          name: "Direction Hôtel Côte d'Azur",
          keywords: ['Directeur', 'Hébergement'],
          location: 'Nice, 06',
          contractTypes: ['CDI'],
          sector: 'Hôtellerie',
          frequency: 'REALTIME',
          isActive: true,
          lastSentAt: new Date('2024-01-15'),
        },
        {
          userId: candidat.id,
          name: 'Conseiller Voyage Luxe',
          keywords: ['Conseiller', 'Agence Voyage'],
          location: 'Paris, 75',
          contractTypes: ['CDI', 'CDD'],
          sector: 'Agence de voyage',
          frequency: 'WEEKLY',
          isActive: true,
          lastSentAt: new Date('2024-01-08'),
        },
      ],
    });
    console.log('  ✅ Alertes créées');
  }

  // ── Notifications ──────────────────────────────────────────────────────────
  const notifExists = await prisma.emploiNotification.findFirst({ where: { userId: candidat.id } });
  if (!notifExists) {
    await prisma.emploiNotification.createMany({
      data: [
        {
          userId: candidat.id, type: 'NEW_OFFER',
          title: 'Nouvelle offre correspondante',
          description: 'Alerte "Réceptionniste Paris" - il y a 1h',
        },
        {
          userId: candidat.id, type: 'PROFILE_VIEWED',
          title: 'Profil consulté',
          description: 'Un recruteur a vu votre profil - il y a 3h',
        },
        {
          userId: candidat.id, type: 'APPLICATION_ACCEPTED',
          title: 'Entretien programmé',
          description: 'Grand Hôtel de Paris vous invite à un entretien',
        },
      ],
    });
    console.log('  ✅ Notifications créées');
  }

  console.log('\n🔑 Comptes de test Emploi:');
  console.log('   Candidat:  marie.dubois@email.com  / candidat123');
  console.log('   Recruteur: recruteur@grandhotel.fr / recruteur123');
}

// Run standalone
if (require.main === module) {
  seedEmploi()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}