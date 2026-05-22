import Link from 'next/link';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import type { Buyer } from '../../../lib/types';
import { addBuyerAction, preloadProspectBuyersAction } from './actions';
import './buyers.css';

const PREVIEW_BUYERS: Buyer[] = [
  {
    id: 'preview-prop-house',
    company_name: 'Northbank Prop House',
    contact_name: 'Example buyer',
    email: 'buyer@example.co.uk',
    phone: null,
    postcode: 'N1',
    buyer_type: 'Prop hire / scenic reseller',
    tags: ['PROP-BIG', 'SCENIC', 'BAR'],
    status: 'prospect',
    notes: 'Preview row only — shows how tagged buyers will sit once the pool grows.',
    created_at: new Date().toISOString()
  },
  {
    id: 'preview-festival-operator',
    company_name: 'Fieldline Events Group',
    contact_name: 'Example buyer',
    email: 'events@example.co.uk',
    phone: null,
    postcode: 'M3',
    buyer_type: 'Festival / event operator',
    tags: ['FESTIVAL', 'OUTDOOR', 'DJ-BOOTH'],
    status: 'prospect',
    notes: 'Preview row only — useful for checking spacing, pills and hierarchy.',
    created_at: new Date().toISOString()
  },
  {
    id: 'preview-immersive-retail',
    company_name: 'Arcade Retail Studio',
    contact_name: 'Example buyer',
    email: 'studio@example.co.uk',
    phone: null,
    postcode: 'SE1',
    buyer_type: 'Retail / immersive install',
    tags: ['IMMERSIVE', 'RETAIL', 'PHOTO-MOMENT'],
    status: 'prospect',
    notes: 'Preview row only — remove naturally as real buyers are added.',
    created_at: new Date().toISOString()
  }
];

function tagLabel(tag: string) {
  return tag.replace(/-/g, ' ');
}

