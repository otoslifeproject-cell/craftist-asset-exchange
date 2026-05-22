import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <div className="shell">
        <nav className="nav">
          <div className="brand">The Craftist Exchange</div>
          <div className="navlinks">
            <Link href="/login">Admin login</Link>
          </div>
        </nav>
        <section className="hero">
          <div className="kicker">Private B2B asset room</div>
          <h1>One-use scenic builds, saved before destruction.</h1>
          <p style={{ maxWidth: 760 }}>
            A controlled, invite-only trading room for high-value stage builds, props, bars, lighting, screens and event assets with short decision windows and direct dispatch.
          </p>
        </section>
        <section className="grid">
          <div className="card span-4">
            <h3>For approved buyers</h3>
            <p>Access is by direct alert link only. Each opportunity has a fixed decision window, dimensions, files, terms and a direct Stripe checkout route.</p>
          </div>
          <div className="card span-4">
            <h3>For fast resale</h3>
            <p>Upload the asset once, tag the buyer category, press publish, and the system sends private alerts to the correct buyer group.</p>
          </div>
          <div className="card span-4">
            <h3>For zero storage</h3>
            <p>Buyers pay and submit delivery details. The asset can then go straight from return location/manufacturer to buyer postcode.</p>
          </div>
        </section>
        <footer className="footer">Private catalogue. No public browsing. No mass marketplace feel.</footer>
      </div>
    </main>
  );
}
