import Link from 'next/link';
import '../buyer-signup.css';

export default function BuyerSignupCompletePage() {
  return (
    <main className="buyer-entry-page">
      <div className="shell">
        <nav className="nav buyer-entry-nav">
          <Link className="brand" href="/">The Craftist Exchange</Link>
          <div className="navlinks"><Link href="/buyer-terms">Buyer terms</Link></div>
        </nav>

        <section className="buyer-entry-hero buyer-complete-hero">
          <div className="buyer-hero-copy">
            <div className="kicker">Buyer preferences received</div>
            <h1>Your buyer record is now queued for review.</h1>
            <p>
              Nothing has been activated automatically. The Craftist team will review the company, category fit and terms confirmation before switching any private asset alerts on.
            </p>
            <div className="buyer-submit-row">
              <Link className="button gold" href="/">Back to Exchange</Link>
              <Link className="button" href="/buyer-terms">View buyer terms</Link>
            </div>
          </div>
          <div className="buyer-hero-panel">
            <span>✓</span>
            <strong>Saved as prospect</strong>
            <small>Manual activation only.</small>
            <span>→</span>
            <strong>Preference matched</strong>
            <small>Future alerts use selected tags.</small>
            <span>!</span>
            <strong>No public access</strong>
            <small>Deal links remain private.</small>
          </div>
        </section>
      </div>
    </main>
  );
}
