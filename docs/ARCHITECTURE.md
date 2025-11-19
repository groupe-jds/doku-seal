# Architecture Documentation

## System Overview

Doku-Seal is transitioning from a Remix + tRPC monolith to a modern Next.js + NestJS architecture with a clear separation between frontend and backend.

## Current State (Phase 1 Complete)

### Applications

#### 1. Legacy Applications (Active)
- **@doku-seal/remix** - Current production app (Remix + tRPC)
- **@doku-seal/documentation** - Documentation site
- **@doku-seal/openpage-api** - Public API

#### 2. New Applications (In Development)
- **@doku-seal/web** - Next.js 15 frontend (port 3000)
- **@doku-seal/backend** - NestJS backend API (port 3001)

### Packages

#### Core Packages
- **@doku-seal/prisma** - Database layer (PostgreSQL + Prisma)
- **@doku-seal/database** - Database abstraction wrapper
- **@doku-seal/validators** - Zod validation schemas
- **@doku-seal/shared** - Common types, utilities, and constants

#### Legacy API Packages
- **@doku-seal/api** - tRPC API wrapper
- **@doku-seal/auth** - Authentication utilities
- **@doku-seal/email** - Email templates and sending

#### UI & Tooling
- **@doku-seal/ui** - Shared UI components
- **@doku-seal/tailwind-config** - Tailwind configuration
- **@doku-seal/lib** - Utility library
- **@doku-seal/trpc** - tRPC configuration

#### Development Tools
- **@doku-seal/eslint-config** - ESLint configuration
- **@doku-seal/tsconfig** - TypeScript configurations

## Target Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Next.js 15 (@doku-seal/web)                  │   │
│  │  - App Router                                        │   │
│  │  - React Server Components                           │   │
│  │  - Server Actions                                    │   │
│  │  - TanStack Query (data fetching)                    │   │
│  │  - NextAuth.js v5 (authentication)                   │   │
│  │  - Zustand (client state)                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                         API Layer                             │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         NestJS 10 (@doku-seal/backend)               │    │
│  │  - REST API                                          │    │
│  │  - Swagger/OpenAPI documentation                     │    │
│  │  - JWT authentication                                │    │
│  │  - Passport strategies                               │    │
│  │  - Global validation pipes                           │    │
│  │  - Helmet (security)                                 │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                      Shared Layer                             │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  @doku-seal/validators    │  @doku-seal/shared                │
│  - Zod schemas            │  - TypeScript types               │
│  - Validation rules       │  - Utility functions              │
│  - DTOs                   │  - Constants                      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                      Data Layer                               │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  @doku-seal/database                                          │
│  └── @doku-seal/prisma                                        │
│      - Prisma ORM                                             │
│      - Database client                                        │
│      - Migrations                                             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                      PostgreSQL Database                      │
└────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Request Flow

```
User Browser
    │
    ▼
Next.js App (@doku-seal/web)
    │
    ├─ Server Component (SSR)
    │    └─ Direct fetch to NestJS
    │
    └─ Client Component
         └─ TanStack Query
              └─ ky HTTP client
                   └─ NestJS API
                        └─ Prisma
                             └─ PostgreSQL
```

### 2. Authentication Flow

```
User Login
    │
    ▼
Next.js Sign-in Page
    │
    ▼
NextAuth.js Credentials Provider
    │
    ▼
NestJS Auth Endpoint (/api/auth/signin)
    │
    ├─ Validate credentials (class-validator)
    ├─ Hash comparison (bcrypt)
    ├─ Generate JWT token
    │
    ▼
Return JWT + User
    │
    ▼
NextAuth.js stores session
    │
    ▼
Redirect to Dashboard
```

### 3. API Request Flow

```
Client Component
    │
    ▼
TanStack Query (useQuery/useMutation)
    │
    ▼
API Client (ky)
    │ (with JWT in Authorization header)
    ▼
NestJS Endpoint
    │
    ├─ JWT Guard (validate token)
    ├─ Validation Pipe (validate DTO)
    ├─ Authorization Guard (check permissions)
    │
    ▼
Service Layer
    │
    ▼
PrismaService
    │
    ▼
PostgreSQL
```

## Module Structure

### Next.js App Structure

```
apps/web/
├── app/
│   ├── (auth)/                  # Auth route group
│   │   ├── signin/
│   │   ├── signup/
│   │   └── reset-password/
│   ├── (dashboard)/             # Dashboard route group
│   │   ├── documents/
│   │   ├── envelopes/
│   │   ├── templates/
│   │   └── settings/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── providers.tsx            # Client providers
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── forms/                   # Form components
│   └── layouts/                 # Layout components
├── lib/
│   ├── api/                     # API client
│   │   └── client.ts            # ky HTTP client
│   └── auth/                    # Auth utilities
│       └── auth.config.ts       # NextAuth config
└── hooks/                       # React hooks
    ├── use-documents.ts
    └── use-envelopes.ts
```

### NestJS Backend Structure

