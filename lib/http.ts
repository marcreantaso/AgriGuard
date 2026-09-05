import type { VercelResponse } from '@vercel/node';

export function sendError(res: VercelResponse, status: number, code: string, message: string, details?: unknown) {
  return res.status(status).json({ error: { code, message, details } });
}

export function publicUser(user: { id: string; email: string; name: string; phone?: string | null; location?: string | null; farmSize?: string | null; primaryCrop?: string | null; createdAt?: Date | null }) {
  return { id: user.id, email: user.email, name: user.name, phone: user.phone, location: user.location, farmSize: user.farmSize, primaryCrop: user.primaryCrop, joined: user.createdAt };
}