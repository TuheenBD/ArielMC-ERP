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
