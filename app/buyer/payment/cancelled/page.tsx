import Link from 'next/link';
import '../../buyer.css';

export default async function BuyerPaymentCancelledPage({ searchParams }: { searchParams: Promise<{ token?: string; reason?: string }> }) {
  const sp = await searchParams;
  const token = sp.token || '';
  return (
    <main className="buyer-page">
      <div className="shell">
        <nav className="nav buyer-nav"><Link className="brand" href="/">The Craftist Exchange</Link><div className="navlinks"><Link href="/buyer/terms">Buyer terms</Link></div></nav>
        <section className="buyer-hero buyer-payment-result">
          <div className="buyer-hero-card">
            <div className="kicker">Payment cancelled</div>
            <h1>No payment was taken.</h1>
            <p>The private opportunity may still be available if another buyer has not reserved or bought it.</p>
            <div className="buyer-actions">
              {token ? <Link className="button gold" href={`/buyer/opportunity/${token}`}>Return to opportunity</Link> : null}
              <Link className="button" href="/">Back to Exchange</Link>
            </div>
          </div>
          <aside className="buyer-side-card"><strong>What happens next?</strong><ul className="buyer-step-list"><li><span>1</span>Nothing has been charged.</li><li><span>2</span>The asset remains subject to availability.</li><li><span>3</span>You can reserve or buy while the opportunity is open.</li></ul></aside>
        </section>
      </div>
    </main>
  );
}
