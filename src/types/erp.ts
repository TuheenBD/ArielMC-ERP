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

export interface SampleDevelopmentOrder {
  id: string; // SDO-2026-LTH-001
  sdoNumber: string;
  sector: ProductSector;
  styleName: string;
  styleCode: string;
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


