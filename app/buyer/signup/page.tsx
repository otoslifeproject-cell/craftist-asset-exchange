import Link from 'next/link';
import { buyerSignupAction } from '../actions';
import { BUYER_CATEGORIES, BUYER_TAGS, PAYMENT_ROUTE_OPTIONS, URGENCY_OPTIONS } from '../../../lib/buyerPreferences';
import '../buyer.css';

export default function BuyerSignupPage() {
  return (
    <main className="buyer-page">
      <div className="shell">
        <nav className="nav buyer-nav">
          <Link className="brand" href="/">The Craftist Exchange</Link>
          <div className="navlinks">
            <Link href="/buyer/terms">Buyer terms</Link>
            <Link href="/login">Admin login</Link>
          </div>
        </nav>

        <section className="buyer-hero">
          <div className="buyer-hero-card">
            <div className="kicker">Buyer sign up</div>
            <h1>Tell us what should reach your inbox.</h1>
            <p>The Exchange is a private B2B asset room. Sign up, choose your preferences and confirm terms. Your profile stays as a prospect until manually approved.</p>
          </div>
          <aside className="buyer-side-card">
            <strong>Private, matched alerts only.</strong>
            <ul className="buyer-step-list">
              <li><span>1</span>Sign up with real business details.</li>
              <li><span>2</span>Choose categories and tags.</li>
              <li><span>3</span>Accept terms and alert consent.</li>
            </ul>
          </aside>
        </section>

        <form action={buyerSignupAction} className="stack">
          <section className="buyer-grid">
            <div className="card buyer-panel span-7">
              <div className="kicker">Profile</div>
              <h2>Buyer profile</h2>
              <div className="buyer-two">
                <label>Company name<input name="company_name" required placeholder="Company / studio / operator" /></label>
                <label>Contact name<input name="contact_name" placeholder="Buyer contact" /></label>
              </div>
              <div className="buyer-two">
                <label>Email<input name="email" type="email" required placeholder="buyer@company.co.uk" /></label>
                <label>Phone<input name="phone" placeholder="Business number" /></label>
              </div>
              <div className="buyer-two">
                <label>Website<input name="website" placeholder="https://company.co.uk" /></label>
                <label>Country<input name="country" placeholder="UK / EU / worldwide" /></label>
              </div>
              <div className="buyer-two">
                <label>City / region<input name="city_region" placeholder="London, Manchester, Amsterdam..." /></label>
                <label>Buyer type<input name="buyer_type" placeholder="Prop hire, AV, festival, immersive..." /></label>
              </div>
            </div>

            <div className="card dark buyer-panel span-5">
              <div className="kicker">Control</div>
              <h2>Prospect first.</h2>
              <p>No alerts are triggered by this form. Only active buyers with accepted terms and alert consent can receive matched private opportunities.</p>
            </div>
          </section>

          <section className="card buyer-panel">
            <div className="kicker">Preferences</div>
            <h2>Preferred categories</h2>
            <div className="buyer-card-grid">
              {BUYER_CATEGORIES.map((category) => (
                <label className="buyer-choice" key={category.id}>
                  <input type="checkbox" name="preferred_categories" value={category.id} />
                  <strong>{category.label}</strong>
                  <small>{category.tagHints.join(' · ')}</small>
                </label>
              ))}
            </div>
          </section>

          <section className="card buyer-panel">
            <div className="kicker">Tags</div>
            <h2>Preferred tags</h2>
            <div className="buyer-tag-grid">
              {BUYER_TAGS.map((tag) => (
                <label className="buyer-tag" key={tag.id}>
                  <input type="checkbox" name="preferred_tags" value={tag.id} /> {tag.label}
                </label>
              ))}
            </div>
          </section>

          <section className="buyer-grid">
            <div className="card buyer-panel span-6">
              <div className="kicker">Buying fit</div>
              <h2>Deal preferences</h2>
              <div className="buyer-two">
                <label>Deal size / budget range<input name="budget_range" placeholder="£500–£5,000, £5,000+..." /></label>
                <label>Shipping region<input name="shipping_region" placeholder="UK, EU, collection only..." /></label>
              </div>
              <label>Urgency preference<select name="urgency_preference" defaultValue="instant">{URGENCY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            </div>

            <div className="card buyer-panel span-6">
              <div className="kicker">Payment</div>
              <h2>Payment route preference</h2>
              <div className="buyer-radio-stack">
                {PAYMENT_ROUTE_OPTIONS.map((option) => (
                  <label className="buyer-radio" key={option.value}>
                    <input type="radio" name="payment_route" value={option.value} defaultChecked={option.value === 'both'} />
                    <span><strong>{option.label}</strong><small>{option.copy}</small></span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section className="card buyer-panel">
            <div className="kicker">Terms</div>
            <h2>Confirm access</h2>
            <label>Notes<textarea name="notes" placeholder="Collection limits, recurring needs, buying notes..." /></label>
            <label className="buyer-check"><input type="checkbox" name="terms_confirmed" required /> I accept the private buyer terms.</label>
            <label className="buyer-check"><input type="checkbox" name="alert_consent" required /> I consent to matched private asset alerts based on my saved preferences.</label>
            <div className="buyer-actions">
              <button className="button gold" type="submit">Sign up</button>
              <Link className="button ghost" href="/buyer/terms">Read buyer terms</Link>
            </div>
          </section>
        </form>

        <footer className="footer">Private buyer room. Prospects are reviewed before activation.</footer>
      </div>
    </main>
  );
}
