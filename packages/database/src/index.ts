/**
 * Database package - Clean abstraction layer for database access
 *
 * This package wraps @doku-seal/prisma and provides a unified interface
 * for the new Next.js and NestJS applications.
 */

// Re-export Prisma client and types
export * from '@doku-seal/prisma';

// Re-export commonly used Prisma types
export type { PrismaClient } from '@prisma/client';
