import { ProductSector, VendorClassification } from './erp';

export interface FactoryMachineryUnit {
  machineName: string;
  originCountry: string; // e.g. Germany, Italy, Japan
  quantity: number;
  purpose: string; // e.g. "Heavy Duty Lockstitch", "CNC Automated Leather Die Cutting"
}

export interface FactoryProductionCapacity {
  monthlyCapacityUnits: number;
  allocatedCapacityUnits: number;
  arielMcReservedCapacityUnits: number;
  utilizationRatePct: number;
  activeLinesCount: number;
  totalWorkforce: number;
  shiftStructure: 'Single Shift' | 'Double Shift (8h x 2)' | 'Flexible Overtime';
  machinery: FactoryMachineryUnit[];
}

export interface FactoryComplianceAudit {
  id: string;
  standardName: string; // e.g. "Leather Working Group (LWG)", "BSCI Social Audit", "Sedex SMETA 4-Pillar", "Accord / RSC Structural & Fire Safety", "Higg FEM/FSLM"
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'AUDIT_SCHEDULED';
  ratingGrade: string; // e.g. "Gold Rated Tannery", "Grade A (Outstanding)", "Zero Non-Conformance"
  auditBody: string; // e.g. "Eurofins", "SGS Bangladesh", "TÜV Rheinland", "Intertek"
  auditDate: string;
  validUntil: string;
  reportNumber: string;
  certificatePdfUrl?: string;
}

export interface FactorySubSupplier {
  id: string;
  materialType: string; // e.g. "Raw Bovine Wet-Blue Hides", "GOTS Organic Yarn", "Nickel-Free Antique Brass Hardware", "Corrugated Cartons"
  supplierName: string;
  locationCluster: string; // e.g. "Savar Tannery Park", "Narayanganj Spinning Mill", "Gazipur Accessories Hub"
  complianceTier: 'Certified Tier 1' | 'Approved Primary' | 'Secondary Open Market';
  traceabilityVerified: boolean;
}

export interface FactoryFinancialProfile {
  bankName: string;
  branchName: string;
  routingNumber: string;
  swiftBic?: string;
  backToBackLcAccepted: boolean;
  preferredLcTenorDays: number; // e.g. 60 or 90 days
  nbrBinNumber: string;
  tinNumber: string;
  epbRegistrationNo: string;
  totalSpendYtdBdt: number;
  totalSpendYtdUsd: number;
  outstandingPayablesBdt: number;
  creditTerms: string; // e.g. "30% Advance, 70% Upon Final Random Inspection (FRI) Pass"
  paymentPunctualityScorePct: number; // e.g. 98.7%
}

export interface FactoryQualityScorecard {
  aqlPassRatePct: number; // e.g. 99.1%
  onTimeDeliveryRatePct: number; // e.g. 98.4%
  averageDefectRatePct: number; // e.g. 0.8%
  sampleApprovalTurnaroundDays: number; // e.g. 4.5 days
  overallRatingScore: number; // e.g. 4.9 / 5.0
}


// Active Sourced Products & Published Catalog SKUs
export interface SupplierActiveProduct {
  id: string;
  sku: string; // e.g. "JD-MLD-26-HPD"
  productName: string; // e.g. "ArielMC Hand-Painted Botanical Oval Jute Doormat"
  category: string; // e.g. "Jute"
  divisionTitle?: string; // e.g. "02 The Golden Fiber Edit"
  imageUrl?: string;
  specifications?: string; // e.g. "20" x 30" (508 x 762 mm), 10mm profile, 1.45 kg"
  
  // Pricing & Commercial Spread
  factoryPurchasePriceBdt: number; // e.g. 744 BDT
  factoryPurchasePriceUsd: number; // e.g. $6.20 USD
  publishedExportFobUsd: number; // e.g. $9.50 USD
  marginUsd: number; // e.g. $3.30 USD
  marginPct: number; // e.g. 34.7%
  
  // Lifetime Production History
  totalUnitsProduced: number; // e.g. 1,800 units
  totalSpendBdt: number; // e.g. 1,339,200 BDT
  totalSpendUsd: number; // e.g. $11,160 USD
  firstBatchDate?: string;
  lastBatchDate?: string;
  
