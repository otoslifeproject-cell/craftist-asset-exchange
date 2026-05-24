import crypto from 'crypto';
import { supabaseAdmin } from './supabaseAdmin';
import { sendDealEmail } from './email';
import type { Buyer, Item } from './types';
import { formatPreferenceLabel } from './buyerPreferences';

export type MatchPreview = {
  buyer: Buyer;
  reason: string;
};

function valuesOverlap(left: string[] | null | undefined, right: string[] | null | undefined) {
  const leftSet = new Set((left || []).map((value) => value.toUpperCase()));
  return (right || []).some((value) => leftSet.has(value.toUpperCase()));
}

export function getBuyerMatchReason(buyer: Buyer, item: Item) {
  if (buyer.status !== 'active') return null;
  if (!buyer.terms_accepted_at || !buyer.alert_consent_at) return null;
  if (item.status !== 'live' && item.status !== 'draft') return null;

  const preferredCategories = buyer.preferred_categories || [];
  const preferredTags = buyer.preferred_tags || buyer.tags || [];
  const itemCategory = item.category ? item.category.toUpperCase() : null;
  const itemTags = (item.tags || []).map((tag) => tag.toUpperCase());

  if (itemCategory && preferredCategories.map((category) => category.toUpperCase()).includes(itemCategory)) {
    return `Category match: ${formatPreferenceLabel(item.category)}`;
  }

  if (valuesOverlap(preferredTags, itemTags)) {
    const matchedTags = itemTags.filter((tag) => preferredTags.map((buyerTag) => buyerTag.toUpperCase()).includes(tag));
    return `Tag match: ${matchedTags.map(formatPreferenceLabel).join(', ')}`;
  }

  return null;
}

export async function previewMatchedBuyers(itemId: string) {
  const supabase = supabaseAdmin();
  const [{ data: item, error: itemError }, { data: buyers, error: buyerError }, { data: existing }] = await Promise.all([
    supabase.from('items').select('*').eq('id', itemId).single(),
    supabase.from('buyers').select('*').eq('status', 'active').order('company_name'),
    supabase.from('alert_recipients').select('buyer_id').eq('item_id', itemId)
  ]);

  if (itemError || !item) throw new Error(itemError?.message || 'Item not found');
  if (buyerError) throw new Error(buyerError.message);

  const existingBuyerIds = new Set((existing || []).map((row: any) => row.buyer_id));
  const typedItem = item as Item;
  const preview: MatchPreview[] = [];

  for (const buyer of (buyers || []) as Buyer[]) {
    if (existingBuyerIds.has(buyer.id)) continue;
    const reason = getBuyerMatchReason(buyer, typedItem);
    if (reason) preview.push({ buyer, reason });
  }

  return preview;
}

export async function publishItem(itemId: string) {
  const supabase = supabaseAdmin();

  const { data: item, error: itemError } = await supabase.from('items').select('*').eq('id', itemId).single();
  if (itemError || !item) throw new Error(itemError?.message || 'Item not found');

  const typedItem = item as Item;
  if (typedItem.status === 'sold') throw new Error('Cannot publish a sold item.');

  const matched = await previewMatchedBuyers(itemId);
  if (!matched.length) throw new Error('No active buyers with accepted terms and alert consent match this asset.');

  await supabase.from('items').update({ status: 'live', reservation_status: 'none', updated_at: new Date().toISOString() }).eq('id', itemId);

  const { data: batch, error: batchError } = await supabase
    .from('alert_batches')
    .insert({ item_id: itemId, status: 'sending', buyer_count: matched.length, previewed_at: new Date().toISOString() })
    .select('*')
    .single();
  if (batchError || !batch) throw new Error(batchError?.message || 'Could not create alert batch');

  let sent = 0;
  let failed = 0;

  for (const match of matched) {
    const token = crypto.randomBytes(24).toString('hex');
    const { data: recipient, error: recError } = await supabase
      .from('alert_recipients')
      .insert({ batch_id: batch.id, item_id: itemId, buyer_id: match.buyer.id, token, status: 'queued', match_reason: match.reason })
      .select('*')
      .single();

    if (recError || !recipient) {
      failed += 1;
      continue;
    }

    const result = await sendDealEmail({ buyer: match.buyer, item: typedItem, token, matchReason: match.reason });
    if (result.ok) {
      sent += 1;
      const now = new Date().toISOString();
      await Promise.all([
        supabase.from('alert_recipients').update({ status: 'sent', sent_at: now }).eq('id', recipient.id),
        supabase.from('buyers').update({ last_alerted_at: now }).eq('id', match.buyer.id)
      ]);
    } else {
      failed += 1;
      await supabase.from('alert_recipients').update({ status: 'failed', failure_reason: result.reason || 'email failed' }).eq('id', recipient.id);
    }
  }

  await supabase
    .from('alert_batches')
    .update({ status: failed ? 'sent_with_failures' : 'sent', sent_count: sent, failed_count: failed, sent_at: new Date().toISOString() })
    .eq('id', batch.id);

  return { matched: matched.length, sent, failed, batchId: batch.id };
}
