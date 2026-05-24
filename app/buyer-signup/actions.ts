'use server';

import { redirect } from 'next/navigation';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { parseTags } from '../../lib/format';
import { notifyAdmin } from '../../lib/email';
import { BUYER_TERMS_VERSION, ALERT_FREQUENCY_OPTIONS, PAYMENT_ROUTE_OPTIONS } from '../../lib/buyerPreferences';

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) || '').trim();
  return value || null;
}

function checked(formData: FormData, key: string) {
  return String(formData.get(key) || '') === 'on';
}

function safeChoice(formData: FormData, key: string, allowed: string[], fallback: string) {
  const value = String(formData.get(key) || fallback);
  return allowed.includes(value) ? value : fallback;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function buyerSignupAction(formData: FormData) {
  const companyName = text(formData, 'company_name');
  const email = text(formData, 'email');

  if (!companyName || !email) throw new Error('Company name and email are required.');
  if (!checked(formData, 'terms_confirmed')) throw new Error('Buyer terms must be confirmed before the prospect can be saved.');
  if (!checked(formData, 'authority_confirmed')) throw new Error('Purchase authority must be confirmed before the prospect can be saved.');

  const selectedTags = parseTags(formData.getAll('alert_tags').join(','));
  const customTags = parseTags(formData.get('custom_tags'));
  const tags = Array.from(new Set([...selectedTags, ...customTags]));
  if (!tags.length) throw new Error('At least one buyer alert category is required.');

  const alertFrequency = safeChoice(formData, 'alert_frequency', ALERT_FREQUENCY_OPTIONS.map((option) => option.value), 'instant-matches');
  const paymentRoute = safeChoice(formData, 'payment_route', PAYMENT_ROUTE_OPTIONS.map((option) => option.value), 'both');
  const buyingWindow = text(formData, 'buying_window') || 'Decision window TBC';
  const deliveryRegions = text(formData, 'delivery_regions') || 'Regions TBC';
  const useCase = text(formData, 'use_case') || 'Use case TBC';
  const notes = [
    'Buyer-side signup prospect. Do not activate automatically.',
    `Terms version confirmed: ${BUYER_TERMS_VERSION}`,
    `Alert frequency: ${alertFrequency}`,
    `Payment route preference: ${paymentRoute}`,
    `Buying window: ${buyingWindow}`,
    `Delivery / collection regions: ${deliveryRegions}`,
    `Primary use case: ${useCase}`,
    text(formData, 'notes') ? `Buyer notes: ${text(formData, 'notes')}` : null
  ].filter(Boolean).join('\n');

  const supabase = supabaseAdmin();
  const { error } = await supabase.from('buyers').upsert({
    company_name: companyName,
    contact_name: text(formData, 'contact_name'),
    email: email.toLowerCase(),
    phone: text(formData, 'phone'),
    website: text(formData, 'website'),
    country: text(formData, 'country'),
    postcode: text(formData, 'postcode'),
    buyer_type: useCase,
    tags,
    status: 'prospect',
    notes
  }, { onConflict: 'email' });

  if (error) throw new Error(error.message);

  await notifyAdmin(
    `New Craftist buyer prospect: ${companyName}`,
    `<div style="font-family:Arial,sans-serif;color:#162018"><h1>New buyer prospect</h1><p><strong>${escapeHtml(companyName)}</strong> has completed buyer signup and accepted the buyer terms.</p><p><strong>Email:</strong> ${escapeHtml(email.toLowerCase())}<br/><strong>Contact:</strong> ${escapeHtml(text(formData, 'contact_name') || 'TBC')}<br/><strong>Tags:</strong> ${escapeHtml(tags.join(', '))}</p><p>Status has been saved as <strong>prospect</strong>. Activate manually in the Buyers room only after review.</p></div>`
  );

  redirect('/buyer-signup/complete');
}
