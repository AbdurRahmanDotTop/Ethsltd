import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // List of route prefixes that require authentication
  const protectedPrefixes = [
    '/wallet',
    '/account',
    '/admin',
    '/notifications',
  ];

  // Specific strict exact or dynamic protected routes
  const strictProtectedRoutes = [
    '/expert/dashboard',
    '/support/tickets',
    '/p2p/post-ad',
    '/p2p/my-ads',
    '/p2p/order',
    '/p2p/edit-ad'
  ];

  const isProtected = 
    protectedPrefixes.some(prefix => pathname.startsWith(prefix)) ||
    strictProtectedRoutes.some(route => pathname.startsWith(route));

  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  const token = request.cookies.get('ethsltd_session')?.value;

  if (isProtected && !token) {
    // Redirect unauthenticated users to login with the intended destination
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && token) {
    // Redirect authenticated users away from auth pages to their dashboard/wallet
    // (If they came to /login with a ?redirect, we could theoretically redirect them there, 
    // but usually if they visit /login directly while logged in, just send to /account)
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    const destination = redirectParam ? redirectParam : '/account';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