  // Live Pipeline / Active Purchase Order
  activePoNumber?: string; // e.g. "PO-AMC-2026-038"
  pipelineUnits?: number; // e.g. 400 pcs
  pipelineStatus?: 'IN_CUTTING' | 'IN_BRAIDING' | 'IN_STENCIL_PAINTING' | 'IN_PACKING' | 'READY_FOR_INSPECTION' | 'COMPLETED';
  targetDispatchDate?: string;
}

// Factory Product Catalog & Future Potential Products (What else they produce)
export interface SupplierPotentialProduct {
  id: string;
  factoryItemCode: string; // e.g. "BEN-RN-01"
  name: string; // e.g. "Hand-Braided Oval Botanical Table Runner"
  category: string; // e.g. "Home Living & Kitchen"
  imageUrl?: string;
  material: string; // e.g. "100% Biodegradable Natural Bengal Golden Jute"
  specifications: string; // e.g. "14" x 48" (35 x 122 cm), 6mm thickness"
  factoryOfferedPriceBdt: number; // e.g. 540 BDT
  factoryOfferedPriceUsd: number; // e.g. $4.50 USD
  projectedExportFobUsd: number; // e.g. $7.90 USD
  projectedMarginPct: number; // e.g. 43.0%
  factoryMoq: number; // e.g. 200 pcs
  sampleStatus: 'OFF_SHELF_AVAILABLE' | 'COUNTER_SAMPLE_APPROVED' | 'DEVELOPMENT_REQUIRED' | 'PRICE_UNDER_NEGOTIATION';
  evaluationVerdict: 'HIGHLY_RECOMMENDED' | 'PRICE_TOO_HIGH' | 'SEASONAL_HOLIDAY' | 'FUTURE_RESEARCH';
  merchandiserNotes: string;
}

// Detailed Factory Plant & Head Office Locations
export interface SupplierLocationProfile {
  headOfficeAddress: string;
  factoryPlantAddress: string;
  showroomAddress?: string;
  industrialCluster: string;
  googleMapsUrl?: string;
  gpsCoordinates?: string;
  totalFloorAreaSqFt?: number;
}

export interface FactorySupplierPortfolio {
  id: string;
  factoryCode: string;
  factoryName: string;
  vendorClassification: VendorClassification; // 'FULL_FLEDGED_FACTORY' | 'FACTORY' | 'SUPPLIER'
  sectors: ProductSector[];
  clusterRegion: string; // e.g. "Hemayetpur Tannery Estate, Savar, Dhaka"
  factoryAddress: string;
  establishedYear: number;
  keyManagementContacts: {
    name: string;
    designation: string;
    phone: string;
    email: string;
  }[];
  digitalChannels: {
    website?: string;
    linkedIn?: string;
    facebook?: string;
  };
  tier: 'TIER_1_PREFERRED' | 'TIER_2_QUALIFIED' | 'TIER_3_PROBATIONARY' | 'TIER_2_APPROVED' | 'STRATEGIC_BACKUP';
  lastUpdated: string;

  // 5 Core Pillars:
  capacityAndMachinery: FactoryProductionCapacity;        // Pillar 1: Production Capabilities
  complianceAudits: FactoryComplianceAudit[];             // Pillar 2: Social & Environmental Compliance
  subSupplierNetwork: FactorySubSupplier[];               // Pillar 3: Raw Material & Traceability
  financialAndBanking: FactoryFinancialProfile;           // Pillar 4: Back-to-Back L/C & Spend
  qualityScorecard: FactoryQualityScorecard;             // Pillar 5: Quality & Performance

  // Operational Notes
  operationalNotes: string;

  // Comprehensive Sourcing Pillars:
  activeProducts?: SupplierActiveProduct[];          // Pillar 1: Active SKUs, Purchase vs Published, Units & BDT Spend, Pipeline
  potentialProducts?: SupplierPotentialProduct[];   // Pillar 2: Factory Catalog & Future Products with specifications & pricing
  locationProfile?: SupplierLocationProfile;        // Factory Plant, Head Office & Showroom details
}
