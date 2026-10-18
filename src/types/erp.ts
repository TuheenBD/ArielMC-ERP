export * from './techPack';
import { StandardFactoryTechPack } from './techPack';

export type EntityCode = 'ARIEL_BD' | 'ARIEL_UK' | 'ARIEL_US' | 'ARIEL_EU' | 'ARIEL_AU' | (string & {});

export type CurrencyCode = 'BDT' | 'GBP' | 'USD' | 'EUR' | 'AUD' | (string & {});

export interface StationBankAccount {
  id?: string;
  bankName: string;
  accountNumberMask: string;
  currency: CurrencyCode;
  type: string;
  branch?: string;
  swiftBic?: string;
  routingOrSortCode?: string;
  purpose?: string;
  isPrimary?: boolean;
  isErq?: boolean;
}

export interface StatutoryOfficer {
  id: string;
  name: string;
  designation: string;
  nationalIdOrTin?: string;
  signingAuthority: 'SOLO_A_SIGNATORY' | 'JOINT_SIGNATORY' | 'AUTHORIZED_REPRESENTATIVE';
  email?: string;
  phone?: string;
  status: 'ACTIVE' | 'EMERITUS';
  notes?: string;
}

export interface InterEntityRoute {
  sourceStation: EntityCode;
  destinationStation: EntityCode;
  incoterm: 'FOB' | 'CIF' | 'DDP' | 'CFR';
  customsRegime: string;
  freightCorridor: string;
  destination3PL: string;
  currencyRepatriation: string;
  regulatoryCircular?: string;
}

export interface CompanyEntity {
  id: string;
  code: EntityCode;
  legalName: string;
  country: string;
  countryCode: string;
  flag: string;
  city: string;
  address: string;
  baseCurrency: CurrencyCode;
  taxIdentifier: {
    type: string;
    number: string;
  };
  legalStatus: string;
  role: string;
  domains: string[];
  activeFacilities: string[];
  bankAccounts: StationBankAccount[];
  statutoryOfficers?: StatutoryOfficer[];
  interEntityRoute?: InterEntityRoute;
}

export interface CorporateCommunication {
  mobileBd: string;
  whatsappIntl: string;
  emails: string[];
  emailSystems: {
    hostinger: {
      provider: string;
      webmailUrl: string;
      accounts: {
        general: string;
        executive: string;
      };
      serverSettings: {
        imap: string;
        smtp: string;
        pop: string;
      };
    };
    gmail: {
      provider: string;
      webmailUrl: string;
      accounts: {
        primary: string;
        backup: string;
      };
    };
  };
  meetings: {
    zoom: {
      platform: 'Zoom';
      account: string;
      launchUrl: string;
      directMeetingUrl: string;
    };
    googleMeet: {
      platform: 'Google Meet';
      account: string;
      launchUrl: string;
    };
    microsoftTeams: {
      platform: 'Microsoft Teams';
      account: string;
      chatUrl: string;
      launchUrl: string;
    };
    whatsapp: {
      platform: 'WhatsApp';
      phone: string;
      chatUrl: string;
      webUrl: string;
    };
  };
  socialLinks: {
    linkedin: {
      corporate: string;
      shop: string;
    };
    youtube: {
      corporate: string;
      shop: string;
    };
    facebook: {
      corporate: string;
      shop: string;
    };
  };
}

export type ProductSector = 'LEATHER' | 'JUTE' | 'TEXTILE' | 'CERAMICS' | 'POTTERY';

export interface LeatherAttributes {
  leatherType: 'Full-Grain' | 'Top-Grain' | 'Split' | 'Nubuck' | 'Suede';
  tanningMethod: 'Vegetable Tanned' | 'Chrome Tanned' | 'Semi-Chrome' | 'Chrome-Free';
  hideOrigin: 'Cowhide' | 'Buffalo' | 'Goat' | 'Sheep';
  thicknessMm: string;
  hardwareFinish: 'Antique Brass' | 'Gunmetal' | 'Brushed Nickel' | 'Matte Black';
  edgeFinish: 'Italian Edge Painted' | 'Burnished' | 'Turned Edge';
  reachCompliant: boolean;
  lwgCertification: 'Gold' | 'Silver' | 'Bronze' | 'Audited';
}

export interface JuteAttributes {
  construction: 'Hessian' | 'Sacking' | 'CBC (Carpet Backing)' | 'Twill' | 'Geo-Jute';
  yarnCount: string;
  weightGsm: number;
  lamination: 'Biodegradable PLA' | 'Food-Grade PP' | 'Unlaminated Natural' | 'Waxed';
  bleachStatus: 'Natural Golden' | 'Semi-Bleached' | 'Full Bleached' | 'Vat Dyed';
  biodegradabilityRate: string;
  fumigationStandard: string;
}

