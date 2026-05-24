import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import type { Buyer } from '../../../lib/types';
import { PROSPECT_BUYERS } from './prospectBuyers';
import { applyVerifiedContactOverride } from './verifiedContactOverrides';

type SeedBuyer = ReturnType<typeof applyVerifiedContactOverride>;

type SeedResult = {
  ok: boolean;
  inserted: number;
  updated: number;
  error?: string;
};

type BuyerPatch = Partial<Pick<Buyer, 'contact_name' | 'email' | 'phone' | 'website' | 'country' | 'source_url' | 'postcode' | 'buyer_type' | 'notes'>> & {
  tags?: string[];
};

function isBlank(value?: string | null) {
  return !value || !value.trim();
}

function isPlaceholderEmail(value?: string | null) {
  return !!value && value.endsWith('@craftist.local');
}

function isGenericContact(value?: string | null) {
  if (!value) return true;
  const normalised = value.toLowerCase();
  return normalised.includes('contact team') || normalised.includes('to verify') || normalised.includes('prospect contact');
}

function mergeTags(existing: string[] | null | undefined, incoming: string[]) {
  return Array.from(new Set([...(existing || []), ...incoming]));
}

function seedRow(seed: SeedBuyer) {
  return {
    company_name: seed.company_name,
    contact_name: seed.contact_name || null,
    email: seed.email.toLowerCase(),
    phone: seed.phone || null,
    website: seed.website || null,
    country: seed.country || null,
    source_url: seed.source_url || seed.website || null,
    postcode: seed.postcode || null,
    buyer_type: seed.buyer_type,
    tags: seed.tags,
    status: 'prospect',
    notes: seed.notes
  };
}

function patchForExisting(existing: Buyer, seed: SeedBuyer): BuyerPatch {
  const patch: BuyerPatch = {};

  if (isGenericContact(existing.contact_name) && seed.contact_name && !isGenericContact(seed.contact_name)) patch.contact_name = seed.contact_name;
  if (isPlaceholderEmail(existing.email) && !isPlaceholderEmail(seed.email)) patch.email = seed.email.toLowerCase();
  if (isBlank(existing.phone) && seed.phone) patch.phone = seed.phone;
  if (isBlank(existing.website) && seed.website) patch.website = seed.website;
  if (isBlank(existing.country) && seed.country) patch.country = seed.country;
  if (isBlank(existing.source_url) && (seed.source_url || seed.website)) patch.source_url = seed.source_url || seed.website || null;
  if (isBlank(existing.postcode) && seed.postcode) patch.postcode = seed.postcode;
  if (isBlank(existing.buyer_type) && seed.buyer_type) patch.buyer_type = seed.buyer_type;
  if (isBlank(existing.notes) && seed.notes) patch.notes = seed.notes;

  const tags = mergeTags(existing.tags, seed.tags);
  if (tags.join('|') !== (existing.tags || []).join('|')) patch.tags = tags;

  return patch;
}

export async function ensureProspectBuyersSeeded(): Promise<SeedResult> {
  const supabase = supabaseAdmin();

  try {
    const { data, error } = await supabase
      .from('buyers')
      .select('id, company_name, contact_name, email, phone, website, country, source_url, postcode, buyer_type, tags, status, notes, created_at');

    if (error) return { ok: false, inserted: 0, updated: 0, error: error.message };

    const existing = (data || []) as Buyer[];
    const byEmail = new Map(existing.map((buyer) => [buyer.email.toLowerCase(), buyer]));
    const byCompany = new Map(existing.map((buyer) => [buyer.company_name.toLowerCase(), buyer]));

    let inserted = 0;
    let updated = 0;

    for (const rawSeed of PROSPECT_BUYERS) {
      const seed = applyVerifiedContactOverride(rawSeed);
      const email = seed.email.toLowerCase();
      const matched = byEmail.get(email) || byCompany.get(seed.company_name.toLowerCase());

      if (!matched) {
        const { error: insertError } = await supabase.from('buyers').insert(seedRow(seed));
        if (!insertError) inserted += 1;
        continue;
      }

      const patch = patchForExisting(matched, seed);
      if (!Object.keys(patch).length) continue;

      const { error: updateError } = await supabase.from('buyers').update(patch).eq('id', matched.id);
      if (!updateError) updated += 1;
    }

    return { ok: true, inserted, updated };
  } catch (error) {
    return {
      ok: false,
      inserted: 0,
      updated: 0,
      error: error instanceof Error ? error.message : 'Unknown buyer contact sync error'
    };
  }
}
