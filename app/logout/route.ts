import { redirect } from 'next/navigation';
import { clearAdminCookie } from '../../lib/auth';

export async function GET() {
  await clearAdminCookie();
  redirect('/');
}
