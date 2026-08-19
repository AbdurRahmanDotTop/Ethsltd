import { Context } from 'hono';

export function getCookieDomain(c: Context): string | undefined {
  const origin = c.req.header('origin') || c.req.header('referer') || '';
  if (origin.includes('ethsltd.com')) {
    return '.ethsltd.com';
  }
  return undefined; // Let the browser use the default domain for localhost/dev
}
