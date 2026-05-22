'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { parseTags, slugify, toPence } from '../../../lib/format';
import { publishItem } from '../../../lib/publish';
import type { AssetFile } from '../../../lib/types';

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) || '').trim();
  return value || null;
}

function datetime(formData: FormData, key: string) {
  const value = String(formData.get(key) || '').trim();
  if (!value) return null;
  return new Date(value).toISOString();
}

export async function createItemAction(formData: FormData) {
  const supabase = supabaseAdmin();
  const id = randomUUID();
  const title = text(formData, 'title');
  if (!title) throw new Error('Title is required');

  const imageUrlsFromText = String(formData.get('image_urls') || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const fileLinksFromText: AssetFile[] = String(formData.get('file_urls') || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((url) => ({ name: url.split('/').pop() || 'File link', url }));

  const uploadedFiles: AssetFile[] = [];
  const uploadedImageUrls: string[] = [];
  const storageBucket = process.env.SUPABASE_STORAGE_BUCKET || 'asset-files';

  for (const raw of formData.getAll('files')) {
    if (!(raw instanceof File) || raw.size === 0) continue;
    const safeName = raw.name.replace(/[^a-zA-Z0-9._-]+/g, '-');
    const path = `${id}/${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await raw.arrayBuffer());
    const { error } = await supabase.storage.from(storageBucket).upload(path, buffer, {
      contentType: raw.type || 'application/octet-stream',
      upsert: false
    });
    if (error) throw new Error(`File upload failed: ${error.message}`);
    const publicUrl = supabase.storage.from(storageBucket).getPublicUrl(path).data.publicUrl;
    uploadedFiles.push({ name: raw.name, url: publicUrl, type: raw.type, size: raw.size });
    if (raw.type.startsWith('image/')) uploadedImageUrls.push(publicUrl);
  }

  const item = {
    id,
    title,
    slug: slugify(title),
    description: text(formData, 'description'),
    category: text(formData, 'category'),
    tags: parseTags(formData.get('tags')),
    status: String(formData.get('status') || 'draft'),
    dimensions: text(formData, 'dimensions'),
    dispatch_postcode: text(formData, 'dispatch_postcode'),
    location_notes: text(formData, 'location_notes'),
    availability_start: datetime(formData, 'availability_start'),
    decision_deadline: datetime(formData, 'decision_deadline'),
    guide_price_pence: toPence(formData.get('guide_price')),
    transport_price_pence: toPence(formData.get('transport_price')),
    currency: String(formData.get('currency') || process.env.STRIPE_CURRENCY || 'gbp').toLowerCase(),
    image_urls: [...imageUrlsFromText, ...uploadedImageUrls],
    files: [...fileLinksFromText, ...uploadedFiles],
    included: text(formData, 'included'),
    exclusions: text(formData, 'exclusions'),
    compliance_notes: text(formData, 'compliance_notes'),
    transport_notes: text(formData, 'transport_notes'),
    condition_notes: text(formData, 'condition_notes'),
    assembly_notes: text(formData, 'assembly_notes')
  };

  const { error } = await supabase.from('items').insert(item);
  if (error) throw new Error(error.message);
  revalidatePath('/admin');
  redirect(`/admin/items/${id}`);
}

export async function publishItemAction(formData: FormData) {
  const itemId = String(formData.get('item_id') || '');
  if (!itemId) throw new Error('Missing item_id');
  await publishItem(itemId);
  revalidatePath('/admin');
  revalidatePath(`/admin/items/${itemId}`);
  redirect(`/admin/items/${itemId}?published=1`);
}

export async function expireItemAction(formData: FormData) {
  const itemId = String(formData.get('item_id') || '');
  if (!itemId) throw new Error('Missing item_id');
  const { error } = await supabaseAdmin().from('items').update({ status: 'expired', updated_at: new Date().toISOString() }).eq('id', itemId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin');
  redirect(`/admin/items/${itemId}`);
}
