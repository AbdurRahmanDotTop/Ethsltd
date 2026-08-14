import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { eq, and } from 'drizzle-orm';
import { Bindings, Variables } from '../db';
import { users, sessions, wallets } from 'database';
import { jwtMiddleware } from '../middleware/jwt';

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
  
  const existingUser = await db.select().from(users).where(eq(users.email, body.email)).get();
  if (existingUser) {
    return c.json({ success: false, error: 'Email already in use' }, 400);
  }

  const hashedPassword = await hashPassword(body.password);
  const userId = crypto.randomUUID();
  const sessionId = crypto.randomUUID();
  const now = new Date();

  await db.insert(users).values({
    id: userId,
    email: body.email,
    passwordHash: hashedPassword,
    createdAt: now,
    updatedAt: now,
    role: 'USER',
    status: 'ACTIVE'
  });

  await db.insert(sessions).values({
    id: sessionId,
    userId: userId,
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 1 day
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
    await db.insert(wallets).values({
      id: crypto.randomUUID(),
      userId: userId,
      assetSymbol: fund.assetSymbol,
      type: 'DEMO',
      balance: fund.amount,
      lockedBalance: '0',
      createdAt: now,
      updatedAt: now,
    });
  }

  const token = await sign({ id: userId, email: body.email, sessionId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, JWT_SECRET);

  const user = await db.select().from(users).where(eq(users.id, userId)).get();

  return c.json({ success: true, token, data: { user } });
  } catch (err: any) {
    return c.json({ success: false, error: err.message, stack: err.stack }, 500);
  }
});

authRoutes.post('/login', async (c) => {
  const body = await c.req.json();
  const db = c.get('db');
  
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

  await db.insert(sessions).values({
    id: sessionId,
    userId: user.id,
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 1 day
    userAgent: c.req.header('user-agent') || 'Unknown',
    ipAddress: c.req.header('x-real-ip') || c.req.header('x-forwarded-for') || 'Unknown',
    createdAt: now,
  });

  await db.update(users).set({ lastLoginAt: now }).where(eq(users.id, user.id));

  const token = await sign({ id: user.id, email: user.email, sessionId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, JWT_SECRET);

  return c.json({ success: true, token, data: { user } });
});

authRoutes.get('/me', jwtMiddleware, async (c) => {
  const user = c.get('user');
  return c.json({ success: true, data: user });
});

authRoutes.post('/profile/update', jwtMiddleware, async (c) => {
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
});

authRoutes.get('/sessions', jwtMiddleware, async (c) => {
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
});

authRoutes.post('/sessions/revoke', jwtMiddleware, async (c) => {
  const body = await c.req.json();
  const user = c.get('user');
  const db = c.get('db');
  
  await db.delete(sessions).where(and(eq(sessions.id, body.sessionId), eq(sessions.userId, user.id)));
  
  return c.json({ success: true });
});

authRoutes.post('/sessions/revoke-all', jwtMiddleware, async (c) => {
  const user = c.get('user');
  const db = c.get('db');
  const jwtPayload = c.get('jwtPayload') as any;
  const currentSessionId = jwtPayload?.sessionId;

  // Delete all except current
  if (currentSessionId) {
    const allSessions = await db.select().from(sessions).where(eq(sessions.userId, user.id)).all();
    for (const s of allSessions) {
      if (s.id !== currentSessionId) {
        await db.delete(sessions).where(eq(sessions.id, s.id));
      }
    }
  }
  
  return c.json({ success: true });
});
