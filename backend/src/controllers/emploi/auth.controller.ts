// src/controllers/emploi/auth.controller.ts
import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

const prisma = new PrismaClient();
const ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 10);

function signToken(id: number, email: string, role: string): string {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as any,
  });
}

// FIX : le champ envoyé par le frontend (RegisterForm) est `companyName`,
// pas `etablissementName`. C'était la cause du bug — le schéma attendait
// un champ qui n'était jamais envoyé, donc body.etablissementName était
// toujours undefined et le code retombait sur le placeholder
// "Établissement de {firstName} {lastName}".
const RegisterSchema = z
  .object({
    email:     z.string().email(),
    password:  z.string().min(8, 'Minimum 8 caractères'),
    firstName: z.string().min(1),
    lastName:  z.string().min(1),
    role:      z.enum(['CANDIDAT', 'RECRUITER']).default('CANDIDAT'),

    // ── Champs recruteur ────────────────────────────────────────────────────
    // etablissementId : rattacher à un établissement déjà existant (cas
    //   d'un second recruteur qui rejoint une entreprise déjà inscrite).
    // companyName : nom saisi dans le formulaire d'inscription — utilisé
    //   pour CRÉER le nouvel établissement. Obligatoire si role=RECRUITER
    //   et qu'aucun etablissementId n'est fourni (voir refine ci-dessous).
    etablissementId:     z.coerce.number().optional(),
    companyName:         z.string().trim().min(1).optional(),
    etablissementSector: z.string().optional(),
    etablissementCity:   z.string().optional(),
  })
  .refine(
    (data) => data.role !== 'RECRUITER' || Boolean(data.etablissementId || data.companyName),
    {
      message: "Le nom de l'entreprise est requis pour un compte recruteur",
      path: ['companyName'],
    },
  );

