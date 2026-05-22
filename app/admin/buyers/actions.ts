'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { parseTags } from '../../../lib/format';

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) || '').trim();
  return value || null;
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
    postcode: text(formData, 'postcode'),
    buyer_type: text(formData, 'buyer_type'),
    tags: parseTags(formData.get('tags')),
    status: String(formData.get('status') || 'active'),
    notes: text(formData, 'notes')
  }, { onConflict: 'email' });

  if (error) throw new Error(error.message);
  revalidatePath('/admin/buyers');
  redirect('/admin/buyers?added=1');
}