export interface TextileAttributes {
  composition: '100% Combed Cotton' | 'Organic Cotton (GOTS)' | 'Linen-Cotton Blend' | 'Mulberry Silk Blend';
  threadCount: number;
  gsm: number;
  weaveType: 'Sateen' | 'Percale' | 'Waffle' | 'Herringbone' | 'Jacquard';
  dyeStandard: 'OEKO-TEX Standard 100 Class 1' | 'Azo-Free Reactive Dye' | 'Natural Botanical';
  shrinkageLimit: string;
  finishType: 'Bio-Polished' | 'Silicon Soft' | 'Stonewashed';
}

export interface CeramicAttributes {
  clayBody: 'High-Fired Stoneware' | 'Fine Porcelain' | 'Terracotta' | 'Earthenware';
  glazeType: 'Reactive Mineral Glaze' | 'Satin Matte' | 'Glossy Crystalline' | 'Unglazed Terra';
  firingTempCelsius: number;
  waterAbsorption: string;
  foodContactSafety: 'FDA 21 CFR 175.300 Compliant' | 'EU Directive 84/500/EEC' | 'California Prop 65';
  thermalShockResistance: string;
}

export interface PotteryAttributes {
  clayType: 'Indigenous Earthen Clay' | 'Red Terracotta' | 'Black Earthen Clay' | 'Porous Terracotta';
  firingTempCelsius: number;
  evaporativeCoolingRating?: string;
  finishStyle: 'Raw Natural Terra' | 'Smoked / Carbon Fired' | 'Hand-Burnished' | 'Waxed Breathable';
  frostResistance: 'Indoor & Sheltered' | 'Frost Resistant to -10°C';
  foodSafeUse: 'Lead & Cadmium Free (Traditional Cooking Grade)' | 'Decorative & Planters Only';
}

export type SectorAttributes = 
  | { sector: 'LEATHER'; data: LeatherAttributes }
  | { sector: 'JUTE'; data: JuteAttributes }
  | { sector: 'TEXTILE'; data: TextileAttributes }
  | { sector: 'CERAMICS'; data: CeramicAttributes }
  | { sector: 'POTTERY'; data: PotteryAttributes };

export interface ProductItem {
  id: string;
  sku: string;
  eanBarcode?: string; // GS1 GTIN-13 (053 Country Prefix for Bangladesh)
  styleCode?: string; // JCT, BLM, LT2, LT3, etc.
  prodtId?: number; // 1 to 74 from Product Road Map
  roadmapCode?: string; // e.g. LD-EDC-1, CT-DNT-49, PT-BNG-62
  subCategory?: string; // e.g. Wallets & Small Leather Goods, Tableware Suites
  packagingMode?: string; // Flat poly-sleeve, 1pc | Dustbag + E-com box | Stuffed, Dustbag + Box
  name: string;
  sector: ProductSector;
  category: string;
  hsCode: string;
  description: string;
  unit: string;
  dimensions: string;
  weightKg: number;
  tags: string[];
  targetMarkets: ('UK' | 'EU' | 'US' | 'AU')[];
  costing: {
    factoryCostBdt: number;
    factoryCostUsd: number;
    arielSourcingMarginPct: number;
    b2bFobPriceUsd: number;
    b2bCifPriceGbp?: number;
    b2bCifPriceEur?: number;
    b2bDdpPriceUsd?: number;
    d2cRetailPriceUsd: number;
  };
  volumePricing?: {
    tier1: { qty: string; sellPriceUsd: number; targetBuyUsd: number };
    tier2: { qty: string; sellPriceUsd: number; targetBuyUsd: number };
    tier3: { qty: string; sellPriceUsd: number; targetBuyUsd: number };
    tier4: { qty: string; sellPriceUsd: number; targetBuyUsd: number };
  };
  attributes: SectorAttributes;
  complianceCertificates: string[];
  partnerFactory: {
    factoryName: string;
    location: string;
    leadTimeDays: number;
    moq: number;
    rating: number;
  };
  sampleStatus: 'PROTO_REQUESTED' | 'DEVELOPMENT_PASSED' | 'BUYER_APPROVED' | 'IN_BULK_PRODUCTION';
  images: string[];
  createdDate: string;
  standardTechPack?: StandardFactoryTechPack;
}

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToUsd: number;
  symbolPosition: 'before' | 'after';
}

export interface CrmLead {
  id: string;
  company: string;
  tier: string;
  market: 'UK' | 'EU' | 'USA' | 'AU' | string;
  country: string;
  channel: string;
  contact: string;
  role: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  focus: string;
  interest: string;
  priority: string;
  stage: string;
  value: number | null;
  nextAction: string;
  nextDate: string;
  lastContact: string;
  touches: number;
  owner: string;
  notes: string;
  source: string;
  createdAt: string;
  cur?: string;
  city?: string;
  contactability?: 'email' | 'phone' | 'both' | 'none';
  price?: number | null;
  priceNote?: string;
}

export interface CrmActivity {
  id: string;
  date: string;
  leadId: string;
  company?: string;
  type: string;
  outcome?: string;
  note: string;
  stage?: string;
  ts: string;
  user: string;
}

