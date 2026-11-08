export type LeadStage =
  | 'inbound'
  | 'satellite_audit'
  | 'site_audit_scheduled'
  | 'proposal_submitted'
  | 'bank_financing'
  | 'contract_executed'
  | 'sreda_connected';

export type UtilityProvider = 'BREB' | 'BPDB' | 'DESCO' | 'DPDC' | 'WZPDCL' | 'NESCO';

export type RoofSubstrate =
  | 'Corrugated Metal PEB Shed'
  | 'Standing Seam Metal'
  | 'RCC Concrete Slab'
  | 'Pre-Engineered Steel Truss'
  | 'Curved Arch Metal';

export interface SolarLead {
  id: string;
  factoryName: string;
  parentGroup?: string;
  industrySector: 'RMG / Apparel' | 'Textiles & Dyeing' | 'Leather & Footwear' | 'Ceramics & Tableware' | 'Jute Mills' | 'Heavy Packaging';
  location: string;
  corridor: 'Dhaka / Gazipur / Savar' | 'Chattogram / Narayanganj' | 'Mymensingh / Valuka' | 'Other Industrial Belt';
  contactPerson: string;
  designation: string;
  phone: string;
  email: string;
  
  // Commercial Parameters
  roofAreaSqFt: number;
  monthlyBillBdt: number;
  estimatedCapacityKwp: number;
  projectValueBdt: number;
  stage: LeadStage;
  priority: 'High' | 'Medium' | 'Critical (SREDA Cutoff)';
  createdAt: string;
  updatedAt: string;
  notes: string[];

  // Technical Control Parameters
  technical: {
    roofSubstrate: RoofSubstrate;
    roofCondition: 'Excellent' | 'Good - Requires minor repair' | 'Structural reinforcement required';
    azimuthDeg: number;
    tiltAngleDeg: number;
    shadingLossPct: number;
    structuralLoadKgM2: number;
    accordRscWalkwaysCompliant: boolean;
    
    // Substation & Grid Sync
    sanctionedLoadKw: number;
    supplyVoltage: '11 kV' | '33 kV' | '415 V (LT)' | '66 kV';
    utilityProvider: UtilityProvider;
    transformerCapacityKva: number;
    availableBreakerBay: boolean;
    earthingResistanceOhm: number;

    // Bill of Materials (BOM) Specs
    moduleBrand: 'JinkoSolar Tiger Neo' | 'LONGi Hi-MO X6' | 'Trina Vertex N' | 'JA Solar DeepBlue';
    moduleWattageW: number;
    moduleCount: number;
    inverterBrand: 'Huawei SUN2000' | 'Sungrow SG125HX' | 'Growatt MAX' | 'Solis 110K';
    inverterCapacityKw: number;
    inverterCount: number;
    dcAcRatio: number;
    performanceRatioPct: number;
    annualYieldMwh: number;

    // SREDA & Net-Metering Regulatory Milestones
    sredaApplicationStatus: 'Not Started' | 'Submitted to SREDA' | 'Utility Inspection Completed' | 'Bi-Directional Meter Calibrated' | 'COD Commissioned (Tk 10.50 Locked)';
    sredaApplicationDate?: string;
    targetCodDate: string; // Target Commercial Operation Date before Feb 28, 2027
    netMeteringTariffBdt: number; // 10.50
  };
}

