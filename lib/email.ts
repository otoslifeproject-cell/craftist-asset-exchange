import { Resend } from 'resend';
import type { Buyer, Item } from './types';
import { formatDate, formatMoney } from './format';
import { getAppUrl } from './env';

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
  const subject = `Available now: ${item.title} — ${price} — private access`;
  const from = process.env.RESEND_FROM || 'The Craftist Exchange <onboarding@resend.dev>';
  const contact = buyer.contact_name || buyer.company_name;

  const html = `
  <div style="font-family:Arial,sans-serif;background:#0f1712;color:#fff7ea;padding:28px">
    <div style="max-width:660px;margin:0 auto;background:#f6f0e5;color:#162018;border-radius:24px;padding:26px">
      <p style="text-transform:uppercase;letter-spacing:.16em;color:#8a6b2f;font-size:12px;font-weight:bold">Private asset alert</p>
      <h1 style="font-size:34px;line-height:1;margin:8px 0 14px">${escapeHtml(item.title)}</h1>
      <p>Hi ${escapeHtml(contact)},</p>
      <p>A one-use scenic/event asset has become available before disposal. You are receiving this because it matches your approved buyer categories.</p>
      <p><strong>Price:</strong> ${price}<br/>
      <strong>Dimensions:</strong> ${escapeHtml(item.dimensions || 'See asset sheet')}<br/>
      <strong>Dispatch postcode:</strong> ${escapeHtml(item.dispatch_postcode || 'TBC')}<br/>
      <strong>Decision deadline:</strong> ${formatDate(item.decision_deadline)}</p>
      <p>${escapeHtml((item.description || '').slice(0, 450))}</p>
      <p style="margin:28px 0"><a href="${url}" style="background:#174a32;color:#fff7ea;padding:14px 18px;border-radius:999px;text-decoration:none;font-weight:bold">View private asset + buy</a></p>
      <p style="font-size:13px;color:#607066">This is a private token link. Do not forward unless you are assigning purchase authority inside your company.</p>
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
