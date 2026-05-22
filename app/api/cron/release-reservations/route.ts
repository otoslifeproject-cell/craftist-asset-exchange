import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const now = new Date().toISOString();
  const supabase = supabaseAdmin();
  const { data: expired, error: selectError } = await supabase
    .from('items')
    .select('id')
    .eq('status', 'reserved')
    .lt('reserved_until', now);

  if (selectError) return NextResponse.json({ ok: false, error: selectError.message }, { status: 500 });

  const ids = (expired || []).map((row) => row.id);
  if (ids.length) {
    const { error } = await supabase
      .from('items')
      .update({ status: 'live', reserved_until: null, reserved_token: null, updated_at: now })
      .in('id', ids);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, released: ids.length });
}
