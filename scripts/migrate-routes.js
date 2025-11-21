#!/usr/bin/env node

/**
 * Script pour migrer les routes Remix vers Next.js App Router
 *
 * Conversions:
 * - _unauthenticated+/signin.tsx -> app/(auth)/signin/page.tsx
 * - _authenticated+/documents._index.tsx -> app/(dashboard)/documents/page.tsx
 * - _authenticated+/documents.$id.tsx -> app/(dashboard)/documents/[id]/page.tsx
 * - api+/theme.tsx -> app/api/theme/route.ts
 */

const fs = require('fs');
const path = require('path');

const REMIX_ROUTES = path.join(__dirname, '../apps/remix/app/routes');
const NEXTJS_APP = path.join(__dirname, '../frontend/app');

// Mapping des groupes de routes
const ROUTE_GROUPS = {
  '_unauthenticated+': '(auth)',
  '_authenticated+': '(dashboard)',
  '_recipient+': '(recipient)',
  '_share+': '(share)',
  '_profile+': '(profile)',
  'embed+': '(embed)',
  'api+': 'api',
  '_internal+': '(internal)',
  '_redirects+': '(redirects)',
};

function convertRemixPathToNextjs(remixPath) {
  let nextPath = remixPath;

  // Enlever l'extension
  nextPath = nextPath.replace(/\.tsx?$/, '');

  // Convertir les groupes de routes
  Object.entries(ROUTE_GROUPS).forEach(([remixGroup, nextGroup]) => {
    nextPath = nextPath.replace(new RegExp(`^${remixGroup.replace('+', '\\+')}/`), `${nextGroup}/`);
  });

  // Convertir les paramètres dynamiques: $id -> [id]
  nextPath = nextPath.replace(/\$(\w+)/g, '[$1]');

  // Convertir _index vers page
  if (nextPath.endsWith('/_index')) {
    nextPath = nextPath.replace('/_index', '');
  }

  // Convertir _layout vers layout
  nextPath = nextPath.replace('/_layout', '/layout');

  // Ajouter /page à la fin si ce n'est pas layout, loading, error, etc.
  if (
    !nextPath.endsWith('/layout') &&
    !nextPath.endsWith('/loading') &&
    !nextPath.endsWith('/error') &&
    !nextPath.includes('/route')
  ) {
    nextPath += '/page';
  }

  // Pour les routes API, utiliser route.ts au lieu de page
  if (nextPath.startsWith('api/')) {
    nextPath = nextPath.replace('/page', '/route');
  }

  return nextPath + '.tsx';
}

function processFile(remixFile, relativePath) {
  const nextjsPath = convertRemixPathToNextjs(relativePath);
  const fullNextjsPath = path.join(NEXTJS_APP, nextjsPath);

  // Créer les répertoires nécessaires
  const dir = path.dirname(fullNextjsPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Lire le contenu du fichier Remix
  let content = fs.readFileSync(remixFile, 'utf8');

  // Transformations basiques pour Next.js
  content = content
    // Remplacer les imports Remix par Next.js
    .replace(/from ['"]react-router['"]/g, 'from "next/navigation"')
    .replace(/from ['"]@remix-run\/react['"]/g, 'from "next/navigation"')
    .replace(/\bLink\b/g, 'Link')
    .replace(/\buseNavigate\b/g, 'useRouter')
    .replace(/\buseLoaderData\b/g, '// TODO: Replace with server component or use client')
    .replace(/\buseActionData\b/g, '// TODO: Replace with server action')

    // Convertir les exports
    .replace(
      /export\s+async\s+function\s+loader/g,
      '// TODO: Convert to Server Component or API route\nexport async function loader',
    )
    .replace(
      /export\s+async\s+function\s+action/g,
      '// TODO: Convert to Server Action or API route\nexport async function action',
    )
    .replace(
      /export\s+function\s+meta/g,
      '// TODO: Convert to Next.js metadata\nexport function meta',
    );

  // Ajouter 'use client' si nécessaire (heuristique basique)

  if (
    content.includes('useState') ||
    content.includes('useEffect') ||
    content.includes('useRouter') ||
    content.includes('onClick') ||
    content.includes('onChange')
  ) {
    content = `'use client';\n\n` + content;
  }

  // Écrire le fichier
  fs.writeFileSync(fullNextjsPath, content);

  console.log(`✓ ${relativePath} -> ${nextjsPath}`);
}

function walkDirectory(dir, baseDir = dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDirectory(filePath, baseDir);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const relativePath = path.relative(baseDir, filePath);

      // Ignorer certains fichiers
      if (file === 'routes.ts' || file.startsWith('.')) {
        return;
      }

      try {
        processFile(filePath, relativePath);
      } catch (error) {
        console.error(`✗ Error processing ${relativePath}:`, error.message);
      }
    }
  });
}

console.log('🚀 Starting Remix to Next.js migration...\n');
console.log(`Source: ${REMIX_ROUTES}`);
console.log(`Destination: ${NEXTJS_APP}\n`);

walkDirectory(REMIX_ROUTES);

console.log('\n✅ Migration complete!');
console.log('\n⚠️  Important: Review all files and:');
console.log('   - Convert loaders to Server Components or API routes');
console.log('   - Convert actions to Server Actions or API routes');
console.log('   - Update metadata exports');
console.log('   - Fix import paths');
console.log('   - Test all routes\n');
