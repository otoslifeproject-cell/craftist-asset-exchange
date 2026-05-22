import crypto from 'crypto';
import { supabaseAdmin } from './supabaseAdmin';
import { sendDealEmail } from './email';
import type { Buyer, Item } from './types';

function buyerMatchesItem(buyer: Buyer, item: Item) {
  const buyerTags = new Set((buyer.tags || []).map((tag) => tag.toUpperCase()));
  const itemTags = (item.tags || []).map((tag) => tag.toUpperCase());
  if (buyerTags.has('ALL')) return true;
  return itemTags.some((tag) => buyerTags.has(tag));
}

export async function publishItem(itemId: string) {
  const supabase = supabaseAdmin();

  const { data: item, error: itemError } = await supabase.from('items').select('*').eq('id', itemId).single();
  if (itemError || !item) throw new Error(itemError?.message || 'Item not found');

  const typedItem = item as Item;
  if (typedItem.status === 'sold') throw new Error('Cannot publish a sold item.');

  const { data: buyers, error: buyerError } = await supabase.from('buyers').select('*').eq('status', 'active').order('company_name');
  if (buyerError) throw new Error(buyerError.message);

  const matched = ((buyers || []) as Buyer[]).filter((buyer) => buyerMatchesItem(buyer, typedItem));
  if (!matched.length) throw new Error('No active buyers match this item tag set. Add buyers or use tag ALL.');

  await supabase.from('items').update({ status: 'live', updated_at: new Date().toISOString() }).eq('id', itemId);

  const { data: batch, error: batchError } = await supabase
    .from('alert_batches')
    .insert({ item_id: itemId, status: 'sending', buyer_count: matched.length })
    .select('*')
    .single();
  if (batchError || !batch) throw new Error(batchError?.message || 'Could not create alert batch');

  let sent = 0;
  let failed = 0;

  for (const buyer of matched) {
    const token = crypto.randomBytes(24).toString('hex');
    const { data: recipient, error: recError } = await supabase
      .from('alert_recipients')
      .insert({ batch_id: batch.id, item_id: itemId, buyer_id: buyer.id, token, status: 'queued' })
      .select('*')
      .single();

    if (recError || !recipient) {
      failed += 1;
      continue;
    }

    const result = await sendDealEmail({ buyer, item: typedItem, token });
    if (result.ok) {
      sent += 1;
      await supabase.from('alert_recipients').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', recipient.id);
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
