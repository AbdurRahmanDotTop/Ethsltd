import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { eq } from 'drizzle-orm';
import { users, sessions } from 'database';

export async function jwtMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Missing or invalid Authorization header' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const secret = 'super_secret_jwt_key_replace_me_in_prod'; // Use env variable in prod

  try {
    const payload = await verify(token, secret, "HS256");
    
    // Find user in database
    const db = c.get('db');
    const user = await db.select().from(users).where(eq(users.id, payload.id as string)).get();
    
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 401);
    }

    if (user.status !== 'ACTIVE') {
      return c.json({ success: false, error: 'Account is not active' }, 403);
    }

    // Set user in context for downstream handlers
    c.set('user', user);
    c.set('jwtPayload', payload);

    await next();
  } catch (error) {
    return c.json({ success: false, error: 'Invalid or expired token' }, 401);
  }
}

export async function adminMiddleware(c: Context, next: Next) {
  const user = c.get('user');
  
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return c.json({ success: false, error: 'Forbidden. Admin access required.' }, 403);
  }

  await next();
}