export interface CrmTask {
  id: string;
  leadId: string;
  leadCompany: string;
  market: string;
  action: string;
  dueDate: string;
  priority: string;
  completed: boolean;
  assignedTo: string;
  createdAt: string;
}

export interface CrmSettings {
  title: string;
  owner: string;
  markets: string[];
  tiers: string[];
  channels: string[];
  priorities: string[];
  interests: string[];
  owners: string[];
  actTypes: string[];
  outcomes: string[];
  stages: { name: string; prob: number }[];
  users: any[];
}

export interface ComplianceAudit {
  id: string;
  standardName: string; // BSCI, SEDEX SMETA, LWG, OEKO-TEX, GOTS, ISO 9001
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'AUDIT_SCHEDULED';
  ratingGrade: string; // Grade A, Gold, Silver, Class 1
  auditBody: string; // SGS, TÜV Rheinland, Intertek, Bureau Veritas
  validUntil: string; // YYYY-MM-DD
  reportNumber: string;
}

export interface SupplierFactory {
  id: string;
  code: string; // FAC-SAV-01
  name: string;
  sectors: ProductSector[];
  cluster: string; // Savar, Gazipur, Narsingdi, Dhamrai
  factoryAddress: string;
  contactPerson: string;
  designation: string;
  phone: string;
  email: string;
  tradeLicenseNo: string;
  binNumber: string;
  tinNumber: string;
  epbRegistrationNo: string;
  tier: 'TIER_1_PREFERRED' | 'TIER_2_QUALIFIED' | 'TIER_3_PROBATIONARY';
  capacity: {
    monthlyCapacityUnits: number;
    allocatedUnits: number;
    activeLines: number;
    machineryList: string[];
  };
  scorecard: {
    onTimeDeliveryPct: number;
    aqlPassRatePct: number;
    ratingScore: number; // 1-5
    priceCompetitiveness: number; // 1-5
  };
  complianceAudits: ComplianceAudit[];
  leadTimeDays: number;
  minimumOrderQuantity: number;
  paymentTerms: string;
  bankDetails: {
    bankName: string;
    branch: string;
    routingNumber: string;
    accountNumber?: string;
    swiftCode?: string;
    adBranchCode?: string;
  };
  associatedSkus: string[];
  vendorType?: VendorClassification;
  website?: string;
  facebookUrl?: string;
  linkedInUrl?: string;
  vendorProfile?: VendorB2bProfile;
  enlistmentDocuments?: VendorEnlistmentDocument[];
}

export type VendorClassification = 
  | 'FULL_FLEDGED_FACTORY'  // Own Raw materials (Such as Tannery) & Make the production to produce finished goods
  | 'FACTORY'               // Manufacturer (Raw Material Source from Open Market) - Make the production to produce finished goods
  | 'SUPPLIER';             // Collect Finished goods & Supply

export type VendorEnlistmentDocType = 
  | 'TRADE_LICENSE'
  | 'CERTIFICATE_OF_INCORPORATION'
  | 'NID_CERTIFICATE'
  | 'BIN_CERTIFICATE'
  | 'BANK_SOLVENCY'
  | 'BANK_DETAIL'
  | 'CHEQUE_SCAN';

export interface VendorEnlistmentDocument {
  id: string;
  docType: VendorEnlistmentDocType;
  title: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'VERIFIED' | 'PENDING_REVIEW' | 'REJECTED';
  fileUrl?: string;
  mandatory: boolean;
  notes?: string;
  documentNumber?: string;
  validUntil?: string;
  issuingAuthority?: string;
}

export interface VendorB2bProfile {
  // 1. Company Basic Identity & Legal Profile
  vendorType?: VendorClassification;
  registeredCompanyName: string;
  tradeLicenseNo: string;
  ercNumber?: string;
  customsBin13Digit: string;
  tinNumber?: string;
  registeredOfficeAddress: string;
  factoryPlantAddress: string;
  managingDirectorName: string;
  yearOfEstablishment?: string;
  websiteUrl?: string;
  corporateEmail?: string;
  facebookUrl?: string;
  linkedInUrl?: string;
  primaryContact: {
    name: string;
    designation: string;
    email: string;
    mobile: string;
  };
  authorizedSignatory: {
    name: string;
    designation: string;
    email: string;
    mobile: string;
  };

  // 2. Core Production Categories & Capacity Segmentation
  selectedSectors: ProductSector[];
  factoryFloorAreaSqFt?: number;
  workforce: {
    management: number;
    skilledLabor: number;
    total: number;
  };
  capacities: {
    leather?: { rawFinishes: string; annualCapacitySqFt: number; leadTimeDays: number };
    jute?: { rawFibers: string; annualCapacityMetricTons: number; leadTimeDays: number };
    textile?: { beddingLinens: string; annualCapacityPcs: number; leadTimeDays: number };
    ceramics?: { tablewareArt: string; annualCapacityPcs: number; leadTimeDays: number };
  };
  leadTimes: {
    initialOrderDays: number;
    repeatOrderDays: number;
  };

