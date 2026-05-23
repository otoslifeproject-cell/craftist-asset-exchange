'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { parseTags } from '../../../lib/format';
import { setAdminCookie } from '../../../lib/auth';
import { PROSPECT_BUYERS } from './prospectBuyers';

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) || '').trim();
  return value || null;
}

function safeStatus(value: FormDataEntryValue | null) {
  const status = String(value || 'prospect');
  return ['prospect', 'active', 'paused', 'blocked'].includes(status) ? status : 'prospect';
}

export async function addBuyerAction(formData: FormData) {
  const company_name = text(formData, 'company_name');
  const email = text(formData, 'email');
  if (!company_name || !email) throw new Error('Company and email are required');

  const { error } = await supabaseAdmin().from('buyers').upsert({
    company_name,
    contact_name: text(formData, 'contact_name'),
    email: email.toLowerCase(),
    phone: text(formData, 'phone'),
    website: text(formData, 'website'),
    country: text(formData, 'country'),
    source_url: text(formData, 'source_url'),
    postcode: text(formData, 'postcode'),
    buyer_type: text(formData, 'buyer_type'),
    tags: parseTags(formData.get('tags')),
    status: safeStatus(formData.get('status')),
    notes: text(formData, 'notes')
  }, { onConflict: 'email' });

  if (error) throw new Error(error.message);
  await setAdminCookie();
  revalidatePath('/admin/buyers');
  redirect('/admin/buyers?added=1');
}

export async function preloadProspectBuyersAction() {
  const rows = PROSPECT_BUYERS.map((buyer) => ({
    company_name: buyer.company_name,
    contact_name: buyer.contact_name || null,
    email: buyer.email.toLowerCase(),
    phone: buyer.phone || null,
    website: buyer.website || null,
    country: buyer.country || null,
    source_url: buyer.source_url || buyer.website || null,
    postcode: buyer.postcode || null,
    buyer_type: buyer.buyer_type,
    tags: buyer.tags,
    status: 'prospect',
    notes: buyer.notes
  }));

  const { error } = await supabaseAdmin().from('buyers').upsert(rows, { onConflict: 'email' });

  if (error) {
    throw new Error(`${error.message}. If this mentions buyer status/contact fields, run supabase/add-prospect-status.sql and supabase/add-buyer-contact-fields.sql in Supabase SQL Editor once, then click preload again.`);
  }

  await setAdminCookie();
  revalidatePath('/admin/buyers');
  redirect('/admin/buyers?preloaded=1');
}
