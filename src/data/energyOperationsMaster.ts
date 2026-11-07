/**
 * Ariel Renewable Energy Limited — Operations, Sourcing & Logistics Master
 * Document Reference: AREL-OPS-2026-MSTR-V1
 * Entity: Ariel Renewable Energy Limited (ArielMC Enterprise Eco-System)
 * Portals: energy.arielmc.com | erp.arielmc.com
 */

export interface DetailedBomItem {
  itemNo: string;
  component: string;
  specification: string;
  makeModel: string;
  quantity: number;
  unit: string;
  warrantyPeriod: string;
  expectedLifetimeYears: number;
  estimatedCostPct: number;
  origin: string;
}

export interface DetailedPackageBom {
  packageCode: 'F1' | 'F2' | 'F3' | 'C1' | 'C2' | 'H1' | 'H2';
  title: string;
  sector: 'FACTORY' | 'COMMERCIAL' | 'HOUSEHOLD';
  capacityDcKwp: number;
  inverterAcKw: number;
  estRoofAreaSqFt: number;
  estMonthlyYieldKwh: string;
  amortizedLcoeBdtPerKwh: number;
  items: DetailedBomItem[];
}

export interface GlobalSourcingVendor {
  category: 'PV_MODULES' | 'INVERTERS' | 'BESS' | 'MOUNTING_STRUCTURE' | 'CABLES' | 'SUBSTATION';
  manufacturer: string;
  country: string;
  flagshipModel: string;
  technologyOrGrade: string;
  maxEfficiencyPct?: number;
  tempCoeffPctPerC?: number;
  bnefTier1Rank: boolean;
  dhakaOfficePresence: string;
  wholesalePriceBenchmark: string;
  moq: string;
  standardWarranty: string;
  localRmaTurnaroundTime: string;
}

export interface LogisticsRoutePlan {
  stage: string;
  origin: string;
  destination: string;
  transportMode: string;
  typicalDuration: string;
  hsCodeApplicable: string;
  dutyRateSro159: string;
  riskMitigation: string;
}

