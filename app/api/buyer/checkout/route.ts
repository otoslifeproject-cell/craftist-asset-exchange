import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { getStripe } from '../../../../lib/stripe';
import { getAppUrl } from '../../../../lib/env';
import type { AlertRecipient, Buyer, Item, PaymentMode } from '../../../../lib/types';
import { getBalanceDuePence, getReservationDepositPence, getTotalPricePence, sevenDaysFromNowIso, thirtyMinutesFromNowIso } from '../../../../lib/buyerPreferences';

function safeMode(value: FormDataEntryValue | null): PaymentMode {
  const mode = String(value || 'full');
  return mode === 'deposit' || mode === 'balance' ? mode : 'full';
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const token = String(formData.get('token') || '');
  const deliveryPostcode = String(formData.get('delivery_postcode') || '').trim().toUpperCase();
  const paymentMode = safeMode(formData.get('payment_mode'));
  if (!token || !deliveryPostcode) return NextResponse.redirect(`${getAppUrl()}/buyer/payment/cancelled?reason=missing`);

  const supabase = supabaseAdmin();
  const { data: recipient } = await supabase.from('alert_recipients').select('*').eq('token', token).single();
  if (!recipient) return NextResponse.redirect(`${getAppUrl()}/buyer/payment/cancelled?reason=missing`);
  const rec = recipient as AlertRecipient;

  const [{ data: item }, { data: buyer }] = await Promise.all([
    supabase.from('items').select('*').eq('id', rec.item_id).single(),
    supabase.from('buyers').select('*').eq('id', rec.buyer_id).single()
  ]);

  if (!item || !buyer) return NextResponse.redirect(`${getAppUrl()}/buyer/payment/cancelled?reason=missing`);
  const asset = item as Item;
  const approvedBuyer = buyer as Buyer;

  if (approvedBuyer.status !== 'active' || !approvedBuyer.terms_accepted_at || !approvedBuyer.alert_consent_at) {
    return NextResponse.redirect(`${getAppUrl()}/buyer/opportunity/${token}?unavailable=1`);
  }

  const now = new Date();
  const reservationExpired = asset.status === 'reserved' && asset.reserved_until && new Date(asset.reserved_until) < now;
  const canCheckout = asset.status === 'live' || (asset.status === 'reserved' && asset.reserved_token === token) || reservationExpired;
  if (!canCheckout || asset.status === 'sold') return NextResponse.redirect(`${getAppUrl()}/buyer/opportunity/${token}?unavailable=1`);

  const total = getTotalPricePence(asset);
  const deposit = getReservationDepositPence(asset);
  const balance = getBalanceDuePence(asset);
  const amount = paymentMode === 'deposit' ? deposit : paymentMode === 'balance' ? balance : total;
  const reservedUntil = paymentMode === 'deposit' ? sevenDaysFromNowIso() : paymentMode === 'full' ? thirtyMinutesFromNowIso() : asset.reserved_until;
  const modeLabel = paymentMode === 'deposit' ? 'Reservation deposit' : paymentMode === 'balance' ? 'Balance payment' : 'Full payment';

  await supabase.from('items').update({
    status: paymentMode === 'full' ? 'reserved' : 'reserved',
    reserved_token: token,
    reserved_until: reservedUntil,
    reservation_status: paymentMode === 'deposit' ? 'deposit_pending' : paymentMode === 'balance' ? 'balance_pending' : 'none',
    updated_at: new Date().toISOString()
  }).eq('id', asset.id);

  await supabase.from('alert_recipients').update({ status: 'checkout_started', checkout_started_at: new Date().toISOString() }).eq('id', rec.id);

  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    customer_email: approvedBuyer.email,
    line_items: [{
      price_data: {
        currency: asset.currency || 'gbp',
        unit_amount: amount,
        product_data: {
          name: `${modeLabel}: ${asset.title}`,
          description: asset.dimensions || undefined,
          images: (asset.image_urls || []).slice(0, 8)
        }
      },
      quantity: 1
    }],
    billing_address_collection: 'required',
    phone_number_collection: { enabled: true },
    shipping_address_collection: { allowed_countries: ['GB'] },
    success_url: `${getAppUrl()}/buyer/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${getAppUrl()}/buyer/payment/cancelled?token=${token}`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    metadata: {
      item_id: asset.id,
      buyer_id: approvedBuyer.id,
      recipient_id: rec.id,
      token,
      payment_mode: paymentMode,
      delivery_postcode: deliveryPostcode
    }
  });

  const { data: order, error: orderError } = await supabase.from('orders').upsert({
    item_id: asset.id,
    buyer_id: approvedBuyer.id,
    alert_recipient_id: rec.id,
    stripe_session_id: session.id,
    status: paymentMode === 'deposit' ? 'deposit_pending' : paymentMode === 'balance' ? 'balance_pending' : 'checkout_started',
    payment_mode: paymentMode,
    amount_pence: amount,
    deposit_amount_pence: deposit,
    balance_due_pence: balance,
    currency: asset.currency || 'gbp',
    delivery_postcode_requested: deliveryPostcode,
    checkout_url: session.url,
    reserved_until: reservedUntil
  }, { onConflict: 'stripe_session_id' }).select('*').single();

  if (orderError || !order) return NextResponse.redirect(`${getAppUrl()}/buyer/payment/cancelled?reason=order`);
  return NextResponse.redirect(session.url || `${getAppUrl()}/buyer/payment/cancelled?reason=stripe`);
}
