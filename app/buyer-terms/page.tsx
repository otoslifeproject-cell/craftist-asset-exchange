import Link from 'next/link';
import { BUYER_TERMS_VERSION } from '../../lib/buyerPreferences';
import '../buyer-signup/buyer-signup.css';

export default function BuyerTermsPage() {
  return (
    <main className="buyer-entry-page">
      <div className="shell">
        <nav className="nav buyer-entry-nav">
          <Link className="brand" href="/">The Craftist Exchange</Link>
          <div className="navlinks">
            <Link href="/buyer-signup">Buyer signup</Link>
            <Link href="/login">Admin login</Link>
          </div>
        </nav>

        <section className="buyer-entry-hero terms-hero">
          <div className="buyer-hero-copy">
            <div className="kicker">Buyer terms shell</div>
            <h1>Private buyer terms.</h1>
            <p>
              Draft operating terms for approved buyers receiving private one-use asset alerts. This page is ready for legal review and can be replaced with formal solicitor-approved terms later.
            </p>
          </div>
          <div className="buyer-hero-panel terms-version-panel">
            <span>v</span>
            <strong>{BUYER_TERMS_VERSION}</strong>
            <small>Captured on buyer signup forms.</small>
          </div>
        </section>

        <section className="grid terms-grid">
          <div className="card span-6 terms-card">
            <div className="kicker">1. Private access</div>
            <h2>Private links are not marketplace listings.</h2>
            <p>Asset pages are intended for the named company or authorised buyer contact only. Links must not be published, shared publicly or treated as a general public sale page.</p>
          </div>
          <div className="card span-6 terms-card">
            <div className="kicker">2. Buyer responsibility</div>
            <h2>Suitability checks sit with the buyer.</h2>
            <p>Unless agreed in writing, the buyer is responsible for assessing safe reuse, installation, lifting, access, insurance, venue approval, electrical status, fire status and any further compliance requirement.</p>
          </div>
          <div className="card span-6 terms-card">
            <div className="kicker">3. Decision windows</div>
            <h2>Assets may have short deadlines.</h2>
            <p>Many assets are available because they would otherwise be broken down, stored at cost or disposed of. Decision windows may be short and availability can change quickly.</p>
          </div>
          <div className="card span-6 terms-card">
            <div className="kicker">4. Payment route</div>
            <h2>Full payment or holding route.</h2>
            <p>The current live checkout route uses Stripe full payment. A seven-day deposit/hold route can be enabled as a separate payment mode once operationally and legally approved. Any non-refundable deposit language must be formally reviewed before launch.</p>
          </div>
          <div className="card span-6 terms-card">
            <div className="kicker">5. Description limits</div>
            <h2>Asset sheets are practical summaries.</h2>
            <p>Descriptions, dimensions, images and files are provided in good faith as working asset information. Buyers must ask before purchase if a detail is material to their decision.</p>
          </div>
          <div className="card span-6 terms-card">
            <div className="kicker">6. No automatic activation</div>
            <h2>Signup creates a prospect record.</h2>
            <p>Submitting buyer preferences does not guarantee access, supply, exclusivity or future alerts. The Craftist team may approve, pause, decline or update buyer records manually.</p>
          </div>
          <div className="card dark span-12 terms-card">
            <div className="kicker">Legal review required</div>
            <h2>This is an operating shell, not final legal advice.</h2>
            <p>Before taking deposits, using non-refundable language or running high-value transactions at scale, this page should be reviewed and converted into formal buyer terms by a qualified UK commercial solicitor.</p>
            <div className="buyer-submit-row">
              <Link className="button gold" href="/buyer-signup">Continue to buyer signup</Link>
              <Link className="button" href="/">Back to Exchange</Link>
            </div>
          </div>
        </section>

        <footer className="footer">The Craftist Exchange uses UK English and private B2B access controls.</footer>
      </div>
    </main>
  );
}