// -------------------------------------------------------------
// 1. ITEMIZED BOM FOR ALL 7 PACKAGES
// -------------------------------------------------------------
export const DETAILED_PACKAGE_BOMS: Record<string, DetailedPackageBom> = {
  F1: {
    packageCode: 'F1',
    title: 'Industrial Base-Load Offset (300 kWp)',
    sector: 'FACTORY',
    capacityDcKwp: 300,
    inverterAcKw: 240,
    estRoofAreaSqFt: 24000,
    estMonthlyYieldKwh: '36,000 – 39,000 kWh',
    amortizedLcoeBdtPerKwh: 3.20,
    items: [
      {
        itemNo: '1.01',
        component: 'N-Type TOPCon Bifacial Dual-Glass PV Modules',
        specification: '620Wp, 23.0% efficiency, 2.0+2.0mm heat-strengthened glass, 80% bifaciality',
        makeModel: 'Jinko Tiger Neo 72HL4-BDV / Longi Hi-MO 7 (Tier-1)',
        quantity: 484,
        unit: 'Pcs',
        warrantyPeriod: '15-Yr Workmanship / 30-Yr Linear (87.4% Power)',
        expectedLifetimeYears: 30,
        estimatedCostPct: 43.0,
        origin: 'China (Direct Tier-1 Import via Client ERQ LC)',
      },
      {
        itemNo: '1.02',
        component: 'C&I Three-Phase Grid-Tied String Inverter (110 kW)',
        specification: '110 kW AC, 98.6% efficiency, 10 MPPTs, Built-in AFCI & Type II DC/AC SPD',
        makeModel: 'Sungrow SG110CX-P2 / Huawei SUN2000-100KTL-M2',
        quantity: 2,
        unit: 'Units',
        warrantyPeriod: '5-Yr Standard + 5-Yr Extended Factory Warranty',
        expectedLifetimeYears: 20,
        estimatedCostPct: 13.5,
        origin: 'China (Authorized Bangladesh Liaison Center)',
      },
      {
        itemNo: '1.03',
        component: 'C&I Three-Phase String Inverter (40 kW)',
        specification: '40 kW AC, 4 MPPTs, balance inverter for array symmetry',
        makeModel: 'Sungrow SG40CX / Huawei SUN2000-40KTL',
        quantity: 1,
        unit: 'Unit',
        warrantyPeriod: '5-Yr Standard + 5-Yr Extended Factory Warranty',
        expectedLifetimeYears: 20,
        estimatedCostPct: 4.5,
        origin: 'China',
      },
      {
        itemNo: '1.04',
        component: 'Aluminum Mounting Structure & Seam Clamps',
        specification: 'Anodized 6063-T6 Aluminum (15–20 µm), Non-penetrative clamps for PEB sheet',
        makeModel: 'Kai Aluminum / Altech Aluminum Extrusions',
        quantity: 300,
        unit: 'kWp',
        warrantyPeriod: '15-Yr Structural Anti-Corrosion Guarantee',
        expectedLifetimeYears: 30,
        estimatedCostPct: 12.0,
        origin: 'Bangladesh (100% Local Extrusion, Zero Duty)',
      },
      {
        itemNo: '1.05',
        component: 'Fasteners & Joinery Accessories',
        specification: 'SUS304 Stainless Steel bolts, serrated flange nuts, EPDM isolation pads',
        makeModel: 'SUS304 / A2-70 Industrial Grade',
        quantity: 2800,
        unit: 'Sets',
        warrantyPeriod: '25-Yr Anti-Rust Guarantee',
        expectedLifetimeYears: 30,
        estimatedCostPct: 2.0,
        origin: 'Bangladesh / Import',
      },
      {
        itemNo: '1.06',
        component: 'Solar DC Cable (1500V DC Rated)',
        specification: '1×4mm² & 1×6mm² Tinned Copper, Cross-linked XLPO, Halogen-Free UV Resistant',
        makeModel: 'KBE Solar (Germany) / Lapp Group / BRB Solar',
        quantity: 4200,
        unit: 'Mtr',
        warrantyPeriod: '25-Yr Weather & UV Resistance Guarantee',
        expectedLifetimeYears: 30,
        estimatedCostPct: 4.5,
        origin: 'Germany / Bangladesh',
      },
      {
        itemNo: '1.07',
        component: 'Heavy-Duty AC Armored Cable',
        specification: '3.5 Core 185mm² / 240mm² Copper XLPE, 0.6/1kV steel tape armored',
        makeModel: 'BBS Cables / BRB Cable Industries (BSTI Certified)',
        quantity: 280,
        unit: 'Mtr',
        warrantyPeriod: '10-Yr Manufacturer Warranty',
        expectedLifetimeYears: 30,
        estimatedCostPct: 3.5,
        origin: 'Bangladesh',
      },
      {
        itemNo: '1.08',
        component: 'DC Combiner & Surge Protection Box',
        specification: 'IP66 UV rated, Type II SPD 1500V DC, 16A DC fuses, rotary isolators',
        makeModel: 'Schneider Electric / Suntree / ZJBENY',
        quantity: 6,
        unit: 'Units',
        warrantyPeriod: '5-Yr Replacement Warranty',
        expectedLifetimeYears: 20,
        estimatedCostPct: 2.5,
        origin: 'France / China',
      },
      {
        itemNo: '1.09',
        component: 'AC Distribution LT Panel',
        specification: '630A 4-Pole Motorized MCCB with Microprocessor Trip, Class I+II SPD',
        makeModel: 'ABB / Schneider Electric / Siemens Components',
        quantity: 1,
        unit: 'Set',
        warrantyPeriod: '5-Yr Industrial Switchgear Warranty',
        expectedLifetimeYears: 25,
        estimatedCostPct: 4.5,
        origin: 'Local Panel Assembly / OEM Switchgear',
      },
      {
        itemNo: '1.10',
        component: 'Lightning Protection & Chemical Earthing Station',
        specification: 'Copper-bonded earth electrodes (20mm×3m), 25×3mm pure copper tape, Earth R < 1Ω',
        makeModel: 'Erico ERITECH / Pure Electrolytic Copper',
        quantity: 1,
        unit: 'Lot',
        warrantyPeriod: '15-Yr System Guarantee',
        expectedLifetimeYears: 30,
        estimatedCostPct: 3.0,
        origin: 'Bangladesh / USA',
      },
      {
        itemNo: '1.11',
        component: 'SCADA Weather Station & Ariel-SaaS™ Telemetry Hub',
        specification: 'Class-A Pyranometer, module temp sensor, wind anemometer, 4G cloud gateway',
        makeModel: 'Ariel-SaaS™ Industrial IoT Gate + Kipp & Zonen sensor',
        quantity: 1,
        unit: 'Set',
        warrantyPeriod: '5-Yr Hardware Warranty & Cloud SLA',
        expectedLifetimeYears: 15,
        estimatedCostPct: 2.0,
        origin: 'Ariel-SaaS™ Integrated Tech',
      },
      {
        itemNo: '1.12',
        component: 'SREDA Turnkey Installation, Testing & Utility Commissioning',
        specification: 'IEB structural audit, FSCD fire pathways, live anti-islanding trip test & Class 0.2S meter',
        makeModel: 'Ariel Renewable Energy Ltd + Contracted SREDA Grade-A Partner',
        quantity: 300,
        unit: 'kWp',
        warrantyPeriod: '5-Yr Comprehensive Workmanship & Performance SLA',
        expectedLifetimeYears: 30,
        estimatedCostPct: 5.0,
        origin: 'Bangladesh',
      },
    ],
  },

  F2: {
    packageCode: 'F2',
    title: 'Megawatt Flagship Net-Metering (1.0 MWp)',
    sector: 'FACTORY',
    capacityDcKwp: 1000,
    inverterAcKw: 880,
    estRoofAreaSqFt: 78000,
    estMonthlyYieldKwh: '125,000 – 135,000 kWh',
    amortizedLcoeBdtPerKwh: 3.10,
    items: [
      {
        itemNo: '2.01',
        component: 'N-Type TOPCon Bifacial Dual-Glass PV Modules',
        specification: '625Wp, 23.2% efficiency, 2.0+2.0mm dual-glass, 80% bifaciality',
        makeModel: 'Jinko Tiger Neo 72HL4-BDV / Longi Hi-MO 7 (Tier-1)',
        quantity: 1600,
        unit: 'Pcs',
        warrantyPeriod: '15-Yr Workmanship / 30-Yr Linear (87.4% Power)',
        expectedLifetimeYears: 30,
        estimatedCostPct: 43.0,
        origin: 'China (Direct Tier-1 Import)',
      },
      {
        itemNo: '2.02',
        component: 'Utility-Grade C&I String Inverters (125 kW)',
        specification: '125 kW AC, 12 MPPTs, Smart I-V Curve Diagnosis, IP66 / C5 Anti-Corrosion',
        makeModel: 'Sungrow SG125CX-P2 / Huawei SUN2000-115KTL-M2',
        quantity: 7,
        unit: 'Units',
        warrantyPeriod: '5-Yr Standard + 5-Yr Extended Factory Warranty',
        expectedLifetimeYears: 20,
        estimatedCostPct: 18.0,
        origin: 'China (Huawei/Sungrow Dhaka Center)',
      },
      {
        itemNo: '2.03',
        component: 'Anodized 6063-T6 Aluminum Structural System',
        specification: 'Heavy-gauge anodized rails (15–20 µm), Standing-seam clamps, BNBC 220 km/h wind certified',
        makeModel: 'Kai Aluminum / Altech Aluminum Extrusions',
        quantity: 1000,
        unit: 'kWp',
        warrantyPeriod: '15-Yr Structural Anti-Corrosion Guarantee',
        expectedLifetimeYears: 30,
        estimatedCostPct: 12.0,
        origin: 'Bangladesh',
      },
      {
        itemNo: '2.04',
        component: 'Step-Up Solar Substation Transformer (1,250 kVA)',
        specification: '1,250 kVA, 0.400 / 11 kV, Dyn11, ONAN cooling, 99.99% Electrolytic Copper Wound',
        makeModel: 'Energypac Engineering / Siemens / Adex Corporation',
        quantity: 1,
        unit: 'Unit',
        warrantyPeriod: '5-Yr Manufacturer Warranty',
        expectedLifetimeYears: 30,
        estimatedCostPct: 6.0,
        origin: 'Bangladesh (BSTI Certified)',
      },
      {
        itemNo: '2.05',
        component: '11kV HT Vacuum Circuit Breaker (VCB) Switchgear Panel',
        specification: '630A, 25kA/3s fault rating, Numerical IDMT relays, Motorized trip unit',
        makeModel: 'Schneider Electric / ABB / Siemens',
        quantity: 1,
        unit: 'Panel',
        warrantyPeriod: '5-Yr Industrial Warranty',
        expectedLifetimeYears: 25,
        estimatedCostPct: 4.5,
        origin: 'Germany / Local Assembly',
      },
      {
        itemNo: '2.06',
        component: 'Solar DC & HT AC Cabling Infrastructure',
        specification: '14,500m 1×6mm² XLPO DC + 350m 11kV 3-Core 120mm² HT Copper Armored',
        makeModel: 'KBE Solar (DC) & BRB Cable Industries (HT)',
        quantity: 1,
        unit: 'Lot',
        warrantyPeriod: '25-Yr DC / 10-Yr HT Warranty',
        expectedLifetimeYears: 30,
        estimatedCostPct: 8.0,
        origin: 'Germany / Bangladesh',
      },
      {
        itemNo: '2.07',
        component: 'Utility Net-Metering Class 0.2S Bi-Directional Smart Meter & CT/PTs',
        specification: 'Class 0.2S revenue-grade 4-quadrant bi-directional meter with dual-ratio outdoor CTs/PTs',
        makeModel: 'Secure Meters Premier / Schneider ION9000',
        quantity: 1,
        unit: 'Set',
        warrantyPeriod: '5-Yr Utility Approved Warranty',
        expectedLifetimeYears: 20,
        estimatedCostPct: 2.5,
        origin: 'India / UK / DESCO Approved',
      },
      {
        itemNo: '2.08',
        component: 'Ariel-SaaS™ Enterprise SCADA & Autonomous Weather Station',
        specification: 'Class-A Pyranometer, cell temp sensors, optical fiber ring, drone thermography sync',
        makeModel: 'Ariel-SaaS™ Enterprise Telemetry',
        quantity: 1,
        unit: 'System',
        warrantyPeriod: '5-Yr Telemetry SLA & Hardware Support',
        expectedLifetimeYears: 20,
        estimatedCostPct: 2.0,
        origin: 'Ariel-SaaS™ Climate Tech',
      },
      {
        itemNo: '2.09',
        component: 'Full Turnkey Installation, SREDA Civil & Mechanical Commissioning',
        specification: 'IEB structural certification, 1.2m fire lanes, FSCD clearance, anti-islanding trip test',
        makeModel: 'Ariel Renewable Energy Ltd + SREDA Grade-A Partner',
        quantity: 1000,
        unit: 'kWp',
        warrantyPeriod: '5-Yr Comprehensive Workmanship & Performance Guarantee',
        expectedLifetimeYears: 30,
        estimatedCostPct: 4.0,
        origin: 'Bangladesh',
      },
    ],
  },
};

