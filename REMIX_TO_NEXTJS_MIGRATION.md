# Migration Remix → Next.js - Guide Complet

## ✅ Travail Effectué

### 1. Structure de Base
- ✅ Copie des polices de Remix vers Next.js (`/frontend/public/fonts/`)
- ✅ Remplacement du CSS avec le thème original de Remix (`@doku-seal/ui/styles/theme.css`)
- ✅ Mise à jour du `layout.tsx` racine avec dark mode par défaut
- ✅ Configuration du ThemeProvider avec mode dark forcé

### 2. Composants et Utilitaires
- ✅ Copie de tous les composants (`/frontend/components/`)
- ✅ Copie de tous les utilitaires (`/frontend/utils/`)
- ✅ Copie de tous les types (`/frontend/types/`)
- ✅ Copie des providers (`/frontend/providers/`)

### 3. Routes Migrées (125 fichiers)
Toutes les routes Remix ont été converties en Next.js App Router :

#### Pages d'Authentification (`/app/(auth)/`)
- signin, signup, forgot-password, reset-password
- verify-email, check-email
- organisation invitations et SSO
- team email verification

#### Pages du Dashboard (`/app/(dashboard)/`)
- Dashboard principal
- Documents (liste, édition, logs)
- Templates
- Inbox
- Settings (profile, security, billing, organisations)
- Team management (`/t/[teamUrl]/`)
- Organisation management (`/o/[orgUrl]/`)
- Admin panel (users, organisations, stats, claims)

#### Routes Spéciales
- `/app/(recipient)/` - Pages de signature pour les destinataires
- `/app/(share)/` - Pages de partage de documents
- `/app/(embed)/` - Iframes d'intégration (v0, v1)
- `/app/(profile)/` - Profils publics
- `/app/(internal)/` - Génération PDF, audit logs
- `/app/api/` - Routes API Next.js

### 4. Configuration
- ✅ Script `npm run dev` configure pour lancer Next.js + NestJS
- ✅ Fichier `.env` créé pour Next.js
- ✅ Providers mis à jour (SessionProvider, ThemeProvider, QueryClient)

## ⚠️ Travail Restant - IMPORTANT

### 1. Conversion des Loaders et Actions Remix

**Chaque fichier de route nécessite une révision manuelle** car :

- **Loaders Remix** → doivent devenir :
  - Server Components (pour les données)
  - Routes API (`/app/api/*/route.ts`)

- **Actions Remix** → doivent devenir :
  - Server Actions (avec `'use server'`)
  - Routes API POST

**Exemple de conversion nécessaire :**

```typescript
// AVANT (Remix)
export async function loader({ request }: LoaderArgs) {
  const data = await fetchData();
  return json({ data });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  await saveData(formData);
  return redirect('/success');
}

// APRÈS (Next.js) - Option 1: Server Component
async function Page() {
  const data = await fetchData(); // Direct dans le composant
  return <div>{data}</div>;
}

// APRÈS (Next.js) - Option 2: API Route
// /app/api/data/route.ts
export async function GET() {
  const data = await fetchData();
  return Response.json({ data });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  await saveData(formData);
  return Response.json({ success: true });
}
```

### 2. Configuration NextAuth

Créer `/frontend/app/api/auth/[...nextauth]/route.ts` :

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

Créer `/frontend/lib/auth.ts` avec la configuration d'authentification.

### 3. Internationalisation (i18n)

Les fichiers utilisent `@lingui/react`. Vous devez :
- Configurer Lingui pour Next.js App Router
- Ou migrer vers une alternative compatible (next-intl)

### 4. Imports à Corriger

De nombreux imports utilisent des alias Remix :
- `~/components/*` → `@/components/*`
- Vérifier tous les imports relatifs
- Adapter les imports de `react-router` vers `next/navigation`

### 5. Middleware et Protection des Routes

Créer `/frontend/middleware.ts` pour :
- Protéger les routes authentifiées
- Gérer les redirections
- Vérifier les permissions

### 6. Variables d'Environnement

Compléter `/frontend/.env` avec :
```
# Database
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# API
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Features
NEXT_PUBLIC_DISABLE_SIGNUP=false
```

### 7. Assets Publics

Copier les assets de Remix si nécessaire :
```bash
cp -r apps/remix/public/* frontend/public/
```

## 📋 Plan d'Action Recommandé

### Phase 1 : Fonctionnalités Critiques (Priorité Haute)
1. Configurer NextAuth et l'authentification
2. Convertir les pages de connexion/inscription
3. Convertir le dashboard principal
4. Tester le flow d'authentification complet

### Phase 2 : Fonctionnalités Principales
5. Convertir les pages de documents
6. Convertir les pages de templates
7. Convertir les settings utilisateur
8. Tester les opérations CRUD

### Phase 3 : Fonctionnalités Avancées
9. Convertir les routes embed
10. Convertir les routes recipient
11. Convertir l'admin panel
12. Convertir les organisations/teams

### Phase 4 : Finitions
13. Configurer i18n
14. Optimiser les performances
15. Tests E2E
16. Documentation

## 🔧 Commandes Utiles

```bash
# Lancer Next.js + NestJS
npm run dev

# Lancer uniquement Next.js
npm run dev:web

# Lancer uniquement NestJS
npm run dev:api

# Lancer Remix (ancienne version)
npm run dev:remix

# Build
npm run build
```

## 🔍 Fichiers à Vérifier en Priorité

1. `/frontend/app/(auth)/signin/page.tsx` - Page de connexion
2. `/frontend/app/(dashboard)/dashboard/page.tsx` - Dashboard
3. `/frontend/app/api/*/route.ts` - Routes API
4. `/frontend/components/providers.tsx` - Providers
5. `/frontend/middleware.ts` - À créer pour protection des routes

## 📝 Notes Importantes

- **Tous les fichiers migrés contiennent des TODOs** indiquant ce qui doit être converti
- Les fichiers avec hooks React ont automatiquement `'use client'` ajouté
- Les routes API sont dans `/app/api/` avec `route.ts`
- Les routes de pages sont dans leurs groupes respectifs avec `page.tsx`

## ⚡ Prochaines Étapes Immédiates

1. **Configurer NextAuth** - Sans cela, rien ne fonctionnera
2. **Convertir 3-4 pages critiques** pour tester le système
3. **Tester le flow complet** avant de continuer
4. **Itérer** page par page

## 🆘 Aide

Si vous rencontrez des erreurs spécifiques, regardez :
- Les TODOs dans les fichiers migrés
- La documentation Next.js App Router
- La documentation NextAuth
- Les exemples dans `/apps/remix/` pour comprendre la logique métier

---

**Statut actuel** : 🟡 Structure migrée, conversion manuelle nécessaire
**Estimation** : 2-4 semaines de travail pour une migration complète et testée