```
apps/api/
├── src/
│   ├── common/                  # Shared utilities
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── config/                  # Configuration
│   │   ├── app.config.ts
│   │   └── database.config.ts
│   ├── database/                # Database module
│   │   ├── database.module.ts
│   │   └── prisma.service.ts
│   ├── modules/                 # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   └── guards/
│   │   │       ├── jwt-auth.guard.ts
│   │   │       └── local-auth.guard.ts
│   │   ├── envelopes/
│   │   │   ├── envelopes.controller.ts
│   │   │   ├── envelopes.service.ts
│   │   │   └── envelopes.module.ts
│   │   ├── organisations/
│   │   └── teams/
│   ├── app.module.ts            # Root module
│   └── main.ts                  # Bootstrap
└── test/                        # E2E tests
```

## Validation Strategy

### Shared Zod Schemas

```typescript
// packages/validators/src/auth.schema.ts
export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type SignInDto = z.infer<typeof SignInSchema>;
```

### Usage in Next.js

```typescript
// apps/web/app/(auth)/signin/page.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInSchema } from '@doku-seal/validators';

const form = useForm({
  resolver: zodResolver(SignInSchema),
});
```

### Usage in NestJS

```typescript
// apps/api/src/modules/auth/dto/signin.dto.ts
import { createZodDto } from '@anatine/zod-nestjs';
import { SignInSchema } from '@doku-seal/validators';

export class SignInDto extends createZodDto(SignInSchema) {}

// apps/api/src/modules/auth/auth.controller.ts
@Post('signin')
async signIn(@Body() signInDto: SignInDto) {
  return this.authService.signIn(signInDto);
}
```

## State Management

### Server State (TanStack Query)

```typescript
// apps/web/hooks/use-documents.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => apiClient.get('documents').json(),
  });
}

export function useCreateDocument() {
  return useMutation({
    mutationFn: (data) => apiClient.post('documents', { json: data }).json(),
  });
}
```

### Client State (Zustand)

```typescript
// apps/web/stores/ui-store.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
```

## Security

### Authentication

- **JWT Tokens**: Stateless authentication
- **Refresh Tokens**: Long-lived tokens for renewal
- **HttpOnly Cookies**: Secure token storage
- **CSRF Protection**: Double-submit cookie pattern

### Authorization

- **Role-Based Access Control (RBAC)**: User, Admin, Manager roles
- **Resource-Based Authorization**: Owner checks
- **Guards**: NestJS guards for route protection

### API Security

- **Helmet**: Security headers
- **CORS**: Configured origin whitelist
- **Rate Limiting**: Throttler guard
- **Input Validation**: class-validator + Zod
- **SQL Injection Prevention**: Prisma parameterized queries

## Performance

### Next.js Optimizations

- **Partial Prerendering (PPR)**: Mixed static and dynamic content
- **Server Components**: Reduced JavaScript bundle
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **ISR**: Incremental Static Regeneration

### NestJS Optimizations

- **Connection Pooling**: Prisma connection pool
- **Caching**: Redis cache (future)
- **Compression**: Gzip compression
- **Query Optimization**: Prisma select/include

## Monitoring & Logging

### Frontend

- **Error Tracking**: Sentry (future)
- **Analytics**: PostHog
- **Web Vitals**: Next.js analytics

### Backend

- **Logging**: NestJS Logger
- **Health Checks**: NestJS Terminus
- **Metrics**: Prometheus (future)

## Development Tools

### Code Quality

- **ESLint**: Linting
- **Prettier**: Code formatting
- **TypeScript**: Strict mode
- **Husky**: Git hooks

### Testing

- **Jest**: Unit testing
- **Playwright**: E2E testing (Next.js)
- **Supertest**: API testing (NestJS)

### CI/CD

- **GitHub Actions**: Automated testing and deployment
- **Docker**: Containerization
- **Turbo**: Build caching

## Environment Configuration

### Development

```env
# Next.js (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret

# NestJS (.env)
PORT=3001
DATABASE_URL=postgres://doku-seal:password@localhost:54320/doku-seal
JWT_SECRET=dev-jwt-secret
CORS_ORIGIN=http://localhost:3000
```

### Production

```env
# Next.js
NEXT_PUBLIC_API_URL=https://api.doku-seal.com
NEXTAUTH_URL=https://doku-seal.com
NEXTAUTH_SECRET=<secure-secret>

# NestJS
PORT=3001
DATABASE_URL=<production-db-url>
JWT_SECRET=<secure-jwt-secret>
CORS_ORIGIN=https://doku-seal.com
```

## Migration Roadmap

- ✅ **Phase 1**: Infrastructure setup (COMPLETED)
- ⏳ **Phase 2**: Authentication module (IN PROGRESS)
- 📋 **Phase 3**: Core document features
- 📋 **Phase 4**: Organisation & team management
- 📋 **Phase 5**: Advanced features
- 📋 **Phase 6**: Testing & deployment

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Zod Documentation](https://zod.dev)

---

**Last Updated**: 2025-11-19
**Architecture Version**: 2.0
