import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { config } from '../config/env';
import { AppError } from '../middlewares/errorHandler';

/**
 * Service d'authentification
 * Gère l'inscription, la connexion et la génération de tokens
 */
export class AuthService {
  /**
   * Inscription d'un nouveau utilisateur
   */
  async register(email: string, password: string, name: string) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Cet email est déjà utilisé', 409);
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, config.bcrypt.rounds);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'EDITOR', // Par défaut, nouvel utilisateur = EDITOR
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Générer le token
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user,
      token,
    };
  }

  /**
   * Connexion d'un utilisateur
   */
  async login(email: string, password: string) {
    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Email ou mot de passe incorrect', 401);
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Email ou mot de passe incorrect', 401);
    }

    // Générer le token
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Génère un token JWT
   */
  private generateToken(userId: number, email: string, role: string): string {
    const payload = {
      userId,
      email,
      role,
    };

    const secret = config.jwt.secret;
    const options: jwt.SignOptions = {
      expiresIn: config.jwt.expiresIn,
    };

    return jwt.sign(payload, secret, options);
  }

  /**
   * Récupère les informations de l'utilisateur connecté
   */
  async getCurrentUser(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    return user;
  }
}

export const authService = new AuthService();