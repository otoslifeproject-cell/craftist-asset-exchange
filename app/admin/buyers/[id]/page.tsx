import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import type { Buyer } from '../../../../lib/types';
import { addBuyerAction } from '../actions';
import '../../room.css';
import '../buyers.css';

function tagLabel(tag: string) {
  return tag.replace(/-/g, ' ');
}

export default async function BuyerRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin().from('buyers').select('*').eq('id', id).single();

  if (error || !data) notFound();

  const buyer = data as Buyer;

  return (
    <section className="room-page buyer-record-page">
      <div className="room-hero">
        <div>
          <div className="kicker">Buyer record</div>
          <h1>{buyer.company_name}</h1>
          <p>{buyer.buyer_type || 'Not categorised yet'} · {buyer.email}</p>
          <div className="workflow-actions hero-actions">
            <Link className="button" href="/admin/buyers">Back to buyers</Link>
          </div>
        </div>
        <div className="room-stat-card">
          <strong>{buyer.status}</strong>
          <span>{(buyer.tags || []).length} tags attached</span>
        </div>
      </div>

      <div className="room-steps">
        <div className="room-step"><span>01</span><strong>Verify</strong><small>contact details</small></div>
        <div className="room-step"><span>02</span><strong>Tag</strong><small>buyer lane</small></div>
        <div className="room-step"><span>03</span><strong>Promote</strong><small>prospect to active</small></div>
        <div className="room-step"><span>04</span><strong>Route</strong><small>ready for alerts</small></div>
      </div>

      <div className="room-grid">
        <div className="card room-form-card buyer-form-card">
          <div className="section-head compact">
            <div>
              <div className="kicker">Edit buyer</div>
              <h2 className="section-title">Clean the record.</h2>
              <p className="buyer-section-copy">Replace placeholder details, refine tags and move to active only when safe.</p>
            </div>
          </div>

          <form action={addBuyerAction} className="form room-form buyer-form">
            <label>Company<input name="company_name" required defaultValue={buyer.company_name} /></label>
            <label>Contact name<input name="contact_name" defaultValue={buyer.contact_name || ''} /></label>
            <label>Email<input name="email" type="email" required defaultValue={buyer.email} /></label>
            <div className="room-two">
              <label>Phone<input name="phone" defaultValue={buyer.phone || ''} /></label>
              <label>Postcode<input name="postcode" defaultValue={buyer.postcode || ''} /></label>
            </div>
            <label>Buyer type<input name="buyer_type" defaultValue={buyer.buyer_type || ''} /></label>
            <label>Tags<input name="tags" defaultValue={(buyer.tags || []).join(', ')} /><span className="help">Use ALL only for buyers who should see every opportunity.</span></label>
            <label>Status<select name="status" defaultValue={buyer.status}><option value="prospect">Prospect</option><option value="active">Active</option><option value="paused">Paused</option><option value="blocked">Blocked</option></select></label>
            <label>Notes<textarea name="notes" defaultValue={buyer.notes || ''} /></label>
            <button className="button green" type="submit">Save buyer</button>
          </form>
        </div>

        <div className="card room-list-card buyer-list-card">
          <div className="section-head compact buyer-list-head">
            <div>
              <div className="kicker">Current routing profile</div>
              <h2 className="section-title">Buyer summary</h2>
              <p className="buyer-section-copy">This is the buyer’s current routing state before any alerts are sent.</p>
            </div>
            <span className={`buyer-status buyer-status-${buyer.status}`}>{buyer.status}</span>
          </div>

          <div className="buyer-record-summary">
            <div className="summary-line"><span>Company</span><strong>{buyer.company_name}</strong></div>
            <div className="summary-line"><span>Contact</span><strong>{buyer.contact_name || 'Not added yet'}</strong></div>
            <div className="summary-line"><span>Email</span><strong>{buyer.email}</strong></div>
            <div className="summary-line"><span>Type</span><strong>{buyer.buyer_type || 'Not categorised yet'}</strong></div>
            <div className="summary-line"><span>Postcode</span><strong>{buyer.postcode || 'Not added yet'}</strong></div>
          </div>

          <div className="room-tags buyer-record-tags">
            {(buyer.tags || []).length ? (buyer.tags || []).map((tag) => <span className="pill subtle buyer-pill" key={tag}>{tagLabel(tag)}</span>) : <span className="buyer-muted">No tags yet</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
