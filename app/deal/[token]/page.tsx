import { notFound } from 'next/navigation';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { formatDate, formatMoney } from '../../../lib/format';
import type { AlertRecipient, Buyer, Item } from '../../../lib/types';

export default async function DealPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ paid?: string; cancelled?: string; error?: string }> }) {
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
    await supabase.from('items').update({ status: 'live', reserved_until: null, reserved_token: null }).eq('id', asset.id);
    asset.status = 'live';
    asset.reserved_until = null;
    asset.reserved_token = null;
  }

  const totalPrice = (asset.guide_price_pence || 0) + (asset.transport_price_pence || 0);

  return (
    <main>
      <div className="shell">
        <nav className="nav">
          <div className="brand">The Craftist Exchange</div>
          <div className="navlinks"><span className="pill light">Private buyer link</span></div>
        </nav>

        <section className="hero">
          <div className="kicker">Private opportunity for {approvedBuyer.company_name}</div>
          <h1>{asset.title}</h1>
          <p style={{ maxWidth: 800 }}>{asset.description}</p>
          {query.paid ? <div className="notice">Payment received. The asset is now locked as sold.</div> : null}
          {query.cancelled ? <div className="notice">Checkout cancelled. This opportunity may still be available until someone completes payment.</div> : null}
          {query.error ? <div className="notice">This asset is not currently available for checkout.</div> : null}
        </section>

        {(asset.image_urls || []).length ? (
          <section className="asset-gallery" style={{ marginBottom: 18 }}>
            {(asset.image_urls || []).slice(0, 6).map((url) => <img key={url} src={url} alt={asset.title} />)}
          </section>
        ) : null}

        <section className="grid">
          <div className="card span-7">
            <h2>Asset details</h2>
            <p><strong>Status:</strong> <span className={`status ${asset.status}`}>{asset.status}</span></p>
            <p><strong>Dimensions:</strong> {asset.dimensions || 'See files'}</p>
            <p><strong>Dispatch postcode:</strong> {asset.dispatch_postcode || 'TBC'}</p>
            <p><strong>Decision deadline:</strong> {formatDate(asset.decision_deadline)}</p>
            <p><strong>Condition:</strong> {asset.condition_notes || 'Used once / post-event return. Buyer to inspect supplied details.'}</p>
            <h3>Included</h3><p>{asset.included || 'See asset sheet.'}</p>
            <h3>Exclusions</h3><p>{asset.exclusions || 'Installation, storage, venue approvals and specialist handling excluded unless stated.'}</p>
            <h3>Compliance notes</h3><p>{asset.compliance_notes || 'Buyer must verify safe reuse, installation, power/electrics, fire status and venue suitability.'}</p>
            <h3>Files</h3>
            {(asset.files || []).length ? (asset.files || []).map((file) => <p key={file.url}><a href={file.url} target="_blank">{file.name}</a></p>) : <p>No public files attached.</p>}
          </div>

          <div className="card span-5">
            <div className="kicker" style={{ color: '#174a32' }}>Buy direct</div>
            <div className="big-price">{formatMoney(totalPrice, asset.currency)}</div>
            <p>{formatMoney(asset.guide_price_pence, asset.currency)} asset + {formatMoney(asset.transport_price_pence, asset.currency)} transport/direct dispatch.</p>
            {available ? (
              <form action="/api/checkout" method="POST" className="form">
                <input type="hidden" name="token" value={token} />
                <label>Delivery postcode required before checkout<input name="delivery_postcode" placeholder="Buyer delivery postcode" required /></label>
                <button className="button gold" type="submit">Buy now with Stripe</button>
              </form>
            ) : (
              <button className="button" disabled>Not currently available</button>
            )}
            <p className="help">Stripe collects payment, billing address, shipping address and phone number. Asset release happens after confirmed payment.</p>
          </div>

          <div className="card dark span-12">
            <h2>Buyer acknowledgement</h2>
            <p>By purchasing, the buyer accepts that these are specialist one-use scenic/event assets. Suitability, competent installation, lifting/offload, insurance, fire/electrical compliance, venue approval and safe reuse must be checked by the buyer unless expressly agreed in writing.</p>
          </div>
        </section>
        <footer className="footer">Private token link for {approvedBuyer.company_name}. This page is not indexed or publicly browsable.</footer>
      </div>
    </main>
  );
}
