'use server';

import { redirect } from 'next/navigation';
import { setAdminCookie } from '../../lib/auth';

export async function loginAction(formData: FormData) {
  const passcode = String(formData.get('passcode') || '');
  if (!process.env.ADMIN_PASSCODE || passcode !== process.env.ADMIN_PASSCODE) {
    redirect('/login?error=1');
  }
  await setAdminCookie();
  redirect('/admin');
}