// -------------------------------------------------------------
// 2. WORLDWIDE TIER-1 SOURCING COMPARISON MATRIX
// -------------------------------------------------------------
export const GLOBAL_SOURCING_VENDORS: GlobalSourcingVendor[] = [
  {
    category: 'PV_MODULES',
    manufacturer: 'Jinko Solar',
    country: 'China',
    flagshipModel: 'Tiger Neo 72HL4-BDV (615–630W)',
    technologyOrGrade: '16BB N-Type TOPCon Dual-Glass',
    maxEfficiencyPct: 23.23,
    tempCoeffPctPerC: -0.29,
    bnefTier1Rank: true,
    dhakaOfficePresence: 'Liaison Office: Gulshan-1, Dhaka (Direct local engineering staff)',
    wholesalePriceBenchmark: '$0.092 – $0.102 / Wp FOB',
    moq: '1 x 40ft HQ Container (936 pcs / ~580 kWp)',
    standardWarranty: '15-Yr Product / 30-Yr Linear (87.4%)',
    localRmaTurnaroundTime: '48 to 72 Hours (via bonded warehouse replacement)',
  },
  {
    category: 'PV_MODULES',
    manufacturer: 'Longi Solar',
    country: 'China',
    flagshipModel: 'Hi-MO 7 (600–625W)',
    technologyOrGrade: 'HPDC N-Type Dual-Glass',
    maxEfficiencyPct: 23.10,
    tempCoeffPctPerC: -0.28,
    bnefTier1Rank: true,
    dhakaOfficePresence: 'Country Representative & Tier-1 Master Distributors in Dhaka',
    wholesalePriceBenchmark: '$0.093 – $0.104 / Wp FOB',
    moq: '1 x 40ft HQ Container (936 pcs / ~580 kWp)',
    standardWarranty: '15-Yr Product / 30-Yr Linear (87.4%)',
    localRmaTurnaroundTime: '3 to 5 Days',
  },
  {
    category: 'INVERTERS',
    manufacturer: 'Huawei FusionSolar',
    country: 'China',
    flagshipModel: 'SUN2000-100KTL-M2 / 115KTL-M2',
    technologyOrGrade: 'Decentralized Multi-MPPT (10 MPPTs), AFCI built-in',
    maxEfficiencyPct: 98.80,
    bnefTier1Rank: true,
    dhakaOfficePresence: 'Huawei Technologies Bangladesh Ltd, Lotus Kamal Tower, Gulshan-2, Dhaka',
    wholesalePriceBenchmark: '$0.038 – $0.045 / W',
    moq: '4 Units (Pallet load)',
    standardWarranty: '5-Yr Standard + 5-Yr Extended Option',
    localRmaTurnaroundTime: '48 Hours Advance Hardware Replacement',
  },
  {
    category: 'INVERTERS',
    manufacturer: 'Sungrow Power',
    country: 'China',
    flagshipModel: 'SG110CX-P2 / SG125CX-P2',
    technologyOrGrade: '12 MPPTs, 30A string current, IP66 / C5 anti-corrosion',
    maxEfficiencyPct: 98.60,
    bnefTier1Rank: true,
    dhakaOfficePresence: 'Sungrow Bangladesh Dedicated Service Hub, Sector 3, Uttara, Dhaka',
    wholesalePriceBenchmark: '$0.035 – $0.042 / W',
    moq: '4 Units (Pallet load)',
    standardWarranty: '5-Yr Standard + 5-Yr Extended Option',
    localRmaTurnaroundTime: '48 to 72 Hours',
  },
  {
    category: 'BESS',
    manufacturer: 'CATL',
    country: 'China',
    flagshipModel: 'EnerOne Liquid-Cooled LFP Rack',
    technologyOrGrade: 'Lithium Iron Phosphate (LiFePO4) with Liquid Cooling',
    maxEfficiencyPct: 94.50,
    bnefTier1Rank: true,
    dhakaOfficePresence: 'Regional South Asia Technical Desk',
    wholesalePriceBenchmark: '$125 – $145 / kWh',
    moq: '1 C&I Storage Container / 500 kWh',
    standardWarranty: '10-Yr Warranty / 8,000 Cycles @ 80% DoD',
    localRmaTurnaroundTime: '7 Days',
  },
  {
    category: 'MOUNTING_STRUCTURE',
    manufacturer: 'Kai Aluminum Industries Ltd',
    country: 'Bangladesh',
    flagshipModel: '6063-T6 Anodized Solar Rail & Standing-Seam Clamp Suite',
    technologyOrGrade: '15–20 Micron Clear Anodization, Tensile Strength ≥ 205 MPa',
    bnefTier1Rank: false,
    dhakaOfficePresence: 'Factory: Tongi Industrial Area, Gazipur; HQ: Tejgaon, Dhaka',
    wholesalePriceBenchmark: 'Tk 380 – Tk 420 / kg (Local BDT, Zero Import Duty)',
    moq: '500 kg (~20 kWp equivalent)',
    standardWarranty: '15-Yr Anti-Corrosion Guarantee',
    localRmaTurnaroundTime: '24 Hours Local Replacement',
  },
  {
    category: 'CABLES',
    manufacturer: 'BRB Cable Industries Ltd',
    country: 'Bangladesh',
    flagshipModel: '11kV HT XLPE & 0.6/1kV LT Copper Armored Power Cables',
    technologyOrGrade: '99.99% Electrolytic Annealed Copper, BSTI / IEC 60502 Certified',
    bnefTier1Rank: false,
    dhakaOfficePresence: 'HQ: Panthapath, Dhaka; Factory: Kushtia / Savar Hub',
    wholesalePriceBenchmark: 'Factory List minus 28%–32% Project Discount',
    moq: '500 Meters Drum',
    standardWarranty: '10-Yr Manufacturer Warranty',
    localRmaTurnaroundTime: '24 Hours',
  },
];