// ── POST /api/emploi/auth/register ────────────────────────────────────────────
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const body = RegisterSchema.parse(req.body);

    // Email unique
    const exists = await prisma.emploiUser.findUnique({ where: { email: body.email } });
    if (exists) {
      res.status(409).json({ success: false, message: 'Email déjà utilisé' });
      return;
    }

    const password = await bcrypt.hash(body.password, ROUNDS);

    // ── Créer l'utilisateur ──────────────────────────────────────────────────
    const user = await prisma.emploiUser.create({
      data: {
        email:     body.email,
        password,
        firstName: body.firstName,
        lastName:  body.lastName,
        role:      body.role,
        settings:  { create: {} },
        // Profil candidat créé uniquement pour les candidats
        ...(body.role === 'CANDIDAT' && {
          candidatProfil: {
            create: {
              hardSkills: [],
              softSkills: [],
              languages:  [],
              isVisible:  true,
            },
          },
        }),
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    // ── Lien RecruteurEtablissement pour les recruteurs ───────────────────────
    // Sans ce lien, getEtabId() retourne null → toutes les routes recruteur
    // (createOffre, getOffres, getDashboard…) échouent avec 404.
    if (body.role === 'RECRUITER') {
      let etabId: number | null = null;

      if (body.etablissementId) {
        // L'établissement existe déjà — vérifier qu'il existe en base
        const etab = await prisma.etablissement.findUnique({
          where:  { id: body.etablissementId },
          select: { id: true },
        });
        if (etab) etabId = etab.id;
      }

      if (!etabId) {
        // FIX : companyName est garanti non-vide ici grâce au .refine() ci-dessus
        // → on ne crée plus jamais l'établissement placeholder générique.
        const newEtab = await prisma.etablissement.create({
          data: {
            name:   body.companyName!,
            sector: body.etablissementSector ?? '',
            city:   body.etablissementCity   ?? '',
          },
        });
        etabId = newEtab.id;
      }

      // Créer le lien avec isDefault:true — CRITIQUE pour que getEtabId() fonctionne
      await prisma.recruteurEtablissement.create({
        data: {
          userId:          user.id,
          etablissementId: etabId,
          isDefault:       true,
        },
      });

      // Créer une vitrine vide pour cet établissement (évite les null sur le dashboard)
      await prisma.vitrine.upsert({
        where:  { etablissementId: etabId },
        update: {},
        create: {
          etablissementId: etabId,
          kpis: [], values: [], perks: [], photos: [], videos: [], socials: {},
          completionScore: 0,
          views:           0,
        },
      }).catch(() => {});  // non-bloquant si le modèle vitrine diffère
    }

    res.status(201).json({
      success: true,
      data: {
        user,
        token: signToken(user.id, user.email, user.role),
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: err.issues });
      return;
    }
    console.error('[register]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── POST /api/emploi/auth/login ───────────────────────────────────────────────
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
      return;
    }

    const user = await prisma.emploiUser.findUnique({
      where:  { email },
      select: {
        id: true, email: true, password: true,
        firstName: true, lastName: true, role: true,
        isActive: true, avatar: true,
      },
    });

    if (!user || !user.isActive || !await bcrypt.compare(password, user.password)) {
      res.status(401).json({ success: false, message: 'Identifiants incorrects' });
      return;
    }

    const { password: _, ...safeUser } = user;
    res.json({
      success: true,
      data: { user: safeUser, token: signToken(user.id, user.email, user.role) },
    });
  } catch (err) {
    console.error('[login]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── GET /api/emploi/auth/me ───────────────────────────────────────────────────
export async function me(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const user = await prisma.emploiUser.findUnique({
      where:  { id: req.emploiUser!.id },
      select: {
        id: true, email: true, firstName: true,
        lastName: true, role: true, avatar: true, createdAt: true,
      },
    });
    res.json({ success: true, data: user });
  } catch (err) {
    console.error('[me]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}

// ── PATCH /api/emploi/auth/password ──────────────────────────────────────────
export async function changePassword(req: EmploiRequest, res: Response): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      res.status(400).json({ success: false, message: 'Nouveau mot de passe trop court' });
      return;
    }

    const user = await prisma.emploiUser.findUnique({ where: { id: req.emploiUser!.id } });
    if (!user || !await bcrypt.compare(currentPassword, user.password)) {
      res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect' });
      return;
    }

    await prisma.emploiUser.update({
      where: { id: user.id },
      data:  { password: await bcrypt.hash(newPassword, ROUNDS) },
    });

    res.json({ success: true, message: 'Mot de passe mis à jour' });
  } catch (err) {
    console.error('[changePassword]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}














// // src/controllers/emploi/auth.controller.ts
// import { type Request, type Response } from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { PrismaClient } from '@prisma/client';
// import { z } from 'zod';
// import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

// const prisma = new PrismaClient();
// const ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 10);

// function signToken(id: number, email: string, role: string): string {
//   return jwt.sign({ id, email, role }, process.env.JWT_SECRET!, {
//     expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as any,
//   });
// }

// const RegisterSchema = z.object({
//   email:           z.string().email(),
//   password:        z.string().min(8, 'Minimum 8 caractères'),
//   firstName:       z.string().min(1),
//   lastName:        z.string().min(1),
//   role:            z.enum(['CANDIDAT', 'RECRUITER']).default('CANDIDAT'),
//   // Champs recruteur optionnels
//   etablissementId:     z.coerce.number().optional(),  // établissement existant
//   etablissementName:   z.string().optional(),          // OU créer un nouvel établissement
//   etablissementSector: z.string().optional(),
//   etablissementCity:   z.string().optional(),
// });

// // ── POST /api/emploi/auth/register ────────────────────────────────────────────
// export async function register(req: Request, res: Response): Promise<void> {
//   try {
//     const body = RegisterSchema.parse(req.body);

//     // Email unique
//     const exists = await prisma.emploiUser.findUnique({ where: { email: body.email } });
//     if (exists) {
//       res.status(409).json({ success: false, message: 'Email déjà utilisé' });
//       return;
//     }

//     const password = await bcrypt.hash(body.password, ROUNDS);

//     // ── Créer l'utilisateur ──────────────────────────────────────────────────
//     const user = await prisma.emploiUser.create({
//       data: {
//         email:     body.email,
//         password,
//         firstName: body.firstName,
//         lastName:  body.lastName,
//         role:      body.role,
//         settings:  { create: {} },
//         // Profil candidat créé uniquement pour les candidats
//         ...(body.role === 'CANDIDAT' && {
//           candidatProfil: {
//             create: {
//               hardSkills: [],
//               softSkills: [],
//               languages:  [],
//               isVisible:  true,
//             },
//           },
//         }),
//       },
//       select: { id: true, email: true, firstName: true, lastName: true, role: true },
//     });

//     // ── FIX : lien RecruteurEtablissement pour les recruteurs ─────────────────
//     // Sans ce lien, getEtabId() retourne null → toutes les routes recruteur
//     // (createOffre, getOffres, getDashboard…) échouent avec 404.
//     if (body.role === 'RECRUITER') {
//       let etabId: number | null = null;

//       if (body.etablissementId) {
//         // L'établissement existe déjà — vérifier qu'il existe en base
//         const etab = await prisma.etablissement.findUnique({
//           where:  { id: body.etablissementId },
//           select: { id: true },
//         });
//         if (etab) etabId = etab.id;
//       }

//       if (!etabId && body.etablissementName) {
//         // Créer un nouvel établissement à partir du nom fourni
//         const newEtab = await prisma.etablissement.create({
//           data: {
//             name:   body.etablissementName,
//             sector: body.etablissementSector ?? 'Hôtellerie',
//             city:   body.etablissementCity   ?? '',
//           },
//         });
//         etabId = newEtab.id;
//       }

//       if (!etabId) {
//         // Aucun établissement fourni : créer un établissement placeholder
//         // nommé d'après le recruteur — il pourra le compléter dans sa vitrine
//         const placeholder = await prisma.etablissement.create({
//           data: {
//             name:   `Établissement de ${body.firstName} ${body.lastName}`,
//             sector: 'Hôtellerie',
//             city:   '',
//           },
//         });
//         etabId = placeholder.id;
//       }

//       // Créer le lien avec isDefault:true — CRITIQUE pour que getEtabId() fonctionne
//       await prisma.recruteurEtablissement.create({
//         data: {
//           userId:          user.id,
//           etablissementId: etabId,
//           isDefault:       true,
//         },
//       });

//       // Créer une vitrine vide pour cet établissement (évite les null sur le dashboard)
//       await prisma.vitrine.upsert({
//         where:  { etablissementId: etabId },
//         update: {},
//         create: {
//           etablissementId: etabId,
//           completionScore: 0,
//           views:           0,
//         },
//       }).catch(() => {});  // non-bloquant si le modèle vitrine diffère
//     }

//     res.status(201).json({
//       success: true,
//       data: {
//         user,
//         token: signToken(user.id, user.email, user.role),
//       },
//     });
//   } catch (err) {
//     if (err instanceof z.ZodError) {
//       res.status(400).json({ success: false, errors: err.issues });
//       return;
//     }
//     console.error('[register]', err);
//     res.status(500).json({ success: false, message: 'Erreur serveur' });
//   }
// }

// // ── POST /api/emploi/auth/login ───────────────────────────────────────────────
// export async function login(req: Request, res: Response): Promise<void> {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
//       return;
//     }

//     const user = await prisma.emploiUser.findUnique({
//       where:  { email },
//       select: {
//         id: true, email: true, password: true,
//         firstName: true, lastName: true, role: true,
//         isActive: true, avatar: true,
//       },
//     });

//     if (!user || !user.isActive || !await bcrypt.compare(password, user.password)) {
//       res.status(401).json({ success: false, message: 'Identifiants incorrects' });
//       return;
//     }

//     const { password: _, ...safeUser } = user;
//     res.json({
//       success: true,
//       data: { user: safeUser, token: signToken(user.id, user.email, user.role) },
//     });
//   } catch (err) {
//     console.error('[login]', err);
//     res.status(500).json({ success: false, message: 'Erreur serveur' });
//   }
// }

// // ── GET /api/emploi/auth/me ───────────────────────────────────────────────────
// export async function me(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const user = await prisma.emploiUser.findUnique({
//       where:  { id: req.emploiUser!.id },
//       select: {
//         id: true, email: true, firstName: true,
//         lastName: true, role: true, avatar: true, createdAt: true,
//       },
//     });
//     res.json({ success: true, data: user });
//   } catch (err) {
//     console.error('[me]', err);
//     res.status(500).json({ success: false, message: 'Erreur serveur' });
//   }
// }

// // ── PATCH /api/emploi/auth/password ──────────────────────────────────────────
// export async function changePassword(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const { currentPassword, newPassword } = req.body;
//     if (!newPassword || newPassword.length < 8) {
//       res.status(400).json({ success: false, message: 'Nouveau mot de passe trop court' });
//       return;
//     }

//     const user = await prisma.emploiUser.findUnique({ where: { id: req.emploiUser!.id } });
//     if (!user || !await bcrypt.compare(currentPassword, user.password)) {
//       res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect' });
//       return;
//     }

//     await prisma.emploiUser.update({
//       where: { id: user.id },
//       data:  { password: await bcrypt.hash(newPassword, ROUNDS) },
//     });

//     res.json({ success: true, message: 'Mot de passe mis à jour' });
//   } catch (err) {
//     console.error('[changePassword]', err);
//     res.status(500).json({ success: false, message: 'Erreur serveur' });
//   }
// }






















// // src/controllers/emploi/auth.controller.ts
// import { type Request, type Response } from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { PrismaClient } from '@prisma/client';
// import { z } from 'zod';
// import type { EmploiRequest } from '../../middlewares/emploi-auth.middleware';

// const prisma = new PrismaClient();
// const ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 10);

// function signToken(id: number, email: string, role: string): string {
//   return jwt.sign({ id, email, role }, process.env.JWT_SECRET!, {
//     expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as any,
//   });
// }

// const RegisterSchema = z.object({
//   email:     z.string().email(),
//   password:  z.string().min(8, 'Minimum 8 caractères'),
//   firstName: z.string().min(1),
//   lastName:  z.string().min(1),
//   role:      z.enum(['CANDIDAT', 'RECRUITER']).default('CANDIDAT'),
// });

// // POST /api/emploi/auth/register
// export async function register(req: Request, res: Response): Promise<void> {
//   try {
//     const body = RegisterSchema.parse(req.body);
//     const exists = await prisma.emploiUser.findUnique({ where: { email: body.email } });
//     if (exists) { res.status(409).json({ success: false, message: 'Email déjà utilisé' }); return; }

//     const password = await bcrypt.hash(body.password, ROUNDS);
//     const user = await prisma.emploiUser.create({
//       data: {
//         email: body.email, password,
//         firstName: body.firstName, lastName: body.lastName,
//         role: body.role,
//         settings: { create: {} },
//         ...(body.role === 'CANDIDAT' && { candidatProfil: { create: {} } }),
//       },
//       select: { id: true, email: true, firstName: true, lastName: true, role: true },
//     });
//     res.status(201).json({ success: true, data: { user, token: signToken(user.id, user.email, user.role) } });
//   } catch (err) {
//     if (err instanceof z.ZodError) { res.status(400).json({ success: false, errors: err.issues }); return; }
//     res.status(500).json({ success: false, message: 'Erreur serveur' });
//   }
// }

// // POST /api/emploi/auth/login
// export async function login(req: Request, res: Response): Promise<void> {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) { res.status(400).json({ success: false, message: 'Email et mot de passe requis' }); return; }

//     const user = await prisma.emploiUser.findUnique({
//       where: { email },
//       select: { id: true, email: true, password: true, firstName: true, lastName: true, role: true, isActive: true, avatar: true },
//     });
//     if (!user || !user.isActive || !await bcrypt.compare(password, user.password)) {
//       res.status(401).json({ success: false, message: 'Identifiants incorrects' }); return;
//     }
//     const { password: _, ...safeUser } = user;
//     res.json({ success: true, data: { user: safeUser, token: signToken(user.id, user.email, user.role) } });
//   } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
// }

// // GET /api/emploi/auth/me
// export async function me(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const user = await prisma.emploiUser.findUnique({
//       where: { id: req.emploiUser!.id },
//       select: { id: true, email: true, firstName: true, lastName: true, role: true, avatar: true, createdAt: true },
//     });
//     res.json({ success: true, data: user });
//   } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
// }

// // PATCH /api/emploi/auth/password
// export async function changePassword(req: EmploiRequest, res: Response): Promise<void> {
//   try {
//     const { currentPassword, newPassword } = req.body;
//     if (!newPassword || newPassword.length < 8) { res.status(400).json({ success: false, message: 'Nouveau mot de passe trop court' }); return; }
//     const user = await prisma.emploiUser.findUnique({ where: { id: req.emploiUser!.id } });
//     if (!user || !await bcrypt.compare(currentPassword, user.password)) {
//       res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect' }); return;
//     }
//     await prisma.emploiUser.update({ where: { id: user.id }, data: { password: await bcrypt.hash(newPassword, ROUNDS) } });
//     res.json({ success: true, message: 'Mot de passe mis à jour' });
//   } catch { res.status(500).json({ success: false, message: 'Erreur serveur' }); }
// }