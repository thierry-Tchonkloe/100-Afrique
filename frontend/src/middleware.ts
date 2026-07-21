// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// ── Routes protégées ──────────────────────────────────────────────────────────

const ADMIN_PROTECTED   = ['/admin'];
const ADMIN_AUTH_ROUTES = ['/login', '/register'];

const EMPLOI_PROTECTED  = ['/candidat', '/recruteur'];
// FIX SÉCURITÉ : la page d'auth Emploi vit à /auth, pas /emploi/auth.
// `src/app/(emploi)/auth/page.tsx` utilise un route group `(emploi)` qui
// n'apparaît jamais dans l'URL (voir router.push('/auth?redirect=...') dans
// EmploiAuthPage). Avec l'ancienne valeur '/emploi/auth', la redirection de
// sécurité renvoyait vers une URL qui n'existe pas (404) au lieu du vrai
// formulaire de connexion — un visiteur non connecté se retrouvait bloqué
// sur une page d'erreur plutôt que sur l'écran de login.
const EMPLOI_AUTH_ROUTE = '/auth';

// ── Middleware ────────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Univers Admin ────────────────────────────────────────────────────────
  const adminToken =
    request.cookies.get('itn_auth_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  if (ADMIN_PROTECTED.some(r => pathname.startsWith(r)) && !adminToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (ADMIN_AUTH_ROUTES.some(r => pathname.startsWith(r)) && adminToken) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // ── 2. Univers Emploi ───────────────────────────────────────────────────────
  const emploiToken = request.cookies.get('emploi_token')?.value;
  const emploiRole  = request.cookies.get('emploi_role')?.value;

  // FIX SÉCURITÉ : le token seul ne suffit plus — on vérifie aussi que le
  // rôle correspond bien à l'espace visité. Sans cette vérification, un
  // candidat connecté (token valide mais role=CANDIDAT) pouvait naviguer
  // librement dans /recruteur/* et inversement, puisque seule la présence
  // d'un token quelconque était testée.
  const isRecruteurRoute = pathname.startsWith('/recruteur');
  const isCandidatRoute  = pathname.startsWith('/candidat');

  const emploiAuthorized =
    !!emploiToken &&
    ((isRecruteurRoute && emploiRole === 'RECRUITER') ||
     (isCandidatRoute  && emploiRole === 'CANDIDAT') ||
     (!isRecruteurRoute && !isCandidatRoute)); // autres routes emploi protégées, si ajoutées plus tard

  if (EMPLOI_PROTECTED.some(r => pathname.startsWith(r)) && !emploiAuthorized) {
    const loginUrl = new URL(EMPLOI_AUTH_ROUTE, request.url);
    loginUrl.searchParams.set('redirect', pathname); // restaurer la destination après login
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === EMPLOI_AUTH_ROUTE && emploiToken && emploiRole) {
    // Déjà connecté → renvoyer vers le bon dashboard selon le cookie de rôle
    const dest = emploiRole === 'RECRUITER' ? '/recruteur/dashboard' : '/candidat/dashboard';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

// ── Matcher ───────────────────────────────────────────────────────────────────
export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/register',
    '/candidat/:path*',
    '/recruteur/:path*',
    '/auth',
  ],
};