  // 3. Logistics, Packaging & Shipping Data
  preferredIncoterms: ('FOB' | 'CIF' | 'CFR' | 'EXW')[];
  loadingPortLocations: string[];
  dailyDispatchCapacity: string;
  containerLoadingAbility: ('20ft FCL' | '40ft HQ' | 'LCL')[];

  // 4. Global Compliance, Audits & Regulatory Frameworks
  complianceFrameworks: {
    ukEu: {
      sedexSmeta: { certified: boolean; idExpiry?: string };
      bsci: { certified: boolean; idExpiry?: string };
      oekoTex: { certified: boolean; idExpiry?: string };
      gots: { certified: boolean; idExpiry?: string };
    };
    usa: {
      ctpat: { certified: boolean; status?: string };
      fdaLeaching: { certified: boolean; reportNo?: string };
      lwg: { certified: boolean; grade?: 'Gold' | 'Silver' | 'Bronze' | 'Audited' };
    };
    australia: {
      aqis: { compliant: boolean; regNo?: string };
      fumigation: { approved: boolean; facilityCode?: string };
    };
  };

  // 5. International Banking & Remittance Channels (AD Branch Only)
  banking: {
    beneficiaryBankName: string;
    branchName: string;
    adBranchCode: string;
    swiftCode: string;
    routingNumber: string;
    accountNumber: string;
    supportedCurrencies: ('USD' | 'EUR' | 'GBP' | 'AUD' | 'BDT')[];
    paymentMethodsAccepted: ('Confirmed L/C at sight' | 'TT (Advance/Deferred)')[];
    exportFootprintPct: {
      usa: number;
      uk: number;
      eu: number;
      aus: number;
    };
  };

  // 6. Vendor Solemn Declaration & Authorized Sign-off
  declaration: {
    signatoryFullName: string;
    designation: string;
    date: string;
    placeOfSigning: string;
    isSigned: boolean;
  };

  // 7. Mandatory Documents Checklist
  documents: VendorEnlistmentDocument[];
}

// -------------------------------------------------------------
// Phase 3: R&D, Tech Packs & Sample Development Orders (SDO)
// -------------------------------------------------------------

export type SampleStage = 
  | 'PROTO'        // 1st Prototype / Fit & Feasibility
  | 'FIT'          // Styling & Measurement Adjustment
  | 'SIZE_SET'     // Range / Grading Spec validation
  | 'PP'           // Pre-Production (PP) Approval - Gate before bulk cutting/kiln
  | 'TOP';         // Top of Production (TOP) - Pulled from initial mass run

export type SampleStatus = 
  | 'DRAFT'
  | 'TECH_PACK_SENT'
  | 'IN_FABRICATION'
  | 'INTERNAL_QA_PASSED'
  | 'DISPATCHED'
  | 'DELIVERED_TO_BUYER'
  | 'APPROVED'
  | 'APPROVED_WITH_COMMENTS'
  | 'REVISION_REQUIRED'
  | 'REJECTED';

export type CourierProvider = 'DHL Express' | 'FedEx Priority' | 'Aramex' | 'UPS Worldwide';

export interface TechPackSpec {
  dimensions: string;
  tolerances: string;
  primaryMaterial: string;
  materialDetails: string;
  liningOrFinish: string;
  hardwareOrGlaze: string;
  trimsAndPackaging: string;
  careInstructions: string;
  artworkOrDxfUrl?: string;
  barcodeEan?: string;
  colorwayPantone: string;
  weightTargetGrams: number;
}

export interface SampleCourierTracking {
  courier: CourierProvider;
  awbNumber: string;
  dispatchDate: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  originAirport: string; // e.g. DAC (Hazrat Shahjalal Intl, Dhaka)
  destinationAirport: string; // e.g. LHR (London Heathrow), JFK (New York), AMS (Amsterdam), SYD (Sydney)
  currentLocation: string;
  transitStatus: 'LABEL_CREATED' | 'COLLECTED_DHAKA' | 'DEPARTED_DAC' | 'CUSTOMS_CLEARANCE' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  costUsd: number;
  trackingUrl: string;
}

export interface SampleCosting {
  developmentCostBdt: number;
  developmentCostUsd: number;
  courierCostUsd: number;
  totalCostUsd: number;
  billingParty: 'BUYER_INVOICED' | 'FACTORY_ABSORBED' | 'ARIEL_MARKETING_INVESTMENT';
  paymentStatus: 'PAID' | 'PENDING' | 'WAIVED';
}

export interface BuyerFeedback {
  id: string;
  date: string;
  reviewedBy: string;
  verdict: 'APPROVED' | 'APPROVED_WITH_COMMENTS' | 'REVISE_SAMPLE' | 'REJECTED';
  aestheticScore: number; // 1-10
  workmanshipScore: number; // 1-10
  dimensionalAccuracyScore: number; // 1-10
  comments: string;
  requiredChanges?: string[];
}

