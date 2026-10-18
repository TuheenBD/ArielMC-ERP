import {
  MarketingCampaign,
  DigitalCollateral,
  TradeShowExhibition,
  BrandIdentityAsset,
  InboundGrowthAnalytics
} from '@/types/marketing';

export const INITIAL_MARKETING_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'camp-001',
    code: 'AMC-MKT-26-EU01',
    title: 'European Ethical Living & Artisanal Tableware 2027',
    tagline: 'Positioning Bangladeshi Fine Bone China & Terracotta for Nordic & Central EU Retailers',
    targetMarkets: ['EU', 'UK'],
    targetSectors: ['CERAMICS', 'TERRACOTTA'],
    status: 'ACTIVE',
    startDate: '2026-10-01',
    endDate: '2027-02-28',
    budget: {
      currency: 'EUR',
      planned: 28500,
      spent: 12400,
    },
    kpis: {
      targetLeads: 65,
      leadsAcquired: 42,
      sampleOrdersGenerated: 18,
      estimatedPipelineUsd: 480000,
      roiPercent: 320,
    },
    channels: [
      'Ambiente Frankfurt Trade Showcase',
      'Curated Digital Lookbook Syndication',
      'VIP Buyer Tasting & Tableware Sample Kit',
      'Direct Executive Procurement Outreach'
    ],
    keyDeliverables: [
      '2027 Fine Tableware & Glaze Lookbook (PDF & Physical Swatch Box)',
      'Lead & Cadmium FDA/LFGB Statutory Certificates Pack',
      '38-Piece Hospitality & Retail Table Setting Spec Dossier',
      'High-Speed 4K Pottery Wheel Video Showcase'
    ],
    featuredCollateralIds: ['col-cer-01', 'col-ter-01'],
    manager: 'Tuheen Hassan (Chief Commercial Officer)',
    stationCode: 'ARIEL_EU',
    notes: 'Strong early engagement from German and Scandinavian home decor chains; sample dispatch prioritized via DHL Express DDP.',
  },
  {
    id: 'camp-002',
    code: 'AMC-MKT-26-UK02',
    title: 'UK Sustainable High-Street Jute Transition Roadshow',
    tagline: 'Replacing Synthetic Poly Bags with 100% Biodegradable Bengal Golden Jute Totes',
    targetMarkets: ['UK'],
    targetSectors: ['JUTE'],
    status: 'ACTIVE',
    startDate: '2026-09-15',
    endDate: '2027-01-31',
    budget: {
      currency: 'GBP',
      planned: 22000,
      spent: 16800,
    },
    kpis: {
      targetLeads: 50,
      leadsAcquired: 38,
      sampleOrdersGenerated: 24,
      estimatedPipelineUsd: 390000,
      roiPercent: 285,
    },
    channels: [
      'Spring Fair Birmingham Pre-Registration VIP Suite',
      'Direct Sustainability Officer Briefings (M&S, John Lewis, Sainsbury)',
      'Circular Economy Biodegradability Testing Whitepaper',
      'London 3PL Rapid Prototype Delivery'
    ],
    keyDeliverables: [
      'Golden Jute Wholesale Line-Sheet & MOQ Pricing Matrix',
      'OEKO-TEX & Biodegradable Lamination Certification Pack',
      'Pantone Custom Dye Swatch Book',
      'Retail Tote Handle Tensile Strength Test Data'
    ],
    featuredCollateralIds: ['col-jut-01', 'col-jut-02'],
    manager: 'Claire Sterling (UK Trade Director)',
    stationCode: 'ARIEL_UK',
    notes: 'Targeting UK single-use plastics levy compliance; strong demand for 380 GSM laminated shoppers.',
  },
  {
    id: 'camp-003',
    code: 'AMC-MKT-26-US03',
    title: 'North American Heritage Leather Goods & Private Label Outreach',
    tagline: 'LWG Gold Certified Full-Grain Cowhide Bags & Travel Essentials for US Brands',
    targetMarkets: ['USA'],
    targetSectors: ['LEATHER'],
    status: 'ACTIVE',
    startDate: '2026-10-10',
    endDate: '2027-03-31',
    budget: {
      currency: 'USD',
      planned: 35000,
      spent: 14200,
    },
    kpis: {
      targetLeads: 60,
      leadsAcquired: 31,
      sampleOrdersGenerated: 14,
      estimatedPipelineUsd: 620000,
      roiPercent: 340,
    },
    channels: [
      'NY NOW Sourcing Showcase & B2B Appointments',
      'Virtual 3D Sample Room Walkthroughs',
      'Savar Artisan Craft Documentary Clip',
      'California Prop 65 Chemical Audit Guarantee'
    ],
    keyDeliverables: [
      'Handcrafted Leathergoods Master Lookbook (AW26/SS27)',
      'LWG Audit Certificate & Chemical Pass Dossier (Chrome-free & Vegetable Tanned)',
      'Custom Hardware & Embossing Technical Die-line Portfolio',
      'US FBA & Delaware 3PL Rapid Replenishment Model'
    ],
    featuredCollateralIds: ['col-lea-01', 'col-lea-02'],
    manager: 'Marcus Vance (US Brand Operations Lead)',
    stationCode: 'ARIEL_US',
    notes: 'Focus on independent lifestyle brands seeking sustainable alternatives to Chinese leather tanneries.',
  },
  {
    id: 'camp-004',
    code: 'AMC-MKT-27-AU04',
    title: 'Australia & New Zealand Coastal Resort & Home Linens Launch',
    tagline: 'Waffle Weave, 400TC Percale & Organic Cotton Tablecloths for Oceanic Hospitality',
    targetMarkets: ['AU'],
    targetSectors: ['HOME_TEXTILES'],
    status: 'SCHEDULED',
    startDate: '2026-12-01',
    endDate: '2027-05-31',
    budget: {
      currency: 'AUD',
      planned: 24000,
      spent: 3100,
    },
    kpis: {
      targetLeads: 40,
      leadsAcquired: 9,
      sampleOrdersGenerated: 4,
      estimatedPipelineUsd: 210000,
      roiPercent: 190,
    },
    channels: [
      'Reed Gift Fairs Melbourne Exhibition',
      'Sydney Hotel & Resort Sourcing Direct Email Campaign',
      'Australian Quarantine (BICON) Pre-Clearance Guarantee',
      'GOTS Organic & Sedex Ethical Audit Distribution'
    ],
    keyDeliverables: [
      'Coastal & Natural Fiber Home Textile Spec Book',
      'Fabric Weight (GSM) & Yarn Dye Shrinkage Warranty Sheet',
      'Pre-washed Stoneware & Linen Coordinates Lookbook'
    ],
    featuredCollateralIds: ['col-tex-01'],
    manager: 'Liam O’Connor (AU Operations Partner)',
    stationCode: 'ARIEL_AU',
    notes: 'Pre-show outreach commencing November 2026 for February 2027 exhibition.',
  },
  {
    id: 'camp-005',
    code: 'AMC-MKT-26-GL05',
    title: 'Global Sovereign Station Trust & Zero-Intermediary B2B Campaign',
    tagline: 'Direct Sourcing from Dhaka Mills with In-Country Legal Invoicing in London, NY, Frankfurt & Sydney',
    targetMarkets: ['UK', 'USA', 'EU', 'AU'],
    targetSectors: ['ALL'],
    status: 'ACTIVE',
    startDate: '2026-08-01',
    endDate: '2027-08-31',
    budget: {
      currency: 'USD',
      planned: 45000,
      spent: 23500,
    },
    kpis: {
      targetLeads: 120,
      leadsAcquired: 76,
      sampleOrdersGenerated: 49,
      estimatedPipelineUsd: 1150000,
      roiPercent: 410,
    },
    channels: [
      'ArielMC Global Corporate Portal (www.arielmc.com)',
      'LinkedIn Institutional Thought Leadership Series',
      'Direct In-Country VAT/EIN Sovereign Contracting Guarantee',
      'Quarterly B2B Trade Intelligence Dossier'
    ],
    keyDeliverables: [
      'ArielMC Master Corporate Compendium & Capabilities Guide',
      'Station Statutory Credentials & Compliance Dossiers Pack',
      'End-to-End AQL 2.5 Quality Inspection Protocol',
      'Dual-Hub Logistics & 3PL Buffer Inventory Whitepaper'
    ],
    featuredCollateralIds: ['col-corp-01', 'col-corp-02'],
    manager: 'Syed Akramul Hassan (Founder & Managing Director)',
    stationCode: 'ARIEL_BD',
    notes: 'Primary overarching brand campaign reinforcing ArielMC as the premier transparent sourcing partner.',
  }
];

