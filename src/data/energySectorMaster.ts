/**
 * ArielMC Enterprise Eco-System — ERP Master Source of Truth
 * Official Entity: Ariel Renewable Energy Limited
 * Sector: Energy | Product: Solar
 * Official Corporate Tagline: Sovereign Green Infrastructure & Industrial Decarbonization
 * Primary Domain: energy.arielmc.com | Command Hub: energy.arielmc.com/crm
 */

export const ARIEL_ENERGY_BRAND_IDENTITY = {
  legalEntity: 'Ariel Renewable Energy Limited',
  brandName: 'ArielMC',
  officialTagline: 'Sovereign Green Infrastructure & Industrial Decarbonization',
  parentAffiliation: 'A Member of the ArielMC Enterprise Eco-System',
  prestigeLockup: [
    'Ariel Renewable Energy Limited',
    'Sovereign Green Infrastructure & Industrial Decarbonization',
    'A Member of the ArielMC Enterprise Eco-System',
  ],
  sector: 'Energy',
  product: 'Solar',
  primaryDomain: 'energy.arielmc.com',
  commandHub: 'energy.arielmc.com/crm',
  headquarters: 'Ariel House, Level 7, Plot 14, Road 11, Banani, Dhaka-1213, Bangladesh',
  sredaAccreditation: 'SREDA Registered Turnkey Solar EPC Partner',
  incorporationReg: 'C-194820',
};

export interface SolarPackagePricing {
  packageCode: string;
  title: string;
  customerCategory: 'FACTORY' | 'COMMERCIAL' | 'HOUSEHOLD';
  capacityKwp: number;
  estRoofAreaSqFt: number;
  estMonthlyYieldKwh: string;
  gridTopology: string;
  turnkeyRateBdtPerWp: number;
  turnkeyRateUsdPerWp: number;
  totalTurnkeyCostBdt: number;
  totalTurnkeyCostUsd: number;
  simplePaybackYears: number;
  estimatedIrrPct: number;
  amortizedLcoeBdtPerKwh: number;
  bomDistribution: {
    pvModulesPct: number;
    invertersSwitchgearPct: number;
    mountingStructurePct: number;
    cablesTraysPct: number;
    substationEarthingPct: number;
    civilInstallationPct: number;
    engineeringSredaPct: number;
  };
}

export const ENERGY_SECTOR_PACKAGES: SolarPackagePricing[] = [
  {
    packageCode: 'F1',
    title: 'Industrial Base-Load Offset (300 kWp)',
    customerCategory: 'FACTORY',
    capacityKwp: 300,
    estRoofAreaSqFt: 24000,
    estMonthlyYieldKwh: '36,000 – 39,000 kWh',
    gridTopology: '400V LT / 11kV HT Net-Metering',
    turnkeyRateBdtPerWp: 52.00,
    turnkeyRateUsdPerWp: 0.433,
    totalTurnkeyCostBdt: 15600000,
    totalTurnkeyCostUsd: 130000,
    simplePaybackYears: 3.2,
    estimatedIrrPct: 31.5,
    amortizedLcoeBdtPerKwh: 3.20,
    bomDistribution: {
      pvModulesPct: 43,
      invertersSwitchgearPct: 18,
      mountingStructurePct: 12,
      cablesTraysPct: 8,
      substationEarthingPct: 6,
      civilInstallationPct: 7,
      engineeringSredaPct: 6,
    },
  },
  {
    packageCode: 'F2',
    title: 'Megawatt Flagship Net-Metering (1.0 MWp)',
    customerCategory: 'FACTORY',
    capacityKwp: 1000,
    estRoofAreaSqFt: 78000,
    estMonthlyYieldKwh: '125,000 – 135,000 kWh',
    gridTopology: '11kV / 33kV Substation Interconnection',
    turnkeyRateBdtPerWp: 49.00,
    turnkeyRateUsdPerWp: 0.408,
    totalTurnkeyCostBdt: 49000000,
    totalTurnkeyCostUsd: 408300,
    simplePaybackYears: 3.0,
    estimatedIrrPct: 34.0,
    amortizedLcoeBdtPerKwh: 3.10,
    bomDistribution: {
      pvModulesPct: 43,
      invertersSwitchgearPct: 18,
      mountingStructurePct: 12,
      cablesTraysPct: 8,
      substationEarthingPct: 6,
      civilInstallationPct: 7,
      engineeringSredaPct: 6,
    },
  },
  {
    packageCode: 'F3',
    title: 'Net-Zero Multi-Roof Heavy Industrial (2.5 MWp)',
    customerCategory: 'FACTORY',
    capacityKwp: 2500,
    estRoofAreaSqFt: 200000,
    estMonthlyYieldKwh: '315,000 – 340,000 kWh',
    gridTopology: '33kV Dedicated Express Feeder + SCADA',
    turnkeyRateBdtPerWp: 47.50,
    turnkeyRateUsdPerWp: 0.395,
    totalTurnkeyCostBdt: 118750000,
    totalTurnkeyCostUsd: 989500,
    simplePaybackYears: 2.85,
    estimatedIrrPct: 36.2,
    amortizedLcoeBdtPerKwh: 2.95,
    bomDistribution: {
      pvModulesPct: 44,
      invertersSwitchgearPct: 18,
      mountingStructurePct: 12,
      cablesTraysPct: 8,
      substationEarthingPct: 6,
      civilInstallationPct: 6,
      engineeringSredaPct: 6,
    },
  },
  {
    packageCode: 'C1',
    title: 'Corporate Office Tower Rooftop (75 kWp)',
    customerCategory: 'COMMERCIAL',
    capacityKwp: 75,
    estRoofAreaSqFt: 6000,
    estMonthlyYieldKwh: '9,000 – 10,000 kWh',
    gridTopology: '400V LT Grid Synchronized (Ballasted)',
    turnkeyRateBdtPerWp: 62.00,
    turnkeyRateUsdPerWp: 0.516,
    totalTurnkeyCostBdt: 4650000,
    totalTurnkeyCostUsd: 38750,
    simplePaybackYears: 3.1,
    estimatedIrrPct: 33.5,
    amortizedLcoeBdtPerKwh: 3.35,
    bomDistribution: {
      pvModulesPct: 42,
      invertersSwitchgearPct: 19,
      mountingStructurePct: 14,
      cablesTraysPct: 8,
      substationEarthingPct: 5,
      civilInstallationPct: 6,
      engineeringSredaPct: 6,
    },
  },
  {
    packageCode: 'C2',
    title: 'Retail Mall & Hospital Net-Metering (200 kWp)',
    customerCategory: 'COMMERCIAL',
    capacityKwp: 200,
    estRoofAreaSqFt: 16000,
    estMonthlyYieldKwh: '25,000 – 27,000 kWh',
    gridTopology: '11kV HT Substation Net-Metering',
    turnkeyRateBdtPerWp: 58.00,
    turnkeyRateUsdPerWp: 0.483,
    totalTurnkeyCostBdt: 11600000,
    totalTurnkeyCostUsd: 96600,
    simplePaybackYears: 2.9,
    estimatedIrrPct: 35.8,
    amortizedLcoeBdtPerKwh: 3.20,
    bomDistribution: {
      pvModulesPct: 43,
      invertersSwitchgearPct: 18,
      mountingStructurePct: 13,
      cablesTraysPct: 8,
      substationEarthingPct: 6,
      civilInstallationPct: 6,
      engineeringSredaPct: 6,
    },
  },
  {
    packageCode: 'H1',
    title: 'Urban Villa Micro-Array (10 kWp Grid-Tied)',
    customerCategory: 'HOUSEHOLD',
    capacityKwp: 10,
    estRoofAreaSqFt: 800,
    estMonthlyYieldKwh: '1,200 – 1,350 kWh',
    gridTopology: '230V Single-Phase / 400V Three-Phase LT',
    turnkeyRateBdtPerWp: 75.00,
    turnkeyRateUsdPerWp: 0.625,
    totalTurnkeyCostBdt: 750000,
    totalTurnkeyCostUsd: 6250,
    simplePaybackYears: 4.2,
    estimatedIrrPct: 24.5,
    amortizedLcoeBdtPerKwh: 3.65,
    bomDistribution: {
      pvModulesPct: 45,
      invertersSwitchgearPct: 20,
      mountingStructurePct: 12,
      cablesTraysPct: 8,
      substationEarthingPct: 5,
      civilInstallationPct: 5,
      engineeringSredaPct: 5,
    },
  },
];

