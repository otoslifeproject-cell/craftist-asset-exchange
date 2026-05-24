import Link from 'next/link';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import type { Buyer, Order } from '../../../lib/types';
import { formatDate, formatMoney } from '../../../lib/format';
import { BUYER_CATEGORIES, BUYER_TAGS, formatPreferenceLabel } from '../../../lib/buyerPreferences';
import { pauseBuyerAlertsAction, updateBuyerPreferencesAction } from '../actions';
import '../buyer.css';

export default async function BuyerDashboardPage({ searchParams }: { searchParams: Promise<{ profile?: string; signed?: string; updated?: string; paused?: string }> }) {
  const sp = await searchParams;
  const token = sp.profile || '';
  let buyer: Buyer | null = null;
  let orders: Order[] = [];

  if (token) {
    const supabase = supabaseAdmin();
    const { data } = await supabase.from('buyers').select('*').eq('buyer_portal_token', token).single();
    buyer = data as Buyer | null;
    if (buyer) {
      const { data: orderRows } = await supabase.from('orders').select('*').eq('buyer_id', buyer.id).order('created_at', { ascending: false }).limit(20);
      orders = (orderRows || []) as Order[];
    }
  }

  if (!buyer) {
    return (
      <main className="buyer-page">
        <div className="shell">
          <nav className="nav buyer-nav"><Link className="brand" href="/">The Craftist Exchange</Link><div className="navlinks"><Link href="/buyer/signup">Sign up</Link></div></nav>
          <section className="buyer-hero buyer-payment-result">
            <div className="buyer-hero-card"><div className="kicker">Buyer dashboard</div><h1>Profile link needed.</h1><p>Use the dashboard link supplied after sign up or inside your private opportunity email.</p><Link className="button gold" href="/buyer/signup">Sign up</Link></div>
          </section>
        </div>
      </main>
    );
  }

  const categories = buyer.preferred_categories || [];
  const tags = buyer.preferred_tags || buyer.tags || [];
  const reservedOrders = orders.filter((order) => ['deposit_paid', 'balance_pending'].includes(order.status));
  const paidOrders = orders.filter((order) => order.status === 'paid');

  return (
    <main className="buyer-page">
      <div className="shell">
        <nav className="nav buyer-nav">
          <Link className="brand" href="/">The Craftist Exchange</Link>
          <div className="navlinks"><Link href="/buyer/terms">Buyer terms</Link><Link href="/buyer/signup">Sign up</Link></div>
        </nav>

        <section className="buyer-hero">
          <div className="buyer-hero-card">
            <div className="kicker">Buyer dashboard</div>
            <h1>{buyer.company_name}</h1>
            <p>Your buyer profile, alert preferences, saved opportunities and payment status are shown here. Only active buyers with accepted terms and alert consent can receive matched private opportunities.</p>
            {sp.signed ? <div className="notice">Profile received. It remains a prospect until approved.</div> : null}
            {sp.updated ? <div className="notice">Preferences updated.</div> : null}
            {sp.paused ? <div className="notice">Alerts paused.</div> : null}
          </div>
          <aside className="buyer-side-card">
            <strong>Status: <span className="buyer-status-pill">{buyer.status}</span></strong>
            <ul className="buyer-step-list">
              <li><span>✓</span>Terms: {buyer.terms_accepted_at ? formatDate(buyer.terms_accepted_at) : 'Not accepted'}</li>
              <li><span>✓</span>Alert consent: {buyer.alert_consent_at ? formatDate(buyer.alert_consent_at) : 'Not confirmed'}</li>
              <li><span>→</span>Last alert: {formatDate(buyer.last_alerted_at)}</li>
            </ul>
          </aside>
        </section>

        <section className="buyer-grid">
          <div className="card buyer-panel span-4"><div className="buyer-summary"><span>Saved opportunities</span><strong>{orders.length}</strong></div></div>
          <div className="card buyer-panel span-4"><div className="buyer-summary"><span>Reserved</span><strong>{reservedOrders.length}</strong></div></div>
          <div className="card buyer-panel span-4"><div className="buyer-summary"><span>Paid</span><strong>{paidOrders.length}</strong></div></div>
        </section>

        <section className="buyer-grid" style={{ marginTop: 20 }}>
          <div className="card buyer-panel span-6">
            <div className="kicker">Profile summary</div><h2>Buyer profile</h2>
            <div className="buyer-summary-grid">
              <div className="buyer-summary"><span>Contact</span><strong>{buyer.contact_name || 'TBC'}</strong></div>
              <div className="buyer-summary"><span>Email</span><strong>{buyer.email}</strong></div>
              <div className="buyer-summary"><span>Region</span><strong>{buyer.postcode || buyer.country || 'TBC'}</strong></div>
            </div>
          </div>
          <div className="card buyer-panel span-6">
            <div className="kicker">Manage alerts</div><h2>Pause alerts</h2>
            <p>Pause alerts if you want to stop private opportunities while keeping the profile on record.</p>
            <form action={pauseBuyerAlertsAction} className="buyer-actions"><input type="hidden" name="portal_token" value={token} /><button className="button" type="submit">Pause alerts</button></form>
          </div>
        </section>

        <section className="card buyer-panel" style={{ marginTop: 20 }}>
          <div className="kicker">Preferences</div><h2>Manage preferences</h2>
          <form action={updateBuyerPreferencesAction} className="stack">
            <input type="hidden" name="portal_token" value={token} />
            <div className="buyer-card-grid">{BUYER_CATEGORIES.map((category) => <label className="buyer-choice" key={category.id}><input type="checkbox" name="preferred_categories" value={category.id} defaultChecked={categories.includes(category.id)} /><strong>{category.label}</strong><small>{category.tagHints.join(' · ')}</small></label>)}</div>
            <div className="buyer-tag-grid">{BUYER_TAGS.map((tag) => <label className="buyer-tag" key={tag.id}><input type="checkbox" name="preferred_tags" value={tag.id} defaultChecked={tags.includes(tag.id)} /> {tag.label}</label>)}</div>
            <button className="button green" type="submit">Manage alerts</button>
          </form>
        </section>

        <section className="card buyer-panel" style={{ marginTop: 20 }}>
          <div className="kicker">Payment status</div><h2>Reserved and paid opportunities</h2>
          <div className="table-wrap"><table className="table"><thead><tr><th>Created</th><th>Status</th><th>Mode</th><th>Amount</th><th>Reserved until</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td>{formatDate(order.created_at)}</td><td>{order.status}</td><td>{order.payment_mode}</td><td>{formatMoney(order.amount_pence, order.currency)}</td><td>{formatDate(order.reserved_until)}</td></tr>)}{!orders.length ? <tr><td colSpan={5}>No opportunities yet.</td></tr> : null}</tbody></table></div>
        </section>

        <footer className="footer">Buyer profile link is private. Keep it inside your company buying route.</footer>
      </div>
    </main>
  );
}
