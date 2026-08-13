import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { eq } from 'drizzle-orm';
import { Bindings, Variables } from '../db';
import { users, sessions } from 'database';

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
  
  const existingUser = await db.select().from(users).where(eq(users.email, body.email)).get();
  if (existingUser) {
    return c.json({ success: false, error: 'Email already in use' }, 400);
  }

  const hashedPassword = await hashPassword(body.password);
  const userId = crypto.randomUUID();

  await db.insert(users).values({
    id: userId,
    email: body.email,
    passwordHash: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 'USER',
    status: 'ACTIVE'
  });

  const token = await sign({ id: userId, email: body.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, JWT_SECRET);

  return c.json({ success: true, token, data: { id: userId, email: body.email } });
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

  const token = await sign({ id: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, JWT_SECRET);

  return c.json({ success: true, token, data: { id: user.id, email: user.email, role: user.role } });
});

authRoutes.get('/me', async (c) => {
  // In a real app, use jwt middleware. Here we extract for simplicity if needed.
  // We'll mock the 'me' response for now or assume a middleware sets user
  return c.json({ success: true, data: { id: "mock", email: "mock@example.com" } });
});