export const GREEN_REFINANCING_FRAMEWORK = {
  regulator: 'Bangladesh Bank',
  schemeName: 'Green Transformation Fund (GTF) & SREDA Solar Window',
  maxDebtSharePct: 80,
  minEquitySharePct: 20,
  concessionaryInterestRatePct: 4.5,
  loanTenureYears: '5 to 7 Years',
  gracePeriodMonths: 6,
  eligibleSectors: ['RMG', 'Textiles', 'Leather Goods', 'Jute Mills', 'Ceramics', 'Commercial Buildings'],
};

export const ENERGY_OFFICIAL_COLLATERALS = [
  {
    code: 'DOC-BD-SOLAR-BOARDROOM-DOSSIER',
    title: 'Ariel Energy Boardroom Solar EPC Dossier (Submittable C-Suite Brief)',
    pdfUrl: '/documents/Ariel_Energy_Boardroom_Solar_EPC_Dossier.pdf',
    docxUrl: '/documents/Ariel_Energy_Boardroom_Solar_EPC_Dossier.docx',
    pages: 14,
    status: 'ACTIVE_APPROVED',
  },
  {
    code: 'DOC-BD-SOLAR-BOARDROOM-SLIDES',
    title: 'Ariel Energy Boardroom Slide Deck (12 Slides, 16:9 Widescreen)',
    pdfUrl: '/documents/Ariel_Energy_Boardroom_Presentation_Deck.pdf',
    pptxUrl: '/documents/Ariel_Energy_Boardroom_Presentation_Deck.pptx',
    slides: 12,
    status: 'ACTIVE_APPROVED',
  },
  {
    code: 'DOC-BD-SOLAR-LETTERHEAD',
    title: 'Ariel Energy Official Corporate Letterhead Template',
    pdfUrl: '/documents/Ariel_Energy_Official_Corporate_Letterhead.pdf',
    docxUrl: '/documents/Ariel_Energy_Official_Corporate_Letterhead.docx',
    pages: 1,
    status: 'ACTIVE_APPROVED',
  },
  {
    code: 'DOC-BD-SOLAR-QUOTATION-1PAGE',
    title: 'Ariel Energy 1-Page Turnkey Solar EPC Commercial Quotation Template',
    pdfUrl: '/documents/Ariel_Energy_1_Page_Solar_EPC_Quotation_Template.pdf',
    docxUrl: '/documents/Ariel_Energy_1_Page_Solar_EPC_Quotation_Template.docx',
    pages: 1,
    status: 'ACTIVE_APPROVED',
  },
];


