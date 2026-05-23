import Link from 'next/link';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import type { Buyer } from '../../../lib/types';
import { addBuyerAction, preloadProspectBuyersAction, refreshProspectContactDataAction } from './actions';
import '../room.css';
import './buyers.css';

const PREVIEW_BUYERS: Buyer[] = [
  { id: 'preview-prop-house', company_name: 'Northbank Prop House', contact_name: 'Example buyer', email: 'buyer@example.co.uk', phone: null, website: 'https://example.co.uk', country: 'UK', source_url: 'https://example.co.uk/contact', postcode: 'N1', buyer_type: 'Prop hire / scenic reseller', tags: ['PROP-BIG', 'SCENIC', 'BAR'], status: 'prospect', notes: 'Preview row only.', created_at: new Date().toISOString() },
  { id: 'preview-festival-operator', company_name: 'Fieldline Events Group', contact_name: 'Example buyer', email: 'events@example.co.uk', phone: null, website: 'https://example.co.uk', country: 'UK', source_url: 'https://example.co.uk/contact', postcode: 'M3', buyer_type: 'Festival / event operator', tags: ['FESTIVAL', 'OUTDOOR', 'DJ-BOOTH'], status: 'prospect', notes: 'Preview row only.', created_at: new Date().toISOString() },
  { id: 'preview-immersive-retail', company_name: 'Arcade Retail Studio', contact_name: 'Example buyer', email: 'studio@example.co.uk', phone: null, website: 'https://example.co.uk', country: 'EU', source_url: 'https://example.co.uk/contact', postcode: 'SE1', buyer_type: 'Retail / immersive install', tags: ['IMMERSIVE', 'RETAIL', 'PHOTO-MOMENT'], status: 'prospect', notes: 'Preview row only.', created_at: new Date().toISOString() }
];

function tagLabel(tag: string) {
  return tag.replace(/-/g, ' ');
}

function contactLine(buyer: Buyer) {
  const bits = [buyer.contact_name || 'No contact name yet', buyer.email || 'No email yet', buyer.phone || 'No phone yet'].filter(Boolean);
  return bits.join(' · ');
}

