export type ProspectBuyerSeed = {
  company_name: string;
  contact_name?: string | null;
  email: string;
  phone?: string | null;
  postcode?: string | null;
  buyer_type: string;
  tags: string[];
  notes: string;
};

function prospectEmail(slug: string) {
  return `prospect+${slug}@craftist.local`;
}

export const PROSPECT_BUYERS: ProspectBuyerSeed[] = [
  {
    company_name: 'Event Prop Hire',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('event-prop-hire'),
    postcode: null,
    buyer_type: 'Prop hire / event theming',
    tags: ['PROSPECT', 'PROP-BIG', 'SCENIC', 'BAR', 'FESTIVAL', 'RETAIL', 'PHOTO-MOMENT'],
    notes: 'Prospect preload. Verify buyer contact before activation. Strong fit for large props, bars, themed scenic builds and brand/event decor.'
  },
  {
    company_name: 'Theme Traders',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('theme-traders'),
    postcode: null,
    buyer_type: 'Theming / event production / props',
    tags: ['PROSPECT', 'THEMING', 'PROP-BIG', 'SCENIC', 'FESTIVAL', 'IMMERSIVE', 'RETAIL'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for high-impact themed assets, festival props and event dressing.'
  },
  {
    company_name: 'The Prop Factory',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('the-prop-factory'),
    postcode: null,
    buyer_type: 'Prop hire / themed decor',
    tags: ['PROSPECT', 'PROP-BIG', 'SCENIC', 'BAR', 'PHOTO-MOMENT', 'SEASONAL', 'RETAIL'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential buyer for unusual one-off props, scenic features and themed installations.'
  },
  {
    company_name: 'Stockyard Props',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('stockyard-props'),
    postcode: null,
    buyer_type: 'Film / TV / event prop hire',
    tags: ['PROSPECT', 'PROP-BIG', 'SCENIC', 'FILM-TV', 'IMMERSIVE', 'RETAIL'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for prop resale, scenic stock and production-ready display pieces.'
  },
  {
    company_name: 'London Prop Hire',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('london-prop-hire'),
    postcode: null,
    buyer_type: 'Prop hire / production supply',
    tags: ['PROSPECT', 'PROP-BIG', 'SCENIC', 'FILM-TV', 'BAR', 'PHOTO-MOMENT'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for high-quality props, set pieces and brand/event display assets.'
  },
  {
    company_name: 'Farley Prop Hire',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('farley-prop-hire'),
    postcode: null,
    buyer_type: 'Prop hire / production assets',
    tags: ['PROSPECT', 'PROP-BIG', 'SCENIC', 'FILM-TV', 'INDOOR'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for production props, scenic objects and reusable display pieces.'
  },
  {
    company_name: 'Scenery Salvage',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('scenery-salvage'),
    postcode: null,
    buyer_type: 'Scenic reuse / salvage / circular stock',
    tags: ['PROSPECT', 'CIRCULAR', 'SCENIC', 'SALVAGE', 'PROP-BIG', 'STAGE-SET'],
    notes: 'Prospect preload. Verify buyer contact before activation. Circular fallback prospect for scenic elements and reusable set materials.'
  },
  {
    company_name: 'White Light',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('white-light'),
    postcode: null,
    buyer_type: 'Lighting / AV / event production',
    tags: ['PROSPECT', 'AV-LIGHT', 'LIGHTING', 'IMMERSIVE', 'EXHIBITION', 'STAGE-SET'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for lighting-heavy assets, stage/event systems and production technology.'
  },
  {
    company_name: 'PRG UK',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('prg-uk'),
    postcode: null,
    buyer_type: 'Production technology / AV / lighting',
    tags: ['PROSPECT', 'AV-LIGHT', 'LIGHTING', 'LED-SCREEN', 'STAGE-SET', 'EXHIBITION'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for lighting, LED, screens and technical production assets.'
  },
  {
    company_name: 'Adlib',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('adlib'),
    postcode: null,
    buyer_type: 'Audio / lighting / video production',
    tags: ['PROSPECT', 'AV-LIGHT', 'LIGHTING', 'LED-SCREEN', 'FESTIVAL', 'STAGE-SET'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for AV, stage, lighting and event production stock.'
  },
  {
    company_name: 'Entec Live',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('entec-live'),
    postcode: null,
    buyer_type: 'Live event production / lighting / sound',
    tags: ['PROSPECT', 'AV-LIGHT', 'LIGHTING', 'FESTIVAL', 'STAGE-SET', 'LED-SCREEN'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for production-grade stage, lighting and AV assets.'
  },
  {
    company_name: 'Stage Sound Services',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('stage-sound-services'),
    postcode: null,
    buyer_type: 'Theatre / event audio and production services',
    tags: ['PROSPECT', 'AV-LIGHT', 'STAGE-SET', 'IMMERSIVE', 'THEATRE', 'LIGHTING'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for theatre/event technical production assets and immersive spaces.'
  },
  {
    company_name: 'SFL Group',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('sfl-group'),
    postcode: null,
    buyer_type: 'Sound / lighting / video production',
    tags: ['PROSPECT', 'AV-LIGHT', 'LIGHTING', 'LED-SCREEN', 'STAGE-SET', 'EXHIBITION'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for AV, screens, lighting and event technical stock.'
  },
  {
    company_name: 'Pearce Hire',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('pearce-hire'),
    postcode: null,
    buyer_type: 'Event production / power / lighting',
    tags: ['PROSPECT', 'AV-LIGHT', 'LIGHTING', 'FESTIVAL', 'OUTDOOR', 'STAGE-SET'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for outdoor/event production assets and technical systems.'
  },
  {
    company_name: 'TSL Lighting',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('tsl-lighting'),
    postcode: null,
    buyer_type: 'Lighting hire / event production',
    tags: ['PROSPECT', 'AV-LIGHT', 'LIGHTING', 'STAGE-SET', 'EXHIBITION', 'IMMERSIVE'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for lighting-heavy assets and event production stock.'
  },
  {
    company_name: 'Production AV',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('production-av'),
    postcode: null,
    buyer_type: 'AV / video / live production',
    tags: ['PROSPECT', 'AV-LIGHT', 'LED-SCREEN', 'LIGHTING', 'EXHIBITION', 'STAGE-SET'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for screens, video, AV and event production stock.'
  },
  {
    company_name: 'Secret Cinema',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('secret-cinema'),
    postcode: null,
    buyer_type: 'Immersive entertainment / event worlds',
    tags: ['PROSPECT', 'IMMERSIVE', 'SCENIC', 'BAR', 'PHOTO-MOMENT', 'STAGE-SET', 'THEMING'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for large immersive set pieces, bars and themed environments.'
  },
  {
    company_name: 'Punchdrunk',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('punchdrunk'),
    postcode: null,
    buyer_type: 'Immersive theatre / scenic environments',
    tags: ['PROSPECT', 'IMMERSIVE', 'SCENIC', 'THEATRE', 'STAGE-SET', 'INDOOR'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for immersive scenic environments and theatrical set assets.'
  },
  {
    company_name: 'Immersive Everywhere',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('immersive-everywhere'),
    postcode: null,
    buyer_type: 'Immersive entertainment producer',
    tags: ['PROSPECT', 'IMMERSIVE', 'SCENIC', 'BAR', 'PHOTO-MOMENT', 'THEMING'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for pop-up worlds, immersive theatre, scenic bars and photo moments.'
  },
  {
    company_name: 'Bompas & Parr',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('bompas-parr'),
    postcode: null,
    buyer_type: 'Experiential / brand installation studio',
    tags: ['PROSPECT', 'IMMERSIVE', 'RETAIL', 'PHOTO-MOMENT', 'SCENIC', 'THEMING'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for brand worlds, unusual installations and high-impact scenic pieces.'
  },
  {
    company_name: 'Bearded Kitten',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('bearded-kitten'),
    postcode: null,
    buyer_type: 'Experiential / event production',
    tags: ['PROSPECT', 'IMMERSIVE', 'FESTIVAL', 'BAR', 'PHOTO-MOMENT', 'THEMING'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for playful event builds, immersive assets and festival/brand props.'
  },
  {
    company_name: 'Little Lion Entertainment',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('little-lion-entertainment'),
    postcode: null,
    buyer_type: 'Immersive experience operator',
    tags: ['PROSPECT', 'IMMERSIVE', 'ESCAPE-ROOM', 'SCENIC', 'THEMING', 'PHOTO-MOMENT'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for immersive and escape-style scenic assets.'
  },
  {
    company_name: 'Escape Hunt UK',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('escape-hunt-uk'),
    postcode: null,
    buyer_type: 'Escape room / immersive venue operator',
    tags: ['PROSPECT', 'ESCAPE-ROOM', 'IMMERSIVE', 'SCENIC', 'INDOOR', 'THEMING'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for themed rooms, set pieces and immersive scenic assets.'
  },
  {
    company_name: 'ClueQuest',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('cluequest'),
    postcode: null,
    buyer_type: 'Escape room / immersive venue operator',
    tags: ['PROSPECT', 'ESCAPE-ROOM', 'IMMERSIVE', 'SCENIC', 'INDOOR'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for immersive rooms, scenic props and themed set dressing.'
  },
  {
    company_name: 'Nimlok UK',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('nimlok-uk'),
    postcode: null,
    buyer_type: 'Exhibition stand / display systems',
    tags: ['PROSPECT', 'EXHIBITION', 'RETAIL', 'SCENIC', 'LED-SCREEN', 'CIRCULAR'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for exhibition display components, scenic display stock and reusable structures.'
  },
  {
    company_name: 'Quadrant2Design',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('quadrant2design'),
    postcode: null,
    buyer_type: 'Exhibition stand design / build',
    tags: ['PROSPECT', 'EXHIBITION', 'RETAIL', 'SCENIC', 'CIRCULAR'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for reusable stand pieces, display structures and scenic exhibition stock.'
  },
  {
    company_name: 'Skyline Whitespace',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('skyline-whitespace'),
    postcode: null,
    buyer_type: 'Exhibition stand / event display',
    tags: ['PROSPECT', 'EXHIBITION', 'RETAIL', 'SCENIC', 'CIRCULAR', 'LED-SCREEN'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for reusable display stock, exhibition assets and scenic components.'
  },
  {
    company_name: 'Unibox',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('unibox'),
    postcode: null,
    buyer_type: 'Exhibition / retail display / lighting',
    tags: ['PROSPECT', 'EXHIBITION', 'RETAIL', 'LIGHTING', 'LED-SCREEN', 'CIRCULAR'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for illuminated displays, exhibition assets and retail installation stock.'
  },
  {
    company_name: 'Octink',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('octink'),
    postcode: null,
    buyer_type: 'Display graphics / exhibitions / interiors',
    tags: ['PROSPECT', 'EXHIBITION', 'RETAIL', 'SCENIC', 'CIRCULAR'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for display/interior assets and reusable exhibition pieces.'
  },
  {
    company_name: 'Scruffy Dog Creative Group',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('scruffy-dog-creative-group'),
    postcode: null,
    buyer_type: 'Themed attraction / scenic fabrication',
    tags: ['PROSPECT', 'ATTRACTION', 'THEMING', 'SCENIC', 'IMMERSIVE', 'PROP-BIG'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for themed attraction set pieces and large scenic builds.'
  },
  {
    company_name: 'Sarner International',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('sarner-international'),
    postcode: null,
    buyer_type: 'Attraction / museum / themed experience design',
    tags: ['PROSPECT', 'ATTRACTION', 'IMMERSIVE', 'SCENIC', 'THEMING', 'EXHIBITION'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for themed experience assets, attraction environments and scenic display pieces.'
  },
  {
    company_name: 'Katapult',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('katapult'),
    postcode: null,
    buyer_type: 'Themed attraction / experience design',
    tags: ['PROSPECT', 'ATTRACTION', 'IMMERSIVE', 'THEMING', 'SCENIC', 'PHOTO-MOMENT'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential fit for attraction props, scenic environments and experiential assets.'
  },
  {
    company_name: 'Merlin Magic Making',
    contact_name: 'Prospect contact to verify',
    email: prospectEmail('merlin-magic-making'),
    postcode: null,
    buyer_type: 'Attractions / themed entertainment',
    tags: ['PROSPECT', 'ATTRACTION', 'THEMING', 'SCENIC', 'PROP-BIG', 'IMMERSIVE'],
    notes: 'Prospect preload. Verify buyer contact before activation. Potential strategic prospect for attraction-ready scenic assets and unusual one-off builds.'
  }
];
