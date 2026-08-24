import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle API Proxy
  if (pathname.startsWith('/api/v1/')) {
    const isProd = process.env.NODE_ENV === 'production';
    const backendUrl = process.env.BACKEND_API_URL || (isProd ? 'https://api.ethsltd.com' : 'http://localhost:3001');
    
    // Construct the destination URL
    const destinationUrl = new URL(request.url);
    destinationUrl.protocol = backendUrl.split('://')[0] + ':';
    destinationUrl.host = backendUrl.split('://')[1];
    destinationUrl.port = '';
    
    // Create the rewrite response
    const response = NextResponse.rewrite(destinationUrl);
    
    // Forward essential headers
    response.headers.set('x-forwarded-host', request.nextUrl.host);
    response.headers.set('origin', request.nextUrl.origin);
    
    return response;
  }

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
    // Preserve any existing search params from the original request
    const search = request.nextUrl.search;
    redirectUrl.searchParams.set('redirect', pathname + search);
    const response = NextResponse.redirect(redirectUrl);
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }

  if (isAuthRoute && token) {
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    const redirectUrl = redirectParam || '/account';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  const response = NextResponse.next();
  if (isProtected) {
    // Prevent browsers from caching protected routes (useful for logout)
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  }
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