export const INITIAL_DIGITAL_COLLATERALS: DigitalCollateral[] = [
  {
    id: 'col-cer-01',
    code: 'AMC-LKB-CER-01',
    title: 'Fine Bone China & Ceramic Tableware Master Lookbook',
    subtitle: 'Institutional Export Collection: Reactive Glazes, Porcelain Dining & Modern Hospitality',
    category: 'LOOKBOOK',
    sector: 'CERAMICS',
    season: 'AW26 / SS27',
    coverImage: '/images/marketing/ceramic-catalogue-cover.jpg',
    pages: 48,
    fileSize: '24.6 MB',
    fileFormat: 'PDF',
    downloadCount: 382,
    viewsCount: 1420,
    lastUpdated: '2026-10-15',
    downloadUrl: '/docs/ArielMC_Ceramic_Master_Lookbook_2027.pdf',
    tags: ['Bone China', 'Porcelain', 'Reactive Glaze', 'Dinnerware', 'FDA Safe', 'Hospitality Grade'],
    targetAudience: 'Department Stores, Hotel Chains, Luxury Tableware Retailers',
    description: 'Complete high-definition showcase featuring our 38 dinnerware suites, microwave/dishwasher testing certifications, lead-cadmium leaching reports, and custom gift box packaging specs.',
    isPublished: true,
    previewPages: [
      { pageNumber: 1, title: 'Cover & Brand Philosophy', image: '/images/marketing/ceramic-catalogue-cover.jpg', caption: 'Front cover featuring our Athena Matte Black Dinner Suite' },
      { pageNumber: 2, title: 'Athena Reactive Glaze Series', image: '/images/marketing/ceramic-athena-hero.jpg', caption: 'High-fire reactive glaze stoneware plates, bowls and matching espresso cups' },
      { pageNumber: 3, title: 'Export Technical Specifications', image: '/images/marketing/ceramic-compendium.jpg', caption: 'Water absorption rates (<0.2%), thermal shock resistance & AQL testing metrics' },
      { pageNumber: 4, title: 'Retail Gift Box Die-Lines', image: '/images/marketing/vase-edit-catalog-cover.jpg', caption: 'FSC-certified drop-test approved multi-piece packaging designs' }
    ]
  },
  {
    id: 'col-lea-01',
    code: 'AMC-LKB-LEA-01',
    title: 'Artisan Full-Grain Leathergoods & Travel Accessories',
    subtitle: 'Crafted in Savar, Bangladesh — 100% LWG Audited Full-Grain Cowhide & Buffalo Leather',
    category: 'LOOKBOOK',
    sector: 'LEATHER',
    season: 'AW26 / SS27',
    coverImage: '/images/marketing/fashionable-bag-catalog-cover.jpg',
    pages: 36,
    fileSize: '19.8 MB',
    fileFormat: 'PDF',
    downloadCount: 419,
    viewsCount: 1650,
    lastUpdated: '2026-10-12',
    downloadUrl: '/docs/ArielMC_Leathergoods_Master_Lookbook_2027.pdf',
    tags: ['LWG Gold', 'Full-Grain Cowhide', 'Chrome-Free', 'Weekender Bags', 'Wallets', 'YKK Brass Hardware'],
    targetAudience: 'Fashion Brands, Luggage Retailers, Corporate Gifting Importers',
    description: 'Features weekenders, messenger bags, tech sleeves, and minimalist wallets crafted from premium vegetable-tanned hides. Includes hardware grades, edge dye specs, and REACH chemical test compliance.',
    isPublished: true,
    previewPages: [
      { pageNumber: 1, title: 'Cover: Signature Weekender', image: '/images/marketing/fashionable-bag-catalog-cover.jpg', caption: 'Cognac pull-up leather weekender with reinforced gussets' },
      { pageNumber: 2, title: 'Tannery Craftsmanship & LWG Standards', image: '/images/marketing/leather-craft-artisan.jpg', caption: 'Master leather artisan hand-stitching with German Serafil thread' },
      { pageNumber: 3, title: 'Grain Swatches & Color Fastness', image: '/images/marketing/leather-grain-swatch.jpg', caption: 'Natural pebble, smooth pull-up, and oil-wax leather finishes' },
      { pageNumber: 4, title: 'Dimensions & Capacity Tech Specs', image: '/images/marketing/leather-compendium.jpg', caption: 'Laptop compartment padding and stress-test data' }
    ]
  },
  {
    id: 'col-jut-01',
    code: 'AMC-LKB-JUT-01',
    title: 'Golden Jute (Sonali Aash) Eco-Shopping & Lifestyle Collection',
    subtitle: '100% Natural River Heritage Fiber — Biodegradable Totes, Planters & Wine Sleeves',
    category: 'LOOKBOOK',
    sector: 'JUTE',
    season: 'Perennial Core 2026/27',
    coverImage: '/images/marketing/golden-jute-fiber.jpg',
    pages: 32,
    fileSize: '16.4 MB',
    fileFormat: 'PDF',
    downloadCount: 512,
    viewsCount: 1980,
    lastUpdated: '2026-10-14',
    downloadUrl: '/docs/ArielMC_Golden_Jute_Collection_2027.pdf',
    tags: ['Sonali Aash', 'Biodegradable', 'Zero-Plastic', 'Hessian', 'Sacking', 'OEKO-TEX Fastness'],
    targetAudience: 'Supermarkets, Organic Retailers, Eco Boutiques, Promotional Agencies',
    description: 'Bangladesh is the premier global producer of top-grade golden jute. This lookbook illustrates our water-resistant plant-based lamination, AZO-free botanical dyes, and reinforced cotton webbed handles.',
    isPublished: true,
    previewPages: [
      { pageNumber: 1, title: 'River Harvest & Natural Fiber', image: '/images/marketing/golden-jute-fiber.jpg', caption: 'Golden Jute fibers retting in Bengal rivers, ensuring silky luster' },
      { pageNumber: 2, title: 'High-Street Retail Shoppers', image: '/images/marketing/jute-index.jpg', caption: 'Standard 42x38x18cm gusseted supermarket tote with cane handles' },
      { pageNumber: 3, title: 'Weave Density & GSM Comparison', image: '/images/marketing/jute-compendium.jpg', caption: 'Detailed specifications across 14x15 Hessian vs 24x28 Juco blends' }
    ]
  },
  {
    id: 'col-ter-01',
    code: 'AMC-LKB-TER-01',
    title: 'Architectural Terracotta & Bengal Clay Pottery Lookbook',
    subtitle: 'Centuries-Old Clay Crafting: Terracotta Planters, Architectural Tiles & Decorative Vases',
    category: 'LOOKBOOK',
    sector: 'TERRACOTTA',
    season: 'AW26 / SS27',
    coverImage: '/images/marketing/terracotta-potter-wheel.jpg',
    pages: 28,
    fileSize: '14.2 MB',
    fileFormat: 'PDF',
    downloadCount: 245,
    viewsCount: 890,
    lastUpdated: '2026-10-08',
    downloadUrl: '/docs/ArielMC_Terracotta_Pottery_2027.pdf',
    tags: ['Bengal Clay', 'Terracotta', 'Hand-thrown', 'Frost Resistant', 'Natural Porosity'],
    targetAudience: 'Garden Centers, Interior Design Studios, Landscape Architects',
    description: 'Pure alluvial Bengal clay fired at 1050°C for exceptional durability and frost tolerance. Features traditional terracotta patina pots, urns, and custom architectural wall relief panels.',
    isPublished: true,
    previewPages: [
      { pageNumber: 1, title: 'The Potter’s Wheel in Dhamrai', image: '/images/marketing/terracotta-potter-wheel.jpg', caption: 'Generational master artisan throwing red terracotta clay' },
      { pageNumber: 2, title: 'Planters & Garden Pottery Range', image: '/images/marketing/terracotta-index.jpg', caption: 'Indoor/outdoor glazed and raw terracotta vessels' },
      { pageNumber: 3, title: 'Firing Curve & Durability Tests', image: '/images/marketing/terracotta-compendium.jpg', caption: 'Compression test curves and freeze-thaw laboratory reports' }
    ]
  },
  {
    id: 'col-tex-01',
    code: 'AMC-LKB-TEX-01',
    title: 'Ethical Home Linens, Tablecloths & Woven Loungewear',
    subtitle: 'GOTS Certified Organic Cottons, Percale Sheeting & Artisan Slub Wovens',
    category: 'LOOKBOOK',
    sector: 'HOME_TEXTILES',
    season: 'SS27 Preview',
    coverImage: '/images/marketing/textile-index.jpg',
    pages: 34,
    fileSize: '18.1 MB',
    fileFormat: 'PDF',
    downloadCount: 298,
    viewsCount: 1140,
    lastUpdated: '2026-10-11',
    downloadUrl: '/docs/ArielMC_Home_Textiles_2027.pdf',
    tags: ['GOTS Organic', '400TC Percale', 'Waffle Weave', 'Table Runners', 'Sedex Audited'],
    targetAudience: 'Home Decor Chains, Boutique Hotels, Linen Retailers',
    description: 'Sourced from BSCI and Sedex audited weaving units in Narsingdi and Gazipur. Covers bed linens, waffle throws, hemstitched linen napkins, and yarn-dyed kitchen coordinates.',
    isPublished: true,
    previewPages: [
      { pageNumber: 1, title: 'Natural Cotton Loom Weaving', image: '/images/marketing/textile-index.jpg', caption: 'Shuttleless air-jet looms running 100% GOTS certified combed yarn' },
      { pageNumber: 2, title: 'Bedding Sets & Thread Counts', image: '/images/marketing/textile-compendium.jpg', caption: 'Thread count comparison (300TC, 400TC, 600TC) and wash shrinkage' }
    ]
  },
  {
    id: 'col-corp-01',
    code: 'AMC-LKB-CORP-01',
    title: 'ArielMC Master Corporate Compendium & Capabilities Guide',
    subtitle: 'The 5 Sovereign Operating Stations, In-Country Invoicing & Bangladesh Sourcing Ecosystem',
    category: 'BRAND_GUIDELINE',
    sector: 'ALL',
    season: '2026/2027 Master Edition',
    coverImage: '/images/marketing/bangladesh-craft-hero.jpg',
    pages: 56,
    fileSize: '31.5 MB',
    fileFormat: 'PDF',
    downloadCount: 674,
    viewsCount: 2890,
    lastUpdated: '2026-10-16',
    downloadUrl: '/docs/ArielMC_Corporate_Compendium_2027.pdf',
    tags: ['Corporate Profile', '5 Sovereign Stations', 'Compliance Matrix', 'Dual-Hub Logistics', 'AQL 2.5'],
    targetAudience: 'Chief Procurement Officers, Corporate Sourcing Committees, Retail Buyers',
    description: 'The definitive ArielMC procurement dossier detailing our legal entities in Dhaka, London, Delaware, Frankfurt, and Sydney, factory compliance scorecards, and two-way order safeguards.',
    isPublished: true,
    previewPages: [
      { pageNumber: 1, title: 'ArielMC Corporate Mission & Heritage', image: '/images/marketing/bangladesh-craft-hero.jpg', caption: 'Bridging generational Bangladeshi craftsmanship with global retail excellence' },
      { pageNumber: 2, title: 'Multi-Station Invoicing Model', image: '/images/marketing/bangladesh-craftsmanship.png', caption: 'Zero currency risk: B2B buyers invoice through local sovereign subsidiaries' }
    ]
  }
];

