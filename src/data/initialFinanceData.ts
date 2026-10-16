import {
  DualTrackPnlStatement,
  B2cUnitEconomics,
  B2bUnitEconomics,
  WorkingCapitalRunwayItem,
  QuarterlyBatchPlan,
} from '@/types/erp';

// -------------------------------------------------------------
// Combined Dual-Track Master Financial Plan (Year 1 Target)
// Source: "From Craft to Cash Flow: A Year 1 Market Launch Blueprint"
// -------------------------------------------------------------

export const INITIAL_DUAL_TRACK_PNL: DualTrackPnlStatement = {
  fiscalYear: '2026 / 2027 (Year 1 Launch)',
  totalVolumeUnits: 10000,
  b2cUnits: 6000,
  b2bUnits: 4000,
  grossCommercialTurnoverUsd: 233950, // $173,350 B2C + $60,600 B2B
  netCommercialRevenueUsd: 216450, // $155,850 B2C net + $60,600 B2B
  grossProfitUsd: 138260,
  ebitdaUsd: 72902, // $44,590 B2C + $28,312 B2B
  ebitdaMarginPct: 33.7,
  taxProvisionUsd: 13851, // $8,472 B2C + $5,379 B2B
  retainedNetProfitUsd: 59051, // $36,118 B2C + $22,933 B2B
  blendedNetMarginPct: 27.3,

  // Full-Year B2C Profit & Loss Statement (6,000 Units Target)
  b2cLines: [
    {
      name: 'Gross Retail Sales',
      amountUsd: 173350,
      pctGrossSales: 100.0,
      operationalLogic: 'Bloom ($70,400) + Mid ($43,500) + Commuter ($43,200) + Economy ($16,250)',
      isSubtotal: true,
    },
    {
      name: 'Less: Sales Tax & UK VAT Remittance',
      amountUsd: -17500,
      pctGrossSales: -10.1,
      operationalLogic: 'UK VAT standard 20% on UK portion + US state marketplace collection',
      isNegative: true,
    },
    {
      name: 'Net Commercial Turnover',
      amountUsd: 155850,
      pctNetTurnover: 100.0,
      pctGrossSales: 89.9,
      operationalLogic: 'True top-line operational baseline across Amazon US/UK and Shopify DTC',
      isSubtotal: true,
    },
    {
      name: 'Landed Sourcing COGS (100% Sea Freight)',
      amountUsd: -33230,
      pctNetTurnover: -21.3,
      pctGrossSales: -19.2,
      operationalLogic: 'FOB Bangladesh, ocean freight consolidation via CTG, 0% UK DCTS preferential duty',
      isNegative: true,
    },
    {
      name: 'Packaging, Inserts & Origin QC Audits',
      amountUsd: -5100,
      pctNetTurnover: -3.3,
      pctGrossSales: -2.9,
      operationalLogic: 'Non-woven dust bags, FSC mailers, container desiccant poles, 4x Dhaka AQL 1.5 audits',
      isNegative: true,
    },
    {
      name: 'Fulfillment & Marketplace Platform Fees',
      amountUsd: -34460,
      pctNetTurnover: -22.1,
      pctGrossSales: -19.9,
      operationalLogic: 'Amazon FBA multi-pack fees, 15% referral fee, Shopify Payments processing',
      isNegative: true,
    },
    {
      name: 'Customer Acquisition & Performance Advertising',
      amountUsd: -32670,
      pctNetTurnover: -21.0,
      pctGrossSales: -18.8,
      operationalLogic: 'Amazon PPC (ACOS ≤ 28%), Meta/TikTok UGC video ads (CAC ≤ $18 targeted)',
      isNegative: true,
    },
    {
      name: 'Fixed Dual-Region Overhead & Legal Retainers',
      amountUsd: -5800,
      pctNetTurnover: -3.7,
      pctGrossSales: -3.3,
      operationalLogic: 'UK Ltd + US LLC annual maintenance, GS1 UK barcode allocation, Shopify apps, registered offices',
      isNegative: true,
    },
    {
      name: 'B2C Operating Profit (EBITDA / EBIT)',
      amountUsd: 44590,
      pctNetTurnover: 28.6,
      pctGrossSales: 25.7,
      operationalLogic: 'Pre-Tax Operating Trading Profit from consumer retail channels',
      isSubtotal: true,
    },
    {
      name: 'Corporate Income Tax Provision (~19%)',
      amountUsd: -8472,
      pctNetTurnover: -5.4,
      pctGrossSales: -4.9,
      operationalLogic: 'Tax reserve across jurisdictions (HMRC Small Profits Rate / US Corporate Tax)',
      isNegative: true,
    },
    {
      name: 'Net Retained B2C Profit',
      amountUsd: 36118,
      pctNetTurnover: 23.2,
      pctGrossSales: 20.8,
      operationalLogic: 'Distributable profit or Year 2 expansion working capital reserve',
      isSubtotal: true,
    },
  ],

  // Standalone Year 1 B2B Wholesale Profit & Loss Statement (4,000 Units Target)
  b2bLines: [
    {
      name: 'Gross B2B Wholesale Revenue',
      amountUsd: 60600,
      pctNetTurnover: 100.0,
      operationalLogic: 'Bloom ($18,400) + Mid-Level ($16,500) + Commuter ($15,200) + Economy ($6,500)',
      isSubtotal: true,
    },
    {
      name: 'Factory Production COGS (Dhaka / Savar / Narayanganj)',
      amountUsd: -14840,
      pctNetTurnover: -24.5,
      operationalLogic: 'Leverages consolidated bulk raw-material pricing across 10,000 total corporate units',
      isNegative: true,
    },
    {
      name: 'Consolidated Sea Freight & Destination Drayage',
      amountUsd: -3280,
      pctNetTurnover: -5.4,
      operationalLogic: 'Packed in consolidated 20ft ocean containers alongside B2C stock (zero double-handling)',
      isNegative: true,
    },
    {
      name: 'Custom Tooling, Debossing Dies & Screen Setups',
      amountUsd: -2920,
      pctNetTurnover: -4.8,
      operationalLogic: 'Local screen-printing stencils, brass debossing dies, and custom client woven labels',
      isNegative: true,
    },
    {
      name: 'Bulk Pallet Packaging & Heavy-Duty Cartons',
      amountUsd: -1200,
      pctNetTurnover: -2.0,
      operationalLogic: 'Heavy-duty export corrugated cartons, moisture poly barriers, zero single-unit retail boxes',
      isNegative: true,
    },
    {
      name: 'Wholesale Gross Profit',
      amountUsd: 38360,
      pctNetTurnover: 63.3,
      operationalLogic: 'Wholesale Manufacturing Headroom before sales outbound acquisition',
      isSubtotal: true,
    },
    {
      name: 'Specimen Box Sampling & Express DHL Air Couriers',
      amountUsd: -2200,
      pctNetTurnover: -3.6,
      operationalLogic: '50 physical specimen boxes dispatched via DHL Express to vetted corporate procurement leads',
      isNegative: true,
    },
    {
      name: 'Sales Tech Stack & Account-Based Lead Sourcing',
      amountUsd: -1400,
      pctNetTurnover: -2.3,
      operationalLogic: 'Apollo.io, LinkedIn Sales Navigator, and corporate email verification stack',
      isNegative: true,
    },
    {
      name: 'Sales Commission / Performance Incentive (8%)',
      amountUsd: -4848,
      pctNetTurnover: -8.0,
      operationalLogic: '8% performance commission on closed and collected contract value for sales execution',
      isNegative: true,
    },
    {
      name: 'Compliance Dossiers, Phytosanitary & Bank Wire FX',
      amountUsd: -1600,
      pctNetTurnover: -2.6,
      operationalLogic: 'DAE Phytosanitary testing, Certificate of Origin, and incoming international wire fees',
      isNegative: true,
    },
    {
      name: 'B2B Operating Profit (EBITDA)',
      amountUsd: 28312,
      pctNetTurnover: 46.7,
      operationalLogic: 'Operating Cash Generated directly from wholesale corporate programs',
      isSubtotal: true,
    },
    {
      name: 'Corporate Income Tax Provision (~19%)',
      amountUsd: -5379,
      pctNetTurnover: -8.9,
      operationalLogic: 'Tax reserve on net wholesale earnings across operating legal entities',
      isNegative: true,
    },
    {
      name: 'Net Retained B2B Profit',
      amountUsd: 22933,
      pctNetTurnover: 37.8,
      operationalLogic: 'Distributable capital or retained cash reserve for factory slot expansion',
      isSubtotal: true,
    },
  ],
};

