export type BuyerAlertCategory = {
  id: string;
  title: string;
  shortTitle: string;
  summary: string;
  tags: string[];
  examples: string[];
};

export const BUYER_TERMS_VERSION = 'CRAFTIST-BUYER-TERMS-v0.1-2026-05-24';

export const BUYER_ALERT_CATEGORIES: BuyerAlertCategory[] = [
  {
    id: 'scenic-builds',
    title: 'Large scenic builds',
    shortTitle: 'Scenic builds',
    summary: 'Stage sets, feature walls, branded scenic pieces and large built environments.',
    tags: ['SCENIC-BUILDS', 'OVERSIZED'],
    examples: ['stage returns', 'brand activations', 'festival sets']
  },
  {
    id: 'props-and-dressing',
    title: 'Props and dressing',
    shortTitle: 'Props',
    summary: 'Statement props, unusual decorative pieces, themed dressing and one-off objects.',
    tags: ['PROPS', 'SMALLS'],
    examples: ['hero props', 'window dressing', 'set dressing']
  },
  {
    id: 'bars-and-counters',
    title: 'Bars, counters and service units',
    shortTitle: 'Bars',
    summary: 'Reusable bars, reception desks, counters, kiosks and hospitality structures.',
    tags: ['BARS', 'SHOP-INTERIORS'],
    examples: ['event bars', 'retail counters', 'pop-up service units']
  },
  {
    id: 'lighting-and-av',
    title: 'Lighting, AV and screen assets',
    shortTitle: 'Lighting / AV',
    summary: 'Lighting features, illuminated signage, screen structures and AV-adjacent assets.',
    tags: ['LIGHTING', 'LED-SCREENS'],
    examples: ['lightboxes', 'LED frames', 'display rigs']
  },
  {
    id: 'immersive-and-escape',
    title: 'Immersive, escape-room and themed environments',
    shortTitle: 'Immersive',
    summary: 'Themed interiors, puzzle environments, narrative rooms and experiential builds.',
    tags: ['IMMERSIVE', 'ESCAPE-ROOMS'],
    examples: ['escape-room dressing', 'immersive corridors', 'themed rooms']
  },
  {
    id: 'furniture-and-industrial',
    title: 'Furniture, industrial and unusual salvage',
    shortTitle: 'Furniture / salvage',
    summary: 'Tables, seating, metalwork, timber, industrial objects and reusable fabrication assets.',
    tags: ['FURNITURE', 'INDUSTRIAL'],
    examples: ['large tables', 'industrial frames', 'salvaged structures']
  },
  {
    id: 'festival-and-outdoor',
    title: 'Festival, outdoor and temporary event assets',
    shortTitle: 'Festival',
    summary: 'Outdoor-ready pieces, temporary structures, signage and high-impact event dressing.',
    tags: ['FESTIVAL', 'EVENT-ASSETS'],
    examples: ['festival signage', 'outdoor dressing', 'temporary builds']
  },
  {
    id: 'all-premium-alerts',
    title: 'All premium asset alerts',
    shortTitle: 'All alerts',
    summary: 'Receive every high-value private asset alert while your buyer account is active.',
    tags: ['ALL'],
    examples: ['priority buyer lane', 'broad resale interest', 'multi-category operators']
  }
];

export const BUYER_ALERT_TAGS = Array.from(new Set(BUYER_ALERT_CATEGORIES.flatMap((category) => category.tags)));

export const PAYMENT_ROUTE_OPTIONS = [
  { value: 'full-payment', label: 'Full payment preferred', copy: 'Best when the buyer wants to lock the asset immediately.' },
  { value: 'seven-day-hold', label: 'Seven-day holding deposit preferred', copy: 'Useful when the buyer needs a short internal sign-off window.' },
  { value: 'both', label: 'Show both options where available', copy: 'Buyer is open to either route depending on the asset.' }
];

export const ALERT_FREQUENCY_OPTIONS = [
  { value: 'instant-matches', label: 'Instant matching alerts only' },
  { value: 'daily-digest', label: 'Daily digest when matching assets exist' },
  { value: 'priority-only', label: 'Priority alerts only' }
];

export function formatPreferenceLabel(tag: string) {
  return tag
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
    .replace(/\bAv\b/g, 'AV')
    .replace(/\bLed\b/g, 'LED');
}

export function optionLabel(options: Array<{ value: string; label: string }>, value: string | null | undefined) {
  return options.find((option) => option.value === value)?.label || 'Not specified';
}
