// src/config/database.ts
import { PrismaClient } from '@prisma/client';
import { config } from './env';

/**
 * Instance Prisma Client pour interagir avec la base de données
 * Singleton pattern pour éviter les multiples connexions
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: config.isDevelopment ? ['query', 'error', 'warn'] : ['error'],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (config.isDevelopment) {
  globalThis.prisma = prisma;
}

/**
 * Gestion propre de la déconnexion
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  console.log('🔌 Base de données déconnectée');
}