export type ProspectBuyerSeed = {
  company_name: string;
  contact_name?: string | null;
  email: string;
  phone?: string | null;
  website?: string | null;
  country?: string | null;
  source_url?: string | null;
  postcode?: string | null;
  buyer_type: string;
  tags: string[];
  notes: string;
};

export const CONTACT_RESEARCH_UPDATED_AT = '2026-05-23';

function prospectEmail(slug: string) {
  return `prospect+${slug}@craftist.local`;
}

function seed(input: Omit<ProspectBuyerSeed, 'email'> & { slug: string; email?: string }) {
  const { slug, ...rest } = input;
  return {
    ...rest,
    email: input.email || prospectEmail(slug),
    tags: Array.from(new Set(['PROSPECT', ...input.tags]))
  };
}

export const PROSPECT_BUYERS: ProspectBuyerSeed[] = [
  seed({
    slug: 'event-prop-hire',
    company_name: 'Event Prop Hire',
    contact_name: 'Contact team to verify',
    phone: null,
    website: 'https://www.eventprophire.com/',
    country: 'UK',
    source_url: 'https://www.eventprophire.com/',
    postcode: null,
    buyer_type: 'Prop hire / event theming',
    tags: ['PROP-BIG', 'SCENIC', 'BAR', 'FESTIVAL', 'RETAIL', 'PHOTO-MOMENT'],
    notes: 'Prospect. Website route added for verification. Public email/phone not yet verified in this pass; use website/contact route before activation.'
  }),
  seed({
    slug: 'theme-traders',
    company_name: 'Theme Traders',
    contact_name: 'Contact team to verify',
    phone: null,
    website: 'https://www.themetraders.com/',
    country: 'UK',
    source_url: 'https://www.themetraders.com/',
    postcode: null,
    buyer_type: 'Theming / event production / props',
    tags: ['THEMING', 'PROP-BIG', 'SCENIC', 'FESTIVAL', 'IMMERSIVE', 'RETAIL'],
    notes: 'Prospect. Company identified as London-based event theming/prop hire. Public contact route still to verify before activation.'
  }),
  seed({
    slug: 'the-prop-factory',
    company_name: 'The Prop Factory',
    contact_name: 'Contact team to verify',
    phone: null,
    website: 'https://www.thepropfactory.co.uk/',
    country: 'UK',
    source_url: 'https://www.thepropfactory.co.uk/',
    postcode: null,
    buyer_type: 'Prop hire / themed decor',
    tags: ['PROP-BIG', 'SCENIC', 'BAR', 'PHOTO-MOMENT', 'SEASONAL', 'RETAIL'],
    notes: 'Prospect. Strong fit for unusual one-off props, scenic features and themed installations. Public contact details still to verify.'
  }),
  seed({
    slug: 'stockyard-props',
    company_name: 'Stockyard Props',
    contact_name: 'Contact team to verify',
    phone: null,
    website: 'https://stockyardnorth.com/',
    country: 'UK',
    source_url: 'https://stockyardnorth.com/',
    postcode: null,
    buyer_type: 'Film / TV / event prop hire',
    tags: ['PROP-BIG', 'SCENIC', 'FILM-TV', 'IMMERSIVE', 'RETAIL'],
    notes: 'Prospect. Potential fit for prop resale, scenic stock and production-ready display pieces. Contact route to verify.'
  }),
  seed({ slug: 'london-prop-hire', company_name: 'London Prop Hire', contact_name: 'Contact team to verify', phone: null, website: 'https://www.londonprophire.com/', country: 'UK', source_url: 'https://www.londonprophire.com/', postcode: null, buyer_type: 'Prop hire / production supply', tags: ['PROP-BIG', 'SCENIC', 'FILM-TV', 'BAR', 'PHOTO-MOMENT'], notes: 'Prospect. Verify public contact route before activation.' }),
  seed({ slug: 'farley-prop-hire', company_name: 'Farley Prop Hire', contact_name: 'Contact team to verify', phone: null, website: 'https://www.farleyprophire.com/', country: 'UK', source_url: 'https://www.farleyprophire.com/', postcode: null, buyer_type: 'Prop hire / production assets', tags: ['PROP-BIG', 'SCENIC', 'FILM-TV', 'INDOOR'], notes: 'Prospect. Verify public contact route before activation.' }),
  seed({ slug: 'scenery-salvage', company_name: 'Scenery Salvage', contact_name: 'Contact team to verify', phone: null, website: null, country: 'UK', source_url: null, postcode: null, buyer_type: 'Scenic reuse / salvage / circular stock', tags: ['CIRCULAR', 'SCENIC', 'SALVAGE', 'PROP-BIG', 'STAGE-SET'], notes: 'Prospect. Circular fallback prospect for scenic elements and reusable set materials. Needs source/contact verification.' }),

  seed({ slug: 'white-light', company_name: 'White Light', contact_name: 'Contact team to verify', phone: null, website: 'https://www.white-light.co.uk/', country: 'UK', source_url: 'https://www.white-light.co.uk/', postcode: null, buyer_type: 'Lighting / AV / event production', tags: ['AV-LIGHT', 'LIGHTING', 'IMMERSIVE', 'EXHIBITION', 'STAGE-SET'], notes: 'Prospect. Verify current contact details before activation.' }),
  seed({ slug: 'prg-uk', company_name: 'PRG UK', contact_name: 'Contact team to verify', phone: null, website: 'https://www.prg.com/uk/en', country: 'UK', source_url: 'https://www.prg.com/uk/en', postcode: null, buyer_type: 'Production technology / AV / lighting', tags: ['AV-LIGHT', 'LIGHTING', 'LED-SCREEN', 'STAGE-SET', 'EXHIBITION'], notes: 'Prospect. Verify current UK sales/contact details before activation.' }),
  seed({ slug: 'adlib', company_name: 'Adlib', contact_name: 'Contact team to verify', phone: null, website: 'https://www.adlib.co.uk/', country: 'UK', source_url: 'https://www.adlib.co.uk/', postcode: null, buyer_type: 'Audio / lighting / video production', tags: ['AV-LIGHT', 'LIGHTING', 'LED-SCREEN', 'FESTIVAL', 'STAGE-SET'], notes: 'Prospect. Verify current public contact route before activation.' }),
  seed({ slug: 'entec-live', company_name: 'Entec Live', contact_name: 'Contact team to verify', phone: null, website: 'https://enteclive.com/', country: 'UK', source_url: 'https://enteclive.com/', postcode: null, buyer_type: 'Live event production / lighting / sound', tags: ['AV-LIGHT', 'LIGHTING', 'FESTIVAL', 'STAGE-SET', 'LED-SCREEN'], notes: 'Prospect. Verify current public contact route before activation.' }),
  seed({ slug: 'stage-sound-services', company_name: 'Stage Sound Services', contact_name: 'Contact team to verify', phone: null, website: 'https://www.stagesoundservices.co.uk/', country: 'UK', source_url: 'https://www.stagesoundservices.co.uk/', postcode: null, buyer_type: 'Theatre / event audio and production services', tags: ['AV-LIGHT', 'STAGE-SET', 'IMMERSIVE', 'THEATRE', 'LIGHTING'], notes: 'Prospect. Verify current public contact route before activation.' }),
  seed({ slug: 'sfl-group', company_name: 'SFL Group', contact_name: 'Contact team to verify', phone: null, website: 'https://www.sflgroup.co.uk/', country: 'UK', source_url: 'https://www.sflgroup.co.uk/', postcode: null, buyer_type: 'Sound / lighting / video production', tags: ['AV-LIGHT', 'LIGHTING', 'LED-SCREEN', 'STAGE-SET', 'EXHIBITION'], notes: 'Prospect. Verify current public contact route before activation.' }),
  seed({ slug: 'pearce-hire', company_name: 'Pearce Hire', contact_name: 'Contact team to verify', phone: null, website: 'https://www.pearcehire.co.uk/', country: 'UK', source_url: 'https://www.pearcehire.co.uk/', postcode: null, buyer_type: 'Event production / power / lighting', tags: ['AV-LIGHT', 'LIGHTING', 'FESTIVAL', 'OUTDOOR', 'STAGE-SET'], notes: 'Prospect. Verify current public contact route before activation.' }),
  seed({ slug: 'tsl-lighting', company_name: 'TSL Lighting', contact_name: 'Contact team to verify', phone: null, website: 'https://www.tsl.lighting/', country: 'UK', source_url: 'https://www.tsl.lighting/', postcode: null, buyer_type: 'Lighting hire / event production', tags: ['AV-LIGHT', 'LIGHTING', 'STAGE-SET', 'EXHIBITION', 'IMMERSIVE'], notes: 'Prospect. Verify current public contact route before activation.' }),
  seed({ slug: 'production-av', company_name: 'Production AV', contact_name: 'Contact team to verify', phone: null, website: 'https://www.productionav.co.uk/', country: 'UK', source_url: 'https://www.productionav.co.uk/', postcode: null, buyer_type: 'AV / video / live production', tags: ['AV-LIGHT', 'LED-SCREEN', 'LIGHTING', 'EXHIBITION', 'STAGE-SET'], notes: 'Prospect. Verify current public contact route before activation.' }),

  seed({ slug: 'secret-cinema', company_name: 'Secret Cinema', contact_name: 'Contact team to verify', phone: null, website: 'https://www.secretcinema.org/', country: 'UK', source_url: 'https://www.secretcinema.org/', postcode: null, buyer_type: 'Immersive entertainment / event worlds', tags: ['IMMERSIVE', 'SCENIC', 'BAR', 'PHOTO-MOMENT', 'STAGE-SET', 'THEMING'], notes: 'Prospect. Verify current commercial contact route before activation.' }),
  seed({ slug: 'punchdrunk', company_name: 'Punchdrunk', contact_name: 'Contact team to verify', phone: null, website: 'https://www.punchdrunk.com/', country: 'UK', source_url: 'https://www.punchdrunk.com/', postcode: null, buyer_type: 'Immersive theatre / scenic environments', tags: ['IMMERSIVE', 'SCENIC', 'THEATRE', 'STAGE-SET', 'INDOOR'], notes: 'Prospect. Verify current commercial contact route before activation.' }),
  seed({ slug: 'immersive-everywhere', company_name: 'Immersive Everywhere', contact_name: 'Contact team to verify', phone: null, website: 'https://immersiveeverywhere.com/', country: 'UK', source_url: 'https://immersiveeverywhere.com/', postcode: null, buyer_type: 'Immersive entertainment producer', tags: ['IMMERSIVE', 'SCENIC', 'BAR', 'PHOTO-MOMENT', 'THEMING'], notes: 'Prospect. Verify current public contact route before activation.' }),
  seed({ slug: 'bompas-parr', company_name: 'Bompas & Parr', contact_name: 'Contact team to verify', phone: null, website: 'https://bompasandparr.com/', country: 'UK', source_url: 'https://bompasandparr.com/', postcode: null, buyer_type: 'Experiential / brand installation studio', tags: ['IMMERSIVE', 'RETAIL', 'PHOTO-MOMENT', 'SCENIC', 'THEMING'], notes: 'Prospect. Verify current public contact route before activation.' }),
  seed({ slug: 'bearded-kitten', company_name: 'Bearded Kitten', contact_name: 'Contact team to verify', phone: null, website: 'https://beardedkitten.com/', country: 'UK', source_url: 'https://beardedkitten.com/', postcode: null, buyer_type: 'Experiential / event production', tags: ['IMMERSIVE', 'FESTIVAL', 'BAR', 'PHOTO-MOMENT', 'THEMING'], notes: 'Prospect. Verify current public contact route before activation.' }),
  seed({ slug: 'little-lion-entertainment', company_name: 'Little Lion Entertainment', contact_name: 'Contact team to verify', phone: null, website: 'https://www.littlelionentertainment.com/', country: 'UK', source_url: 'https://www.littlelionentertainment.com/', postcode: null, buyer_type: 'Immersive experience operator', tags: ['IMMERSIVE', 'ESCAPE-ROOM', 'SCENIC', 'THEMING', 'PHOTO-MOMENT'], notes: 'Prospect. Verify current public contact route before activation.' }),
  seed({ slug: 'escape-hunt-uk', company_name: 'Escape Hunt UK', contact_name: 'Contact team to verify', phone: null, website: 'https://escapehunt.com/uk/', country: 'UK', source_url: 'https://escapehunt.com/uk/', postcode: null, buyer_type: 'Escape room / immersive venue operator', tags: ['ESCAPE-ROOM', 'IMMERSIVE', 'SCENIC', 'INDOOR', 'THEMING'], notes: 'Prospect. Verify B2B/contact route before activation.' }),
  seed({ slug: 'cluequest', company_name: 'ClueQuest', contact_name: 'Contact team to verify', phone: null, website: 'https://cluequest.co.uk/', country: 'UK', source_url: 'https://cluequest.co.uk/', postcode: null, buyer_type: 'Escape room / immersive venue operator', tags: ['ESCAPE-ROOM', 'IMMERSIVE', 'SCENIC', 'INDOOR'], notes: 'Prospect. Verify B2B/contact route before activation.' }),

  seed({ slug: 'nimlok-uk', company_name: 'Nimlok UK', contact_name: 'Contact team to verify', phone: null, website: 'https://www.nimlok.co.uk/', country: 'UK', source_url: 'https://www.nimlok.co.uk/', postcode: null, buyer_type: 'Exhibition stand / display systems', tags: ['EXHIBITION', 'RETAIL', 'SCENIC', 'LED-SCREEN', 'CIRCULAR'], notes: 'Prospect. Verify current public contact route before activation.' }),
  seed({ slug: 'quadrant2design', company_name: 'Quadrant2Design', contact_name: 'Contact team to verify', phone: null, website: 'https://www.quadrant2design.com/', country: 'UK', source_url: 'https://www.quadrant2design.com/', postcode: null, buyer_type: 'Exhibition stand design / build', tags: ['EXHIBITION', 'RETAIL', 'SCENIC', 'CIRCULAR'], notes: 'Prospect. Verify current public contact route before activation.' }),
  seed({ slug: 'skyline-whitespace', company_name: 'Skyline Whitespace', contact_name: 'Contact team to verify', phone: null, website: 'https://skylinewhitespace.com/', country: 'UK', source_url: 'https://skylinewhitespace.com/', postcode: null, buyer_type: 'Exhibition stand / event display', tags: ['EXHIBITION', 'RETAIL', 'SCENIC', 'CIRCULAR', 'LED-SCREEN'], notes: 'Prospect. Verify current public contact route before activation.' }),
  seed({ slug: 'unibox', company_name: 'Unibox', contact_name: 'Contact team to verify', phone: null, website: 'https://www.unibox.co.uk/', country: 'UK', source_url: 'https://www.unibox.co.uk/', postcode: null, buyer_type: 'Exhibition / retail display / lighting', tags: ['EXHIBITION', 'RETAIL', 'LIGHTING', 'LED-SCREEN', 'CIRCULAR'], notes: 'Prospect. Verify current public contact route before activation.' }),
  seed({ slug: 'octink', company_name: 'Octink', contact_name: 'Contact team to verify', phone: null, website: 'https://www.octink.com/', country: 'UK', source_url: 'https://www.octink.com/', postcode: null, buyer_type: 'Display graphics / exhibitions / interiors', tags: ['EXHIBITION', 'RETAIL', 'SCENIC', 'CIRCULAR'], notes: 'Prospect. Verify current public contact route before activation.' }),

  seed({ slug: 'scruffy-dog-creative-group', company_name: 'Scruffy Dog Creative Group', contact_name: 'Contact team to verify', phone: null, website: 'https://www.scruffydogltd.com/', country: 'UK', source_url: 'https://www.scruffydogltd.com/', postcode: null, buyer_type: 'Themed attraction / scenic fabrication', tags: ['ATTRACTION', 'THEMING', 'SCENIC', 'IMMERSIVE', 'PROP-BIG'], notes: 'Prospect. Verify current commercial contact route before activation.' }),
  seed({ slug: 'sarner-international', company_name: 'Sarner International', contact_name: 'Contact team to verify', phone: null, website: 'https://www.sarner.com/', country: 'UK', source_url: 'https://www.sarner.com/', postcode: null, buyer_type: 'Attraction / museum / themed experience design', tags: ['ATTRACTION', 'IMMERSIVE', 'SCENIC', 'THEMING', 'EXHIBITION'], notes: 'Prospect. Verify current commercial contact route before activation.' }),
  seed({ slug: 'katapult', company_name: 'Katapult', contact_name: 'Contact team to verify', phone: null, website: 'https://www.katapult.co.uk/', country: 'UK', source_url: 'https://www.katapult.co.uk/', postcode: null, buyer_type: 'Themed attraction / experience design', tags: ['ATTRACTION', 'IMMERSIVE', 'THEMING', 'SCENIC', 'PHOTO-MOMENT'], notes: 'Prospect. Verify current commercial contact route before activation.' }),
  seed({ slug: 'merlin-magic-making', company_name: 'Merlin Magic Making', contact_name: 'Contact team to verify', phone: null, website: 'https://www.merlinentertainments.biz/', country: 'UK', source_url: 'https://www.merlinentertainments.biz/', postcode: null, buyer_type: 'Attractions / themed entertainment', tags: ['ATTRACTION', 'THEMING', 'SCENIC', 'PROP-BIG', 'IMMERSIVE'], notes: 'Prospect. Strategic buyer group. Verify correct Merlin procurement/contact route before activation.' }),

  seed({ slug: 'stageco', company_name: 'Stageco', contact_name: 'Hedwig De Meyer / Stageco Worldwide', email: 'info@stageco.com', phone: '+32 16 60 84 71', website: 'https://www.stageco.com/', country: 'Belgium / EU / UK', source_url: 'https://www.stageco.com/', postcode: 'Tildonk, Belgium', buyer_type: 'International staging / temporary structures', tags: ['EU', 'STAGE-SET', 'FESTIVAL', 'OUTDOOR', 'TEMPORARY-STRUCTURE', 'SCENIC'], notes: 'Verified official homepage lists Stageco Worldwide email/phone and Belgium address. Strong EU/UK route for stages, temporary structures, mobile venues and large structures.' }),
  seed({ slug: 'pp-projects', company_name: 'P&P Projects', contact_name: 'P&P Projects contact team', email: 'info@ppprojects.com', phone: '+31 493 694 511', website: 'https://www.ppprojects.com/', country: 'Netherlands / EU', source_url: 'https://www.ppprojects.com/projects/', postcode: 'Someren, Netherlands', buyer_type: 'Leisure theming / scenery / props / animatronics', tags: ['EU', 'THEMING', 'SCENIC', 'ATTRACTION', 'IMMERSIVE', 'PROP-BIG', 'MUSEUM'], notes: 'Verified official site footer lists email, phone and Netherlands address. Strong English-friendly EU buyer for leisure/themed/immersive assets.' }),
  seed({ slug: 'eca2', company_name: 'ECA2', contact_name: 'Jean-Christophe Canizares / ECA2 Paris', email: 'paris@eca2.com', phone: '+33 1 83 75 80 80', website: 'https://www.eca2.com/', country: 'France / EU', source_url: 'https://www.eca2.com/contact/', postcode: 'Levallois-Perret, France', buyer_type: 'Spectacular experiences / multimedia shows / ceremonies', tags: ['EU', 'ATTRACTION', 'IMMERSIVE', 'SCENIC', 'SPECIAL-EFFECTS', 'SHOW-CONTROL'], notes: 'Verified official contact page lists Paris email/phone and contact form. Best route is Paris office for Europe & Americas.' }),
  seed({ slug: 'nussli', company_name: 'NUSSLI', contact_name: 'Andy Böckli / NUSSLI contact team', phone: null, website: 'https://www.nussli.com/en/', country: 'Switzerland / EU route', source_url: 'https://www.nussli.com/en/contact/', postcode: 'Hüttwilen, Switzerland', buyer_type: 'Temporary event structures / pavilions / stages / museums', tags: ['EU', 'STAGE-SET', 'TEMPORARY-STRUCTURE', 'EXHIBITION', 'MUSEUM', 'PAVILION'], notes: 'Official site has English contact route and head office address. No public email/phone captured in this pass; contact form route is the safe English entry point.' }),
  seed({ slug: 'tinker-imagineers', company_name: 'Tinker imagineers', contact_name: 'Contact team to verify', phone: null, website: 'https://tinker.nl/', country: 'Netherlands / EU', source_url: 'https://tinker.nl/', postcode: null, buyer_type: 'Experience design / museums / brand experiences', tags: ['EU', 'IMMERSIVE', 'MUSEUM', 'EXHIBITION', 'SCENIC', 'THEMING'], notes: 'EU prospect added for English-friendly experience/museum route. Verify contact details before activation.' }),
  seed({ slug: 'jora-vision', company_name: 'Jora Vision', contact_name: 'Contact team to verify', phone: null, website: 'https://www.joravision.com/', country: 'Netherlands / EU', source_url: 'https://www.joravision.com/', postcode: null, buyer_type: 'Attraction design / scenic production / themed entertainment', tags: ['EU', 'ATTRACTION', 'THEMING', 'SCENIC', 'IMMERSIVE', 'PROP-BIG'], notes: 'EU prospect added for themed attraction/scenic production route. Verify contact details before activation.' }),
  seed({ slug: 'leisure-expert-group', company_name: 'Leisure Expert Group', contact_name: 'Contact team to verify', phone: null, website: 'https://www.leisureexpertgroup.com/', country: 'Netherlands / EU', source_url: 'https://www.leisureexpertgroup.com/', postcode: null, buyer_type: 'Leisure design / attraction masterplanning / immersive', tags: ['EU', 'ATTRACTION', 'IMMERSIVE', 'THEMING', 'MUSEUM'], notes: 'EU prospect added for attraction/experience strategy route. Verify contact details before activation.' }),
  seed({ slug: 'kraftwerk-living-technologies', company_name: 'Kraftwerk Living Technologies', contact_name: 'Contact team to verify', phone: null, website: 'https://www.kraftwerk.at/', country: 'Austria / EU', source_url: 'https://www.kraftwerk.at/', postcode: null, buyer_type: 'Integrated media technology / attractions / immersive AV', tags: ['EU', 'AV-LIGHT', 'IMMERSIVE', 'LED-SCREEN', 'SHOW-CONTROL', 'ATTRACTION'], notes: 'EU prospect added for immersive AV/show technology route. Verify contact details before activation.' }),
  seed({ slug: 'facts-and-fiction', company_name: 'facts and fiction', contact_name: 'Contact team to verify', phone: null, website: 'https://www.factsfiction.de/', country: 'Germany / EU', source_url: 'https://www.factsfiction.de/', postcode: null, buyer_type: 'Brand experience / museums / exhibitions', tags: ['EU', 'EXHIBITION', 'MUSEUM', 'IMMERSIVE', 'SCENIC', 'RETAIL'], notes: 'EU prospect added for German exhibition/brand experience route. Verify contact details before activation.' }),
  seed({ slug: 'cercle', company_name: 'Cercle', contact_name: 'Derek Barbolla / Cercle team', phone: null, website: 'https://cercle.io/', country: 'France / EU', source_url: 'https://cercle.io/', postcode: 'Paris, France', buyer_type: 'Music events / festival production / immersive concert formats', tags: ['EU', 'FESTIVAL', 'IMMERSIVE', 'STAGE-SET', 'SPECIAL-EVENT'], notes: 'EU prospect for high-profile music/experience formats. Public source identifies Paris HQ and founder; verify current commercial contact route before activation.' })
];