export const INITIAL_TRADE_SHOWS: TradeShowExhibition[] = [
  {
    id: 'tshow-001',
    name: 'Ambiente Frankfurt 2027',
    edition: 'World’s Leading Consumer Goods Trade Fair',
    dates: 'February 12 – 16, 2027',
    startDate: '2027-02-12',
    endDate: '2027-02-16',
    venue: 'Messe Frankfurt',
    city: 'Frankfurt am Main',
    country: 'Germany',
    countryFlag: '🇩🇪',
    boothNumber: 'Hall 12.1, Stand D48 (Dining & Global Sourcing)',
    hall: 'Hall 12.1 — Table & Kitchen Trends',
    assignedStation: 'ARIEL_EU',
    focusSectors: ['CERAMICS', 'TERRACOTTA', 'HOME_TEXTILES'],
    status: 'UPCOMING',
    confirmedMeetings: [
      { id: 'tm-01', buyerName: 'Stefan Krause', company: 'Kaufland Global Sourcing', country: 'Germany', countryFlag: '🇩🇪', time: 'Feb 13, 10:30 AM', interest: '12-Piece Porcelain Dinnerware Set & Reactive Glaze Vases' },
      { id: 'tm-02', buyerName: 'Henrik Lindqvist', company: 'Nordic Style Living AB', country: 'Sweden', countryFlag: '🇸🇪', time: 'Feb 13, 02:00 PM', interest: 'Waffle Linen Throws & Terracotta Urns' },
      { id: 'tm-03', buyerName: 'Camille Dubois', company: 'Galeries Lafayette Home', country: 'France', countryFlag: '🇫🇷', time: 'Feb 14, 11:15 AM', interest: 'Matte Black Athena Bone China Collection' }
    ],
    budget: {
      planned: 22000,
      currency: 'EUR'
    },
    expectedBuyerVisits: 280,
    preparedCollateral: ['AMC-LKB-CER-01', 'AMC-LKB-TER-01', 'AMC-LKB-TEX-01'],
    websiteUrl: 'https://ambiente.messefrankfurt.com'
  },
  {
    id: 'tshow-002',
    name: 'Spring Fair Birmingham 2027',
    edition: 'UK’s Premier Home & Gift Wholesale Marketplace',
    dates: 'February 07 – 10, 2027',
    startDate: '2027-02-07',
    endDate: '2027-02-10',
    venue: 'National Exhibition Centre (NEC)',
    city: 'Birmingham',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    boothNumber: 'Hall 8, Stand B22 (Sustainable Living & Giftware)',
    hall: 'Hall 8 — Everyday Living & Ethical Sourcing',
    assignedStation: 'ARIEL_UK',
    focusSectors: ['JUTE', 'LEATHER', 'HOME_TEXTILES'],
    status: 'UPCOMING',
    confirmedMeetings: [
      { id: 'tm-04', buyerName: 'Fiona Macleod', company: 'John Lewis Partnership', country: 'United Kingdom', countryFlag: '🇬🇧', time: 'Feb 08, 11:00 AM', interest: 'Laminated Golden Jute Grocery Totes (100k pcs annual)' },
      { id: 'tm-05', buyerName: 'David H. Miller', company: 'Marks & Spencer Home', country: 'United Kingdom', countryFlag: '🇬🇧', time: 'Feb 08, 03:30 PM', interest: 'Full-Grain Leather Weekender Bag Private Label' },
      { id: 'tm-06', buyerName: 'Sarah Jenkins', company: 'The White Company', country: 'United Kingdom', countryFlag: '🇬🇧', time: 'Feb 09, 01:00 PM', interest: 'Pure Organic Cotton Percale Sheeting & Hemstitched Napkins' }
    ],
    budget: {
      planned: 18500,
      currency: 'GBP'
    },
    expectedBuyerVisits: 320,
    preparedCollateral: ['AMC-LKB-JUT-01', 'AMC-LKB-LEA-01', 'AMC-LKB-TEX-01'],
    websiteUrl: 'https://www.springfair.com'
  },
  {
    id: 'tshow-003',
    name: 'NY NOW Summer 2027',
    edition: 'The Premier Wholesale Market for Design, Home & Lifestyle',
    dates: 'August 08 – 11, 2027',
    startDate: '2027-08-08',
    endDate: '2027-08-11',
    venue: 'Javits Center',
    city: 'New York City',
    country: 'United States',
    countryFlag: '🇺🇸',
    boothNumber: 'Level 3, Booth #2418 (Accent on Design)',
    hall: 'Level 3 — Luxury Goods & Global Craft',
    assignedStation: 'ARIEL_US',
    focusSectors: ['LEATHER', 'CERAMICS', 'TERRACOTTA'],
    status: 'UPCOMING',
    confirmedMeetings: [
      { id: 'tm-07', buyerName: 'Rachel Brooks', company: 'Williams-Sonoma Inc.', country: 'United States', countryFlag: '🇺🇸', time: 'Aug 09, 10:00 AM', interest: 'Artisanal Terracotta Tableware & Stoneware Bowls' },
      { id: 'tm-08', buyerName: 'Tyler Ward', company: 'Nordstrom Private Brands', country: 'United States', countryFlag: '🇺🇸', time: 'Aug 09, 02:30 PM', interest: 'LWG Leather Duffle Bags & Laptop Folios' }
    ],
    budget: {
      planned: 28000,
      currency: 'USD'
    },
    expectedBuyerVisits: 240,
    preparedCollateral: ['AMC-LKB-LEA-01', 'AMC-LKB-CER-01', 'AMC-LKB-TER-01'],
    websiteUrl: 'https://nynow.com'
  },
  {
    id: 'tshow-004',
    name: 'Reed Gift Fairs Melbourne 2027',
    edition: 'Australasia’s Number One Trade Exhibition for Retail Buyers',
    dates: 'August 01 – 04, 2027',
    startDate: '2027-08-01',
    endDate: '2027-08-04',
    venue: 'Melbourne Convention and Exhibition Centre (MCEC)',
    city: 'Melbourne',
    country: 'Australia',
    countryFlag: '🇦🇺',
    boothNumber: 'Stand C112 (Home, Lifestyle & Sourcing)',
    hall: 'Main Exhibition Hall C',
    assignedStation: 'ARIEL_AU',
    focusSectors: ['HOME_TEXTILES', 'JUTE', 'CERAMICS'],
    status: 'UPCOMING',
    confirmedMeetings: [
      { id: 'tm-09', buyerName: 'Chloe Sutherland', company: 'Country Road Group', country: 'Australia', countryFlag: '🇦🇺', time: 'Aug 02, 11:30 AM', interest: 'Waffle Beach Towels & Jute Market Baskets' },
      { id: 'tm-10', buyerName: 'Mark Thompson', company: 'David Jones Department Stores', country: 'Australia', countryFlag: '🇦🇺', time: 'Aug 02, 03:00 PM', interest: 'Ceramic Serving Platters & Hospitality Tableware' }
    ],
    budget: {
      planned: 19500,
      currency: 'AUD'
    },
    expectedBuyerVisits: 190,
    preparedCollateral: ['AMC-LKB-TEX-01', 'AMC-LKB-JUT-01', 'AMC-LKB-CER-01'],
    websiteUrl: 'https://www.reedgiftfairs.com.au'
  }
];

