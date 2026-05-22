import Link from 'next/link';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import type { Buyer } from '../../../lib/types';
import { addBuyerAction } from './actions';
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
    status: 'active',
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
    status: 'active',
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
    status: 'active',
    notes: 'Preview row only — remove naturally as real buyers are added.',
    created_at: new Date().toISOString()
  }
];

function tagLabel(tag: string) {
  return tag.replace(/-/g, ' ');
}

export default async function BuyersPage({ searchParams }: { searchParams: Promise<{ added?: string }> }) {
  const [{ data }, sp] = await Promise.all([
    supabaseAdmin().from('buyers').select('*').order('company_name'),
    searchParams
  ]);

  const buyers = (data || []) as Buyer[];
  const previewRows = buyers.length < 4 ? PREVIEW_BUYERS.slice(0, 4 - buyers.length) : [];
  const universalCount = buyers.filter((buyer) => (buyer.tags || []).includes('ALL')).length;

  return (
    <>
      <section className="hero stack buyer-hero">
        <div className="hero-grid">
          <div className="hero-panel">
            <div className="kicker">Approved buyers</div>
            <h1>Segment before you send.</h1>
            <p>
              Every buyer has tags. Assets only alert matching buyers, keeping the system premium rather than spammy.
              Build the right buyer shape first, then let every asset flow into it.
            </p>
            {sp.added ? <div className="notice">Buyer saved. The list and matching pool have been refreshed.</div> : null}
          </div>

          <div className="card glass buyer-snapshot">
            <div className="kicker">Routing snapshot</div>
            <div className="copy-stack">
              <h2 className="section-title">Keep the pool clean.</h2>
              <ul className="subtle-list">
                <li>
                  <strong>{buyers.length} buyers saved</strong>
                  <span>Every company added here becomes part of the routing system.</span>
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
            <input type="hidden" name="status" value="active" />
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
            <div className="buyer-count-pill">{buyers.length} live</div>
          </div>

          <div className="buyer-table-shell">
            <table className="table buyer-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Type</th>
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
                    <td>
                      <div className="buyer-tag-cluster">
                        {(buyer.tags || []).map((tag) => <span className="pill subtle buyer-pill buyer-pill-preview" key={tag}>{tagLabel(tag)}</span>)}
                      </div>
                    </td>
                  </tr>
                ))}

                {!buyers.length && !previewRows.length ? <tr><td colSpan={4}>No buyers yet.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
