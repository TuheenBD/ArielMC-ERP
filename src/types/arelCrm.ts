/**
 * AREL-CRM Comprehensive Enterprise Data Architecture
 * Entity: Ariel Renewable Energy Limited (ArielMC Enterprise Eco-System)
 * Version: 2026.1
 */

export type IndustrySector =
  | 'RMG / Apparel'
  | 'Textiles & Dyeing'
  | 'Steel & Heavy Engineering'
  | 'Ceramics & Sanitaryware'
  | 'Ceramics & Tableware'
  | 'Leather & Tannery'
  | 'Leather & Footwear'
  | 'Agro & Food Processing'
  | 'Pharmaceuticals'
  | 'Jute & Natural Fiber'
  | 'Jute Mills'
  | 'Heavy Packaging'
  | 'Commercial & Corporate'
  | 'Other, Pls mention'
  | (string & {});

export type LeadStage =
  | 'discovery'              // Step 1: Initial Discovery / Roof Inquiry
  | 'audit_scheduled'       // Step 1: 3D LiDAR Drone Survey Scheduled
  | 'feasibility_prepared'  // Step 2: Bankable Feasibility Dossier (AREL-BNK-2026-FEAS-V1) Ready
  | 'bank_sfd_review'       // Step 3: Bank Sustainable Finance Desk / IDCOL Appraisal
  | 'contract_awarded'      // Step 4: 80% Loan Sanctioned & EPC Executed
  | 'procurement'           // SCM: Hardware Import LC via Client ERQ
  | 'construction'          // Civil & Electrical Mounting on Factory Roof
  | 'sreda_cod_active'      // Commissioned: Utility Net-Meter Active (Tk 10.50 Buyback Locked)
  | 'lost';

export type UtilityProvider = 'BREB' | 'BPDB' | 'DESCO' | 'DPDC' | 'WZPDCL' | 'NESCO';

export type RoofSubstrate =
  | 'Standing Seam Metal'
  | 'Corrugated Trapezoidal Tin'
  | 'RCC Flat Concrete Slab'
  | 'Pre-Engineered PEB Shed'
  | 'Curved Arch Metal';

/* -------------------------------------------------------------------------- */
/* 1. LEAD CONTROL & CUSTOMER REPOSITORY                                      */
/* -------------------------------------------------------------------------- */
export interface ArelLead {
  id: string;
  leadCode: string; // e.g. AREL-LD-2026-081
  factoryName: string;
  parentGroup?: string;
  industrySector: IndustrySector;
  location: string;
  corridor: 'Dhaka / Gazipur / Savar' | 'Chattogram / Narayanganj' | 'Mymensingh / Valuka' | 'Cumilla / Feni' | 'Other Industrial Belt';
  
  // Decision-Maker Contacts
  primaryContact: {
    name: string;
    designation: 'Managing Director' | 'Director' | 'Chief Financial Officer' | 'Chief Operating Officer' | 'General Manager Maintenance';
    phone: string;
    email: string;
    whatsapp?: string;
  };

  // Technical & Facility Geometry
  roofAreaSqFt: number;
  roofSubstrate: RoofSubstrate;
  sanctionedLoadKva: number; // For 70% rule check
  proposedCapacityKwp: number;
  isWithin70PercentCap: boolean; // Auto-validated
  utilityProvider: UtilityProvider;
  monthlyElectricityBillBdt: number;

  // Commercials & Margin (Strictly 25.0%)
  turnkeyRatePerWpBdt: number; // e.g. 51.60
  totalProjectCapexBdt: number;
  concessionaryDebt80Bdt: number;
  clientEquity20Bdt: number;
  firstYearAnnualSavingsBdt: number;

  stage: LeadStage;
  priority: 'High' | 'Medium' | 'Critical (SREDA Cutoff)';
  createdAt: string;
  updatedAt: string;
  assignedEngineer: string;
  notes: string[];
}

