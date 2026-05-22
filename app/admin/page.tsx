import Link from 'next/link';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { formatDate, formatMoney } from '../../lib/format';
import type { Item } from '../../lib/types';

const REQUIRED_ENV = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_STORAGE_BUCKET'
];

function SetupCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <>
      <section className="hero">
        <div className="kicker">Setup check</div>
        <h1>Admin login works.</h1>
        <p>The control room loaded, but the database connection still needs one small fix.</p>
      </section>
      <section className="card">
        <h2>{title}</h2>
        <ul>
          {lines.map((line) => <li key={line}><code>{line}</code></li>)}
        </ul>
        <p>Fix the item above in Vercel, then redeploy with build cache off.</p>
      </section>
    </>
  );
}

export default async function AdminDashboard() {
  const missing = REQUIRED_ENV.filter((name) => !process.env[name]);

  if (missing.length) {
    return <SetupCard title="Missing Vercel environment variables" lines={missing} />;
  }

  let rows: Item[] = [];
  let buyerCount = 0;
  let orderCount = 0;
  let setupError = '';

  try {
    const supabase = supabaseAdmin();
    const [itemsResult, buyersResult, ordersResult] = await Promise.all([
      supabase.from('items').select('*').order('created_at', { ascending: false }).limit(20),
      supabase.from('buyers').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'paid')
    ]);

    if (itemsResult.error) setupError = itemsResult.error.message;
    if (buyersResult.error) setupError = buyersResult.error.message;
    if (ordersResult.error) setupError = ordersResult.error.message;

    rows = (itemsResult.data || []) as Item[];
    buyerCount = buyersResult.count || 0;
    orderCount = ordersResult.count || 0;
  } catch (error) {
    setupError = error instanceof Error ? error.message : 'Unknown Supabase setup error';
  }

  if (setupError) {
    return <SetupCard title="Supabase connection error" lines={[setupError]} />;
  }

  const liveCount = rows.filter((item) => item.status === 'live').length;
  const soldCount = rows.filter((item) => item.status === 'sold').length;

  return (
    <>
      <section className="hero">
        <div className="kicker">Control room</div>
        <h1>Inventory → alert → paid.</h1>
        <p>Upload an asset, tag the buyer category, send the private alert and let the buyer pay directly from the deal page.</p>
      </section>

      <section className="grid" style={{ marginBottom: 18 }}>
        <div className="card span-4"><div className="stat">{liveCount}</div><p>Live assets in active circulation</p></div>
        <div className="card span-4"><div className="stat">{buyerCount}</div><p>Approved active buyers</p></div>
        <div className="card span-4"><div className="stat">{orderCount || soldCount}</div><p>Paid / sold orders</p></div>
      </section>

      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ margin: 0 }}>Latest assets</h2>
          <Link className="button green" href="/admin/items/new">Add asset</Link>
        </div>
        <table className="table">
          <thead><tr><th>Asset</th><th>Status</th><th>Price</th><th>Deadline</th><th>Tags</th></tr></thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id}>
                <td><Link href={`/admin/items/${item.id}`}>{item.title}</Link><br/><small>{item.dimensions || 'No dimensions yet'}</small></td>
                <td><span className={`status ${item.status}`}>{item.status}</span></td>
                <td>{formatMoney((item.guide_price_pence || 0) + (item.transport_price_pence || 0), item.currency)}</td>
                <td>{formatDate(item.decision_deadline)}</td>
                <td>{(item.tags || []).map((tag) => <span className="pill" key={tag}>{tag}</span>)}</td>
              </tr>
            ))}
            {!rows.length ? <tr><td colSpan={5}>No assets yet. Add the first one.</td></tr> : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
