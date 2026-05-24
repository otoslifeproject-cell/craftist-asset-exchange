import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { formatDate, formatMoney } from '../../../../lib/format';
import type { AlertRecipient, Buyer, Item } from '../../../../lib/types';
import { formatPreferenceLabel, getBalanceDuePence, getReservationDepositPence, getTotalPricePence } from '../../../../lib/buyerPreferences';
import '../../buyer.css';

export default async function BuyerOpportunityPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ unavailable?: string }> }) {
  const { token } = await params;
  const query = await searchParams;
  const supabase = supabaseAdmin();

  const { data: recipient } = await supabase.from('alert_recipients').select('*').eq('token', token).single();
  if (!recipient) notFound();

  const rec = recipient as AlertRecipient;
  const [{ data: item }, { data: buyer }] = await Promise.all([
    supabase.from('items').select('*').eq('id', rec.item_id).single(),
    supabase.from('buyers').select('*').eq('id', rec.buyer_id).single()
  ]);
  if (!item || !buyer) notFound();

  const asset = item as Item;
  const approvedBuyer = buyer as Buyer;
  const now = new Date();
  const reservationExpired = asset.status === 'reserved' && asset.reserved_until && new Date(asset.reserved_until) < now;
  const available = asset.status === 'live' || (asset.status === 'reserved' && asset.reserved_token === token) || reservationExpired;

  if (rec.status === 'sent' || rec.status === 'queued') {
    await supabase.from('alert_recipients').update({ status: 'opened', opened_at: new Date().toISOString() }).eq('id', rec.id);
  }

  if (reservationExpired) {
    await supabase.from('items').update({ status: 'live', reserved_until: null, reserved_token: null, reservation_status: 'expired' }).eq('id', asset.id);
    asset.status = 'live';
    asset.reserved_until = null;
    asset.reserved_token = null;
  }

  const total = getTotalPricePence(asset);
  const deposit = getReservationDepositPence(asset);
  const balance = getBalanceDuePence(asset);
  const dashboardUrl = approvedBuyer.buyer_portal_token ? `/buyer/dashboard?profile=${approvedBuyer.buyer_portal_token}` : '/buyer/signup';

  return (
    <main className="buyer-page">
      <div className="shell">
        <nav className="nav buyer-nav">
          <Link className="brand" href="/">The Craftist Exchange</Link>
          <div className="navlinks"><Link href={dashboardUrl}>Manage alerts</Link><Link href="/buyer/terms">Buyer terms</Link></div>
        </nav>

        <section className="buyer-hero">
          <div className="buyer-hero-card">
            <div className="kicker">Private opportunity</div>
            <h1>{asset.title}</h1>
            <p>{asset.description || 'Private asset details are shown below for review before reserve or full payment.'}</p>
            {query.unavailable ? <div className="notice">This opportunity is not currently available.</div> : null}
            {!available ? <div className="notice">This asset is now unavailable or already sold.</div> : null}
          </div>
          <aside className="buyer-side-card">
            <strong>{approvedBuyer.company_name}</strong>
            <ul className="buyer-step-list">
              <li><span>£</span>{formatMoney(total, asset.currency)} total</li>
              <li><span>R</span>{formatMoney(deposit, asset.currency)} reserve deposit</li>
              <li><span>→</span>{formatDate(asset.decision_deadline)} deadline</li>
            </ul>
          </aside>
        </section>

        {(asset.image_urls || []).length ? <section className="buyer-opportunity-gallery">{(asset.image_urls || []).slice(0, 6).map((url) => <img key={url} src={url} alt={asset.title} />)}</section> : null}

        <section className="buyer-grid">
          <div className="card buyer-panel span-7">
            <div className="kicker">Asset details</div>
            <h2>Opportunity sheet</h2>
            <p><strong>Status:</strong> <span className="buyer-status-pill">{asset.status}</span></p>
            <p><strong>Category:</strong> {formatPreferenceLabel(asset.category)}</p>
            <p><strong>Tags:</strong> {(asset.tags || []).map((tag) => <span className="pill subtle" key={tag}>{formatPreferenceLabel(tag)}</span>)}</p>
            <p><strong>Dimensions:</strong> {asset.dimensions || 'See files'}</p>
            <p><strong>Location / dispatch:</strong> {asset.location_notes || asset.dispatch_postcode || 'TBC'}</p>
            <p><strong>Condition:</strong> {asset.condition_notes || 'Used once / post-event return. Buyer to inspect supplied details.'}</p>
            <h3>Included</h3><p>{asset.included || 'See asset sheet.'}</p>
            <h3>Exclusions</h3><p>{asset.exclusions || 'Installation, storage, venue approvals and specialist handling excluded unless stated.'}</p>
            <h3>Files</h3>{(asset.files || []).length ? (asset.files || []).map((file) => <p key={file.url}><a href={file.url} target="_blank">{file.name}</a></p>) : <p>No public files attached.</p>}
          </div>

          <div className="card buyer-panel buyer-pay-card span-5">
            <div className="kicker">Reserve or buy</div>
            <div className="buyer-price">{formatMoney(total, asset.currency)}</div>
            <p>{formatMoney(asset.guide_price_pence, asset.currency)} asset + {formatMoney(asset.transport_price_pence, asset.currency)} transport/direct dispatch.</p>
            {available ? (
              <>
                <form action="/api/buyer/checkout" method="POST">
                  <input type="hidden" name="token" value={token} />
                  <input type="hidden" name="payment_mode" value="deposit" />
                  <label>Delivery postcode<input name="delivery_postcode" placeholder="Buyer delivery postcode" required /></label>
                  <button className="button green" type="submit">Reserve with {formatMoney(deposit, asset.currency)} deposit</button>
                  <p className="help">Reserve for seven days. Balance due: {formatMoney(balance, asset.currency)}.</p>
                </form>
                <form action="/api/buyer/checkout" method="POST">
                  <input type="hidden" name="token" value={token} />
                  <input type="hidden" name="payment_mode" value="full" />
                  <label>Delivery postcode<input name="delivery_postcode" placeholder="Buyer delivery postcode" required /></label>
                  <button className="button gold" type="submit">Buy now in full</button>
                </form>
              </>
            ) : <Link className="button" href={dashboardUrl}>Manage alerts</Link>}
            <p className="help">Buyer must verify suitability, access, installation, insurance and compliance before reuse.</p>
          </div>

          <div className="card dark buyer-panel span-12">
            <div className="kicker">Why you received this</div>
            <h2>{rec.match_reason || 'This opportunity matched your saved buyer preferences.'}</h2>
            <p>You can pause alerts from your buyer dashboard at any time.</p>
          </div>
        </section>
        <footer className="footer">Private opportunity for {approvedBuyer.company_name}. Do not publish this link.</footer>
      </div>
    </main>
  );
}