export type SamplingTier = 
  | 'TIER_A_SHOWROOM'    // Ready Catalog Showroom Samples (Off-the-Shelf)
  | 'TIER_B_CUSTOM_OEM'    // Custom OEM Prototypes & Pre-Production (Tech-Pack Driven)
  | 'TIER_C_SPECIMEN_KIT'; // Corporate Specimen Kits ($50 Flat Fee / Prospecting)

export interface SamplePricingMatrixItem {
  categoryCode: string; // e.g. JD-EDC-16, LD-BLM-16
  division: 'The Golden Fiber Edit' | 'The Leather Compendium' | 'The Ceramic Index' | 'Thread & Weave' | 'Earth & Form';
  skuDescription: string;
  developmentSampleFeeUsd: number;
  toolingCostText: string;
  toolingCostUsd: number;
  developmentLeadTime: string;
  qualifyingBulkMoq: number;
  techPackRef?: string;
}

export interface SampleReimbursementTerms {
  qualifyingBulkMoq: number;
  minimumPoValueUsd: number;
  invoiceDeductionTarget: 'FINAL_50_BALANCE_BL';
  status: 'PENDING_QUALIFYING_PO' | 'CREDIT_APPROVED' | 'CREDITED_ON_BL' | 'EXPIRED';
  creditAmountUsd: number;
  validityDays: number; // 90 Calendar Days
  dispatchDate: string;
}

export interface SampleQaDossier {
  dossierNumber: string;
  inspectionDate: string;
  inspectorName: string;
  chemicalSafety: {
    chromiumViPpm: string; // '< 0.5 mg/kg (Limit < 3.0 mg/kg)'
    dmfuPpm: string; // '< 0.05 mg/kg (Limit < 0.1 mg/kg)'
    azoColorants: string; // 'Non-detectable'
    reachAnnexXviiCompliant: boolean;
  };
  mechanicalTesting: {
    dropTest15kg: string; // 'Passed (3 drops from 1.2m)'
    handlePullStrengthKg: number; // 42.5 kg (Pass >= 25 kg)
    seamFatigueRating: string; // 'Grade 5 (Zero seam slippage)'
    hardwareSaltSprayHours: number; // 48 Hours
  };
}

export interface SampleDevelopmentOrder {
  id: string; // SDO-2026-LTH-001
  sdoNumber: string;
  sector: ProductSector;
  styleName: string;
  styleCode: string;
  samplingTier?: SamplingTier;
  sopReference?: string; // 'SOP-B2B-SMP-2026-V1'
  associatedProductId?: string;
  buyerCompany: string; // From CRM
  buyerContact: string;
  targetMarket: 'UK' | 'EU' | 'US' | 'AU';
  factoryId: string;
  factoryName: string;
  stage: SampleStage;
  roundNumber: number; // 1 = 1st round, 2 = 2nd round revision, etc.
  status: SampleStatus;
  requestDate: string;
  targetDeliveryDate: string;
  actualApprovalDate?: string;
  techPack: TechPackSpec;
  courier?: SampleCourierTracking;
  costing: SampleCosting;
  reimbursementTerms?: SampleReimbursementTerms;
  qaDossier?: SampleQaDossier;
  waybillLabelling?: string;
  feedbacks: BuyerFeedback[];
  tags: string[];
  standardTechPack?: StandardFactoryTechPack;
}

// -------------------------------------------------------------
// Phase 5: Two-Way Order Management System (OMS)
// -------------------------------------------------------------

export type OrderStatus = 
  | 'DRAFT'
  | 'CONFIRMED'
  | 'IN_PRODUCTION'
  | 'QUALITY_INSPECTION'
  | 'READY_TO_SHIP'
  | 'SHIPPED_CHITTAGONG'
  | 'FULFILLED'
  | 'CANCELLED';

export type FactoryPoStatus = 
  | 'ISSUED'
  | 'ACCEPTED'
  | 'RAW_MATERIAL_STAGED'
  | 'CUTTING'
  | 'IN_LINE_SEWING'
  | 'QC_PASSED'
  | 'PACKED_EX_FACTORY';

export interface OrderLineItem {
  id: string;
  productId?: string;
  sku: string;
  styleName: string;
  sector: ProductSector;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  factoryUnitCost: number;
  factoryTotalCost: number;
}

export interface TimeAndActionMilestone {
  id: string;
  name: string;
  code: string;
  plannedDate: string;
  actualDate?: string;
  status: 'COMPLETED' | 'ON_TRACK' | 'AT_RISK' | 'DELAYED' | 'PENDING';
  responsibleParty: string;
  notes?: string;
}

