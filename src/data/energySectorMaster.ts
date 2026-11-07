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
  regulator: 'Bangladesh Bank & Ministry of Power',
  schemeName: 'Green Transformation Fund (GTF) & Tk 1,500 Cr Solar Allocation Fund',
  maxDebtSharePct: 80,
  minEquitySharePct: 20,
  concessionaryInterestRatePct: 4.5,
  loanTenureYears: '7 to 10 Years',
  gracePeriodMonths: 12, // 1-Year Full Grace on Principal & Interest
  eligibleSectors: ['RMG & Textiles', 'Spinning Mills', 'Leather Tanneries', 'Ceramics', 'Commercial Buildings', 'Cold Storage'],
  disbursingPFIs: ['IDCOL', 'BIFFL', 'BRAC Bank', 'Eastern Bank (EBL)', 'City Bank', 'Prime Bank', 'Bank Asia'],
};

export const GOVERNMENT_FINANCING_PROGRAMS = [
  {
    code: 'PROGRAM_1_SOLAR_ALLOCATION_FUND',
    name: 'Tk 1,500 Crore Solar Allocation Fund (Special Ordinance-2026)',
    fundingBacking: 'World Bank ($500M) + AIIB ($500M) + ADB ($250M)',
    debtCoverage: 'Up to 80% Project Debt',
    interestRate: '4.5% to 5.5% p.a. Fixed',
    tenure: '10-Year Tenure with 1-Year Complete Grace Period',
    clientAdvantage: 'Tk 0 principal & interest for Months 1–12; Year-1 bill savings (~Tk 80L on 500 kWp) fully reimburse initial 20% equity.',
  },
  {
    code: 'PROGRAM_2_BB_GREEN_TRANSFORMATION',
    name: 'Bangladesh Bank Green Transformation Fund (GTF) & Refinancing Scheme',
    fundingBacking: 'Bangladesh Bank 5% Mandatory Green Finance Target on Scheduled Commercial Banks',
    debtCoverage: '70% to 80% Turnkey CapEx',
    interestRate: '4.0% to 5.5% p.a. (1%–2% BB Base Refinance)',
    tenure: '7 to 10 Years (84 Monthly EMIs)',
    clientAdvantage: 'Fast-track sanction via Bank Sustainable Finance Departments (SFD) at BRAC, EBL, City Bank, Bank Asia.',
  },
  {
    code: 'PROGRAM_3_ZERO_CAPEX_PPA_SPV',
    name: 'Zero-CapEx Power Purchase Agreement (PPA / OPEX Model)',
    fundingBacking: '100% SPV Funded via IDCOL / Bank SFD Concessionary Green Loan',
    debtCoverage: '80% Non-Recourse Debt / 20% SPV Equity (Funded via Ariel Margin-as-Equity)',
    interestRate: '4.0% to 6.0% p.a. over 10 Years',
    tenure: '15 to 20-Year PPA Contract',
    clientAdvantage: 'Client invests Tk 0 and buys solar power at a 15%–20% discount to grid tariff (Tk 8.80–9.20/kWh) with zero balance sheet liability.',
  },
];

export const SUBCONTRACTOR_WHITE_LABEL_PARTNERSHIP = {
  hubs: [
    {
      region: 'Dhaka / Gazipur / Savar',
      sredaGrade: 'Grade-A Enlisted EPC Firm',
      installationRateBdtPerKwp: 3200,
      utilityLiaisonFeeBdt: 45000,
      freeAuditDeliverables: ['3D LiDAR / RTK Drone Shading Scan', 'PVsyst / HelioScope Yield Report', '4-Page Bespoke Roof Dossier'],
    },
    {
      region: 'Chattogram / CEPZ / Narayanganj',
      sredaGrade: 'Grade-A Enlisted EPC Firm',
      installationRateBdtPerKwp: 3400,
      utilityLiaisonFeeBdt: 45000,
      freeAuditDeliverables: ['3D LiDAR / RTK Drone Shading Scan', 'PVsyst / HelioScope Yield Report', '4-Page Bespoke Roof Dossier'],
    },
  ],
  milestones: [
    { stage: 'Mobilization', pct: 20, description: 'Payable upon site possession (~Tk 3.5L on 500 kWp from client 30% advance)' },
    { stage: 'Structure & Module Mounting', pct: 40, description: 'Payable upon physical mechanical completion' },
    { stage: 'Electrical Termination & Inverter Synch', pct: 25, description: 'Payable upon cable termination and cold commissioning' },
    { stage: 'Performance Retention', pct: 15, description: 'Held for 60 days post-COD contingent on PR ≥ 80% and zero roof leaks' },
  ],
  contractualShields: {
    whiteLabelMandate: 'Subcontractor crew must wear Ariel Renewable Energy branded PPE vests and helmets on site.',
    nonCircumventionPenaltyBdt: 5000000, // Tk 50 Lakh strict penalty against direct client solicitation
  },
};

