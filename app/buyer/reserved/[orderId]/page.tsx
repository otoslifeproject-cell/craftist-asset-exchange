import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { formatDate, formatMoney } from '../../../../lib/format';
import type { Item, Order } from '../../../../lib/types';
import '../../buyer.css';

export default async function BuyerReservedPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const supabase = supabaseAdmin();
  const { data: orderData } = await supabase.from('orders').select('*').eq('id', orderId).single();
  if (!orderData) notFound();

  const order = orderData as Order;
  const { data: itemData } = await supabase.from('items').select('*').eq('id', order.item_id).single();
  const item = itemData as Item | null;

  return (
    <main className="buyer-page">
      <div className="shell">
        <nav className="nav buyer-nav">
          <Link className="brand" href="/">The Craftist Exchange</Link>
          <div className="navlinks"><Link href="/buyer/terms">Buyer terms</Link></div>
        </nav>

        <section className="buyer-hero">
          <div className="buyer-hero-card">
            <div className="kicker">Reserved opportunity</div>
            <h1>{item?.title || 'Reserved asset'}</h1>
            <p>Your reservation and payment details are below. When a deposit is used, the remaining amount must be completed before the reservation end time.</p>
          </div>
          <aside className="buyer-side-card">
            <strong>{order.status}</strong>
            <ul className="buyer-step-list">
              <li><span>£</span>Amount: {formatMoney(order.amount_pence, order.currency)}</li>
              <li><span>B</span>Remaining: {formatMoney(order.balance_due_pence, order.currency)}</li>
              <li><span>→</span>Reserved until: {formatDate(order.reserved_until)}</li>
            </ul>
          </aside>
        </section>

        <section className="buyer-grid">
          <div className="card buyer-panel span-7">
            <div className="kicker">Reservation</div>
            <h2>Payment status</h2>
            <div className="buyer-summary-grid">
              <div className="buyer-summary"><span>Mode</span><strong>{order.payment_mode}</strong></div>
              <div className="buyer-summary"><span>Deposit</span><strong>{formatMoney(order.deposit_amount_pence, order.currency)}</strong></div>
              <div className="buyer-summary"><span>Remaining</span><strong>{formatMoney(order.balance_due_pence, order.currency)}</strong></div>
            </div>
          </div>
          <div className="card buyer-panel span-5">
            <div className="kicker">Next step</div>
            <h2>Keep the reservation live.</h2>
            <p>The asset returns to available status if the remaining amount is not completed before the reservation end time.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
