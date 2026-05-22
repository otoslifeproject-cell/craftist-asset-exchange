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
  const draftCount = rows.filter((item) => item.status === 'draft').length;
  const soldCount = rows.filter((item) => item.status === 'sold').length;
  const featuredItem = rows.find((item) => (item.image_urls || []).length) || rows[0] || null;
  const featuredImage = featuredItem?.image_urls?.[0] || null;

  return (
    <>
      <section className="hero stack">
        <div className="hero-grid">
          <div className="hero-panel">
            <div className="kicker">Control room</div>
            <h1>Inventory → alert → paid.</h1>
            <p>
              Keep the route obvious: build the buyer base, add the asset once, then publish into the right segment.
              The interface should feel like a guided flow rather than a flat admin table.
            </p>
            <div className="workflow-actions hero-actions">
              <Link className="button green" href="/admin/items/new">Create new asset</Link>
              <Link className="button" href="/admin/buyers">Manage buyers</Link>
            </div>
          </div>

          <div className="featured-visual">
            {featuredImage ? (
              <>
                <img src={featuredImage} alt={featuredItem?.title || 'Featured asset'} />
                <div className="featured-badge">
                  <strong>{featuredItem?.title || 'Latest asset'}</strong>
                  <span>
                    {featuredItem?.status?.toUpperCase()} · {featuredItem ? formatMoney((featuredItem.guide_price_pence || 0) + (featuredItem.transport_price_pence || 0), featuredItem.currency) : 'Ready for routing'}
                  </span>
                </div>
              </>
            ) : (
              <div className="featured-placeholder">
                <div className="featured-placeholder-inner">
                  <div className="kicker">Visual slot</div>
                  <h2 className="feature-title">Use asset imagery to lift the room.</h2>
                  <p>
                    As soon as you upload images, the best one can live here to brighten the dashboard and make the latest opportunity feel tangible.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="workflow-grid">
          <div className="workflow-step">
            <div className="step-no">01</div>
            <h3>Build the buyer lane</h3>
            <p>Make sure each buyer is tagged properly so every alert lands with the right audience first time.</p>
            <div className="mini-note">{buyerCount || 0} active buyer{buyerCount === 1 ? '' : 's'} in the system</div>
            <div className="workflow-actions">
              <Link className="button" href="/admin/buyers">Open buyers</Link>
            </div>
          </div>

          <div className="workflow-step">
            <div className="step-no">02</div>
            <h3>Create the asset sheet</h3>
            <p>Add the visuals, price, files and buyer tags once, then tighten the opportunity page before publishing.</p>
            <div className="mini-note">{draftCount} draft asset{draftCount === 1 ? '' : 's'} waiting for review</div>
            <div className="workflow-actions">
              <Link className="button" href="/admin/items/new">New asset</Link>
            </div>
          </div>

          <div className="workflow-step">
            <div className="step-no">03</div>
            <h3>Publish and track</h3>
            <p>Once an asset is ready, publish the alert batch and watch who receives, opens and converts.</p>
            <div className="mini-note">{liveCount} live · {orderCount || soldCount} paid / sold</div>
            <div className="workflow-actions">
              {rows[0] ? <Link className="button" href={`/admin/items/${rows[0].id}`}>Review latest asset</Link> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="metric-grid dashboard-metrics">
        <div className="card inset">
          <div className="stat">{liveCount}</div>
          <span className="stat-label">Live assets in active circulation</span>
        </div>
        <div className="card inset">
          <div className="stat">{buyerCount || 0}</div>
          <span className="stat-label">Approved active buyers</span>
        </div>
        <div className="card inset">
          <div className="stat">{orderCount || soldCount}</div>
          <span className="stat-label">Paid / sold orders</span>
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <div className="section-copy">
            <div className="kicker">Asset queue</div>
            <h2 className="section-title">Latest assets</h2>
            <p>The newest records stay visible here so the next action is always obvious.</p>
          </div>
          <Link className="button green" href="/admin/items/new">Add asset</Link>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Status</th>
                <th>Price</th>
                <th>Deadline</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link href={`/admin/items/${item.id}`}>{item.title}</Link>
                    <br />
                    <small>{item.dimensions || 'No dimensions yet'}</small>
                  </td>
                  <td><span className={`status ${item.status}`}>{item.status}</span></td>
                  <td>{formatMoney((item.guide_price_pence || 0) + (item.transport_price_pence || 0), item.currency)}</td>
                  <td>{formatDate(item.decision_deadline)}</td>
                  <td>{(item.tags || []).map((tag) => <span className="pill subtle" key={tag}>{tag}</span>)}</td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={5}>No assets yet. Add the first one.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