/* -------------------------------------------------------------------------- */
/* 2. BANK SUSTAINABLE FINANCE DESK (SFD) & 4.5% LOAN PIPELINE                */
/* -------------------------------------------------------------------------- */
export type BankPfi =
  | 'BRAC Bank PLC'
  | 'City Bank PLC'
  | 'Eastern Bank (EBL)'
  | 'Prime Bank PLC'
  | 'Bank Asia PLC'
  | 'Mutual Trust Bank'
  | 'IDCOL';

export type BankLoanStatus =
  | 'dossier_submitted'
  | 'lenders_engineer_audit'
  | 'credit_committee_review'
  | 'sanction_letter_issued'
  | 'milestone_disbursement_active'
  | 'fully_amortized';

export interface BankLoanApplication {
  id: string;
  applicationCode: string;
  leadId: string;
  factoryName: string;
  targetPfi: BankPfi;
  sfdDeskOfficerName: string;
  sfdDeskOfficerContact: string;
  loanFacilityAmountBdt: number; // 80% CapEx
  clientEquityAmountBdt: number;  // 20%
  fixedInterestRatePct: number;  // 4.5%
  tenureMonths: number;          // 84 (7 Years)
  moratoriumGraceMonths: number; // 12 (1 Year)
  dscrProjected: number;         // e.g. 1.52x
  dossierRef: string;            // AREL-BNK-2026-FEAS-V1
  status: BankLoanStatus;
  sanctionDate?: string;
  disbursedAmountBdt: number;
  nextDisbursementMilestone?: string;
}

/* -------------------------------------------------------------------------- */
/* 3. SUBCONTRACTORS & IEB ENGINEERING BODIES                                 */
/* -------------------------------------------------------------------------- */
export type SubcontractorCategory =
  | 'IEB Structural Engineering Firm'
  | 'Civil & Mechanical Mounting Contractor'
  | 'Electrical HT/LT Substation EPC'
  | 'Drone & 3D LiDAR Roof Audit Team'
  | 'Third-Party Testing Lab (BUET/BSTI)';

export interface SubcontractorEntity {
  id: string;
  companyName: string;
  category: SubcontractorCategory;
  licenseOrIebRegNo: string;
  chiefEngineer: string;
  phone: string;
  email: string;
  operatingCorridors: string[];
  safetyCertification: 'Accord/RSC Compliant' | 'OSHA 30 Certified' | 'Standard Civil';
  completedMwpCapacity: number;
  ratingScore: number; // 1.0 to 5.0
  standardUnitRateBdt: string; // e.g. "Tk 2.40 / Wp" or "Tk 45,000 / Site"
  activeProjects: string[];
}

/* -------------------------------------------------------------------------- */
/* 4. PRODUCTS & BILL OF MATERIALS (BOM) PACKAGES                             */
/* -------------------------------------------------------------------------- */
export type ProductCategory =
  | 'PV_MODULE'
  | 'GRID_INVERTER'
  | 'BESS_LITHIUM_BATTERY'
  | 'MOUNTING_ALUMINUM_RAIL'
  | 'DC_AC_SOLAR_CABLE'
  | 'SWITCHGEAR_ACDB_DCDB'
  | 'LIGHTNING_EARTHING_LPS'
  | 'NET_METER_SMART';

export interface SolarProductMaster {
  id: string;
  sku: string;
  category: ProductCategory;
  brand: string;
  modelNumber: string;
  nominalRating: string; // e.g. "580Wp", "100 kW", "215 kWh"
  efficiencyPct: number;
  warrantyYearsProduct: number;
  warrantyYearsPerformance: number;
  testCertifications: string[]; // e.g. ['BDS IEC 61215', 'BDS IEC 61730', 'BDS IEC 62109']
  hsCode: string; // e.g. 8541.43.00
  customsTaxPct: string; // 1.0% under SRO 159/338
  unitCostUsd: number;
  unitCostBdt: number;
  publishedSellingPriceBdt: number; // 25% margin
  damImagePath: string;
  inStockQuantity: number;
  unitOfMeasure: 'PCS' | 'SET' | 'METER' | 'KG';
}