// -------------------------------------------------------------
// B2C Per-Bag Unit Economics & Contribution Margins
// -------------------------------------------------------------

export const B2C_UNIT_ECONOMICS: B2cUnitEconomics[] = [
  {
    skuTier: '1. Bloom Series Satchel',
    blendedRrpUsd: 88.0,
    factoryFobDhakaUsd: 13.8,
    landedSeaCostCifUsd: 16.5,
    pickPackPlatformFeeUsd: 10.3,
    paidAdCacTargetUsd: 18.0,
    netUnitContributionUsd: 43.2,
    contributionMarginPct: 49.1,
    sharePct: 13.3,
    targetUnits: 800,
    channels: '80% Shopify DTC / 20% Amazon',
    optimizationNote: 'Primary Margin Engine: High-AOV luxury hero that absorbs brand acquisition costs (CAC).',
  },
  {
    skuTier: '2. Mid-Level EDC (Geometric & Palm Leaf)',
    blendedRrpUsd: 29.0,
    factoryFobDhakaUsd: 3.8,
    landedSeaCostCifUsd: 4.8,
    pickPackPlatformFeeUsd: 6.8,
    paidAdCacTargetUsd: 5.5,
    netUnitContributionUsd: 11.9,
    contributionMarginPct: 41.0,
    sharePct: 25.0,
    targetUnits: 1500,
    channels: '50% Amazon FBA / 50% Shopify DTC',
    optimizationNote: 'Utility Core: Commuter laptop workhorses with zip closures, balanced for organic search volume.',
  },
  {
    skuTier: '3. Commuter Shopper (Natural, Navy, Crimson)',
    blendedRrpUsd: 18.0,
    factoryFobDhakaUsd: 3.15,
    landedSeaCostCifUsd: 4.1,
    pickPackPlatformFeeUsd: 4.8,
    paidAdCacTargetUsd: 3.2,
    netUnitContributionUsd: 5.9,
    contributionMarginPct: 32.8,
    sharePct: 40.0,
    targetUnits: 2400,
    channels: '75% Amazon FBA / 25% Shopify DTC',
    optimizationNote: 'Cash Velocity Anchor: Fast-moving search engine driving rapid cash recycling; 60% sold as 2-packs on Amazon.',
  },
  {
    skuTier: '4. Economy Canvas (Wave & Botanical Graphic)',
    blendedRrpUsd: 12.5,
    factoryFobDhakaUsd: 1.6,
    landedSeaCostCifUsd: 2.3,
    pickPackPlatformFeeUsd: 3.5,
    paidAdCacTargetUsd: 1.8,
    netUnitContributionUsd: 4.9,
    contributionMarginPct: 39.2,
    sharePct: 21.7,
    targetUnits: 1300,
    channels: '70% Amazon FBA / 30% Shopify DTC',
    optimizationNote: 'Impulse Conversion: Plastic-bag alternative; sold strictly as 2-packs on Amazon to cut pick/pack fees by 50%.',
  },
];

