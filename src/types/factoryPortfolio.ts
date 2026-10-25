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
}