export interface BomPackage {
  id: string;
  packageCode: string; // e.g. AREL-PKG-500K-TOPCON
  packageName: string;
  ratedCapacityKwp: number;
  primaryModuleSku: string;
  primaryInverterSku: string;
  totalTurnkeyCostBdt: number;
  turnkeySellingPriceBdt: number; // 25% Gross Margin
  grossMarginPct: number; // Exactly 25.0%
  expectedAnnualYieldKwh: number;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
    unitCostBdt: number;
    totalCostBdt: number;
  }[];
}

/* -------------------------------------------------------------------------- */
/* 5. INVENTORY & LOT TRACKING (ORDER TO ROOF INSTALLATION)                   */
/* -------------------------------------------------------------------------- */
export type InventoryLotStatus =
  | 'order_placed_oem'
  | 'high_seas_in_transit'
  | 'chittagong_port_cfs'
  | 'central_warehouse_tongi'
  | 'in_transit_to_factory'
  | 'staged_at_roof'
  | 'installed_and_commissioned'
  | 'damaged_or_rma';

export interface InventoryLot {
  id: string;
  lotNumber: string; // e.g. LOT-2026-LONGI-042
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  serialNumberStart?: string;
  serialNumberEnd?: string;
  currentLocation: string;
  status: InventoryLotStatus;
  assignedProjectLeadId?: string;
  assignedFactoryName?: string;
  containerNumber?: string;
  customsBoeNumber?: string;
  arrivalDate?: string;
  inspectedBy?: string;
}

/* -------------------------------------------------------------------------- */
/* 6. SUPPLIERS & SOURCING VAULT                                              */
/* -------------------------------------------------------------------------- */
export type SupplierTier = 'TIER1_GLOBAL_OEM' | 'TIER1_NATIONAL_DISTRIBUTOR' | 'LOCAL_GRADE_A_MANUFACTURER';

export interface SolarSupplier {
  id: string;
  supplierCode: string;
  companyName: string;
  countryOfOrigin: 'China' | 'Bangladesh' | 'Germany' | 'Japan';
  tierClassification: SupplierTier;
  componentFocus: ProductCategory[];
  brandNames: string[];
  mouAgreementRef: string;
  leadTimeDaysToChittagong: number; // e.g. 25 days
  paymentTerms: string; // e.g. "100% LC at Sight via Client ERQ USD"
  keyContactPerson: string;
  email: string;
  phone: string;
  wechatId?: string;
  factoryAuditVerified: boolean;
  activeOrdersCount: number;
}

/* -------------------------------------------------------------------------- */
/* 7. LOGISTICS, PORTS & SCM CUSTOMS CONTROL (ASYCUDA BOX 44 & ERQ)           */
/* -------------------------------------------------------------------------- */
export type CustomsClearanceStatus =
  | 'awaiting_port_arrival'
  | 'berthing_chittagong'
  | 'box44_sreda_noc_verified'
  | 'customs_duty_1pct_assessed'
  | 'port_gate_out_cleared'
  | 'delivered_central_hub';

export interface ShipmentConsignment {
  id: string;
  shipmentCode: string;
  projectLeadId: string;
  factoryName: string;
  lcNumber: string;
  erqAccountUtilized: boolean; // 2%-3% forex savings
  shippingLine: string;
  vesselName: string;
  billOfLadingNo: string;
  portOfLoading: string;
  portOfDischarge: 'Chittagong Port (CGP)' | 'Mongla Port (MGL)';
  etdDate: string;
  etaPortDate: string;
  cfAgentName: string;
  cfAgentContact: string;
  sredaNocNumber: string;
  sredaNocDate: string;
  customsBoeNumber: string; // ASYCUDA World Bill of Entry
  hsCode: string;
  customsDutyPaidBdt: number; // 1% AIT
  clearanceStatus: CustomsClearanceStatus;
}

/* -------------------------------------------------------------------------- */
/* 8. TRI-PARTY AFTER-SALES SERVICE & SLA TICKETING                           */
/* -------------------------------------------------------------------------- */
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical_power_loss';
export type TicketStatus = 'open' | 'subcontractor_dispatched' | 'oem_rma_in_progress' | 'resolved' | 'closed';

