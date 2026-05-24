import { Resend } from 'resend';
import type { Buyer, Item } from './types';
import { formatDate, formatMoney } from './format';
import { getAppUrl } from './env';
import { formatPreferenceLabel } from './buyerPreferences';

let resend: Resend | null = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  if (resend) return resend;
  resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export async function sendDealEmail({ buyer, item, token }: { buyer: Buyer; item: Item; token: string }) {
  const client = getResend();
  if (!client) return { ok: false, reason: 'RESEND_API_KEY missing' };

  const url = `${getAppUrl()}/deal/${token}`;
  const price = formatMoney((item.guide_price_pence || 0) + (item.transport_price_pence || 0), item.currency);
  const subject = `Private Craftist asset alert: ${item.title} — ${price}`;
  const from = process.env.RESEND_FROM || 'The Craftist Exchange <onboarding@resend.dev>';
  const contact = buyer.contact_name || buyer.company_name;
  const buyerTags = (buyer.tags || []).map(formatPreferenceLabel).join(', ') || 'approved buyer preferences';
  const itemTags = (item.tags || []).map(formatPreferenceLabel).join(', ') || 'asset fit';

  const html = `
  <div style="font-family:Arial,sans-serif;background:#0f1712;color:#fff7ea;padding:28px">
    <div style="max-width:680px;margin:0 auto;background:#f6f0e5;color:#162018;border-radius:28px;padding:28px;border:1px solid rgba(0,0,0,.06)">
      <p style="text-transform:uppercase;letter-spacing:.16em;color:#8a6b2f;font-size:12px;font-weight:bold;margin:0 0 10px">Private asset alert</p>
      <h1 style="font-size:34px;line-height:1;margin:8px 0 14px">${escapeHtml(item.title)}</h1>
      <p>Hi ${escapeHtml(contact)},</p>
      <p>A one-use scenic/event asset has become available before disposal. You are receiving this because your buyer record is active and the asset matches your approved preferences.</p>
      <div style="background:#fffaf0;border-radius:20px;padding:18px;margin:18px 0;border:1px solid rgba(22,32,24,.08)">
        <p style="margin:0 0 8px"><strong>Price:</strong> ${price}</p>
        <p style="margin:0 0 8px"><strong>Dimensions:</strong> ${escapeHtml(item.dimensions || 'See asset sheet')}</p>
        <p style="margin:0 0 8px"><strong>Dispatch postcode:</strong> ${escapeHtml(item.dispatch_postcode || 'TBC')}</p>
        <p style="margin:0"><strong>Decision deadline:</strong> ${formatDate(item.decision_deadline)}</p>
      </div>
      <p><strong>Buyer preferences:</strong> ${escapeHtml(buyerTags)}<br/><strong>Asset tags:</strong> ${escapeHtml(itemTags)}</p>
      <p>${escapeHtml((item.description || '').slice(0, 450))}</p>
      <p style="margin:28px 0"><a href="${url}" style="background:#174a32;color:#fff7ea;padding:14px 18px;border-radius:999px;text-decoration:none;font-weight:bold">View private asset</a></p>
      <p style="font-size:13px;color:#607066;line-height:1.5">This is a private token link for ${escapeHtml(buyer.company_name)}. Do not publish it or forward it outside your authorised buying route. Full payment currently locks the asset through Stripe. Any holding-deposit route must be shown clearly on the asset page before use.</p>
    </div>
  </div>`;

  const { error } = await client.emails.send({
    from,
    to: [buyer.email],
    subject,
    html,
    tags: [
      { name: 'system', value: 'craftist_exchange' },
      { name: 'item_id', value: item.id.replace(/-/g, '').slice(0, 32) }
    ]
  });

  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

export async function notifyAdmin(subject: string, html: string) {
  const client = getResend();
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  if (!client || !to) return;
  await client.emails.send({
    from: process.env.RESEND_FROM || 'The Craftist Exchange <onboarding@resend.dev>',
    to: [to],
    subject,
    html
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
