// import { NextRequest, NextResponse } from 'next/server';

// const PROTECTED_ROUTES = ['/admin'];
// const AUTH_ROUTES = ['/login', '/register'];

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Get token from cookies (set server-side) or check for token header
//   const token =
//     request.cookies.get('itn_auth_token')?.value ||
//     request.headers.get('authorization')?.replace('Bearer ', '');

//   const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
//   const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

//   // Redirect unauthenticated users away from protected routes
//   if (isProtected && !token) {
//     const loginUrl = new URL('/login', request.url);
//     loginUrl.searchParams.set('from', pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Redirect authenticated users away from auth routes
//   if (isAuthRoute && token) {
//     return NextResponse.redirect(new URL('/admin/dashboard', request.url));
//   }

//   // Security headers
//   const response = NextResponse.next();
//   response.headers.set('X-Frame-Options', 'DENY');
//   response.headers.set('X-Content-Type-Options', 'nosniff');
//   response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
//   response.headers.set(
//     'Permissions-Policy',
//     'camera=(), microphone=(), geolocation=()'
//   );

//   return response;
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
// };



import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/admin'];
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token =
    request.cookies.get('itn_auth_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  // Redirections
  if (PROTECTED_ROUTES.some(r => pathname.startsWith(r)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (AUTH_ROUTES.some(r => pathname.startsWith(r)) && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

// Matcher uniquement pour admin et auth
export const config = {
  matcher: ['/admin/:path*', '/login', '/register'],
};