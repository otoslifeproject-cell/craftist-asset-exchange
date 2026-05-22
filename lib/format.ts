export function formatMoney(pence: number | null | undefined, currency = 'gbp') {
  const amount = (pence || 0) / 100;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

export function toPence(value: FormDataEntryValue | null) {
  const raw = String(value || '').replace(/[^0-9.]/g, '');
  if (!raw) return 0;
  return Math.round(Number(raw) * 100);
}

export function normaliseTag(value: string) {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/&/g, ' AND ')
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 42);
}

export function parseTags(input: FormDataEntryValue | null | undefined) {
  return Array.from(new Set(String(input || '')
    .split(/[\n,;]+|\s+\/\s+/g)
    .map(normaliseTag)
    .filter(Boolean)));
}

export function tagsToText(tags: string[] | null | undefined) {
  return (tags || []).join(', ');
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
