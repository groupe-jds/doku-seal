import { auth } from '@/lib/auth/auth';

export default auth((req) => {
  // Middleware logic can be added here
  // For example, logging, redirects, etc.
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