// -------------------------------------------------------------
// 3. LOGISTICS & IMPORTATION PROTOCOLS
// -------------------------------------------------------------
export const LOGISTICS_EXECUTION_BLUEPRINT: LogisticsRoutePlan[] = [
  {
    stage: '1. OEM Dispatch & Ocean Freight',
    origin: 'Shanghai / Ningbo / Shenzhen Port, China',
    destination: 'Chattogram Sea Port (CTG), Bangladesh',
    transportMode: 'Ocean Container Line (40ft High Cube - 936 panels/container)',
    typicalDuration: '14 to 18 Days',
    hsCodeApplicable: '8541.43.00 (Modules) / 8504.40.90 (Inverters)',
    dutyRateSro159: '0% – 1.0% (Under SRO 159-Law/2026/14/Customs)',
    riskMitigation: 'Marine Cargo All-Risk Insurance + Shockwatch impact sensors inside containers',
  },
  {
    stage: '2. Customs Clearance at CTG Port',
    origin: 'Chittagong Customs House',
    destination: 'Bonded Port Container Freight Station (CFS)',
    transportMode: 'C&F Bonded Yard Handling',
    typicalDuration: '3 to 5 Days',
    hsCodeApplicable: '8541.43.00 / 8504.40.90 / 8507.60.00',
    dutyRateSro159: 'Total incidence capped at 1.0% with SREDA & BSTI approval',
    riskMitigation: 'Pre-arrival SREDA endorsement filed 7 days prior to vessel docking',
  },
  {
    stage: '3. Inland Multimodal Transit',
    origin: 'Chattogram Port Yard',
    destination: 'Ariel Central Staging Warehouse (Gazipur / Narayanganj Hub)',
    transportMode: 'Heavy-Duty Prime Mover Trailer (40ft GPS-tracked)',
    typicalDuration: '1 to 2 Days',
    hsCodeApplicable: 'Inland Transit Goods',
    dutyRateSro159: 'N/A (Cleared Goods)',
    riskMitigation: 'GPS geofencing, pneumatic suspension trailers, 50-ton transit transit insurance',
  },
  {
    stage: '4. Warehouse Staging & Quality EL Audit',
    origin: 'Ariel Central Staging Warehouse, Gazipur',
    destination: 'Client Factory Gate (Konabari / Savar / Bhaluka / CEPZ)',
    transportMode: 'Staged dispatch via 5-ton covered trucks in sync with roof purlin mounting',
    typicalDuration: 'Just-in-Time Delivery (2 to 4 Hours transit)',
    hsCodeApplicable: 'Domestic Dispatch Manifest',
    dutyRateSro159: 'N/A',
    riskMitigation: 'Barcode scanning, EL camera electroluminescence crack check, weatherproof staging floor',
  },
];

