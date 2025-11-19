# @doku-seal/database

Database abstraction layer for Doku-Seal applications.

## Overview

This package provides a clean interface to the database layer, wrapping `@doku-seal/prisma` and providing utilities for the new Next.js and NestJS applications.

## Usage

### In Next.js (App Router)

```typescript
import { prisma } from '@doku-seal/database';

export async function getDocuments() {
  return await prisma.envelope.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });
}
```

### In NestJS

Use the PrismaService from the database module (apps/api/src/database/prisma.service.ts).

## Migration Plan

This package currently wraps `@doku-seal/prisma` to maintain compatibility with the existing codebase while providing a clean interface for new applications.

In the future, the implementation may be moved directly into this package.