export interface AqlInspectionReport {
  id: string;
  inspectionType: 'INLINE' | 'MIDLINE' | 'FINAL_FRI';
  inspectionDate: string;
  inspectorName: string;
  inspectionLevel: string; // e.g. 'Level II (ISO 2859-1)'
  sampleSizeUnits: number;
  aqlStandard: {
    criticalMaxAllowed: number;
    majorMaxAllowed: number;
    minorMaxAllowed: number;
  };
  defectsFound: {
    critical: number;
    major: number;
    minor: number;
  };
  defectLog: {
    description: string;
    category: 'Critical' | 'Major' | 'Minor';
    count: number;
  }[];
  overallVerdict: 'PASS_CERTIFICATE_ISSUED' | 'PENDING_REWORK' | 'FAILED_REJECTED';
  certificateNumber?: string;
  digitalSealUrl?: string;
}

export type ChemicalTestType =
  | 'REACH_CHROMIUM_VI'
  | 'REACH_AZO_DYES'
  | 'REACH_HEAVY_METALS'
  | 'DENIM_CROCKING_ISO105'
  | 'JUTE_MOISTURE_CLEANLINESS'
  | 'DMF_ANTI_MOULD'
  | 'FORMALDEHYDE_SCREEN';

export type LabTestVerdict = 'PASSED_CERTIFIED' | 'WARNING_BORDERLINE' | 'FAILED_REJECTED';

export interface ChemicalComplianceTest {
  id: string;
  testReportNumber: string; // e.g. TUV-DHK-2026-CH-0982
  batchLotNumber: string; // e.g. BATCH-SAV-LWG-092
  sku: string;
  productName: string;
  sector: ProductSector;
  testType: ChemicalTestType;
  testStandard: string; // e.g. ISO 17075-1:2017, ISO 105-X12:2016, EN ISO 17234-1
  accreditedLaboratory: 'TÜV SÜD Bangladesh' | 'SGS Bangladesh' | 'Intertek Bangladesh' | 'Bureau Veritas Dhaka';
  sampleCollectionDate: string;
  reportIssueDate: string;
  validUntilDate: string;
  measuredValue: string; // e.g. "< 0.5 mg/kg", "Dry 4.5 / Wet 3.8", "ND (< 5 mg/kg)"
  regulatoryThreshold: string; // e.g. "< 3.0 mg/kg (REACH Annex XVII)", "Dry ≥ 4.0 / Wet ≥ 3.5"
  verdict: LabTestVerdict;
  tanneryOrMillName: string; // e.g. Savar Tannery Estate (CETP Unit 4) / Bengal Denim Mills Narayanganj
  lwgRating?: 'LWG_GOLD' | 'LWG_SILVER' | 'LWG_BRONZE' | 'AUDITED';
  leadChemist: string;
  digitalCertificateHash: string;
  notes: string;
}

export interface FactoryPurchaseOrder {
  id: string;
  poNumber: string; // PO-2026-FAC-001
  factoryId: string;
  factoryName: string;
  currency: 'BDT' | 'USD';
  status: FactoryPoStatus;
  issueDate: string;
  targetExFactoryDate: string;
  totalQuantity: number;
  totalCostBdt: number;
  totalCostUsd: number;
  paymentTerms: string;
  backToBackLcNumber?: string;
  items: OrderLineItem[];
}

export interface OrderFulfillmentRouting {
  assignedHub: HubLocation | 'WH-US' | 'WH-BD';
  hubName: string;
  shippingCountry: string;
  deliveryCarrier: string;
  dispatchStatus: 'PENDING_ROUTING' | 'PICK_SLIP_READY' | 'DISPATCHED_TO_3PL' | 'DELIVERED';
  trackingNumber?: string;
  taxRegime: 'UK_VAT_20' | 'EU_OSS_19' | 'US_NEXUS' | 'EXPORT_EXEMPT';
  preferentialTariffRatePct: number;
}

export interface BuyerSalesOrder {
  id: string;
  soNumber: string; // SO-2026-UK-001
  buyerCompany: string; // Linked to CRM
  buyerContact: string;
  targetMarket: 'UK' | 'EU' | 'US' | 'AU';
  operatingEntity: EntityCode;
  currency: CurrencyCode;
  incoterm: string; // e.g. FOB Chittagong, CIF London Gateway, DDP Los Angeles
  status: OrderStatus;
  orderDate: string;
  targetExFactoryDate: string;
  targetPortCutOffDate: string;
  targetDeliveryDate: string;
  paymentTerms: string;
  masterLcNumber?: string;
  items: OrderLineItem[];
  totalQuantity: number;
  totalAmountBuyerCurrency: number;
  totalAmountUsd: number;
  linkedPo: FactoryPurchaseOrder;
  marginProtection: {
    buyerRevenueUsd: number;
    factoryCostUsd: number;
    freightAllowanceUsd: number;
    complianceBufferUsd: number;
    netMarginUsd: number;
    marginPercentage: number;
    status: 'LOCKED_HEALTHY' | 'MARGIN_WARNING' | 'UNACCEPTABLE';
  };
  timeAndAction: TimeAndActionMilestone[];
  inspections: AqlInspectionReport[];
  fulfillmentRouting?: OrderFulfillmentRouting;
}

