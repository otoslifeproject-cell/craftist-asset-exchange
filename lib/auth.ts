import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'craftist_exchange_admin';

function secrets() {
  return Array.from(new Set([
    process.env.ADMIN_SESSION_SECRET,
    process.env.ADMIN_PASSCODE,
    'dev-secret-change-me'
  ].filter(Boolean) as string[]));
}

function makeSignature(secret: string) {
  return crypto.createHmac('sha256', secret).update('admin-session-v1').digest('hex');
}

function currentSignature() {
  return makeSignature(secrets()[0] || 'dev-secret-change-me');
}

export async function isAdmin() {
  const jar = await cookies();
  const value = jar.get(COOKIE_NAME)?.value;
  if (!value) return false;
  return secrets().some((secret) => value === makeSignature(secret));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/login');
}

export async function setAdminCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, currentSignature(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
