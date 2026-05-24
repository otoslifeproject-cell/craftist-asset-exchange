import { Resend } from 'resend';
import type { Buyer, Item } from './types';
import { formatDate, formatMoney } from './format';
import { getAppUrl } from './env';
import { formatPreferenceLabel, getReservationDepositPence, getTotalPricePence } from './buyerPreferences';

let resend: Resend | null = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  if (resend) return resend;
  resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export async function sendDealEmail({ buyer, item, token, matchReason }: { buyer: Buyer; item: Item; token: string; matchReason?: string }) {
  const client = getResend();
  if (!client) return { ok: false, reason: 'RESEND_API_KEY missing' };

  const opportunityUrl = `${getAppUrl()}/buyer/opportunity/${token}`;
  const manageUrl = buyer.buyer_portal_token ? `${getAppUrl()}/buyer/dashboard?profile=${buyer.buyer_portal_token}` : `${getAppUrl()}/buyer/signup`;
  const total = getTotalPricePence(item);
  const deposit = getReservationDepositPence(item);
  const price = formatMoney(total, item.currency);
  const depositPrice = formatMoney(deposit, item.currency);
  const subject = `Private opportunity: ${item.title} — ${price}`;
  const from = process.env.RESEND_FROM || 'The Craftist Exchange <onboarding@resend.dev>';
  const contact = buyer.contact_name || buyer.company_name;
  const itemTags = (item.tags || []).map(formatPreferenceLabel).join(', ') || 'Matching asset';
  const category = formatPreferenceLabel(item.category || '');
  const reason = matchReason || 'This asset matches your saved buyer preferences.';

  const html = `
  <div style="font-family:Arial,sans-serif;background:#0f1712;color:#fff7ea;padding:28px">
    <div style="max-width:700px;margin:0 auto;background:#f6f0e5;color:#162018;border-radius:28px;padding:28px;border:1px solid rgba(0,0,0,.06)">
      <p style="text-transform:uppercase;letter-spacing:.16em;color:#8a6b2f;font-size:12px;font-weight:bold;margin:0 0 10px">Private opportunity</p>
      <h1 style="font-size:34px;line-height:1;margin:8px 0 14px">${escapeHtml(item.title)}</h1>
      <p>Hi ${escapeHtml(contact)},</p>
      <p>A one-use scenic/event asset has become available before disposal. You are receiving this because your buyer profile is active and this opportunity matches your saved preferences.</p>
      <div style="background:#fffaf0;border-radius:20px;padding:18px;margin:18px 0;border:1px solid rgba(22,32,24,.08)">
        <p style="margin:0 0 8px"><strong>Price:</strong> ${price}</p>
        <p style="margin:0 0 8px"><strong>Reserve deposit:</strong> ${depositPrice}</p>
        <p style="margin:0 0 8px"><strong>Category:</strong> ${escapeHtml(category)}</p>
        <p style="margin:0 0 8px"><strong>Tags:</strong> ${escapeHtml(itemTags)}</p>
        <p style="margin:0 0 8px"><strong>Decision deadline:</strong> ${formatDate(item.decision_deadline)}</p>
        <p style="margin:0"><strong>Location / dispatch:</strong> ${escapeHtml(item.location_notes || item.dispatch_postcode || 'Shown on the opportunity page')}</p>
      </div>
      <p><strong>Why you received this:</strong> ${escapeHtml(reason)}</p>
      <p>${escapeHtml((item.description || '').slice(0, 420))}</p>
      <p style="margin:28px 0">
        <a href="${opportunityUrl}" style="background:#174a32;color:#fff7ea;padding:14px 18px;border-radius:999px;text-decoration:none;font-weight:bold;display:inline-block;margin:0 8px 8px 0">Reserve or buy now</a>
        <a href="${manageUrl}" style="background:#c8a45d;color:#19160f;padding:14px 18px;border-radius:999px;text-decoration:none;font-weight:bold;display:inline-block;margin:0 0 8px 0">Manage alerts</a>
      </p>
      <p style="font-size:13px;color:#607066;line-height:1.5">This is a private buyer link for ${escapeHtml(buyer.company_name)}. Please do not publish it or forward it outside your authorised buying route.</p>
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
