# Migration Strategy: Remix + tRPC to Next.js + NestJS

## Overview

This document outlines the migration strategy from the current Remix + tRPC architecture to a new Next.js 15 + NestJS architecture.

## Architecture

### Current Architecture (Legacy)
- **Frontend**: Remix (React Router v6)
- **API Layer**: tRPC
- **Database**: PostgreSQL + Prisma ORM
- **Monorepo**: Turborepo

### Target Architecture (New)
- **Frontend**: Next.js 15 (App Router) + React 19
- **Backend**: NestJS 10 (REST API)
- **Database**: PostgreSQL + Prisma ORM (unchanged)
- **Monorepo**: Turborepo (unchanged)

## Migration Phases

### Phase 1: Infrastructure Setup ✅ (COMPLETED)

**Objective**: Create parallel Next.js and NestJS applications alongside existing Remix app

**Deliverables**:
- ✅ Next.js 15 application created (`apps/web`)
- ✅ NestJS 10 backend created (`apps/api` - renamed to `@doku-seal/backend`)
- ✅ Shared packages created:
  - `@doku-seal/validators` - Zod validation schemas
  - `@doku-seal/shared` - Common types, utils, and constants
  - `@doku-seal/database` - Database abstraction layer
- ✅ Monorepo configuration updated (turbo.json, package.json)
- ✅ Development environment configured

**Key Files Created**:
- `apps/web/` - Next.js application
- `apps/api/` - NestJS backend (package name: `@doku-seal/backend`)
- `packages/validators/` - Validation schemas
- `packages/shared/` - Shared utilities
- `packages/database/` - Database wrapper

**Timeline**: Week 1-2 (COMPLETED)

### Phase 2: Authentication Module

**Objective**: Migrate authentication from Remix to Next.js + NestJS

**Tasks**:
1. Implement NestJS authentication module
   - JWT strategy
   - Local strategy (email/password)
   - OAuth strategies (Google, OIDC)
   - Passport integration
2. Create Next.js auth pages
   - Sign in
   - Sign up
   - Password reset
3. Implement NextAuth.js v5
4. Migrate user management

**Deliverables**:
- Auth API endpoints in NestJS
- Auth pages in Next.js
- JWT token management
- Session management

**Timeline**: Week 3-4

### Phase 3: Core Document Features

**Objective**: Migrate document/envelope management

**Tasks**:
1. Create NestJS modules:
   - Documents module
   - Envelopes module
   - Recipients module
   - Fields module
2. Create Next.js pages:
   - Document list
   - Document viewer
   - Document editor
3. Migrate document upload functionality
4. Migrate signing workflow

**Deliverables**:
- Document CRUD operations
- Envelope management
- Signing workflow
- PDF viewer

**Timeline**: Week 5-10

### Phase 4: Organisation & Team Management

**Objective**: Migrate organisation and team features

**Tasks**:
1. Create NestJS modules:
   - Organisations module
   - Teams module
   - Members module
2. Create Next.js pages:
   - Organisation settings
   - Team management
   - Member invitations
3. Migrate permissions system

**Deliverables**:
- Organisation CRUD
- Team management
- Member management
- Role-based access control

**Timeline**: Week 11-14

### Phase 5: Advanced Features

**Objective**: Migrate remaining features

**Tasks**:
1. Templates
2. Webhooks
3. API tokens
4. Billing
5. Analytics

**Deliverables**:
- All advanced features migrated
- Feature parity with Remix app

**Timeline**: Week 15-20

### Phase 6: Testing & Deployment

**Objective**: Comprehensive testing and production deployment

**Tasks**:
1. End-to-end testing
2. Performance testing
3. Security audit
4. Migration script for existing data
5. Blue-green deployment
6. Decommission Remix app

**Deliverables**:
- Test coverage > 80%
- Performance benchmarks
- Security audit report
- Production deployment
- Legacy app sunset

**Timeline**: Week 21-26

## Technology Stack

### Frontend (Next.js)
- **Framework**: Next.js 15 (App Router)
- **React**: v19
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **Validation**: Zod
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5
- **HTTP Client**: ky

