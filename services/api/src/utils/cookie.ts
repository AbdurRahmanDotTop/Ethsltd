import { Context } from 'hono';

export function getCookieDomain(c: Context): string | undefined {
  const origin = c.req.header('origin') || c.req.header('referer') || '';
  if (origin.includes('ethsltd.com')) {
    return '.ethsltd.com';
  }
  return undefined; // Let the browser use the default domain for localhost/dev
}

export function getAuthCookieOptions(c: Context) {
  const isSecure = c.req.url.startsWith('https://') || c.req.header('x-forwarded-proto') === 'https';
  
  return {
    path: '/',
    secure: isSecure,
    sameSite: isSecure ? 'None' : 'Lax',
    domain: getCookieDomain(c),
  } as const;
}
