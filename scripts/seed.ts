import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../lib/db';
import { users } from '../db/schema';

const password = process.env.DEMO_USER_PASSWORD;
if (!password) throw new Error('Set DEMO_USER_PASSWORD before seeding.');

const passwordHash = await bcrypt.hash(password, 12);
await db.insert(users).values({ email: 'farmer@agri.com', name: 'Juan Dela Cruz', passwordHash } as any).onConflictDoUpdate({ target: users.email, set: { passwordHash } });
console.log('Demo account seeded: farmer@agri.com');