// -------------------------------------------------------------
// B2B Wholesale Unit Economics by Category
// -------------------------------------------------------------

export const B2B_UNIT_ECONOMICS: B2bUnitEconomics[] = [
  {
    category: 'Bloom Satchel / Folio',
    targetUnits: 400,
    wholesalePriceUsd: 46.0,
    bangladeshProductionCogsUsd: 13.5,
    oceanFreightDrayageUsd: 1.8,
    brandingScreenPrintUsd: 1.5,
    grossUnitProfitUsd: 29.2,
    grossMarginPct: 63.5,
    targetClientSegment: 'Tech, Fintech & VC Firms (London City & Silicon Alley NY)',
    buyerPersona: 'Head of People, Workplace Ops, VP Talent',
    moqUnits: '100 – 250 units',
  },
  {
    category: 'Mid-Level EDC',
    targetUnits: 1000,
    wholesalePriceUsd: 16.5,
    bangladeshProductionCogsUsd: 3.5,
    oceanFreightDrayageUsd: 0.9,
    brandingScreenPrintUsd: 0.8,
    grossUnitProfitUsd: 11.3,
    grossMarginPct: 68.5,
    targetClientSegment: 'Tech Onboarding & Institutional Programs',
    buyerPersona: 'People Operations & Employer Brand Leads',
    moqUnits: '100 – 250 units',
  },
  {
    category: 'Commuter Shopper (Jute-Cotton)',
    targetUnits: 1600,
    wholesalePriceUsd: 9.5,
    bangladeshProductionCogsUsd: 2.8,
    oceanFreightDrayageUsd: 0.7,
    brandingScreenPrintUsd: 0.65,
    grossUnitProfitUsd: 5.35,
    grossMarginPct: 56.3,
    targetClientSegment: 'Hospitality & Dining (Boutique Hotels, High-End Dining)',
    buyerPersona: 'Procurement Director, Retail/Merch Lead',
    moqUnits: '300 – 1,000 units',
  },
  {
    category: 'Economy Canvas',
    targetUnits: 1000,
    wholesalePriceUsd: 6.5,
    bangladeshProductionCogsUsd: 1.45,
    oceanFreightDrayageUsd: 0.55,
    brandingScreenPrintUsd: 0.5,
    grossUnitProfitUsd: 4.0,
    grossMarginPct: 61.5,
    targetClientSegment: 'Independent Retail & Boutiques (Eco-retailers, Roasteries)',
    buyerPersona: 'Store Owner, Merchandising Manager',
    moqUnits: '150 – 500 units',
  },
];