// -------------------------------------------------------------
// Phase 6: Multi-Leg Logistics, Dual 3PL Hubs & Export Docs
// -------------------------------------------------------------

export type HubLocation = 'WH-UK' | 'WH-DE';

export type ContainerType = '20FT' | '40FT' | '40HC' | 'LCL';

export type ShipmentStatus =
  | 'BOOKING_CONFIRMED'
  | 'CUSTOMS_CLEARED_CTG'
  | 'ON_VESSEL_TRANSIT'
  | 'PORT_DISCHARGE'
  | 'CUSTOMS_CLEARED_DEST'
  | 'INBOUND_AT_3PL';

export interface ConsignmentItem {
  id: string;
  sku: string;
  styleCode: string;
  eanBarcode: string;
  productName: string;
  sector: ProductSector;
  hsCode: string;
  cartons: number;
  unitsPerCarton: number;
  totalUnits: number;
  grossWeightKg: number;
  netWeightKg: number;
  cbm: number;
  packagingMode: string;
  unitPriceUsd: number;
  totalPriceUsd: number;
  // Hybrid Inventory Allocation
  fbaTransferUnits: number;
  fbmInventoryUnits: number;
  b2bWholesaleUnits: number;
}

export interface LogisticsConsignment {
  id: string;
  consignmentNumber: string; // EXP-2026-CTG-UK-01
  linkedSoNumbers: string[];
  destinationHub: HubLocation;
  hubName: string; // e.g. WH-UK (Northampton) or WH-DE (Hamburg/Ruhr)
  hubAddress: string;
  originPort: string; // Chattogram Port (CTG), Bangladesh
  destinationPort: string; // Felixstowe (UK) or Hamburg (Germany)
  carrierVessel: string; // e.g. MSC MAYA / Voyage 2603W
  billOfLadingNo: string;
  containerNumber: string;
  sealNumber: string;
  containerType: ContainerType;
  status: ShipmentStatus;
  etdCtg: string;
  etaDestination: string;
  actualDeliveryDate?: string;
  // Maritime & Quarantine Integrity
  desiccantProtocol: {
    containerPolesCount: number; // Calcium chloride poles
    cavityPacketsCount: number; // 5-10g silica packets
    verified: boolean;
  };
  phytosanitaryClearance: {
    required: boolean;
    daeCertificateNo?: string;
    fumigationTreatment: string;
    status: 'CERTIFIED' | 'PENDING' | 'EXEMPT';
  };
  // Customs & Preferential Tariffs
  customsDutyRatePct: number; // 0% under EBA (EU) or DCTS (UK)
  rexStatementOfOrigin: string;
  bangladeshBankFormExp: string; // Form EXP under BB FE Circular 48/31
  authorizedDealerBank: string; // Authorized Dealer in Dhaka
  // Financial & Freight Costing
  oceanFreightUsd: number;
  customsClearanceFee: number;
  portHandlingCfsFee: number;
  inbound3plReceivingFee: number;
  currency: 'USD' | 'GBP' | 'EUR';
  items: ConsignmentItem[];
  totalCartons: number;
  totalUnits: number;
  totalGrossWeightKg: number;
  totalCbm: number;
  totalFobValueUsd: number;
}

// -------------------------------------------------------------
// Governance & SOP-SEC-2026-V1 Cyber Security Interfaces
// -------------------------------------------------------------

export interface SecurityIncident {
  id: string;
  title: string;
  category: 'ATO_ATTEMPT' | 'AD_ACCOUNT_HIJACK' | 'CREDENTIAL_LEAK' | 'PHISHING_ALERT' | 'BEC_WIRE_ALTERATION';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'ISOLATED_5MIN' | 'COMMAND_NOTIFIED_15MIN' | 'CONTAINED_60MIN' | 'RESOLVED';
  detectedAt: string;
  targetPlatform: string;
  isolationActionTaken: string;
  escalationLead: string;
}

export interface SecurityBudgetLine {
  id: string;
  component: string;
  provider: string;
  annualCostGbp: number;
  annualCostBdt: number;
  strategicPurpose: string;
  status: 'ACTIVE' | 'PLANNED';
}

// -------------------------------------------------------------
// Phase 8: Global Finance, P&L & Dual-Track Economics
// (From Craft to Cash Flow: Master Launch Blueprint)
// -------------------------------------------------------------

export interface FinancialLineItem {
  name: string;
  amountUsd: number;
  pctNetTurnover?: number;
  pctGrossSales?: number;
  operationalLogic: string;
  isSubtotal?: boolean;
  isNegative?: boolean;
}

