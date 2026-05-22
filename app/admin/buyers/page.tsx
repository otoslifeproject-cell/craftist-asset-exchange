import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import type { Buyer } from '../../../lib/types';
import { addBuyerAction } from './actions';

export default async function BuyersPage({ searchParams }: { searchParams: Promise<{ added?: string }> }) {
  const [{ data }, sp] = await Promise.all([
    supabaseAdmin().from('buyers').select('*').order('company_name'),
    searchParams
  ]);
  const buyers = (data || []) as Buyer[];
  const universalCount = buyers.filter((buyer) => (buyer.tags || []).includes('ALL')).length;

  return (
    <>
      <section className="hero stack">
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

          <div className="card glass">
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

      <section className="grid">
        <div className="card span-5 form">
          <div className="section-head compact">
            <div>
              <div className="kicker">Step 01</div>
              <h2 className="section-title">Add / update buyer</h2>
            </div>
          </div>
          <form action={addBuyerAction} className="form">
            <label>Company<input name="company_name" required /></label>
            <label>Contact name<input name="contact_name" /></label>
            <label>Email<input name="email" type="email" required /></label>
            <label>Phone<input name="phone" /></label>
            <label>Postcode<input name="postcode" /></label>
            <label>Buyer type<input name="buyer_type" placeholder="Prop hire / AV dealer / festival operator" /></label>
            <label>
              Tags
              <input name="tags" placeholder="PROP-BIG, FESTIVAL, IMMERSIVE" />
              <span className="help">Use ALL only for a buyer who should see every opportunity.</span>
            </label>
            <input type="hidden" name="status" value="active" />
            <label>Notes<textarea name="notes" /></label>
            <button className="button green" type="submit">Save buyer</button>
          </form>
        </div>

        <div className="card span-7">
          <div className="section-head compact">
            <div>
              <div className="kicker">Step 02</div>
              <h2 className="section-title">Buyer list</h2>
            </div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Company</th><th>Email</th><th>Type</th><th>Tags</th></tr></thead>
              <tbody>
                {buyers.map((buyer) => (
                  <tr key={buyer.id}>
                    <td>{buyer.company_name}<br /><small>{buyer.contact_name || ''}</small></td>
                    <td>{buyer.email}</td>
                    <td>{buyer.buyer_type || '-'}</td>
                    <td>{(buyer.tags || []).map((tag) => <span className="pill subtle" key={tag}>{tag}</span>)}</td>
                  </tr>
                ))}
                {!buyers.length ? <tr><td colSpan={4}>No buyers yet.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
