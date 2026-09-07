import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../_db/schema';

// Export a getter so we don't throw at top-level if env var is missing during Vercel cold-start
export const getDb = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required in environment variables');
  }
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
};
