import { BuyerPortfolio } from '@/types/buyerPortfolio';

export const INITIAL_BUYER_PORTFOLIOS: BuyerPortfolio[] = [
  // 1. HARRODS LONDON (UK Station)
  {
    id: 'bp-harrods-01',
    buyerCompany: 'Harrods London',
    brandCode: 'HARRODS-LDN',
    marketStation: 'UK',
    accountStatus: 'STRATEGIC_KEY_ACCOUNT',
    lastUpdated: '2026-10-18',
    websiteUrl: 'https://www.harrods.com',

    // Pillar E: Business Portfolio
    businessPortfolio: {
      legalEntityName: 'Harrods Limited',
      tradeName: 'Harrods of Knightsbridge',
      country: 'United Kingdom',
      headquarters: '87–135 Brompton Road, Knightsbridge, London SW1X 7XL, UK',
      establishedYear: 1849,
      annualCorporateTurnoverUsd: '£890 Million (~$1.15 Billion USD)',
      storeCount: 1, // 1.1 million sq ft historic department store + Heathrow luxury terminals
      eCommerceChannels: ['Harrods.com (Global Delivery to 130+ Countries)', 'Farfetch Partner Boutique'],
      tierClassification: 'Tier 1 Luxury Department Store',
      keyDecisionMakers: [
        {
          name: 'Eleanor Vance',
          designation: 'Senior Accessories & Leather Goods Buyer',
          email: 'eleanor.vance@harrods.com',
          phone: '+44 20 7730 1234 (Ext 4812)',
          linkedIn: 'linkedin.com/in/eleanor-vance-harrods',
          decisionScope: 'Range Selection, Cost Price Approval & Range Finalization',
        },
        {
          name: 'Alistair Finch',
          designation: 'Head of Quality Assurance & Supply Chain Compliance',
          email: 'alistair.finch@harrods.com',
          phone: '+44 20 7730 1234 (Ext 3109)',
          decisionScope: 'Technical File, LWG Audit Review & AQL Inspection Sign-off',
        },
        {
          name: 'Sophia Montgomery',
          designation: 'Merchandise Planning Manager',
          email: 'sophia.m@harrods.com',
          phone: '+44 20 7730 1234 (Ext 2884)',
          decisionScope: 'Inventory Turn, OTB (Open-to-Buy) Budget & Repeat Allocations',
        },
      ],
      primaryStationBranch: 'UK',
    },

    // Pillar A: Current Products, Pictures & Sales Price
    currentProducts: [
      {
        id: 'prod-har-01',
        sku: 'AM-LTH-001',
        styleName: 'Artisan Full-Grain Messenger Bag',
        imageUrl: '/images/marketing/leather-compendium.jpg',
        sector: 'LEATHER',
        category: 'Messenger & Briefcases',
        description: 'Heritage vegetable-tanned bovine leather with antique brass buckles, padded laptop sleeve, and hand-burnished edges.',
        wholesaleFobPriceUsd: 58.0,
        buyerCurrency: 'GBP',
        buyerSalesPrice: 195.0, // Harrods Retail Price £195.00
        estimatedMarkupMultiple: 4.3, // ~4.3x Markup
        activeOrderUnits: 1500,
        lifetimeOrderedUnits: 4200,
        firstOrderDate: '2025-08-14',
        lastOrderDate: '2026-09-20',
        orderStatus: 'IN_PRODUCTION',
      },
      {
        id: 'prod-har-02',
        sku: 'AMC-LT2-LEA-BUR-SGL',
        styleName: 'ArielMC Style 2 Structured Tote - Burgundy',
        imageUrl: '/images/marketing/fashionable-bag-catalog-cover.jpg',
        sector: 'LEATHER',
        category: 'Structured Handbags',
        description: 'Architectural deep burgundy full-grain tote with magnetic toggle closures and bespoke interior organizer pockets.',
        wholesaleFobPriceUsd: 50.0,
        buyerCurrency: 'GBP',
        buyerSalesPrice: 165.0, // Harrods Retail Price £165.00
        estimatedMarkupMultiple: 4.2,
        activeOrderUnits: 800,
        lifetimeOrderedUnits: 2400,
        firstOrderDate: '2026-02-15',
        lastOrderDate: '2026-08-10',
        orderStatus: 'DELIVERED_STOCK',
      },
      {
        id: 'prod-har-03',
        sku: 'AMC-LT-FOLIO-BLK',
        styleName: 'Executive RFID Calfskin Tech Folio',
        imageUrl: '/images/marketing/leather-craft-artisan.jpg',
        sector: 'LEATHER',
        category: 'Small Leather Goods / Folios',
        description: 'Slimline vegetable-tanned calfskin organizer designed for iPad Pro and documents, with RFID-shielded card pockets.',
        wholesaleFobPriceUsd: 32.0,
        buyerCurrency: 'GBP',
        buyerSalesPrice: 110.0, // Harrods Retail Price £110.00
        estimatedMarkupMultiple: 4.4,
        activeOrderUnits: 1200,
        lifetimeOrderedUnits: 3600,
        firstOrderDate: '2026-04-12',
        lastOrderDate: '2026-09-05',
        orderStatus: 'REPEAT_PLANNED',
      },
    ],

    // Pillar B: Buyer's Interest Points & ESG Mandates
    interestPoints: {
      preferredMaterials: [
        'Full-Grain Vegetable-Tanned Cowhide (1.4–1.6mm substance)',
        'Aniline Calfskin for Small Leather Goods',
        'GOTS-Certified 100% Organic Cotton Twill Lining (240 GSM)',
        'Bespoke Solid Antiqued Brass Hardware (Nickel & Lead Free)',
      ],
      sustainabilityMandates: [
        'Mandatory Leather Working Group (LWG) Gold Rated Tannery origin only',
        'Strict EU REACH Annex XVII compliance (Chromium VI < 3.0 ppm, zero Azo dyes)',
        '100% Plastic-free packaging: Recycled cotton dustbags with debossed gold foil',
        'Zero single-use polybags in final store delivery (use biodegradable cornstarch)',
      ],
      qualityStandardsAql: 'Strict AQL 1.0 (Critical: 0, Major: 1.0, Minor: 2.5) with 100% Final Random Inspection (FRI) pass report',
      packagingAndBranding: 'Branded FSC rigid gift boxes, woven Harrods green & gold satin ribbon, debossed leather hangtag with RFID barcoding',
      designAesthetic: 'Timeless British luxury heritage with sharp architectural silhouettes and subtle tone-on-tone edge stitching',
      targetLeadTimeWeeks: 7, // 50 days
      priceSensitivity: 'LUXURY_INELASTIC',
      specialRequirementsNotes: 'Harrods requires full chemical batch test certificates (BLC/Eurofins) attached to commercial export documents.',
    },

    // Pillar C: Buyer's Future Target Product Reach Planning
    futureReachPlanning: [
      {
        id: 'fut-har-01',
        seasonOrQuarter: 'Autumn / Winter 2027 Luxury Travel Suite',
        targetCategory: 'Full-Grain Weekend Holdall & Matching Dopp Kit',
        projectedVolumeUnits: 3200,
        targetWholesaleFobUsd: 85.0,
        targetRetailSalesPrice: 325.0, // Target £325.00
        samplingTargetDate: '2027-01-20',
        shelfLaunchDate: '2027-08-15',
        developmentStage: 'TECH_PACK_DEV',
        strategicObjective: 'Displace Tuscan Italian suppliers in the Harrods travel hall with equivalent Savar LWG Gold quality at 35% higher gross margin.',
      },
      {
        id: 'fut-har-02',
        seasonOrQuarter: 'Spring / Summer 2028 Eco-Luxury Resort Collection',
        targetCategory: 'Golden Jute & Italian Leather Hybrid Beach Totes',
        projectedVolumeUnits: 4500,
        targetWholesaleFobUsd: 28.0,
        targetRetailSalesPrice: 120.0, // Target £120.00
        samplingTargetDate: '2027-09-15',
        shelfLaunchDate: '2028-03-01',
        developmentStage: 'CONCEPT',
        strategicObjective: 'Capitalize on Harrods ESG initiative highlighting biodegradable Bangladeshi golden jute combined with artisan leathercraft.',
      },
    ],

    // Pillar D: Financial Portfolio
    financialPortfolio: {
      approvedCreditLimitUsd: 650000,
      paymentTerms: '90-Day Confirmed Irrevocable Letter of Credit (L/C) at Sight',
      creditRiskRating: 'AAA Sovereign',
      lifetimeGmvUsd: 875000,
      ytdRevenueUsd: 284000,
      outstandingReceivablesUsd: 87750,
      overdueAmountUsd: 0, // Zero overdue
      advisingIssuingBank: 'HSBC Bank PLC, 8 Canada Square, Canary Wharf London E14 5HQ',
      swiftBic: 'HSBCLON99',
      preferredTradeCurrency: 'GBP',
      paymentPunctualityScorePct: 99.8,
    },

    // Value-Add: Competitive Intelligence & Interaction
    competitiveIntelligence: {
      shareOfWalletPct: 42, // ArielMC commands 42% of Harrods private label leather
      primaryAlternativeSourcingHubs: ['Florence / Santa Croce (Italy)', 'Ho Chi Minh City (Vietnam)'],
      strategicAdvantageOverCompetitors: 'ArielMC provides 40% lower FOB landed cost while matching Italian hand-burnished edge paint and offering complete tannery-to-carton traceability.',
    },
    interactionLogs: [
      {
        id: 'log-har-01',
        date: '2026-10-12',
        type: 'SHOWROOM_VISIT',
        summary: 'Met Eleanor Vance at Ariel London Showroom (Mayfair). Reviewed AW27 leather holdall 3D renders. Eleanor approved the vegetable-tanned olive grain swatch.',
        attendedBy: 'Syed Akramul Hassan & UK Commercial Desk',
        nextFollowUpDate: '2026-11-05',
      },
      {
        id: 'log-har-02',
        date: '2026-09-20',
        type: 'CONTRACT_NEGOTIATION',
        summary: 'Finalized Master Sales Order SO-2026-UK-001 for 1,500 messenger bags. Issued Proforma PI. Received Master L/C confirmation via HSBC.',
        attendedBy: 'Finance & Merchandising Ops',
      },
    ],
    internalMerchandisingNotes: 'High-priority prestigious client. Strict adherence to packaging debossing alignment is essential. All boxes must have moisture-absorbing silica gel packs.',
  },

  // 2. RALPH LAUREN CORPORATION (US Station)
  {
    id: 'bp-ralph-02',
    buyerCompany: 'Ralph Lauren Corporation',
    brandCode: 'RL-CORP-US',
    marketStation: 'US',
    accountStatus: 'STRATEGIC_KEY_ACCOUNT',
    lastUpdated: '2026-10-19',
    websiteUrl: 'https://www.ralphlauren.com',

    businessPortfolio: {
      legalEntityName: 'Ralph Lauren Corporation',
      tradeName: 'Polo Ralph Lauren / Double RL',
      country: 'United States',
      headquarters: '650 Madison Avenue, New York, NY 10022, USA',
      establishedYear: 1967,
      annualCorporateTurnoverUsd: '$6.63 Billion USD (FY2026)',
      storeCount: 560, // Direct retail stores & concessions globally
      eCommerceChannels: ['RalphLauren.com', 'Nordstrom', 'Saks Fifth Avenue', 'Bloomingdale’s'],
      tierClassification: 'Tier 1 Luxury Department Store',
      keyDecisionMakers: [
        {
          name: 'Marcus Sterling',
          designation: 'Vice President of Global Accessories Sourcing',
          email: 'marcus.sterling@ralphlauren.com',
          phone: '+1 212 318 7000',
          decisionScope: 'Vendor Allocation & Annual Master Sourcing Contracts',
        },
        {
          name: 'Clara Jenkins',
          designation: 'Senior Director of Product Development - Leather Goods',
          email: 'clara.jenkins@ralphlauren.com',
          phone: '+1 212 318 7240',
          decisionScope: 'Raw Material Selection, Hardware Tooling & Fit Signoff',
        },
      ],
      primaryStationBranch: 'US',
    },

    currentProducts: [
      {
        id: 'prod-rl-01',
        sku: 'RL-LTH-SAD-01',
        styleName: 'Polo Heritage Saddle Leather Briefcase',
        imageUrl: '/images/marketing/leather-compendium.jpg',
        sector: 'LEATHER',
        category: 'Executive Briefcases',
        description: 'Pull-up oiled vintage cowhide with hand-stitched bar tacks, solid cast RL roller buckles, and herringbone interior.',
        wholesaleFobPriceUsd: 68.0,
        buyerCurrency: 'USD',
        buyerSalesPrice: 298.0, // Retail $298.00
        estimatedMarkupMultiple: 4.4,
        activeOrderUnits: 2000,
        lifetimeOrderedUnits: 6500,
        firstOrderDate: '2025-05-10',
        lastOrderDate: '2026-08-30',
        orderStatus: 'IN_PRODUCTION',
      },
      {
        id: 'prod-rl-02',
        sku: 'RL-CNV-DUF-02',
        styleName: 'Artisan Heavy Duck Canvas & Leather Weekender',
        imageUrl: '/images/marketing/fashionable-bag-catalog-cover.jpg',
        sector: 'LEATHER',
        category: 'Travel Duffels',
        description: '18oz rugged water-repellent cotton duck canvas trimmed with thick oil-tanned leather handles and copper rivets.',
        wholesaleFobPriceUsd: 44.0,
        buyerCurrency: 'USD',
        buyerSalesPrice: 195.0, // Retail $195.00
        estimatedMarkupMultiple: 4.4,
        activeOrderUnits: 2500,
        lifetimeOrderedUnits: 8000,
        firstOrderDate: '2025-09-18',
        lastOrderDate: '2026-09-15',
        orderStatus: 'REPEAT_PLANNED',
      },
    ],

    interestPoints: {
      preferredMaterials: [
        'Heavy Oiled Pull-Up Bovine Leather (1.8–2.0mm thickness)',
        '18oz Washed Heavy Cotton Duck Canvas',
        'Custom Cast Heavy Brass Roller Buckles with Antique Patina',
        'Reinforced Heavy Gauge Waxed Stitching (Size 207 Thread)',
      ],
      sustainabilityMandates: [
        'LWG Silver or Gold rated tanneries',
        'Strict California Proposition 65 lead & phthalate testing pass',
        'Zero forced-labor audits (Sedex SMETA 4-Pillar with verified GPS payroll)',
        'FSC certified outer shipping master cartons with 40% post-consumer fibers',
      ],
      qualityStandardsAql: 'AQL 1.0 Major / 2.5 Minor. Zero tolerance on buckle tensile test failure (< 80 kgf).',
      packagingAndBranding: 'Unbleached natural cotton dustbags with navy Polo Ralph Lauren screenprint, custom branded brass hangtag rivets.',
      designAesthetic: 'Americana Rugged Heritage with equestrian saddle stitching, raw-edge burnished pull-up leather, and heavy hardware.',
      targetLeadTimeWeeks: 8,
      priceSensitivity: 'MID_TIER_BALANCED',
      specialRequirementsNotes: 'Drop-test testing mandatory for all luggage hardware joints. Samples must undergo 72-hour salt spray corrosion test.',
    },

    futureReachPlanning: [
      {
        id: 'fut-rl-01',
        seasonOrQuarter: 'Fall / Holiday 2027 RRL Equestrian Capsule',
        targetCategory: 'Bridle Leather Belts, Card Cases & Saddlery Folios',
        projectedVolumeUnits: 8500,
        targetWholesaleFobUsd: 38.0,
        targetRetailSalesPrice: 165.0,
        samplingTargetDate: '2027-02-28',
        shelfLaunchDate: '2027-09-15',
        developmentStage: 'MOOD_BOARD',
        strategicObjective: 'Supply RRL specialty line directly from Savar specialized benchcraft tanners.',
      },
    ],

    financialPortfolio: {
      approvedCreditLimitUsd: 1200000,
      paymentTerms: '60-Day Open Account backed by Standby Letter of Credit (SBLC)',
      creditRiskRating: 'AA Investment Grade',
      lifetimeGmvUsd: 1650000,
      ytdRevenueUsd: 480000,
      outstandingReceivablesUsd: 112000,
      overdueAmountUsd: 0,
      advisingIssuingBank: 'JP Morgan Chase Bank N.A., 270 Park Ave, New York, NY',
      swiftBic: 'CHASUS33',
      preferredTradeCurrency: 'USD',
      paymentPunctualityScorePct: 99.5,
    },

    competitiveIntelligence: {
      shareOfWalletPct: 35,
      primaryAlternativeSourcingHubs: ['Leon (Mexico)', 'Chennai (India)', 'Dongguan (China)'],
      strategicAdvantageOverCompetitors: 'ArielMC provides superior tensile leather strength and lower FOB pricing compared to Mexican leather factories.',
    },
    interactionLogs: [
      {
        id: 'log-rl-01',
        date: '2026-10-15',
        type: 'ZOOM_CALL',
        summary: 'Reviewed pre-production sample lot of Saddle Leather Briefcase with Clara Jenkins. Edge dye consistency approved.',
        attendedBy: 'QA Engineering & US Country Desk',
      },
    ],
    internalMerchandisingNotes: 'Requires strict barcode scannability test before pallet loading for New Jersey distribution center.',
  },

  // 3. MARKS & SPENCER PLC (UK Station)
  {
    id: 'bp-ms-03',
    buyerCompany: 'Marks & Spencer PLC',
    brandCode: 'MS-UK-PLC',
    marketStation: 'UK',
    accountStatus: 'STRATEGIC_KEY_ACCOUNT',
    lastUpdated: '2026-10-17',
    websiteUrl: 'https://www.marksandspencer.com',

    businessPortfolio: {
      legalEntityName: 'Marks and Spencer plc',
      tradeName: 'M&S Autograph / M&S Collection',
      country: 'United Kingdom',
      headquarters: 'Waterside House, 35 North Wharf Road, London W2 1NW, UK',
      establishedYear: 1884,
      annualCorporateTurnoverUsd: '£13.1 Billion (~$17.0 Billion USD)',
      storeCount: 1040, // 950+ UK stores + 400+ international franchise stores
      eCommerceChannels: ['MarksAndSpencer.com', 'Ocado Retail Partnership'],
      tierClassification: 'High-Street Global Retailer',
      keyDecisionMakers: [
        {
          name: 'Nigel Thornbury',
          designation: 'Head of Sourcing - Menswear & Accessories',
          email: 'nigel.thornbury@marks-and-spencer.com',
          phone: '+44 20 7935 4422',
          decisionScope: 'Factory Allocation, CSR Signoff & Volume Price Agreements',
        },
        {
          name: 'Gemma Davies',
          designation: 'Product Technologist - Sustainable Fibers',
          email: 'gemma.davies@marks-and-spencer.com',
          phone: '+44 20 7935 4422',
          decisionScope: 'Plan A Compliance, Chemical Testing & Fabric Audits',
        },
      ],
      primaryStationBranch: 'UK',
    },

    currentProducts: [
      {
        id: 'prod-ms-01',
        sku: 'MS-AUTO-01',
        styleName: 'Autograph Collection Premium Leather Shopper',
        imageUrl: '/images/marketing/leather-compendium.jpg',
        sector: 'LEATHER',
        category: 'Totes & Shoppers',
        description: 'Supple nappa cowhide tote with interior zip compartment and M&S Plan A accredited eco-lining.',
        wholesaleFobPriceUsd: 36.0,
        buyerCurrency: 'GBP',
        buyerSalesPrice: 99.0, // Retail £99.00
        estimatedMarkupMultiple: 3.6,
        activeOrderUnits: 4000,
        lifetimeOrderedUnits: 14000,
        firstOrderDate: '2024-11-20',
        lastOrderDate: '2026-09-10',
        orderStatus: 'IN_PRODUCTION',
      },
      {
        id: 'prod-ms-02',
        sku: 'MS-GOTS-CHN',
        styleName: 'Plan A 100% GOTS Organic Cotton Chino Trouser',
        imageUrl: '/images/marketing/textile-compendium.jpg',
        sector: 'APPAREL',
        category: 'Trousers & Chinos',
        description: 'Comfort stretch twill crafted with certified organic cotton yarn from Gazipur mills.',
        wholesaleFobPriceUsd: 11.5,
        buyerCurrency: 'GBP',
        buyerSalesPrice: 35.0, // Retail £35.00
        estimatedMarkupMultiple: 3.9,
        activeOrderUnits: 8000,
        lifetimeOrderedUnits: 32000,
        firstOrderDate: '2025-02-10',
        lastOrderDate: '2026-08-15',
        orderStatus: 'DELIVERED_STOCK',
      },
    ],

    interestPoints: {
      preferredMaterials: [
        '100% GOTS Certified Organic Cotton',
        'LWG Gold Leather with full chemical audit trails',
        'Recycled Polyester (GRS Certified) Interlinings',
        'Corozo Nut and Recycled Horn Buttons',
      ],
      sustainabilityMandates: [
        'Strict Plan A 2030 Mandate: 100% sustainable materials and net zero emissions targets',
        'Zero Discharge of Hazardous Chemicals (ZDHC MRSL Level 3 certification)',
        'Sedex SMETA 4-Pillar with living wage audit verification',
        'Outer cartons must be 100% recyclable with paper tape sealing only',
      ],
      qualityStandardsAql: 'Standard AQL 1.5 Major / 4.0 Minor. Fabric dimensional stability test shrinkage < 3%.',
      packagingAndBranding: 'Flat packed, FSC certified paper swing tags, direct heat seal care labels.',
      designAesthetic: 'Clean contemporary British smart-casual with understated branding and maximum wearability.',
      targetLeadTimeWeeks: 6,
      priceSensitivity: 'VOLUME_SENSITIVE',
      specialRequirementsNotes: 'Electronic Data Interchange (EDI) integration required for ASN (Advanced Shipping Notice) and barcode validation.',
    },

    futureReachPlanning: [
      {
        id: 'fut-ms-01',
        seasonOrQuarter: 'Spring 2028 Circular Footwear & Sneaker Line',
        targetCategory: 'Recycled Rubber Sole Leather Cupsole Sneakers',
        projectedVolumeUnits: 14000,
        targetWholesaleFobUsd: 24.0,
        targetRetailSalesPrice: 75.0,
        samplingTargetDate: '2027-06-15',
        shelfLaunchDate: '2028-02-01',
        developmentStage: 'CONCEPT',
        strategicObjective: 'Expand M&S Autograph men’s footwear range using ArielMC Gazipur & Savar footwear manufacturing facilities.',
      },
    ],

    financialPortfolio: {
      approvedCreditLimitUsd: 850000,
      paymentTerms: '90-Day Documentary Credit / BACS Commercial Trade Finance',
      creditRiskRating: 'AAA Sovereign',
      lifetimeGmvUsd: 1120000,
      ytdRevenueUsd: 360000,
      outstandingReceivablesUsd: 94000,
      overdueAmountUsd: 0,
      advisingIssuingBank: 'Barclays Bank PLC, 1 Churchill Place, London E14 5HP',
      swiftBic: 'BARCGB22',
      preferredTradeCurrency: 'GBP',
      paymentPunctualityScorePct: 99.9,
    },

    competitiveIntelligence: {
      shareOfWalletPct: 28,
      primaryAlternativeSourcingHubs: ['Turkey (Denim & Outerwear)', 'Sri Lanka (Intimate Apparel)'],
      strategicAdvantageOverCompetitors: 'Complete GSP duty-free advantage for UK imports, backed by ArielMC UK VAT registration and bonded logistics support.',
    },
    interactionLogs: [
      {
        id: 'log-ms-01',
        date: '2026-10-08',
        type: 'FACTORY_INSPECTION',
        summary: 'M&S Dhaka liaison office team conducted random spot check on Gazipur Chino assembly line. Awarded green rating.',
        attendedBy: 'Compliance & Quality Audit Team',
      },
    ],
    internalMerchandisingNotes: 'High volume recurring account. Production scheduling must lock fabric yarn spinning 60 days in advance.',
  },

  // 4. INDITEX (ZARA / MASSIMO DUTTI) (EU Station)
  {
    id: 'bp-inditex-04',
    buyerCompany: 'Inditex (Zara & Massimo Dutti)',
    brandCode: 'IND-ZARA-EU',
    marketStation: 'EU',
    accountStatus: 'STRATEGIC_KEY_ACCOUNT',
    lastUpdated: '2026-10-18',
    websiteUrl: 'https://www.inditex.com',

    businessPortfolio: {
      legalEntityName: 'Industria de Diseño Textil, S.A. (Inditex S.A.)',
      tradeName: 'Zara, Massimo Dutti, Zara Home',
      country: 'Spain',
      headquarters: 'Avenida de la Diputación, Edificio Inditex, 15142 Arteixo, A Coruña, Spain',
      establishedYear: 1975,
      annualCorporateTurnoverUsd: '€35.9 Billion (~$38.8 Billion USD)',
      storeCount: 5800, // 5,800+ stores worldwide across 95 markets
      eCommerceChannels: ['Zara.com', 'MassimoDutti.com', 'Global E-Commerce Logistics Hubs'],
      tierClassification: 'High-Street Global Retailer',
      keyDecisionMakers: [
        {
          name: 'Mateo Fernández',
          designation: 'Director of Leather Accessories Sourcing (Massimo Dutti)',
          email: 'mateo.fernandez@inditex.com',
          phone: '+34 981 185 400',
          decisionScope: 'Speed-to-Market Fast Prototyping & Spot Allocation',
        },
        {
          name: 'Lucia Alvarez',
          designation: 'Head of Join Life Environmental Verification',
          email: 'lucia.alvarez@inditex.com',
          phone: '+34 981 185 480',
          decisionScope: 'Traceability Audits & Chemical Wet-Process Verification',
        },
      ],
      primaryStationBranch: 'EU',
    },

    currentProducts: [
      {
        id: 'prod-ind-01',
        sku: 'MD-NAP-XBD',
        styleName: 'Massimo Dutti Minimalist Nappa Crossbody',
        imageUrl: '/images/marketing/leather-compendium.jpg',
        sector: 'LEATHER',
        category: 'Crossbody Bags',
        description: 'Super-soft glove nappa leather with micro metal logo and adjustable strap for cosmopolitan carry.',
        wholesaleFobPriceUsd: 35.0,
        buyerCurrency: 'EUR',
        buyerSalesPrice: 129.0, // Retail €129.00
        estimatedMarkupMultiple: 4.0,
        activeOrderUnits: 3500,
        lifetimeOrderedUnits: 12000,
        firstOrderDate: '2025-06-22',
        lastOrderDate: '2026-09-28',
        orderStatus: 'IN_PRODUCTION',
      },
      {
        id: 'prod-ind-02',
        sku: 'ZR-LIN-SHT',
        styleName: 'Join Life Sustainable Linen Blend Overshirt',
        imageUrl: '/images/marketing/textile-compendium.jpg',
        sector: 'APPAREL',
        category: 'Shirts & Overshirts',
        description: 'Breathable European flax and Bangladeshi natural cotton blend dyed with non-toxic certified pigments.',
        wholesaleFobPriceUsd: 13.6,
        buyerCurrency: 'EUR',
        buyerSalesPrice: 49.95, // Retail €49.95
        estimatedMarkupMultiple: 4.0,
        activeOrderUnits: 10000,
        lifetimeOrderedUnits: 45000,
        firstOrderDate: '2025-01-18',
        lastOrderDate: '2026-08-04',
        orderStatus: 'REPEAT_PLANNED',
      },
    ],

    interestPoints: {
      preferredMaterials: [
        'Join Life accredited sustainable fibers (European Flax Linen & Organic Cotton)',
        'Aniline & Semi-Aniline Soft Nappa Cowhide',
        'Zinc Alloy Hardware with Eco-Plating Finish',
      ],
      sustainabilityMandates: [
        'Inditex The List by DYES & CHEMICALS testing protocol',
        'Clear-to-Wear (CtW) and Safe-to-Wear (StW) strict chemical thresholds',
        'RFID chip integration embedded into care labels at line production',
      ],
      qualityStandardsAql: 'AQL 1.5. Extremely strict turnaround speed: 30-day production cycles for fast response re-orders.',
      packagingAndBranding: 'Garment on hanger (GOH) and flat pack with Inditex master warehouse scanning codes.',
      designAesthetic: 'Sleek European high-fashion minimalism with clean unembellished silhouettes.',
      targetLeadTimeWeeks: 5, // 35 days
      priceSensitivity: 'MID_TIER_BALANCED',
      specialRequirementsNotes: 'Short lead time tolerance. Pre-cut material buffering maintained at Savar facility.',
    },

    futureReachPlanning: [
      {
        id: 'fut-ind-01',
        seasonOrQuarter: 'Summer 2027 Handcrafted Jute Resort Capsule',
        targetCategory: 'Beach Totes, Macrame Shoulder Bags & Espadrille Clutches',
        projectedVolumeUnits: 18000,
        targetWholesaleFobUsd: 8.5,
        targetRetailSalesPrice: 35.95,
        samplingTargetDate: '2027-01-15',
        shelfLaunchDate: '2027-05-01',
        developmentStage: 'TECH_PACK_DEV',
        strategicObjective: 'Capitalize on Inditex Mediterranean summer resort push with 100% natural biodegradable Bangladeshi golden jute.',
      },
    ],

    financialPortfolio: {
      approvedCreditLimitUsd: 1500000,
      paymentTerms: '60-Day Sight L/C via Banco Santander',
      creditRiskRating: 'AAA Sovereign',
      lifetimeGmvUsd: 2400000,
      ytdRevenueUsd: 650000,
      outstandingReceivablesUsd: 148000,
      overdueAmountUsd: 0,
      advisingIssuingBank: 'Banco Santander, S.A., Paseo de Pereda, Santander, Spain',
      swiftBic: 'BSCHESMM',
      preferredTradeCurrency: 'EUR',
      paymentPunctualityScorePct: 99.9,
    },

    competitiveIntelligence: {
      shareOfWalletPct: 32,
      primaryAlternativeSourcingHubs: ['Portugal (Footwear & Leather)', 'Morocco (Apparel Fast Turn)'],
      strategicAdvantageOverCompetitors: 'Cost structure is 45% below Portuguese factories, while ArielMC air-freight logistics bridge fast re-orders.',
    },
    interactionLogs: [
      {
        id: 'log-ind-01',
        date: '2026-10-14',
        type: 'PROTO_FEEDBACK',
        summary: 'Received proto approval for Nappa Crossbody Autumn refresh. Color approved: Burnt Umber and Olive Noir.',
        attendedBy: 'Merchandising Team Spain Desk',
      },
    ],
    internalMerchandisingNotes: 'Requires razor-sharp T&A (Time and Action) calendar monitoring. Delay of even 3 days incurs airfreight penalty.',
  },

  // 5. COUNTRY ROAD GROUP (AU Station)
  {
    id: 'bp-cr-05',
    buyerCompany: 'Country Road Group',
    brandCode: 'CR-MEL-AU',
    marketStation: 'AU',
    accountStatus: 'ACTIVE_GROWTH',
    lastUpdated: '2026-10-16',
    websiteUrl: 'https://www.countryroad.com.au',

    businessPortfolio: {
      legalEntityName: 'Country Road Group Pty Ltd',
      tradeName: 'Country Road, Trenery, Witchery',
      country: 'Australia',
      headquarters: 'Building 2, 572 Swan Street, Burnley, Melbourne VIC 3121, Australia',
      establishedYear: 1974,
      annualCorporateTurnoverUsd: 'A$1.15 Billion (~$780 Million USD)',
      storeCount: 650, // Across Australia, New Zealand, and South Africa
      eCommerceChannels: ['CountryRoad.com.au', 'David Jones Concessions', 'The Iconic'],
      tierClassification: 'Premium Omnichannel Brand',
      keyDecisionMakers: [
        {
          name: 'Lachlan Murdoch-Smith',
          designation: 'General Manager of Sourcing & Sustainability',
          email: 'lachlan.ms@countryroadgroup.com.au',
          phone: '+61 3 8509 4000',
          decisionScope: 'Southern Hemisphere Seasonal Buying & ESG Certification',
        },
        {
          name: 'Chloe Henderson',
          designation: 'Lead Accessories & Footwear Buyer',
          email: 'chloe.henderson@countryroadgroup.com.au',
          phone: '+61 3 8509 4120',
          decisionScope: 'Range Planning, Leather Selection & Prototype Approval',
        },
      ],
      primaryStationBranch: 'AU',
    },

    currentProducts: [
      {
        id: 'prod-cr-01',
        sku: 'CR-MER-DUF',
        styleName: 'Australian Merino Wool & Leather Weekend Duffel',
        imageUrl: '/images/marketing/leather-compendium.jpg',
        sector: 'LEATHER',
        category: 'Travel & Weekenders',
        description: 'Woolmark certified heavy felt wool body trimmed with vegetable-tanned oily cowhide leather and brushed nickel hardware.',
        wholesaleFobPriceUsd: 52.0,
        buyerCurrency: 'AUD',
        buyerSalesPrice: 279.0, // Retail A$279.00
        estimatedMarkupMultiple: 3.6,
        activeOrderUnits: 1800,
        lifetimeOrderedUnits: 5400,
        firstOrderDate: '2025-07-15',
        lastOrderDate: '2026-09-02',
        orderStatus: 'IN_PRODUCTION',
      },
    ],

    interestPoints: {
      preferredMaterials: [
        'Natural Vegetable Tanned Leather with Pull-up Effect',
        'Responsible Wool Standard (RWS) & Woolmark Certified Blends',
        'Certified Organic Cotton Canvas Lining',
        'Brushed Nickel and Gunmetal Hardware',
      ],
      sustainabilityMandates: [
        'Ethical Clothing Australia (ECA) equivalent supply chain transparency',
        'Zero single-use plastic: 100% home-compostable cornstarch polybags',
        'Modern Slavery Act annual supplier compliance declaration and living wage benchmarking',
      ],
      qualityStandardsAql: 'AQL 1.0 Major / 2.5 Minor. Salt-fog corrosion resistance test 48 hours for coastal durability.',
      packagingAndBranding: 'Unbleached natural cotton dustbags with embroidered Country Road logo, FSC kraft recycled price tags.',
      designAesthetic: 'Effortless Australasian modern living with relaxed tactile textures and natural earth tones.',
      targetLeadTimeWeeks: 7,
      priceSensitivity: 'MID_TIER_BALANCED',
      specialRequirementsNotes: 'Southern Hemisphere seasonal calendar alignment: Summer collections ship in August/September; Winter in February/March.',
    },

    futureReachPlanning: [
      {
        id: 'fut-cr-01',
        seasonOrQuarter: 'Autumn / Winter 2028 Outback Heritage Capsule',
        targetCategory: 'Full-Grain Leather Work Boots & Structured Crossbody Folios',
        projectedVolumeUnits: 3800,
        targetWholesaleFobUsd: 58.0,
        targetRetailSalesPrice: 299.0,
        samplingTargetDate: '2027-08-20',
        shelfLaunchDate: '2028-02-15',
        developmentStage: 'CONCEPT',
        strategicObjective: 'Directly compete with R.M. Williams utility accessories category at a compelling consumer price point.',
      },
    ],

    financialPortfolio: {
      approvedCreditLimitUsd: 450000,
      paymentTerms: '60-Day Confirmed Letter of Credit (L/C) via ANZ Bank Melbourne',
      creditRiskRating: 'AA Investment Grade',
      lifetimeGmvUsd: 620000,
      ytdRevenueUsd: 195000,
      outstandingReceivablesUsd: 64000,
      overdueAmountUsd: 0,
      advisingIssuingBank: 'Australia and New Zealand Banking Group (ANZ), Melbourne, Australia',
      swiftBic: 'ANZBAU3M',
      preferredTradeCurrency: 'AUD',
      paymentPunctualityScorePct: 99.4,
    },

    competitiveIntelligence: {
      shareOfWalletPct: 30,
      primaryAlternativeSourcingHubs: ['Guangzhou (China)', 'Indonesia'],
      strategicAdvantageOverCompetitors: 'ArielMC provides superior leather vegetable-tanning craftsmanship and direct Sydney/Melbourne sea routes.',
    },
    interactionLogs: [
      {
        id: 'log-cr-01',
        date: '2026-10-10',
        type: 'ZOOM_CALL',
        summary: 'Met Chloe Henderson to review Southern Hemisphere AW28 calendar. Finalized wool duffel second run.',
        attendedBy: 'Australasian Regional Desk',
      },
    ],
    internalMerchandisingNotes: 'Pay strict attention to seasonal inversion (shipping opposite to Northern Hemisphere seasons).',
  },
];
