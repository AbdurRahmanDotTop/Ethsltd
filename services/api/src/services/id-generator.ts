import { DrizzleD1Database } from 'drizzle-orm/d1';
import { globalSequences } from '@ethsltd/database/schema';
import { eq, sql } from 'drizzle-orm';
import * as schema from '@ethsltd/database/schema';

/**
 * Global centralized business ID generator
 * Format: [EMAIL_PREFIX]-[ENTITY_PREFIX]-[SEQUENCE_NUM]-[YYYYMMDD]-[HHMMSS]
 */
export async function generateBusinessId(
  db: DrizzleD1Database<typeof schema>,
  email: string | null | undefined,
  entityPrefix: string
): Promise<string> {
  // 1. Process Email Prefix
  let emailPrefix = 'SYS';
  if (email) {
    const localPart = email.split('@')[0];
    emailPrefix = localPart.substring(0, 11).toUpperCase();
  }

  // 2. Ensure Entity Prefix is max 4 chars uppercase
  const prefix = entityPrefix.substring(0, 4).toUpperCase();

  // 3. Increment sequence atomically (Drizzle + D1 SQLite)
  const seqResult = await db.insert(globalSequences)
    .values({ entityType: prefix, currentValue: 1 })
    .onConflictDoUpdate({
      target: globalSequences.entityType,
      set: { currentValue: sql`${globalSequences.currentValue} + 1` }
    })
    .returning({ currentValue: globalSequences.currentValue });

  const seqNumber = seqResult[0].currentValue;

  // 4. Date and Time
  const now = new Date();
  
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;

  const HH = String(now.getUTCHours()).padStart(2, '0');
  const MM = String(now.getUTCMinutes()).padStart(2, '0');
  const SS = String(now.getUTCSeconds()).padStart(2, '0');
  const timeStr = `${HH}${MM}${SS}`;

  // 5. Assemble
  return `${emailPrefix}-${prefix}-${seqNumber}-${dateStr}-${timeStr}`;
}
