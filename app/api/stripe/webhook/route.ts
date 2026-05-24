import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '../../../../lib/stripe';
import { requiredEnv } from '../../../../lib/env';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { notifyAdmin } from '../../../../lib/email';

export const runtime = 'nodejs';

function paymentIntentId(session: Stripe.Checkout.Session) {
  return typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || null;
}

function customerId(session: Stripe.Checkout.Session) {
  return typeof session.customer === 'string' ? session.customer : session.customer?.id || null;
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  if (!sig) return new NextResponse('Missing stripe-signature', { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, requiredEnv('STRIPE_WEBHOOK_SECRET'));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook verification failed';
    return new NextResponse(message, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const itemId = session.metadata?.item_id;
    const buyerId = session.metadata?.buyer_id;
    const recipientId = session.metadata?.recipient_id;
    const token = session.metadata?.token;
    const paymentMode = session.metadata?.payment_mode || 'full';

    if (itemId && buyerId && recipientId) {
      const supabase = supabaseAdmin();
      const paidAt = new Date().toISOString();
      const { data: order } = await supabase.from('orders').select('*').eq('stripe_session_id', session.id).single();
      const reservedUntil = order?.reserved_until || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      if (paymentMode === 'deposit') {
        await supabase.from('items').update({
          status: 'reserved',
          reserved_until: reservedUntil,
          reserved_token: token || null,
          reservation_status: 'deposit_paid',
          updated_at: paidAt
        }).eq('id', itemId);

        await supabase.from('orders').update({
          status: 'deposit_paid',
          deposit_paid_at: paidAt,
          stripe_payment_intent_id: paymentIntentId(session),
          stripe_customer_id: customerId(session),
          shipping_details: session.shipping_details || null,
          customer_details: session.customer_details || null
        }).eq('stripe_session_id', session.id);

        await supabase.from('alert_recipients').update({ status: 'checkout_started' }).eq('id', recipientId);
        await notifyAdmin('RESERVED: Craftist asset deposit paid', `<p>Deposit Stripe session ${session.id} completed.</p><p>Item: ${itemId}<br/>Buyer: ${buyerId}</p>`);
      } else {
        await supabase.from('items').update({
          status: 'sold',
          sold_at: paidAt,
          reserved_until: null,
          reserved_token: token || null,
          reservation_status: paymentMode === 'balance' ? 'paid_full' : 'paid_full',
          updated_at: paidAt
        }).eq('id', itemId);

        await supabase.from('alert_recipients').update({ status: 'paid', paid_at: paidAt }).eq('id', recipientId);

        await supabase.from('orders').update({
          status: 'paid',
          paid_at: paidAt,
          balance_paid_at: paymentMode === 'balance' ? paidAt : null,
          stripe_payment_intent_id: paymentIntentId(session),
          stripe_customer_id: customerId(session),
          shipping_details: session.shipping_details || null,
          customer_details: session.customer_details || null
        }).eq('stripe_session_id', session.id);

        await notifyAdmin('PAID: Craftist asset sold', `<p>Stripe session ${session.id} completed.</p><p>Item: ${itemId}<br/>Buyer: ${buyerId}</p>`);
      }
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;
    const itemId = session.metadata?.item_id;
    const recipientId = session.metadata?.recipient_id;
    const token = session.metadata?.token;
    const paymentMode = session.metadata?.payment_mode || 'full';
    if (itemId && recipientId) {
      const supabase = supabaseAdmin();
      const { data: item } = await supabase.from('items').select('reserved_token,status,reservation_status').eq('id', itemId).single();
      if (paymentMode !== 'balance' && item?.status === 'reserved' && item?.reserved_token === token) {
        await supabase.from('items').update({ status: 'live', reserved_token: null, reserved_until: null, reservation_status: 'expired' }).eq('id', itemId);
      }
      await supabase.from('orders').update({ status: 'expired', released_at: new Date().toISOString(), release_reason: 'Checkout session expired' }).eq('stripe_session_id', session.id);
      await supabase.from('alert_recipients').update({ status: 'opened' }).eq('id', recipientId).eq('status', 'checkout_started');
    }
  }

  return NextResponse.json({ received: true });
}