export default async function BuyersPage({ searchParams }: { searchParams: Promise<{ added?: string; preloaded?: string }> }) {
  const [{ data }, sp] = await Promise.all([
    supabaseAdmin().from('buyers').select('*').order('company_name'),
    searchParams
  ]);

  const buyers = (data || []) as Buyer[];
  const previewRows = buyers.length < 4 ? PREVIEW_BUYERS.slice(0, 4 - buyers.length) : [];
  const activeCount = buyers.filter((buyer) => buyer.status === 'active').length;
  const prospectCount = buyers.filter((buyer) => buyer.status === 'prospect').length;
  const universalCount = buyers.filter((buyer) => (buyer.tags || []).includes('ALL')).length;

  return (
    <>
      <section className="hero stack buyer-hero">
        <div className="hero-grid">
          <div className="hero-panel">
            <div className="kicker">Approved buyers</div>
            <h1>Segment before you send.</h1>
            <p>
              Every buyer starts as a prospect. Verify the contact, then promote the buyer to active before real alerts go out.
              Assets only alert matching buyers, keeping the system premium rather than spammy.
            </p>
            {sp.added ? <div className="notice">Buyer saved. The list and matching pool have been refreshed.</div> : null}
            {sp.preloaded ? <div className="notice">Prospect buyer preload complete. These records are marked as prospects until verified.</div> : null}
          </div>

          <div className="card glass buyer-snapshot">
            <div className="kicker">Routing snapshot</div>
            <div className="copy-stack">
              <h2 className="section-title">Keep the pool clean.</h2>
              <ul className="subtle-list">
                <li>
                  <strong>{buyers.length} buyers saved</strong>
                  <span>{prospectCount} prospects · {activeCount} active buyers.</span>
                </li>
                <li>
                  <strong>{universalCount} universal buyer{universalCount === 1 ? '' : 's'}</strong>
                  <span>Use the ALL tag only where a buyer genuinely wants every opportunity.</span>
                </li>
                <li>
                  <strong>Tags keep alerts selective</strong>
                  <span>Think in categories first: prop hire, AV, festival, immersive, retail, salvage.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="card buyer-preload-card">
        <div>
          <div className="kicker">Prospect preload</div>
          <h2 className="section-title">Load the first buyer universe.</h2>
          <p className="buyer-section-copy">
            This inserts the initial identified buyer companies as prospect records. The emails are safe internal placeholder addresses until real contacts are verified.
          </p>
        </div>
        <form action={preloadProspectBuyersAction}>
          <button className="button green" type="submit">Preload prospect buyers</button>
        </form>
      </section>

      <section className="grid buyer-room">
        <div className="card span-5 form buyer-form-card">
          <div className="section-head compact">
            <div>
              <div className="kicker">Step 01</div>
              <h2 className="section-title">Add / update buyer</h2>
              <p className="buyer-section-copy">Keep the buyer record simple, clean and properly tagged.</p>
            </div>
          </div>
          <form action={addBuyerAction} className="form buyer-form">
            <label>Company<input name="company_name" required placeholder="Company / studio / operator" /></label>
            <label>Contact name<input name="contact_name" placeholder="Main contact" /></label>
            <label>Email<input name="email" type="email" required placeholder="buyer@company.co.uk" /></label>
            <label>Phone<input name="phone" placeholder="Optional" /></label>
            <label>Postcode<input name="postcode" placeholder="Dispatch / operating area" /></label>
            <label>Buyer type<input name="buyer_type" placeholder="Prop hire / AV dealer / festival operator" /></label>
            <label>
              Tags
              <input name="tags" placeholder="PROP-BIG, FESTIVAL, IMMERSIVE" />
              <span className="help">Use ALL only for a buyer who should see every opportunity.</span>
            </label>
            <label>
              Status
              <select name="status" defaultValue="prospect">
                <option value="prospect">Prospect</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="blocked">Blocked</option>
              </select>
            </label>
            <label>Notes<textarea name="notes" placeholder="What they buy, locations, budget notes, speed, special interests..." /></label>
            <button className="button green" type="submit">Save buyer</button>
          </form>
        </div>

        <div className="card span-7 buyer-list-card">
          <div className="section-head compact buyer-list-head">
            <div>
              <div className="kicker">Step 02</div>
              <h2 className="section-title">Buyer list</h2>
              <p className="buyer-section-copy">Click any live buyer to open their record. Preview rows show how the room will look as the list grows.</p>
            </div>
            <div className="buyer-count-pill">{prospectCount} prospects · {activeCount} active</div>
          </div>

          <div className="buyer-table-shell">
            <table className="table buyer-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Tags</th>
                </tr>
              </thead>
              <tbody>
                {buyers.map((buyer) => (
                  <tr key={buyer.id} className="buyer-row buyer-row-live">
                    <td>
                      <Link className="buyer-company-link" href={`/admin/buyers/${buyer.id}`}>
                        <strong>{buyer.company_name}</strong>
                        <small>{buyer.contact_name || 'No contact name yet'}</small>
                      </Link>
                    </td>
                    <td>
                      <Link className="buyer-email-link" href={`/admin/buyers/${buyer.id}`}>{buyer.email}</Link>
                    </td>
                    <td><span className="buyer-type-text">{buyer.buyer_type || 'Not categorised yet'}</span></td>
                    <td><span className={`buyer-status buyer-status-${buyer.status}`}>{buyer.status}</span></td>
                    <td>
                      <div className="buyer-tag-cluster">
                        {(buyer.tags || []).length ? (buyer.tags || []).map((tag) => <span className="pill subtle buyer-pill" key={tag}>{tagLabel(tag)}</span>) : <span className="buyer-muted">No tags yet</span>}
                      </div>
                    </td>
                  </tr>
                ))}

                {previewRows.map((buyer) => (
                  <tr key={buyer.id} className="buyer-row buyer-row-preview">
                    <td>
                      <div className="buyer-company-link buyer-company-link-preview">
                        <strong>{buyer.company_name}</strong>
                        <small>{buyer.contact_name}</small>
                      </div>
                    </td>
                    <td><span className="buyer-muted">{buyer.email}</span></td>
                    <td><span className="buyer-type-text">{buyer.buyer_type}</span></td>
                    <td><span className="buyer-status buyer-status-prospect">prospect</span></td>
                    <td>
                      <div className="buyer-tag-cluster">
                        {(buyer.tags || []).map((tag) => <span className="pill subtle buyer-pill buyer-pill-preview" key={tag}>{tagLabel(tag)}</span>)}
                      </div>
                    </td>
                  </tr>
                ))}

                {!buyers.length && !previewRows.length ? <tr><td colSpan={5}>No buyers yet.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
