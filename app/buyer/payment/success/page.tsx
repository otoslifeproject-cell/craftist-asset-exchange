import Link from 'next/link';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { formatDate, formatMoney } from '../../../../lib/format';
import type { Order } from '../../../../lib/types';
import '../../buyer.css';

export default async function BuyerPaymentSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const sp = await searchParams;
  const sessionId = sp.session_id || '';
  let order: Order | null = null;

  if (sessionId) {
    const { data } = await supabaseAdmin().from('orders').select('*').eq('stripe_session_id', sessionId).single();
    order = data as Order | null;
  }

  return (
    <main className="buyer-page">
      <div className="shell">
        <nav className="nav buyer-nav"><Link className="brand" href="/">The Craftist Exchange</Link><div className="navlinks"><Link href="/buyer/signup">Sign up</Link><Link href="/buyer/terms">Buyer terms</Link></div></nav>
        <section className="buyer-hero buyer-payment-result">
          <div className="buyer-hero-card">
            <div className="kicker">Payment received</div>
            <h1>{order?.payment_mode === 'deposit' ? 'Asset reserved.' : 'Asset payment complete.'}</h1>
            <p>{order?.payment_mode === 'deposit' ? 'Your deposit has reserved the asset for seven days. The balance must be paid before the reservation ends.' : 'Your payment has been received. The asset will be handled as sold once Stripe confirmation is processed.'}</p>
            <div className="buyer-actions">
              {order ? <Link className="button gold" href={`/buyer/reserved/${order.id}`}>View reservation</Link> : null}
              <Link className="button" href="/">Back to Exchange</Link>
            </div>
          </div>
          <aside className="buyer-side-card">
            <strong>Payment status</strong>
            <ul className="buyer-step-list">
              <li><span>£</span>{order ? formatMoney(order.amount_pence, order.currency) : 'Payment processing'}</li>
              <li><span>→</span>{order ? formatDate(order.reserved_until) : 'Reservation time shown when available'}</li>
              <li><span>✓</span>{order?.status || 'Stripe confirmation pending'}</li>
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
}