// -------------------------------------------------------------
// Working Capital & Day-0 Equity Runway
// -------------------------------------------------------------

export const WORKING_CAPITAL_RUNWAY: WorkingCapitalRunwayItem[] = [
  {
    category: 'Batch 1 Sea Manufacturing (FOB)',
    amountUsd: 4900,
    amountGbp: 3820,
    purpose: 'Factory deposit and cutting allocation for initial 1,000 units',
    timing: 'Day 0 (Pre-production)',
  },
  {
    category: 'Ocean Freight & Port Drayage (CTG to LHR/NY)',
    amountUsd: 1200,
    amountGbp: 935,
    purpose: 'Consolidated LCL container shipment and origin terminal handling',
    timing: 'Day 20 (Bill of Lading issuance)',
  },
  {
    category: 'Legal, GS1 Barcodes & Corporate Setup',
    amountUsd: 1600,
    amountGbp: 1250,
    purpose: 'UK Ltd + US LLC maintenance, GS1 UK prefix license, registered offices',
    timing: 'Day 0 (Initial formation)',
  },
  {
    category: 'Studio & UGC Creative Production',
    amountUsd: 2000,
    amountGbp: 1560,
    purpose: 'Professional product photography, lifestyle shoots, video creative assets',
    timing: 'Day 10 (Ahead of vessel arrival)',
  },
  {
    category: 'Launch Media Runway (PPC & Paid Social)',
    amountUsd: 3000,
    amountGbp: 2340,
    purpose: 'Testing budget for Amazon PPC and Meta/TikTok UGC performance ads',
    timing: 'Day 45 (Warehouse landing)',
  },
  {
    category: 'Emergency Working Capital Reserve',
    amountUsd: 1800,
    amountGbp: 1400,
    purpose: 'Contingency buffer for customs documentation fees, demurrages, or FX variance',
    timing: 'Continuous liquidity reserve',
  },
];

// -------------------------------------------------------------
// Quarterly Staged Production & Shipping Cadence (Sea Freight)
// -------------------------------------------------------------

export const QUARTERLY_BATCH_PLANS: QuarterlyBatchPlan[] = [
  {
    batchNumber: 1,
    name: 'Batch 1: Seed & Index',
    months: 'Months 1–3',
    totalUnits: 1000,
    bloomUnits: 150,
    midLevelUnits: 250,
    commuterUnits: 400,
    economyUnits: 200,
    fundingMechanism: 'Funded via Day-0 Equity ($14,500 total runway)',
    logisticsAllocation: 'LCL ocean freight split directly from Chittagong (600 NY / 400 London)',
    reorderTriggerDay: 35,
    leadTimeDays: '55–65 Days',
    status: 'COMPLETED',
  },
  {
    batchNumber: 2,
    name: 'Batch 2: Summer Ramp',
    months: 'Months 4–6',
    totalUnits: 1600,
    bloomUnits: 200,
    midLevelUnits: 400,
    commuterUnits: 650,
    economyUnits: 350,
    fundingMechanism: 'Net-60 Intercompany credit from ArielMC BD + Month 1–2 sales receipts',
    logisticsAllocation: 'LCL/FCL Sea freight consolidated to London Gateway and Port of NY/NJ',
    reorderTriggerDay: 35,
    leadTimeDays: '55–65 Days',
    status: 'IN_PRODUCTION',
  },
  {
    batchNumber: 3,
    name: 'Batch 3: Autumn Commute',
    months: 'Months 7–9',
    totalUnits: 1700,
    bloomUnits: 225,
    midLevelUnits: 425,
    commuterUnits: 700,
    economyUnits: 350,
    fundingMechanism: '100% Self-Funding Loop (Rolling 14-day Amazon disbursements)',
    logisticsAllocation: 'Positions safety stock ahead of late-summer peak maritime rate hikes',
    reorderTriggerDay: 35,
    leadTimeDays: '55–65 Days',
    status: 'SCHEDULED',
  },
  {
    batchNumber: 4,
    name: 'Batch 4: Q4 Gifting Surge',
    months: 'Months 10–12',
    totalUnits: 1700,
    bloomUnits: 225,
    midLevelUnits: 425,
    commuterUnits: 650,
    economyUnits: 400,
    fundingMechanism: 'Self-funded working capital + B2B upfront 50% deposits',
    logisticsAllocation: 'Capitalizes on holiday gifting bundles on Shopify DTC and corporate B2B orders',
    reorderTriggerDay: 35,
    leadTimeDays: '55–65 Days',
    status: 'SCHEDULED',
  },
];
