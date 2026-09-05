import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../lib/db';
import { alerts, users } from '../../db/schema';
import { clearSessionCookie, comparePassword, createSession, getSessionUserId, hashPassword, setSessionCookie } from '../../lib/auth';
import { publicUser, sendError } from '../../lib/http';

const signupSchema = z.object({ name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(320), password: z.string().min(8).max(128) });
const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1) });
const profileSchema = z.object({ name: z.string().trim().min(2).max(120).optional(), phone: z.string().max(32).optional(), location: z.string().max(160).optional(), farmSize: z.string().max(80).optional(), primaryCrop: z.string().max(80).optional() }).strict();
const passwordSchema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8).max(128) });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  const action = Array.isArray(req.query.action) ? req.query.action[0] : req.query.action;
  try {
    if (req.method === 'POST' && action === 'signup') {
      const input = signupSchema.safeParse(req.body);
      if (!input.success) return sendError(res, 400, 'VALIDATION_ERROR', 'Check your name, email, and password.', input.error.flatten().fieldErrors);
      const email = input.data.email.toLowerCase();
      const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
      if (existing.length) return sendError(res, 409, 'ACCOUNT_EXISTS', 'An account with this email already exists.');
      const [user] = await db.insert(users).values({ name: input.data.name, email, passwordHash: await hashPassword(input.data.password) }).returning();
      setSessionCookie(res, await createSession(user.id));
      return res.status(201).json({ user: publicUser(user) });
    }
    if (req.method === 'POST' && action === 'login') {
      const input = loginSchema.safeParse(req.body);
      if (!input.success) return sendError(res, 400, 'VALIDATION_ERROR', 'Enter a valid email and password.');
      const [user] = await db.select().from(users).where(eq(users.email, input.data.email.toLowerCase())).limit(1);
      if (!user || !(await comparePassword(input.data.password, user.passwordHash))) return sendError(res, 401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
      setSessionCookie(res, await createSession(user.id));
      return res.json({ user: publicUser(user) });
    }
    if (req.method === 'POST' && action === 'logout') {
      clearSessionCookie(res);
      return res.json({ ok: true });
    }
    if (req.method === 'POST' && action === 'verify') {
      const userId = await getSessionUserId(req);
      if (!userId) return sendError(res, 401, 'UNAUTHORIZED', 'Your session has expired.');
      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user) return sendError(res, 401, 'UNAUTHORIZED', 'Your session has expired.');
      return res.json({ user: publicUser(user) });
    }
    if (req.method === 'PUT' && action === 'profile') {
      const userId = await getSessionUserId(req);
      if (!userId) return sendError(res, 401, 'UNAUTHORIZED', 'Sign in to update your profile.');
      const input = profileSchema.safeParse(req.body);
      if (!input.success) return sendError(res, 400, 'VALIDATION_ERROR', 'Profile information is invalid.');
      const [user] = await db.update(users).set({ ...input.data } as any).where(eq(users.id, userId)).returning();
      if (!user) return sendError(res, 404, 'NOT_FOUND', 'User not found.');
      return res.json({ user: publicUser(user) });
    }
    if (req.method === 'PUT' && action === 'password') {
      const userId = await getSessionUserId(req);
      if (!userId) return sendError(res, 401, 'UNAUTHORIZED', 'Sign in to change your password.');
      const input = passwordSchema.safeParse(req.body);
      if (!input.success) return sendError(res, 400, 'VALIDATION_ERROR', 'New password must be at least 8 characters.');
      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user || !(await comparePassword(input.data.currentPassword, user.passwordHash))) return sendError(res, 401, 'INVALID_CREDENTIALS', 'Current password is incorrect.');
      await db.update(users).set({ passwordHash: await hashPassword(input.data.newPassword) } as any).where(eq(users.id, userId));
      return res.json({ ok: true });
    }
    if (req.method === 'GET' && action === 'alerts') {
      const userId = await getSessionUserId(req);
      if (!userId) return sendError(res, 401, 'UNAUTHORIZED', 'Sign in to view alerts.');
      return res.json({ alerts: await db.select().from(alerts).where(eq(alerts.userId, userId)) });
    }
    return sendError(res, 404, 'NOT_FOUND', 'Authentication route not found.');
  } catch (error) {
    console.error('API error', error);
    return sendError(res, 500, 'SERVER_ERROR', 'The service is temporarily unavailable.');
  }
}