import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'craftist_exchange_admin';

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSCODE || 'dev-secret-change-me';
}

function signature() {
  return crypto.createHmac('sha256', getSecret()).update('admin-session-v1').digest('hex');
}

export async function isAdmin() {
  const jar = await cookies();
  return jar.get(COOKIE_NAME)?.value === signature();
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/login');
}

export async function setAdminCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, signature(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 10
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
