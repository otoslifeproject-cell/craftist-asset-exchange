import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <div className="shell">
        <nav className="nav">
          <div className="brand">The Craftist Exchange</div>
          <div className="navlinks">
            <Link href="/buyer-signup">Buyer signup</Link>
            <Link href="/buyer-terms">Buyer terms</Link>
            <Link href="/login">Admin login</Link>
          </div>
        </nav>

        <section className="hero">
          <div className="kicker">Private B2B asset room</div>
          <h1>One-use scenic builds, saved before destruction.</h1>
          <p style={{ maxWidth: 760 }}>
            A controlled, invite-only trading room for high-value stage builds, props, bars, lighting, screens and event assets with short decision windows and direct dispatch.
          </p>
          <div className="workflow-actions hero-actions">
            <Link className="button gold" href="/buyer-signup">Register buyer preferences</Link>
            <Link className="button" href="/buyer-terms">Read buyer terms</Link>
          </div>
        </section>

        <section className="grid">
          <div className="card span-4">
            <h3>For approved buyers</h3>
            <p>Access is controlled. Buyer signup creates a prospect record only; private alerts begin only after manual activation in the Buyers room.</p>
          </div>
          <div className="card span-4">
            <h3>For fast resale</h3>
            <p>Assets are tagged once by category and matched to active buyers with the right preferences, avoiding public marketplace noise.</p>
          </div>
          <div className="card span-4">
            <h3>For zero storage</h3>
            <p>Buyers can receive short-window opportunities and supply delivery details so assets can move straight from return location to reuse.</p>
          </div>
        </section>

        <section className="grid" style={{ marginTop: 18 }}>
          <div className="card dark span-7">
            <div className="kicker">Buyer side now live</div>
            <h2>Preference-led private alerts.</h2>
            <p>
              The buyer route captures company identity, category fit, alert preferences, payment-route preference and acceptance of the private buyer terms. No buyer is invented and no prospect is switched active automatically.
            </p>
          </div>
          <div className="card span-5">
            <div className="kicker" style={{ color: '#174a32' }}>Controlled access</div>
            <h2>Prospect first. Activate later.</h2>
            <p>Every buyer submission lands as a prospect for review inside the existing Buyers room.</p>
            <Link className="button green" href="/buyer-signup">Open buyer signup</Link>
          </div>
        </section>

        <footer className="footer">Private catalogue. No public browsing. No mass marketplace feel.</footer>
      </div>
    </main>
  );
}
