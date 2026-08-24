import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const backendUrl = process.env.BACKEND_API_URL || (isProd ? 'https://api.ethsltd.com' : 'http://localhost:3001');
    
    // Construct target URL
    const url = req.url || '';
    // req.url in pages/api is the path + search params e.g. /api/v1/auth/me?foo=bar
    const targetUrl = `${backendUrl.replace(/\/$/, '')}${url}`;
    
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (key.toLowerCase() !== 'host' && value) {
        if (Array.isArray(value)) {
          value.forEach(v => headers.append(key, v));
        } else {
          headers.set(key, value);
        }
      }
    }
    
    // Set explicit origin for backend CORS and getCookieDomain
    const protocol = req.headers['x-forwarded-proto'] || (req.socket && (req.socket as any).encrypted ? 'https' : 'http');
    const host = req.headers['host'] || req.headers['x-forwarded-host'] || '';
    const origin = `${protocol}://${host}`;
    
    headers.set('origin', origin);
    headers.set('x-forwarded-host', host as string);

    // Get body if not GET/HEAD
    let body: any = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      if (chunks.length > 0) {
        body = Buffer.concat(chunks);
      }
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      redirect: 'manual',
    });

    // Forward status
    res.status(response.status);

    // Forward headers
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'set-cookie') {
        res.setHeader(key, value);
      }
    });

    // Handle Set-Cookie separately to prevent comma concatenation
    if (typeof response.headers.getSetCookie === 'function') {
      const setCookies = response.headers.getSetCookie();
      if (setCookies && setCookies.length > 0) {
        res.setHeader('Set-Cookie', setCookies);
      }
    } else {
      const cookieHeader = response.headers.get('set-cookie');
      if (cookieHeader) {
        // Next.js res.setHeader handles array of cookies correctly
        res.setHeader('Set-Cookie', cookieHeader.split(/,(?=\s*[a-zA-Z0-9_-]+\s*=)/));
      }
    }

    // Forward body
    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          res.write(value);
        }
      }
    }
    res.end();
  } catch (error: any) {
    console.error('Pages API Proxy Error:', error);
    res.status(502).json({ success: false, error: 'Bad Gateway', details: error.message });
  }
}
