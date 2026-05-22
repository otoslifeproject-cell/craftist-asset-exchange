export type ItemStatus = 'draft' | 'live' | 'reserved' | 'sold' | 'expired';
export type BuyerStatus = 'active' | 'paused' | 'blocked';
export type RecipientStatus = 'queued' | 'sent' | 'opened' | 'checkout_started' | 'paid' | 'expired' | 'failed';

export type AssetFile = {
  name: string;
  url: string;
  type?: string;
  size?: number;
};

export type Item = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  category: string | null;
  tags: string[] | null;
  status: ItemStatus;
  dimensions: string | null;
  dispatch_postcode: string | null;
  location_notes: string | null;
  availability_start: string | null;
  decision_deadline: string | null;
  guide_price_pence: number;
  transport_price_pence: number;
  currency: string;
  image_urls: string[] | null;
  files: AssetFile[] | null;
  included: string | null;
  exclusions: string | null;
  compliance_notes: string | null;
  transport_notes: string | null;
  condition_notes: string | null;
  assembly_notes: string | null;
  reserved_until: string | null;
  reserved_token: string | null;
  sold_at: string | null;
  created_at: string;
};

export type Buyer = {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string;
  phone: string | null;
  postcode: string | null;
  buyer_type: string | null;
  tags: string[] | null;
  status: BuyerStatus;
  notes: string | null;
  created_at: string;
};

export type AlertRecipient = {
  id: string;
  batch_id: string;
  item_id: string;
  buyer_id: string;
  token: string;
  status: RecipientStatus;
  sent_at: string | null;
  opened_at: string | null;
  checkout_started_at: string | null;
  paid_at: string | null;
};
