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
    notes: 'Official contact page lists enquiries@adlib.co.uk and +44 (0)151 486 2214. Department routes include rental@adlib.co.uk, sales@adlib.co.uk and integration@adlib.co.uk. Keep as prospect until outreach is approved.'
  },
  {
    company_name: 'Theme Traders',
    contact_name: 'Theme Traders team',
    email: 'info@themetraders.com',
    phone: '+44 (0) 20 8452 8518',
    website: 'https://www.themetraders.com/',
    country: 'UK',
    source_url: 'https://www.themetraders.com/',
    postcode: 'London NW2 6LL',
    notes: 'Official site lists info@themetraders.com, +44 (0)20 8452 8518 and Production Village, Turpins Yard, Oaklands Road, London NW2 6LL. Keep as prospect until outreach is approved.'
  },
  {
    company_name: 'Event Prop Hire',
    contact_name: 'EPH Creative team',
    phone: '01937 222 777',
    website: 'https://www.eventprophire.com/',
    country: 'UK',
    source_url: 'https://www.eventprophire.com/',
    postcode: 'UK',
    notes: 'Official website lists 01937 222 777. Email not visible in captured public page; use website contact route until verified.'
  },
  {
    company_name: 'London Prop Hire',
    contact_name: 'London Prop Hire team',
    phone: '07772 777093',
    website: 'https://www.londonprophire.com/',
    country: 'UK',
    source_url: 'https://www.londonprophire.com/',
    postcode: 'London SW17 0BA',
    notes: 'Official site lists Unit 11, Wimbledon Stadium Business Centre, Riverside Road, London SW17 0BA and Tel: 07772 777093. Email not visible in captured public page.'
  },
  {
    company_name: 'Stage Sound Services',
    contact_name: 'Stage Sound Services hire team',
    email: 'hires@stagesoundservices.co.uk',
    phone: '+44 (0)29 2061 3577',
    website: 'https://www.stagesoundservices.co.uk/',
    country: 'UK',
    source_url: 'https://www.stagesoundservices.co.uk/',
    postcode: 'Cardiff CF23 8HE',
    notes: 'Official site lists hires@stagesoundservices.co.uk, sales@stagesoundservices.co.uk, +44 (0)29 2061 3577 and Unit A Avenue Park Industrial Estate, Pentwyn, Cardiff CF23 8HE.'
  },
  {
    company_name: 'Pearce Hire',
    contact_name: 'Pearce Hire team',
    phone: '01733 554950',
    website: 'https://www.pearcehire.co.uk/',
    country: 'UK',
    source_url: 'https://www.pearcehire.co.uk/',
    postcode: 'Peterborough PE1 5EL',
    notes: 'Official site lists 01733 554950 and Unit 8, Reynolds Industrial Park, Stevern Way, Peterborough PE1 5EL. Email is protected on the public page, so not copied.'
  },
  {
    company_name: 'Production AV',
    contact_name: 'Production AV team',
    phone: '01242 650604',
    website: 'https://www.productionav.co.uk/',
    country: 'UK',
    source_url: 'https://www.productionav.co.uk/contact-us/',
    postcode: 'Cheltenham GL51 9PT',
    notes: 'Official contact page lists 01242 650604, Unit F Ashville Trading Estate, The Runnings, Cheltenham GL51 9PT and an email link protected in page markup. Use phone/contact form unless email is manually verified.'
  },
  {
    company_name: 'Nimlok UK',
    contact_name: 'Nimlok contact team',
    phone: '0800 111 4001',
    website: 'https://www.nimlok.co.uk/',
    country: 'UK',
    source_url: 'https://www.nimlok.co.uk/contact/',
    postcode: 'Wellingborough NN8 6NL',
    notes: 'Official contact page lists 0800 111 4001 and 45 Booth Drive, Park Farm, Wellingborough NN8 6NL. Use contact form for email route.'
  },
  {
    company_name: 'Quadrant2Design',
    contact_name: 'Quadrant2Design design team',
    email: 'design@quadrant2design.com',
    phone: '01202 723 500',
    website: 'https://www.quadrant2design.com/',
    country: 'UK',
    source_url: 'https://www.quadrant2design.com/',
    postcode: 'Poole / Bournemouth, UK',
    notes: 'Official website header lists design@quadrant2design.com and 01202 723 500.'
  },
  {
    company_name: 'Stageco',
    contact_name: 'Stageco Worldwide team',
    email: 'info@stageco.com',
    phone: '+32 16 60 84 71',
    website: 'https://www.stageco.com/',
    country: 'Belgium / EU / UK',
    source_url: 'https://www.stageco.com/',
    postcode: 'Tildonk, Belgium',
    notes: 'Official website lists info@stageco.com, +32 16 60 84 71 and Kapelleweg 6, 3150 Tildonk, Belgium.'
  },
  {
    company_name: 'ECA2',
    contact_name: 'ECA2 Paris team',
    email: 'paris@eca2.com',
    phone: '+33 1 83 75 80 80',
    website: 'https://www.eca2.com/',
    country: 'France / EU',
    source_url: 'https://www.eca2.com/contact/',
    postcode: 'Levallois-Perret, France',
    notes: 'Official contact page lists ECA2 Paris, paris@eca2.com, (+33) 1 83 75 80 80 and 101-109 Rue Jean Jaurès, 92300 Levallois-Perret, France.'
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
