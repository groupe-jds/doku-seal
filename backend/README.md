# Doku-Seal API (NestJS)

RESTful API built with NestJS framework.

## Tech Stack

- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator + Zod
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL 15+
- npm 10+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

API will be available at [http://localhost:3001/api](http://localhost:3001/api)

Swagger docs at [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

### Build

```bash
npm run build
npm run start:prod
```

## Project Structure

```
apps/api/
├── src/
│   ├── common/                # Shared utilities
│   │   ├── decorators/       # Custom decorators
│   │   ├── guards/           # Auth guards
│   │   ├── interceptors/     # Response interceptors
│   │   └── pipes/            # Validation pipes
│   ├── config/               # Configuration
│   ├── database/             # Database module
│   │   ├── database.module.ts
│   │   └── prisma.service.ts
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── documents/       # Document management
│   │   ├── envelopes/       # Envelope management
│   │   ├── organisations/   # Organisation management
│   │   └── teams/           # Team management
│   ├── app.module.ts         # Root module
│   └── main.ts              # Entry point
└── test/                     # E2E tests
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3001/api/docs
- **OpenAPI JSON**: http://localhost:3001/api/docs-json

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Migration Status

This is a new NestJS API created as part of the migration from tRPC to NestJS.

**Phase**: 1 - Setup
**Status**: In Progress

### Roadmap

- [x] Basic setup and structure
- [ ] Auth module
- [ ] Documents module
- [ ] Envelopes module
- [ ] Organisations module
- [ ] Teams module
- [ ] Complete API migration from tRPC