export interface AfterSalesTicket {
  id: string;
  ticketNumber: string; // e.g. AREL-TKT-2026-104
  projectLeadId: string;
  factoryName: string;
  ticketCategory:
    | 'Routine Bi-Weekly High-Pressure Panel Wash'
    | 'Inverter String Trip / Grid Synchronization Error'
    | 'Performance Ratio Drop (<75% PR Alert)'
    | 'Module Hotspot / Glass Defect (OEM RMA)'
    | 'Annual Statutory SREDA & IEB Electrical Audit';
  priority: TicketPriority;
  status: TicketStatus;
  
  // Tri-Party Stakeholders
  clientContact: {
    name: string;
    phone: string;
    designation: string;
  };
  assignedSubcontractor: {
    companyName: string;
    leadTechnician: string;
    technicianPhone: string;
  };
  supplierRmaDetails?: {
    oemBrand: string;
    rmaTrackingNumber: string;
    replacementPartStatus: 'Diagnosed' | 'Dispatched from Hub' | 'Installed';
  };

  reportedAt: string;
  targetResolutionDate: string;
  resolvedAt?: string;
  rootCauseAnalysis?: string;
  telemetryAlertTriggered?: boolean;
  performanceRatioDropPct?: number;
  actionTakenNotes: string[];
}

/* -------------------------------------------------------------------------- */
/* 9. PROJECT-WISE FINANCIAL CONTROL (LEDGER, P&L, 25% MARGIN AUDIT)          */
/* -------------------------------------------------------------------------- */
export interface MilestoneBillingItem {
  id: string;
  milestoneTitle: string; // e.g. "Milestone 1: 20% Contract Signing Advance"
  percentage: number;     // e.g. 20
  amountBdt: number;
  status: 'pending' | 'invoice_issued' | 'paid_in_bank';
  dueDate: string;
  paidDate?: string;
}

export interface ProjectCostItem {
  id: string;
  category: 'HARDWARE_MODULES' | 'HARDWARE_INVERTERS' | 'MOUNTING_STRUCTURE' | 'ELECTRICAL_BOS' | 'CIVIL_LABOR' | 'ELECTRICAL_LABOR' | 'CUSTOMS_AND_PORT' | 'SREDA_PERMITS_IEB';
  description: string;
  vendorName: string;
  budgetedAmountBdt: number;
  actualSpentAmountBdt: number;
  status: 'budgeted' | 'approved' | 'paid';
}

export interface ProjectFinancialAccount {
  id: string;
  projectId: string; // Matches Lead ID
  projectName: string;
  capacityKwp: number;

  // Turnkey Revenue & Statutory Margin
  turnkeyContractPriceBdt: number;
  actualTotalCostBdt: number;
  budgetedTotalCostBdt: number;
  grossProfitBdt: number;
  realizedGrossMarginPct: number; // Must strictly audit against 25.0%

  // Milestone Billing Cashflow
  milestones: MilestoneBillingItem[];
  totalCollectedBdt: number;
  totalOutstandingBdt: number;

  // 5% Defect Liability Period (DLP) Retention
  retention5PercentBdt: number;
  retentionMaturityDate: string;
  retentionReleased: boolean;

  // SREDA Cash Incentive Surplus Yield
  annualSurplusCashExportBdt: number; // Tk 10.50/kWh yield

  // Direct Cost Expense Ledger
  costLedger: ProjectCostItem[];

  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/* 10. CROSS-PLATFORM SYNCHRONIZATION BUS                                     */
/* -------------------------------------------------------------------------- */
export interface PlatformSyncStatus {
  lastSyncTimestamp: string;
  websiteInboundConnected: boolean;  // arielenergybd.com webhooks
  saasTelemetryBridgeConnected: boolean; // energy.arielmc.com IoT telemetry
  erpGeneralLedgerConnected: boolean; // erp.arielmc.com accounting sync
  masterCrmRollupConnected: boolean; // crm.arielmc.com executive rollups
  syncHealth: 'HEALTHY' | 'DEGRADED' | 'DISCONNECTED';
}