export default async function BuyersPage({ searchParams }: { searchParams: Promise<{ added?: string; preloaded?: string; refreshed?: string }> }) {
  const [{ data }, sp] = await Promise.all([
    supabaseAdmin().from('buyers').select('*').order('company_name'),
    searchParams
  ]);

  const buyers = (data || []) as Buyer[];
  const previewRows = buyers.length < 4 ? PREVIEW_BUYERS.slice(0, 4 - buyers.length) : [];
  const activeCount = buyers.filter((buyer) => buyer.status === 'active').length;
  const prospectCount = buyers.filter((buyer) => buyer.status === 'prospect').length;
  const universalCount = buyers.filter((buyer) => (buyer.tags || []).includes('ALL')).length;
  const shouldShowPreload = buyers.length === 0;

  return (
    <section className="room-page buyers-room-page">
      <div className="room-hero">
        <div>
          <div className="kicker">Buyers</div>
          <h1>Segment before you send.</h1>
          <p>One clean buyer room: add or preload prospects on the left, then open any buyer record from the list on the right.</p>
          {sp.added ? <div className="notice">Buyer saved. The matching pool has been refreshed.</div> : null}
          {sp.preloaded ? <div className="notice">Prospect buyer preload complete. The preload control is now hidden because buyer records exist.</div> : null}
          {sp.refreshed ? <div className="notice">Prospect contact research refreshed. Records remain prospects until you promote them manually.</div> : null}
        </div>
        <div className="room-stat-card">
          <strong>{buyers.length}</strong>
          <span>{prospectCount} prospects · {activeCount} active · {universalCount} universal</span>
        </div>
      </div>

      <div className="room-steps">
        <div className="room-step"><span>01</span><strong>Prospect</strong><small>load or add</small></div>
        <div className="room-step"><span>02</span><strong>Verify</strong><small>website, email, phone</small></div>
        <div className="room-step"><span>03</span><strong>Tag</strong><small>buyer lane</small></div>
        <div className="room-step"><span>04</span><strong>Activate</strong><small>ready for alerts</small></div>
      </div>

      <div className="room-grid">
        <div className="card room-form-card buyer-form-card">
          <div className="section-head compact">
            <div>
              <div className="kicker">Step 01</div>
              <h2 className="section-title">Add buyer</h2>
              <p className="buyer-section-copy">Default status is prospect. Promote to active only after the real email/contact is verified.</p>
            </div>
          </div>

          {shouldShowPreload ? (
            <form action={preloadProspectBuyersAction} className="preload-inline">
              <div>
                <strong>Initial prospect universe</strong>
                <small>Loads identified buyer companies with contact/source fields where verified.</small>
              </div>
              <button className="button green" type="submit">Preload prospects</button>
            </form>
          ) : (
            <form action={refreshProspectContactDataAction} className="preload-inline preload-inline-done">
              <div>
                <strong>Prospect preload is complete</strong>
                <small>Refresh contact research when the seed file is updated. This keeps every record as prospect.</small>
              </div>
              <button className="button ghost" type="submit">Refresh contact research</button>
            </form>
          )}

          <form action={addBuyerAction} className="form room-form buyer-form">
            <label>Company<input name="company_name" required placeholder="Company / studio / operator" /></label>
            <label>Contact name<input name="contact_name" placeholder="Main contact if publicly listed" /></label>
            <div className="room-two">
              <label>Email<input name="email" type="email" required placeholder="buyer@company.co.uk" /></label>
              <label>Phone<input name="phone" placeholder="Public business number" /></label>
            </div>
            <label>Website<input name="website" placeholder="https://company.com" /></label>
            <div className="room-two">
              <label>Country<input name="country" placeholder="UK / Germany / Netherlands" /></label>
              <label>Postcode / city<input name="postcode" placeholder="Area" /></label>
            </div>
            <label>Source URL<input name="source_url" placeholder="Official contact page or source" /></label>
            <label>Buyer type<input name="buyer_type" placeholder="Prop hire / AV dealer / festival operator" /></label>
            <label>Tags<input name="tags" placeholder="PROP-BIG, FESTIVAL, IMMERSIVE" /><span className="help">Use ALL only for buyers who should see every opportunity.</span></label>
            <label>Status<select name="status" defaultValue="prospect"><option value="prospect">Prospect</option><option value="active">Active</option><option value="paused">Paused</option><option value="blocked">Blocked</option></select></label>
            <label>Notes<textarea name="notes" placeholder="What they buy, locations, budget notes, speed, special interests..." /></label>
            <button className="button green" type="submit">Save buyer</button>
          </form>
        </div>

        <div className="card room-list-card buyer-list-card">
          <div className="section-head compact buyer-list-head">
            <div>
              <div className="kicker">Step 02</div>
              <h2 className="section-title">Buyer list</h2>
              <p className="buyer-section-copy">Click any buyer to open the record, verify contact details and refine tags.</p>
            </div>
            <div className="buyer-count-pill">{prospectCount} prospects · {activeCount} active</div>
          </div>

          <div className="room-list">
            {buyers.map((buyer) => (
              <Link className="room-list-row buyer-room-row" href={`/admin/buyers/${buyer.id}`} key={buyer.id}>
                <div>
                  <strong>{buyer.company_name}</strong>
                  <small>{contactLine(buyer)}</small>
                </div>
                <div className="room-row-meta">
                  <span className={`buyer-status buyer-status-${buyer.status}`}>{buyer.status}</span>
                  <span>{buyer.country || 'Country TBC'}</span>
                  <span>{buyer.buyer_type || 'Not categorised yet'}</span>
                </div>
                <div className="buyer-link-line">
                  {buyer.website ? <span>{buyer.website}</span> : <span>No website yet</span>}
                </div>
                <div className="room-tags">{(buyer.tags || []).slice(0, 5).map((tag) => <span className="pill subtle buyer-pill" key={tag}>{tagLabel(tag)}</span>)}</div>
              </Link>
            ))}

            {previewRows.map((buyer) => (
              <div className="room-list-row buyer-room-row buyer-row-preview" key={buyer.id}>
                <div><strong>{buyer.company_name}</strong><small>{contactLine(buyer)}</small></div>
                <div className="room-row-meta"><span className="buyer-status buyer-status-prospect">prospect</span><span>{buyer.country}</span><span>{buyer.buyer_type}</span></div>
                <div className="buyer-link-line"><span>{buyer.website}</span></div>
                <div className="room-tags">{(buyer.tags || []).map((tag) => <span className="pill subtle buyer-pill buyer-pill-preview" key={tag}>{tagLabel(tag)}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}