import bcrypt from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const COOKIE_NAME = 'agriguard_session';
const secret = () => {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error('JWT_SECRET is required');
  return new TextEncoder().encode(value);
};

export const hashPassword = (password: string) => bcrypt.hash(password, 12);
export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export async function createSession(userId: string) {
  return new SignJWT({ sub: userId }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secret());
}

export async function getSessionUserId(req: VercelRequest) {
  const cookieHeader = req.headers.cookie || '';
  const token = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`))?.split('=').slice(1).join('=');
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}

export function setSessionCookie(res: VercelResponse, token: string) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
}

export function clearSessionCookie(res: VercelResponse) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
}