export const CUSTOMS_SRO_159_COMPLIANCE = {
  statute: 'NBR SRO No. 159-Law/2026/14/Customs',
  tariffBenefit: 'Slashes import duty from ~17% to 0%–1%, saving ~16% on total project CapEx',
  hsCodeMatrix: [
    { item: 'Solar PV Modules / Panels (Assembled)', hsCode: '8541.43.00', totalTaxPct: '0% – 1.0%', rule: 'Must attach SREDA certification' },
    { item: 'Photovoltaic Cells (Unassembled/Wafer)', hsCode: '8541.42.00', totalTaxPct: '0.0%', rule: 'Exempt from all duties' },
    { item: 'Solar Inverters (String/Central/Hybrid)', hsCode: '8504.40.90', totalTaxPct: '1.0%', rule: 'Invoice & LC must explicitly state Solar Photovoltaic Inverter' },
    { item: 'Lithium-Ion / LiFePO4 BESS Packs', hsCode: '8507.60.00', totalTaxPct: '1.0%', rule: 'Must state Lithium-Ion Battery Cells for Solar Energy Storage' },
    { item: 'Aluminum Mounting Profiles (If Imported)', hsCode: '7610.90.00', totalTaxPct: '58.6%', rule: 'DO NOT IMPORT. Source 100% locally from Kai/Altech/PHP.' },
  ],
  clientErqMechanism: 'Export factory clients open USD import LC directly via their Export Retention Quota (ERQ) account, eliminating 100% of Ariel LC limit and forex risk.',
};

export const REGULATORY_CUTOFF_DEADLINE = {
  cutoffDate: 'February 28, 2027',
  statutoryDirective: 'Power Division September 1, 2026 Net-Metering Policy',
  incentive: 'Guaranteed Tk 10.50/kWh cash buyback rate for weekend/holiday surplus power exported to the grid, settled quarterly in cash until Feb 28, 2030.',
  estimatedYieldOn500kWp: 'Tk 12.70 Lakh / Year on 65 non-working days',
};

export const ENERGY_OFFICIAL_COLLATERALS = [
  {
    code: 'AREL-OPS-2026-MSTR-V1',
    title: 'Ariel Renewable Energy: Master Operations, Sourcing & Logistics Blueprint (6-Page Executive PDF)',
    pdfUrl: '/documents/AREL_OPS_2026_MSTR_V1_Operations_Sourcing_Logistics_Blueprint.pdf',
    pages: 6,
    status: 'ACTIVE_APPROVED',
    category: 'OPERATIONS_MASTER',
  },
  {
    code: 'AREL-EXEC-2026-INT-B1',
    title: 'Government Loans & Zero-Capital Lead Execution Blueprint (Internal Treasury Playbook)',
    pdfUrl: '/documents/AREL_EXEC_2026_INT_B1_Zero_Capital_Blueprint.pdf',
    pages: 2,
    status: 'ACTIVE_APPROVED',
    category: 'TREASURY_INTERNAL',
  },
  {
    code: 'AREL-FIN-2026-CLIENT-A1',
    title: 'Government Green Financing & Zero-Working-Capital Solar Proposal (Client-Facing C-Suite Brief)',
    pdfUrl: '/documents/AREL_FIN_2026_CLIENT_A1_Green_Financing_Proposal.pdf',
    pages: 2,
    status: 'ACTIVE_APPROVED',
    category: 'CLIENT_PROPOSAL',
  },
  {
    code: 'AREL-FIN-2026-MSTR-V1',
    title: 'Solar Business in Bangladesh: Financial Models, Incentives & Master User Guide',
    pdfUrl: '/documents/Solar_Business_in_Bangladesh_Master_Financial_Guide.pdf',
    pages: 11,
    status: 'ACTIVE_APPROVED',
    category: 'REGULATORY_MASTER',
  },
  {
    code: 'DOC-BD-SOLAR-BOARDROOM-DOSSIER',
    title: 'Ariel Energy Boardroom Solar EPC Dossier (Submittable C-Suite Brief)',
    pdfUrl: '/documents/Ariel_Energy_Boardroom_Solar_EPC_Dossier.pdf',
    docxUrl: '/documents/Ariel_Energy_Boardroom_Solar_EPC_Dossier.docx',
    pages: 14,
    status: 'ACTIVE_APPROVED',
    category: 'CLIENT_DOSSIER',
  },
  {
    code: 'DOC-BD-SOLAR-BOARDROOM-SLIDES',
    title: 'Ariel Energy Boardroom Slide Deck (12 Slides, 16:9 Widescreen)',
    pdfUrl: '/documents/Ariel_Energy_Boardroom_Presentation_Deck.pdf',
    pptxUrl: '/documents/Ariel_Energy_Boardroom_Presentation_Deck.pptx',
    slides: 12,
    status: 'ACTIVE_APPROVED',
    category: 'PRESENTATION',
  },
  {
    code: 'DOC-BD-SOLAR-LETTERHEAD',
    title: 'Ariel Energy Official Corporate Letterhead Template',
    pdfUrl: '/documents/Ariel_Energy_Official_Corporate_Letterhead.pdf',
    docxUrl: '/documents/Ariel_Energy_Official_Corporate_Letterhead.docx',
    pages: 1,
    status: 'ACTIVE_APPROVED',
    category: 'TEMPLATE',
  },
  {
    code: 'DOC-BD-SOLAR-QUOTATION-1PAGE',
    title: 'Ariel Energy 1-Page Turnkey Solar EPC Commercial Quotation Template',
    pdfUrl: '/documents/Ariel_Energy_1_Page_Solar_EPC_Quotation_Template.pdf',
    docxUrl: '/documents/Ariel_Energy_1_Page_Solar_EPC_Quotation_Template.docx',
    pages: 1,
    status: 'ACTIVE_APPROVED',
    category: 'QUOTATION',
  },
];


