export interface TechPackBomItem {
  id: string;
  component: string;
  materialAndConstruction: string;
  specificationOrGrade: string;
  colorwayOptions: string;
}

export interface TechPackMeasurementItem {
  id: string;
  measurementPoint: string;
  specInches: string;
  specMetric: string;
  tolerance: string;
  productionPurpose: string;
}

export interface TechPackBrandingDirectives {
  frontClaspDie?: string;
  exteriorBrandTag?: string;
  leatherTag?: string;
  leatherTagOrClochette?: string;
  interiorBrandPlate?: string;
  interiorComplianceLabel?: string;
  packagingDirectives?: string;
  [key: string]: string | undefined;
}

export interface TechPackQcClearance {
  id: string;
  testName: string;
  standardOrRequirement: string;
  passCriteria: string;
}

export interface StandardFactoryTechPack {
  id: string;
  documentRef: string; // e.g., 'TP-AMC-JCT-1612' or 'TP-AMC-BLM-1612'
  companyHeader: string; // 'ARIEL MARKETING & COMMUNICATIONS LTD — SAMPLING TECH-PACK'
  productName: string;
  styleCode?: string;
  targetDeviceOrFit?: string; // 'Up to 15.6" Laptop / 16" MacBook Pro'
  originHub: string; // 'Dhaka / Narayanganj Textile & Jute Cluster'
  referencePictures: string[];
  referencePictureCaptions?: string[];
  billOfMaterials: TechPackBomItem[];
  measurementSpecs: TechPackMeasurementItem[];
  constructionDetails: string[];
  brandingDirectives: TechPackBrandingDirectives;
  qualityControlClearances: TechPackQcClearance[];
  version: string; // 'v1.0'
  issueDate: string;
  preparedBy: string;
  factoryName?: string;
  factoryLocation?: string;
  status: 'DRAFT' | 'READY_FOR_FACTORY' | 'FACTORY_ACKNOWLEDGED' | 'SAMPLE_FABRICATION' | 'APPROVED_FOR_BULK';
}
