import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import type { Buyer } from '../../../lib/types';
import { addBuyerAction } from './actions';

export default async function BuyersPage() {
  const { data } = await supabaseAdmin().from('buyers').select('*').order('company_name');
  const buyers = (data || []) as Buyer[];

  return (
    <>
      <section className="hero">
        <div className="kicker">Approved buyers</div>
        <h1>Segment before you send.</h1>
        <p>Every buyer has tags. Assets only alert matching buyers, keeping the system premium rather than spammy.</p>
      </section>

      <section className="grid">
        <div className="card span-5 form">
          <h2>Add / update buyer</h2>
          <form action={addBuyerAction} className="form">
            <label>Company<input name="company_name" required /></label>
            <label>Contact name<input name="contact_name" /></label>
            <label>Email<input name="email" type="email" required /></label>
            <label>Phone<input name="phone" /></label>
            <label>Postcode<input name="postcode" /></label>
            <label>Buyer type<input name="buyer_type" placeholder="Prop hire / AV dealer / festival operator" /></label>
            <label>Tags<input name="tags" placeholder="PROP-BIG, FESTIVAL, IMMERSIVE" /><span className="help">Use ALL for a buyer who should see every opportunity.</span></label>
            <input type="hidden" name="status" value="active" />
            <label>Notes<textarea name="notes" /></label>
            <button className="button green" type="submit">Save buyer</button>
          </form>
        </div>

        <div className="card span-7">
          <h2>Buyer list</h2>
          <table className="table">
            <thead><tr><th>Company</th><th>Email</th><th>Type</th><th>Tags</th></tr></thead>
            <tbody>
              {buyers.map((buyer) => (
                <tr key={buyer.id}>
                  <td>{buyer.company_name}<br/><small>{buyer.contact_name || ''}</small></td>
                  <td>{buyer.email}</td>
                  <td>{buyer.buyer_type || '-'}</td>
                  <td>{(buyer.tags || []).map((tag) => <span className="pill" key={tag}>{tag}</span>)}</td>
                </tr>
              ))}
              {!buyers.length ? <tr><td colSpan={4}>No buyers yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
