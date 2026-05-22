import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { getStripe } from '../../../lib/stripe';
import { getAppUrl } from '../../../lib/env';
import type { AlertRecipient, Buyer, Item } from '../../../lib/types';

export async function POST(req: Request) {
  const formData = await req.formData();
  const token = String(formData.get('token') || '');
  const deliveryPostcode = String(formData.get('delivery_postcode') || '').trim().toUpperCase();
  if (!token || !deliveryPostcode) return NextResponse.redirect(`${getAppUrl()}/`);

  const supabase = supabaseAdmin();
  const { data: recipient } = await supabase.from('alert_recipients').select('*').eq('token', token).single();
  if (!recipient) return NextResponse.redirect(`${getAppUrl()}/deal/${token}?error=missing`);
  const rec = recipient as AlertRecipient;

  const [{ data: item }, { data: buyer }] = await Promise.all([
    supabase.from('items').select('*').eq('id', rec.item_id).single(),
    supabase.from('buyers').select('*').eq('id', rec.buyer_id).single()
  ]);

  if (!item || !buyer) return NextResponse.redirect(`${getAppUrl()}/deal/${token}?error=missing`);
  const asset = item as Item;
  const approvedBuyer = buyer as Buyer;

  const now = new Date();
  const reservationExpired = asset.status === 'reserved' && asset.reserved_until && new Date(asset.reserved_until) < now;
  const canCheckout = asset.status === 'live' || (asset.status === 'reserved' && asset.reserved_token === token) || reservationExpired;
  if (!canCheckout || asset.status === 'sold') return NextResponse.redirect(`${getAppUrl()}/deal/${token}?error=unavailable`);

  const reservedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  await supabase.from('items').update({ status: 'reserved', reserved_token: token, reserved_until: reservedUntil }).eq('id', asset.id);
  await supabase.from('alert_recipients').update({ status: 'checkout_started', checkout_started_at: new Date().toISOString() }).eq('id', rec.id);

  const lineItems: any[] = [
    {
      price_data: {
        currency: asset.currency || 'gbp',
        unit_amount: asset.guide_price_pence,
        product_data: {
          name: asset.title,
          description: asset.dimensions || undefined,
          images: (asset.image_urls || []).slice(0, 8)
        }
      },
      quantity: 1
    }
  ];

  if ((asset.transport_price_pence || 0) > 0) {
    lineItems.push({
      price_data: {
        currency: asset.currency || 'gbp',
        unit_amount: asset.transport_price_pence,
        product_data: { name: 'Direct dispatch / transport allocation' }
      },
      quantity: 1
    });
  }

  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    customer_email: approvedBuyer.email,
    line_items: lineItems,
    billing_address_collection: 'required',
    phone_number_collection: { enabled: true },
    shipping_address_collection: { allowed_countries: ['GB'] },
    success_url: `${getAppUrl()}/deal/${token}?paid=1`,
    cancel_url: `${getAppUrl()}/deal/${token}?cancelled=1`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    metadata: {
      item_id: asset.id,
      buyer_id: approvedBuyer.id,
      recipient_id: rec.id,
      token,
      delivery_postcode: deliveryPostcode
    }
  });

  await supabase.from('orders').upsert({
    item_id: asset.id,
    buyer_id: approvedBuyer.id,
    alert_recipient_id: rec.id,
    stripe_session_id: session.id,
    status: 'checkout_started',
    amount_pence: (asset.guide_price_pence || 0) + (asset.transport_price_pence || 0),
    currency: asset.currency || 'gbp',
    delivery_postcode_requested: deliveryPostcode,
    checkout_url: session.url
  }, { onConflict: 'stripe_session_id' });

  return NextResponse.redirect(session.url || `${getAppUrl()}/deal/${token}?error=stripe`);
}