export interface DualTrackPnlStatement {
  fiscalYear: string;
  totalVolumeUnits: number;
  b2cUnits: number;
  b2bUnits: number;
  grossCommercialTurnoverUsd: number;
  netCommercialRevenueUsd: number;
  grossProfitUsd: number;
  ebitdaUsd: number;
  ebitdaMarginPct: number;
  taxProvisionUsd: number;
  retainedNetProfitUsd: number;
  blendedNetMarginPct: number;
  b2cLines: FinancialLineItem[];
  b2bLines: FinancialLineItem[];
}

export interface B2cUnitEconomics {
  skuTier: string;
  blendedRrpUsd: number;
  factoryFobDhakaUsd: number;
  landedSeaCostCifUsd: number;
  pickPackPlatformFeeUsd: number;
  paidAdCacTargetUsd: number;
  netUnitContributionUsd: number;
  contributionMarginPct: number;
  sharePct: number;
  targetUnits: number;
  channels: string;
  optimizationNote: string;
}

export interface B2bUnitEconomics {
  category: string;
  targetUnits: number;
  wholesalePriceUsd: number;
  bangladeshProductionCogsUsd: number;
  oceanFreightDrayageUsd: number;
  brandingScreenPrintUsd: number;
  grossUnitProfitUsd: number;
  grossMarginPct: number;
  targetClientSegment: string;
  buyerPersona: string;
  moqUnits: string;
}

export interface WorkingCapitalRunwayItem {
  category: string;
  amountUsd: number;
  amountGbp: number;
  purpose: string;
  timing: string;
}

export interface QuarterlyBatchPlan {
  batchNumber: number;
  name: string;
  months: string;
  totalUnits: number;
  bloomUnits: number;
  midLevelUnits: number;
  commuterUnits: number;
  economyUnits: number;
  fundingMechanism: string;
  logisticsAllocation: string;
  reorderTriggerDay: number;
  leadTimeDays: string;
  status: 'COMPLETED' | 'IN_PRODUCTION' | 'SCHEDULED';
}

// -------------------------------------------------------------
// Phase 7: Multi-Location Global Inventory & Fulfillment
// -------------------------------------------------------------

export type WarehouseType = 
  | 'CENTRAL_TRANSIT' 
  | 'PORT_BUFFER'
  | 'ON_WATER_VESSEL' 
  | 'REGIONAL_3PL' 
  | 'AMAZON_FBA' 
  | 'RETAIL_SHOWROOM';

export type InventoryHealthStatus = 
  | 'OPTIMAL' 
  | 'LOW_STOCK' 
  | 'CRITICAL_REORDER' 
  | 'OVERSTOCKED' 
  | 'IN_TRANSIT';

export interface WarehouseLocation {
  id: string;
  code: string;
  name: string;
  type: WarehouseType;
  country: string;
  countryCode: string;
  city: string;
  flag: string;
  capacityCbm: number;
  currentUtilizationPct: number;
  operator: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  climateControlled: boolean;
  activeShipmentsInbound: number;
}

export interface StockAllocation {
  amazonFbaQty: number;
  shopifyD2cQty: number;
  b2bWholesaleReservedQty: number;
  showroomDisplayQty: number;
}

export interface BatchLotProvenance {
  batchNumber: string;
  productionDate: string;
  factoryCode: string;
  factoryName: string;
  cluster: string;
  rawMaterialLot: string; // e.g. Tannery Lot LWG-092, Nilphamari Jute Lot J-412
  qcInspectionCertificate: string; // e.g. QC-PASS-AMC-8921
  inspectorName: string;
  complianceRating: string; // e.g. LWG Gold, BSCI Grade A, GOTS Organic
}

export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  sector: ProductSector;
  category: string;
  warehouseId: string;
  warehouseCode: string;
  warehouseName: string;
  onHandQty: number;
  reservedQty: number;
  availableQty: number; // onHand - reserved
  inTransitQty: number; // en route via ship/air
  safetyStockMin: number;
  reorderPoint: number;
  unitCostUsd: number;
  totalValuationUsd: number;
  dailyRunRate: number; // pieces sold per day
  daysOfInventoryRemaining: number; // availableQty / dailyRunRate
  healthStatus: InventoryHealthStatus;
  allocations: StockAllocation;
  provenance: BatchLotProvenance;
  lastPhysicalAuditDate: string;
}

export interface StockTransferOrder {
  id: string;
  transferOrderNumber: string;
  sku: string;
  productName: string;
  sourceWarehouseCode: string;
  destinationWarehouseCode: string;
  unitsToTransfer: number;
  channelDestination: 'AMAZON_FBA' | 'SHOPIFY_D2C' | 'B2B_WHOLESALE' | 'SHOWROOM';
  modeOfTransport: 'OCEAN_FREIGHT' | 'AIR_CARGO' | 'DOMESTIC_DRAYAGE';
  carrier: string;
  trackingOrContainerNumber: string;
  departureDate: string;
  estimatedArrivalDate: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'ARRIVED_3PL' | 'FULFILLED';
  notes: string;
}
