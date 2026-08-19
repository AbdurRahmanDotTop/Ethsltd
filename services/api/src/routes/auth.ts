import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { setCookie, deleteCookie } from 'hono/cookie';
import { eq, and, sql } from 'drizzle-orm';
import { Bindings, Variables } from '../db';
import { users, sessions, wallets } from 'database';
import { jwtMiddleware } from '../middleware/jwt';
import { generateBusinessId } from '../services/id-generator';
import { EmailService } from '../services/email';
import { getCookieDomain } from '../utils/cookie';

export const authRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

const JWT_SECRET = 'super_secret_jwt_key_replace_me_in_prod';

async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

authRoutes.post('/register', async (c) => {
  const body = await c.req.json();
  const db = c.get('db');
  
  try {
  if (!body.email || !body.password) {
    return c.json({ success: false, error: 'Email and password are required' }, 400);
  }
  
  const existingUser = await db.select().from(users).where(eq(users.email, body.email)).get();
  if (existingUser) {
    return c.json({ success: false, error: 'Email already in use' }, 400);
  }

  const hashedPassword = await hashPassword(body.password);
  const userId = crypto.randomUUID();
  const sessionId = crypto.randomUUID();
  const now = new Date();

  // Check if this is the first user without loading all users into memory
  const result = await db.select({ count: sql<number>`count(*)` }).from(users).get();
  const isFirstUser = result?.count === 0;

  const displayId = await generateBusinessId(db, body.email, 'USER');

  await db.insert(users).values({
    id: userId,
    displayId,
    email: body.email,
    passwordHash: hashedPassword,
    createdAt: now,
    updatedAt: now,
    role: isFirstUser ? 'SUPER_ADMIN' : 'USER',
    status: 'ACTIVE'
  });

  const sessionDuration = 7 * 24 * 60 * 60 * 1000; // 7 days

  await db.insert(sessions).values({
    id: sessionId,
    userId: userId,
    expiresAt: new Date(now.getTime() + sessionDuration),
    userAgent: c.req.header('user-agent') || 'Unknown',
    ipAddress: c.req.header('x-real-ip') || c.req.header('x-forwarded-for') || 'Unknown',
    createdAt: now,
  });

  // Auto-fund demo trading wallets for new user
  const initialDemoFunds = [
    { assetSymbol: 'USDT', amount: '100000' },
    { assetSymbol: 'BTC', amount: '10' },
    { assetSymbol: 'ETH', amount: '100' }
  ];

  for (const fund of initialDemoFunds) {
    const walletDisplayId = await generateBusinessId(db, body.email, 'WALL');
    await db.insert(wallets).values({
      id: crypto.randomUUID(),
      displayId: walletDisplayId,
      userId: userId,
      assetSymbol: fund.assetSymbol,
      type: 'DEMO',
      balance: fund.amount,
      lockedBalance: '0',
      createdAt: now,
      updatedAt: now,
    });
  }

  const token = await sign({ id: userId, email: body.email, sessionId, exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) }, JWT_SECRET);

  setCookie(c, 'ethsltd_session', token, {
    path: '/',
    secure: c.req.url.startsWith('https://'),
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60,
    sameSite: 'Lax',
    domain: getCookieDomain(c),
  });

  const user = await db.select().from(users).where(eq(users.id, userId)).get();

  // Async Email Dispatch
  const emailService = new EmailService(c.env, db);
  const verifyToken = await sign({ purpose: 'email_verify', userId: user?.id, exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) }, JWT_SECRET);
  // We determine the origin based on request headers (or a configured APP_URL)
  const appUrl = c.req.header('origin') || `https://${c.req.header('host')}`;
  
  c.executionCtx.waitUntil((async () => {
    try {
      await emailService.sendAdminNewUserAlert(user);
      await emailService.sendVerificationEmail(user!.email, verifyToken, appUrl);
    } catch (e) {
      console.error("Background email failed", e);
    }
  })());

  return c.json({ success: true, token, data: { user } });
  } catch (err: any) {
    return c.json({ success: false, error: err.message, stack: err.stack }, 500);
  }
});

authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const db = c.get('db');
    
    if (!body.email || !body.password) {
      return c.json({ success: false, error: 'Email and password are required' }, 400);
    }
    
    const user = await db.select().from(users).where(eq(users.email, body.email)).get();
    if (!user) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401);
    }

    const hashedPassword = await hashPassword(body.password);
  if (user.passwordHash !== hashedPassword) {
    return c.json({ success: false, error: 'Invalid credentials' }, 401);
  }

  const sessionId = crypto.randomUUID();
  const now = new Date();

  const sessionDuration = 7 * 24 * 60 * 60 * 1000; // 7 days

  await db.insert(sessions).values({
    id: sessionId,
    userId: user.id,
    expiresAt: new Date(now.getTime() + sessionDuration),
    userAgent: c.req.header('user-agent') || 'Unknown',
    ipAddress: c.req.header('x-real-ip') || c.req.header('x-forwarded-for') || 'Unknown',
    createdAt: now,
  });

  await db.update(users).set({ lastLoginAt: now }).where(eq(users.id, user.id));

  const token = await sign({ id: user.id, email: user.email, sessionId, exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) }, JWT_SECRET);

  setCookie(c, 'ethsltd_session', token, {
    path: '/',
    secure: c.req.url.startsWith('https://'),
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60,
    sameSite: 'Lax',
    domain: getCookieDomain(c),
  });

    return c.json({ success: true, token, data: { user } });
  } catch (err: any) {
    return c.json({ success: false, error: err.message, stack: err.stack }, 500);
  }
});

authRoutes.get('/me', jwtMiddleware, async (c) => {
  try {
    const user = c.get('user');
    return c.json({ success: true, data: user });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

authRoutes.post('/verify-email', async (c) => {
  const body = await c.req.json();
  const token = body.token;
  if (!token) return c.json({ success: false, error: 'Token required' }, 400);

  try {
    const { verify } = await import('hono/jwt');
    const payload = await verify(token, JWT_SECRET);
    if (payload.purpose !== 'email_verify' || !payload.userId) {
      return c.json({ success: false, error: 'Invalid token' }, 400);
    }
    const db = c.get('db');
    await db.update(users).set({ emailVerified: true }).where(eq(users.id, payload.userId as string));
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ success: false, error: 'Token expired or invalid' }, 400);
  }
});

authRoutes.post('/profile/update', jwtMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const user = c.get('user');
    const db = c.get('db');
    const now = new Date();

    await db.update(users)
      .set({
        displayName: body.displayName,
        firstName: body.firstName,
        lastName: body.lastName,
        updatedAt: now,
      })
      .where(eq(users.id, user.id));

    const updatedUser = await db.select().from(users).where(eq(users.id, user.id)).get();
    return c.json({ success: true, data: updatedUser });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

authRoutes.get('/sessions', jwtMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const db = c.get('db');
    
    const activeSessions = await db.select().from(sessions).where(eq(sessions.userId, user.id)).all();
    
    const jwtPayload = c.get('jwtPayload') as any;
    const currentSessionId = jwtPayload?.sessionId;

    const mappedSessions = activeSessions.map(s => ({
      id: s.id,
      device: s.userAgent?.includes('Mobile') ? 'Mobile' : 'Desktop',
      browser: s.userAgent?.split(' ')[0] || 'Unknown Browser',
      os: s.userAgent?.split(' ')[1] || 'Unknown OS',
      lastActiveAt: s.createdAt,
      isCurrentSession: s.id === currentSessionId
    }));

    return c.json({ success: true, data: mappedSessions });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

authRoutes.post('/sessions/revoke', jwtMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const user = c.get('user');
    const db = c.get('db');
    
    if (!body.sessionId) {
      return c.json({ success: false, error: 'Session ID is required' }, 400);
    }

    await db.delete(sessions).where(and(eq(sessions.id, body.sessionId), eq(sessions.userId, user.id)));
    
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

authRoutes.post('/sessions/revoke-all', jwtMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const db = c.get('db');
    const jwtPayload = c.get('jwtPayload') as any;
    const currentSessionId = jwtPayload?.sessionId;

    if (currentSessionId) {
      const allSessions = await db.select().from(sessions).where(eq(sessions.userId, user.id)).all();
      for (const s of allSessions) {
        if (s.id !== currentSessionId) {
          await db.delete(sessions).where(eq(sessions.id, s.id));
        }
      }
    }
    
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

authRoutes.post('/logout', jwtMiddleware, async (c) => {
  try {
    const db = c.get('db');
    const jwtPayload = c.get('jwtPayload') as any;
    const currentSessionId = jwtPayload?.sessionId;

    if (currentSessionId) {
      await db.delete(sessions).where(eq(sessions.id, currentSessionId));
    }

    deleteCookie(c, 'ethsltd_session', { path: '/', secure: c.req.url.startsWith('https://'), sameSite: 'Lax', domain: getCookieDomain(c) });
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});
