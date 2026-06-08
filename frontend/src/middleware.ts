// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// ── Routes protégées ──────────────────────────────────────────────────────────

const ADMIN_PROTECTED   = ['/admin'];
const ADMIN_AUTH_ROUTES = ['/login', '/register'];

const EMPLOI_PROTECTED  = ['/candidat', '/recruteur'];
const EMPLOI_AUTH_ROUTE = '/emploi/auth';

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

  if (EMPLOI_PROTECTED.some(r => pathname.startsWith(r)) && !emploiToken) {
    const loginUrl = new URL(EMPLOI_AUTH_ROUTE, request.url);
    loginUrl.searchParams.set('redirect', pathname); // restaurer la destination après login
    return NextResponse.redirect(loginUrl);
  }
  if (pathname.startsWith(EMPLOI_AUTH_ROUTE) && emploiToken) {
    // Déjà connecté → renvoyer vers le bon dashboard selon le cookie de rôle
    const role = request.cookies.get('emploi_role')?.value;
    const dest = role === 'RECRUITER' ? '/recruteur/dashboard' : '/candidat/dashboard';
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
    '/emploi/auth',
  ],
};