### Backend (NestJS)
- **Framework**: NestJS 10
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator + Zod
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Security**: Helmet

### Shared Packages
- **Validators**: Zod schemas for validation
- **Shared**: Common types, utilities, constants
- **Database**: Prisma wrapper

## Migration Strategy

We will use the **Strangler Fig Pattern**:

1. **Parallel Run**: Both Remix and Next.js apps run simultaneously
2. **Feature-by-Feature**: Migrate one feature at a time
3. **Data Layer**: Shared database (Prisma)
4. **Gradual Cutover**: Route traffic to Next.js as features are completed
5. **Legacy Sunset**: Decommission Remix app once all features are migrated

## Development Workflow

### Running the New Apps

```bash
# Run Next.js frontend
npm run dev:web

# Run NestJS backend
npm run dev:backend

# Run both (in separate terminals)
npm run dev:web & npm run dev:backend
```

### Building

```bash
# Build all packages
turbo run build

# Build specific app
turbo run build --filter=@doku-seal/web
turbo run build --filter=@doku-seal/backend
```

### Testing

```bash
# Run tests
turbo run test

# Run tests with coverage
turbo run test:cov

# Run E2E tests
turbo run test:e2e
```

## API Routes

### REST API Structure

```
/api/v1
  ├── /auth
  │   ├── POST /signin
  │   ├── POST /signup
  │   ├── POST /signout
  │   └── POST /reset-password
  ├── /envelopes
  │   ├── GET    /envelopes
  │   ├── POST   /envelopes
  │   ├── GET    /envelopes/:id
  │   ├── PUT    /envelopes/:id
  │   ├── DELETE /envelopes/:id
  │   └── POST   /envelopes/:id/send
  ├── /organisations
  │   ├── GET    /organisations
  │   ├── POST   /organisations
  │   ├── GET    /organisations/:id
  │   ├── PUT    /organisations/:id
  │   └── DELETE /organisations/:id
  └── /teams
      ├── GET    /teams
      ├── POST   /teams
      ├── GET    /teams/:id
      ├── PUT    /teams/:id
      └── DELETE /teams/:id
```

## Database Migration

The database schema remains unchanged. Both Remix and Next.js apps will use the same PostgreSQL database via Prisma.

## Environment Variables

### Next.js (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### NestJS (.env)
```env
PORT=3001
DATABASE_URL=postgres://doku-seal:password@localhost:54320/doku-seal
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:3000
```

## Success Criteria

- ✅ All features migrated to Next.js + NestJS
- ✅ Test coverage > 80%
- ✅ Performance equal or better than Remix
- ✅ Zero data loss during migration
- ✅ SEO maintained or improved
- ✅ Security audit passed

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data inconsistency | High | Use same database, shared Prisma client |
| Performance degradation | Medium | Load testing, performance benchmarks |
| Feature gaps | Medium | Detailed feature inventory, parallel testing |
| User disruption | High | Blue-green deployment, rollback plan |
| Developer confusion | Low | Clear documentation, training sessions |

## Timeline Summary

- **Phase 1**: Infrastructure Setup (Week 1-2) ✅ **COMPLETED**
- **Phase 2**: Authentication (Week 3-4)
- **Phase 3**: Core Documents (Week 5-10)
- **Phase 4**: Organisation & Teams (Week 11-14)
- **Phase 5**: Advanced Features (Week 15-20)
- **Phase 6**: Testing & Deployment (Week 21-26)

**Total Estimated Time**: 26 weeks (6 months)

## Next Steps

1. ✅ Complete Phase 1 infrastructure setup
2. Begin Phase 2: Authentication module
3. Set up CI/CD for new apps
4. Create detailed API documentation
5. Set up monitoring and logging

## References

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Strangler Fig Pattern](https://martinfowler.com/bliki/StranglerFigApplication.html)
- [Turbo Documentation](https://turbo.build/repo/docs)

---

**Last Updated**: 2025-11-19
**Status**: Phase 1 Complete ✅
