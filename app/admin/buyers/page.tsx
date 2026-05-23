import Link from 'next/link';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import type { Buyer } from '../../../lib/types';
import { addBuyerAction } from './actions';
import { ensureProspectBuyersSeeded } from './seed';
import '../room.css';
import './buyers.css';

function tagLabel(tag: string) {
  return tag.replace(/-/g, ' ');
}

function visibleEmail(buyer: Buyer) {
  return buyer.email.endsWith('@craftist.local') ? 'Contact route' : buyer.email;
}

function contactLine(buyer: Buyer) {
  return [buyer.contact_name || null, visibleEmail(buyer), buyer.phone || null].filter(Boolean).join(' · ');
}

export default async function BuyersPage({ searchParams }: { searchParams: Promise<{ added?: string }> }) {
  const [seedResult, sp] = await Promise.all([ensureProspectBuyersSeeded(), searchParams]);
  const { data, error } = await supabaseAdmin().from('buyers').select('*').order('company_name');
  if (error) throw new Error(error.message);

  const buyers = (data || []) as Buyer[];
  const activeCount = buyers.filter((buyer) => buyer.status === 'active').length;
  const prospectCount = buyers.filter((buyer) => buyer.status === 'prospect').length;
  const contactRouteCount = buyers.filter((buyer) => !buyer.email.endsWith('@craftist.local') || buyer.phone || buyer.website).length;

  return (
    <section className="room-page buyers-room-page">
      <div className="room-hero clean-hero">
        <div>
          <div className="kicker">Buyers</div>
          <h1 className="room-title">Buyers</h1>
          <p>Add a buyer or open a record. Prospects stay separate until you set them to Active.</p>
          {sp.added ? <div className="notice compact-notice">Buyer saved.</div> : null}
          {!seedResult.ok ? <div className="notice compact-notice">Supabase setup needed.</div> : null}
        </div>
        <div className="room-stat-card compact-stat"><strong>{buyers.length}</strong><span>{prospectCount} prospects · {activeCount} active</span></div>
      </div>

      <div className="room-choice-grid">
        <a href="#add-buyer" className="choice-card"><span>01</span><strong>Add Buyer</strong><small>Create or update a contact record.</small></a>
        <a href="#view-buyers" className="choice-card"><span>02</span><strong>View Buyers</strong><small>{contactRouteCount} records have a contact route.</small></a>
      </div>

      <div className="room-grid clean-room-grid">
        <div id="add-buyer" className="card room-form-card buyer-form-card clean-panel">
          <div className="section-head compact"><div><div className="kicker">Add Buyer</div><h2 className="section-title">Contact details</h2></div></div>
          <form action={addBuyerAction} className="form room-form buyer-form">
            <label>Company<input name="company_name" required placeholder="Company / studio / operator" /></label>
            <label>Contact name<input name="contact_name" placeholder="Name if known" /></label>
            <div className="room-two"><label>Email<input name="email" type="email" required placeholder="contact@example.com" /></label><label>Phone<input name="phone" placeholder="Business number" /></label></div>
            <label>Website<input name="website" placeholder="https://company.com" /></label>
            <div className="room-two"><label>Country<input name="country" placeholder="UK / Netherlands / Germany" /></label><label>City / area<input name="postcode" placeholder="London / Amsterdam / Paris" /></label></div>
            <label>Source URL<input name="source_url" placeholder="Official website or contact page" /></label>
            <label>Buyer type<input name="buyer_type" placeholder="Prop hire / AV / festival / immersive" /></label>
            <label>Tags<input name="tags" placeholder="PROP-BIG, FESTIVAL, IMMERSIVE" /></label>
            <label>Status<select name="status" defaultValue="prospect"><option value="prospect">Prospect</option><option value="active">Active</option><option value="paused">Paused</option><option value="blocked">Blocked</option></select><span className="help">Active buyers can receive matching alerts.</span></label>
            <label>Notes<textarea name="notes" placeholder="Buying fit, location notes, approach notes..." /></label>
            <button className="button green" type="submit">Save buyer</button>
          </form>
        </div>

        <div id="view-buyers" className="card room-list-card buyer-list-card clean-panel">
          <div className="section-head compact buyer-list-head"><div><div className="kicker">View Buyers</div><h2 className="section-title">Buyer records</h2></div><div className="buyer-count-pill">{prospectCount} prospects · {activeCount} active</div></div>
          <div className="room-list compact-record-list">
            {buyers.map((buyer) => (
              <Link className="room-list-row buyer-room-row clean-record-row" href={`/admin/buyers/${buyer.id}`} key={buyer.id}>
                <div className="record-mainline"><strong>{buyer.company_name}</strong><span className={`buyer-status buyer-status-${buyer.status}`}>{buyer.status}</span></div>
                <small>{contactLine(buyer)}</small>
                <div className="room-row-meta"><span>{buyer.country || 'Country TBC'}</span><span>{buyer.buyer_type || 'Type TBC'}</span><span>{buyer.website ? 'Website saved' : 'Website TBC'}</span></div>
                <div className="room-tags">{(buyer.tags || []).slice(0, 4).map((tag) => <span className="pill subtle buyer-pill" key={tag}>{tagLabel(tag)}</span>)}</div>
              </Link>
            ))}
            {!buyers.length ? <div className="room-empty">No buyers yet.</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
