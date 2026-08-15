import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from 'database'; // This imports from our database package

export type Bindings = {
  DB: D1Database;
  CREGIS_WAAS_API_KEY: string;
  CREGIS_WAAS_PROJECT_ID: string;
  CREGIS_BASE_URL: string;
  CREGIS_PE_API_KEY: string;
  CREGIS_PE_PROJECT_ID: string;
};

export type Variables = {
  db: DrizzleD1Database<typeof schema>;
  user: any; // we will define a proper user type later
};

export const createDb = (d1: D1Database) => {
  return drizzle(d1, { schema });
};
