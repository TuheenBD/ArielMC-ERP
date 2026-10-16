export type EntityCode = 'ARIEL_BD' | 'ARIEL_UK' | 'ARIEL_US' | 'ARIEL_EU' | 'ARIEL_AU';

export type CurrencyCode = 'BDT' | 'GBP' | 'USD' | 'EUR' | 'AUD';

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
  bankAccounts: {
    bankName: string;
    accountNumberMask: string;
    currency: CurrencyCode;
    type: string;
  }[];
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

export type ProductSector = 'LEATHER' | 'JUTE' | 'TEXTILE' | 'CERAMICS';

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

export type SectorAttributes = 
  | { sector: 'LEATHER'; data: LeatherAttributes }
  | { sector: 'JUTE'; data: JuteAttributes }
  | { sector: 'TEXTILE'; data: TextileAttributes }
  | { sector: 'CERAMICS'; data: CeramicAttributes };

export interface ProductItem {
  id: string;
  sku: string;
  eanBarcode?: string; // GS1 GTIN-13 (053 Country Prefix for Bangladesh)
  styleCode?: string; // JCT, BLM, LT2, LT3
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
  };
  associatedSkus: string[];
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
