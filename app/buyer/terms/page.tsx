import Link from 'next/link';
import { BUYER_TERMS_VERSION } from '../../../lib/buyerPreferences';
import '../buyer.css';

export default function BuyerTermsPage() {
  return (
    <main className="buyer-page">
      <div className="shell">
        <nav className="nav buyer-nav">
          <Link className="brand" href="/">The Craftist Exchange</Link>
          <div className="navlinks"><Link href="/buyer/signup">Sign up</Link><Link href="/login">Admin login</Link></div>
        </nav>

        <section className="buyer-hero">
          <div className="buyer-hero-card">
            <div className="kicker">Buyer terms</div>
            <h1>Private buyer access.</h1>
            <p>These terms control how private opportunities, reserve deposits, full payment and alert consent work. They are written as an operating shell ready for legal review before high-value launch.</p>
          </div>
          <aside className="buyer-side-card">
            <strong>{BUYER_TERMS_VERSION}</strong>
            <p>This version is stored against buyer profiles when terms are accepted.</p>
          </aside>
        </section>

        <section className="card buyer-panel">
          <div className="buyer-terms-list">
            <article><h3>Private opportunities</h3><p>Opportunity pages are intended for the named buyer company only and must not be published or shared publicly.</p></article>
            <article><h3>Alert consent</h3><p>Buyers only receive matched alerts after accepting terms, giving alert consent and being approved as active.</p></article>
            <article><h3>Buyer checks</h3><p>The buyer is responsible for suitability, access, loading, installation, insurance, fire, electrical and venue checks unless confirmed otherwise in writing.</p></article>
            <article><h3>Reserve with deposit</h3><p>A deposit can reserve an asset for seven days. The deposit is credited against the final balance. Refund wording must be reviewed legally before public reliance.</p></article>
            <article><h3>Buy now in full</h3><p>Full payment locks the asset as sold after Stripe payment confirmation. Other buyers should then see an unavailable state.</p></article>
            <article><h3>Expired reservations</h3><p>If the balance is not completed before the reservation ends, the asset may return to sale.</p></article>
          </div>
          <div className="buyer-actions"><Link className="button gold" href="/buyer/signup">Sign up</Link><Link className="button" href="/">Back to Exchange</Link></div>
        </section>
      </div>
    </main>
  );
}
