import Link from 'next/link';
import { buyerSignupAction } from './actions';
import { ALERT_FREQUENCY_OPTIONS, BUYER_ALERT_CATEGORIES, BUYER_TERMS_VERSION, PAYMENT_ROUTE_OPTIONS } from '../../lib/buyerPreferences';
import './buyer-signup.css';

export default function BuyerSignupPage() {
  return (
    <main className="buyer-entry-page">
      <div className="shell">
        <nav className="nav buyer-entry-nav">
          <Link className="brand" href="/">The Craftist Exchange</Link>
          <div className="navlinks">
            <Link href="/buyer-terms">Buyer terms</Link>
            <Link href="/login">Admin login</Link>
          </div>
        </nav>

        <section className="buyer-entry-hero">
          <div className="buyer-hero-copy">
            <div className="kicker">Approved buyer room</div>
            <h1>Tell us what should reach your inbox.</h1>
            <p>
              The Exchange is a private alert system for one-use scenic builds, props and specialist event assets. Signup does not activate alerts automatically. Your record is reviewed first, then switched on only if the match is right.
            </p>
          </div>
          <div className="buyer-hero-panel">
            <span>01</span>
            <strong>Signup</strong>
            <small>Company, contact route and purchase authority.</small>
            <span>02</span>
            <strong>Preferences</strong>
            <small>Categories, tags, buying window and payment route.</small>
            <span>03</span>
            <strong>Terms</strong>
            <small>Confirm the private-buyer conditions before review.</small>
          </div>
        </section>

        <form action={buyerSignupAction} className="buyer-signup-form">
          <section className="buyer-form-grid">
            <div className="card buyer-form-card span-7">
              <div className="section-head compact">
                <div>
                  <div className="kicker">Step 01</div>
                  <h2 className="section-title">Buyer identity</h2>
                  <p>Use real business details only. Prospects are held for manual review and are not alerted until activated.</p>
                </div>
              </div>

              <div className="buyer-two">
                <label>Company / trading name<input name="company_name" required placeholder="Company / studio / operator" /></label>
                <label>Contact name<input name="contact_name" placeholder="Decision maker or buyer contact" /></label>
              </div>
              <div className="buyer-two">
                <label>Email<input name="email" type="email" required placeholder="buyer@company.co.uk" /></label>
                <label>Phone<input name="phone" placeholder="Business number" /></label>
              </div>
              <div className="buyer-two">
                <label>Website<input name="website" placeholder="https://company.co.uk" /></label>
                <label>Country<input name="country" placeholder="UK / Europe / worldwide" /></label>
              </div>
              <label>City / postcode / operating area<input name="postcode" placeholder="London, Manchester, Amsterdam, national operator..." /></label>
              <label>Primary use case<input name="use_case" placeholder="Prop hire, festival operator, immersive build, retail interiors..." /></label>
            </div>

            <aside className="card dark buyer-side-note span-5">
              <div className="kicker">Private not public</div>
              <h2>No marketplace browsing.</h2>
              <p>Approved buyers receive only the opportunities that match their categories or tags. If nothing matches, no alert is sent.</p>
              <ul className="buyer-checklist">
                <li>Private alert links only</li>
                <li>Manual activation from the Buyers room</li>
                <li>No invented contact data</li>
                <li>Terms confirmed before review</li>
              </ul>
            </aside>
          </section>

          <section className="card buyer-preferences-card">
            <div className="section-head compact">
              <div>
                <div className="kicker">Step 02</div>
                <h2 className="section-title">Alert categories and tags</h2>
                <p>Choose the categories that genuinely fit. These become your matching tags inside the buyer record.</p>
              </div>
            </div>

            <div className="buyer-category-grid">
              {BUYER_ALERT_CATEGORIES.map((category) => (
                <label className="buyer-category-card" key={category.id}>
                  <input type="checkbox" name="alert_tags" value={category.tags.join(',')} />
                  <span className="buyer-category-top"><strong>{category.shortTitle}</strong><small>{category.tags.join(' · ')}</small></span>
                  <span>{category.summary}</span>
                  <em>{category.examples.join(' / ')}</em>
                </label>
              ))}
            </div>

            <div className="buyer-two preference-row">
              <label>Extra tags or exclusions<input name="custom_tags" placeholder="e.g. THEMED-BAR, NO-FABRIC, METALWORK" /></label>
              <label>Alert frequency<select name="alert_frequency" defaultValue="instant-matches">{ALERT_FREQUENCY_OPTIONS.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>
            </div>
            <div className="buyer-two preference-row">
              <label>Buying decision window<input name="buying_window" placeholder="Same day, 48 hours, weekly review, director sign-off..." /></label>
              <label>Delivery / collection regions<input name="delivery_regions" placeholder="UK only, London, Europe, nationwide collection..." /></label>
            </div>
          </section>

          <section className="buyer-form-grid">
            <div className="card buyer-payment-card span-6">
              <div className="kicker">Step 03</div>
              <h2>Payment route preference</h2>
              <p>This records the preferred route. It does not force payment until an asset is sent and opened via a private deal link.</p>
              <div className="buyer-radio-stack">
                {PAYMENT_ROUTE_OPTIONS.map((option) => (
                  <label className="buyer-radio-card" key={option.value}>
                    <input type="radio" name="payment_route" value={option.value} defaultChecked={option.value === 'both'} />
                    <span><strong>{option.label}</strong><small>{option.copy}</small></span>
                  </label>
                ))}
              </div>
            </div>

            <div className="card buyer-terms-card span-6">
              <div className="kicker">Step 04</div>
              <h2>Terms confirmation</h2>
              <p>Terms version: <strong>{BUYER_TERMS_VERSION}</strong></p>
              <label className="buyer-confirm-row"><input type="checkbox" name="authority_confirmed" required /> I confirm I am submitting this as a business buyer or authorised representative.</label>
              <label className="buyer-confirm-row"><input type="checkbox" name="terms_confirmed" required /> I agree to the private buyer terms, including short decision windows, buyer-side suitability checks and no public forwarding of private deal links.</label>
              <label>Notes for review<textarea name="notes" placeholder="Useful buying notes, recurring needs, collection limits, asset preferences..." /></label>
              <div className="buyer-submit-row">
                <button className="button gold" type="submit">Submit buyer preferences</button>
                <Link className="button ghost" href="/buyer-terms">Read buyer terms</Link>
              </div>
            </div>
          </section>
        </form>

        <footer className="footer">The Craftist Exchange is private, non-indexed and buyer access is controlled by manual review.</footer>
      </div>
    </main>
  );
}