export const INITIAL_BRAND_ASSETS: BrandIdentityAsset[] = [
  {
    id: 'ba-001',
    title: 'ArielMC Official Master Vector Logo Suite',
    type: 'LOGO_VECTOR',
    resolution: 'Vector SVG & 4000x1200px PNG (Transparent Background)',
    format: 'SVG / PNG / AI',
    fileUrl: '/images/marketing/ArielMC_Logo.png',
    previewImage: '/images/marketing/ArielMC_Logo.png',
    usageDescription: 'Official primary brand logo in Corporate Navy (#003B73 / #003177). For all official letterheads, trade show booths, catalogs, and master packaging.',
    fileSize: '4.2 MB'
  },
  {
    id: 'ba-002',
    title: 'ArielMC Official Corporate Letterhead (38mm Calibrated)',
    type: 'STATIONERY',
    resolution: 'Vector SVG (Standard A4 210x297mm @ 300 DPI)',
    format: 'SVG / PDF / HTML Studio',
    fileUrl: '/images/marketing/ArielMC_Official_Letterhead.svg',
    previewImage: '/images/marketing/ArielMC_Official_Letterhead.svg',
    usageDescription: 'Official A4 corporate stationery featuring the standard 38mm logo and the 4-pillar institutional footer: House 30 Niketon, +880 2410 811 91, info@arielmc.com, www.arielmc.com.',
    fileSize: '108 KB'
  },
  {
    id: 'ba-003',
    title: 'LWG Audited Gold & BSCI Social Compliance Badges',
    type: 'CERTIFICATION_BADGE',
    resolution: 'Ultra HD 3000x3000px PNG with alpha mask',
    format: 'PNG / EPS',
    fileUrl: '/images/marketing/LWG AUDITED.png',
    previewImage: '/images/marketing/LWG AUDITED.png',
    usageDescription: 'Official Leather Working Group audit badge and BSCI Grade A social audit emblems. Restricted to verified partner factories meeting audited criteria.',
    fileSize: '1.2 MB'
  },
  {
    id: 'ba-004',
    title: 'GOTS Organic, OEKO-TEX & FDA LFGB Compliance Pack',
    type: 'CERTIFICATION_BADGE',
    resolution: 'Print-Ready Vector Vector & 2400px Transparent PNG',
    format: 'PNG / PDF',
    fileUrl: '/images/marketing/FDA - LFGB SAFE.png',
    previewImage: '/images/marketing/FDA - LFGB SAFE.png',
    usageDescription: 'Food Contact Safe certification badge for ceramics, GOTS Organic for cotton textiles, and OEKO-TEX Standard 100 for eco-dyed jute.',
    fileSize: '950 KB'
  },
  {
    id: 'ba-005',
    title: 'Master Export Master Carton & Retail Box Die-Lines',
    type: 'PACKAGING_DIELINE',
    resolution: 'Vector Adobe Illustrator (.AI) & CAD DXF with 5mm Bleed',
    format: 'AI / DXF / PDF',
    fileUrl: '/docs/ArielMC_Packaging_Dielines_Master_Pack.zip',
    previewImage: '/images/marketing/vase-edit-catalog-cover.jpg',
    usageDescription: 'ISTA-3A drop-tested retail presentation boxes, individual barcode sticker guides, and 5-ply corrugated export master shipping cartons.',
    fileSize: '18.4 MB'
  }
];

export const INITIAL_GROWTH_ANALYTICS: InboundGrowthAnalytics = {
  totalCampaigns: 5,
  activeCampaigns: 4,
  totalLookbooks: 6,
  totalDownloads: 2520,
  totalTradeShows: 4,
  pipelineAttributedUsd: 2850000,
  regionalInterest: [
    { region: 'United Kingdom', flag: '🇬🇧', percentage: 38, inquiries: 96 },
    { region: 'United States', flag: '🇺🇸', percentage: 28, inquiries: 71 },
    { region: 'European Union (DE/FR/NL/SE)', flag: '🇪🇺', percentage: 22, inquiries: 56 },
    { region: 'Australia & New Zealand', flag: '🇦🇺', percentage: 12, inquiries: 31 },
  ],
  sectorBreakdown: [
    { sector: 'LEATHER', percentage: 32, downloads: 806 },
    { sector: 'CERAMICS', percentage: 28, downloads: 705 },
    { sector: 'JUTE', percentage: 21, downloads: 529 },
    { sector: 'HOME_TEXTILES', percentage: 11, downloads: 277 },
    { sector: 'TERRACOTTA', percentage: 8, downloads: 203 },
  ]
};
