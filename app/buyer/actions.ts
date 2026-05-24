'use server';

import crypto from 'crypto';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { notifyAdmin } from '../../lib/email';
import { BUYER_CATEGORY_IDS, BUYER_TAG_IDS, BUYER_TERMS_VERSION, PAYMENT_ROUTE_OPTIONS, URGENCY_OPTIONS, pickAllowed } from '../../lib/buyerPreferences';

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
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function buildNotes(formData: FormData, urgency: string, paymentRoute: string) {
  return [
    'Buyer signup received. Keep as prospect until manually reviewed.',
    `Deal size / budget range: ${text(formData, 'budget_range') || 'Not specified'}`,
    `Shipping region: ${text(formData, 'shipping_region') || 'Not specified'}`,
    `Urgency preference: ${urgency}`,
    `Payment route preference: ${paymentRoute}`,
    text(formData, 'notes') ? `Buyer notes: ${text(formData, 'notes')}` : null
  ].filter(Boolean).join('\n');
}

export async function buyerSignupAction(formData: FormData) {
  const companyName = text(formData, 'company_name');
  const email = text(formData, 'email');
  if (!companyName || !email) throw new Error('Company name and email are required.');
  if (!checked(formData, 'terms_confirmed')) throw new Error('Buyer terms must be accepted.');
  if (!checked(formData, 'alert_consent')) throw new Error('Alert consent is required before matching alerts can be enabled.');

  const preferredCategories = pickAllowed(formData.getAll('preferred_categories'), BUYER_CATEGORY_IDS);
  const preferredTags = pickAllowed(formData.getAll('preferred_tags'), BUYER_TAG_IDS);
  if (!preferredCategories.length && !preferredTags.length) throw new Error('Choose at least one category or tag.');

  const now = new Date().toISOString();
  const urgency = safeChoice(formData, 'urgency_preference', URGENCY_OPTIONS.map((option) => option.value), 'instant');
  const paymentRoute = safeChoice(formData, 'payment_route', PAYMENT_ROUTE_OPTIONS.map((option) => option.value), 'both');
  const portalToken = crypto.randomBytes(24).toString('hex');
  const notes = buildNotes(formData, urgency, paymentRoute);

  const { error } = await supabaseAdmin().from('buyers').upsert({
    company_name: companyName,
    contact_name: text(formData, 'contact_name'),
    email: email.toLowerCase(),
    phone: text(formData, 'phone'),
    website: text(formData, 'website'),
    country: text(formData, 'country'),
    postcode: text(formData, 'city_region'),
    buyer_type: text(formData, 'buyer_type'),
    preferred_categories: preferredCategories,
    preferred_tags: preferredTags,
    tags: preferredTags,
    status: 'prospect',
    alert_consent_at: now,
    terms_accepted_at: now,
    terms_version: BUYER_TERMS_VERSION,
    buyer_portal_token: portalToken,
    notes
  }, { onConflict: 'email' });

  if (error) throw new Error(error.message);

  await notifyAdmin(
    `New Craftist buyer profile: ${companyName}`,
    `<div style="font-family:Arial,sans-serif;color:#162018"><h1>New buyer profile</h1><p><strong>${escapeHtml(companyName)}</strong> has signed up and accepted buyer terms.</p><p><strong>Email:</strong> ${escapeHtml(email.toLowerCase())}<br/><strong>Categories:</strong> ${escapeHtml(preferredCategories.join(', ') || 'None')}<br/><strong>Tags:</strong> ${escapeHtml(preferredTags.join(', ') || 'None')}</p><p>Status is <strong>prospect</strong>. Activate manually in the Buyers room when approved.</p></div>`
  );

  redirect(`/buyer/dashboard?profile=${portalToken}&signed=1`);
}

export async function updateBuyerPreferencesAction(formData: FormData) {
  const portalToken = text(formData, 'portal_token');
  if (!portalToken) throw new Error('Missing buyer profile link.');

  const preferredCategories = pickAllowed(formData.getAll('preferred_categories'), BUYER_CATEGORY_IDS);
  const preferredTags = pickAllowed(formData.getAll('preferred_tags'), BUYER_TAG_IDS);
  if (!preferredCategories.length && !preferredTags.length) throw new Error('Choose at least one category or tag.');

  const { error } = await supabaseAdmin().from('buyers').update({
    preferred_categories: preferredCategories,
    preferred_tags: preferredTags,
    tags: preferredTags,
    updated_at: new Date().toISOString()
  }).eq('buyer_portal_token', portalToken);

  if (error) throw new Error(error.message);
  revalidatePath('/buyer/dashboard');
  redirect(`/buyer/dashboard?profile=${portalToken}&updated=1`);
}

export async function pauseBuyerAlertsAction(formData: FormData) {
  const portalToken = text(formData, 'portal_token');
  if (!portalToken) throw new Error('Missing buyer profile link.');
  const { error } = await supabaseAdmin().from('buyers').update({ status: 'paused', updated_at: new Date().toISOString() }).eq('buyer_portal_token', portalToken).neq('status', 'blocked');
  if (error) throw new Error(error.message);
  redirect(`/buyer/dashboard?profile=${portalToken}&paused=1`);
}
