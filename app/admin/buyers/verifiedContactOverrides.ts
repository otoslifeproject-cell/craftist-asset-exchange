import type { ProspectBuyerSeed } from './prospectBuyers';

export type VerifiedContactOverride = Partial<Omit<ProspectBuyerSeed, 'tags'>> & {
  company_name: string;
  tags?: string[];
};

export const VERIFIED_CONTACT_OVERRIDES: VerifiedContactOverride[] = [
  {
    company_name: 'Adlib',
    contact_name: 'Adlib enquiries team',
    email: 'enquiries@adlib.co.uk',
    phone: '+44 (0) 151 486 2214',
    website: 'https://www.adlib.co.uk/',
    country: 'UK',
    source_url: 'https://www.adlib.co.uk/contact',
    postcode: 'Knowsley L34 9JS',
    notes: 'Official contact page lists enquiries email and Liverpool head-office phone. Keep as prospect until outreach is approved.'
  }
];

export function applyVerifiedContactOverride(seed: ProspectBuyerSeed): ProspectBuyerSeed {
  const override = VERIFIED_CONTACT_OVERRIDES.find(
    (item) => item.company_name.toLowerCase() === seed.company_name.toLowerCase()
  );

  if (!override) return seed;

  return {
    ...seed,
    ...override,
    tags: Array.from(new Set([...(seed.tags || []), ...(override.tags || [])])),
    email: override.email || seed.email
  };
}
