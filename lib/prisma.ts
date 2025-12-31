/**
 * Prisma Client Singleton
 * 
 * This module provides a singleton instance of PrismaClient to prevent
 * multiple instances in development (hot reload) and production.
 * 
 * Usage:
 *   import { prisma } from '@/lib/prisma';
 *   const users = await prisma.user.findMany();
 */

import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Create Prisma Client instance
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

// Use global instance in development, create new in production
export const prisma = globalThis.__prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;

