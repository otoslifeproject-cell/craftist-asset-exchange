import crypto from 'crypto';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'craftist_exchange_admin';
const SESSION_PAYLOAD = 'admin-session-v1';

function secrets() {
  return Array.from(new Set([
    process.env.ADMIN_SESSION_SECRET,
    process.env.ADMIN_PASSCODE,
    'dev-secret-change-me'
  ].filter(Boolean) as string[]));
}

function makeSignature(secret: string) {
  return crypto.createHmac('sha256', secret).update(SESSION_PAYLOAD).digest('hex');
}

export function currentAdminSignature() {
  return makeSignature(secrets()[0] || 'dev-secret-change-me');
}

function isValidSignature(value: string | undefined | null) {
  if (!value) return false;
  return secrets().some((secret) => value === makeSignature(secret));
}

function requestedPathFallback() {
  return '/admin';
}

export async function isAdmin() {
  const jar = await cookies();
  return isValidSignature(jar.get(COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  if (await isAdmin()) return;

  const next = requestedPathFallback();
  redirect(`/login?next=${encodeURIComponent(next)}`);
}

export async function setAdminCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, currentAdminSignature(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function refreshAdminCookie() {
  if (!(await isAdmin())) return false;
  await setAdminCookie();
  return true;
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
