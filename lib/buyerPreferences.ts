import type { Item } from './types';

export type BuyerCategory = { id: string; label: string; tagHints: string[] };
export type BuyerTag = { id: string; label: string };

export const BUYER_TERMS_VERSION = 'CRAFTIST-BUYER-TERMS-v0.2-2026-05-24';

export const BUYER_CATEGORIES: BuyerCategory[] = [
  { id: 'SCENIC-BUILD', label: 'Scenic build', tagHints: ['SCENIC', 'STAGE-SET'] },
  { id: 'GIANT-PROP', label: 'Giant prop', tagHints: ['PROP-BIG', 'PHOTO-MOMENT'] },
  { id: 'BAR-COUNTER', label: 'Bar / counter', tagHints: ['BAR', 'RETAIL'] },
  { id: 'DJ-BOOTH', label: 'DJ booth', tagHints: ['DJ-BOOTH', 'AV-LIGHT'] },
  { id: 'LIGHTING-AV', label: 'Lighting / AV', tagHints: ['AV-LIGHT', 'LIGHTING'] },
  { id: 'LED-SCREEN', label: 'LED screen', tagHints: ['LED-SCREEN', 'AV-LIGHT'] },
  { id: 'EXHIBITION-DISPLAY', label: 'Exhibition display', tagHints: ['EXHIBITION', 'RETAIL'] },
  { id: 'IMMERSIVE-SET', label: 'Immersive set', tagHints: ['IMMERSIVE', 'THEME'] },
  { id: 'FESTIVAL-OUTDOOR', label: 'Festival / outdoor', tagHints: ['FESTIVAL', 'OUTDOOR'] },
  { id: 'RETAIL-DISPLAY', label: 'Retail display', tagHints: ['RETAIL', 'PHOTO-MOMENT'] },
  { id: 'ATTRACTION-THEME', label: 'Attraction / theme', tagHints: ['ATTRACTION', 'THEME'] },
  { id: 'ESCAPE-ROOM', label: 'Escape room', tagHints: ['ESCAPE-ROOM', 'IMMERSIVE'] },
  { id: 'SEASONAL-INSTALL', label: 'Seasonal install', tagHints: ['SEASONAL', 'PHOTO-MOMENT'] },
  { id: 'STAGE-SET', label: 'Stage set', tagHints: ['STAGE-SET', 'THEATRE'] }
];

export const BUYER_TAGS: BuyerTag[] = ['PROP-BIG','SCENIC','BAR','FESTIVAL','IMMERSIVE','RETAIL','PHOTO-MOMENT','AV-LIGHT','LIGHTING','LED-SCREEN','STAGE-SET','THEATRE','OUTDOOR','INDOOR','CIRCULAR','EXHIBITION','THEME','ATTRACTION','ESCAPE-ROOM','SEASONAL','DJ-BOOTH'].map((id) => ({ id, label: id }));

export const BUYER_CATEGORY_IDS = BUYER_CATEGORIES.map((category) => category.id);
export const BUYER_TAG_IDS = BUYER_TAGS.map((tag) => tag.id);

export const PAYMENT_ROUTE_OPTIONS = [
  { value: 'deposit-and-balance', label: 'Reserve with deposit', copy: 'Secure the asset for seven days, then pay the balance before the reservation ends.' },
  { value: 'full-payment', label: 'Buy now in full', copy: 'Pay the full amount immediately and lock the asset as sold.' },
  { value: 'both', label: 'Show both options where available', copy: 'Allow either route when the private opportunity page supports it.' }
];

export const URGENCY_OPTIONS = [
  { value: 'instant', label: 'Instant match alerts' },
  { value: 'daily', label: 'Daily digest when matches exist' },
  { value: 'priority', label: 'Priority opportunities only' }
];

export function normaliseChoice(value: string) {
  return String(value || '').trim().toUpperCase().replace(/&/g, ' AND ').replace(/[^A-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function pickAllowed(values: FormDataEntryValue[], allowed: string[]) {
  const allowedSet = new Set(allowed);
  return Array.from(new Set(values.map((value) => normaliseChoice(String(value))).filter((value) => allowedSet.has(value))));
}

export function formatPreferenceLabel(value: string | null | undefined) {
  if (!value) return 'Not set';
  const category = BUYER_CATEGORIES.find((item) => item.id === value);
  if (category) return category.label;
  return value.split('-').filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ').replace(/\bAv\b/g, 'AV').replace(/\bLed\b/g, 'LED').replace(/\bDj\b/g, 'DJ');
}

export function optionLabel(options: Array<{ value: string; label: string }>, value: string | null | undefined) {
  return options.find((option) => option.value === value)?.label || 'Not specified';
}

export function getTotalPricePence(item: Pick<Item, 'guide_price_pence' | 'transport_price_pence'>) {
  return Math.max(0, (item.guide_price_pence || 0) + (item.transport_price_pence || 0));
}

export function getReservationDepositPence(item: Pick<Item, 'guide_price_pence' | 'transport_price_pence' | 'reservation_deposit_pence'>) {
  const total = getTotalPricePence(item);
  if (total <= 0) return 0;
  const configured = item.reservation_deposit_pence || 0;
  if (configured > 0) return Math.min(configured, total);
  return Math.min(Math.max(10000, Math.round(total * 0.2)), total);
}

export function getBalanceDuePence(item: Pick<Item, 'guide_price_pence' | 'transport_price_pence' | 'reservation_deposit_pence'>) {
  return Math.max(0, getTotalPricePence(item) - getReservationDepositPence(item));
}

export function sevenDaysFromNowIso() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
}

export function thirtyMinutesFromNowIso() {
  return new Date(Date.now() + 30 * 60 * 1000).toISOString();
}
