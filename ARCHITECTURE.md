# Architecture Doku-Seal

Ce document décrit l'architecture du projet Doku-Seal après la migration vers Next.js 15 + NestJS 10.

## Structure du projet

```
doku-seal/
├── frontend/              # Application Next.js 15 (App Router)
│   ├── app/              # Routes et pages
│   ├── components/       # Composants React
│   ├── lib/             # Utilitaires et configurations
│   └── styles/          # Styles globaux
│
├── backend/              # API NestJS 10
│   └── src/
│       ├── modules/     # Modules fonctionnels
│       │   ├── auth/   # Authentification JWT
│       │   ├── envelopes/  # Gestion des documents
│       │   ├── recipients/ # Gestion des destinataires
│       │   └── fields/     # Gestion des champs
│       └── database/   # Configuration Prisma
│
├── packages/            # Packages partagés (monorepo)
│   ├── validators/     # Schémas Zod partagés
│   ├── database/       # Configuration Prisma
│   ├── ui/            # Composants UI (shadcn/ui)
│   ├── shared/        # Types et utilitaires partagés
│   └── tailwind-config/ # Configuration Tailwind
│
└── apps/               # Applications legacy (Remix, docs)
    ├── remix/         # Application Remix (à migrer)
    ├── documentation/ # Site de documentation
    └── openpage-api/  # API OpenPage
```

## Stack technique

### Frontend (`@doku-seal/frontend`)
- **Framework**: Next.js 15 (App Router)
- **React**: v19
- **UI**: shadcn/ui + Tailwind CSS
- **Authentification**: NextAuth.js v5
- **Data fetching**: TanStack Query
- **Validation**: Zod
- **State management**: Zustand

### Backend (`@doku-seal/backend`)
- **Framework**: NestJS 10
- **ORM**: Prisma
- **Authentification**: JWT + Passport.js
- **Validation**: class-validator + Zod
- **Documentation**: Swagger/OpenAPI
- **Upload**: Multer

### Database
- **ORM**: Prisma
- **Base de données**: PostgreSQL

## Scripts disponibles

### Développement

```bash
# Démarrer le frontend Next.js
npm run dev:web

# Démarrer l'API NestJS
npm run dev:api

# Démarrer l'application Remix (legacy)
npm run dev:remix

# Tout démarrer
npm run dev
```

### Build

```bash
# Build tout le projet
npm run build

# Build uniquement le frontend
npm run build --filter=@doku-seal/frontend

# Build uniquement le backend
npm run build --filter=@doku-seal/backend
```

## Modules Backend

### AuthModule
- Authentification JWT
- Sign in / Sign up
- Reset password
- Refresh tokens
- Strategies: Local + JWT

### EnvelopesModule
- CRUD des enveloppes/documents
- Upload de fichiers PDF
- Envoi d'enveloppes
- Gestion du statut (DRAFT → PENDING → COMPLETED)

### RecipientsModule
- Ajout/modification/suppression de destinataires
- Rôles: SIGNER, VIEWER, APPROVER, CC
- Ordre de signature séquentiel

### FieldsModule
- 7 types de champs: SIGNATURE, INITIALS, NAME, EMAIL, DATE, TEXT, NUMBER
- Positionnement sur le document (coordonnées X/Y)
- Assignation aux destinataires

## Pages Frontend

### Pages d'authentification
- `/signin` - Connexion
- `/signup` - Inscription
- `/reset-password` - Réinitialisation mot de passe

### Pages documents
- `/documents` - Liste des documents avec filtres
- `/documents/new` - Upload nouveau document
- `/documents/[id]/edit` - Éditeur de document interactif

### Dashboard
- `/dashboard` - Page d'accueil après connexion

## API Endpoints

### Authentification
- `POST /auth/signin` - Connexion
- `POST /auth/signup` - Inscription
- `POST /auth/refresh` - Rafraîchir le token
- `GET /auth/me` - Profil utilisateur
- `POST /auth/request-password-reset` - Demande reset password
- `POST /auth/reset-password` - Reset password

### Envelopes
- `GET /envelopes` - Liste des enveloppes
- `POST /envelopes` - Créer une enveloppe
- `GET /envelopes/:id` - Détails d'une enveloppe
- `PUT /envelopes/:id` - Mettre à jour une enveloppe
- `DELETE /envelopes/:id` - Supprimer une enveloppe
- `POST /envelopes/:id/upload` - Upload document PDF
- `POST /envelopes/:id/send` - Envoyer l'enveloppe

### Recipients
- `POST /recipients` - Ajouter un destinataire
- `PUT /recipients/:id` - Modifier un destinataire
- `DELETE /recipients/:id` - Supprimer un destinataire

### Fields
- `POST /fields` - Ajouter un champ
- `PUT /fields/:id` - Modifier un champ
- `DELETE /fields/:id` - Supprimer un champ

## Design System

Le design system préserve le style de l'application Remix originale :

- **Couleur principale**: Doku-Seal green (`#A2E771`)
- **Polices**:
  - Inter (sans-serif)
  - Caveat (signature)
  - Noto Sans (multilingue)
- **Composants**: shadcn/ui avec thème personnalisé
- **Backgrounds**: Radial gradients
- **Mode sombre**: Support complet

## Migration

### État de la migration

✅ **Phase 1**: Infrastructure (Next.js + NestJS)
✅ **Phase 2**: Module d'authentification
✅ **Phase 3**: Gestion des documents (CRUD complet)

🚧 **À migrer**:
- Templates
- Organisations & Teams
- Webhooks
- Billing
- Admin dashboard

### Prochaines étapes

1. Migrer les templates depuis Remix
2. Implémenter les organisations et teams
3. Ajouter le support des webhooks
4. Migrer le système de billing
5. Créer l'interface admin
6. Tests E2E complets
7. Déploiement en production

## Environnement

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/doku_seal
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1h
PORT=3001
```

## Développement

1. **Cloner le repository**
   ```bash
   git clone https://github.com/groupe-jds/doku-seal.git
   cd doku-seal
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer la base de données**
   ```bash
   npm run dx:up
   ```

4. **Migrer la base de données**
   ```bash
   npm run prisma:migrate-dev
   ```

5. **Lancer le frontend et backend**
   ```bash
   # Terminal 1 - Backend
   npm run dev:api

   # Terminal 2 - Frontend
   npm run dev:web
   ```

6. **Accéder à l'application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001
   - Swagger: http://localhost:3001/api

## Tests

```bash
# Tests unitaires backend
npm run test --filter=@doku-seal/backend

# Tests E2E
npm run test:e2e
```

## Contribution

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour les guidelines de contribution.

## License

AGPL-3.0 - Voir [LICENSE](./LICENSE) pour plus de détails.
