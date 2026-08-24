import { NextRequest } from "next/server";

export const runtime = 'edge'; // Run this on Cloudflare Edge
export const dynamic = 'force-dynamic'; // Prevent Next.js from caching GET requests

async function proxyRequest(req: NextRequest, { params }: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  // We should hit the actual backend here, not the proxy itself.
  // In production, the backend is https://api.ethsltd.com. Locally, it might be http://localhost:3001.
  const backendUrl = process.env.BACKEND_API_URL || (process.env.NODE_ENV === 'production' ? 'https://api.ethsltd.com' : 'http://localhost:3001');
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const searchParams = req.nextUrl.search;
  const targetUrl = `${backendUrl.replace(/\/$/, '')}/api/v1/${path}${searchParams}`;

  // Forward all necessary headers, EXPLICITLY including cookies and auth
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    // Skip host header, let fetch set it automatically to the destination host
    if (key.toLowerCase() !== 'host') {
      headers.set(key, value);
    }
  });

  // Ensure origin is set correctly so the backend's getCookieDomain logic works
  headers.set('origin', req.nextUrl.origin);
  headers.set('x-forwarded-host', req.nextUrl.host);

  let body = undefined;
  // Only parse body for methods that allow it
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      body = await req.arrayBuffer();
    } catch (e) {
      // Ignore body parsing errors
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      redirect: 'manual', // Don't automatically follow redirects, pass them back to the client
    });

    // Create a new response to forward back to the client
    const responseHeaders = new Headers(response.headers);
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error('API Proxy Error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Bad Gateway', details: error.message }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
