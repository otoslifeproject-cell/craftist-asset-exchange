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

function visibleEmail(email: string) {
  return email.endsWith('@craftist.local') ? 'Contact route only' : email;
}

function sourceLabel(buyer: Buyer) {
  if (buyer.source_url) return buyer.source_url;
  if (buyer.website) return buyer.website;
  return 'Source TBC';
}

export default async function BuyerRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin().from('buyers').select('*').eq('id', id).single();

  if (error || !data) notFound();

  const buyer = data as Buyer;
  const tags = buyer.tags || [];

  return (
    <section className="room-page buyer-record-page">
      <div className="room-hero clean-hero">
        <div>
          <div className="kicker">Buyer record</div>
          <h1 className="room-title">{buyer.company_name}</h1>
          <p>{buyer.buyer_type || 'Type TBC'} · {buyer.country || 'Country TBC'}</p>
          <div className="workflow-actions hero-actions">
            <Link className="button" href="/admin/buyers">Back to buyers</Link>
          </div>
        </div>
        <div className="room-stat-card compact-stat buyer-status-tile">
          <span className={`buyer-status buyer-status-${buyer.status}`}>{buyer.status}</span>
          <strong>{tags.length}</strong>
          <span>tags attached</span>
        </div>
      </div>

      <div className="room-choice-grid buyer-record-actions">
        <a href="#edit-buyer" className="choice-card"><span>01</span><strong>Edit Buyer</strong><small>Contact, tags and status.</small></a>
        <a href="#buyer-profile" className="choice-card"><span>02</span><strong>View Profile</strong><small>Clean account summary.</small></a>
      </div>

      <div className="room-grid clean-room-grid">
        <div id="edit-buyer" className="card room-form-card buyer-form-card clean-panel">
          <div className="section-head compact">
            <div>
              <div className="kicker">Edit Buyer</div>
              <h2 className="section-title">Contact details</h2>
            </div>
          </div>

          <form action={addBuyerAction} className="form room-form buyer-form">
            <label>Company<input name="company_name" required defaultValue={buyer.company_name} /></label>
            <label>Contact name<input name="contact_name" defaultValue={buyer.contact_name || ''} placeholder="Name if known" /></label>
            <div className="room-two">
              <label>Email<input name="email" type="email" required defaultValue={buyer.email} /></label>
              <label>Phone<input name="phone" defaultValue={buyer.phone || ''} placeholder="Business number" /></label>
            </div>
            <label>Website<input name="website" defaultValue={buyer.website || ''} placeholder="https://company.com" /></label>
            <div className="room-two">
              <label>Country<input name="country" defaultValue={buyer.country || ''} placeholder="UK / Netherlands / Germany" /></label>
              <label>City / area<input name="postcode" defaultValue={buyer.postcode || ''} placeholder="London / Amsterdam / Paris" /></label>
            </div>
            <label>Source URL<input name="source_url" defaultValue={buyer.source_url || ''} placeholder="Official website or contact page" /></label>
            <label>Buyer type<input name="buyer_type" defaultValue={buyer.buyer_type || ''} placeholder="Prop hire / AV / festival / immersive" /></label>
            <label>Tags<input name="tags" defaultValue={tags.join(', ')} placeholder="PROP-BIG, FESTIVAL, IMMERSIVE" /></label>
            <label>Status<select name="status" defaultValue={buyer.status}><option value="prospect">Prospect</option><option value="active">Active</option><option value="paused">Paused</option><option value="blocked">Blocked</option></select><span className="help">Active buyers can receive matching alerts.</span></label>
            <label>Notes<textarea name="notes" defaultValue={buyer.notes || ''} placeholder="Buying fit, location notes, approach notes..." /></label>
            <button className="button green" type="submit">Save buyer</button>
          </form>
        </div>

        <div id="buyer-profile" className="card room-list-card buyer-list-card clean-panel buyer-profile-card">
          <div className="section-head compact buyer-list-head">
            <div>
              <div className="kicker">View Profile</div>
              <h2 className="section-title">Buyer profile</h2>
            </div>
            <span className={`buyer-status buyer-status-${buyer.status}`}>{buyer.status}</span>
          </div>

          <div className="buyer-profile-grid">
            <div className="profile-field"><span>Company</span><strong>{buyer.company_name}</strong></div>
            <div className="profile-field"><span>Contact</span><strong>{buyer.contact_name || 'Contact TBC'}</strong></div>
            <div className="profile-field"><span>Email</span><strong>{visibleEmail(buyer.email)}</strong></div>
            <div className="profile-field"><span>Phone</span><strong>{buyer.phone || 'Phone TBC'}</strong></div>
            <div className="profile-field"><span>Website</span><strong>{buyer.website || 'Website TBC'}</strong></div>
            <div className="profile-field"><span>Country</span><strong>{buyer.country || 'Country TBC'}</strong></div>
            <div className="profile-field"><span>Type</span><strong>{buyer.buyer_type || 'Type TBC'}</strong></div>
            <div className="profile-field"><span>Source</span><strong>{sourceLabel(buyer)}</strong></div>
          </div>

          <div className="buyer-tag-panel">
            <div className="kicker">Tags</div>
            <div className="room-tags buyer-record-tags">
              {tags.length ? tags.map((tag) => <span className="pill subtle buyer-pill" key={tag}>{tagLabel(tag)}</span>) : <span className="buyer-muted">No tags yet</span>}
            </div>
          </div>

          {buyer.notes ? (
            <div className="buyer-notes-panel">
              <div className="kicker">Notes</div>
              <p>{buyer.notes}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
