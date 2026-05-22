'use server';

import { redirect } from 'next/navigation';
import { setAdminCookie } from '../../lib/auth';

function safeNextPath(value: string) {
  if (!value.startsWith('/') || value.startsWith('//')) return '/admin';
  return value;
}

export async function loginAction(formData: FormData) {
  const passcode = String(formData.get('passcode') || '');
  const next = safeNextPath(String(formData.get('next') || '/admin'));

  if (!process.env.ADMIN_PASSCODE || passcode !== process.env.ADMIN_PASSCODE) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }

  await setAdminCookie();
  redirect(next);
}
